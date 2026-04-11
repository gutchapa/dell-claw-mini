# Telegram Issues & Fixes Log

## Issue 1: DNS Resolution Failure (claw.moonshot.cn)
**Date:** 2026-04-01
**Symptom:** Gateway fails to start in remote mode, DNS NXDOMAIN for claw.moonshot.cn
**Root Cause:** Domain uses Alibaba Cloud DNS with geo-restrictions
**Fix:** 
- Set gateway mode to `local` in `~/.openclaw/openclaw.json`
- Configure DNS to 8.8.8.8 via systemd-resolved
- Added `generateResolvConf = false` to `/etc/wsl.conf`

## Issue 2: 409 Conflict - Duplicate Bot Polling
**Date:** 2026-04-01
**Symptom:** `409: Conflict: terminated by other getUpdates request`
**Root Cause:** Multiple gateway instances polling same Telegram bot
**Fix:**
- Removed duplicate TELEGRAM_BOT_TOKEN from systemd environment
- Stopped old gateway processes
- Added `--allow-unconfigured` flag to systemd override

## Issue 3: Telegram Provider Stuck in Retry Loop
**Date:** 2026-04-01 to 2026-04-02
**Symptom:** `[telegram] [default] starting provider` never completes, no polling
**Root Cause:** `TelegramPollingSession.#ensureWebhookCleanup()` infinite retry on network error
**Log Evidence:**
```
[telegram] deleteWebhook failed: Network request for 'deleteWebhook' failed!
[telegram] webhook cleanup failed; retrying in 30s
```
**Fix:**
- Network config: `dnsResultOrder: ipv4first`, `autoSelectFamily: false`
- Wait for retry loop to self-resolve (5-10 minutes)
- Full restart as last resort

## Issue 4: Network Outage - 7 Hour Gap
**Date:** 2026-04-02 (00:18 AM - 08:45 AM IST)
**Symptom:** No messages received, `UND_ERR_CONNECT_TIMEOUT` errors
**Root Cause:** Windows hibernation/sleep caused WSL2 network suspend
**Log Evidence:**
```
Apr 01 18:48:09 [telegram] fetch fallback: DNS-resolved IP unreachable
Apr 02 03:15:00 [telegram] Polling stall detected (28391.8s ≈ 7.9 hours)
```
**Fix:**
- Disable Windows hibernation: `powercfg /hibernate off`
- Set power plan to never sleep: `powercfg /change standby-timeout-ac 0`

## Issue 5: SendChatAction/Typing Indicator Failed
**Date:** 2026-04-02
**Symptom:** Messages work but typing indicator doesn't appear
**Root Cause:** Typing signal subsystem crashed during network outage, didn't auto-recover
**Status:** Minor cosmetic issue - messages still work
**Workaround:** Full restart (risk: may trigger Issue #3)

## Current Configuration (Working)

### ~/.openclaw/openclaw.json
```json
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "open",
      "allowFrom": ["*"],
      "botToken": "8637124523:AAHGO_lEJZgju7MP_dY5DbnwHZp58oeYPCc",
      "network": {
        "dnsResultOrder": "ipv4first",
        "autoSelectFamily": false
      }
    }
  }
}
```

### DNS Configuration
```bash
# /etc/systemd/resolved.conf
[Resolve]
DNS=8.8.8.8
FallbackDNS=8.8.4.4

# /etc/wsl.conf
[network]
generateResolvConf = false
```

## Bug Report Status
- File: `~/.openclaw/TELEGRAM_BUG_REPORT.md`
- Status: Ready to submit to github.com/openclaw/openclaw/issues
- Issue: `TelegramPollingSession.#ensureWebhookCleanup()` needs timeout/retry limit

## Migration Verification ✅
| Component | Status |
|-----------|--------|
| Config | ✅ Migrated |
| Chat History | ✅ 4 session files |
| Memory Files | ✅ 2 files |
| IDENTITY.md | ✅ Present |
| SOUL.md | ✅ Present |
| Telegram Bot | ✅ Working (with workarounds) |

---
Last Updated: 2026-04-02
