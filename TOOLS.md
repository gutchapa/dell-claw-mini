# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## ⚠️ Tool Cost & API Usage Reference

**User does NOT pay for OpenClaw directly.** This section tracks which tools may have hidden costs.

### Tools That May Incur Costs (External APIs)

| Tool | Provider | Cost Model | Notes |
|------|----------|------------|-------|
| `web_search` | Gemini (Google) | Google's API | Uses Google's Search API |
| `code_execution` | xAI | xAI-hosted | Runs on xAI's Python sandbox with Grok models |
| `x_search` | xAI | xAI-hosted | Uses xAI's Twitter/X API |
| `image_generate` | Various | Provider-dependent | Uses OpenAI, Google, or FAL based on config |

### Tools That Use YOUR API Keys (You Pay)

| Tool | Uses Your API Key | Provider |
|------|-------------------|----------|
| `sessions_spawn` (Codex/Claude) | ✅ Yes | Your configured ACP agents |
| `image` (vision) | ✅ Yes | Your configured model |
| `sessions_send` to other agents | ✅ Yes | Uses your agent configs |

### Tools That Are FREE (Local Execution)

| Tool | Cost | Notes |
|------|------|-------|
| `exec` | ✅ Free | Runs on YOUR machine, uses YOUR resources |
| `read` | ✅ Free | Local file access |
| `write` | ✅ Free | Local file operations |
| `edit` | ✅ Free | Local file modifications |
| `memory_search` | ✅ Free | Local memory files |
| `process` | ✅ Free | Local process management |
| `web_fetch` | ⚠️ Maybe | HTTP fetch - bandwidth cost only |

### Safe Approach Going Forward

**To avoid hidden costs:**
1. ✅ Use `exec` + local Python for calculations (free)
2. ✅ Use `read`/`write` for file operations (free)
3. ⚠️ Avoid `code_execution` for math (uses xAI/Grok)
4. ⚠️ Avoid `web_search` unless necessary (uses Google/Gemini)
5. ⚠️ Avoid `x_search` unless necessary (uses xAI)

**For math/calculations:**
```bash
# Instead of code_execution (xAI/Grok):
exec: python3 -c "print(2+2)"  # FREE, local
```

**Last updated:** 2026-04-19 - Added cost tracking after Grok usage incident

---

Add whatever helps you do your job. This is your cheat sheet.
