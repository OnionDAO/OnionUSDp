import {
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  getExplorerLink,
  getMinimumBalanceForRentExemption,
  getSignatureFromTransaction,
  lamports,
  signTransactionMessageWithSigners,
  type SolanaClient,
  type KeyPairSigner,
  type TransactionSigner,
  type Address
} from "gill";
import {
  getCreateAccountInstruction,
  getInitializeMintInstruction,
  getMintSize,
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  getBurnInstruction,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS,
  TOKEN_2022_PROGRAM_ADDRESS
} from "gill/programs";
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { 
  TOKEN_CONSTANTS, 
  PUSD_CONSTANTS, 
  STRATEGY_CONSTANTS, 
  PDA_SEEDS,
  PROGRAM_IDS,
  ERROR_MESSAGES,
  PUSD_CONFIG 
} from '../config/constants';
import { 
  ConfigPDA, 
  StrategyType, 
  RedeemAllowEntry, 
  TreasuryPDA, 
  YieldMasterPDA,
  PayrollEscrowPDA,
  StrategyEvent,
  RedeemEvent,
  ConfigUpdateEvent
} from '../types/config';
import { TransactionResult } from '../types/transaction';
import { logger } from '../utils/logger';

export interface OnionUSDPOptions {
  rpcUrl: string;
  useToken2022?: boolean;
  network?: 'devnet' | 'mainnet-beta';
}

export class OnionUSDPManager {
  private client: SolanaClient;
  private connection: Connection;
  private tokenProgram: Address;
  private programId: PublicKey;
  private configPDA: PublicKey;
  private treasuryPDA: PublicKey;
  private yieldMasterPDA: PublicKey;
  private pusdMint: PublicKey;
  private usdcMint: PublicKey;

  constructor(
    client: SolanaClient,
    connection: Connection,
    options: OnionUSDPOptions
  ) {
    this.client = client;
    this.connection = connection;
    
    // Convert token program addresses to Address type
    if (options.useToken2022) {
      this.tokenProgram = PROGRAM_IDS.TOKEN_2022_PROGRAM.toBase58() as Address;
    } else {
      this.tokenProgram = PROGRAM_IDS.TOKEN_PROGRAM.toBase58() as Address;
    }
    
    this.programId = new PublicKey(PROGRAM_IDS.ONIONUSDP_PROGRAM);
    
    // Derive PDAs
    this.configPDA = this.deriveConfigPDA();
    this.treasuryPDA = this.deriveTreasuryPDA();
    this.yieldMasterPDA = this.deriveYieldMasterPDA();
    
    // Set token mints - convert PublicKey to Address
    this.pusdMint = new PublicKey(PUSD_CONFIG.mint);
    this.usdcMint = new PublicKey(PROGRAM_IDS.USDC_MINT);
  }

  // Helper method to convert PublicKey to Address
  private toAddress(publicKey: PublicKey): Address {
    return publicKey.toBase58() as Address;
  }

