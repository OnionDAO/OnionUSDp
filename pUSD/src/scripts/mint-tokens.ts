const confidential = require('../lib/confidential');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('mint', { type: 'string', demandOption: true, describe: 'Token mint address' })
  .option('payer', { type: 'string', demandOption: true, describe: 'Path to payer keypair JSON' })
  .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
  .option('amount', { type: 'number', default: 1, describe: 'Amount to mint' })
  .option('confidential', { type: 'boolean', default: false, describe: 'Use confidential transfer' })
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .strict()
  .argv;


function loadPubkeyFromKeypairFile(path) {
  const fs = require('fs');
  const raw = fs.readFileSync(path, 'utf-8');
  const arr = JSON.parse(raw);
  // Assumes standard Solana keypair file
  const { PublicKey } = require('@solana/web3.js');
  return new PublicKey(arr.slice(32, 64)).toBase58();
}

async function main() {
  try {
    console.log('🪙 Minting pUSD tokens using confidential CLI...');
    const mintPubkey = argv.mint;
    const payerPubkey = loadPubkeyFromKeypairFile(argv.payer);
    const userPubkey = loadPubkeyFromKeypairFile(argv.user);
    if (argv.confidential) {
      console.log('🔒 Using confidential transfer for minting');
      // Create account for user if needed
      confidential.createAccount(mintPubkey, userPubkey, argv.payer);      // Configure account for confidential transfers
      confidential.configureConfidentialAccount(userPubkey);
      // Deposit confidential amount
      confidential.depositConfidentialTokens(mintPubkey, argv.amount, userPubkey);
      // Apply pending balance
      confidential.applyPendingBalance(userPubkey);
    } else {
      console.log('Minting not implemented for non-confidential mode in this script.');
    }
    console.log('✅ Minting process completed.');
  } catch (error) {
    console.error('❌ Failed to mint tokens:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 