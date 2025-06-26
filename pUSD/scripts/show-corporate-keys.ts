import { Keypair } from '@solana/web3.js';
import { readFileSync } from 'fs';

const TREASURY_KEYPAIR_PATH = 'pUSD/keypairs/treasury.json';
const CORPORATE_MULTISIG_PATH = 'pUSD/keypairs/corporate-multisig.json';
const YIELD_WALLET_PATH = 'pUSD/keypairs/yield-wallet.json';

function loadPubkey(keypairPath: string): string {
  const kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(keypairPath, 'utf-8'))));
  return kp.publicKey.toBase58();
}

console.log('Treasury Authority:', loadPubkey(TREASURY_KEYPAIR_PATH));
console.log('Corporate Multisig:', loadPubkey(CORPORATE_MULTISIG_PATH));
console.log('Yield Wallet:', loadPubkey(YIELD_WALLET_PATH)); 