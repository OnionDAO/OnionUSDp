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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const reserves_1 = require("../lib/reserves");
const fs = __importStar(require("fs"));
// @ts-ignore
const yargs_1 = __importDefault(require("yargs"));
// @ts-ignore
const helpers_1 = require("yargs/helpers");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('amount', { type: 'number', demandOption: true, describe: 'Amount of USDC to deposit' })
    .option('payer', { type: 'string', demandOption: true, describe: 'Path to payer keypair JSON' })
    .option('user', { type: 'string', demandOption: true, describe: 'Path to user keypair JSON' })
    .option('mint', { type: 'string', demandOption: true, describe: 'USDC mint address' })
    .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
    .strict()
    .argv;
function loadKeypair(path) {
    const raw = fs.readFileSync(path, 'utf-8');
    const arr = JSON.parse(raw);
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(arr));
}
async function main() {
    const endpoint = argv.network === 'mainnet'
        ? 'https://api.mainnet-beta.solana.com'
        : 'https://api.devnet.solana.com';
    const connection = new web3_js_1.Connection(endpoint, 'confirmed');
    const payer = loadKeypair(argv.payer);
    const user = loadKeypair(argv.user);
    const mint = new web3_js_1.PublicKey(argv.mint);
    const reserve = new reserves_1.ReserveManager(connection, payer);
    // Ensure reserve vault exists
    await reserve.initReserve(mint);
    // Deposit USDC
    const sig = await reserve.depositUSDC(BigInt(argv.amount), user, mint);
    console.log('Deposit signature:', sig);
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=deposit-usdc.js.map