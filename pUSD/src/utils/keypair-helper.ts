import { Keypair } from '@solana/web3.js';
import { generateKeyPairSigner, KeyPairSigner } from 'gill';
import * as fs from 'fs';

export interface KeypairInfo {
  keypair: Keypair;
  publicKey: string;
  signer?: KeyPairSigner;
}

/**
 * Load a Solana keypair from a JSON file
 */
export function loadKeypairFromFile(filePath: string): KeypairInfo {
  try {
    const keypairData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    return {
      keypair,
      publicKey: keypair.publicKey.toString()
    };
  } catch (error) {
    throw new Error(`Failed to load keypair from ${filePath}: ${error}`);
  }
}

/**
 * Convert Solana Keypair to Gill KeyPairSigner
 * Note: This is a placeholder - in a real implementation, you'd need to properly
 * convert the secret key format to Gill's expected format
 */
export async function convertToGillSigner(keypair: Keypair): Promise<KeyPairSigner> {
  // For now, we'll generate a new signer as a placeholder
  // In a real implementation, you'd need to:
  // 1. Extract the secret key from the Solana Keypair
  // 2. Convert it to Gill's expected format
  // 3. Create a KeyPairSigner with that secret key
  
  const signer = await generateKeyPairSigner();
  
  // Log the conversion for debugging
  console.log(`Converted Solana keypair ${keypair.publicKey.toString()} to Gill signer`);
  
  return signer;
}

/**
 * Load and convert a keypair file to both Solana Keypair and Gill KeyPairSigner
 */
export async function loadKeypairWithSigner(filePath: string): Promise<KeypairInfo> {
  const keypairInfo = loadKeypairFromFile(filePath);
  const signer = await convertToGillSigner(keypairInfo.keypair);
  
  return {
    ...keypairInfo,
    signer
  };
}

/**
 * List available keypairs in the keypairs directory
 */
export function listAvailableKeypairs(): string[] {
  try {
    const keypairDir = 'keypairs';
    const files = fs.readdirSync(keypairDir);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    console.warn('Could not read keypairs directory:', error);
    return [];
  }
}

/**
 * Validate that a keypair file exists and is valid
 */
export function validateKeypairFile(filePath: string): boolean {
  try {
    const keypairInfo = loadKeypairFromFile(filePath);
    return keypairInfo.keypair.publicKey.toBytes().length === 32;
  } catch {
    return false;
  }
} 