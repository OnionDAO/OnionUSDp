import { PublicKey } from '@solana/web3.js';
export interface NetworkConfig {
    name: string;
    endpoint: string;
    commitment: 'processed' | 'confirmed' | 'finalized';
    confirmTransactionInitialTimeout: number;
}
export interface TokenConfig {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    mintAuthority: PublicKey;
    freezeAuthority?: PublicKey;
    metadataUri?: string;
}
export interface PUSDConfig {
    token: TokenConfig;
    usdcMint: PublicKey;
    oracleAddress: PublicKey;
    pegRatio: number;
    mintFeeBasisPoints: number;
    burnFeeBasisPoints: number;
    transferFeeBasisPoints: number;
    reserveAccount: PublicKey;
    feeCollector: PublicKey;
    maxSupply: bigint;
    enableConfidentialTransfers: boolean;
    enableTransferFees: boolean;
    enableNonTransferableAccounts: boolean;
    requireMultisig: boolean;
    multisigThreshold: number;
    multisigSigners: PublicKey[];
}
export interface OracleConfig {
    address: PublicKey;
    type: 'pyth' | 'chainlink' | 'custom';
    updateInterval: number;
    deviationThreshold: number;
}
export interface ReserveConfig {
    account: PublicKey;
    authority: PublicKey;
    minCollateralizationRatio: number;
    maxCollateralizationRatio: number;
    liquidationThreshold: number;
}
export interface FeeConfig {
    collector: PublicKey;
    mintFee: number;
    burnFee: number;
    transferFee: number;
    maxFee: bigint;
}
export interface PrivacyConfig {
    confidentialTransfers: boolean;
    transferFees: boolean;
    nonTransferableAccounts: boolean;
    confidentialCredits: boolean;
    nonConfidentialCredits: boolean;
}
export interface SecurityConfig {
    multisig: boolean;
    threshold: number;
    signers: PublicKey[];
    freezeAuthority: PublicKey;
    closeAuthority: PublicKey;
}
export interface AppConfig {
    network: string;
    pusd: PUSDConfig;
    oracle: OracleConfig;
    reserve: ReserveConfig;
    fees: FeeConfig;
    privacy: PrivacyConfig;
    security: SecurityConfig;
}
export interface ConfigPDA {
    floatMinPct: number;
    floatMaxPct: number;
    strategyId: number;
    riskParam: number;
    delegatedSigner: PublicKey;
    authority: PublicKey;
    bump: number;
}
export declare enum StrategyType {
    NONE = 0,// No yield (100% float)
    SOLEND = 1,// Solend (low risk)
    KAMINO = 2,// Kamino (medium risk)
    LULO = 3
}
export interface RedeemAllowEntry {
    wallet: PublicKey;
    dailyLimit: number;
    monthlyLimit: number;
    dailyUsed: number;
    monthlyUsed: number;
    lastDailyReset: number;
    lastMonthlyReset: number;
    bump: number;
}
export interface TreasuryPDA {
    authority: PublicKey;
    usdcBalance: bigint;
    pusdSupply: bigint;
    bump: number;
}
export interface YieldMasterPDA {
    treasury: PublicKey;
    strategyId: number;
    strategyBalance: bigint;
    strategyAccount: PublicKey;
    bump: number;
}
export interface PayrollEscrowPDA {
    batch: string;
    total: bigint;
    releaseAt: number;
    frozen: boolean;
    bump: number;
}
export interface StrategyEvent {
    action: 'invest' | 'withdraw';
    amount: bigint;
    strategyId: number;
    timestamp: number;
}
export interface RedeemEvent {
    wallet: PublicKey;
    amount: bigint;
    timestamp: number;
    signature: string;
}
export interface ConfigUpdateEvent {
    floatMinPct: number;
    floatMaxPct: number;
    strategyId: number;
    riskParam: number;
    timestamp: number;
}
//# sourceMappingURL=config.d.ts.map