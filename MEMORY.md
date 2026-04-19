# MEMORY.md - Long-Term Context & Lessons Learned

**Status:** Created April 19, 2025  
**Purpose:** Curated memory to prevent repeated mistakes and improve performance  
**Security:** Main session only - never load in shared/group contexts

---

## 🧠 Core Lessons (MUST REMEMBER)

### Lesson 1: Deep Search Protocol
**Date:** April 19, 2025  
**Mistake:** Claimed "no memory" of user's Thanjavur trip because `.route_cache.json` was in `driving-assistant/` subdirectory, not root.  
**Root Cause:** Used `ls` root only, not recursive `find`.  
**Fix:** Always run deep search on startup (added to AGENTS.md).  
**Command:**
```bash
find /home/dell/.openclaw/workspace -type f \( -name "*.json" -o -name "*.md" \) -mtime -1 2>/dev/null
```

### Lesson 2: Memory Persistence Gaps
**Date:** April 19, 2025  
**Mistake:** Session data not auto-flushing to `memory/YYYY-MM-DD.md`  
**Root Cause:** No automated session-end hook to save context.  
**Fix:** 
- Manually flush important context to `memory/YYYY-MM-DD.md` during sessions
- At session end, summarize and write to daily memory file
- Cross-reference with existing files before claiming "no memory"

### Lesson 3: Path Assumptions
**Date:** April 18-19, 2025  
**Mistake:** Hardcoded `/home/dell/.openclaw/workspace` in multiple scripts.  
**Root Cause:** Didn't use environment variables.  
**Fix:** Update all scripts to use `$WORKSPACE` env var for Mac Mini migration.
**Files to fix:**
- `soul-enforcer.sh`
- `openclaw-adapters/adapters/ollama_llm.py`
- `subagents/coder/run-kimi.py`

---

## 📍 User Context

### Travel Patterns
- **Home Base:** Pallavaram, Chennai (12.989°N, 80.221°E)
- **Frequent Destination:** Thanjavur (11.219°N, 78.168°E)
- **Route Distance:** ~269 km straight-line, ~320 km road
- **Typical Drive Time:** 5 hours (includes stops)

### Recent Trip (April 18, 2025)
- **Route:** Pallavaram → Thanjavur
- **Time:** 21:00 IST → 02:01 IST
- **Avg Speed:** 54 km/h total, 67 km/h driving time
- **Data Source:** `driving-assistant/.route_cache.json`

---

## ⚙️ Technical Stack

### Current Environment (Dell WSL2)
- **OS:** Linux 6.6.87.2-microsoft-standard-WSL2
- **Location:** `/home/dell/.openclaw/workspace`
- **Models:** Ollama (phi3:mini, tinydolphin, qwen2.5-coder:0.5b)
- **14B Models:** OOM (Out of Memory) on 16GB RAM

### Migration Target (Mac Mini M4)
- **Specs:** Apple Silicon M4, 16GB unified RAM, 256GB SSD
- **Expected Path:** `/Users/RamEsh/openclaw/workspace`
- **Advantages:** Metal GPU, better memory, can run 14B models
- **Status:** Arriving April 19, 2025

### Git Repository
- **Remote:** github.com/gutchapa/dell-claw-mini
- **Branch:** `dell-mini-pc-setup-v3`
- **Key Commits:**
  - `1993a3f` - SOUL-EL + Dynamic Deployment + Code Burn fixes
  - `f553fa0` - Updated migration script

---

## 🔧 System Improvements Made

### SOUL Enforcement Layer (SOUL-EL)
- **File:** `soul-enforcer.sh`
- **Purpose:** Real-time compliance checking before actions
- **Checks:** CrewAI orchestration, completeness, delegation, verification
- **Log:** `memory/soul-violations.md`

### Dynamic Deployment
- **File:** `openclaw-adapters/adapters/ollama_llm.py`
- **Feature:** Auto-parses file paths from prompts
- **Example:** "Create simple-browser/App.tsx" → materializes at that path

### Enhanced Coder Agent
- **File:** `subagents/coder/run-kimi.py`
- **Features:** Multi-language support, Kimi Code API, error handling
- **Languages:** Python, TypeScript, JSX, HTML

### Browser Components
- **simple-browser/** - React Native mobile browser
- **simple-browser-ts/** - Vite + React + TypeScript desktop browser
- **System Prompts:** `browser_system_prompt.md`, `browser_ts_system_prompt.md`

---

## 🎯 User Preferences

### Communication Style
- **Preferred:** Crisp, direct, tables over walls of text
- **Disliked:** Corporate speak, filler words, "it depends" without examples
- **Format:** Copy-paste friendly code blocks, actionable recommendations

### Decision Patterns
- **Hardware:** Enterprise-grade, proven track record, real user reviews
- **Services:** Check clients first (banks/govt/schools), then pricing
- **Code:** Edge cases, thorough testing, clear documentation

### Active Projects (High Priority)
1. **Mac Mini M4 Migration** - Code ready, awaiting hardware
2. **WhatsApp Business Setup** - School communications (500+ parents)
3. **Intel AX200 Installation** - HP laptop WiFi fix

---

## 🚨 Known Issues & Workarounds

| Issue | Status | Workaround |
|-------|--------|------------|
| Path hardcoding | ⚠️ In Progress | Use `$WORKSPACE` env var |
| Shallow searches | ✅ Fixed | Added to AGENTS.md startup |
| Memory flush gaps | ⚠️ Manual | Write to daily files proactively |
| 14B models OOM | ✅ Will Fix | Mac Mini arrival imminent |

---

## 📝 Memory Maintenance Schedule

**Daily:**
- Flush session context to `memory/YYYY-MM-DD.md`
- Update this file if significant lessons learned

**Weekly:**
- Review daily files, distill to MEMORY.md
- Prune outdated info

**On Mac Mini Migration:**
- Copy this file to new workspace
- Update all hardcoded paths
- Verify all components work

---

**Last Updated:** April 19, 2025 03:30 UTC  
**Next Review:** Post Mac Mini migration
