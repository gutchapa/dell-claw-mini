#!/bin/bash
# Ollama Models Setup for Mac Mini M4
# Pulls all models with Metal GPU optimization

set -e

echo "🤖 Setting up Ollama models on Mac Mini M4..."
echo "📥 This will download ~20GB of models with Metal optimization"
echo ""

# Essential models (must have)
echo "📦 Pulling essential models..."
ollama pull nomic-embed-text
echo "  ✅ nomic-embed-text (for GBrain)"

ollama pull mannix/qwen2.5-coder:0.5b-iq4_xs
echo "  ✅ qwen2.5-coder:0.5b (fast, small)"

# Medium models
echo ""
echo "📦 Pulling medium models..."
ollama pull tinydolphin
echo "  ✅ tinydolphin (smart router)"

ollama pull phi3:mini
echo "  ✅ phi3:mini (Microsoft)"

ollama pull smollm2
echo "  ✅ smollm2 (HuggingFace)"

# Large models (optional - takes time)
echo ""
echo "📦 Pulling large models..."
ollama pull phi3.5
echo "  ✅ phi3.5 (Microsoft)"

ollama pull mannix/qwen2.5-coder:14b-iq4_xs
echo "  ✅ qwen2.5-coder:14b (coding beast)"

# Optional models (commented out - uncomment if needed)
# ollama pull qwen35-4b-text
# ollama pull hf.co/prism-ml/Bonsai-8B-gguf

echo ""
echo "========================================="
echo "  ✅ All models pulled successfully!"
echo "========================================="
echo ""
echo "To test:"
echo "  ollama run mannix/qwen2.5-coder:0.5b-iq4_xs"
echo "  ollama run mannix/qwen2.5-coder:14b-iq4_xs"
echo ""
ollama list