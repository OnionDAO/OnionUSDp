#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const treasury_1 = require("../lib/treasury");
const fs_1 = require("fs");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
async function main() {
    const argv = await (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .option('corporate', { type: 'string', demandOption: true, describe: 'Path to corporate user keypair JSON' })
        .option('employee', { type: 'string', demandOption: true, describe: 'Path to employee user keypair JSON' })
        .option('amount', { type: 'number', demandOption: true, describe: 'Amount of pUSDC to transfer' })
        .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet', 'localnet'], describe: 'Solana network' })
        .option('confidential', { type: 'boolean', default: true, describe: 'Use confidential transfer (Token 2022)' })
        .strict()
        .argv;
    try {
        console.log('🏢 Corporate to Employee Confidential Transfer');
        console.log('=============================================');
        // Load keypairs
        const corporateKeypair = await loadKeypair(argv.corporate);
        const employeeKeypair = await loadKeypair(argv.employee);
        console.log(`Corporate User: ${corporateKeypair.publicKey.toBase58()}`);
        console.log(`Employee User: ${employeeKeypair.publicKey.toBase58()}`);
        console.log(`Amount: ${argv.amount} pUSDC`);
        console.log(`Confidential: ${argv.confidential ? 'Yes' : 'No'}`);
        console.log(`Network: ${argv.network}`);
        console.log('');
        // Setup connection
        const endpoint = argv.network === 'mainnet'
            ? 'https://api.mainnet-beta.solana.com'
            : argv.network === 'localnet'
                ? 'http://127.0.0.1:8899'
                : 'https://api.devnet.solana.com';
        const connection = new web3_js_1.Connection(endpoint, 'confirmed');
        // Initialize treasury service
        const treasury = new treasury_1.TreasuryService(connection);
        await treasury.init();
        if (argv.confidential) {
            console.log('🔒 Executing confidential transfer using Token 2022...');
            // Method 1: Use CLI-based confidential transfer
            try {
                const result = await treasury.executeConfidentialTransfer(corporateKeypair.publicKey, employeeKeypair.publicKey, argv.amount);
                console.log('✅ Confidential transfer successful!');
                console.log(`Result: ${result}`);
            }
            catch (error) {
                console.log('⚠️  CLI confidential transfer failed, trying transaction-based method...');
                // Method 2: Use transaction-based transfer with revokable tracking
                const { tx, signers, transactionId } = await treasury.buildCorporateToEmployeeTransferTx(corporateKeypair.publicKey, employeeKeypair.publicKey, argv.amount);
                const signature = await connection.sendTransaction(tx, [corporateKeypair, ...signers]);
                await connection.confirmTransaction(signature, 'confirmed');
                console.log('✅ Corporate to employee transfer successful!');
                console.log(`Transaction signature: ${signature}`);
                console.log(`Transaction ID: ${transactionId}`);
                console.log('⚠️  This transaction can be revoked within 30 minutes');
            }
        }
        else {
            console.log('🔄 Executing standard transfer...');
            const { tx, signers, transactionId } = await treasury.buildCorporateToEmployeeTransferTx(corporateKeypair.publicKey, employeeKeypair.publicKey, argv.amount);
            const signature = await connection.sendTransaction(tx, [corporateKeypair, ...signers]);
            await connection.confirmTransaction(signature, 'confirmed');
            console.log('✅ Corporate to employee transfer successful!');
            console.log(`Transaction signature: ${signature}`);
            console.log(`Transaction ID: ${transactionId}`);
            console.log('⚠️  This transaction can be revoked within 30 minutes');
        }
    }
    catch (error) {
        console.error('❌ Failed to process corporate to employee transfer:', error);
        process.exit(1);
    }
}
async function loadKeypair(keypairPath) {
    const secret = JSON.parse(await fs_1.promises.readFile(keypairPath, 'utf-8'));
    return web3_js_1.Keypair.fromSecretKey(Uint8Array.from(secret));
}
main();
//# sourceMappingURL=corporate-to-employee-transfer.js.map