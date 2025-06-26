import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
  slot?: number;
  confirmationStatus?: string;
}

export interface TransactionOptions {
  commitment?: 'processed' | 'confirmed' | 'finalized';
  preflightCommitment?: 'processed' | 'confirmed' | 'finalized';
  maxRetries?: number;
  skipPreflight?: boolean;
}

export interface ConfidentialTransferInstruction {
  instruction: TransactionInstruction;
  signers: any[];
  accounts: {
    source: PublicKey;
    destination: PublicKey;
    mint: PublicKey;
    authority: PublicKey;
    multisigSigners?: PublicKey[];
  };
}

export interface MintInstruction {
  instruction: TransactionInstruction;
  signers: any[];
  accounts: {
    mint: PublicKey;
    destination: PublicKey;
    authority: PublicKey;
    payer: PublicKey;
    multisigSigners?: PublicKey[];
  };
}

export interface BurnInstruction {
  instruction: TransactionInstruction;
  signers: any[];
  accounts: {
    mint: PublicKey;
    source: PublicKey;
    authority: PublicKey;
    multisigSigners?: PublicKey[];
  };
}

export interface TransferInstruction {
  instruction: TransactionInstruction;
  signers: any[];
  accounts: {
    source: PublicKey;
    destination: PublicKey;
    authority: PublicKey;
    multisigSigners?: PublicKey[];
  };
}

export interface TransactionBatch {
  instructions: TransactionInstruction[];
  signers: any[];
  feePayer: PublicKey;
  recentBlockhash?: string;
}

export enum TransactionType {
  MINT = 'mint',
  BURN = 'burn',
  TRANSFER = 'transfer',
  CONFIDENTIAL_TRANSFER = 'confidential_transfer',
  APPROVE = 'approve',
  REVOKE = 'revoke',
  FREEZE = 'freeze',
  THAW = 'thaw',
}
