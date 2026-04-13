# CrewAI Integration Plan

## Overview
Hybrid architecture combining CrewAI's orchestration + our local-first stack

## What We Use From CrewAI
- **Orchestration Engine**: Task queue, routing, retries, parallelism ✅ KEEP
- **Ecosystem Tools**: 100+ pre-built tools (Serper, APIs, etc.) ✅ KEEP
- **LLM Backend**: OpenAI/cloud calls ❌ REPLACE with Ollama
- **Memory**: Default memory store ❌ REPLACE with GBrain
- **Observability**: Their tracing ❌ REPLACE with our dashboard

## Custom Adapters
1. **LLM Adapter** (`adapters/ollama_llm.py`) - Calls our run-phi3.py
2. **Memory Adapter** (`adapters/gbrain_memory.py`) - Integrates with GBrain
3. **Tool Adapters** - Wrap our security, LSP, file watchers

## Integration Steps
1. Clone CrewAI repo
2. Install: `uv pip install crewai`
3. Create adapters for LLM, Memory, Tools
4. Configure agents.yaml with our 5 agents
5. Test with simple then complex tasks

## Success Criteria
- [ ] CrewAI orchestrates our local agents
- [ ] Tasks use Ollama (not cloud)
- [ ] Memory goes to GBrain
- [ ] Our dashboard shows metrics
- [ ] CrewAI tools work (Serper, etc.)

**Timeline: ~3 hours**