# OpenClaw ACP & Subagent Configuration Fix

## Summary of Fixes Applied

### Issue 1: ACP Not Configured ✅ FIXED

**Problem:** ACP (Agent Coordination Protocol) was not configured, causing errors when trying to spawn ACP agents like Codex, Claude Code, etc.

**Solution:** Added complete ACP configuration to `~/.openclaw/openclaw.json`:

```json
"acp": {
  "enabled": true,
  "dispatch": { "enabled": true },
  "backend": "acpx",
  "defaultAgent": "codex",
  "allowedAgents": [
    "claude", "codex", "copilot", "cursor", "droid",
    "gemini", "iflow", "kilocode", "kimi", "kiro",
    "openclaw", "opencode", "pi", "qwen"
  ],
  "maxConcurrentSessions": 8,
  "stream": {
    "coalesceIdleMs": 300,
    "maxChunkChars": 1200
  },
  "runtime": {
    "ttlMinutes": 120
  }
}
```

### Issue 2: Gateway Pairing Required ✅ FIXED

**Problem:** Gateway was returning "pairing required" (1008) errors because the remote token wasn't configured to match the auth token.

**Solution:** Updated `gateway.remote` configuration to include token:

```json
"gateway": {
  "remote": {
    "url": "wss://103.143.17.156/api/gateway",
    "token": {
      "source": "env",
      "provider": "default",
      "id": "OPENCLAW_GATEWAY_TOKEN"
    }
  }
}
```

The token is already set in `~/.openclaw/.env` as `OPENCLAW_GATEWAY_TOKEN`.

### Issue 3: Missing Agent Definitions ✅ FIXED

**Solution:** Added agent definitions for ACP harnesses:

```json
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
      "id": "codex",
      "name": "Codex Agent",
      "workspace": "~/.openclaw/workspace-codex",
      "runtime": {
        "type": "acp",
        "acp": {
          "agent": "codex",
          "backend": "acpx",
          "mode": "persistent"
        }
      }
    },
    {
      "id": "claude",
      "name": "Claude Code Agent",
      "workspace": "~/.openclaw/workspace-claude",
      "runtime": {
        "type": "acp",
        "acp": {
          "agent": "claude",
          "backend": "acpx",
          "mode": "persistent"
        }
      }
    }
  ]
}
```

### Issue 4: ACPX Plugin Configuration ✅ FIXED

**Solution:** Added ACPX plugin configuration with permissions:

```json
"plugins": {
  "entries": {
    "acpx": {
      "enabled": true,
      "config": {
        "permissionMode": "approve-all",
        "nonInteractivePermissions": "fail",
        "pluginToolsMcpBridge": false
      }
    }
  }
}
```

## How to Use ACP Agents

### Spawning ACP Agents from Chat

Use the `/acp` command family:

```bash
# Spawn Codex in current conversation
/acp spawn codex --bind here

# Spawn with specific working directory
/acp spawn codex --bind here --cwd /home/dell/project

# Spawn in a new thread
/acp spawn codex --mode persistent --thread auto

# Check ACP status
/acp status

# List ACP sessions
/acp sessions

# Close ACP session
/acp close
```

### Spawning via Tool Calls

Use `sessions_spawn` with `runtime: "acp"`:

```json
{
  "task": "Build a React app",
  "runtime": "acp",
  "agentId": "codex",
  "thread": true,
  "mode": "session"
}
```

### Using Subagents (Native)

For OpenClaw-native subagents (not ACP), use default runtime:

```json
{
  "task": "Analyze logs",
  "agentId": "main"
}
```

## Verification Commands

```bash
# Check ACPX plugin status
openclaw plugins list | grep -A5 "ACPX"

# Check gateway status
openclaw gateway status

# Test ACP connectivity (after restart)
openclaw acp --help

# View gateway logs
journalctl --user -u openclaw-gateway.service -f
```

## Required CLI Tools

To use specific ACP harnesses, install the corresponding CLI tools:

```bash
# Install Codex CLI
npm install -g @openai/codex

# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Install Pi CLI
npm install -g @mariozechner/pi-coding-agent

# Install OpenCode CLI
npm install -g @opencode/cli
```

## Workspace Directories Created

- `/home/dell/.openclaw/workspace-codex` - Codex agent workspace
- `/home/dell/.openclaw/workspace-claude` - Claude Code agent workspace

## Restart Gateway

After configuration changes, restart the gateway:

```bash
systemctl --user restart openclaw-gateway.service

# Or
openclaw gateway restart
```

## Troubleshooting

### "ACP agent '<id>' is not allowed by policy"
- Add the agent ID to `acp.allowedAgents` list in config

### "pairing required" errors
- Ensure `gateway.remote.token` matches `gateway.auth.token`
- Both should reference the same env var: `OPENCLAW_GATEWAY_TOKEN`

### "ACP runtime backend is not configured"
- Ensure `acpx` plugin is enabled in config
- Check plugin status: `openclaw plugins list | grep acpx`

### Gateway connection issues
- Check gateway status: `openclaw gateway status`
- Verify token in `.env` file: `cat ~/.openclaw/.env | grep TOKEN`
- Restart gateway: `systemctl --user restart openclaw-gateway.service`

## Security Notes

- `permissionMode: approve-all` allows ACP agents to auto-approve file writes and shell commands
- For stricter security, change to `approve-reads` or `deny-all`
- Gateway token should be kept secret - it's already configured in `.env`

## References

- [ACP Agents Documentation](https://docs.openclaw.ai/tools/acp-agents)
- [Configuration Reference](https://docs.openclaw.ai/gateway/configuration-reference)
- [Subagents Documentation](https://docs.openclaw.ai/tools/subagents)
