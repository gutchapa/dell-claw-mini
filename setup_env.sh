#!/bin/bash
# Setup script for TurboQuant benchmarks

echo "🦊 Setting up TurboQuant environment..."
echo ""

cd ~/turboquant

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install torch transformers accelerate sentencepiece protobuf scipy numpy psutil

# Install TurboQuant in editable mode
echo "🔧 Installing TurboQuant..."
pip install -e .

echo ""
echo "✅ Setup complete!"
echo ""
echo "Run benchmarks with:"
echo "  source ~/turboquant/.venv/bin/activate"
echo "  python3 benchmark_sequential.py --model smollm2"
echo "  python3 benchmark_sequential.py --model deepseek"
echo "  python3 benchmark_sequential.py --model both"
