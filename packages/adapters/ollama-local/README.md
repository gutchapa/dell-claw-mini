# Ollama Local Adapter for Paperclip

Run local LLMs via Ollama — zero cloud API costs, fully private!

## 🚀 Quick Start

### 1. Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull a Model
```bash
ollama pull tinydolphin    # Fastest (636MB)
ollama pull phi3:mini      # Good balance (2.2GB)
ollama pull qwen35-4b-text # Your custom model
```

### 3. Start Ollama Server
```bash
ollama serve
```

### 4. Configure Paperclip Agent
1. Create new agent
2. Select **"Ollama Local"** adapter
3. Choose model from dropdown
4. Deploy!

## ⚙️ Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `http://localhost:11434` | Ollama server URL |
| `model` | `tinydolphin` | Model to use |
| `temperature` | `0.7` | Creativity (0-1) |
| `maxTokens` | `4096` | Max output tokens |

## 🎯 Available Models

### Fast & Light
- **tinydolphin** (636MB) — Fastest, good for simple tasks
- **mannix/qwen2.5-coder:0.5b-iq4_xs** (349MB) — Ultra-fast coding

### Balanced
- **smollm2** (1.8GB) — Good speed/quality balance
- **phi3:mini** (2.2GB) — Microsoft's solid model

### Capable
- **phi3.5** (2.2GB) — Better reasoning
- **qwen35-4b-text** (2.7GB) — Your custom stripped model

## 🔧 Troubleshooting

### "Cannot connect to Ollama"
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve
```

### "Model not found"
```bash
# List available models
ollama list

# Pull missing model
ollama pull <model-name>
```

### High RAM usage
- Use smaller models (tinydolphin, qwen 0.5B)
- Close other applications
- Enable swap if needed

## 📊 Performance Tips

1. **First run is slow** — Model loads into RAM
2. **Keep Ollama running** — Avoid cold starts
3. **Use quantized models** — IQ4_XS for Qwen is 8x smaller
4. **SSD recommended** — Faster model loading

## 🔒 Privacy

- ✅ Zero data leaves your machine
- ✅ No API keys needed
- ✅ Works offline
- ✅ Full control over models

## 💡 Use Cases

- Code generation (phi3, qwen-coder)
- Text processing (tinydolphin)
- Quick prototyping (smollm2)
- Private data analysis (any model)

---

*Zero-token, zero-cloud, fully local!* 🔥
