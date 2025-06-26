import { Connection, PublicKey, Keypair } from '@solana/web3.js';
export declare class ReserveManager {
    connection: Connection;
    payer: Keypair;
    constructor(connection: Connection, payer: Keypair);
    initReserve(mint: PublicKey): Promise<PublicKey>;
    depositUSDC(amount: bigint, user: Keypair, mint: PublicKey): Promise<string>;
    getReserveBalance(mint: PublicKey): Promise<bigint>;
}
//# sourceMappingURL=reserves.d.ts.map