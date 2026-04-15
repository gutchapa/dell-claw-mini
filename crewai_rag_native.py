#!/usr/bin/env python3
"""
CrewAI RAG Builder - PROPER IMPLEMENTATION
Uses CrewAI native Ollama integration via LiteLLM
"""
import sys
import os

try:
    from crewai import Agent, Task, Crew
    print("✅ CrewAI imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

# Use CrewAI's native Ollama support via LiteLLM
ollama_llm = "ollama/smollm2"

print(f"🧠 Using LLM: {ollama_llm}")

# Define Agents
coder_agent = Agent(
    role="TypeScript RAG Developer",
    goal="Build complete TypeScript RAG system with PGlite vector DB, Ollama embeddings, Bun runtime",
    backstory="Expert in vector databases, TypeScript, local LLM integration",
    llm=ollama_llm,
    allow_delegation=False,
    verbose=True
)

reviewer_agent = Agent(
    role="Senior Code Reviewer",
    goal="Review code for quality, TypeScript correctness, best practices",
    backstory="Senior engineer who ensures code is production-ready",
    llm=ollama_llm,
    allow_delegation=False,
    verbose=True
)

# Define Tasks
code_gen_task = Task(
    description="""
    Generate TypeScript RAG system:
    1. package.json with PGlite, Ollama dependencies
    2. tsconfig.json for Bun/TypeScript
    3. src/db.ts - PGlite vector database
    4. src/chunker.ts - Document chunking
    5. src/embeddings.ts - Ollama embeddings
    6. src/ingest.ts - Ingestion pipeline
    7. src/search.ts - Semantic search
    8. src/index.ts - CLI interface
    9. README.md - Documentation
    
    Save to: /home/dell/.openclaw/workspace/user-docs-rag/
    """,
    agent=coder_agent,
    expected_output="9 complete TypeScript files"
)

review_task = Task(
    description="""
    Review the generated RAG system:
    1. Check TypeScript syntax
    2. Verify imports
    3. Check error handling
    4. Verify types
    5. Check dependencies
    Output review report with issues and fixes.
    """,
    agent=reviewer_agent,
    expected_output="Code review report"
)

# Create Crew
rag_crew = Crew(
    agents=[coder_agent, reviewer_agent],
    tasks=[code_gen_task, review_task],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("🚀 CrewAI RAG Build")
    result = rag_crew.kickoff()
    print("✅ Complete:", result)
