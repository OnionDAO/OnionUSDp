import { type SolanaClient, type KeyPairSigner } from "gill";
import { Connection, PublicKey } from '@solana/web3.js';
import { PayrollEscrowPDA, TransactionResult } from '../types/config';
export interface PayrollBatch {
    batchId: string;
    total: bigint;
    releaseAt: number;
    frozen: boolean;
    employeeCount: number;
}
export interface PayrollEmployee {
    wallet: PublicKey;
    amount: bigint;
    merkleProof?: string[];
}
export interface PayrollMerkleRoot {
    batchId: string;
    root: string;
    total: bigint;
    releaseAt: number;
}
export declare class PayrollManager {
    private client;
    private connection;
    private tokenProgram;
    private pusdMint;
    constructor(client: SolanaClient, connection: Connection, useToken2022?: boolean);
    /**
     * Derive Payroll Escrow PDA
     */
    private derivePayrollEscrowPDA;
    /**
     * Schedule payroll batch
     */
    schedulePayroll(authority: KeyPairSigner, batchId: string, merkleRoot: string, total: bigint, releaseAt: number): Promise<TransactionResult>;
    /**
     * Thaw payroll and distribute to employees
     */
    thawPayroll(authority: KeyPairSigner, batchId: string, employees: PayrollEmployee[]): Promise<TransactionResult>;
    /**
     * Get payroll escrow info
     */
    getPayrollEscrow(batchId: string): Promise<PayrollEscrowPDA | null>;
    /**
     * Validate merkle proof for employee
     */
    validateMerkleProof(employee: PayrollEmployee, merkleRoot: string, proof: string[]): boolean;
    /**
     * Calculate total payroll amount
     */
    calculateTotalPayroll(employees: PayrollEmployee[]): bigint;
    /**
     * Check if payroll can be thawed
     */
    canThawPayroll(releaseAt: number): boolean;
}
//# sourceMappingURL=payroll.d.ts.map