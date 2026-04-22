# OpenClaw Config Inventory

**Purpose:** Document all custom configuration changes so they can be restored after an update.

**Created:** 2026-04-22
**Machines:** Dell (primary) + Mac Mini (replica)
**Current Version:** 2026.4.19-beta.2
**Update Target:** 2026.4.21 (planned: ~2026-05-20)

---

## ⚠️ CRITICAL: Pre-Update Checklist

Before running `openclaw update`:

1. **Backup current config:**
   ```bash
   cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.pre-update
   cp -r ~/.openclaw/agents ~/.openclaw/agents.pre-update
   ```

2. **Verify env variables are set:**
   ```bash
   echo $TELEGRAM_BOT_TOKEN | head -c 10
   echo $OPENCLAW_GATEWAY_TOKEN | head -c 10
   echo $KIMI_API_KEY | head -c 10
   ```

3. **Update Mac Mini FIRST** — keep Dell stable as fallback

4. **After update, check:**
   ```bash
   diff ~/.openclaw/openclaw.json.pre-update ~/.openclaw/openclaw.json
   ```

---

## 1. Model Configuration

### Default Model
- **Main agent:** `kimi/kimi-code`
- **Context window:** 262,144 tokens (262k)
- **Max output:** 32,768 tokens
- **Supports:** text + image
- **Reasoning:** enabled

### Custom Providers

#### Kimi (Primary)
```json
{
  "baseUrl": "https://api.kimi.com/coding/",
  "api": "anthropic-messages",
  "model": "kimi-code"
}
```
**Auth:** API key mode (`auth.profiles.kimi:default`)

#### Ollama (Local)
```json
{
  "baseUrl": "http://localhost:11434",
  "api": "ollama"
}
```
**Models configured:**
- `tinydolphin` — 32k context, 4k max tokens
- `gemma3:1b` — 32k context, 4k max tokens, reasoning
- `gemma3:4b` — 128k context, 8k max tokens, text+image
- `phi3:mini` — 4k context, 2k max tokens
- `tinydolphin:latest` — 2k context, 512 max tokens

#### Gemma Local (llama.cpp server)
```json
{
  "baseUrl": "http://127.0.0.1:8080/v1",
  "api": "ollama",
  "model": "gemma-4-e2b.gguf"
}
```
**Note:** 131k context, used for E2B testing

---

## 2. Agent Configuration

### Main Agent
```json
{
  "id": "main",
  "default": true,
  "name": "Main Agent",
  "workspace": "~/.openclaw/workspace",
  "model": "kimi/kimi-code",
  "subagents": {
    "allowAgents": ["*"]
  }
}
```

### Pi Agent
```json
{
  "id": "pi",
  "name": "Pi Agent",
  "workspace": "~/.openclaw/workspace-pi",
  "runtime": {
    "type": "acp",
    "acp": {
      "agent": "pi",
      "backend": "acpx",
      "mode": "oneshot"
    }
  }
}
```

---

## 3. Channel Configuration (Telegram)

### Critical Settings
```json
{
  "enabled": true,
  "dmPolicy": "open",
  "allowFrom": ["*"],
  "groupPolicy": "allowlist",
  "streaming": "partial",
  "mediaMaxMb": 100,
  "retry": {
    "attempts": 3,
    "maxDelayMs": 30000
  },
  "network": {
    "dnsResultOrder": "ipv4first",
    "autoSelectFamily": false
  }
}
```

**Bot token source:** Environment variable `TELEGRAM_BOT_TOKEN`

**⚠️ Security Note:** `dmPolicy: "open"` allows anyone to DM the bot. We accept this risk.

---

## 4. Security Settings

### Tools Configuration
```json
{
  "profile": "coding",
  "exec": {
    "security": "full"
  },
  "elevated": {
    "enabled": true,
    "allowFrom": {
      "telegram": ["*"]
    }
  },
  "fs": {
    "workspaceOnly": false
  },
  "web": {
    "search": {
      "enabled": true,
      "provider": "gemini"
    }
  }
}
```

**⚠️ CRITICAL:** `exec.security: "full"` allows unrestricted command execution. Elevated mode is enabled for all Telegram users.

### Gateway Auth
```json
{
  "mode": "token",
  "token": {
    "source": "env",
    "provider": "default",
    "id": "OPENCLAW_GATEWAY_TOKEN"
  }
}
```

### Control UI
```json
{
  "allowInsecureAuth": true
}
```

---

## 5. Session Configuration

### DM Scope
- **Mode:** `main` (all DMs route to main agent)
- **Idle timeout:** 2880 minutes (48 hours)

### Compaction (Safeguard)
```json
{
  "mode": "safeguard",
  "reserveTokens": 48000,
  "keepRecentTokens": 24000,
  "reserveTokensFloor": 16000,
  "maxHistoryShare": 0.75,
  "recentTurnsPreserve": 8,
  "identifierPolicy": "strict"
}
```

### Memory Search
```json
{
  "enabled": true,
  "maxResults": 10,
  "minScore": 0.6,
  "hybrid": {
    "enabled": true,
    "vectorWeight": 0.7,
    "textWeight": 0.3
  }
}
```

---

## 6. ACP (Agent Communication Protocol)

