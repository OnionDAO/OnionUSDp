import { type SolanaClient, type KeyPairSigner, type Address } from "gill";
import { Connection } from '@solana/web3.js';
import { TransactionResult } from '../types/transaction';
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
export declare class GillTokenManager {
    private client;
    private connection;
    private tokenProgram;
    constructor(client: SolanaClient, connection: Connection, useToken2022?: boolean);
    /**
     * Create a new token with metadata using Gill
     */
    createToken(payer: KeyPairSigner, options: TokenCreationOptions): Promise<TokenInfo>;
    /**
     * Create pUSD token with specific configuration
     */
    createPUSDToken(payer: KeyPairSigner, network?: string): Promise<TokenInfo>;
    /**
     * Airdrop SOL to a signer (for testing)
     */
    airdropSOL(recipient: KeyPairSigner, amount?: bigint): Promise<TransactionResult>;
    /**
     * Get token balance using Gill
     */
    getTokenBalance(mint: Address, owner: Address): Promise<bigint>;
    /**
     * Get mint info using Gill
     */
    getMintInfo(mint: Address): Promise<(Readonly<{
        executable: boolean;
        lamports: import("gill").Lamports;
        owner: Address;
        rentEpoch: bigint;
        space: bigint;
    }> & Readonly<{
        data: import("gill").Base58EncodedBytes;
    }>) | null>;
}
//# sourceMappingURL=token.d.ts.map