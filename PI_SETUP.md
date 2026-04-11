# Pi Coding Agent Setup - Kimi Direct Configuration

## Overview
Pi is now configured to use Kimi API directly (no Ollama middleman), saving tokens and improving response times.

## What Was Changed

### Before (Ollama Route)
```
You → Pi → Ollama → Kimi API
```

### After (Direct Route)
```
You → Pi → Kimi API
```

## Configuration Files

### 1. ~/.pi/agent/auth.json
Kimi API authentication:
```json
{
  "kimi-coding": {
    "apiKey": "sk-kimi-l0Ju2tcVDDPnhM1YwyYls2k3I4n8RVhnNNIs32EfDmLSmqeGLoSgXxHuxshjWNqo"
  }
}
```

### 2. ~/.pi/agent/models.json
Provider and model configuration:
```json
{
  "providers": {
    "kimi-coding": {
      "api": "anthropic-messages",
      "baseUrl": "https://api.kimi.com/coding/",
      "models": [
        {
          "contextWindow": 262144,
          "id": "kimi-code",
          "input": ["text", "image"],
          "name": "Kimi Code",
          "reasoning": true
        }
      ]
    }
  }
}
```

### 3. ~/.pi/agent/settings.json
Default model selection:
```json
{
  "defaultModel": "kimi-code",
  "defaultProvider": "kimi-coding",
  "lastChangelogVersion": "0.64.0"
}
```

## Pi-Autoresearch Extension

### Installation
```bash
pi install https://github.com/davebcn87/pi-autoresearch
```

### Installed Components
- `~/.pi/agent/extensions/pi-autoresearch` - Extension tools
- `~/.pi/agent/skills/autoresearch-create` - Create experiment sessions
- `~/.pi/agent/skills/autoresearch-finalize` - Finalize experiments into branches

### Usage
```bash
# Start autonomous optimization
/autoresearch optimize [metric], [description]

# Toggle dashboard
Ctrl+X

# Fullscreen dashboard
Ctrl+Shift+X

# Stop autoresearch
/autoresearch off
```

## Environment Setup

### Temporary (per session)
```bash
export KIMI_API_KEY=sk-kimi-l0Ju2tcVDDPnhM1YwyYls2k3I4n8RVhnNNIs32EfDmLSmqeGLoSgXxHuxshjWNqo
pi
```

### Permanent (recommended)
```bash
echo 'export KIMI_API_KEY=sk-kimi-l0Ju2tcVDDPnhM1YwyYls2k3I4n8RVhnNNIs32EfDmLSmqeGLoSgXxHuxshjWNqo' >> ~/.bashrc
source ~/.bashrc
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `pi` | Start Pi with Kimi Code |
| `/model` | Switch between models |
| `/login` | Authenticate with different provider |
| `/autoresearch` | Start autonomous optimization loop |
| `/skill:autoresearch-create` | Create new experiment session |
| `/skill:autoresearch-finalize` | Finalize into reviewable branches |
| `Ctrl+L` | Quick model switcher |

## Benefits vs Ollama

| Aspect | Ollama Route | Direct Kimi |
|--------|--------------|-------------|
| Token Usage | Higher (wrapper overhead) | Lower (native API) |
| Latency | Higher | Lower |
| Reliability | Middleman failure risk | Direct connection |
| Features | Limited by Ollama | Full Kimi features |

## Troubleshooting

### Issue: "No API key found"
**Fix:** Ensure `KIMI_API_KEY` environment variable is set

### Issue: "Invalid provider"
**Fix:** Check `~/.pi/agent/models.json` has correct `kimi-coding` provider config

### Issue: Autoresearch not available
**Fix:** Run `pi install https://github.com/davebcn87/pi-autoresearch` again

## Resources

- Pi Documentation: https://pi.dev
- Pi GitHub: https://github.com/badlogic/pi-mono
- pi-autoresearch: https://github.com/davebcn87/pi-autoresearch
- Kimi API: https://api.kimi.com/coding/

---
Setup Date: 2026-04-02
Version: @mariozechner/pi-coding-agent v0.64.0
