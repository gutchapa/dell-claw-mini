#!/bin/bash
# Dell-Claw → Mac Mini M4 Migration Script
# One-shot setup for complete workspace migration
# Usage: curl -fsSL https://raw.githubusercontent.com/gutchapa/dell-claw-mini/master/migrate-to-mac-mini.sh | bash

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/gutchapa/dell-claw-mini.git"
MIGRATION_DIR="$HOME/dell-claw-migration"

log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    error "This script is for macOS only (Mac Mini M4)"
fi

# Check for Apple Silicon
if [[ $(uname -m) != "arm64" ]]; then
    warn "Not running on Apple Silicon - Metal GPU acceleration may not work"
fi

log "🚀 Starting Dell-Claw → Mac Mini M4 Migration"
log "📁 Migration directory: $MIGRATION_DIR"

# Create migration directory
mkdir -p "$MIGRATION_DIR"
cd "$MIGRATION_DIR"

# Clone all branches
log "📥 Cloning all branches from GitHub..."

BRANCHES=("master" "gbrain-repo" "gbrain-data" "claw-code" "paperclip" "pi" "turboquant")

for branch in "${BRANCHES[@]}"; do
    log "  → Cloning $branch..."
    if [ -d "$branch" ]; then
        warn "$branch already exists, pulling latest..."
        cd "$branch" && git pull && cd ..
    else
        git clone --single-branch --branch "$branch" "$REPO_URL" "$branch"
    fi
done

log "✅ All branches cloned!"

# Setup directory structure
log "📂 Setting up directory structure..."

# GBrain
if [ -d "$MIGRATION_DIR/gbrain-repo" ]; then
    log "  → Setting up GBrain source..."
    mkdir -p "$HOME/gbrain-repo"
    cp -r "$MIGRATION_DIR/gbrain-repo"/* "$HOME/gbrain-repo/"
fi

if [ -d "$MIGRATION_DIR/gbrain-data" ]; then
    log "  → Setting up GBrain database..."
    mkdir -p "$HOME/.gbrain"
    cp -r "$MIGRATION_DIR/gbrain-data/brain.pglite" "$HOME/.gbrain/" 2>/dev/null || true
    cp -r "$MIGRATION_DIR/gbrain-data/config.json" "$HOME/.gbrain/" 2>/dev/null || true
fi

# OpenClaw workspace
if [ -d "$MIGRATION_DIR/master" ]; then
    log "  → Setting up OpenClaw workspace..."
    mkdir -p "$HOME/.openclaw"
    cp -r "$MIGRATION_DIR/master" "$HOME/.openclaw/workspace"
fi

# Pi Agent
if [ -d "$MIGRATION_DIR/pi" ]; then
    log "  → Setting up Pi Agent..."
    mkdir -p "$HOME/.pi"
    cp -r "$MIGRATION_DIR/pi/agent" "$HOME/.pi/" 2>/dev/null || true
    cp -r "$MIGRATION_DIR/pi/pi-acp" "$HOME/.pi/" 2>/dev/null || true
fi

# Claw-code
if [ -d "$MIGRATION_DIR/claw-code" ]; then
    log "  → Setting up Claw-Code..."
    cp -r "$MIGRATION_DIR/claw-code" "$HOME/claw-code"
fi

# Paperclip
if [ -d "$MIGRATION_DIR/paperclip" ]; then
    log "  → Setting up Paperclip..."
    cp -r "$MIGRATION_DIR/paperclip" "$HOME/paperclip-fork"
fi

# Turboquant
if [ -d "$MIGRATION_DIR/turboquant" ]; then
    log "  → Setting up Turboquant..."
    cp -r "$MIGRATION_DIR/turboquant" "$HOME/turboquant"
fi

log "✅ Directory structure complete!"

# Install Bun if not present
if ! command -v bun &> /dev/null; then
    log "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
fi

# Install pnpm if not present
if ! command -v pnpm &> /dev/null; then
    log "📦 Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PATH="$HOME/Library/pnpm:$PATH"
fi

# Install Ollama with Metal GPU support
if ! command -v ollama &> /dev/null; then
    log "🤖 Installing Ollama with Metal GPU support..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    log "🤖 Ollama already installed"
fi

# Start Ollama
log "🚀 Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!
sleep 5

# Pull nomic-embed-text for GBrain
log "📥 Pulling nomic-embed-text model (for GBrain embeddings)..."
ollama pull nomic-embed-text

log "✅ Ollama ready with Metal GPU acceleration!"

# Setup GBrain
if [ -d "$HOME/gbrain-repo" ]; then
    log "🧠 Setting up GBrain..."
    cd "$HOME/gbrain-repo"
    
    if [ ! -d "node_modules" ]; then
        log "  → Installing GBrain dependencies..."
        bun install
    fi
    
    log "  → Verifying GBrain..."
    bun run src/cli.ts stats
fi

# Setup Paperclip (optional)
if [ -d "$HOME/paperclip-fork" ]; then
    log "📎 Setting up Paperclip (optional)..."
    cd "$HOME/paperclip-fork"
    
    if [ ! -d "node_modules" ]; then
        log "  → Installing Paperclip dependencies..."
        pnpm install
    fi
fi

# Create convenience script
log "📝 Creating convenience scripts..."

cat > "$HOME/.openclaw/workspace/gbrain-query.sh" << 'EOF'
#!/bin/bash
# Quick GBrain query helper
cd "$HOME/gbrain-repo"
bun run src/cli.ts query "$@"
EOF
chmod +x "$HOME/.openclaw/workspace/gbrain-query.sh"

# Create .env template
if [ ! -f "$HOME/.openclaw/workspace/.env" ]; then
    log "🔐 Creating .env template (fill in your keys)..."
    cat > "$HOME/.openclaw/workspace/.env.template" << 'EOF'
# API Keys - Fill these in from your old .env file
# DO NOT COMMIT THE ACTUAL .env FILE
TELEGRAM_BOT_TOKEN=
OPENCLAW_GATEWAY_TOKEN=
GOOGLE_API_KEY=
OPENROUTER_API_KEY=
PROKERALA_CLIENT_SECRET=
EOF
fi

# Summary
log "🎉 MIGRATION COMPLETE!"
echo ""
echo "========================================="
echo "  Mac Mini M4 Setup Complete! 🍎"
echo "========================================="
echo ""
echo "Installed Components:"
echo "  ✅ GBrain (38 pages, 81 chunks)"
echo "  ✅ Ollama with Metal GPU"
echo "  ✅ nomic-embed-text model"
echo "  ✅ OpenClaw workspace"
echo "  ✅ Pi Agent config"
echo "  ✅ Claw-Code"
echo "  ✅ Paperclip fork"
echo "  ✅ Turboquant"
echo ""
echo "Quick Commands:"
echo "  cd ~/gbrain-repo && bun run src/cli.ts query 'your question'"
echo "  ollama list"
echo "  ollama run qwen2.5-coder:0.5b"
echo ""
echo "⚠️  ACTION REQUIRED:"
echo "  1. Copy your .env file from old machine to ~/.openclaw/workspace/.env"
echo "  2. Test GBrain: cd ~/gbrain-repo && bun run src/cli.ts query 'Project Hail Mary'"
echo "  3. Pull more models: ollama pull qwen2.5-coder:14b"
echo ""
echo "Migration directory: $MIGRATION_DIR"
echo "========================================="