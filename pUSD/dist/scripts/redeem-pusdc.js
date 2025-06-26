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
    .option('amount', { type: 'number', demandOption: true, describe: 'Amount of pUSDC to redeem' })
    .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
    .strict()
    .argv;
function loadKeypair(path) {
    const raw = fs.readFileSync(path, 'utf-8');
    const arr = JSON.parse(raw);
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(arr));
}
async function printBalances(connection, user, treasury) {
    try {
        await treasury.init();
    }
    catch (err) {
        console.error('Error during treasury.init():', err);
    }
    let userUSDCATA, userPUSDCATA, treasuryUSDC;
    let userUSDCBal = 'N/A', userPUSDCBal = 'N/A', treasuryUSDCBal = 'N/A';
    try {
        userUSDCATA = (await connection.getParsedTokenAccountsByOwner(user, { mint: treasury_1.USDC_MINT })).value[0]?.pubkey;
        if (userUSDCATA) {
            userUSDCBal = (await connection.getTokenAccountBalance(userUSDCATA)).value.uiAmountString || 'N/A';
        }
        else {
            userUSDCBal = 'Account not found';
        }
    }
    catch (err) {
        console.error('Error fetching user USDC balance:', err);
    }
    try {
        userPUSDCATA = (await connection.getParsedTokenAccountsByOwner(user, { mint: treasury_1.PUSDC_MINT })).value[0]?.pubkey;
        if (userPUSDCATA) {
            userPUSDCBal = (await connection.getTokenAccountBalance(userPUSDCATA)).value.uiAmountString || 'N/A';
        }
        else {
            userPUSDCBal = 'Account not found';
        }
    }
    catch (err) {
        console.error('Error fetching user pUSDC balance:', err);
    }
    try {
        treasuryUSDC = treasury.treasuryUSDC;
        if (treasuryUSDC) {
            treasuryUSDCBal = (await connection.getTokenAccountBalance(treasuryUSDC)).value.uiAmountString || 'N/A';
        }
        else {
            treasuryUSDCBal = 'Account not found';
        }
    }
    catch (err) {
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
        const connection = new web3_js_1.Connection(endpoint, 'confirmed');
        const userKeypair = loadKeypair(argv.user);
        const treasury = new treasury_1.TreasuryService(connection);
        await printBalances(connection, userKeypair.publicKey, treasury);
        // Proceed with redeem
        const sig = await treasury.redeemPUSDC(userKeypair, argv.amount);
        console.log('Redeem transaction signature:', sig);
    }
    catch (err) {
        console.error('Failed to redeem pUSDC:', err);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=redeem-pusdc.js.map