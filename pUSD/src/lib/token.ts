import {
  airdropFactory,
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
  getCreateMetadataAccountV3Instruction,
  getTokenMetadataAddress,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,    
  TOKEN_2022_PROGRAM_ADDRESS
} from "gill/programs";
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_CONSTANTS } from '../config/constants';
import { TransactionResult } from '../types/transaction';
import { logger } from '../utils/logger';

export interface TokenCreationOptions {
  name: string;
  symbol: string;
  decimals?: number;
  uri?: string;
  isMutable?: boolean;
  useToken2022?: boolean;
  metadata?: {
    description?: string;
    image?: string;
    external_url?: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export interface TokenInfo {
  mint: KeyPairSigner;
  metadataAddress: Address;
  signature: string;
}

export class GillTokenManager {
  private client: SolanaClient;
  private connection: Connection;
  private tokenProgram: Address;

  constructor(
    client: SolanaClient,
    connection: Connection,
    useToken2022: boolean = true
  ) {
    this.client = client;
    this.connection = connection;
    this.tokenProgram = useToken2022 ? TOKEN_2022_PROGRAM_ADDRESS : TOKEN_PROGRAM_ADDRESS;
  }

  /**
   * Create a new token with metadata using Gill
   */
  async createToken(
    payer: KeyPairSigner,
    options: TokenCreationOptions
  ): Promise<TokenInfo> {
    try {
      const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = this.client;
      
      // Generate mint keypair
      const mint = await generateKeyPairSigner();
      logger.info(`Creating token mint: ${mint.address}`);

      // Get latest blockhash
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      // Calculate space needed for mint
      const space = getMintSize();

      // Get metadata address
      const metadataAddress = await getTokenMetadataAddress(mint);

      // Build transaction instructions - just create the mint for now
      const instructions = [
        // Create account instruction
        getCreateAccountInstruction({
          space,
          lamports: getMinimumBalanceForRentExemption(space),
          newAccount: mint,
          payer,
          programAddress: this.tokenProgram
        }),

        // Initialize mint instruction
        getInitializeMintInstruction(
          {
            mint: mint.address,
            mintAuthority: payer.address,
            freezeAuthority: payer.address,
            decimals: options.decimals || TOKEN_CONSTANTS.DECIMALS
          },
          { programAddress: this.tokenProgram }
        )
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

      logger.info(`Created token: ${mint.address} with signature: ${signature}`);
      logger.info(`Metadata address: ${metadataAddress} (can be added later)`);
      
      return {
        mint,
        metadataAddress,
        signature
      };
    } catch (error) {
      logger.error('Failed to create token:', error);
      throw error;
    }
  }

  /**
   * Create pUSD token with specific configuration
   */
  async createPUSDToken(
    payer: KeyPairSigner,
    network: string = 'devnet'
  ): Promise<TokenInfo> {
    const options: TokenCreationOptions = {
      name: network === 'mainnet-beta' ? 'Privacy USD' : `Privacy USD (${network})`,
      symbol: network === 'mainnet-beta' ? 'pUSD' : `pUSD-${network.toUpperCase()}`,
      decimals: TOKEN_CONSTANTS.DECIMALS,
      uri: `https://raw.githubusercontent.com/your-repo/pUSD/main/metadata/pusd-${network}.json`,
      isMutable: true,
      useToken2022: true,
      metadata: {
        description: 'A privacy-focused USD stablecoin built on Solana',
        image: 'https://raw.githubusercontent.com/your-repo/pUSD/main/logo.png',
        external_url: 'https://github.com/your-repo/pUSD',
        attributes: [
          { trait_type: 'Privacy Level', value: 'High' },
          { trait_type: 'Blockchain', value: 'Solana' },
          { trait_type: 'Token Type', value: 'Stablecoin' },
          { trait_type: 'Peg', value: 'USDC' }
        ]
      }
    };

    return this.createToken(payer, options);
  }

  /**
   * Airdrop SOL to a signer (for testing)
   */
  async airdropSOL(
    recipient: KeyPairSigner,
    amount: bigint = 100_000_000n // 0.1 SOL
  ): Promise<TransactionResult> {
    try {
      const { rpc, rpcSubscriptions } = this.client;
      
      await airdropFactory({ rpc, rpcSubscriptions })({
        commitment: "confirmed",
        lamports: lamports(amount),
        recipientAddress: recipient.address
      });

      logger.info(`Airdropped ${amount} lamports to ${recipient.address}`);
      
      return {
        signature: 'airdrop',
        success: true,
        confirmationStatus: 'confirmed'
      };
    } catch (error) {
      logger.error('Failed to airdrop SOL:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get token balance using Gill
   */
  async getTokenBalance(
    mint: Address,
    owner: Address
  ): Promise<bigint> {
    try {
      const { rpc } = this.client;
      
      // Get token accounts for the owner
      const { value: tokenAccounts } = await rpc.getTokenAccountsByOwner(owner, {
        mint
      }).send();

      if (tokenAccounts.length === 0) {
        return BigInt(0);
      }

      // Get the first token account balance
      const accountInfo = tokenAccounts[0];
      if (!accountInfo?.account?.data) {
        return BigInt(0);
      }
      
      // Parse the account data - Gill returns base58 encoded data
      const accountData = accountInfo.account.data;
      // For now, return 0 as we need to properly decode the token account data
      // This would require additional parsing logic for the token account structure
      return BigInt(0);
    } catch (error) {
      logger.error('Failed to get token balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get mint info using Gill
   */
  async getMintInfo(mint: Address) {
    try {
      const { rpc } = this.client;
      
      const { value: accountInfo } = await rpc.getAccountInfo(mint).send();

      return accountInfo;
    } catch (error) {
      logger.error('Failed to get mint info:', error);
      throw error;
    }
  }
}

