"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const treasury_1 = require("../lib/treasury");
const fs = __importStar(require("fs"));
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
    .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
    .option('amount', { type: 'number', demandOption: true, describe: 'Amount of pUSDC to withdraw' })
    .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
    .strict()
    .argv;
function loadKeypair(path) {
    const raw = fs.readFileSync(path, 'utf-8');
    const arr = JSON.parse(raw);
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(arr));
}
async function main() {
    try {
        const endpoint = argv.network === 'mainnet'
            ? 'https://api.mainnet-beta.solana.com'
            : 'https://api.devnet.solana.com';
        const connection = new web3_js_1.Connection(endpoint, 'confirmed');
        const userKeypair = loadKeypair(argv.user);
        const treasury = new treasury_1.TreasuryService(connection);
        await treasury.init();
        console.log('👨‍💼 Employee Withdrawal Transaction');
        console.log('User:', userKeypair.publicKey.toBase58());
        console.log('Amount:', argv.amount, 'pUSDC');
        console.log('Fee: 0% (No fees for employees)');
        console.log('Net USDC received:', argv.amount);
        const { tx, signers } = await treasury.buildEmployeeWithdrawTx(userKeypair.publicKey, argv.amount);
        const signature = await (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [userKeypair, ...signers]);
        console.log('✅ Employee withdrawal successful!');
        console.log('Transaction signature:', signature);
    }
    catch (err) {
        console.error('❌ Failed to process employee withdrawal:', err);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=employee-withdraw.js.map