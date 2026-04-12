# Ollama Benchmark Summary

## Status
- ✅ Environment set up
- ✅ Benchmark scripts created
- ⚠️ Model download required

## Available Scripts

### 1. Quick Benchmark (Recommended)
```bash
cd ~/turboquant
chmod +x quick_ollama_benchmark.sh
./quick_ollama_benchmark.sh
```
This will:
- Pull smollm2 (~1.1GB) if not present
- Pull deepseek-r1:8b (~4.9GB) if not present
- Run bubble sort task on both
- Show timing comparison

### 2. Manual Testing
```bash
# Pull models
ollama pull smollm2
ollama pull deepseek-r1:8b

# Test individually
time ollama generate --model smollm2 --prompt "Write Python bubble sort with ASCII bars"
time ollama generate --model deepseek-r1:8b --prompt "Write Python bubble sort with ASCII bars"
```

### 3. Python Benchmark
```bash
cd ~/turboquant
python3 ollama_benchmark.py --model both
```

## Expected Results
| Model | Size | Speed |
|-------|------|-------|
| SmolLM2 | 1.7B | Fast (~10-20 tok/s) |
| DeepSeek R1 | 8B | Slower (~3-5 tok/s) |

## Note
Download sizes:
- SmolLM2: ~1.1 GB
- DeepSeek R1 8B: ~4.9 GB

Both use **zero tokens** - completely free via Ollama library!
