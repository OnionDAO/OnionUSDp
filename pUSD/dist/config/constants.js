import { PublicKey } from '@solana/web3.js';
import { DEVNET } from './networks';
// Network constants
export const NETWORKS = {
    MAINNET: 'mainnet-beta',
    DEVNET: 'devnet',
    TESTNET: 'testnet',
    LOCALNET: 'localnet'
};
// Default network
export const DEFAULT_NETWORK = NETWORKS.DEVNET;
// Program IDs (from networks)
export const PROGRAM_IDS = {
    TOKEN_PROGRAM: new PublicKey(DEVNET.TOKEN_PROGRAM),
    TOKEN_2022_PROGRAM: new PublicKey(DEVNET.TOKEN_2022_PROGRAM),
    ASSOCIATED_TOKEN_PROGRAM: new PublicKey(DEVNET.ASSOCIATED_TOKEN_PROGRAM),
    SYSTEM_PROGRAM: new PublicKey(DEVNET.SYSTEM_PROGRAM),
    RENT: new PublicKey(DEVNET.RENT),
    METADATA_PROGRAM: new PublicKey(DEVNET.METADATA_PROGRAM),
};
// Token constants
export const TOKEN_CONSTANTS = {
    DECIMALS: 6,
    SUPPLY: 1000000000, // 1 billion tokens
    MINIMUM_BALANCE: 0.001,
    MAX_TRANSFER_AMOUNT: 1000000,
};
// Fee constants
export const FEES = {
    MINT_FEE: 0.001, // SOL
    BURN_FEE: 0.001, // SOL
    TRANSFER_FEE: 0.0005, // SOL
};
// Time constants
export const TIME_CONSTANTS = {
    TRANSACTION_TIMEOUT: 30000, // 30 seconds
    RETRY_DELAY: 1000, // 1 second
    MAX_RETRIES: 3,
};
// Error messages
export const ERROR_MESSAGES = {
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_AMOUNT: 'Invalid amount',
    TRANSACTION_FAILED: 'Transaction failed',
    NETWORK_ERROR: 'Network error',
    INVALID_KEYPAIR: 'Invalid keypair',
};
const PUSD_CONFIG = {
    mint: "8GzpAzmBLSHsNQhGFwhokEDziXJAQm7C9P7x3YQYqf4x",
    network: "devnet",
    program: "Token2022"
};
//# sourceMappingURL=constants.js.map