# Mac Mini M4 Migration Guide

**Source:** Dell WSL2 Setup  
**Destination:** Mac Mini M4 (16GB RAM, 256GB SSD)  
**Date:** April 2025  
**Branch:** `dell-mini-pc-setup-v3`

---

## Pre-Migration Checklist

- [ ] Mac Mini arrived and unboxed
- [ ] Initial macOS setup complete
- [ ] Homebrew installed
- [ ] SSH access configured
- [ ] GitHub credentials ready

---

## Phase 1: Core Dependencies

### 1.1 Install Homebrew Packages
```bash
# Terminal on Mac Mini
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Core tools
brew install git node python@3.12 python@3.11 ollama

# Dev tools
brew install tmux tree jq htop
```

### 1.2 Setup Ollama
```bash
# Ollama auto-starts with brew, but verify:
ollama --version

# Pull models ( prioritize what we use )
ollama pull phi3:mini          # 2.2GB - Fast, reliable
ollama pull tinydolphin        # 636MB - Ultra-fast
ollama pull qwen2.5-coder:0.5b # 349MB - Coding tasks
ollama pull gemma3:4b          # 4B model - Quality
ollama pull deepseek-r1:8b     # 8B reasoning model

# Test
ollama run phi3:mini "Hello"
```

---

## Phase 2: OpenClaw Migration

### 2.1 Clone Workspace
```bash
mkdir -p ~/openclaw && cd ~/openclaw
git clone https://github.com/RamEsh1/openclaw-workspace.git workspace
cd workspace
git checkout dell-mini-pc-setup-v3
```

### 2.2 Update Paths (Critical!)
```bash
# Old Dell paths → New Mac paths
# /home/dell/.openclaw/workspace → /Users/YOUR_USER/openclaw/workspace

# Update all hardcoded paths:
find . -type f \( -name "*.sh" -o -name "*.py" -o -name "*.mjs" -o -name "*.ts" \) -exec grep -l "/home/dell" {} \;

# Replace with sed (test first!)
# sed -i '' 's|/home/dell/.openclaw/workspace|/Users/$USER/openclaw/workspace|g' <files>
```

**Files to update:**
- `soul-enforcer.sh` - VIOLATION_LOG path
- `openclaw-adapters/adapters/ollama_llm.py` - self.workspace
- `subagents/coder/run-kimi.py` - WORKSPACE constant
- Any other scripts with hardcoded paths

### 2.3 Setup Node.js Environment
```bash
# OpenClaw CLI
npm install -g openclaw

# Verify
openclaw --version
openclaw status
```

### 2.4 Environment Variables
```bash
# Add to ~/.zshrc or ~/.bash_profile
export WORKSPACE="$HOME/openclaw/workspace"
export KIMI_API_KEY="sk-kimi-l0Ju2tcVDDPnhM1YwyYls2k3I4n8RVhnNNIs32EfDmLSmqeGLoSgXxHuxshjWNqo"
export PATH="$HOME/.npm-global/bin:$PATH"

# Reload
source ~/.zshrc
```

---

## Phase 3: Verify Components

### 3.1 SOUL-EL Test
```bash
cd $WORKSPACE
bash soul-enforcer.sh check "I will create a Python script"
# Should detect violation (not using CrewAI)
```

### 3.2 Coder Agent Test
```bash
cd $WORKSPACE
python3 subagents/coder/run-kimi.py << 'EOF'
{"id": "test-mac-mini", "desc": "Write a hello world function in Python"}
EOF

# Check output
ls -la agent-output/test-mac-mini/
```

### 3.3 Ollama Adapter Test
```bash
cd $WORKSPACE
python3 -c "
from openclaw-adapters.adapters.ollama_llm import OllamaLLM
llm = OllamaLLM('phi3:mini')
result = llm.call('Say hello from Mac Mini')
print(result)
"
```

---

## Phase 4: Git Config & SSH

### 4.1 Git Identity
```bash
git config --global user.name "RamEsh"
git config --global user.email "your-email@example.com"
```

### 4.2 SSH Keys
```bash
ssh-keygen -t ed25519 -C "mac-mini-openclaw"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub → Settings → SSH Keys
```

---

## Phase 5: Data Migration (Optional)

### Files to copy from Dell:
```
# Memory files (continuity)
memory/
├── 2025-04-*.md
├── soul-violations.md
└── heartbeat-state.json

# Config (if not in git)
.openclaw/config.json

# Logs (optional)
logs/
```

### Copy command:
```bash
# From Mac Mini
scp -r dell-user@dell-ip:/home/dell/.openclaw/workspace/memory ~/openclaw/workspace/
```

---

## Phase 6: Post-Migration Validation

### Run full test suite:
```bash
cd $WORKSPACE

# 1. Git status clean
git status

# 2. SOUL-EL working
bash soul-enforcer.sh check "Using CrewAI for orchestration"

# 3. Coder agent generates code
python3 subagents/coder/run-kimi.py orchestrator/queue/test.json

# 4. Ollama responding
ollama run phi3:mini "System check"

# 5. OpenClaw CLI functional
openclaw status
```

---

## Rollback Plan

If issues occur:
1. Keep Dell running until Mac Mini validated
2. `git stash` any Mac-specific changes
3. Switch back to Dell: `ssh dell`
4. Mac Mini: `git checkout main` to reset

---

## Known Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Path errors | Hardcoded `/home/dell` | Use `$WORKSPACE` env var |
| Ollama slow first run | Model loading | Expected - subsequent runs fast |
| Kimi API 401 | Wrong API key | Check `KIMI_API_KEY` export |
| Node not found | PATH issue | `brew link node` or restart shell |

---

## Performance Expectations

| Task | Dell (WSL2) | Mac Mini M4 |
|------|-------------|-------------|
| phi3:mini | ~49s first load | ~20-30s expected |
| tinydolphin | Fast | Faster |
| 14B models | OOM ❌ | Should work ✅ |
| Kimi API | Same | Same (cloud) |
| Code gen | ~5-10s | ~3-5s expected |

---

## Post-Migration Tasks

- [ ] Test 14B models (qwen, deepseek)
- [ ] Benchmark against Dell numbers
- [ ] Update USER.md with new specs
- [ ] Archive Dell branch when stable

---

**Migration Lead:** RamEsh  
**Status:** Ready to execute 🚀
