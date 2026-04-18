# PATCHES.md

System-level fixes for OpenClaw migration from Raspberry Pi to Mac Mini M4.

## Overview

These patches fix platform-specific issues that prevent OpenClaw from running on non-Pi hardware. Apply these after installing OpenClaw on Mac Mini.

---

## Fix 1: Config - Remove Invalid Keys from openclaw.json

**File:** `~/.openclaw/openclaw.json`

**Problem:** Config contained Raspberry Pi-specific keys that cause JSON validation errors:
- `"pi_gpio_pinout"`
- `"rpi_embedded_mode"`  
- `"armv7_optimizations"`

**Fix Applied:** Removed invalid Pi-specific keys, kept portable settings.

**Apply on Mac Mini:**
```bash
# Backup existing config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup 2>/dev/null || true

# Remove invalid keys
sed -i '' '/"pi_gpio_pinout"/d; /"rpi_embedded_mode"/d; /"armv7_optimizations"/d' ~/.openclaw/openclaw.json

# Validate
jq . ~/.openclaw/openclaw.json
```

---

## Fix 2: Patch Compiled JS Bundle for ARM64 Compatibility

**File:** `~/.npm-global/lib/node_modules/openclaw/dist/pi-embedded-bukGSgEe.js`

**Problem:** Minified JS bundle has hardcoded Pi checks:
- `process.platform === 'linux' && /armv7l/.test(process.arch)` fails on macOS/aarch64
- `pigpio` library calls incompatible with macOS (no GPIO)
- Platform errors prevent CLI from loading

**Fix Applied:** Patched minified JS to:
- Replace Pi-specific checks with generic ARM detection
- Stub out `pigpio` with macOS-compatible noop functions
- Add macOS fallback for BukJS loader

**Apply on Mac Mini:**
```bash
# Backup
FILE="~/.npm-global/lib/node_modules/openclaw/dist/pi-embedded-bukGSgEe.js"
cp "$FILE" "$FILE.backup" 2>/dev/null || true

# Patch 1: Generic ARM detection
sed -i '' "s|process.platform==='linux'&&/armv7l/.test(process.arch)|/arm(v[67]l|64)/.test(process.arch)|g" "$FILE"

# Patch 2: Stub pigpio
sed -i '' "s|require('pigpio')|{init:()=>{},open:()=>({read:()=>0})}|g" "$FILE"

# Patch 3: Add darwin check
sed -i '' "s|if(process.platform==='linux')|if(process.platform==='linux'||process.platform==='darwin')|g" "$FILE"

# Verify
openclaw --version
```

---

## Verification

- [ ] `openclaw --version` runs without errors
- [ ] `openclaw status` shows correct platform
- [ ] No GPIO/pigpio related warnings

---

**Created:** April 18, 2026
**Applies to:** Mac Mini M4 (Apple Silicon)
