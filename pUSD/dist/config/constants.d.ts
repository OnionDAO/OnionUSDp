import { PublicKey } from '@solana/web3.js';
export declare const NETWORKS: {
    readonly MAINNET: "mainnet-beta";
    readonly DEVNET: "devnet";
    readonly TESTNET: "testnet";
    readonly LOCALNET: "localnet";
};
export declare const DEFAULT_NETWORK: "devnet";
export declare const PROGRAM_IDS: {
    readonly TOKEN_PROGRAM: PublicKey;
    readonly TOKEN_2022_PROGRAM: PublicKey;
    readonly ASSOCIATED_TOKEN_PROGRAM: PublicKey;
    readonly SYSTEM_PROGRAM: PublicKey;
    readonly RENT: PublicKey;
    readonly METADATA_PROGRAM: PublicKey;
};
export declare const TOKEN_CONSTANTS: {
    readonly DECIMALS: 6;
    readonly SUPPLY: 1000000000;
    readonly MINIMUM_BALANCE: 0.001;
    readonly MAX_TRANSFER_AMOUNT: 1000000;
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
};
export declare const ERROR_MESSAGES: {
    readonly INSUFFICIENT_BALANCE: "Insufficient balance";
    readonly INVALID_AMOUNT: "Invalid amount";
    readonly TRANSACTION_FAILED: "Transaction failed";
    readonly NETWORK_ERROR: "Network error";
    readonly INVALID_KEYPAIR: "Invalid keypair";
};
//# sourceMappingURL=constants.d.ts.map