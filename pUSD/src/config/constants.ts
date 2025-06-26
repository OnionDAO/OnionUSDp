import { PublicKey } from '@solana/web3.js';
import { DEVNET, MAINNET } from './networks';

// Network constants
export const NETWORKS = {
  MAINNET: 'mainnet-beta',
  DEVNET: 'devnet',
  TESTNET: 'testnet',
  LOCALNET: 'localnet'
} as const;

// Default network
export const DEFAULT_NETWORK = NETWORKS.DEVNET;

// Current pUSD configuration
export const PUSD_CONFIG = {
  mint: "4HoKmEMnT6JqZEWc3c1VTW6bXeEGCS2U4SxZ7UYnwZjb",
  network: "surfnet",
  program: "Token2022"
} as const;

// Program IDs (from networks)
export const PROGRAM_IDS = {
  TOKEN_PROGRAM: new PublicKey(DEVNET.TOKEN_PROGRAM),
  TOKEN_2022_PROGRAM: new PublicKey(DEVNET.TOKEN_2022_PROGRAM),
  ASSOCIATED_TOKEN_PROGRAM: new PublicKey(DEVNET.ASSOCIATED_TOKEN_PROGRAM),
  SYSTEM_PROGRAM: new PublicKey(DEVNET.SYSTEM_PROGRAM),
  RENT: new PublicKey(DEVNET.RENT),
  METADATA_PROGRAM: new PublicKey(DEVNET.METADATA_PROGRAM),
  SOLEND_PROGRAM: new PublicKey(DEVNET.SOLEND_PROGRAM),
  KAMINO_PROGRAM: new PublicKey(DEVNET.KAMINO_PROGRAM),
  LULO_PROGRAM: new PublicKey(DEVNET.LULO_PROGRAM),
  ONIONUSDP_PROGRAM: '11111111111111111111111111111111', // Placeholder
  USDC_MINT: '4HoKmEMnT6JqZEWc3c1VTW6bXeEGCS2U4SxZ7UYnwZjb', // Using your token
  PUSD_MINT: '4HoKmEMnT6JqZEWc3c1VTW6bXeEGCS2U4SxZ7UYnwZjb' // Using your token
} as const;

// Token constants
export const TOKEN_CONSTANTS = {
  DECIMALS: 6,
  SUPPLY: 1_000_000_000, // 1 billion tokens
  MINIMUM_BALANCE: 0.001,
  MAX_TRANSFER_AMOUNT: 1_000_000,
} as const;

// OnionUSD-P specific constants
export const PUSD_CONSTANTS = {
  DECIMALS: 6,
  MIN_FLOAT_PCT: 30, // 30% minimum float
  MAX_FLOAT_PCT: 60, // 60% maximum float
  DEFAULT_DAILY_REDEEM_LIMIT: 10000, // $10,000 daily limit
  DEFAULT_MONTHLY_REDEEM_LIMIT: 100000, // $100,000 monthly limit
  BUFFER_MULTIPLIER: 1.1, // 10% buffer for auto-liquidity
} as const;

// Strategy constants
export const STRATEGY_CONSTANTS = {
  STRATEGY_0: 0, // No yield (100% float)
  STRATEGY_1: 1, // Solend (low risk)
  STRATEGY_2: 2, // Kamino (medium risk)
  STRATEGY_3: 3, // Lulo (higher risk)
  MAX_STRATEGY_ID: 3,
} as const;

// Fee constants
export const FEES = {
  MINT_FEE: 0.001, // SOL
  BURN_FEE: 0.001, // SOL
  TRANSFER_FEE: 0.0005, // SOL
} as const;

// Time constants
export const TIME_CONSTANTS = {
  TRANSACTION_TIMEOUT: 30000, // 30 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3,
  DAILY_RESET_HOUR: 0, // UTC midnight
  MONTHLY_RESET_DAY: 1, // 1st of month
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error',
  INVALID_KEYPAIR: 'Invalid keypair',
  INSUFFICIENT_LIQUIDITY: 'Insufficient liquidity in yield strategies',
  FLOAT_BOUNDS_VIOLATION: 'Float bounds violation',
  REDEEM_LIMIT_EXCEEDED: 'Daily/monthly redeem limit exceeded',
  STRATEGY_NOT_AVAILABLE: 'Strategy not available',
  UNAUTHORIZED_OPERATION: 'Unauthorized operation',
} as const;

// PDA seeds
export const PDA_SEEDS = {
  CONFIG: 'config',
  RESERVE: 'reserve',
  YIELD_MASTER: 'yield-master',
  REDEEM_ALLOW: 'redeem-allow',
  PAYROLL_ESCROW: 'payroll-escrow',
} as const;