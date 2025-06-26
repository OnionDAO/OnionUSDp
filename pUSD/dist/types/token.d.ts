import { PublicKey } from '@solana/web3.js';
export interface Token2022Account {
    mint: PublicKey;
    owner: PublicKey;
    amount: bigint;
    delegate?: PublicKey;
    state: AccountState;
    isNative?: bigint;
    delegatedAmount: bigint;
    closeAuthority?: PublicKey;
}
export declare enum AccountState {
    Uninitialized = 0,
    Initialized = 1,
    Frozen = 2
}
export interface ConfidentialTransferAccount {
    authority: PublicKey;
    pendingBalance: bigint;
    availableBalance: bigint;
    decryptableAvailableBalance: bigint;
    allowConfidentialCredits: boolean;
    allowNonConfidentialCredits: boolean;
    pendingBalanceCreditCounter: number;
    maximumPendingBalanceCreditCounter: number;
    expectedPendingBalanceCreditCounter: number;
}
export interface ConfidentialTransferMint {
    authority: PublicKey;
    transferFeeConfig?: TransferFeeConfig;
    isInitialized: boolean;
}
export interface TransferFeeConfig {
    transferFeeConfigAuthority: PublicKey;
    withdrawWithheldAuthority: PublicKey;
    withheldAmount: bigint;
    olderTransferFee: TransferFee;
    newerTransferFee: TransferFee;
}
export interface TransferFee {
    epoch: bigint;
    transferFeeBasisPoints: number;
    maximumFee: bigint;
}
export interface PUSDConfig {
    mint: PublicKey;
    authority: PublicKey;
    usdcMint: PublicKey;
    oracle: PublicKey;
    reserveAccount: PublicKey;
    feeCollector: PublicKey;
    isInitialized: boolean;
    pegRatio: number;
    mintFee: number;
    burnFee: number;
    maxSupply: bigint;
    currentSupply: bigint;
}
export interface MintRequest {
    amount: bigint;
    recipient: PublicKey;
    confidential: boolean;
}
export interface BurnRequest {
    amount: bigint;
    owner: PublicKey;
    confidential: boolean;
}
export interface TransferRequest {
    amount: bigint;
    from: PublicKey;
    to: PublicKey;
    confidential: boolean;
}
export interface OracleData {
    price: number;
    timestamp: number;
    confidence: number;
}
export interface ReserveData {
    usdcBalance: bigint;
    pusdSupply: bigint;
    collateralizationRatio: number;
}
//# sourceMappingURL=token.d.ts.map