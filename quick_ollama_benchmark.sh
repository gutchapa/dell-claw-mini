#!/bin/bash
# Quick Ollama Benchmark for SmolLM2 and DeepSeek R1 8B

echo "🦊 Ollama Benchmark - Zero Token Cost"
echo "======================================"
echo ""

# Check Ollama
if ! ollama list &>/dev/null; then
    echo "❌ Ollama not running. Start with: ollama serve"
    exit 1
fi

echo "✅ Ollama is running"
echo ""

# Pull models (if not present)
echo "📥 Checking models..."
if ! ollama list | grep -q "smollm2"; then
    echo "   Pulling smollm2 (1.7B, ~1.1GB)..."
    ollama pull smollm2
fi

if ! ollama list | grep -q "deepseek-r1"; then
    echo "   Pulling deepseek-r1:8b (8B, ~4.9GB)..."
    ollama pull deepseek-r1:8b
fi

echo "✅ Models ready"
echo ""

# Test prompt
PROMPT='Write a Python bubble sort with visual animation using ASCII bars and time.sleep. Show comparisons in red. Include 10-element demo.'

echo "🧪 TEST 1: SmolLM2-1.7B"
echo "========================"
echo "Prompt: $PROMPT"
echo ""
time ollama generate --model smollm2 --prompt "$PROMPT" --options 'num_predict=500,temperature=0.7'

echo ""
echo "🧪 TEST 2: DeepSeek-R1-8B"
echo "========================="
echo "Prompt: $PROMPT"
echo ""
time ollama generate --model deepseek-r1:8b --prompt "$PROMPT" --options 'num_predict=500,temperature=0.7'

echo ""
echo "✅ Benchmark complete!"
