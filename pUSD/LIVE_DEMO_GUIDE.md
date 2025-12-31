# OnionUSD-P Live Demo Guide
## Real Transactions & Confidential Token Minting

### 🎬 Demo Overview

This guide covers running a **live demo** of the OnionUSD-P system with **real transactions** sent to Solana devnet, including:

- ✅ Real USDC deposits and pUSD minting
- ✅ Real pUSD redemptions with allow list validation  
- ✅ Real confidential pUSDC token minting
- ✅ Real treasury rebalancing transactions
- ✅ Actual keypair funding with SOL airdrops

---

## 🚀 Pre-Demo Setup

### 1. Environment Requirements
```bash
# Ensure you're in the project directory
cd /Users/haotianli/Desktop/OnionUSDp/pUSD

# Install dependencies
npm install

# Verify all scripts work
./QUICK_DEMO_TEST.sh
```

### 2. Keypair Funding (Required)
Before running the demo, fund your keypairs with SOL for transaction fees:

```bash
# Fund all keypairs with 0.1 SOL each
npm run fund:keypairs -- --amount 0.1

# Or fund a specific keypair
npm run fund:keypairs -- --keypair payer.json --amount 0.2
```

**Note:** Devnet airdrops are limited, so you may need to wait between requests.

---

## 🎥 Running the Live Demo

### Option 1: Interactive Demo Runner
```bash
# Start the automated demo with pauses for narration
./DEMO_RUNNER.sh
```

### Option 2: Manual Demo (Following Script)
Follow the `VIDEO_DEMO_SCRIPT.md` but remove `--dry-run` flags from all commands.

---

## 📋 Demo Scenes

### Scene 1: Introduction & Project Overview
- Show project structure
- Display available keypairs
- List npm scripts

### Scene 2: Keypair Validation
```bash
npm run test:keypairs
```
- Validates all 8 keypairs
- Confirms Gill signer conversion

### Scene 2.5: Keypair Funding ⭐ NEW
```bash
npm run fund:keypairs -- --amount 0.1
```
- Funds all keypairs with SOL
- Enables real transactions

### Scene 3: Real USDC Deposit
```bash
npm run cli:deposit -- --amount 100 --payer keypairs/payer.json
```
- **Real transaction** to devnet
- Transfers USDC to treasury
- Mints pUSD tokens

### Scene 4: Real pUSD Redemption
```bash
npm run cli:redeem -- --amount 50 --wallet keypairs/user.json
```
- **Real transaction** to devnet
- Burns pUSD tokens
- Transfers USDC to employee
- Validates allow list

### Scene 5: System Validation
```bash
npm run test:onionusdp
```
- Comprehensive system test
- Validates all components

### Scene 6: Real Confidential pUSDC Minting
```bash
npm run mint:confidential -- --amount 100 --wallet keypairs/user.json
```
- **Real confidential transaction**
- Zero-knowledge proof generation
- Privacy-preserving minting

### Scene 7: Real Treasury Rebalancing
```bash
npm run bot:rebalance
```
- **Real rebalancing transaction**
- Monitors float ratios
- Adjusts treasury positions

---

## 🔧 Available Commands

### Core CLI Commands
```bash
# Deposit USDC and mint pUSD
npm run cli:deposit -- --amount <amount> --payer <keypair>

# Redeem pUSD for USDC
npm run cli:redeem -- --amount <amount> --wallet <keypair>

# List available keypairs
npm run cli:deposit -- --list-keypairs
npm run cli:redeem -- --list-keypairs
```

### Testing Commands
```bash
# Test all keypairs
npm run test:keypairs

# Test system components
npm run test:onionusdp

# Test confidential integration
npm run test:confidential
```

### Funding Commands
```bash
# Fund all keypairs
npm run fund:keypairs -- --amount 0.1

# Fund specific keypair
npm run fund:keypairs -- --keypair payer.json --amount 0.2
```

### Advanced Commands
```bash
# Confidential token minting
npm run mint:confidential -- --amount <amount> --wallet <keypair>

# Treasury rebalancing
npm run bot:rebalance

# Rebalance with custom interval
npm run bot:rebalance -- --interval 15
```

---

## ⚠️ Important Notes

### Transaction Costs
- Each transaction costs ~0.000005 SOL (devnet)
- Fund keypairs with at least 0.1 SOL each
- Monitor balances during demo

### Network Considerations
- Using Solana **devnet** for safety
- Transactions may take 2-5 seconds to confirm
- Network congestion may cause delays

### Error Handling
- If transactions fail, check SOL balance
- If airdrops fail, wait and retry
- If RPC errors occur, try different endpoint

### Demo Timing
- **Total Duration:** ~10-15 minutes
- **Scene Duration:** 1-3 minutes each
- **Transaction Wait:** 2-5 seconds per transaction

---

## 🎯 Demo Highlights

### Real Transactions
- ✅ No dry-run mode
- ✅ Actual blockchain transactions
- ✅ Real token transfers and minting
- ✅ Live balance updates

### Privacy Features
- ✅ Confidential computing integration
- ✅ Zero-knowledge proofs
- ✅ Encrypted balance tracking
- ✅ Privacy-preserving transactions

### Security Features
- ✅ Real keypair validation
- ✅ Allow list enforcement
- ✅ Treasury security measures
- ✅ Automated rebalancing

---

## 🚨 Troubleshooting

### Common Issues

**1. Insufficient SOL Balance**
```bash
# Check balance
npm run fund:keypairs -- --keypair payer.json --amount 0.1
```

**2. Transaction Failures**
```bash
# Check network status
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' https://api.devnet.solana.com
```

**3. RPC Timeouts**
```bash
# Try alternative RPC
npm run cli:deposit -- --rpc https://solana-devnet.rpc.extrnode.com --amount 100
```

**4. Keypair Loading Errors**
```bash
# Validate keypairs
npm run test:keypairs
```

### Emergency Fallback
If the demo fails, you can always run:
```bash
# Quick system check
npm run test:onionusdp

# Simple deposit test
npm run cli:deposit -- --amount 10 --payer keypairs/payer.json
```

---

## 🎉 Success Indicators

### Green Flags
- ✅ All keypairs load successfully
- ✅ SOL funding completes without errors
- ✅ Transactions confirm within 5 seconds
- ✅ Balance updates reflect transactions
- ✅ No RPC errors or timeouts

### Demo Completion
- ✅ All 7 scenes completed
- ✅ Real transactions sent and confirmed
- ✅ Confidential minting successful
- ✅ Treasury rebalancing active
- ✅ System validation passed

---

**Ready to run your live OnionUSD-P demo! 🚀**

Remember: This demo sends **real transactions** to devnet, so ensure all keypairs are properly funded before starting. 