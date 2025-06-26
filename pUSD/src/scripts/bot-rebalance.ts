#!/usr/bin/env tsx

import { createSolanaClient } from "gill";
import { Connection } from '@solana/web3.js';
import { OnionUSDPManager } from '../lib/onionusdp';
import { logger } from '../utils/logger';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('rpc', {
      alias: 'r',
      type: 'string',
      description: 'RPC URL',
      default: 'https://api.devnet.solana.com'
    })
    .option('network', {
      alias: 'n',
      type: 'string',
      description: 'Network (devnet or mainnet-beta)',
      default: 'devnet'
    })
    .option('interval', {
      alias: 'i',
      type: 'number',
      description: 'Rebalance interval in minutes',
      default: 30
    })
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: 'Dry run mode (no actual transactions)',
      default: false
    })
    .help()
    .argv;

  try {
    // Create Solana client
    const client = createSolanaClient({ urlOrMoniker: argv.rpc });
    const connection = new Connection(argv.rpc);

    // Create OnionUSD-P manager
    const manager = new OnionUSDPManager(client, connection, {
      rpcUrl: argv.rpc,
      useToken2022: true,
      network: argv.network as 'devnet' | 'mainnet-beta'
    });

    logger.info(`Starting rebalance bot on ${argv.network}...`);
    logger.info(`Rebalance interval: ${argv.interval} minutes`);
    logger.info(`Dry run mode: ${argv.dryRun ? 'enabled' : 'disabled'}`);

    // Get current float ratio
    const floatRatio = await manager.getCurrentFloatRatio();
    logger.info(`Current float ratio: ${floatRatio.toFixed(2)}%`);

    // Get configuration
    const config = await manager.getConfig();
    if (!config) {
      logger.error('Config not found. Please initialize the system first.');
      process.exit(1);
    }

    logger.info(`Float bounds: ${config.floatMinPct}% - ${config.floatMaxPct}%`);
    logger.info(`Current strategy: ${config.strategyId}`);

    // Check if rebalancing is needed
    if (floatRatio > config.floatMaxPct) {
      logger.info(`Float ratio (${floatRatio.toFixed(2)}%) exceeds max (${config.floatMaxPct}%). Investing surplus...`);
      
      if (!argv.dryRun) {
        const result = await manager.rebalance();
        if (result.success) {
          logger.info(`Rebalance successful: ${result.signature}`);
        } else {
          logger.error(`Rebalance failed: ${result.error}`);
        }
      } else {
        logger.info('Dry run: Would invest surplus');
      }
    } else if (floatRatio < config.floatMinPct) {
      logger.info(`Float ratio (${floatRatio.toFixed(2)}%) below min (${config.floatMinPct}%). Withdrawing deficit...`);
      
      if (!argv.dryRun) {
        const result = await manager.rebalance();
        if (result.success) {
          logger.info(`Rebalance successful: ${result.signature}`);
        } else {
          logger.error(`Rebalance failed: ${result.error}`);
        }
      } else {
        logger.info('Dry run: Would withdraw deficit');
      }
    } else {
      logger.info(`Float ratio (${floatRatio.toFixed(2)}%) within bounds. No rebalancing needed.`);
    }

    // If running as a service, set up interval
    if (argv.interval > 0) {
      logger.info(`Setting up rebalance interval: ${argv.interval} minutes`);
      setInterval(async () => {
        try {
          const ratio = await manager.getCurrentFloatRatio();
          logger.info(`Periodic check - Float ratio: ${ratio.toFixed(2)}%`);
          
          if (ratio > config.floatMaxPct || ratio < config.floatMinPct) {
            logger.info('Triggering rebalance...');
            if (!argv.dryRun) {
              const result = await manager.rebalance();
              if (result.success) {
                logger.info(`Periodic rebalance successful: ${result.signature}`);
              } else {
                logger.error(`Periodic rebalance failed: ${result.error}`);
              }
            }
          }
        } catch (error) {
          logger.error('Periodic rebalance check failed:', error);
        }
      }, argv.interval * 60 * 1000);
    }

  } catch (error) {
    logger.error('Rebalance bot failed:', error);
    process.exit(1);
  }
}

main().catch(console.error); 