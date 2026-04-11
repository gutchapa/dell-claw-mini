# Session Tracking File
# This file tracks the current active session for restoration purposes
# Last updated: 2026-04-10 05:16 UTC

## Current Session
SESSION_ID=agent:main:telegram:direct:791865934
SESSION_KEY=agent:main:telegram:direct:791865934

## Session Details
- Agent: main (Gutchapa)
- Channel: telegram
- Type: direct
- User: RamEsh (791865934)
- Model: kimi/kimi-code
- Started: 2026-04-05

## Hardware Decision
- [ORDERED] Mac mini M4 16GB / 256GB — for zero-token local LLM inference
- Expected: 5-10x speedup over current CPU setup
- Metal GPU support for llama.cpp

## Migration Plan (When Mac Mini Arrives)
### Complete Stack to Migrate
1. **OpenClaw Core**
   - ~/.openclaw/ (full directory)
   - ~/.openclaw/workspace/ (configs, memories, tools)
   - ~/.openclaw/memory/ (daily logs)

2. **Stripped Pi Implementation**
   - Custom Pi agent setup (Kimi-integrated)
   - Pi adapter modifications
   - Configuration files

3. **Stripped Paperclip Fork**
   - ~/paperclip-fork/ (entire directory)
   - Custom Kimi adapter (@paperclipai/adapter-kimi-local)
   - UI modifications (registry.ts)
   - All package modifications

4. **TurboQuant + Benchmarks**
   - ~/turboquant/ (DeepSeek scripts)
   - Benchmark results and configs

5. **Models & Data**
   - ~/.ollama/models/ (GGUF files)
   - Or re-download fresh on Mac mini

### Setup Steps on Mac Mini
1. **Base Installation**
   - macOS setup + Homebrew
   - Install OpenClaw
   - Install Ollama (Metal GPU enabled)
   - Install Node.js (for Paperclip)
   - Install Python (for TurboQuant)

2. **File Migration**
   ```bash
   # Preserve exact directory structure
   rsync -av ~/.openclaw/ mac-mini:~/.openclaw/
   rsync -av ~/paperclip-fork/ mac-mini:~/paperclip-fork/
   rsync -av ~/turboquant/ mac-mini:~/turboquant/
   ```

3. **Configuration Updates**
   - Update paths in configs (macOS vs Linux differences)
   - Reconfigure Ollama for Metal GPU
   - Rebuild Paperclip packages
   - Rebuild TurboQuant environment

4. **Validation**
   - Test OpenClaw gateway
   - Test Pi agent connectivity
   - Test Paperclip with Kimi adapter
   - Test Gemma 4 / DeepSeek inference speed

### Integration Testing
- [ ] OpenClaw → Pi (stripped) working
- [ ] OpenClaw → Paperclip → Kimi adapter working
- [ ] Ollama Metal GPU acceleration confirmed
- [ ] All three models (Pi, Paperclip, Ollama) coexisting
- [ ] Zero-token operation verified

### Post-Migration Priority Tasks
- [ ] **Pi Repo PR** — Contribute direct Kimi API integration (stripped Pi) to official Pi repository
  - Add Kimi provider alongside Inflection default
  - Enable zero-token operation for Pi users
  - Include performance benchmarks from Metal GPU
  - Reference: Our battle-tested implementation

## Recent Subagents/ACPS
- agent:pi:acp:9b6588ad-2636-4706-aeda-1be10d60812e (DeepSeek download - killed)
- agent:main:subagent:c0be452a-caee-4713-8082-d8f811a2b601 (DeepSeek pull - killed)

## Active Work
- [COMPLETED] Qwen 3.5 4B IQ4_XS text-only — Downloaded, vision stripped, Ollama model created ✅
- [IN PROGRESS] Gemma 4 E2B testing (llama.cpp server running on :8080)
- [PENDING] DeepSeek R1 8B download to Windows filesystem
- [COMPLETED] Kimi adapter for Paperclip fork
- [COMPLETED] Telegram mediaMaxMb config fix
- [DECIDED] Mac mini M4 16GB purchase
- [COMPLETED] HP 247 G8 WiFi Fix — Identified RTL8822CE failure, sourced Intel AX200 for ₹1,200 (Ritchie Street)
- [IN PROGRESS] Intel AX200 Installation — Card ready, installation pending
- [COMPLETED] WhatsApp Business API Research — Vetted providers, selected Gupshup/ValueFirst (enterprise-grade, serve banks)
- [COMPLETED] Paperclip Ollama Adapter — Full adapter created, tested with phi3:mini (49s response), UI registered
- [PENDING] Paperclip UI Build — Adapter code complete, needs final build to activate
- [COMPLETED] USER.md — Created comprehensive user profile with decision patterns
- [COMPLETED] Flight Search Tool — Created April 19 specific search (Mangalore→Chennai, IndiGo 7345 at 07:55, ₹7,088)

## User Preferences
- **Default Agent for Tasks:** Pi (via ACP runtime)
- **Current Setup (Until Mac Mini):** Pi + Kimi API (cloud-based, zero local dependencies)
- **Future Setup (After Mac Mini):** Pi + Local LLM (Gemma 4/DeepSeek on Metal GPU)
- **Effective:** Immediately — all future spawns use Pi unless specified otherwise

## To Restore
If session is lost, use this session key to resume context.

## Recent Decisions & Learnings

### WiFi Adapter Replacement Strategy
- **Problem:** Realtek RTL8822CE Code 10 errors, intermittent failures
- **Root Cause:** Hardware defect, BGA soldering issues
- **Solution:** Intel AX200 M.2 2230 replacement
- **Source:** Ritchie Street, Chennai — ₹1,200
- **Key Learning:** Enterprise-grade hardware > cheap fixes for critical systems

### WhatsApp Business API Vendor Selection
- **Rejected:** BhashSMS (fraud complaints), TryowBOT (zero reviews), MSG91 (poor service)
- **Selected:** Gupshup (serves ICICI, Kotak, HDFC) + ValueFirst/Tanla (15% market share)
- **Criteria:** Check enterprise clients first, then pricing
- **Cost Estimate:** ₹400-600/month for 500 parents

### USER.md Created (2026-04-09)
Documented user preferences:
- Hardware: Enterprise-grade, proven track record
- Services: Credibility first (banks/govt clients)
- Code: Edge cases, thorough testing, copy-paste format
- Output: Crisp, tables, bottom-line-first

## Agent Capabilities Discovered (2026-04-07)

### File Upload to Telegram
**DISCOVERY:** Agent can send files to Telegram using `MEDIA:` prefix syntax.

**Syntax:**
```
MEDIA:./relative/path/to/file
```

**Rules:**
- Must use relative path (./ or ../)
- NO absolute paths (blocked for security)
- NO ~ paths (blocked for security)
- File must be in accessible directory (workspace or subdirectories)
- Works for PDFs, images, documents

**Example:**
```
MEDIA:./workspace/photons_messengers_of_reality.pdf
```

**Use Cases:**
- Sharing generated documents
- Sending screenshots/visualizations
- Delivering reports/exports

**Source:** Context hint appeared when user sent image: "To send an image back, prefer the message tool (media/path/filePath)... use MEDIA:./image.jpg"


## Daily Panchangam Setup (2026-04-10)
- Scripts: /home/dell/panchangam.py
- Cron: Daily 2:30 AM UTC = 8:00 AM IST
- API: ProKerala credentials in /home/dell/.env
- Location: Chennai coordinates
- Status: API endpoint 404 error needs fixing
