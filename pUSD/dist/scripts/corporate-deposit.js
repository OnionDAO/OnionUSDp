import { Connection, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { TreasuryService } from '../lib/treasury';
import * as fs from 'fs';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
    .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
    .option('amount', { type: 'number', demandOption: true, describe: 'Amount of USDC to deposit' })
    .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
    .strict()
    .argv;
function loadKeypair(path) {
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
        console.log('🏢 Corporate Deposit Transaction');
        console.log('User:', userKeypair.publicKey.toBase58());
        console.log('Amount:', argv.amount, 'USDC');
        const { tx, signers } = await treasury.buildCorporateDepositTx(userKeypair.publicKey, argv.amount);
        const signature = await sendAndConfirmTransaction(connection, tx, [userKeypair, ...signers]);
        console.log('✅ Corporate deposit successful!');
        console.log('Transaction signature:', signature);
    }
    catch (err) {
        console.error('❌ Failed to process corporate deposit:', err);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=corporate-deposit.js.map