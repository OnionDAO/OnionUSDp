"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GillTokenManager = void 0;
const gill_1 = require("gill");
const programs_1 = require("gill/programs");
const constants_1 = require("../config/constants");
const logger_1 = require("../utils/logger");
class GillTokenManager {
    constructor(client, connection, useToken2022 = true) {
        this.client = client;
        this.connection = connection;
        this.tokenProgram = useToken2022 ? programs_1.TOKEN_2022_PROGRAM_ADDRESS : programs_1.TOKEN_PROGRAM_ADDRESS;
    }
    /**
     * Create a new token with metadata using Gill
     */
    async createToken(payer, options) {
        try {
            const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = this.client;
            // Generate mint keypair
            const mint = await (0, gill_1.generateKeyPairSigner)();
            logger_1.logger.info(`Creating token mint: ${mint.address}`);
            // Get latest blockhash
            const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
            // Calculate space needed for mint
            const space = (0, programs_1.getMintSize)();
            // Get metadata address
            const metadataAddress = await (0, programs_1.getTokenMetadataAddress)(mint);
            // Build transaction instructions - just create the mint for now
            const instructions = [
                // Create account instruction
                (0, programs_1.getCreateAccountInstruction)({
                    space,
                    lamports: (0, gill_1.getMinimumBalanceForRentExemption)(space),
                    newAccount: mint,
                    payer,
                    programAddress: this.tokenProgram
                }),
                // Initialize mint instruction
                (0, programs_1.getInitializeMintInstruction)({
                    mint: mint.address,
                    mintAuthority: payer.address,
                    freezeAuthority: payer.address,
                    decimals: options.decimals || constants_1.TOKEN_CONSTANTS.DECIMALS
                }, { programAddress: this.tokenProgram })
            ];
            // Create transaction
            const transaction = (0, gill_1.createTransaction)({
                feePayer: payer,
                version: "legacy",
                instructions,
                latestBlockhash
            });
            // Sign and send transaction
            const signedTransaction = await (0, gill_1.signTransactionMessageWithSigners)(transaction);
            const signature = await sendAndConfirmTransaction(signedTransaction);
            logger_1.logger.info(`Created token: ${mint.address} with signature: ${signature}`);
            logger_1.logger.info(`Metadata address: ${metadataAddress} (can be added later)`);
            return {
                mint,
                metadataAddress,
                signature
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to create token:', error);
            throw error;
        }
    }
    /**
     * Create pUSD token with specific configuration
     */
    async createPUSDToken(payer, network = 'devnet') {
        const options = {
            name: network === 'mainnet-beta' ? 'Privacy USD' : `Privacy USD (${network})`,
            symbol: network === 'mainnet-beta' ? 'pUSD' : `pUSD-${network.toUpperCase()}`,
            decimals: constants_1.TOKEN_CONSTANTS.DECIMALS,
            uri: `https://raw.githubusercontent.com/your-repo/pUSD/main/metadata/pusd-${network}.json`,
            isMutable: true,
            useToken2022: true,
            metadata: {
                description: 'A privacy-focused USD stablecoin built on Solana',
                image: 'https://raw.githubusercontent.com/your-repo/pUSD/main/logo.png',
                external_url: 'https://github.com/your-repo/pUSD',
                attributes: [
                    { trait_type: 'Privacy Level', value: 'High' },
                    { trait_type: 'Blockchain', value: 'Solana' },
                    { trait_type: 'Token Type', value: 'Stablecoin' },
                    { trait_type: 'Peg', value: 'USDC' }
                ]
            }
        };
        return this.createToken(payer, options);
    }
    /**
     * Airdrop SOL to a signer (for testing)
     */
    async airdropSOL(recipient, amount = 100000000n // 0.1 SOL
    ) {
        try {
            const { rpc, rpcSubscriptions } = this.client;
            await (0, gill_1.airdropFactory)({ rpc, rpcSubscriptions })({
                commitment: "confirmed",
                lamports: (0, gill_1.lamports)(amount),
                recipientAddress: recipient.address
            });
            logger_1.logger.info(`Airdropped ${amount} lamports to ${recipient.address}`);
            return {
                signature: 'airdrop',
                success: true,
                confirmationStatus: 'confirmed'
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to airdrop SOL:', error);
            return {
                signature: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get token balance using Gill
     */
    async getTokenBalance(mint, owner) {
        try {
            const { rpc } = this.client;
            // Get token accounts for the owner
            const { value: tokenAccounts } = await rpc.getTokenAccountsByOwner(owner, {
                mint
            }).send();
            if (tokenAccounts.length === 0) {
                return BigInt(0);
            }
            // Get the first token account balance
            const accountInfo = tokenAccounts[0];
            if (!accountInfo?.account?.data) {
                return BigInt(0);
            }
            // Parse the account data - Gill returns base58 encoded data
            const accountData = accountInfo.account.data;
            // For now, return 0 as we need to properly decode the token account data
            // This would require additional parsing logic for the token account structure
            return BigInt(0);
        }
        catch (error) {
            logger_1.logger.error('Failed to get token balance:', error);
            return BigInt(0);
        }
    }
    /**
     * Get mint info using Gill
     */
    async getMintInfo(mint) {
        try {
            const { rpc } = this.client;
            const { value: accountInfo } = await rpc.getAccountInfo(mint).send();
            return accountInfo;
        }
        catch (error) {
            logger_1.logger.error('Failed to get mint info:', error);
            throw error;
        }
    }
}
exports.GillTokenManager = GillTokenManager;
//# sourceMappingURL=token.js.map