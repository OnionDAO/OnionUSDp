import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

export class ReserveManager {
  connection: Connection;
  payer: Keypair;

  constructor(connection: Connection, payer: Keypair) {
    this.connection = connection;
    this.payer = payer;
  }

  async initReserve(mint: PublicKey): Promise<PublicKey> {
    // Create a PDA for the reserve vault
    const [reservePDA] = await PublicKey.findProgramAddress(
      [Buffer.from('reserve'), mint.toBuffer()],
      TOKEN_2022_PROGRAM_ID
    );
    const ata = getAssociatedTokenAddressSync(mint, reservePDA, true, TOKEN_2022_PROGRAM_ID);
    const tx = new Transaction();
    tx.add(
      createAssociatedTokenAccountInstruction(
        this.payer.publicKey,
        ata,
        reservePDA,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
    await sendAndConfirmTransaction(this.connection, tx, [this.payer]);
    return ata;
  }

  async depositUSDC(amount: bigint, user: Keypair, mint: PublicKey): Promise<string> {
    // Transfer USDC from user to reserve vault
    const [reservePDA] = await PublicKey.findProgramAddress(
      [Buffer.from('reserve'), mint.toBuffer()],
      TOKEN_2022_PROGRAM_ID
    );
    const userATA = getAssociatedTokenAddressSync(mint, user.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const reserveATA = getAssociatedTokenAddressSync(mint, reservePDA, true, TOKEN_2022_PROGRAM_ID);
    const tx = new Transaction();
    tx.add(
      createTransferInstruction(
        userATA,
        reserveATA,
        user.publicKey,
        amount,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
    const sig = await sendAndConfirmTransaction(this.connection, tx, [user]);
    return sig;
  }

  async getReserveBalance(mint: PublicKey): Promise<bigint> {
    const [reservePDA] = await PublicKey.findProgramAddress(
      [Buffer.from('reserve'), mint.toBuffer()],
      TOKEN_2022_PROGRAM_ID
    );
    const reserveATA = getAssociatedTokenAddressSync(mint, reservePDA, true, TOKEN_2022_PROGRAM_ID);
    const accountInfo = await this.connection.getTokenAccountBalance(reserveATA);
    return BigInt(accountInfo.value.amount);
  }
}
