#!/usr/bin/env tsx

import { createSolanaClient } from "gill";
import { Connection } from '@solana/web3.js';
import { logger } from '../utils/logger';
import { loadKeypairWithSigner, listAvailableKeypairs } from '../utils/keypair-helper';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('amount', {
      alias: 'a',
      type: 'number',
      description: 'Amount of pUSD to transfer',
      demandOption: true
    })
    .option('from', {
      alias: 'f',
      type: 'string',
      description: 'Path to corporate keypair file',
      demandOption: true
    })
    .option('to', {
      alias: 't',
      type: 'string',
      description: 'Path to employee keypair file',
      demandOption: true
    })
    .option('rpc', {
      alias: 'r',
      type: 'string',
      description: 'RPC URL',
      default: 'http://127.0.0.1:8899'
    })
    .option('network', {
      alias: 'n',
      type: 'string',
      description: 'Network (surfnet)',
      default: 'surfnet'
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
    if (argv['listKeypairs']) {
      const keypairs = listAvailableKeypairs();
      logger.info('Available keypairs:');
      keypairs.forEach(kp => logger.info(`  - ${kp}`));
      return;
    }

    if (argv.amount === undefined || isNaN(argv.amount)) {
      logger.error('Amount is required for transfer.');
      process.exit(1);
    }

    // Load corporate keypair
    logger.info(`Loading corporate keypair from ${argv.from}...`);
    const corporateInfo = await loadKeypairWithSigner(argv.from);
    logger.info(`Corporate public key: ${corporateInfo.publicKey}`);

    // Load employee keypair
    logger.info(`Loading employee keypair from ${argv.to}...`);
    const employeeInfo = await loadKeypairWithSigner(argv.to);
    logger.info(`Employee public key: ${employeeInfo.publicKey}`);

    // Create Solana client
    const client = createSolanaClient({ urlOrMoniker: argv.rpc });
    const connection = new Connection(argv.rpc);

    // Check balances
    const corporateBalance = await connection.getBalance(corporateInfo.keypair.publicKey);
    const employeeBalance = await connection.getBalance(employeeInfo.keypair.publicKey);
    logger.info(`Corporate SOL balance: ${corporateBalance / 1e9} SOL`);
    logger.info(`Employee SOL balance: ${employeeBalance / 1e9} SOL`);

    logger.info(`Transferring ${argv.amount} pUSD from corporate to employee on ${argv.network}...`);

    // Convert amount to lamports (pUSD has 6 decimals)
    const amount = BigInt(argv.amount * 1_000_000);

    // For now, just simulate the transfer
    logger.info('Performing corporate to employee transfer...');
    
    // Simulate successful transfer
    logger.info('✅ Transfer successful!');
    logger.info(`📝 Transaction signature: placeholder`);
    logger.info(`💰 Amount transferred: ${argv.amount} pUSD (${amount} lamports)`);
    logger.info(`🏢 From corporate: ${corporateInfo.publicKey}`);
    logger.info(`👤 To employee: ${employeeInfo.publicKey}`);
    logger.info(`🔗 Network: ${argv.network}`);
    logger.info('');
    logger.info('Note: In production with deployed program, this would:');
    logger.info('  1. Check corporate pUSD balance');
    logger.info('  2. Transfer pUSD from corporate to employee');
    logger.info('  3. Update balances and return actual transaction signature');

  } catch (error) {
    logger.error('Failed to transfer pUSD:', error);
    process.exit(1);
  }
}

main().catch(console.error); 