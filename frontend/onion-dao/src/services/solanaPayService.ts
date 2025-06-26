import { 
  encodeURL, 
  validateTransfer
} from '@solana/pay';
import { 
  Connection, 
  PublicKey, 
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress
} from '@solana/spl-token';
import type { Employee } from '../types';
import { BigNumber } from 'bignumber.js';

// Solana Pay Configuration
const SOLANA_PAY_CONFIG = {
  // Use devnet for development, mainnet for production
  endpoint: process.env.NODE_ENV === 'production' 
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com',
  // Corporate treasury wallet (this should come from user's connected wallet)
  corporateWallet: '', // Will be set dynamically
  // USDC mint address (devnet)
  usdcMint: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // Devnet USDC
  // OnionUSD-P mint (when deployed)
  onionUSDMint: new PublicKey('11111111111111111111111111111111'), // Placeholder
};

export interface PaymentRequest {
  id: string;
  recipient: string;
  amount: number;
  token?: 'SOL' | 'USDC' | 'OnionUSD-P';
  memo: string;
  qrCode: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  expiresAt: Date;
}

interface SolanaPayTransferFields {
  recipient: PublicKey;
  amount: BigNumber;
  splToken?: PublicKey;
  reference?: PublicKey;
  memo?: string;
}

export interface BulkPayrollRequest {
  id: string;
  employees: Array<{
    employee: Employee;
    amount: number;
    memo?: string;
  }>;
  totalAmount: number;
  token: 'SOL' | 'USDC' | 'OnionUSD-P';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  qrCodes: string[];
  createdAt: Date;
}

export class SolanaPayService {
  private connection: Connection;
  private corporateWallet: PublicKey | null = null;

  constructor() {
    this.connection = new Connection(SOLANA_PAY_CONFIG.endpoint, 'confirmed');
  }

  /**
   * Set the corporate wallet for payments
   */
  setCorporateWallet(walletAddress: string) {
    this.corporateWallet = new PublicKey(walletAddress);
    SOLANA_PAY_CONFIG.corporateWallet = walletAddress;
  }

