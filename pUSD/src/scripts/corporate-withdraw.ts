import { Connection, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { TreasuryService } from '../lib/treasury';
import * as fs from 'fs';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
  .option('amount', { type: 'number', demandOption: true, describe: 'Amount of pUSDC to withdraw' })
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .strict()
  .argv;

function loadKeypair(path: string): Keypair {
  const raw = fs.readFileSync(path, 'utf-8');
  const arr = JSON.parse(raw);
  return Keypair.fromSecretKey(new Uint8Array(arr));
}

async function main() {
  try {
    const endpoint = argv.network === 'mainnet'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
    const connection = new Connection(endpoint, 'confirmed');
    const userKeypair = loadKeypair(argv.user);
    const treasury = new TreasuryService(connection);
    await treasury.init();
    
    console.log('🏢 Corporate Withdrawal Transaction');
    console.log('User:', userKeypair.publicKey.toBase58());
    console.log('Amount:', argv.amount, 'pUSDC');
    console.log('Fee: 1% (', argv.amount * 0.01, 'USDC)');
    console.log('Net USDC received:', argv.amount * 0.99);
    console.log('Revokable period: 30 minutes');
    
    const { tx, signers, transactionId } = await treasury.buildCorporateWithdrawTx(userKeypair.publicKey, argv.amount);
    const signature = await sendAndConfirmTransaction(connection, tx, [userKeypair, ...signers]);
    
    console.log('✅ Corporate withdrawal successful!');
    console.log('Transaction signature:', signature);
    console.log('Transaction ID:', transactionId);
    console.log('⚠️  This transaction can be revoked within 30 minutes');
  } catch (err) {
    console.error('❌ Failed to process corporate withdrawal:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 