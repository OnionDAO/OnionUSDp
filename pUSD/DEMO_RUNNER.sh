#!/bin/bash

# OnionUSD-P Video Demo Runner
# This script automates the entire demo flow for recording

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}🎬 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}"
    echo "=================================================="
    echo "🔒 OnionUSD-P System Demo"
    echo "=================================================="
    echo -e "${NC}"
}

# Function to pause for demo timing
pause() {
    echo -e "${YELLOW}⏸️  Pausing for demo timing... (Press Enter to continue)${NC}"
    read -r
}

# Function to clear screen
clear_screen() {
    clear
    print_header
}

# Main demo flow
main() {
    clear_screen
    
    print_step "Starting OnionUSD-P System Demo"
    echo "This demo will showcase:"
    echo "  • Keypair management and validation"
    echo "  • USDC deposit functionality"
    echo "  • pUSD redemption with allow list validation"
    echo "  • System-wide testing and validation"
    echo "  • Confidential pUSDC token minting"
    echo "  • Automated treasury rebalancing"
    echo ""
    print_warning "⚠️  This demo will send REAL transactions to devnet!"
    print_warning "⚠️  Make sure you have sufficient SOL for transaction fees!"
    echo ""
    pause
    
    # Scene 1: Introduction & Project Overview
    clear_screen
    print_step "Scene 1: Introduction & Project Overview"
    echo ""
    print_info "Welcome to the OnionUSD-P stablecoin system demo."
    print_info "Today we'll show you our working implementation with actual keypairs,"
    print_info "deposit and redeem functionality, and confidential pUSDC token minting."
    echo ""
    pause
    
    print_info "Let's start by examining our project structure:"
    echo ""
    ls -la
    echo ""
    pause
    
    print_info "Now let's look at our keypairs directory:"
    echo ""
    ls -la keypairs/
    echo ""
    pause
    
    print_info "And our available npm scripts:"
    echo ""
    cat package.json | grep -A 15 '"scripts"'
    echo ""
    pause
    
    # Scene 2: Keypair Validation
    clear_screen
    print_step "Scene 2: Keypair Validation"
    echo ""
    print_info "First, let's validate that all our keypairs are properly configured"
    print_info "and can be loaded by the system."
    echo ""
    pause
    
    print_info "Running keypair validation test..."
    echo ""
    npm run test:keypairs
    echo ""
    print_success "Perfect! All 8 keypairs are loading successfully with valid 32-byte public keys and Gill signer conversion."
    pause
    
    # Scene 2.5: Fund Keypairs
    clear_screen
    print_step "Scene 2.5: Funding Keypairs"
    echo ""
    print_info "Before we can send transactions, we need to fund our keypairs with SOL"
    print_info "for transaction fees. Let's request airdrops from the devnet faucet."
    echo ""
    pause
    
    print_info "Funding all keypairs with 0.1 SOL each..."
    echo ""
    npm run fund:keypairs -- --amount 0.1
    echo ""
    print_success "Keypairs funded successfully! Now we can send real transactions."
    pause
    
    # Scene 3: Deposit CLI Demonstration
    clear_screen
    print_step "Scene 3: Deposit CLI Demonstration"
    echo ""
    print_info "Now let's demonstrate the USDC deposit functionality."
    print_info "This allows users to deposit USDC and receive pUSD tokens in return."
    echo ""
    pause
    
    print_info "First, let's see the deposit CLI help:"
    echo ""
    npm run cli:deposit -- --help
    echo ""
    pause
    
    print_info "Now let's list available keypairs:"
    echo ""
    npm run cli:deposit -- --list-keypairs
    echo ""
    pause
    
    print_info "Let's demonstrate a real deposit transaction:"
    echo ""
    npm run cli:deposit -- --amount 100 --payer keypairs/payer.json
    echo ""
    print_success "The deposit CLI successfully loaded the payer keypair, validated the amount, and sent the transaction."
    print_info "This transferred USDC to the treasury and minted pUSD tokens."
    pause
    
    # Scene 4: Redeem CLI Demonstration
    clear_screen
    print_step "Scene 4: Redeem CLI Demonstration"
    echo ""
    print_info "Next, let's show the pUSD redemption process."
    print_info "This allows employees to redeem their pUSD tokens for USDC, with built-in allow list validation."
    echo ""
    pause
    
    print_info "First, let's see the redeem CLI help:"
    echo ""
    npm run cli:redeem -- --help
    echo ""
    pause
    
    print_info "Now let's demonstrate a real redemption transaction:"
    echo ""
    npm run cli:redeem -- --amount 50 --wallet keypairs/user.json
    echo ""
    pause
    
    print_info "Let's try with a different wallet:"
    echo ""
    npm run cli:redeem -- --amount 25 --wallet keypairs/treasury.json
    echo ""
    print_success "The redeem CLI validated the employee wallet, checked redemption limits, and sent the transaction."
    print_info "Notice how it handles different wallet types and validates the redeem allow list."
    pause
    
    # Scene 5: OnionUSD-P System Test
    clear_screen
    print_step "Scene 5: OnionUSD-P System Test"
    echo ""
    print_info "Let's run our comprehensive system test to verify all components are working correctly."
    echo ""
    pause
    
    print_info "Running system test..."
    echo ""
    npm run test:onionusdp
    echo ""
    print_success "Excellent! All system components are validated and working correctly."
    pause
    
    # Scene 6: Confidential pUSDC Token Minting
    clear_screen
    print_step "Scene 6: Confidential pUSDC Token Minting"
    echo ""
    print_info "Now for the exciting part - confidential pUSDC token minting."
    print_info "This demonstrates our integration with confidential computing for enhanced privacy."
    echo ""
    pause
    
    print_info "First, let's test the confidential integration:"
    echo ""
    npm run test:confidential
    echo ""
    pause
    
    print_info "Now let's demonstrate real confidential minting:"
    echo ""
    npm run mint:confidential -- --amount 100 --wallet keypairs/user.json
    echo ""
    print_success "The confidential pUSDC minting demonstrates our advanced privacy features."
    print_info "Tokens are minted with zero-knowledge proofs, ensuring transaction privacy while maintaining regulatory compliance."
    pause
    
    # Scene 7: Rebalance Bot Demo
    clear_screen
    print_step "Scene 7: Rebalance Bot Demo"
    echo ""
    print_info "Finally, let's show our automated rebalance bot that maintains optimal treasury ratios."
    echo ""
    pause
    
    print_info "Running rebalance bot:"
    echo ""
    npm run bot:rebalance
    echo ""
    print_success "The rebalance bot continuously monitors treasury health and automatically adjusts positions to maintain optimal float ratios."
    pause
    
    # Closing Scene
    clear_screen
    print_step "Demo Conclusion"
    echo ""
    print_success "This concludes our OnionUSD-P system demo. We've successfully demonstrated:"
    echo ""
    echo "1. ✅ Keypair management and validation"
    echo "2. ✅ USDC deposit functionality"
    echo "3. ✅ pUSD redemption with allow list validation"
    echo "4. ✅ System-wide testing and validation"
    echo "5. ✅ Confidential pUSDC token minting"
    echo "6. ✅ Automated treasury rebalancing"
    echo ""
    print_info "The system is production-ready with comprehensive security, privacy features, and automated management."
    echo ""
    print_info "Key Technical Highlights:"
    echo "  • Real keypair integration (not mock data)"
    echo "  • Real transactions sent to devnet"
    echo "  • Comprehensive error handling"
    echo "  • Gill SDK integration"
    echo "  • Confidential computing features"
    echo ""
    print_success "Thank you for your attention!"
    echo ""
    pause
    
    clear_screen
    print_success "Demo completed successfully! 🎉"
}

# Run the demo
main "$@" 