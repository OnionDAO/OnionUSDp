import { Keypair } from '@solana/web3.js';
import { KeyPairSigner } from 'gill';
export interface KeypairInfo {
    keypair: Keypair;
    publicKey: string;
    signer?: KeyPairSigner;
}
/**
 * Load a Solana keypair from a JSON file
 */
export declare function loadKeypairFromFile(filePath: string): KeypairInfo;
/**
 * Convert Solana Keypair to Gill KeyPairSigner
 * Note: This is a placeholder - in a real implementation, you'd need to properly
 * convert the secret key format to Gill's expected format
 */
export declare function convertToGillSigner(keypair: Keypair): Promise<KeyPairSigner>;
/**
 * Load and convert a keypair file to both Solana Keypair and Gill KeyPairSigner
 */
export declare function loadKeypairWithSigner(filePath: string): Promise<KeypairInfo>;
/**
 * List available keypairs in the keypairs directory
 */
export declare function listAvailableKeypairs(): string[];
/**
 * Validate that a keypair file exists and is valid
 */
export declare function validateKeypairFile(filePath: string): boolean;
//# sourceMappingURL=keypair-helper.d.ts.map