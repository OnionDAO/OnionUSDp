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
  // Token configuration
  token: TokenConfig;
  
  // Peg configuration
  usdcMint: PublicKey;
  oracleAddress: PublicKey;
  pegRatio: number; // 1.0 = 1:1 with USDC
  
  // Fee configuration
  mintFeeBasisPoints: number;
  burnFeeBasisPoints: number;
  transferFeeBasisPoints: number;
  
  // Reserve configuration
  reserveAccount: PublicKey;
  feeCollector: PublicKey;
  maxSupply: bigint;
  
  // Privacy configuration
  enableConfidentialTransfers: boolean;
  enableTransferFees: boolean;
  enableNonTransferableAccounts: boolean;
  
  // Security configuration
  requireMultisig: boolean;
  multisigThreshold: number;
  multisigSigners: PublicKey[];
}

export interface OracleConfig {
  address: PublicKey;
  type: 'pyth' | 'chainlink' | 'custom';
  updateInterval: number; // seconds
  deviationThreshold: number; // percentage
}

export interface ReserveConfig {
  account: PublicKey;
  authority: PublicKey;
  minCollateralizationRatio: number; // percentage
  maxCollateralizationRatio: number; // percentage
  liquidationThreshold: number; // percentage
}

export interface FeeConfig {
  collector: PublicKey;
  mintFee: number; // basis points
  burnFee: number; // basis points
  transferFee: number; // basis points
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