```json
{
  "enabled": true,
  "backend": "acpx",
  "defaultAgent": "pi",
  "maxConcurrentSessions": 8,
  "allowedAgents": [
    "claude", "codex", "copilot", "cursor", 
    "droid", "gemini", "iflow", "kilocode",
    "kimi", "kiro", "openclaw", "opencode",
    "pi", "qwen"
  ]
}
```

---

## 7. Plugin Configuration

### Enabled Plugins
- **acpx** — `enabled: true`, `permissionMode: "approve-all"`
- **google** — `enabled: true`, web search via `GOOGLE_API_KEY`
- **custom-router-plugin** — `enabled: false` (stale entry, keep disabled)

### Plugin Paths
```json
{
  "load": {
    "paths": ["~/.openclaw/plugins"]
  }
}
```

---

## 8. Hooks (Boot-time Loading)

### Bootstrap Files
These files are injected at session start:
```json
[
  "~/.openclaw/AGENTS.md",
  "~/.openclaw/SESSIONS.md",
  "~/.openclaw/SOUL.md",
  "~/.openclaw/PROGRESS.md",
  "~/.openclaw/USER.md",
  "~/.openclaw/TOOLS.md",
  "~/.openclaw/HEARTBEAT.md",
  "~/.openclaw/MEMORY.md"
]
```

### Session Memory
- **Enabled:** yes
- **Messages preserved:** 50

---

## 9. Gateway Configuration

```json
{
  "port": 18789,
  "mode": "local",
  "bind": "loopback",
  "tailscale": {
    "mode": "off",
    "resetOnExit": false
  }
}
```

### Restricted Commands (Nodes)
These are denied for remote nodes:
- `camera.snap`, `camera.clip`, `screen.record`
- `contacts.add`, `calendar.add`, `reminders.add`
- `sms.send`

---

## 10. Environment Variables

These must be set in the shell/LaunchAgent:

| Variable | Purpose | Set In |
|----------|---------|--------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot auth | `.zshenv` / `launchctl setenv` |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth | `.zshenv` / `launchctl setenv` |
| `KIMI_API_KEY` | Kimi model auth | `.zshenv` |
| `GOOGLE_API_KEY` | Web search | `.zshenv` |

### Mac Mini LaunchAgent Env Vars
```xml
<key>EnvironmentVariables</key>
<dict>
    <key>TELEGRAM_BOT_TOKEN</key>
    <string>xxxx</string>
    <key>OPENCLAW_GATEWAY_TOKEN</key>
    <string>xxxx</string>
    <key>KIMI_API_KEY</key>
    <string>xxxx</string>
</dict>
```

---

## 11. Machine-Specific Differences

### Dell vs Mac Mini

| Setting | Dell | Mac Mini |
|---------|------|----------|
| **Home path** | `/home/dell` | `/Users/gutchapa` |
| **Ollama models** | Gemma 3, phi3:mini, tinydolphin | Gemma 4, Gemma 3, phi3:mini |
| **Node** | Via WSL2 | Native macOS |
| **OS** | Linux 6.6 (WSL2) | macOS 26.4.1 |
| **Tailscale** | Off | Off |

### Path Replacements Needed (Mac Mini)
When migrating configs from Dell to Mac:
- `/home/dell` → `/Users/gutchapa`
- `/home/dell/.openclaw` → `/Users/gutchapa/.openclaw`

---

## 12. Post-Update Restoration Steps

If config gets reset during update:

1. **Restore from backup:**
   ```bash
   cp ~/.openclaw/openclaw.json.pre-update ~/.openclaw/openclaw.json
   ```

2. **Verify model routing:**
   ```bash
   openclaw config get agents.list[0].model
   # Should return: kimi/kimi-code
   ```

3. **Verify Telegram:**
   ```bash
   openclaw config get channels.telegram.enabled
   # Should return: true
   ```

4. **Verify exec security:**
   ```bash
   openclaw config get tools.exec.security
   # Should return: full
   ```

5. **Restart gateway:**
   ```bash
   launchctl stop ai.openclaw.gateway
   sleep 3
   launchctl start ai.openclaw.gateway
   ```

6. **Test with a message** to @gutchmac_bot

---

## 13. Known Issues & Workarounds

| Issue | Workaround | Status |
|-------|-----------|--------|
| Agent stuck in empty command loop | Restart gateway | ⚠️ Recurring |
| Context too full (179k/262k) | Auto-compaction kicks in | ✅ Automated |
| Telegram token missing in shell | Use `launchctl setenv` or restart | ✅ Fixed |
| Config merge resets custom models | Restore from backup (this doc) | 🛡️ Prepared |

---

## 14. Files to Preserve (Never Overwrite)

These contain our custom logic:

| File | Location | Purpose |
|------|----------|---------|
| `SOUL.md` | `~/.openclaw/workspace/` | Personality & rules |
| `USER.md` | `~/.openclaw/workspace/` | User profile |
| `MEMORY.md` | `~/.openclaw/workspace/` | Long-term memory |
| `AGENTS.md` | `~/.openclaw/workspace/` | Startup instructions |
| `TOOLS.md` | `~/.openclaw/workspace/` | Tool notes & costs |
| `openclaw.json` | `~/.openclaw/` | Main configuration |
| `main.sqlite` | `~/.openclaw/memory/` | Conversation history |
| `sessions.json` | `~/.openclaw/agents/main/sessions/` | Session index |

---

**Next Review:** 2026-05-20 (before update)
**Last Updated:** 2026-04-22
