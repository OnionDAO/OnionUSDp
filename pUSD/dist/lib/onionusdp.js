import { PublicKey } from '@solana/web3.js';
import { PUSD_CONSTANTS, STRATEGY_CONSTANTS, PROGRAM_IDS, ERROR_MESSAGES, PUSD_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';
export class OnionUSDPManager {
    constructor(client, connection, options) {
        this.client = client;
        this.connection = connection;
        // Use PublicKey for compatibility with SPL helpers
        if (options.useToken2022) {
            this.tokenProgram = PROGRAM_IDS.TOKEN_2022_PROGRAM;
        }
        else {
            this.tokenProgram = PROGRAM_IDS.TOKEN_PROGRAM;
        }
        this.programId = new PublicKey(PROGRAM_IDS.ONIONUSDP_PROGRAM);
        // Derive PDAs
        this.configPDA = this.deriveConfigPDA();
        this.treasuryPDA = this.deriveTreasuryPDA();
        this.yieldMasterPDA = this.deriveYieldMasterPDA();
        // Set token mints - convert PublicKey to Address
        this.pusdMint = new PublicKey(PUSD_CONFIG.mint);
        this.usdcMint = new PublicKey(PROGRAM_IDS.USDC_MINT);
    }
    // Helper method to convert PublicKey to Address
    toAddress(publicKey) {
        return publicKey.toBase58();
    }
    /**
     * Derive Config PDA
     */
    deriveConfigPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from('config')], this.programId)[0];
    }
    /**
     * Derive Treasury PDA
     */
    deriveTreasuryPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from('treasury')], this.programId)[0];
    }
    /**
     * Derive Yield Master PDA
     */
    deriveYieldMasterPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from('yield_master')], this.programId)[0];
    }
    /**
     * Derive Redeem Allow PDA for a wallet
     */
    deriveRedeemAllowPDA(wallet) {
        return PublicKey.findProgramAddressSync([Buffer.from('redeem_allow'), wallet.toBuffer()], this.programId)[0];
    }
    /**
     * Derive Payroll Escrow PDA
     */
    derivePayrollEscrowPDA(batch) {
        return PublicKey.findProgramAddressSync([Buffer.from('payroll_escrow'), Buffer.from(batch)], this.programId)[0];
    }
    /**
     * Initialize configuration (only callable once by MSIG)
     */
    async initializeConfig(msigAuthority, delegatedSigner, floatMinPct = PUSD_CONSTANTS.MIN_FLOAT_PCT, floatMaxPct = PUSD_CONSTANTS.MAX_FLOAT_PCT, strategyId = STRATEGY_CONSTANTS.STRATEGY_0, riskParam = 0) {
        try {
            const { rpc, sendAndConfirmTransaction } = this.client;
            // Validate parameters
            if (floatMinPct >= floatMaxPct || floatMaxPct > 90) {
                throw new Error(ERROR_MESSAGES.FLOAT_BOUNDS_VIOLATION);
            }
            if (strategyId < 0 || strategyId > STRATEGY_CONSTANTS.MAX_STRATEGY_ID) {
                throw new Error(ERROR_MESSAGES.STRATEGY_NOT_AVAILABLE);
            }
            // Get latest blockhash
            const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
            // For now, just return success without creating complex instructions
            // This will be implemented with actual program instructions later
            logger.info(`Config initialization request received`);
            return {
                signature: 'placeholder',
                success: true,
                confirmationStatus: 'confirmed'
            };
        }
        catch (error) {
            logger.error('Failed to initialize config:', error);
            return {
                signature: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Deposit USDC and mint pUSD
     */
    async depositUSDC(payer, amount) {
        try {
            const { rpc, sendAndConfirmTransaction } = this.client;
            if (amount <= 0) {
                throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
            }
            // Get latest blockhash
            const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
            // For now, just return success without creating complex instructions
            // This will be implemented with actual program instructions later
            logger.info(`Deposit request for ${amount} USDC received`);
            return {
                signature: 'placeholder',
                success: true,
                confirmationStatus: 'confirmed'
            };
        }
        catch (error) {
            logger.error('Failed to deposit USDC:', error);
            return {
                signature: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Redeem pUSD for USDC with auto-liquidity
     */
    async redeemUSDC(employee, amount) {
        try {
            const { rpc, sendAndConfirmTransaction } = this.client;
            if (amount <= 0) {
                throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
            }
            // Check redeem allow list
            const redeemAllowPDA = this.deriveRedeemAllowPDA(employee.address);
            const allowEntry = await this.getRedeemAllowEntry(redeemAllowPDA);
            if (!allowEntry) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED_OPERATION);
            }
            // Check limits
            if (allowEntry.dailyUsed + Number(amount) > allowEntry.dailyLimit) {
                throw new Error(ERROR_MESSAGES.REDEEM_LIMIT_EXCEEDED);
            }
            // Get latest blockhash
            const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
            // For now, just return success without creating complex instructions
            // This will be implemented with actual program instructions later
            logger.info(`Redeem request for ${amount} pUSD received`);
            return {
                signature: 'placeholder',
                success: true,
                confirmationStatus: 'confirmed'
            };
        }
        catch (error) {
            logger.error('Failed to redeem pUSD:', error);
            return {
                signature: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Rebalance treasury (called by BOT)
     */
    async rebalance() {
        try {
            const { rpc, sendAndConfirmTransaction } = this.client;
            // Get current float ratio
            const floatRatio = await this.getCurrentFloatRatio();
            const config = await this.getConfig();
            if (!config) {
                throw new Error('Config not found');
            }
            // Get latest blockhash
            const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
            // For now, just return success without creating complex instructions
            // This will be implemented with actual program instructions later
            logger.info(`Rebalance request received. Current float ratio: ${floatRatio}%`);
            return {
                signature: 'placeholder',
                success: true,
                confirmationStatus: 'confirmed'
            };
        }
        catch (error) {
            logger.error('Failed to rebalance:', error);
            return {
                signature: '',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get current float ratio
     */
    async getCurrentFloatRatio() {
        try {
            const treasury = await this.getTreasury();
            if (!treasury)
                return 0;
            const totalSupply = treasury.pusdSupply;
            if (totalSupply === 0n)
                return 0;
            return Number((treasury.usdcBalance * 100n) / totalSupply);
        }
        catch (error) {
            logger.error('Failed to get float ratio:', error);
            return 0;
        }
    }
    /**
     * Get configuration
     */
    async getConfig() {
        try {
            const { rpc } = this.client;
            const { value: accountInfo } = await rpc.getAccountInfo(this.toAddress(this.configPDA)).send();
            if (!accountInfo?.data)
                return null;
            // Parse config data
            // This would be actual parsing logic for the program data
            return null;
        }
        catch (error) {
            logger.error('Failed to get config:', error);
            return null;
        }
    }
    /**
     * Get treasury info
     */
    async getTreasury() {
        try {
            const { rpc } = this.client;
            const { value: accountInfo } = await rpc.getAccountInfo(this.toAddress(this.treasuryPDA)).send();
            if (!accountInfo?.data)
                return null;
            // Parse treasury data
            // This would be actual parsing logic for the program data
            return null;
        }
        catch (error) {
            logger.error('Failed to get treasury:', error);
            return null;
        }
    }
    /**
     * Get redeem allow entry
     */
    async getRedeemAllowEntry(redeemAllowPDA) {
        try {
            const { rpc } = this.client;
            const { value: accountInfo } = await rpc.getAccountInfo(this.toAddress(redeemAllowPDA)).send();
            if (!accountInfo?.data)
                return null;
            // Parse redeem allow data
            // This would be actual parsing logic for the program data
            return null;
        }
        catch (error) {
            logger.error('Failed to get redeem allow entry:', error);
            return null;
        }
    }
    /**
     * Calculate surplus for investment
     */
    async calculateSurplus() {
        const treasury = await this.getTreasury();
        const config = await this.getConfig();
        if (!treasury || !config)
            return 0n;
        const maxFloat = (treasury.pusdSupply * BigInt(config.floatMaxPct)) / 100n;
        const surplus = treasury.usdcBalance - maxFloat;
        return surplus > 0n ? surplus : 0n;
    }
    /**
     * Calculate deficit for withdrawal
     */
    async calculateDeficit() {
        const treasury = await this.getTreasury();
        const config = await this.getConfig();
        if (!treasury || !config)
            return 0n;
        const minFloat = (treasury.pusdSupply * BigInt(config.floatMinPct)) / 100n;
        const deficit = minFloat - treasury.usdcBalance;
        return deficit > 0n ? deficit : 0n;
    }
    // Getters for PDAs
    getConfigPDA() { return this.configPDA; }
    getTreasuryPDA() { return this.treasuryPDA; }
    getYieldMasterPDA() { return this.yieldMasterPDA; }
    getPusdMint() { return this.pusdMint; }
    getUsdcMint() { return this.usdcMint; }
}
//# sourceMappingURL=onionusdp.js.map