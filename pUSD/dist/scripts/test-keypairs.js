#!/usr/bin/env tsx
import { loadKeypairWithSigner, listAvailableKeypairs } from '../utils/keypair-helper';
import { logger } from '../utils/logger';
async function main() {
    try {
        logger.info('Testing keypair loading...');
        // List available keypairs
        const keypairs = listAvailableKeypairs();
        logger.info(`Found ${keypairs.length} keypairs:`);
        // Test loading each keypair
        for (const keypairFile of keypairs) {
            try {
                logger.info(`Testing ${keypairFile}...`);
                const keypairInfo = await loadKeypairWithSigner(`keypairs/${keypairFile}`);
                logger.info(`  ✓ Loaded: ${keypairInfo.publicKey}`);
                // Verify the keypair has valid properties
                if (keypairInfo.keypair.publicKey.toBytes().length === 32) {
                    logger.info(`  ✓ Valid public key (32 bytes)`);
                }
                else {
                    logger.warn(`  ⚠ Invalid public key length`);
                }
                if (keypairInfo.signer) {
                    logger.info(`  ✓ Gill signer created`);
                }
                else {
                    logger.warn(`  ⚠ No Gill signer created`);
                }
            }
            catch (error) {
                logger.error(`  ✗ Failed to load ${keypairFile}:`, error);
            }
        }
        logger.info('Keypair testing completed!');
    }
    catch (error) {
        logger.error('Test failed:', error);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=test-keypairs.js.map