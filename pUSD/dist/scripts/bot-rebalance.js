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
            network: argv.network
        });
        logger.info(`Starting rebalance bot on ${argv.network}...`);
        logger.info(`Rebalance interval: ${argv.interval} minutes`);
        // Get current float ratio
        const floatRatio = await manager.getCurrentFloatRatio();
        logger.info(`Current float ratio: ${floatRatio.toFixed(2)}%`);
        // Get configuration
        const config = await manager.getConfig();
        if (!config) {
            logger.warn('Config not found (expected if not deployed). Running in demo mode...');
            logger.info('Demo mode: Simulating treasury rebalancing...');
            logger.info(`Current float ratio: ${floatRatio.toFixed(2)}%`);
            logger.info('Target range: 40-60%');
            logger.info('Treasury status: Healthy');
            logger.info('No rebalancing needed');
            logger.info('Next check in 5 minutes');
            logger.info('');
            logger.info('Note: In production with deployed program, this would:');
            logger.info('  1. Monitor actual treasury balances');
            logger.info('  2. Calculate real float ratios');
            logger.info('  3. Execute yield strategy adjustments');
            logger.info('  4. Send actual rebalancing transactions');
            return;
        }
        logger.info(`Float bounds: ${config.floatMinPct}% - ${config.floatMaxPct}%`);
        logger.info(`Current strategy: ${config.strategyId}`);
        // Check if rebalancing is needed
        if (floatRatio > config.floatMaxPct) {
            logger.info(`Float ratio (${floatRatio.toFixed(2)}%) exceeds max (${config.floatMaxPct}%). Investing surplus...`);
            const result = await manager.rebalance();
            if (result.success) {
                logger.info(`Rebalance successful: ${result.signature}`);
            }
            else {
                logger.error(`Rebalance failed: ${result.error}`);
            }
        }
        else if (floatRatio < config.floatMinPct) {
            logger.info(`Float ratio (${floatRatio.toFixed(2)}%) below min (${config.floatMinPct}%). Withdrawing deficit...`);
            const result = await manager.rebalance();
            if (result.success) {
                logger.info(`Rebalance successful: ${result.signature}`);
            }
            else {
                logger.error(`Rebalance failed: ${result.error}`);
            }
        }
        else {
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
                        const result = await manager.rebalance();
                        if (result.success) {
                            logger.info(`Periodic rebalance successful: ${result.signature}`);
                        }
                        else {
                            logger.error(`Periodic rebalance failed: ${result.error}`);
                        }
                    }
                }
                catch (error) {
                    logger.error('Periodic rebalance check failed:', error);
                }
            }, argv.interval * 60 * 1000);
        }
    }
    catch (error) {
        logger.error('Rebalance bot failed:', error);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=bot-rebalance.js.map