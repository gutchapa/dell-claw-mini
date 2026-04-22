#!/bin/bash
# OpenClaw Pre-Update Backup Script
# Run this BEFORE `openclaw update`

set -e

echo "🛡️  OpenClaw Pre-Update Backup"
echo "================================"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/.openclaw/backups/pre-update_$TIMESTAMP"

echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 1. Backup main config
echo "📄 Backing up openclaw.json..."
cp ~/.openclaw/openclaw.json "$BACKUP_DIR/openclaw.json"

# 2. Backup agents config
echo "🤖 Backing up agents..."
cp -r ~/.openclaw/agents "$BACKUP_DIR/agents"

# 3. Backup workspace markdown files
echo "📝 Backing up workspace configs..."
mkdir -p "$BACKUP_DIR/workspace"
for file in SOUL.md USER.md MEMORY.md AGENTS.md TOOLS.md HEARTBEAT.md SESSIONS.md; do
    if [ -f "$HOME/.openclaw/workspace/$file" ]; then
        cp "$HOME/.openclaw/workspace/$file" "$BACKUP_DIR/workspace/$file"
    fi
done

# 4. Backup memory DB (optional, large)
echo "🧠 Backing up memory..."
cp ~/.openclaw/memory/main.sqlite "$BACKUP_DIR/main.sqlite" 2>/dev/null || echo "  (skipped - no memory DB)"

# 5. Save env var names (not values, for security)
echo "🔐 Saving env var checklist..."
cat > "$BACKUP_DIR/ENV_CHECKLIST.txt" << 'EOF'
Environment Variables Required:
- TELEGRAM_BOT_TOKEN
- OPENCLAW_GATEWAY_TOKEN
- KIMI_API_KEY
- GOOGLE_API_KEY (optional, for web search)

Verify with:
  echo $TELEGRAM_BOT_TOKEN | head -c 10
  echo $OPENCLAW_GATEWAY_TOKEN | head -c 10
  echo $KIMI_API_KEY | head -c 10
EOF

# 6. Save current version
echo "📦 Saving version info..."
openclaw version > "$BACKUP_DIR/VERSION.txt" 2>/dev/null || echo "version unknown" > "$BACKUP_DIR/VERSION.txt"

echo ""
echo "✅ Backup complete!"
echo "Location: $BACKUP_DIR"
echo ""
echo "To restore after update:"
echo "  cp $BACKUP_DIR/openclaw.json ~/.openclaw/openclaw.json"
echo "  cp -r $BACKUP_DIR/agents ~/.openclaw/"
echo ""
echo "Now you can safely run: openclaw update"
