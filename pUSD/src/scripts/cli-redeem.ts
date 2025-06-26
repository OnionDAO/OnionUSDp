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
      description: 'Amount of pUSD to redeem',
      demandOption: true
    })
    .option('wallet', {
      alias: 'w',
      type: 'string',
      description: 'Path to wallet keypair file',
      demandOption: true
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

    // Load wallet keypair with signer
    logger.info(`Loading wallet keypair from ${argv.wallet}...`);
    const walletInfo = await loadKeypairWithSigner(argv.wallet);
    
    logger.info(`Employee wallet: ${walletInfo.publicKey}`);

    // Create Solana client
    const client = createSolanaClient({ urlOrMoniker: argv.rpc });
    const connection = new Connection(argv.rpc);

    // Create OnionUSD-P manager
    const manager = new OnionUSDPManager(client, connection, {
      rpcUrl: argv.rpc,
      useToken2022: true,
      network: argv.network as 'devnet' | 'mainnet-beta'
    });

    logger.info(`Redeeming ${argv.amount} pUSD for USDC on ${argv.network}...`);

    // Convert amount to lamports (pUSD has 6 decimals)
    const amount = BigInt(argv.amount * 1_000_000);

    if (argv.dryRun) {
      logger.info(`Would redeem ${argv.amount} pUSD for ${argv.amount} USDC`);
      logger.info('Dry run mode: No transaction will be sent');
      return;
    }

    // Check wallet balance
    const balance = await connection.getBalance(walletInfo.keypair.publicKey);
    logger.info(`Wallet SOL balance: ${balance / 1e9} SOL`);

    // Check redeem allow list (this would be done by the program)
    logger.info('Checking redeem allow list...');
    const redeemAllowPDA = manager.deriveRedeemAllowPDA(walletInfo.keypair.publicKey);
    const allowEntry = await manager.getRedeemAllowEntry(redeemAllowPDA);
    
    if (!allowEntry) {
      logger.warn('No redeem allow entry found - this would fail in production');
      logger.info('Note: Redeem allow list validation would happen in the program');
    } else {
      logger.info(`Redeem allow entry found: daily limit ${allowEntry.dailyLimit}, used ${allowEntry.dailyUsed}`);
    }

    // Perform the redeem
    logger.info('Performing pUSD redemption...');
    const result = await manager.redeemUSDC(walletInfo.signer!, amount);
    
    if (result.success) {
      logger.info('Redemption successful!');
      logger.info(`Transaction signature: ${result.signature}`);
    } else {
      logger.error('Redemption failed:', result.error);
      process.exit(1);
    }

  } catch (error) {
    logger.error('Failed to redeem pUSD:', error);
    process.exit(1);
  }
}

main().catch(console.error); 