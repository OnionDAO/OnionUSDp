#!/usr/bin/env tsx

import { createSolanaClient } from "gill";
import { Connection } from '@solana/web3.js';
import { OnionUSDPManager } from '../lib/onionusdp';
import { logger } from '../utils/logger';
import { loadKeypairWithSigner, listAvailableKeypairs } from '../utils/keypair-helper';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('amount', {
      alias: 'a',
      type: 'number',
      description: 'Amount of USDC to deposit',
      demandOption: true
    })
    .option('payer', {
      alias: 'p',
      type: 'string',
      description: 'Path to payer keypair file',
      default: 'keypairs/payer.json'
    })
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
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: 'Dry run mode (no actual transactions)',
      default: false
    })
    .option('list-keypairs', {
      alias: 'l',
      type: 'boolean',
      description: 'List available keypairs',
      default: false
    })
    .help()
    .argv;

  try {
    if (argv.listKeypairs) {
      const keypairs = listAvailableKeypairs();
      logger.info('Available keypairs:');
      keypairs.forEach(kp => logger.info(`  - ${kp}`));
      return;
    }

    // Load payer keypair with signer
    logger.info(`Loading payer keypair from ${argv.payer}...`);
    const payerInfo = await loadKeypairWithSigner(argv.payer);
    
    logger.info(`Payer public key: ${payerInfo.publicKey}`);

    // Create Solana client
    const client = createSolanaClient({ urlOrMoniker: argv.rpc });
    const connection = new Connection(argv.rpc);

    // Create OnionUSD-P manager
    const manager = new OnionUSDPManager(client, connection, {
      rpcUrl: argv.rpc,
      useToken2022: true,
      network: argv.network as 'devnet' | 'mainnet-beta'
    });

    logger.info(`Depositing ${argv.amount} USDC on ${argv.network}...`);

    // Convert amount to lamports (USDC has 6 decimals)
    const amount = BigInt(argv.amount * 1_000_000);

    if (argv.dryRun) {
      logger.info(`Would deposit ${argv.amount} USDC and mint ${argv.amount} pUSD`);
      logger.info('Dry run mode: No transaction will be sent');
      return;
    }

    // Check payer balance
    const balance = await connection.getBalance(payerInfo.keypair.publicKey);
    logger.info(`Payer SOL balance: ${balance / 1e9} SOL`);

    // Initialize config if needed (optional - only if config doesn't exist)
    logger.info('Checking if config needs initialization...');
    const config = await manager.getConfig();
    if (!config) {
      logger.info('Config not found, initializing...');
      // For now, we'll use the same signer for both authority and delegated signer
      // In production, these would be different keypairs
      await manager.initializeConfig(payerInfo.signer!, payerInfo.signer!);
    } else {
      logger.info('Config already initialized');
    }

    // Perform the deposit
    logger.info('Performing USDC deposit...');
    const result = await manager.depositUSDC(payerInfo.signer!, amount);
    
    logger.info('Deposit successful!');
    logger.info(`Transaction signature: ${result}`);

  } catch (error) {
    logger.error('Failed to deposit USDC:', error);
    process.exit(1);
  }
}

main().catch(console.error); 