# OpenClaw Project Progress

## 2026-03-25: Smart Router & Home Network Audit

### 1. The Smart Router Plugin
* **Issue:** Massive 170k+ token HTML payloads (from headless browser scraping) were burning through OpenRouter API credits ($5/day) because OpenClaw was sending the entire conversation history to Mistral Large.
* **Resolution:** 
  * Wrote `custom-router-plugin.ts` using the new OpenClaw SDK (`definePluginEntry`).
  * Implemented an emergency token bloat firewall that automatically strips history for any message over 50,000 characters.
  * Configured Semantic Triage using your local Ollama server (`tinydolphin` model at `host.docker.internal:11434`). The local model evaluates if the query requires history. If it replies "YES", we drop the 170k token payload before routing to the cloud.

### 2. Home Network & Airtel Diagnostic Setup
* **Goal:** Use OpenClaw from the VPS to diagnose frequent Airtel Wi-Fi disconnects by monitoring the router's Optical Rx/Tx power levels.
* **Architecture:** Tailscale Subnet Routing bridging the VPS container to the `192.168.1.x` home network.
* **Findings:**
  * Samsung Android phone failed to hold the bridge open due to OS battery optimizations restricting IP forwarding. 
  * Port scanned the subnet and mapped the active topology:
    * `192.168.1.1` - Airtel Router (Boa Web Server). Reached successfully over the tunnel. Returned `401 Unauthorized` for `admin/admin`. (Needs physical sticker password).
    * `192.168.1.4` - HP Smart Tank Printer.
    * `192.168.1.7` - Google Cast Device.
    * `192.168.1.8` - TP-Link Wi-Fi Extender. (This is acting as a secondary NAT and hiding the Smart TV and IoT devices behind an invisible subnet).
    * `192.168.1.9` - OpenWrt Router.
    * `192.168.1.14` - Windows PC (Microsoft IIS 10). Remote administration ports (RDP/SSH/WinRM) are blocked by Windows Firewall.
  
### 3. Tomorrow's Action Items
1. Install Tailscale on the Windows PC/Laptop and turn on "Advertise Subnet" to create a permanent, non-sleeping tunnel.
2. Get the Airtel router password from the sticker to build the optical fiber health scraper.
3. Potentially remap the TP-Link extender to Access Point (AP) mode so the Smart TV and Alexa plug sit on the main `192.168.1.x` subnet.

### 🔄 CrewAI Pipeline Fixed (2026-04-28)
- All hardcoded `/home/dell` paths → portable `~/` paths
- CrewAI v1.14.2 operational with Gemma 4
- Full observability stack (codeburn, metrics, agent status)
- 5 agents: coder, researcher, reviewer, planner, executor
- GBrain memory adapter working
- `crewai-task.py` command added for orchestrated tasks

### ⚡ Inference Engine Deep Dive (2026-04-28)
- **Ollama ✅ Production winner** — Gemma 4 E4B Q4_K_M, 27 t/s, 81 c/s, 6-8 GB RAM
- **MLX-VLM ⚠️ Works but slower** — Same E4B via mlx-vlm 0.4.4: 21 t/s, 6.9 GB RAM, 186s gen vs Ollama's 1.5s
- **MLX-VLM E2B ⚡ Fast but lighter** — Community E2B 4bit: 60 t/s, 3.6 GB RAM, good for speed-critical tasks
- **MLX-LM 0.31.3** — Has gemma4.py but no shared KV layer support; community models need mlx-vlm
- **llama.cpp** — Already IS Ollama under the hood; no separate test needed
- **Identity:** Gutchapa = DeepSeek V4 Flash in OpenClaw. Pi = Kimi Code. Different agents, different backends.
- **Key finding:** Same model (E4B) produces identical quality across all engines. Ollama wins on practicality.

### 🏆 Quality Shootout (2026-04-28)
- Tested all 3 engines with the same prompt (School Fee Receipt Generator)
- **Winner: Ollama 🏆** — 15.5K chars in 1.5s vs MLX E4B's 16K chars in 186s
- MLX conversion of Google's official E4B completed: 15 GB BF16 → 6.4 GB 4bit
- Outputs saved to ~/Desktop/shootout_*.txt
- **Verdict:** Engine is just the chariot; Gemma 4 is the horse. Use Ollama daily, MLX for E2B speed needs.
