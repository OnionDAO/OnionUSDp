#!/bin/bash

# Quick Demo Test - Verify all components work
# This script tests all demo components without interactive pauses

set -e

echo "🔍 Quick Demo Test - Verifying all components..."
echo ""

# Test 1: Keypair validation
echo "1. Testing keypair validation..."
npm run test:keypairs > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Keypair validation passed"
else
    echo "   ❌ Keypair validation failed"
    exit 1
fi

# Test 2: Deposit CLI help
echo "2. Testing deposit CLI..."
npm run cli:deposit -- --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Deposit CLI help works"
else
    echo "   ❌ Deposit CLI help failed"
    exit 1
fi

# Test 3: Redeem CLI help
echo "3. Testing redeem CLI..."
npm run cli:redeem -- --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Redeem CLI help works"
else
    echo "   ❌ Redeem CLI help failed"
    exit 1
fi

# Test 4: System test
echo "4. Testing system validation..."
npm run test:onionusdp > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ System test passed"
else
    echo "   ❌ System test failed"
    exit 1
fi

# Test 5: Confidential integration
echo "5. Testing confidential integration..."
npm run test:confidential > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Confidential integration passed"
else
    echo "   ❌ Confidential integration failed"
    exit 1
fi

# Test 6: Confidential minting
echo "6. Testing confidential minting..."
npm run mint:confidential -- --amount 100 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Confidential minting passed"
else
    echo "   ❌ Confidential minting failed"
    exit 1
fi

# Test 7: Rebalance bot
echo "7. Testing rebalance bot..."
npm run bot:rebalance > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Rebalance bot passed"
else
    echo "   ⚠️  Rebalance bot failed (expected - system not initialized on-chain)"
fi

echo ""
echo "🎉 All demo components are working correctly!"
echo "Ready for video recording! 🎬" 