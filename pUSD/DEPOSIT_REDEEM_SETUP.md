# OnionUSD-P Deposit and Redeem Setup with Actual Keypairs

## Overview

This document describes the implementation of deposit and redeem functionality for the OnionUSD-P stablecoin system using actual keypairs from the `keypairs/` directory.

## Available Keypairs

The system includes 8 keypairs for different purposes:

1. **corporate-multisig-fresh.json** - `7XyxWkvvezLzLVZGTANRcvoDsKgk9CV75yHJNCVQEWz2`
2. **corporate-multisig.json** - `3wSF6aihdBasvLEuyGWeQ5tpYz9HrX61k2MnCTGbQKnZ`
3. **payer.json** - `E9TtUJmNsDHBmdgGAuWqgA551FFTfSSmoAfLnq7QMQLT`
4. **pusdc-mint.json** - `8pdJfH8EzMhJh7upHrRVTWarfeWbQRtcyyuigZemQ8Nn`
5. **treasury.json** - `3Hx2t3jQJXBPuHtKoXpcM8Sxc2PxoVHbnLT8AH2DQBxd`
6. **usdc-mint.json** - `CKouQTtuVgXQzGXT7eqLkPKxwY6zNXj9SKbDLZQqPTMx`
7. **user.json** - `DWhsuaag28nhCFh7kLy9t53iPsaCNHiREdqfQUReADpt`
8. **yield-wallet.json** - `3xBkcwkpTupbHQkYyy5zSv8UMpouB8LB7gEH3FkaoBc8`

## Keypair Utility Helper

Created `src/utils/keypair-helper.ts` with the following functions:

- `loadKeypairFromFile(filePath)` - Load Solana keypair from JSON file
- `convertToGillSigner(keypair)` - Convert Solana Keypair to Gill KeyPairSigner
- `loadKeypairWithSigner(filePath)` - Load keypair and convert to signer
- `listAvailableKeypairs()` - List all available keypair files
- `validateKeypairFile(filePath)` - Validate keypair file format

## CLI Scripts

### Deposit CLI (`src/scripts/cli-deposit.ts`)

**Usage:**
```bash
npm run cli:deposit -- --amount 100 --payer keypairs/payer.json --dry-run
```

**Options:**
- `--amount` (required) - Amount of USDC to deposit
- `--payer` - Path to payer keypair file (default: keypairs/payer.json)
- `--rpc` - RPC URL (default: https://api.devnet.solana.com)
- `--network` - Network (devnet or mainnet-beta, default: devnet)
- `--dry-run` - Dry run mode (no actual transactions)
- `--list-keypairs` - List available keypairs

**Features:**
- Loads actual keypair from file
- Converts to Gill KeyPairSigner
- Checks payer SOL balance
- Initializes config if needed
- Performs USDC deposit and pUSD minting

### Redeem CLI (`src/scripts/cli-redeem.ts`)

**Usage:**
```bash
npm run cli:redeem -- --amount 50 --wallet keypairs/user.json --dry-run
```

**Options:**
- `--amount` (required) - Amount of pUSD to redeem
- `--wallet` (required) - Path to wallet keypair file
- `--rpc` - RPC URL (default: https://api.devnet.solana.com)
- `--network` - Network (devnet or mainnet-beta, default: devnet)
- `--dry-run` - Dry run mode (no actual transactions)
- `--list-keypairs` - List available keypairs

**Features:**
- Loads actual wallet keypair from file
- Converts to Gill KeyPairSigner
- Checks wallet SOL balance
- Validates redeem allow list
- Performs pUSD redemption for USDC

## Testing

### Keypair Test Script

Run `npm run test:keypairs` to verify all keypairs load correctly:

```bash
npm run test:keypairs
```

This script:
- Lists all available keypairs
- Loads each keypair file
- Validates public key format (32 bytes)
- Creates Gill signers
- Reports success/failure for each keypair

### Dry Run Testing

Test deposit functionality:
```bash
npm run cli:deposit -- --amount 100 --dry-run
```

Test redeem functionality:
```bash
npm run cli:redeem -- --amount 50 --wallet keypairs/user.json --dry-run
```

## Implementation Details

### Keypair Loading Process

1. **File Reading**: Load JSON array from keypair file
2. **Keypair Creation**: Create Solana Keypair from secret key bytes
3. **Signer Conversion**: Convert to Gill KeyPairSigner (placeholder implementation)
4. **Validation**: Verify public key format and length

### Transaction Flow

**Deposit Flow:**
1. Load payer keypair and convert to signer
2. Check payer SOL balance
3. Initialize config if not exists
4. Create transaction instructions:
   - Create ATA for treasury USDC
   - Create ATA for payer pUSD
   - Transfer USDC from payer to treasury
   - Mint pUSD to payer
5. Sign and send transaction

**Redeem Flow:**
1. Load employee wallet keypair and convert to signer
2. Check wallet SOL balance
3. Validate redeem allow list
4. Create transaction instructions:
   - Create ATA for employee USDC
   - Burn pUSD from employee
   - Transfer USDC from treasury to employee
   - Update redeem allow entry
5. Sign and send transaction

## Current Status

✅ **Completed:**
- Keypair loading and validation
- CLI script framework
- Dry run functionality
- Keypair testing
- Basic transaction structure

⚠️ **Known Issues:**
- TypeScript linter errors due to Gill SDK type mismatches
- Placeholder Gill signer conversion (needs proper implementation)
- On-chain program not deployed (expected RPC errors)

🔄 **Next Steps:**
1. Deploy OnionUSD-P program to devnet
2. Initialize config PDA
3. Set up token mints
4. Test actual transactions
5. Implement proper Gill signer conversion

## Usage Examples

### List Available Keypairs
```bash
npm run cli:deposit -- --list-keypairs
```

### Deposit 100 USDC (Dry Run)
```bash
npm run cli:deposit -- --amount 100 --payer keypairs/payer.json --dry-run
```

### Redeem 50 pUSD (Dry Run)
```bash
npm run cli:redeem -- --amount 50 --wallet keypairs/user.json --dry-run
```

### Test All Keypairs
```bash
npm run test:keypairs
```

## Security Notes

- Keypairs are stored as JSON arrays of secret key bytes
- In production, use secure key management
- Never commit actual keypairs to version control
- Use different keypairs for different environments
- Implement proper multisig for corporate operations

## Error Handling

The CLI scripts include comprehensive error handling:
- Invalid keypair file format
- Missing keypair files
- Network connection issues
- Transaction failures
- Balance insufficient errors
- Redeem allow list validation

All errors are logged with appropriate context and the process exits with code 1 on failure. 