// src/lib/confidential.ts - Node.js automation for Token-2022 Confidential Transfers using Solana CLI
const { execSync } = require('child_process');
const { logger } = require('../utils/logger');
/**
 * Run a shell command and log output
 * @param {string} cmd
 * @returns {string}
 */
function runCmd(cmd) {
    logger.info(`Running: ${cmd}`);
    try {
        const output = execSync(cmd, { stdio: 'pipe' });
        logger.info(output.toString());
        return output.toString();
    }
    catch (error) {
        logger.error(`Command failed: ${cmd}`);
        logger.error(error.stderr ? error.stderr.toString() : error.message);
        throw error;
    }
}
/**
 * Create a mint with confidential transfers enabled
 * @returns {string}
 */
function createConfidentialMint() {
    const cmd = 'spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --enable-confidential-transfers auto';
    return runCmd(cmd);
}
/**
 * Create a token account for a given mint
 * @param {string} mintPubkey
 * @returns {string}
 */
function createAccount(mintPubkey, ownerPubkey, feePayerPath) {
    const cmd = `spl-token create-account ${mintPubkey} --owner ${ownerPubkey} --fee-payer ${feePayerPath} --url https://api.devnet.solana.com`;
    try {
      return runCmd(cmd);
    } catch (error) {
      if (error.message && error.message.includes('Account already exists')) {
        console.log('Token account already exists, continuing...');
        return;
      }
      throw error;
    }
  }
/**
 * Configure a token account for confidential transfers
 * @param {string} accountPubkey
 * @returns {string}
 */
function configureConfidentialAccount(accountPubkey) {
    const cmd = `spl-token configure-confidential-transfer-account --address ${accountPubkey}`;
    return runCmd(cmd);
}
/**
 * Deposit tokens into confidential balance
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} accountPubkey
 * @returns {string}
 */
function depositConfidentialTokens(mintPubkey, amount, accountPubkey) {
    const cmd = `spl-token deposit-confidential-tokens ${mintPubkey} ${amount} --address ${accountPubkey}`;
    return runCmd(cmd);
}
/**
 * Apply pending balance
 * @param {string} accountPubkey
 * @returns {string}
 */
function applyPendingBalance(accountPubkey) {
    const cmd = `spl-token apply-pending-balance --address ${accountPubkey}`;
    return runCmd(cmd);
}
/**
 * Transfer confidential tokens
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} destinationPubkey
 * @returns {string}
 */
function transferConfidentialTokens(mintPubkey, amount, destinationPubkey) {
    const cmd = `spl-token transfer ${mintPubkey} ${amount} ${destinationPubkey} --confidential`;
    return runCmd(cmd);
}
/**
 * Withdraw confidential tokens
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} accountPubkey
 * @returns {string}
 */
function withdrawConfidentialTokens(mintPubkey, amount, accountPubkey) {
    const cmd = `spl-token withdraw-confidential-tokens ${mintPubkey} ${amount} --address ${accountPubkey}`;
    return runCmd(cmd);
}
// Export all automation functions
module.exports = {
    createConfidentialMint,
    createAccount,
    configureConfidentialAccount,
    depositConfidentialTokens,
    applyPendingBalance,
    transferConfidentialTokens,
    withdrawConfidentialTokens,
};
