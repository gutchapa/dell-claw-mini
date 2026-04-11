# Telegram Bot Issues & Fixes Documentation

**Date:** 2026-03-30  
**Bots Affected:** @gutch1234Bot (1234gutch), @tabopenBot (Tabopen)

---

## Summary

Both Telegram bots experienced downtime due to API key issues, configuration problems, and service misconfigurations. This document details all issues discovered and fixes applied.

---

## Issue 1: Kimi API Account Suspended

### Problem
OpenClaw Gateway was using a Moonshot API key that had no remaining credits:
```
Error: "Account suspended due to insufficient balance"
Key: [REDACTED - OLD_SUSPENDED_KEY]
```

### Root Cause
- The API key belonged to Moonshot platform (api.moonshot.ai/v1)
- Account had exceeded its quota
- All keys under this account were affected

### Fix
- Updated to use Kimi Code platform instead (api.kimi.com/coding/v1)
- Kimi Code uses session keys with different credit pool
- Session key: `[REDACTED - Get from ~/.config/kimi or env]`

---

## Issue 2: Kimi Code vs Moonshot - Different Platforms

### Discovery
There are **TWO different Kimi platforms**:

| Platform | Endpoint | Key Format | Use Case |
|----------|----------|------------|----------|
| **Kimi Code** | `api.kimi.com/coding/v1` | `sk-kimi-...` (session keys) | CLI, coding assistant |
| **Moonshot** | `api.moonshot.ai/v1` | `sk-...` (API keys) | API access for apps |

### Problem
- User provided `sk-kimi-...` keys expecting them to work with Moonshot API
- Moonshot API rejects Kimi Code session keys
- Kimi CLI uses OAuth/session-based auth, not API keys

### Fix
- Updated OpenClaw config to use Kimi Code endpoint: `api.kimi.com/coding/v1`
- Changed primary model from `google/gemini-3.1-pro-preview` to `kimi/kimi-code`
- Configured proper Anthropic-compatible API format

---

## Issue 3: Invalid Key Format

### Problem
User provided keys that were not valid API keys:
```
[REDACTED - Invalid key format examples]
```

### Fix
- Identified the correct working key from kimi-cli environment
- Added proper key to systemd service environment

---

## Issue 4: GLM API Balance Issues

### Problem
GLM API key had no balance:
```
Error: "余额不足或无可用资源包,请充值" (Insufficient balance)
```

### Fix
- Added GLM as fallback option only
- Primary remains on working providers

---

## Issue 5: Telegram Bot Polling Issues

### Problem
Bot would start but not respond to messages:
```
[telegram] [default] starting provider (@gutch1234Bot)
# But no response to user messages
```

### Causes
1. **Session locks**: Stale session files blocking new runs
2. **Webhook conflicts**: Previous webhook not cleared
3. **Model override loop**: Session forcing Gemini even when fallback triggered

### Fixes
1. Cleared session lock files:
   ```bash
   rm ~/.openclaw/agents/main/sessions/*.lock
   ```

2. Cleared Telegram webhook:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
   ```

3. Updated model priority to prevent session override:
   ```json
   "primary": "kimi/kimi-code",
   "fallbacks": ["google/gemini-2.5-pro", "groq/llama-3.3-70b-versatile", "ollama/llama3.2:1b"]
   ```

---

## Issue 6: Configuration File Corruption

### Problem
Config had unrecognized keys causing startup failures:
```
Error: "agents.defaults: Unrecognized key: providers"
Error: "agents.defaults.models.ollama/deepseek-r1:1.5b: Unrecognized key: context_window"
```

### Fix
- Restored from clean backup: `openclaw.json.backup.1774859920`
- Re-applied necessary changes cleanly
- Ran `openclaw doctor --fix` to validate config

---

## Issue 7: Groq API Integration

### Solution
Added Groq as a reliable fallback:
- **Endpoint:** `api.groq.com/openai/v1`
- **Key:** `[REDACTED - Set in environment variable]`
- **Model:** `llama-3.3-70b-versatile`
- **Status:** ✅ Working with free daily credits

---

## Final Working Configuration

### API Keys (in systemd service)
```
KIMI_CODING_API_KEY=[REDACTED - Get from kimi-cli auth]
GROQ_API_KEY=[REDACTED - Get from console.groq.com]
GLM_API_KEY=[REDACTED - Get from open.bigmodel.cn]
GOOGLE_API_KEY=[REDACTED - Get from Google AI Studio]
```

### Model Priority (openclaw.json)
```json
{
  "model": {
    "primary": "kimi/kimi-code",
    "fallbacks": [
      "google/gemini-2.5-pro",
      "groq/llama-3.3-70b-versatile",
      "ollama/llama3.2:1b"
    ]
  }
}
```

### Provider Config
```json
{
  "kimi": {
    "baseUrl": "https://api.kimi.com/coding/v1",
    "api": "anthropic-messages",
    "models": [{"id": "kimi-code", "name": "Kimi Code"}]
  },
  "groq": {
    "baseUrl": "https://api.groq.com/openai/v1",
    "api": "openai-completions",
    "models": [{"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B"}]
  }
}
```

---

## Key Takeaways

1. **Kimi Code ≠ Moonshot**: Different endpoints, different keys, different credit pools
2. **Session keys ≠ API keys**: Kimi CLI uses session auth, applications need API keys
3. **Always test keys first**: Use `curl` to verify keys work before configuring
4. **Multiple fallbacks essential**: When one provider fails, others should take over
5. **Clear session locks**: Stale locks can block bot from processing messages

---

## Verification Commands

```bash
# Check Kimi Code API
curl -X POST https://api.kimi.com/coding/v1/messages \
  -H "Authorization: Bearer [YOUR_KIMI_CODING_KEY]" \
  -H "Content-Type: application/json" \
  -H "Anthropic-Version: 2023-06-01" \
  -d '{"model": "kimi-code", "max_tokens": 20, "messages": [{"role": "user", "content": "Hello"}]}'

# Check Groq API
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer [YOUR_GROQ_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": "Hello"}]}'

# Check Telegram bot
curl "https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getMe"

# Restart services
systemctl --user restart openclaw-gateway.service
systemctl --user restart smart-semantic-daemon.service
```

---

## Status

| Bot | Status | Primary Model |
|-----|--------|---------------|
| @gutch1234Bot | ✅ Active | kimi/kimi-code |
| @tabopenBot | ✅ Active | Local semantic router |

Both bots operational as of 2026-03-30.
