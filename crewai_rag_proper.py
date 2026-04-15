#!/usr/bin/env python3
"""
CrewAI RAG Builder - PROPER IMPLEMENTATION
Uses actual CrewAI orchestration with OllamaLLM adapter
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

try:
    from crewai import Agent, Task, Crew
    from adapters.ollama_llm import OllamaLLM
    print("✅ CrewAI imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Installing CrewAI...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "crewai", "-q"])
    from crewai import Agent, Task, Crew
    from adapters.ollama_llm import OllamaLLM

# Initialize LLM
llm = OllamaLLM(model="phi3:mini")

# Define Agents
coder_agent = Agent(
    role="TypeScript RAG Developer",
    goal="Build TypeScript RAG system with PGlite, Ollama embeddings, and Bun",
    backstory="Expert in vector databases, TypeScript, and local LLM integration",
    llm=llm,
    allow_delegation=False
)

reviewer_agent = Agent(
    role="Code Reviewer",
    goal="Review generated code for quality, correctness, and best practices",
    backstory="Senior engineer focused on code quality and TypeScript patterns",
    llm=llm,
    allow_delegation=False
)

# Define Tasks
code_gen_task = Task(
    description="""
    Generate TypeScript RAG system components:
    1. package.json with PGlite, Ollama dependencies
    2. tsconfig.json for Bun/TypeScript
    3. src/db.ts - PGlite vector database
    4. src/chunker.ts - Document chunking
    5. src/embeddings.ts - Ollama nomic-embed-text
    6. src/ingest.ts - Ingestion pipeline
    7. src/search.ts - Semantic search
    8. src/index.ts - CLI interface
    9. README.md - Documentation
    
    Save to: /home/dell/.openclaw/workspace/user-docs-rag/
    Use Bun runtime. Output ONLY valid code.
    """,
    agent=coder_agent,
    expected_output="9 files generated with valid TypeScript code"
)

review_task = Task(
    description="""
    Review the generated RAG system code:
    1. Check TypeScript syntax validity
    2. Verify proper imports and exports
    3. Check for common mistakes
    4. Ensure proper error handling
    5. Validate package.json dependencies
    
    Output review report with issues found and fixes needed.
    """,
    agent=reviewer_agent,
    expected_output="Code review report with quality score and fix recommendations"
)

# Create Crew
rag_crew = Crew(
    agents=[coder_agent, reviewer_agent],
    tasks=[code_gen_task, review_task],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("🚀 Starting CrewAI RAG Build")
    print("=" * 60)
    
    result = rag_crew.kickoff()
    
    print("\n" + "=" * 60)
    print("✅ CrewAI RAG Build Complete")
    print(f"Result: {result}")
