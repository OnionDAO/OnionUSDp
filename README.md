# OnionUSD-P: Privacy-Preserving Payroll Platform

[![Solana](https://img.shields.io/badge/Solana-Token--2022-9945FF?style=flat&logo=solana)](https://solana.com)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)

A blockchain payroll platform enabling companies to process **confidential salary payments** using privacy-preserving stablecoins on Solana.

## 🚀 Features

- **Private Payments**: Transaction amounts hidden on-chain using Solana Token-2022
- **pUSD Stablecoin**: 1:1 USDC-backed token with confidential transfers
- **Corporate Treasury**: Multi-sig wallet management with automated conversions
- **Solana Pay**: QR code-based instant payments
- **Revokable Transfers**: 30-minute corporate withdrawal window

## ⚡ Quick Start

```bash
git clone <repo> OnionUSDp && cd OnionUSDp
npm install

# Frontend
cd frontend/onion-dao && npm install && npm run dev

# Backend  
cd ../../pUSD && npm install && npm run dev
```

## 💻 Usage

### Corporate Payroll
```typescript
// Bulk payroll processing
const result = await processBulkPayroll({
  employees: [
    { wallet: "emp1_wallet", amount: 5000 },
    { wallet: "emp2_wallet", amount: 6000 }
  ],
  confidential: true
});
```

### Employee Payments
```typescript
// Check private balance
const balance = await getConfidentialBalance(connection, wallet);

// Convert pUSD to USDC (fee-free)
const withdrawal = await employeeWithdraw({
  amount: 3000,
  fromToken: 'pUSD',
  toToken: 'USDC'
});
```

### Solana Pay QR
```typescript
const paymentRequest = await createSolanaPayRequest({
  recipient: employeeWallet,
  amount: 2500,
  token: pUSD_MINT,
  label: "Monthly Salary"
});
```

## 🏗️ Architecture

```
OnionUSDp/
├── frontend/onion-dao/    # React + TypeScript UI
├── pUSD/                  # Solana Token Backend
└── keypairs/              # Key Management
```

## 📊 Token Economics

| Operation | Fee | Details |
|-----------|-----|---------|
| Employee Ops | 0% | Fee-free for workers |
| Corporate Withdrawal | 1% | Goes to yield wallet |

## 🚢 Scripts

```bash
# Development
npm run dev         # Start dev servers
npm run build       # Production build

# Blockchain
npm run deploy      # Deploy to Solana
npm run treasury-status  # Check balances
```

---

**Built for private financial infrastructure** 🔐
