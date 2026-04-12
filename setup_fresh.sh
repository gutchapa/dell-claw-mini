#!/bin/bash
# Fresh setup for TurboQuant benchmarks

echo "🦊 Fresh setup for TurboQuant..."
echo ""

cd ~/turboquant

# Remove old venv
rm -rf .venv

# Create fresh virtual environment
echo "📦 Creating fresh Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install in correct order with compatible versions
echo "📥 Installing compatible dependencies..."
pip install --upgrade pip

# Core dependencies first
pip install numpy==1.26.4
pip install torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu

# Then transformers ecosystem
pip install transformers==4.38.2
pip install accelerate==0.27.2
pip install huggingface-hub==0.20.3

# Other deps
pip install sentencepiece protobuf scipy psutil

# Install TurboQuant last
pip install -e .

echo ""
echo "✅ Setup complete!"
echo ""
echo "Test with:"
echo "  source ~/turboquant/.venv/bin/activate"
echo "  python3 -c \"import torch; import transformers; print('OK')\""
