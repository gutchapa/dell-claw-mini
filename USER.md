# USER.md - About Your Human

_Learn about the person you're helping. Update this as you go._

## **Identity**
- **Name:** RamEsh
- **Location:** Chennai, India
- **Timezone:** IST (UTC+5:30)

---

## **Context**

### **Professional**
- Runs a **school** with **500+ parents/students**
- Managing **IT infrastructure** for educational institution
- Decision-maker for technology procurement

### **Technical Stack**
- **Primary:** HP 247 G8 Notebook PC (WiFi issues resolved with Intel AX200)
- **Development:** Dell laptop with WSL2 (migrated to D: drive)
- **Incoming:** Mac Mini M4 (16GB RAM, 256GB SSD) for local AI/LLM
- **Projects:**
  - Paperclip fork with local LLM integration (Ollama adapter)
  - Pi agent with Kimi API
  - TurboQuant for model benchmarking
  - WhatsApp Business API for school communications

---

## **Decision-Making Patterns**

### **🔧 For Hardware/Products:**
- **Priority 1:** Reliability & proven track record
- **Priority 2:** Cost-effectiveness (not cheapest, but value)
- **Must Check:** Real user reviews, enterprise clients, ratings
- **Avoid:** Unknown vendors, zero reviews, "too good to be true" pricing
- **Example:** Intel AX200 over cheap Realtek replacements; AISensy/Gupshup over unknown WhatsApp providers

### **💼 For Services/Vendors:**
- **Credibility First:** Who are their clients? (Banks, government, schools)
- **Evidence Required:** Case studies, verified reviews, market presence
- **Local Preference:** Chennai-based when possible (Ritchie Street for hardware)
- **Red Flags:** No independent reviews, fraud complaints, poor support

### **💻 For Coding/Development:**
- **Use Cases:** Always include edge cases and real-world scenarios
- **Testing:** Thoroughly test before delivering (not just "it works")
- **Documentation:** Clear comments, README files
- **Code Format:** Always use copy-paste friendly code blocks
- **Quality:** Production-ready, not just proof-of-concept

---

## **Communication Preferences**

### **✅ Preferred:**
- **Crisp, direct** responses
- **Tables** over long paragraphs
- **Bottom line first**, details later
- **Actionable** recommendations with clear next steps
- **Honest assessments** (admit when something is risky/unknown)

### **❌ Disliked:**
- Corporate speak, filler words
- "It depends" without concrete examples
- Lengthy explanations without clear takeaways
- Suggestions without credibility checks

---

## **Key Lessons Learned**

### **WiFi Adapter Replacement:**
- Realtek RTL8822CE has known hardware defects (Code 10 errors)
- Intel AX200 is the reliable replacement (~₹1,200 in Ritchie Street)
- Installation: Remove antennas, unscrew, swap, reconnect

### **WhatsApp Business API:**
- Must use official BSP (Business Solution Provider) - no DIY
- Enterprise providers: Gupshup (serves Kotak, ICICI), ValueFirst/Tanla
- Avoid: BhashSMS (fraud complaints), TryowBOT (zero reviews), MSG91 (poor service)
- Cost: ~₹400-600/month for 500 parents with AISensy/Gupshup

### **Paperclip Local LLM:**
- Created Ollama adapter for local models (phi3:mini, tinydolphin, qwen)
- Adapter successfully tested with phi3:mini (49s first load)
- UI integration complete, needs build to activate

### **Ollama Model Benchmarks (Dell):**
- tinydolphin: Fastest (636MB)
- phi3:mini: Good balance (2.2GB, ~49s response)
- qwen35-4b-text: Custom stripped model (2.7GB)
- mannix/qwen2.5-coder:0.5b: Ultra-fast coding (349MB)
- 14B models: OOM on 16GB RAM (need Mac Mini M4)

---

## **Active Projects**

### **High Priority:**
1. **Mac Mini M4 Migration** — **CODE READY** — Stack migration (OpenClaw, Pi, Paperclip, TurboQuant, Ollama). Branch: `dell-mini-pc-setup-v3`
   - ✅ SOUL-EL (Enforcement Layer) committed
   - ✅ Dynamic Deployment committed  
   - ✅ Code Burn fixes committed
   - ✅ Browser components: `simple-browser/`, `simple-browser-ts/`
   - ⚠️ Action needed: Update hardcoded `/home/dell` paths → `/Users/$USER`
2. **WhatsApp Business Setup** — Finalize vendor (Gupshup/ValueFirst) for school
3. **Intel AX200 Installation** — Hardware swap for HP laptop

### **In Progress:**
- Paperclip Ollama adapter (code complete, needs UI build)
- LinkedIn school page creation (pending details)
- Panchangam daily report setup (pending location/preferences)

### **Pending Mac Mini Arrival:**
- Qwen 14B IQ4_XS testing (was OOM on Dell)
- Gemma 4 benchmarking
- DeepSeek R1 8B evaluation
- Pi repo PR contribution

---

## **Preferences Summary**

| Category | Approach |
|----------|----------|
| **Hardware** | Enterprise-grade, proven, ~₹1,000-2,000 budget |
| **Services** | Check clients first (banks/govt), then pricing |
| **Code** | Edge cases, thorough testing, copy-paste format |
| **Output** | Crisp, tables, actionable, honest |
| **Research** | Deep dive: clients, reviews, complaints, alternatives |

---

_Updated: 2026-04-18_
_Next review: Mac Mini migration execution_
