"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gill_1 = require("gill");
const web3_js_1 = require("@solana/web3.js");
const token_1 = require("../lib/token");
const logger_1 = require("../utils/logger");
// @ts-ignore
const yargs_1 = __importDefault(require("yargs"));
// @ts-ignore
const helpers_1 = require("yargs/helpers");
const confidential = require('../lib/confidential');
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
    .option('supply', { type: 'number', default: 1000000, describe: 'Initial token supply' })
    .strict()
    .argv;
async function checkBalance(connection, address) {
    try {
        const publicKey = new web3_js_1.PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance;
    }
    catch (error) {
        return 0;
    }
}
async function main() {
    try {
        logger_1.logger.info(`🚀 Starting pUSD token deployment on ${argv.network}...`);
        const endpoint = argv.network === 'mainnet'
            ? 'https://api.mainnet-beta.solana.com'
            : 'https://api.devnet.solana.com';
        const client = (0, gill_1.createSolanaClient)({ urlOrMoniker: endpoint });
        const connection = new web3_js_1.Connection(endpoint, 'confirmed');
        // Use a new KeyPairSigner for payer (compatible with GillTokenManager)
        const payer = await (0, gill_1.generateKeyPairSigner)();
        logger_1.logger.info(`Payer: ${payer.address}`);
        const balance = await checkBalance(connection, payer.address);
        if (balance < 0.1 * 1e9) {
            throw new Error('Insufficient SOL balance for payer');
        }
        const tokenManager = new token_1.GillTokenManager(client, connection, true);
        logger_1.logger.info("🪙 Creating pUSD token...");
        const pusdToken = await tokenManager.createPUSDToken(payer, argv.network);
        logger_1.logger.info("🎉 pUSD token created successfully!");
        logger_1.logger.info(`Mint Address: ${pusdToken.mint.address}`);
        logger_1.logger.info(`Metadata Address: ${pusdToken.metadataAddress}`);
        logger_1.logger.info(`Transaction Signature: ${pusdToken.signature}`);
        const tokenInfo = {
            mint: pusdToken.mint.address,
            metadata: pusdToken.metadataAddress,
            signature: pusdToken.signature,
            network: argv.network,
            timestamp: new Date().toISOString(),
            supply: argv.supply
        };
        // Optionally write token info to file or output
        logger_1.logger.info("✅ pUSD token deployment completed!");
        // Create confidential mint
        const mintOutput = confidential.createConfidentialMint();
        // Parse mint pubkey from output, then continue with CLI for account creation, etc.
    }
    catch (error) {
        logger_1.logger.error("❌ Failed to deploy pUSD token:", error);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=deploy-with-funding.js.map