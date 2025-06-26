"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveManager = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
class ReserveManager {
    constructor(connection, payer) {
        this.connection = connection;
        this.payer = payer;
    }
    async initReserve(mint) {
        // Create a PDA for the reserve vault
        const [reservePDA] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from('reserve'), mint.toBuffer()], spl_token_1.TOKEN_2022_PROGRAM_ID);
        const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, reservePDA, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const tx = new web3_js_1.Transaction();
        tx.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(this.payer.publicKey, ata, reservePDA, mint, spl_token_1.TOKEN_2022_PROGRAM_ID));
        await (0, web3_js_1.sendAndConfirmTransaction)(this.connection, tx, [this.payer]);
        return ata;
    }
    async depositUSDC(amount, user, mint) {
        // Transfer USDC from user to reserve vault
        const [reservePDA] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from('reserve'), mint.toBuffer()], spl_token_1.TOKEN_2022_PROGRAM_ID);
        const userATA = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, user.publicKey, false, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const reserveATA = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, reservePDA, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const tx = new web3_js_1.Transaction();
        tx.add((0, spl_token_1.createTransferInstruction)(userATA, reserveATA, user.publicKey, amount, [], spl_token_1.TOKEN_2022_PROGRAM_ID));
        const sig = await (0, web3_js_1.sendAndConfirmTransaction)(this.connection, tx, [user]);
        return sig;
    }
    async getReserveBalance(mint) {
        const [reservePDA] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from('reserve'), mint.toBuffer()], spl_token_1.TOKEN_2022_PROGRAM_ID);
        const reserveATA = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, reservePDA, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
        const accountInfo = await this.connection.getTokenAccountBalance(reserveATA);
        return BigInt(accountInfo.value.amount);
    }
}
exports.ReserveManager = ReserveManager;
//# sourceMappingURL=reserves.js.map