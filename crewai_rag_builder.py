#!/usr/bin/env python3
"""CrewAI RAG Builder - Uses local Phi3 to generate TypeScript RAG system"""
import os
import sys

sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from adapters.ollama_llm import OllamaLLM

class RAGBuilder:
    def __init__(self):
        self.workspace = '/home/dell/.openclaw/workspace'
        self.llm = OllamaLLM(model="phi3:mini")
        self.output_dir = f"{self.workspace}/user-docs-rag"
        
    def build(self):
        print("🚀 Building TypeScript RAG System via CrewAI + Local Phi3")
        print("=" * 60)
        
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(f"{self.output_dir}/src", exist_ok=True)
        
        files_to_generate = [
            ("package.json", "Generate package.json for TypeScript RAG with PGlite, Ollama dependencies"),
            ("tsconfig.json", "Generate tsconfig.json for Bun/TypeScript"),
            ("src/db.ts", "Write RAGDatabase class with PGlite vector support"),
            ("src/chunker.ts", "Write DocumentChunker class for splitting documents"),
            ("src/embeddings.ts", "Write EmbeddingGenerator using Ollama nomic-embed-text"),
            ("src/ingest.ts", "Write DocumentIngestor for ingestion pipeline"),
            ("src/search.ts", "Write DocumentSearcher for semantic search"),
            ("src/index.ts", "Write CLI entry point with ingest/search/stats commands"),
            ("README.md", "Write README with installation and usage instructions")
        ]
        
        for filename, prompt in files_to_generate:
            print(f"\n📝 Generating {filename}...")
            content = self.llm.call(f"{prompt}. Output ONLY the code/content.")
            
            filepath = f"{self.output_dir}/{filename}"
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"   ✅ {filename}")
        
        print("\n" + "=" * 60)
        print("✅ RAG System Generated via CrewAI + Local Phi3")
        print(f"📁 Location: {self.output_dir}")
        
if __name__ == "__main__":
    builder = RAGBuilder()
    builder.build()
