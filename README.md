# OnionUSD-P: Privacy-Preserving Corporate Payroll Platform

[![Solana](https://img.shields.io/badge/Solana-Token--2022-9945FF?style=flat&logo=solana)](https://solana.com)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)

## 🚀 Overview

OnionUSD-P is a revolutionary privacy-preserving stablecoin and corporate payroll platform built on Solana's Token-2022 standard. It enables companies to process confidential salary payments while maintaining regulatory compliance and complete transaction privacy.

### 🎯 Key Features

- **🔒 Privacy-First**: Confidential transfers using Solana Token-2022 extensions
- **💰 USD-Pegged Stablecoin**: 1:1 backing with USDC reserves
- **🏢 Corporate Treasury**: Multi-signature wallet management for companies
- **👥 Employee Payroll**: Automated and manual salary payment processing
- **📱 Solana Pay Integration**: QR code-based instant payments
- **⏰ Revokable Transactions**: 30-minute window for corporate withdrawal reversals
- **📊 Real-time Dashboard**: Separate interfaces for corporations and employees
- **🛡️ Regulatory Compliance**: Audit trails with privacy preservation

## 🏗️ Architecture

```
OnionUSDp/
├── 🖥️  frontend/onion-dao/          # React Frontend Application
├── ⚖️  pUSD/                       # Solana Token & Treasury Backend  
├── 🔗  keypairs/                   # Cryptographic Key Management
└── 🐳  Dockerfile                  # Deployment Configuration
```

### 🧩 Core Components

#### 1. **OnionUSD-P Token (pUSD)**
- **Type**: Token-2022 with confidential transfer extensions
- **Decimals**: 9 (vs USDC's 6 decimals)
- **Backing**: 1:1 USDC collateral in corporate treasury
- **Features**: Privacy-preserving transfers, regulatory compliance

#### 2. **Treasury Management System**
- **Corporate Multisig**: Secure company fund management
- **Employee Escrow**: Dedicated employee payment reserves  
- **Yield Wallet**: Fee collection and future yield generation
- **Peg Maintenance**: Automated USDC ↔ pUSD conversion

#### 3. **Corporate Dashboard Features**
- Employee registry and wallet management
- Bulk and individual payroll processing
- Treasury balance monitoring
- Transaction history with privacy controls
- Solana Pay QR code generation

#### 4. **Employee Dashboard Features**
- Wallet connection and profile management
- Private payment reception
- Transaction history (confidential)
- Balance monitoring

## 🛠️ Technology Stack

### **Blockchain & Payments**
- **Solana**: High-performance blockchain platform
- **Token-2022**: Advanced token standard with confidential transfers
- **Solana Pay**: QR code-based payment protocol
- **SPL Tokens**: USDC and custom pUSD token management

### **Frontend**
- **React 19.1.0**: Modern component-based UI
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **CSS Modules**: Scoped styling

### **Backend & Services**
- **Node.js**: JavaScript runtime
- **Firebase**: Authentication and user management
- **Firestore**: NoSQL database for user profiles
- **Solana Web3.js**: Blockchain interaction library

### **Development & Deployment**
- **Docker**: Containerized deployment
- **ESLint**: Code quality and consistency
- **Git**: Version control

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Phantom Wallet** or compatible Solana wallet
- **Firebase** account for authentication

### 1. Clone & Install

```bash
git clone <repository-url> OnionUSDp
cd OnionUSDp

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend/onion-dao
npm install

# Install backend dependencies  
cd ../../pUSD
npm install
```

### 2. Firebase Setup

Follow the detailed guide in [`frontend/onion-dao/FIREBASE_SETUP.md`](frontend/onion-dao/FIREBASE_SETUP.md):

1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Setup Firestore database
4. Update `frontend/onion-dao/src/firebase/config.ts` with your credentials

### 3. Development Environment

```bash
# Start frontend development server
cd frontend/onion-dao
npm run dev

# In another terminal, start backend compilation
cd pUSD  
npm run dev

# Frontend will be available at http://localhost:5173
```

### 4. Production Build

```bash
# Build frontend
cd frontend/onion-dao
npm run build

# Build backend
cd ../../pUSD
npm run build

# Deploy using Docker
docker build -t onion-usd-p .
```

## 📖 Usage Guide

### For Corporations

1. **Account Setup**
   - Register corporate account with email/password
   - Connect Solana wallet (Phantom recommended)
   - Verify treasury wallet connection

2. **Employee Management**
   - Add employees through the Employee Registry
   - Collect employee wallet addresses
   - Set salary amounts and departments

3. **Treasury Operations**
   - Deposit USDC into corporate treasury
   - Monitor pUSD minting and balances
   - Track yield wallet accumulation

4. **Payroll Processing**
   - Use Solana Pay for QR code payments
   - Process bulk payroll for all employees
   - Monitor transaction status and history

### For Employees

1. **Account Setup**
   - Register employee account with corporation ID
   - Connect personal Solana wallet
   - Verify wallet connection

2. **Receiving Payments**
   - Share wallet address with employer
   - Scan QR codes for instant payments
   - Monitor confidential payment history

3. **Fund Management**
   - Convert pUSD to USDC (fee-free for employees)
   - Transfer to external wallets
   - Track balance and transaction history

## 🏦 Treasury Architecture

### Fee Structure

| Transaction Type | Fee | Recipient |
|-----------------|-----|-----------|
| Employee Deposit | 0% | - |
| Employee Withdrawal | 0% | - |
| Corporate Deposit | 0% | - |
| Corporate Withdrawal | 1% | Yield Wallet |

### Security Features

- **30-Minute Revocation**: Corporate withdrawals can be reversed within 30 minutes
- **Multisig Security**: Corporate treasury requires multiple signatures
- **Confidential Transfers**: Transaction amounts hidden on-chain
- **Audit Compliance**: Full transaction history with privacy controls

### Token Economics

- **Supply**: Dynamic based on USDC deposits
- **Backing**: 100% USDC collateral maintained
- **Decimal Conversion**: 1 USDC = 1,000 pUSD (decimal adjustment)
- **Yield Generation**: 1% corporate withdrawal fees accumulate

## 🔧 Development Scripts

### Frontend Commands
```bash
cd frontend/onion-dao

npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint code checking
npm run preview    # Preview production build
```

### Backend Commands
```bash
cd pUSD

npm run build      # Compile TypeScript
npm run dev        # Watch mode compilation
npm run deploy     # Deploy with funding
npm run test-mint  # Test token minting
```

### Utility Scripts
```bash
# Treasury management
npm run treasury-status    # Check treasury balances
npm run corporate-deposit  # Corporate fund deposit
npm run employee-deposit   # Employee fund deposit

# Testing
npm run test-confidential-integration  # Test privacy features
```

## 🌐 Network Configuration

### Supported Networks
- **Devnet**: Development and testing (default)
- **Mainnet**: Production deployment
- **Localnet**: Local development

### Token Addresses (Devnet)
- **USDC**: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
- **pUSD**: `8GzpAzmBLSHsNQhGFwhokEDziXJAQm7C9P7x3YQYqf4x`

## 🔐 Security Considerations

### Best Practices Implemented

1. **Key Management**: Secure keypair storage and generation
2. **Input Validation**: Comprehensive amount and address validation
3. **Transaction Limits**: Configurable maximum transfer amounts
4. **Error Handling**: Graceful failure recovery
5. **Audit Trails**: Complete transaction logging

### Privacy Features

- **Confidential Amounts**: Transaction values hidden from public view
- **Private Balances**: Account balances encrypted on-chain
- **Selective Disclosure**: Audit compliance with privacy preservation
- **Zero-Knowledge Proofs**: Mathematical privacy guarantees

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for critical functions

## 📋 Roadmap

### Phase 1: Core Platform ✅
- [x] Basic token implementation
- [x] Corporate treasury management
- [x] Employee dashboard
- [x] Solana Pay integration

### Phase 2: Advanced Features 🚧
- [ ] Automated payroll scheduling
- [ ] Yield farming integration
- [ ] Advanced reporting and analytics
- [ ] Mobile application

### Phase 3: Enterprise 📅
- [ ] Multi-corporation support
- [ ] Advanced compliance tools
- [ ] Integration APIs
- [ ] Institutional features

## 📞 Support

### Resources

- **Documentation**: Inline code documentation
- **Firebase Setup**: [`FIREBASE_SETUP.md`](frontend/onion-dao/FIREBASE_SETUP.md)
- **API Reference**: Generated from TypeScript interfaces
- **Examples**: Test scripts in `pUSD/src/scripts/`

### Troubleshooting

1. **Wallet Connection Issues**: Ensure Phantom wallet is installed and enabled
2. **Firebase Errors**: Verify configuration in `firebase/config.ts`
3. **Transaction Failures**: Check Solana network status and account balances
4. **Build Errors**: Clear `node_modules` and reinstall dependencies

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for the future of private financial infrastructure**

🌟 **Star this repository** if you find it useful!
