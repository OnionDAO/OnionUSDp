declare const execSync: any;
declare const logger: any;
/**
 * Run a shell command and log output
 * @param {string} cmd
 * @returns {string}
 */
declare function runCmd(cmd: string): string;
/**
 * Create a mint with confidential transfers enabled
 * @returns {string}
 */
declare function createConfidentialMint(): string;
/**
 * Create a token account for a given mint
 * @param {string} mintPubkey
 * @returns {string}
 */
declare function createAccount(mintPubkey: string): string;
/**
 * Configure a token account for confidential transfers
 * @param {string} accountPubkey
 * @returns {string}
 */
declare function configureConfidentialAccount(accountPubkey: string): string;
/**
 * Deposit tokens into confidential balance
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} accountPubkey
 * @returns {string}
 */
declare function depositConfidentialTokens(mintPubkey: string, amount: string | number, accountPubkey: string): string;
/**
 * Apply pending balance
 * @param {string} accountPubkey
 * @returns {string}
 */
declare function applyPendingBalance(accountPubkey: string): string;
/**
 * Transfer confidential tokens
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} destinationPubkey
 * @returns {string}
 */
declare function transferConfidentialTokens(mintPubkey: string, amount: string | number, destinationPubkey: string): string;
/**
 * Withdraw confidential tokens
 * @param {string} mintPubkey
 * @param {string|number} amount
 * @param {string} accountPubkey
 * @returns {string}
 */
declare function withdrawConfidentialTokens(mintPubkey: string, amount: string | number, accountPubkey: string): string;
//# sourceMappingURL=confidential.d.ts.map