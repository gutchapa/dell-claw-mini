# Multi-Agent Telegram Topics Setup

**Date:** 2026-04-22
**Branch:** `multi-agent-topics`
**Status:** ✅ Production Ready

---

## Overview

This setup enables **Claude-style conversation threads** in Telegram using OpenClaw's native multi-agent routing via **Telegram Forum Topics**.

**One bot, multiple isolated brains** — each topic routes to a different agent with its own memory, personality, and workspace.

---

## Architecture

```
Telegram Group: "Gutchapa HQ" (Forum)
├── 💬 #General (Topic 1) → Main Agent (🦊)
├── 🏫 #School (Topic 2) → School Agent (🏫)
└── 💻 #Coding (Topic 3) → Coding Agent (💻)
```

---

## Agents Configuration

| Agent | ID | Workspace | Emoji | Purpose |
|-------|----|-----------|-------|---------|
| **Main** | `main` | `~/.openclaw/workspace` | 🦊 | General chat, default |
| **School** | `school` | `~/.openclaw/workspace-school` | 🏫 | Education/curriculum tasks |
| **Coding** | `coding` | `~/.openclaw/workspace-coding` | 💻 | Development/technical tasks |
| **Pi** | `pi` | `~/.openclaw/workspace-pi` | 🤖 | ACP coding harness |

---

## Key Config (`openclaw.json`)

### Agents List
```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "Main Agent",
        "workspace": "~/.openclaw/workspace",
        "model": "kimi/kimi-code"
      },
      {
        "id": "school",
        "name": "School Agent",
        "workspace": "~/.openclaw/workspace-school",
        "model": "kimi/kimi-code",
        "identity": {"name": "School Assistant", "emoji": "🏫"}
      },
      {
        "id": "coding",
        "name": "Coding Agent",
        "workspace": "~/.openclaw/workspace-coding",
        "model": "kimi/kimi-code",
        "identity": {"name": "Code Assistant", "emoji": "💻"}
      }
    ]
  }
}
```

### Topic Routing
```json
{
  "channels": {
    "telegram": {
      "groups": {
        "-1003777826980": {
          "requireMention": false,
          "topics": {
            "1": {"agentId": "main"},
            "2": {"agentId": "school"},
            "3": {"agentId": "coding"}
          }
        }
      },
      "groupPolicy": "open"
    }
  }
}
```

---

## Workspace Files Per Agent

Each agent has its own:
- `SOUL.md` — Personality & identity
- `AGENTS.md` — Startup instructions
- `USER.md` — Shared user context

### Main Workspace
```
~/.openclaw/workspace/
├── SOUL.md          (general personality)
├── AGENTS.md        (startup routine)
├── USER.md          (user profile)
├── MEMORY.md        (long-term memory)
└── ...              (project files)
```

### School Workspace
```
~/.openclaw/workspace-school/
├── SOUL.md          (education-focused)
├── AGENTS.md        (school tasks)
└── USER.md          (shared context)
```

### Coding Workspace
```
~/.openclaw/workspace-coding/
├── SOUL.md          (technical, precise)
├── AGENTS.md        (coding standards)
└── USER.md          (shared context)
```

---

## Benefits

| Feature | Advantage |
|---------|-----------|
| **Isolated Memory** | Each topic remembers only its own conversations |
| **Specialized Personalities** | School agent = professional, Coding agent = technical |
| **No Cross-Contamination** | Curriculum talk won't pollute coding context |
| **Native Telegram** | Uses built-in Forum Topics — no hacks |
| **Scalable** | Add more topics/agents anytime |
| **Cost Control** | Only active topics consume API tokens |

---

## How to Add New Topic/Agent

### Step 1: Create Topic in Telegram
1. Open "Gutchapa HQ" group
2. Tap "⋯" → "Create Topic"
3. Name it (e.g., "Finance", "Research")

### Step 2: Get Topic ID
```bash
# Check logs or use Telegram Web URL
tail -20 /tmp/openclaw/openclaw-2026-04-22.log | grep topic
```

### Step 3: Create Agent Workspace
```bash
mkdir -p ~/.openclaw/workspace-finance
cat > ~/.openclaw/workspace-finance/SOUL.md << 'EOF'
# SOUL.md - Finance Agent
## Identity
- Name: FinanceBot
- Role: Financial analysis assistant
EOF
cp ~/.openclaw/workspace/USER.md ~/.openclaw/workspace-finance/
```

### Step 4: Update Config
```json
{
  "agents": {
    "list": [
      {
        "id": "finance",
        "name": "Finance Agent",
        "workspace": "~/.openclaw/workspace-finance",
        "model": "kimi/kimi-code"
      }
    ]
  },
  "channels": {
    "telegram": {
      "groups": {
        "-1003777826980": {
          "topics": {
            "4": {"agentId": "finance"}
          }
        }
      }
    }
  }
}
```

### Step 5: Restart Gateway
```bash
launchctl stop ai.openclaw.gateway
sleep 3
launchctl start ai.openclaw.gateway
```

---

## Troubleshooting

### Bot Not Responding in Group
**Cause:** `groupPolicy: "allowlist"` blocking messages  
**Fix:** Set `groupPolicy: "open"` or add group to `groups` config

### Privacy Mode Blocking Messages
**Cause:** BotFather privacy mode ON  
**Fix:**
1. Go to @BotFather
2. `/setprivacy` → select bot → **DISABLE**
3. Remove + re-add bot to group

### Wrong Group ID
**Cause:** Supergroup ID changed after enabling topics  
**Fix:** Check actual ID in logs:
```bash
tail -50 /tmp/openclaw/openclaw-2026-04-22.log | grep chatId
```

### Session Corruption (`:0` Bug)
**Cause:** Known OpenClaw bug after compaction  
**Fix:**
- Type `/new` in chat (resets session)
- Or restart gateway:
  ```bash
  launchctl stop ai.openclaw.gateway
  sleep 3
  launchctl start ai.openclaw.gateway
  ```

---

## Security Notes

| Setting | Value | Why |
|---------|-------|-----|
| `groupPolicy` | `open` | Allows group messages |
| `dmPolicy` | `open` | Allows DMs |
| `requireMention` | `false` | Bot responds without @mention |
| `allowFrom` | `["*"]` | Accepts all senders |

**⚠️ Warning:** This is an open configuration. For production with multiple users, tighten `allowFrom` and `groupAllowFrom`.

---

## Known Limitations

| Issue | Workaround |
|-------|-----------|
| No cross-topic memory | Manually share context via copy-paste |
| Session corruption bug | Restart gateway or `/new` command |
| 3x API cost (3 agents) | Monitor token usage |
| Topics don't sync across devices | Use same Telegram account |

---

## Related Files

| File | Purpose |
|------|---------|
| `CONFIG_INVENTORY.md` | Full config backup for updates |
| `backup-before-update.sh` | Pre-update backup script |
| `TOPICS_SETUP_GUIDE.md` | Quick setup reference |

---

**Created:** 2026-04-22  
**Last Updated:** 2026-04-22  
**Branch:** `multi-agent-topics`  
**Next Review:** Post 2026.4.21 update
