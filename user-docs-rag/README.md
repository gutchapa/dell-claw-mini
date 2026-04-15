# TypeScript RAG System - PGlite + Ollama

## Architecture
- **Vector DB**: PGlite with vector extension (768 dims)
- **Embeddings**: Ollama nomic-embed-text (local, zero cost)
- **Chunking**: By headings and paragraphs
- **Runtime**: Bun/TypeScript

## Setup
```bash
bun install
ollama pull nomic-embed-text
bun run index.ts ingest놱n run index.ts search
```
