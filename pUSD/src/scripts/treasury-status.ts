import { Connection } from '@solana/web3.js';
import { TreasuryService } from '../lib/treasury';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .strict()
  .argv;

async function main() {
  try {
    const endpoint = argv.network === 'mainnet'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
    const connection = new Connection(endpoint, 'confirmed');
    const treasury = new TreasuryService(connection);
    await treasury.init();
    
    console.log('🏛️  Treasury Status Report');
    console.log('========================');
    
    // Treasury authorities
    console.log('\n📋 Treasury Authorities:');
    console.log('Treasury Authority:', treasury.treasuryAuthority.toBase58());
    console.log('Corporate Authority:', treasury.corporateAuthority.toBase58());
    console.log('Yield Authority:', treasury.yieldAuthority.toBase58());
    
    // Yield wallet balances
    const yieldBalances = await treasury.getYieldBalances();
    console.log('\n💰 Yield Wallet Balances:');
    console.log('USDC:', yieldBalances.usdc);
    console.log('pUSDC:', yieldBalances.pusdc);
    
    // Revokable transactions
    const revokableTxs = treasury.getRevokableTransactions();
    console.log('\n⏰ Revokable Transactions:', revokableTxs.length);
    revokableTxs.forEach((tx, index) => {
      console.log(`  ${index + 1}. From: ${tx.from.toBase58()}`);
      console.log(`     Amount: ${tx.amount} pUSDC`);
      console.log(`     Timestamp: ${tx.timestamp.toISOString()}`);
      console.log(`     Expires: ${tx.expiresAt.toISOString()}`);
      console.log(`     Status: ${tx.isRevoked ? 'REVOKED' : 'ACTIVE'}`);
      console.log('');
    });
    
    // Peg invariant check
    const isPegMaintained = await treasury.checkPegInvariant();
    console.log('\n🔗 Peg Status:', isPegMaintained ? '✅ MAINTAINED' : '❌ BROKEN');
    
    console.log('\n✅ Treasury status report complete');
  } catch (err) {
    console.error('❌ Failed to generate treasury status:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 