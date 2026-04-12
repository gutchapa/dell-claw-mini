# Dell Claw Mini — Workspace Archive

Complete OpenClaw workspace for Dell Mini PC, ready for migration to Mac Mini M4.

## 📦 What's Inside

| Category | Files | Description |
|----------|-------|-------------|
| **GBrain** | `memory/`, `*.md` | 38 pages, 81 chunks — full knowledge base |
| **Components** | `mcp_bridge.py`, `lsp_client.py`, `bash_validator.py` | MCP Bridge, LSP Client, Bash Validator |
| **Session Memory** | `SESSION_TRACKER.md`, `PROGRESS.md`, `ACTIVE_TASK.md` | Task tracking and history |
| **Identity** | `SOUL.md`, `IDENTITY.md`, `AGENTS.md`, `USER.md` | Agent persona and user preferences |
| **Paperclip** | `paperclip-fork/` | Local LLM adapters (Ollama, Kimi) |
| **Scripts** | `search_flights.py`, `panchangam.py`, `benchmark_*.py` | Various utilities |

## 🧠 GBrain Stats

```
Pages:     38
Chunks:    81
Embedded:  81 (100% local Ollama)
Links:     0
Tags:      0
```

**Data Sources:**
- 7 session memory files
- 17 workspace docs
- 90 SQLite task runs exported
- Hardware fixes (Intel AX200 WiFi)
- Custom pages (people/ramesh, zero-token-mission)

## 🔧 Key Components

### MCP Bridge (`mcp_bridge.py`)
- JSON-RPC bridge for Model Context Protocol
- Tested with filesystem MCP server
- 14 tools discovered successfully

### LSP Client (`lsp_client.py`)
- Auto-detects TypeScript/Python LSP servers
- Connected to Python LSP successfully
- Used for Paperclip code analysis

### Bash Validator (`bash_validator.py`)
- Blocks destructive commands (rm, dd)
- Tested working

## 🎯 Active Tasks

- **Project Hail Mary** — BookMyShow booking (blocked by Cloudflare)
- **Mac Mini M4 Migration** — Pending delivery
- **WhatsApp Business API** — School setup in progress

## 🚀 Migration to Mac Mini

```bash
# Copy these to Mac Mini:
~/.gbrain/              # Vector database
~/gbrain-repo/          # GBrain source
~/.openclaw/workspace/  # This repo

# On Mac Mini:
cd ~/gbrain-repo
bun install
bun run src/cli.ts stats  # Verify
```

## 💾 Repo Stats

- **Files:** 5419 (after removing node_modules)
- **Commits:** 3
- **Size:** ~50MB
- **Last Updated:** 2026-04-12

## 🔗 Links

- **GBrain Query:** `bun run src/cli.ts query "your question"`
- **GitHub:** https://github.com/gutchapa/dell-claw-mini
