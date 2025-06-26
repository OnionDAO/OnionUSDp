/**
 * Test Confidential Integration
 * 
 * This script demonstrates the complete confidential transfer workflow:
 * 1. Configure accounts for confidential transfers
 * 2. Deposit tokens into confidential balance
 * 3. Execute confidential transfers between corporate and employee
 * 4. Apply pending balances
 * 5. Withdraw from confidential balance
 */

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TreasuryService } from '../lib/treasury';
import { promises as fs } from 'fs';
import * as path from 'path';

// Configuration
const RPC_URL = 'http://127.0.0.1:8899'; // Local Surfpool
const connection = new Connection(RPC_URL, 'confirmed');

async function main() {
  console.log('🔒 Testing Confidential Transfer Integration\n');

  try {
    // Initialize treasury service
    const treasury = new TreasuryService(connection);
    await treasury.init();
    console.log('✅ Treasury service initialized');

    // Load or create test keypairs
    const corporateKeypair = await loadOrGenerateKeypair('corporate-test.json');
    const employeeKeypair = await loadOrGenerateKeypair('employee-test.json');
    
    console.log(`🏢 Corporate wallet: ${corporateKeypair.publicKey.toBase58()}`);
    console.log(`👤 Employee wallet: ${employeeKeypair.publicKey.toBase58()}`);

    // Get their pUSDC accounts
    const corporatePUSDCATA = await getOrCreateToken2022ATA(connection, treasury.PUSDC_MINT, corporateKeypair.publicKey, treasury.treasuryKeypair);
    const employeePUSDCATA = await getOrCreateToken2022ATA(connection, treasury.PUSDC_MINT, employeeKeypair.publicKey, treasury.treasuryKeypair);
    
    console.log(`🏢 Corporate pUSDC account: ${corporatePUSDCATA.toBase58()}`);
    console.log(`👤 Employee pUSDC account: ${employeePUSDCATA.toBase58()}`);

    // Step 1: Configure accounts for confidential transfers
    console.log('\n🔧 Step 1: Configuring accounts for confidential transfers...');
    try {
      await treasury['configureAccountForConfidentialTransfers'](corporatePUSDCATA);
      await treasury['configureAccountForConfidentialTransfers'](employeePUSDCATA);
      console.log('✅ Accounts configured for confidential transfers');
    } catch (error) {
      console.log('⚠️  Account configuration failed (may already be configured):', error);
    }

    // Step 2: Deposit tokens into corporate confidential balance
    console.log('\n🔒 Step 2: Depositing tokens into corporate confidential balance...');
    const depositAmount = 100; // 100 pUSDC
    try {
      const depositResult = await treasury.depositConfidentialTokens(corporatePUSDCATA, depositAmount);
      console.log('✅ Confidential deposit successful:', depositResult);
    } catch (error) {
      console.log('❌ Confidential deposit failed:', error);
      return;
    }

    // Step 3: Execute confidential transfer from corporate to employee
    console.log('\n🔄 Step 3: Executing confidential transfer from corporate to employee...');
    const transferAmount = 50; // 50 pUSDC
    try {
      const { transactionId, result } = await treasury.executeCorporateToEmployeeConfidentialTransfer(
        corporateKeypair.publicKey,
        employeeKeypair.publicKey,
        transferAmount
      );
      console.log('✅ Confidential transfer successful:');
      console.log(`   Transaction ID: ${transactionId}`);
      console.log(`   Result: ${result}`);
    } catch (error) {
      console.log('❌ Confidential transfer failed:', error);
      return;
    }

    // Step 4: Apply pending balance for employee
    console.log('\n🔄 Step 4: Applying pending balance for employee...');
    try {
      const applyResult = await treasury.applyPendingBalance(employeePUSDCATA);
      console.log('✅ Pending balance applied:', applyResult);
    } catch (error) {
      console.log('❌ Apply pending balance failed:', error);
      return;
    }

    // Step 5: Withdraw from employee confidential balance
    console.log('\n🔒 Step 5: Withdrawing from employee confidential balance...');
    const withdrawAmount = 25; // 25 pUSDC
    try {
      const withdrawResult = await treasury.withdrawConfidentialTokens(employeePUSDCATA, withdrawAmount);
      console.log('✅ Confidential withdrawal successful:', withdrawResult);
    } catch (error) {
      console.log('❌ Confidential withdrawal failed:', error);
      return;
    }

    // Step 6: Check revokable transactions
    console.log('\n📋 Step 6: Checking revokable transactions...');
    const revokableTxs = treasury.getRevokableTransactions();
    console.log(`Found ${revokableTxs.length} revokable transactions:`);
    revokableTxs.forEach((tx, index) => {
      console.log(`  ${index + 1}. From: ${tx.from.toBase58()}`);
      console.log(`     To: ${tx.to.toBase58()}`);
      console.log(`     Amount: ${tx.amount} pUSDC`);
      console.log(`     Timestamp: ${tx.timestamp}`);
      console.log(`     Expires: ${tx.expiresAt}`);
      console.log(`     Revoked: ${tx.isRevoked}`);
      console.log(`     Signature: ${tx.signature}`);
    });

    console.log('\n🎉 Confidential transfer integration test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Deposited ${depositAmount} pUSDC into corporate confidential balance`);
    console.log(`   • Transferred ${transferAmount} pUSDC confidentially to employee`);
    console.log(`   • Applied pending balance for employee`);
    console.log(`   • Withdrew ${withdrawAmount} pUSDC from employee confidential balance`);
    console.log(`   • Created ${revokableTxs.length} revokable transaction(s)`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Helper functions
async function loadOrGenerateKeypair(filename: string): Promise<Keypair> {
  const keypairPath = path.resolve(__dirname, `../../keypairs/${filename}`);
  try {
    await fs.mkdir(path.dirname(keypairPath), { recursive: true });
    const exists = await fs.stat(keypairPath).then(() => true).catch(() => false);
    if (exists) {
      const secret = JSON.parse(await fs.readFile(keypairPath, 'utf-8')) as number[];
      return Keypair.fromSecretKey(Uint8Array.from(secret));
    }
    const kp = Keypair.generate();
    await fs.writeFile(keypairPath, JSON.stringify(Array.from(kp.secretKey)));
    return kp;
  } catch (err) {
    throw new Error(`Failed loading keypair: ${(err as Error).message}`);
  }
}

async function getOrCreateToken2022ATA(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: Keypair
): Promise<PublicKey> {
  const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, ASSOCIATED_TOKEN_PROGRAM_ID } = await import('@solana/spl-token');
  const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
  
  const ata = await getAssociatedTokenAddress(mint, owner, false, TOKEN_2022_PROGRAM_ID);
  const info = await connection.getAccountInfo(ata);
  if (info) return ata;

  const ix = createAssociatedTokenAccountInstruction(
    payer.publicKey,
    ata,
    owner,
    mint,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const { Transaction, sendAndConfirmTransaction } = await import('@solana/web3.js');
  const tx = new Transaction({
    feePayer: payer.publicKey,
    blockhash,
    lastValidBlockHeight,
  }).add(ix);

  await sendAndConfirmTransaction(connection, tx, [payer]);
  return ata;
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
} 