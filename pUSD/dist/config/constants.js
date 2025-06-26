"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.TIME_CONSTANTS = exports.FEES = exports.TOKEN_CONSTANTS = exports.PROGRAM_IDS = exports.DEFAULT_NETWORK = exports.NETWORKS = void 0;
const web3_js_1 = require("@solana/web3.js");
const networks_1 = require("./networks");
// Network constants
exports.NETWORKS = {
    MAINNET: 'mainnet-beta',
    DEVNET: 'devnet',
    TESTNET: 'testnet',
    LOCALNET: 'localnet'
};
// Default network
exports.DEFAULT_NETWORK = exports.NETWORKS.DEVNET;
// Program IDs (from networks)
exports.PROGRAM_IDS = {
    TOKEN_PROGRAM: new web3_js_1.PublicKey(networks_1.DEVNET.TOKEN_PROGRAM),
    TOKEN_2022_PROGRAM: new web3_js_1.PublicKey(networks_1.DEVNET.TOKEN_2022_PROGRAM),
    ASSOCIATED_TOKEN_PROGRAM: new web3_js_1.PublicKey(networks_1.DEVNET.ASSOCIATED_TOKEN_PROGRAM),
    SYSTEM_PROGRAM: new web3_js_1.PublicKey(networks_1.DEVNET.SYSTEM_PROGRAM),
    RENT: new web3_js_1.PublicKey(networks_1.DEVNET.RENT),
    METADATA_PROGRAM: new web3_js_1.PublicKey(networks_1.DEVNET.METADATA_PROGRAM),
};
// Token constants
exports.TOKEN_CONSTANTS = {
    DECIMALS: 6,
    SUPPLY: 1000000000, // 1 billion tokens
    MINIMUM_BALANCE: 0.001,
    MAX_TRANSFER_AMOUNT: 1000000,
};
// Fee constants
exports.FEES = {
    MINT_FEE: 0.001, // SOL
    BURN_FEE: 0.001, // SOL
    TRANSFER_FEE: 0.0005, // SOL
};
// Time constants
exports.TIME_CONSTANTS = {
    TRANSACTION_TIMEOUT: 30000, // 30 seconds
    RETRY_DELAY: 1000, // 1 second
    MAX_RETRIES: 3,
};
// Error messages
exports.ERROR_MESSAGES = {
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