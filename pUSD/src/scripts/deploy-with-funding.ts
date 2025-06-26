import { createSolanaClient, generateKeyPairSigner } from "gill";
import { Connection, PublicKey } from '@solana/web3.js';
import { GillTokenManager } from "../lib/token";
import { logger } from "../utils/logger";
// @ts-ignore
import yargs from 'yargs';
// @ts-ignore
import { hideBin } from 'yargs/helpers';
const confidential = require('../lib/confidential');

const argv = yargs(hideBin(process.argv))
  .option('network', { type: 'string', default: 'devnet', choices: ['devnet', 'mainnet'], describe: 'Solana network' })
  .option('supply', { type: 'number', default: 1000000, describe: 'Initial token supply' })
  .strict()
  .argv as any;

async function checkBalance(connection: Connection, address: string): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance;
  } catch (error) {
    return 0;
  }
}

async function main() {
  try {
    logger.info(`🚀 Starting pUSD token deployment on ${argv.network}...`);
    const endpoint = argv.network === 'mainnet'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
    const client = createSolanaClient({ urlOrMoniker: endpoint });
    const connection = new Connection(endpoint, 'confirmed');
    // Use a new KeyPairSigner for payer (compatible with GillTokenManager)
    const payer = await generateKeyPairSigner();
    logger.info(`Payer: ${payer.address}`);
    const balance = await checkBalance(connection, payer.address);
    if (balance < 0.1 * 1e9) {
      throw new Error('Insufficient SOL balance for payer');
    }
    const tokenManager = new GillTokenManager(client, connection, true);
    logger.info("🪙 Creating pUSD token...");
    const pusdToken = await tokenManager.createPUSDToken(payer, argv.network);
    logger.info("🎉 pUSD token created successfully!");
    logger.info(`Mint Address: ${pusdToken.mint.address}`);
    logger.info(`Metadata Address: ${pusdToken.metadataAddress}`);
    logger.info(`Transaction Signature: ${pusdToken.signature}`);
    const tokenInfo = {
      mint: pusdToken.mint.address,
      metadata: pusdToken.metadataAddress,
      signature: pusdToken.signature,
      network: argv.network,
      timestamp: new Date().toISOString(),
      supply: argv.supply
    };
    // Optionally write token info to file or output
    logger.info("✅ pUSD token deployment completed!");

    // Create confidential mint
    const mintOutput = confidential.createConfidentialMint();
    // Parse mint pubkey from output, then continue with CLI for account creation, etc.
  } catch (error) {
    logger.error("❌ Failed to deploy pUSD token:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 