  /**
   * Generate a Solana Pay payment request for a single employee
   */
  async generateEmployeePayment(
    employee: Employee,
    amount: number,
    token: 'SOL' | 'USDC' | 'OnionUSD-P' = 'USDC',
    memo?: string
  ): Promise<PaymentRequest> {
    if (!this.corporateWallet) {
      throw new Error('Corporate wallet not set');
    }

    // Validate employee wallet address
    if (!employee.walletAddress || !employee.walletAddress.trim()) {
      throw new Error('Employee wallet address is required for payments');
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(employee.walletAddress);
    } catch (error) {
      throw new Error(`Invalid employee wallet address: ${employee.walletAddress}`);
    }
    const paymentMemo = memo || `Salary payment for ${employee.name}`;
    
    // Create transfer request URL
    const transferRequest: SolanaPayTransferFields = {
      recipient,
      amount: new BigNumber(token === 'SOL' ? amount * LAMPORTS_PER_SOL : amount),
      splToken: token === 'SOL' ? undefined : this.getTokenMint(token),
      reference: PublicKey.unique(), // Generate unique reference
      memo: paymentMemo,
    };

    const url = encodeURL(transferRequest);
    
    const paymentRequest: PaymentRequest = {
      id: `pay_${Date.now()}_${employee.id}`,
      recipient: employee.walletAddress,
      amount,
      token,
      memo: paymentMemo,
      qrCode: url.toString(),
      url: url.toString(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    return paymentRequest;
  }

  /**
   * Generate bulk payroll payment requests
   */
  async generateBulkPayroll(
    employees: Employee[],
    salaryOverrides?: Record<string, number>,
    token: 'SOL' | 'USDC' | 'OnionUSD-P' = 'USDC'
  ): Promise<BulkPayrollRequest> {
    if (!this.corporateWallet) {
      throw new Error('Corporate wallet not set');
    }

    const payrollItems = employees.map(employee => ({
      employee,
      amount: salaryOverrides?.[employee.id] || employee.salary,
      memo: `Monthly salary - ${new Date().toLocaleDateString()}`
    }));

    const totalAmount = payrollItems.reduce((sum, item) => sum + item.amount, 0);

    // Generate individual payment QR codes for each employee
    const qrCodes: string[] = [];
    for (const item of payrollItems) {
      const paymentRequest = await this.generateEmployeePayment(
        item.employee,
        item.amount,
        token,
        item.memo
      );
      qrCodes.push(paymentRequest.qrCode);
    }

    const bulkRequest: BulkPayrollRequest = {
      id: `payroll_${Date.now()}`,
      employees: payrollItems,
      totalAmount,
      token,
      status: 'pending',
      qrCodes,
      createdAt: new Date(),
    };

    return bulkRequest;
  }

  /**
   * Generate payment request for vendor/contractor
   */
  async generateVendorPayment(
    vendorWallet: string,
    amount: number,
    description: string,
    token: 'SOL' | 'USDC' | 'OnionUSD-P' = 'USDC'
  ): Promise<PaymentRequest> {
    if (!this.corporateWallet) {
      throw new Error('Corporate wallet not set');
    }

    const recipient = new PublicKey(vendorWallet);
    const memo = `Vendor payment: ${description}`;
    
    const transferRequest: SolanaPayTransferFields = {
      recipient,
      amount: new BigNumber(token === 'SOL' ? amount * LAMPORTS_PER_SOL : amount),
      splToken: token === 'SOL' ? undefined : this.getTokenMint(token),
      reference: PublicKey.unique(), // Generate unique reference
      memo,
    };

    const url = encodeURL(transferRequest);
    
    const paymentRequest: PaymentRequest = {
      id: `vendor_${Date.now()}`,
      recipient: vendorWallet,
      amount,
      token,
      memo,
      qrCode: url.toString(),
      url: url.toString(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    return paymentRequest;
  }

  /**
   * Generate invoice payment request (for receiving payments)
   */
  async generateInvoicePayment(
    amount: number,
    description: string,
    token: 'SOL' | 'USDC' | 'OnionUSD-P' = 'USDC'
  ): Promise<PaymentRequest> {
    if (!this.corporateWallet) {
      throw new Error('Corporate wallet not set');
    }

    const memo = `Invoice payment: ${description}`;
    
    const transferRequest: SolanaPayTransferFields = {
      recipient: this.corporateWallet, // Corporate receives the payment
      amount: new BigNumber(token === 'SOL' ? amount * LAMPORTS_PER_SOL : amount),
      splToken: token === 'SOL' ? undefined : this.getTokenMint(token),
      reference: PublicKey.unique(), // Generate unique reference
      memo,
    };

    const url = encodeURL(transferRequest);
    
    const paymentRequest: PaymentRequest = {
      id: `invoice_${Date.now()}`,
      recipient: this.corporateWallet.toString(),
      amount,
      token,
      memo,
      qrCode: url.toString(),
      url: url.toString(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    return paymentRequest;
  }

  /**
   * Validate a completed payment
   */
  async validatePayment(signature: string, recipient: PublicKey, amount: BigNumber): Promise<boolean> {
    try {
      const result = await validateTransfer(
        this.connection,
        signature,
        { 
          recipient,
          amount
        },
        { commitment: 'confirmed' }
      );
      return result !== null;
    } catch (error) {
      console.error('Payment validation error:', error);
      return false;
    }
  }

  /**
   * Get payment status from blockchain
   */
  async getPaymentStatus(signature: string): Promise<'pending' | 'completed' | 'failed'> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      
      if (!status.value) {
        return 'pending';
      }
      
      if (status.value.err) {
        return 'failed';
      }
      
      return 'completed';
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'failed';
    }
  }

  /**
   * Get wallet balance for display
   */
  async getWalletBalance(walletAddress: string, token?: 'SOL' | 'USDC' | 'OnionUSD-P'): Promise<number> {
    try {
      // Validate wallet address
      if (!walletAddress || !walletAddress.trim()) {
        console.error('Empty wallet address provided to getWalletBalance');
        return 0;
      }

      const publicKey = new PublicKey(walletAddress);
      
      if (!token || token === 'SOL') {
        const balance = await this.connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
      } else {
        // Get SPL token balance
        const tokenMint = this.getTokenMint(token);
        const tokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
        const balance = await this.connection.getTokenAccountBalance(tokenAccount);
        return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
      }
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }

  /**
   * Helper to get token mint address
   */
  private getTokenMint(token: 'USDC' | 'OnionUSD-P'): PublicKey {
    switch (token) {
      case 'USDC':
        return SOLANA_PAY_CONFIG.usdcMint;
      case 'OnionUSD-P':
        return SOLANA_PAY_CONFIG.onionUSDMint;
      default:
        throw new Error(`Unsupported token: ${token}`);
    }
  }

  /**
   * Get recent payment transactions
   */
  async getRecentPayments(walletAddress: string, limit: number = 10) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
          });
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            transaction: tx,
            status: sig.err ? 'failed' : 'completed'
          };
        })
      );

      return transactions;
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      return [];
    }
  }
}

// Export singleton instance
export const solanaPayService = new SolanaPayService(); 