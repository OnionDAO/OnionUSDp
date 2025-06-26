import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TreasuryService, USDC_MINT, PUSDC_MINT } from '../lib/treasury';
import * as fs from 'fs';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
  .option('amount', { type: 'number', demandOption: true, describe: 'Amount of pUSDC to redeem' })
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .strict()
  .argv;

function loadKeypair(path: string): Keypair {
  const raw = fs.readFileSync(path, 'utf-8');
  const arr = JSON.parse(raw);
  return Keypair.fromSecretKey(new Uint8Array(arr));
}

async function printBalances(connection: Connection, user: PublicKey, treasury: TreasuryService) {
  try {
    await treasury.init();
  } catch (err) {
    console.error('Error during treasury.init():', err);
  }
  let userUSDCATA, userPUSDCATA, treasuryUSDC;
  let userUSDCBal: string = 'N/A', userPUSDCBal: string = 'N/A', treasuryUSDCBal: string = 'N/A';
  try {
    userUSDCATA = (await connection.getParsedTokenAccountsByOwner(user, { mint: USDC_MINT })).value[0]?.pubkey;
    if (userUSDCATA) {
      userUSDCBal = (await connection.getTokenAccountBalance(userUSDCATA)).value.uiAmountString || 'N/A';
    } else {
      userUSDCBal = 'Account not found';
    }
  } catch (err) {
    console.error('Error fetching user USDC balance:', err);
  }
  try {
    userPUSDCATA = (await connection.getParsedTokenAccountsByOwner(user, { mint: PUSDC_MINT })).value[0]?.pubkey;
    if (userPUSDCATA) {
      userPUSDCBal = (await connection.getTokenAccountBalance(userPUSDCATA)).value.uiAmountString || 'N/A';
    } else {
      userPUSDCBal = 'Account not found';
    }
  } catch (err) {
    console.error('Error fetching user pUSDC balance:', err);
  }
  try {
    treasuryUSDC = (treasury as any).treasuryUSDC as PublicKey;
    if (treasuryUSDC) {
      treasuryUSDCBal = (await connection.getTokenAccountBalance(treasuryUSDC)).value.uiAmountString || 'N/A';
    } else {
      treasuryUSDCBal = 'Account not found';
    }
  } catch (err) {
    console.error('Error fetching treasury USDC balance:', err);
  }
  console.log('--- Account Balances ---');
  console.log('User:', user.toBase58());
  console.log('User USDC ATA:', userUSDCATA ? userUSDCATA.toBase58() : 'N/A');
  console.log('User USDC:', userUSDCBal || 'N/A');
  console.log('User pUSDC ATA:', userPUSDCATA ? userPUSDCATA.toBase58() : 'N/A');
  console.log('User pUSDC:', userPUSDCBal || 'N/A');
  console.log('Treasury USDC:', treasuryUSDC ? treasuryUSDC.toBase58() : 'N/A');
  console.log('Treasury USDC balance:', treasuryUSDCBal || 'N/A');
  console.log('------------------------');
}

async function main() {
  try {
    const endpoint = argv.network === 'mainnet'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
    const connection = new Connection(endpoint, 'confirmed');
    const userKeypair = loadKeypair(argv.user);
    const treasury = new TreasuryService(connection);
    await printBalances(connection, userKeypair.publicKey, treasury);
    // Proceed with redeem
    const sig = await treasury.redeemPUSDC(userKeypair, argv.amount);
    console.log('Redeem transaction signature:', sig);
  } catch (err) {
    console.error('Failed to redeem pUSDC:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 