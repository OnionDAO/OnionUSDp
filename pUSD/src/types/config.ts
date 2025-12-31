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

// Configuration PDA structure
export interface ConfigPDA {
  floatMinPct: number; // Minimum float percentage (30%)
  floatMaxPct: number; // Maximum float percentage (60%)
  strategyId: number; // 0-3 for different yield strategies
  riskParam: number; // Risk parameter for Lulo
  delegatedSigner: PublicKey; // BOT signer for rebalancing
  authority: PublicKey; // MSIG authority
  bump: number;
}

// Strategy types
export enum StrategyType {
  NONE = 0, // No yield (100% float)
  SOLEND = 1, // Solend (low risk)
  KAMINO = 2, // Kamino (medium risk)
  LULO = 3, // Lulo (higher risk)
}

// Redeem allow list entry
export interface RedeemAllowEntry {
  wallet: PublicKey;
  dailyLimit: number; // Daily redeem limit in USDC cents
  monthlyLimit: number; // Monthly redeem limit in USDC cents
  dailyUsed: number; // Daily amount used
  monthlyUsed: number; // Monthly amount used
  lastDailyReset: number; // Unix timestamp of last daily reset
  lastMonthlyReset: number; // Unix timestamp of last monthly reset
  bump: number;
}

// Treasury PDA structure
export interface TreasuryPDA {
  authority: PublicKey; // Config PDA
  usdcBalance: bigint; // Current USDC balance
  pusdSupply: bigint; // Current pUSD supply
  bump: number;
}

// Yield Master PDA structure
export interface YieldMasterPDA {
  treasury: PublicKey; // Treasury PDA
  strategyId: number; // Current strategy
  strategyBalance: bigint; // Balance in current strategy
  strategyAccount: PublicKey; // Strategy-specific account
  bump: number;
}

// Payroll escrow structure
export interface PayrollEscrowPDA {
  batch: string; // Batch identifier
  total: bigint; // Total amount in escrow
  releaseAt: number; // Unix timestamp for release
  frozen: boolean; // Whether escrow is frozen
  bump: number;
}

// Strategy event types
export interface StrategyEvent {
  action: 'invest' | 'withdraw';
  amount: bigint;
  strategyId: number;
  timestamp: number;
}

// Redeem event types
export interface RedeemEvent {
  wallet: PublicKey;
  amount: bigint;
  timestamp: number;
  signature: string;
}

// Configuration update event
export interface ConfigUpdateEvent {
  floatMinPct: number;
  floatMaxPct: number;
  strategyId: number;
  riskParam: number;
  timestamp: number;
}
