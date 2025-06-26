/**
 * TreasuryService.ts
 *
 * A robust client-side service for corporate treasury management with:
 * - Multisig corporate wallet holding pUSDC and USDC in escrow
 * - 1% fee on corporate withdrawals (profit generation)
 * - No fees for employee transactions
 * - Confidential pUSDC transactions (except minting/deposits)
 * - 30-minute revokable period for corporate-employee transactions
 * - Auto-generated or personal wallet support
 * - Yield wallet sub-account for future yield generation
 */
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
/**
 * Constants for USDC and pUSDC
 */
export declare const USDC_MINT: PublicKey;
export declare const PUSDC_MINT: PublicKey;
export declare const USDC_DECIMALS = 6;
export declare const PUSDC_DECIMALS = 9;
/**
 * Treasury account types
 */
export interface TreasuryAccount {
    publicKey: PublicKey;
    isEmployee: boolean;
    isCorporate: boolean;
    branchId?: string;
    createdAt: Date;
}
export interface CorporateTransaction {
    signature: string;
    from: PublicKey;
    to: PublicKey;
    amount: number;
    timestamp: Date;
    expiresAt: Date;
    isRevoked: boolean;
}
/**
 * Enhanced TreasuryService for corporate treasury management
 */
export declare class TreasuryService {
    private connection;
    treasuryKeypair: Keypair;
    private corporateMultisig;
    private yieldWallet;
    treasuryAuthority: PublicKey;
    corporateAuthority: PublicKey;
    yieldAuthority: PublicKey;
    private treasuryUSDC;
    private corporateUSDC;
    private yieldUSDC;
    private yieldPUSDC;
    private revokableTransactions;
    readonly PUSDC_MINT: PublicKey;
    readonly USDC_MINT: PublicKey;
    constructor(connection: Connection);
    /**
     * Initialize all treasury components
     */
    init(): Promise<void>;
    /**
     * Generate a new employee wallet
     */
    generateEmployeeWallet(branchId: string): Promise<{
        keypair: Keypair;
        account: TreasuryAccount;
    }>;
    /**
     * Register an existing wallet as an employee
     */
    registerEmployeeWallet(publicKey: PublicKey, branchId: string): TreasuryAccount;
    /**
     * Corporate deposit USDC and mint pUSDC (no fees)
     */
    buildCorporateDepositTx(user: PublicKey, uiAmount: number): Promise<{
        tx: Transaction;
        signers: Keypair[];
    }>;
    /**
     * Corporate withdraw pUSDC for USDC (with 1% fee)
     */
    buildCorporateWithdrawTx(user: PublicKey, uiAmount: number): Promise<{
        tx: Transaction;
        signers: Keypair[];
        transactionId: string;
    }>;
    /**
     * Employee deposit USDC and mint pUSDC (no fees)
     */
    buildEmployeeDepositTx(user: PublicKey, uiAmount: number): Promise<{
        tx: Transaction;
        signers: Keypair[];
    }>;
    /**
     * Employee withdraw pUSDC for USDC (no fees)
     */
    buildEmployeeWithdrawTx(user: PublicKey, uiAmount: number): Promise<{
        tx: Transaction;
        signers: Keypair[];
    }>;
    /**
     * Revoke a corporate transaction within the 30-minute window
     */
    revokeCorporateTransaction(transactionId: string): Promise<boolean>;
    /**
     * Get all revokable transactions
     */
    getRevokableTransactions(): CorporateTransaction[];
    /**
     * Get yield wallet balances
     */
    getYieldBalances(): Promise<{
        usdc: string;
        pusdc: string;
    }>;
    /**
     * Check if total pUSDC supply equals USDC reserves × multiplier.
     */
    checkPegInvariant(): Promise<boolean>;
    /**
     * Legacy redeem method for backward compatibility
     */
    redeemPUSDC(userKeypair: Keypair, uiAmount: number): Promise<string>;
    /**
     * Corporate to Employee confidential pUSDC transfer using CLI
     */
    executeCorporateToEmployeeConfidentialTransfer(corporateUser: PublicKey, employeeUser: PublicKey, uiAmount: number): Promise<{
        transactionId: string;
        result: string;
    }>;
    /**
     * Configure a token account for confidential transfers
     */
    private configureAccountForConfidentialTransfers;
    /**
     * Deposit tokens into confidential balance
     */
    depositConfidentialTokens(accountPubkey: PublicKey, uiAmount: number): Promise<string>;
    /**
     * Apply pending balance to make confidential tokens visible
     */
    applyPendingBalance(accountPubkey: PublicKey): Promise<string>;
    /**
     * Withdraw confidential tokens to public balance
     */
    withdrawConfidentialTokens(accountPubkey: PublicKey, uiAmount: number): Promise<string>;
    /**
     * Legacy method for backward compatibility - now uses CLI
     */
    buildCorporateToEmployeeTransferTx(corporateUser: PublicKey, employeeUser: PublicKey, uiAmount: number): Promise<{
        tx: Transaction;
        signers: Keypair[];
        transactionId: string;
    }>;
    /**
     * Legacy method for backward compatibility - now uses CLI
     */
    executeConfidentialTransfer(fromAccount: PublicKey, toAccount: PublicKey, uiAmount: number): Promise<string>;
}
//# sourceMappingURL=treasury.d.ts.map