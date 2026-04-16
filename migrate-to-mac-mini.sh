#!/bin/bash
# migrate-to-mac-mini.sh - Updated with llama.cpp Mac build

# ============================================================================
# MAC MINI M4 MIGRATION GUIDE
# ============================================================================
# This script guides migration from Dell WSL to Mac Mini M4
# 
# HARDWARE DIFFERENCES:
# - Dell: x86_64, 16GB RAM, WSL2
# - Mac Mini M4: ARM64 (Apple Silicon), 16GB unified RAM, macOS
#
# LLAMA.CPP REBUILD REQUIRED:
# - Dell build: x86_64 with OpenMP
# - Mac Mini build: ARM64 with Metal GPU support
# ============================================================================

echo "=========================================="
echo "Mac Mini M4 Migration Script"
echo "=========================================="
echo ""

# Step 1: Clone llama.cpp for Mac
echo "Step 1: Clone llama.cpp for Apple Silicon"
echo "------------------------------------------"
cat << 'LLAMAMAC'
# On Mac Mini, run these commands:

cd ~
git clone --depth 1 https://github.com/ggerganov/llama.cpp.git llama.cpp-mac

cd llama.cpp-mac

# Build for Apple Silicon with Metal GPU support
mkdir build && cd build

cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DLLAMA_METAL=ON \
  -DLLAMA_METAL_EMBED_LIBRARY=ON \
  -DCMAKE_SYSTEM_PROCESSOR=arm64 \
  -DCMAKE_OSX_ARCHITECTURES=arm64

cmake --build . --config Release -j8

# Verify Metal support
./bin/llama-cli --help | grep -i metal

LLAMAMAC

echo ""
echo "Step 2: Copy Models from Dell"
echo "------------------------------------------"
cat << 'MODELS'
# On Dell, copy models to shared location:
rsync -avz ~/models/ user@mac-mini-ip:~/models/

# Or use USB drive, cloud storage, etc.
MODELS

echo ""
echo "Step 3: Update OpenClaw Workspace"
echo "------------------------------------------"
cat << 'WORKSPACE'
# Clone workspace on Mac Mini:
git clone https://github.com/gutchapa/dell-claw-mini.git openclaw-workspace

# Install OpenClaw for macOS:
# (Check OpenClaw docs for Mac installation)
WORKSPACE

echo ""
echo "Step 4: Test llama.cpp on Mac Mini"
echo "------------------------------------------"
cat << 'TEST'
# Test with Qwen model (should be ~2x faster with Metal):
~/llama.cpp-mac/build/bin/llama-cli \
  -m ~/models/phi3-mini-q3.gguf \
  -p "Hello" -n 50 \
  -ngl 99  # Use all Metal GPU layers

# Expected: 10+ tok/s (vs 5-6 on Dell)
TEST

echo ""
echo "=========================================="
echo "LLAMA.CPP MAC MINI ADVANTAGES:"
echo "=========================================="
echo ""
echo "✅ Metal GPU acceleration (~2x faster)"
echo "✅ 16GB unified RAM (no WSL overhead)"
echo "✅ Can run larger models (up to 14B Q4)"
echo "✅ Native ARM64 (no Rosetta translation)"
echo ""
echo "Commands to run on Mac Mini are shown above."
echo "Copy and execute them after SSH into Mac Mini."
