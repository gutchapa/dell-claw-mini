# Pi Repair Summary - Dell / Vistara Machine
**Date:** April 3, 2026

## The Issue
After running `/reload`, the `pi` tool entered a startup crash loop.
- **Error:** Missing `apiKey` for custom/local models (`phi3-local`, `gemma-local`).
- **Conflict:** Session history used provider names (`kimi-coding`) that didn't match the restored config (`kimi`).
- **Location Sync:** Two `models.json` files (`~/.pi` and `~/.openclaw`) were out of sync.

## Fixes Applied
1. **Restored Models:** Recovered the full 12KB provider list from `~/.openclaw`.
2. **Schema Fix:** Added `"apiKey": "local"` to all local providers to satisfy the validator.
3. **Name Alignment:** Synced provider/model names to match existing session history (`kimi-coding` / `kimi-k2-thinking`).
4. **Consistency:** Overwrote both `~/.pi/agent/models.json` and `~/.openclaw/agents/main/agent/models.json` with the same clean data.
5. **Process Cleanup:** Killed all lingering `node` and `pi` processes across Windows and WSL.
6. **DNS Fix:** Made the `8.8.8.8` nameserver permanent via `/etc/wsl.conf`.

## Current Status
- Configs are synced and validated.
- Session history is restored.
- Environment is ready for a fresh `pi` start.

## Final Update (Root Cause of the "Loop")
**Date:** April 4, 2026

While the configuration sync fixed the initial crashes, the agent remained stuck in an apparent infinite model-selection loop whenever a prompt (like "hello") was typed.

- **The Real Culprit:** A custom keybinding in `~/.pi/agent/keybindings.json`.
- **The Issue:** The action `app.model.select` was mapped to `["ctrl+l", "ctrl+m"]`. In terminal environments, the `Enter` (Return) key is transmitted as the `ctrl+m` control character (Carriage Return).
- **The Effect:** Every time `Enter` was pressed to submit a message, the terminal sent `ctrl+m`, causing `pi` to intercept it and pop up the Model Selector instead of sending the prompt.
- **The Fix:** Removed `ctrl+m` from `app.model.select`. Model selection is now accessed cleanly via `ctrl+l`, and the `Enter` key successfully submits prompts again.