  /**
   * Derive Config PDA
   */
  private deriveConfigPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.programId
    )[0];
  }

  /**
   * Derive Treasury PDA
   */
  private deriveTreasuryPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('treasury')],
      this.programId
    )[0];
  }

  /**
   * Derive Yield Master PDA
   */
  private deriveYieldMasterPDA(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('yield_master')],
      this.programId
    )[0];
  }

  /**
   * Derive Redeem Allow PDA for a wallet
   */
  deriveRedeemAllowPDA(wallet: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('redeem_allow'), wallet.toBuffer()],
      this.programId
    )[0];
  }

  /**
   * Derive Payroll Escrow PDA
   */
  private derivePayrollEscrowPDA(batch: string): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('payroll_escrow'), Buffer.from(batch)],
      this.programId
    )[0];
  }

  /**
   * Initialize configuration (only callable once by MSIG)
   */
  async initializeConfig(
    msigAuthority: KeyPairSigner,
    delegatedSigner: KeyPairSigner,
    floatMinPct: number = PUSD_CONSTANTS.MIN_FLOAT_PCT,
    floatMaxPct: number = PUSD_CONSTANTS.MAX_FLOAT_PCT,
    strategyId: number = STRATEGY_CONSTANTS.STRATEGY_0,
    riskParam: number = 0
  ): Promise<TransactionResult> {
    try {
      const { rpc, sendAndConfirmTransaction } = this.client;
      
      // Validate parameters
      if (floatMinPct >= floatMaxPct || floatMaxPct > 90) {
        throw new Error(ERROR_MESSAGES.FLOAT_BOUNDS_VIOLATION);
      }
      if (strategyId < 0 || strategyId > STRATEGY_CONSTANTS.MAX_STRATEGY_ID) {
        throw new Error(ERROR_MESSAGES.STRATEGY_NOT_AVAILABLE);
      }

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      // Create transaction instructions
      const instructions = [
        // Initialize config instruction would go here
        // This is a placeholder for the actual program instruction
      ];

      // Create transaction
      const transaction = createTransaction({
        feePayer: msigAuthority,
        version: "legacy",
        instructions,
        latestBlockhash
      });

      // Sign and send transaction
      const signedTransaction = await signTransactionMessageWithSigners(transaction);
      const signature = await sendAndConfirmTransaction(signedTransaction);

      logger.info(`Initialized config with signature: ${signature}`);
      
      return {
        signature,
        success: true,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      logger.error('Failed to initialize config:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Deposit USDC and mint pUSD
   */
  async depositUSDC(
    payer: KeyPairSigner,
    amount: bigint
  ): Promise<TransactionResult> {
    try {
      const { rpc, sendAndConfirmTransaction } = this.client;
      
      if (amount <= 0) {
        throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
      }

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      // Get associated token accounts
      const payerUsdcATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.usdcMint),
        payer.address,
        { programAddress: this.tokenProgram }
      );

      const payerPusdATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.pusdMint),
        payer.address,
        { programAddress: this.tokenProgram }
      );

      const treasuryUsdcATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.usdcMint),
        this.toAddress(this.treasuryPDA),
        { programAddress: this.tokenProgram }
      );

      // Create transaction instructions
      const instructions: any[] = [
        // Create ATA for treasury if it doesn't exist
        getCreateAssociatedTokenInstruction(
          {
            payer: payer.address,
            associatedToken: treasuryUsdcATA,
            owner: this.toAddress(this.treasuryPDA),
            mint: this.toAddress(this.usdcMint)
          },
          { programAddress: this.tokenProgram }
        ),

        // Create ATA for payer pUSD if it doesn't exist
        getCreateAssociatedTokenInstruction(
          {
            payer: payer.address,
            associatedToken: payerPusdATA,
            owner: payer.address,
            mint: this.toAddress(this.pusdMint)
          },
          { programAddress: this.tokenProgram }
        ),

        // Transfer USDC from payer to treasury
        getTransferCheckedInstruction(
          {
            source: payerUsdcATA,
            mint: this.toAddress(this.usdcMint),
            destination: treasuryUsdcATA,
            owner: payer.address
          },
          {
            amount,
            decimals: TOKEN_CONSTANTS.DECIMALS
          },
          { programAddress: this.tokenProgram }
        ),

        // Mint pUSD to payer (this would be done by the program)
        // Placeholder for actual program instruction
      ];

      // Create transaction
      const transaction = createTransaction({
        feePayer: payer,
        version: "legacy",
        instructions,
        latestBlockhash
      });

      // Sign and send transaction
      const signedTransaction = await signTransactionMessageWithSigners(transaction);
      const signature = await sendAndConfirmTransaction(signedTransaction);

      logger.info(`Deposited ${amount} USDC and minted pUSD with signature: ${signature}`);
      
      return {
        signature,
        success: true,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      logger.error('Failed to deposit USDC:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Redeem pUSD for USDC with auto-liquidity
   */
  async redeemUSDC(
    employee: KeyPairSigner,
    amount: bigint
  ): Promise<TransactionResult> {
    try {
      const { rpc, sendAndConfirmTransaction } = this.client;
      
      if (amount <= 0) {
        throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
      }

      // Check redeem allow list
      const redeemAllowPDA = this.deriveRedeemAllowPDA(employee.address);
      const allowEntry = await this.getRedeemAllowEntry(redeemAllowPDA);
      
      if (!allowEntry) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED_OPERATION);
      }

      // Check limits
      if (allowEntry.dailyUsed + Number(amount) > allowEntry.dailyLimit) {
        throw new Error(ERROR_MESSAGES.REDEEM_LIMIT_EXCEEDED);
      }

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      // Get associated token accounts
      const employeeUsdcATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.usdcMint),
        employee.address,
        { programAddress: this.tokenProgram }
      );

      const employeePusdATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.pusdMint),
        employee.address,
        { programAddress: this.tokenProgram }
      );

      const treasuryUsdcATA = await getAssociatedTokenAccountAddress(
        this.toAddress(this.usdcMint),
        this.toAddress(this.treasuryPDA),
        { programAddress: this.tokenProgram }
      );

      // Create transaction instructions
      const instructions: any[] = [
        // Create ATA for employee USDC if it doesn't exist
        getCreateAssociatedTokenInstruction(
          {
            payer: employee.address,
            associatedToken: employeeUsdcATA,
            owner: employee.address,
            mint: this.toAddress(this.usdcMint)
          },
          { programAddress: this.tokenProgram }
        ),

        // Burn pUSD from employee
        getBurnInstruction(
          {
            mint: this.toAddress(this.pusdMint),
            source: employeePusdATA,
            owner: employee.address
          },
          {
            amount,
            decimals: TOKEN_CONSTANTS.DECIMALS
          },
          { programAddress: this.tokenProgram }
        ),

        // Transfer USDC from treasury to employee
        // This would include auto-liquidity logic in the actual program
        getTransferCheckedInstruction(
          {
            source: treasuryUsdcATA,
            mint: this.toAddress(this.usdcMint),
            destination: employeeUsdcATA,
            owner: this.toAddress(this.treasuryPDA)
          },
          {
            amount,
            decimals: TOKEN_CONSTANTS.DECIMALS
          },
          { programAddress: this.tokenProgram }
        ),

        // Update redeem allow entry
        // Placeholder for actual program instruction
      ];

      // Create transaction
      const transaction = createTransaction({
        feePayer: employee,
        version: "legacy",
        instructions,
        latestBlockhash
      });

      // Sign and send transaction
      const signedTransaction = await signTransactionMessageWithSigners(transaction);
      const signature = await sendAndConfirmTransaction(signedTransaction);

      logger.info(`Redeemed ${amount} pUSD for USDC with signature: ${signature}`);
      
      return {
        signature,
        success: true,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      logger.error('Failed to redeem USDC:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Rebalance treasury (called by BOT)
   */
  async rebalance(): Promise<TransactionResult> {
    try {
      const { rpc, sendAndConfirmTransaction } = this.client;
      
      // Get current float ratio
      const floatRatio = await this.getCurrentFloatRatio();
      const config = await this.getConfig();

      if (!config) {
        throw new Error('Config not found');
      }

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      let instructions = [];

      if (floatRatio > config.floatMaxPct) {
        // Invest surplus
        const surplus = await this.calculateSurplus();
        if (surplus > 0) {
          instructions.push(
            // Invest surplus instruction
            // Placeholder for actual program instruction
          );
        }
      } else if (floatRatio < config.floatMinPct) {
        // Withdraw deficit
        const deficit = await this.calculateDeficit();
        if (deficit > 0) {
          instructions.push(
            // Withdraw deficit instruction
            // Placeholder for actual program instruction
          );
        }
      }

      if (instructions.length === 0) {
        return {
          signature: '',
          success: true,
          confirmationStatus: 'confirmed'
        };
      }

      // Create transaction
      const transaction = createTransaction({
        feePayer: await generateKeyPairSigner(), // BOT signer
        version: "legacy",
        instructions,
        latestBlockhash
      });

      // Sign and send transaction
      const signedTransaction = await signTransactionMessageWithSigners(transaction);
      const signature = await sendAndConfirmTransaction(signedTransaction);

      logger.info(`Rebalanced treasury with signature: ${signature}`);
      
      return {
        signature,
        success: true,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      logger.error('Failed to rebalance:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get current float ratio
   */
  async getCurrentFloatRatio(): Promise<number> {
    try {
      const treasury = await this.getTreasury();
      if (!treasury) return 0;

      const totalSupply = treasury.pusdSupply;
      if (totalSupply === 0n) return 0;

      return Number((treasury.usdcBalance * 100n) / totalSupply);
    } catch (error) {
      logger.error('Failed to get float ratio:', error);
      return 0;
    }
  }

  /**
   * Get configuration
   */
  async getConfig(): Promise<ConfigPDA | null> {
    try {
      const { rpc } = this.client;
      const { value: accountInfo } = await rpc.getAccountInfo(this.configPDA).send();
      
      if (!accountInfo?.data) return null;

      // Parse config data
      // This would be actual parsing logic for the program data
      return null;
    } catch (error) {
      logger.error('Failed to get config:', error);
      return null;
    }
  }

  /**
   * Get treasury info
   */
  async getTreasury(): Promise<TreasuryPDA | null> {
    try {
      const { rpc } = this.client;
      const { value: accountInfo } = await rpc.getAccountInfo(this.treasuryPDA).send();
      
      if (!accountInfo?.data) return null;

      // Parse treasury data
      // This would be actual parsing logic for the program data
      return null;
    } catch (error) {
      logger.error('Failed to get treasury:', error);
      return null;
    }
  }

  /**
   * Get redeem allow entry
   */
  async getRedeemAllowEntry(redeemAllowPDA: PublicKey): Promise<RedeemAllowEntry | null> {
    try {
      const { rpc } = this.client;
      const { value: accountInfo } = await rpc.getAccountInfo(redeemAllowPDA).send();
      
      if (!accountInfo?.data) return null;

      // Parse redeem allow data
      // This would be actual parsing logic for the program data
      return null;
    } catch (error) {
      logger.error('Failed to get redeem allow entry:', error);
      return null;
    }
  }

  /**
   * Calculate surplus for investment
   */
  private async calculateSurplus(): Promise<bigint> {
    const treasury = await this.getTreasury();
    const config = await this.getConfig();
    
    if (!treasury || !config) return 0n;

    const maxFloat = (treasury.pusdSupply * BigInt(config.floatMaxPct)) / 100n;
    const surplus = treasury.usdcBalance - maxFloat;
    
    return surplus > 0n ? surplus : 0n;
  }

  /**
   * Calculate deficit for withdrawal
   */
  private async calculateDeficit(): Promise<bigint> {
    const treasury = await this.getTreasury();
    const config = await this.getConfig();
    
    if (!treasury || !config) return 0n;

    const minFloat = (treasury.pusdSupply * BigInt(config.floatMinPct)) / 100n;
    const deficit = minFloat - treasury.usdcBalance;
    
    return deficit > 0n ? deficit : 0n;
  }

  // Getters for PDAs
  getConfigPDA(): PublicKey { return this.configPDA; }
  getTreasuryPDA(): PublicKey { return this.treasuryPDA; }
  getYieldMasterPDA(): PublicKey { return this.yieldMasterPDA; }
  getPusdMint(): PublicKey { return this.pusdMint; }
  getUsdcMint(): PublicKey { return this.usdcMint; }
} 