import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { ReserveManager } from '../lib/reserves';
import * as fs from 'fs';
// @ts-ignore
import yargs from 'yargs';
// @ts-ignore
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('amount', { type: 'number', demandOption: true, describe: 'Amount of USDC to deposit' })
  .option('payer', { type: 'string', demandOption: true, describe: 'Path to payer keypair JSON' })
  .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
  .option('mint', { type: 'string', demandOption: true, describe: 'USDC mint address' })
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .strict()
  .argv as any;

function loadKeypair(path: string): Keypair {
  const raw = fs.readFileSync(path, 'utf-8');
  const arr = JSON.parse(raw);
  return Keypair.fromSecretKey(new Uint8Array(arr));
}

async function main() {
  const endpoint = argv.network === 'mainnet'
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com';
  const connection = new Connection(endpoint, 'confirmed');
  const payer = loadKeypair(argv.payer);
  const user = loadKeypair(argv.user);
  const mint = new PublicKey(argv.mint);
  const reserve = new ReserveManager(connection, payer);
  // Ensure reserve vault exists
  await reserve.initReserve(mint);
  // Deposit USDC
  const sig = await reserve.depositUSDC(BigInt(argv.amount), user, mint);
  console.log('Deposit signature:', sig);
}

if (require.main === module) {
  main();
} 