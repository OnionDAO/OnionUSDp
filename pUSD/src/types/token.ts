import { PublicKey } from '@solana/web3.js';

// Token 2022 specific types
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

export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}

// Gill confidential transfer types
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

// pUSD specific types
export interface PUSDConfig {
  mint: PublicKey;
  authority: PublicKey;
  usdcMint: PublicKey;
  oracle: PublicKey;
  reserveAccount: PublicKey;
  feeCollector: PublicKey;
  isInitialized: boolean;
  pegRatio: number; // 1.0 = 1:1 with USDC
  mintFee: number; // Basis points
  burnFee: number; // Basis points
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

// Oracle types for USDC peg
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
