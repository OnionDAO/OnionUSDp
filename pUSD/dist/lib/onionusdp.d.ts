import { type SolanaClient, type KeyPairSigner } from "gill";
import { Connection, PublicKey } from '@solana/web3.js';
import { ConfigPDA, RedeemAllowEntry, TreasuryPDA } from '../types/config';
import { TransactionResult } from '../types/transaction';
export interface OnionUSDPOptions {
    rpcUrl: string;
    useToken2022?: boolean;
    network?: 'devnet' | 'mainnet-beta';
}
export declare class OnionUSDPManager {
    private client;
    private connection;
    private tokenProgram;
    private programId;
    private configPDA;
    private treasuryPDA;
    private yieldMasterPDA;
    private pusdMint;
    private usdcMint;
    constructor(client: SolanaClient, connection: Connection, options: OnionUSDPOptions);
    private toAddress;
    /**
     * Derive Config PDA
     */
    private deriveConfigPDA;
    /**
     * Derive Treasury PDA
     */
    private deriveTreasuryPDA;
    /**
     * Derive Yield Master PDA
     */
    private deriveYieldMasterPDA;
    /**
     * Derive Redeem Allow PDA for a wallet
     */
    deriveRedeemAllowPDA(wallet: PublicKey): PublicKey;
    /**
     * Derive Payroll Escrow PDA
     */
    private derivePayrollEscrowPDA;
    /**
     * Initialize configuration (only callable once by MSIG)
     */
    initializeConfig(msigAuthority: KeyPairSigner, delegatedSigner: KeyPairSigner, floatMinPct?: number, floatMaxPct?: number, strategyId?: number, riskParam?: number): Promise<TransactionResult>;
    /**
     * Deposit USDC and mint pUSD
     */
    depositUSDC(payer: KeyPairSigner, amount: bigint): Promise<TransactionResult>;
    /**
     * Redeem pUSD for USDC with auto-liquidity
     */
    redeemUSDC(employee: KeyPairSigner, amount: bigint): Promise<TransactionResult>;
    /**
     * Rebalance treasury (called by BOT)
     */
    rebalance(): Promise<TransactionResult>;
    /**
     * Get current float ratio
     */
    getCurrentFloatRatio(): Promise<number>;
    /**
     * Get configuration
     */
    getConfig(): Promise<ConfigPDA | null>;
    /**
     * Get treasury info
     */
    getTreasury(): Promise<TreasuryPDA | null>;
    /**
     * Get redeem allow entry
     */
    getRedeemAllowEntry(redeemAllowPDA: PublicKey): Promise<RedeemAllowEntry | null>;
    /**
     * Calculate surplus for investment
     */
    private calculateSurplus;
    /**
     * Calculate deficit for withdrawal
     */
    private calculateDeficit;
    getConfigPDA(): PublicKey;
    getTreasuryPDA(): PublicKey;
    getYieldMasterPDA(): PublicKey;
    getPusdMint(): PublicKey;
    getUsdcMint(): PublicKey;
}
//# sourceMappingURL=onionusdp.d.ts.map