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
//# sourceMappingURL=config.d.ts.map