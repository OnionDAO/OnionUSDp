import { Keypair } from '@solana/web3.js';
import { readFileSync } from 'fs';

const kp = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync('pUSD/keypairs/treasury.json', 'utf-8'))));
console.log(kp.publicKey.toBase58()); 