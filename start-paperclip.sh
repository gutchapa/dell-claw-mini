#!/bin/bash
# Paperclip Startup Script - Ollama Local

set -e

echo "🚀 Starting Paperclip with Ollama..."
echo "================================"

# Check Ollama
if ! ollama list >/dev/null 2>&1; then
  echo "⚠️  Ollama not running!"
  echo "   Start it: ollama serve"
  exit 1
fi
echo "✅ Ollama running"

# Show available models
echo "📦 Available models:"
ollama list | grep -v "NAME" | head -5

# Start Paperclip
cd /home/dell/paperclip-fork
echo ""
echo "⚡ Starting Paperclip..."
echo "   URL: http://localhost:3000"
echo ""

pnpm run dev