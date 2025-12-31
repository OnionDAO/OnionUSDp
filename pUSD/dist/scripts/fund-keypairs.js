#!/usr/bin/env tsx
import { createSolanaClient } from "gill";
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { logger } from '../utils/logger';
import { loadKeypairWithSigner, listAvailableKeypairs } from '../utils/keypair-helper';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('amount', {
        alias: 'a',
        type: 'number',
        description: 'Amount of SOL to fund each keypair',
        default: 0.1
    })
        .option('rpc', {
        alias: 'r',
        type: 'string',
        description: 'RPC URL',
        default: 'https://api.devnet.solana.com'
    })
        .option('keypair', {
        alias: 'k',
        type: 'string',
        description: 'Specific keypair to fund (optional)',
        default: ''
    })
        .help()
        .argv;
    try {
        logger.info('💰 Funding Keypairs with SOL');
        logger.info('==============================');
        // Initialize Solana client
        const client = createSolanaClient({ urlOrMoniker: argv.rpc });
        const connection = new Connection(argv.rpc);
        const amount = argv.amount * LAMPORTS_PER_SOL;
        logger.info(`Funding amount: ${argv.amount} SOL per keypair`);
        let keypairsToFund = [];
        if (argv.keypair) {
            // Fund specific keypair
            keypairsToFund = [argv.keypair];
            logger.info(`Funding specific keypair: ${argv.keypair}`);
        }
        else {
            // Fund all keypairs
            keypairsToFund = listAvailableKeypairs();
            logger.info(`Funding all ${keypairsToFund.length} keypairs`);
        }
        for (const keypairFile of keypairsToFund) {
            try {
                logger.info(`\nFunding ${keypairFile}...`);
                const keypairInfo = await loadKeypairWithSigner(`keypairs/${keypairFile}`);
                const publicKey = keypairInfo.keypair.publicKey;
                // Check current balance
                const currentBalance = await connection.getBalance(publicKey);
                logger.info(`  Current balance: ${currentBalance / LAMPORTS_PER_SOL} SOL`);
                if (currentBalance >= amount) {
                    logger.info(`  ✅ Already has sufficient balance`);
                    continue;
                }
                // Request airdrop
                logger.info(`  Requesting airdrop of ${argv.amount} SOL...`);
                const signature = await connection.requestAirdrop(publicKey, amount);
                // Wait for confirmation
                await connection.confirmTransaction(signature, 'confirmed');
                // Check new balance
                const newBalance = await connection.getBalance(publicKey);
                logger.info(`  ✅ Funded successfully! New balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
                logger.info(`  Transaction: ${signature}`);
            }
            catch (error) {
                logger.error(`  ❌ Failed to fund ${keypairFile}:`, error);
            }
        }
        logger.info('\n🎉 Keypair funding completed!');
    }
    catch (error) {
        logger.error('Failed to fund keypairs:', error);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=fund-keypairs.js.map