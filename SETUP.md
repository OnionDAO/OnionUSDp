# OnionUSD-P Setup Guide

This guide will help you set up and run the OnionUSD-P project locally.

## Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or yarn
- A Solana wallet (Phantom recommended)
- Firebase account (for authentication and database)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/OnionDAO/OnionUSDp.git
cd OnionUSDp
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend/onion-dao
npm install

# Install backend dependencies (optional, for token management scripts)
cd ../../pUSD
npm install
```

### 3. Configure Environment Variables

#### Frontend Configuration

1. Copy the example environment file:
```bash
cd frontend/onion-dao
cp .env.example .env.local
```

2. Edit `.env.local` with your Firebase credentials and Solana configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Token Addresses (Devnet defaults)
VITE_PUSD_MINT_ADDRESS=8GzpAzmBLSHsNQhGFwhokEDziXJAQm7C9P7x3YQYqf4x
VITE_USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password provider
4. Enable **Cloud Firestore** database
5. Copy your web app configuration to `.env.local`

#### Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Employees can be read by authenticated users
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Transactions can be read by authenticated users
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Corporations
    match /corporations/{corpId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Run the Development Server

```bash
cd frontend/onion-dao
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
OnionUSDp/
├── frontend/
│   └── onion-dao/          # React frontend
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── contexts/   # React contexts (Auth)
│       │   ├── services/   # Firebase & Solana services
│       │   ├── firebase/   # Firebase configuration
│       │   └── types/      # TypeScript types
│       ├── .env.example    # Environment template
│       └── .env.local      # Your local config (gitignored)
├── pUSD/                   # Backend/Solana utilities
│   ├── src/
│   │   ├── lib/           # Core libraries
│   │   ├── scripts/       # CLI scripts
│   │   └── config/        # Configuration
│   └── keypairs/          # Solana keypairs (gitignored)
├── Dockerfile             # Docker deployment
├── SETUP.md              # This file
└── README.md             # Project overview
```

## Features

### Corporation Dashboard
- Employee management
- Treasury overview
- Payroll processing via Solana Pay
- Transaction history

### Employee Dashboard
- Payment history
- Wallet connection
- Account security settings

### Solana Pay Integration
- QR code payment generation
- Support for SOL, USDC, and pUSD tokens
- Real-time balance display

## Development

### Build for Production

```bash
cd frontend/onion-dao
npm run build
```

### Run Production Preview

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build \
  --build-arg VITE_FIREBASE_API_KEY=your-key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-domain \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-bucket \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender \
  --build-arg VITE_FIREBASE_APP_ID=your-app-id \
  -t onionusdp .

# Run the container
docker run -p 3000:3000 onionusdp
```

## Troubleshooting

### Firebase Errors
- Ensure all Firebase environment variables are set correctly
- Check that Email/Password authentication is enabled
- Verify Firestore security rules allow your operations

### Solana Connection Issues
- Check that you're connected to the correct network (devnet/mainnet)
- Ensure your RPC URL is accessible
- Verify Phantom wallet is installed and connected

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is 18+
- Check for TypeScript errors: `npm run build`

## Network Configuration

### Devnet (Development)
- Network: `devnet`
- RPC: `https://api.devnet.solana.com`
- Get test SOL: [Solana Faucet](https://faucet.solana.com)

### Mainnet (Production)
- Network: `mainnet-beta`
- RPC: `https://api.mainnet-beta.solana.com`
- Use real SOL and tokens

## Security Notes

- Never commit `.env.local` or any file containing real credentials
- Keep your Solana keypairs secure and backed up
- Use environment variables for all sensitive configuration
- Review Firebase security rules for your use case

## Support

For issues and questions:
- GitHub Issues: [OnionDAO/OnionUSDp](https://github.com/OnionDAO/OnionUSDp/issues)
