import { PublicKey } from '@solana/web3.js';
export declare const NETWORKS: {
    readonly MAINNET: "mainnet-beta";
    readonly DEVNET: "devnet";
    readonly TESTNET: "testnet";
    readonly LOCALNET: "localnet";
};
export declare const DEFAULT_NETWORK: "devnet";
export declare const PUSD_CONFIG: {
    readonly mint: "8GzpAzmBLSHsNQhGFwhokEDziXJAQm7C9P7x3YQYqf4x";
    readonly network: "devnet";
    readonly program: "Token2022";
};
export declare const PROGRAM_IDS: {
    readonly TOKEN_PROGRAM: PublicKey;
    readonly TOKEN_2022_PROGRAM: PublicKey;
    readonly ASSOCIATED_TOKEN_PROGRAM: PublicKey;
    readonly SYSTEM_PROGRAM: PublicKey;
    readonly RENT: PublicKey;
    readonly METADATA_PROGRAM: PublicKey;
    readonly SOLEND_PROGRAM: PublicKey;
    readonly KAMINO_PROGRAM: PublicKey;
    readonly LULO_PROGRAM: PublicKey;
    readonly USDC_MINT: PublicKey;
    readonly PUSD_MINT: PublicKey;
    readonly ONIONUSDP_PROGRAM: PublicKey;
};
export declare const TOKEN_CONSTANTS: {
    readonly DECIMALS: 6;
    readonly SUPPLY: 1000000000;
    readonly MINIMUM_BALANCE: 0.001;
    readonly MAX_TRANSFER_AMOUNT: 1000000;
};
export declare const PUSD_CONSTANTS: {
    readonly DECIMALS: 6;
    readonly MIN_FLOAT_PCT: 30;
    readonly MAX_FLOAT_PCT: 60;
    readonly DEFAULT_DAILY_REDEEM_LIMIT: 10000;
    readonly DEFAULT_MONTHLY_REDEEM_LIMIT: 100000;
    readonly BUFFER_MULTIPLIER: 1.1;
};
export declare const STRATEGY_CONSTANTS: {
    readonly STRATEGY_0: 0;
    readonly STRATEGY_1: 1;
    readonly STRATEGY_2: 2;
    readonly STRATEGY_3: 3;
    readonly MAX_STRATEGY_ID: 3;
};
export declare const FEES: {
    readonly MINT_FEE: 0.001;
    readonly BURN_FEE: 0.001;
    readonly TRANSFER_FEE: 0.0005;
};
export declare const TIME_CONSTANTS: {
    readonly TRANSACTION_TIMEOUT: 30000;
    readonly RETRY_DELAY: 1000;
    readonly MAX_RETRIES: 3;
    readonly DAILY_RESET_HOUR: 0;
    readonly MONTHLY_RESET_DAY: 1;
};
export declare const ERROR_MESSAGES: {
    readonly INSUFFICIENT_BALANCE: "Insufficient balance";
    readonly INVALID_AMOUNT: "Invalid amount";
    readonly TRANSACTION_FAILED: "Transaction failed";
    readonly NETWORK_ERROR: "Network error";
    readonly INVALID_KEYPAIR: "Invalid keypair";
    readonly INSUFFICIENT_LIQUIDITY: "Insufficient liquidity in yield strategies";
    readonly FLOAT_BOUNDS_VIOLATION: "Float bounds violation";
    readonly REDEEM_LIMIT_EXCEEDED: "Daily/monthly redeem limit exceeded";
    readonly STRATEGY_NOT_AVAILABLE: "Strategy not available";
    readonly UNAUTHORIZED_OPERATION: "Unauthorized operation";
};
export declare const PDA_SEEDS: {
    readonly CONFIG: "config";
    readonly RESERVE: "reserve";
    readonly YIELD_MASTER: "yield-master";
    readonly REDEEM_ALLOW: "redeem-allow";
    readonly PAYROLL_ESCROW: "payroll-escrow";
};
//# sourceMappingURL=constants.d.ts.map