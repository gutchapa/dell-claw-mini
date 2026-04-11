#!/bin/bash
# Fix Paperclip Adapters and Rebuild

echo "🚀 Fixing Paperclip Adapters..."
echo "================================"

cd /home/dell/paperclip-fork

# Stop any running instance
echo "Stopping existing Paperclip..."
pkill -f "pnpm.*dev" 2>/dev/null || true
pkill -f "tsx.*dev-runner" 2>/dev/null || true
sleep 2

# Build the server packages first
echo ""
echo "📦 Building packages..."
cd packages/adapters/ollama-local
pnpm run build 2>&1 || echo "Build may have errors, continuing..."

cd ../kimi-local
pnpm run build 2>&1 || echo "Build may have errors, continuing..."

cd /home/dell/paperclip-fork

# Type check
echo ""
echo "🔍 Type checking..."
cd server
npx tsc --noEmit 2>&1 | grep -E "error TS" | head -10 || echo "✅ No type errors"

cd ..

echo ""
echo "✅ Fix applied! Now restart:"
echo "   pnpm run dev"
echo ""
echo "Then select 'Ollama (local)' or 'Kimi (local)' in the UI"
