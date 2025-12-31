# OnionUSD-P (pUSD) - Privacy-First Stablecoin System

A comprehensive Solana-based stablecoin system with privacy features, treasury management, and payroll automation.

## 🏗️ Architecture Overview

OnionUSD-P is a privacy-first stablecoin system built on Solana that provides:
- **Privacy**: Confidential transfers using Token-2022
- **Treasury Management**: Automated yield strategies and rebalancing
- **Payroll System**: Corporate-to-employee payment flows
- **Redeem Controls**: Configurable allow lists and limits

## 📁 Project Structure

```
pUSD/
├── src/
│   ├── config/           # Configuration constants and network settings
│   ├── lib/              # Core business logic libraries
│   │   ├── auth/         # Authentication and permissions
│   │   ├── payroll/      # Payroll management system
│   │   └── ...           # Core modules (onionusdp, token, treasury, etc.)
│   ├── scripts/          # CLI tools and automation scripts
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and helpers
├── keypairs/             # Keypair files for testing
├── dist/                 # Compiled JavaScript output
└── docs/                 # Documentation and guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Solana CLI tools
- TypeScript

### Installation
```bash
npm install
npm run build
```

### Configuration
Update `src/config/constants.ts` with your network settings and token addresses.

### Running Scripts
```bash
# Deposit USDC and mint pUSD
npx tsx src/scripts/cli-deposit.ts --amount 100 --payer keypairs/corporate.json

# Transfer pUSD from corporate to employee
npx tsx src/scripts/corporate-to-employee-transfer.ts --amount 50 --from keypairs/corporate.json --to keypairs/employee.json

# Employee redeems pUSD for USDC
npx tsx src/scripts/cli-redeem.ts --amount 30 --wallet keypairs/employee.json

# Run rebalancing bot
npx tsx src/scripts/bot-rebalance.ts --config keypairs/bot.json
```

## 🔧 Core Components

### 1. OnionUSDPManager (`src/lib/onionusdp.ts`)
Main orchestrator for the pUSD system:
- Config initialization and management
- USDC deposit and pUSD minting
- pUSD redemption with auto-liquidity
- Treasury rebalancing
- PDA derivation and management

### 2. Treasury Management (`src/lib/treasury.ts`)
Handles treasury operations:
- Yield strategy management
- Liquidity provision
- Risk management
- Balance tracking

### 3. Payroll System (`src/lib/payroll.ts`)
Corporate payroll automation:
- Batch payroll scheduling
- Employee distribution
- Merkle proof validation
- Escrow management

### 4. Token Management (`src/lib/token.ts`)
Token operations and metadata:
- Token creation and configuration
- Metadata management
- Balance tracking
- ATA management

## 🔐 Security Features

- **Multisig Support**: Corporate operations require multisig approval
- **Redeem Controls**: Configurable allow lists and daily/monthly limits
- **Privacy**: Confidential transfers using Token-2022
- **Access Control**: Role-based permissions for different operations

## 🌐 Network Support

- **Devnet**: Development and testing
- **Mainnet**: Production deployment
- **Surfnet**: Local development with Surfpool
- **Custom RPC**: Support for custom endpoints

## 📊 Monitoring and Analytics

- Transaction logging with structured output
- Treasury status monitoring
- Balance tracking across all components
- Performance metrics and analytics

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific components
npm run test:unit
npm run test:integration
```

## 📚 Documentation

- [Live Demo Guide](LIVE_DEMO_GUIDE.md) - Step-by-step demo instructions
- [Video Demo Script](VIDEO_DEMO_SCRIPT.md) - Video demonstration script
- [API Documentation](docs/api.md) - Detailed API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper documentation
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the demo guides for usage examples
