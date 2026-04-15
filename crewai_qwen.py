#!/usr/bin/env python3
"""
CrewAI RAG Builder - Using Qwen 3.5 4B
"""
from crewai import Agent, Task, Crew

ollama_llm = "ollama/qwen35-4b-text:latest"

print(f"🧠 Using LLM: {ollama_llm}")

coder = Agent(
    role="TypeScript RAG Developer",
    goal="Build complete TypeScript RAG system with PGlite, Ollama embeddings, Bun runtime",
    backstory="Expert in vector databases, TypeScript, and local LLM integration",
    llm=ollama_llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Review code for quality and correctness",
    backstory="Senior engineer focused on code quality",
    llm=ollama_llm,
    allow_delegation=False,
    verbose=True
)

code_task = Task(
    description="""
    Generate complete TypeScript RAG system with 9 files:
    1. package.json - PGlite, Ollama, TypeScript dependencies
    2. tsconfig.json - ES2022, strict mode
    3. src/db.ts - PGlite vector database (768 dims)
    4. src/chunker.ts - Document chunking by headings
    5. src/embeddings.ts - Ollama nomic-embed-text
    6. src/ingest.ts - File ingestion pipeline
    7. src/search.ts - Semantic similarity search
    8. src/index.ts - CLI with ingest/search/stats commands
    9. README.md - Documentation
    
    Output valid, complete TypeScript code for each file.
    """,
    agent=coder,
    expected_output="9 complete TypeScript files with valid code"
)

review_task = Task(
    description="""
    Review all 9 generated files:
    - Check TypeScript syntax
    - Verify imports are correct
    - Check for missing dependencies
    - Validate types
    Output review report with any issues found.
    """,
    agent=reviewer,
    expected_output="Code review report"
)

crew = Crew(
    agents=[coder, reviewer],
    tasks=[code_task, review_task],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CrewAI RAG Build - Qwen 3.5 4B")
    print("=" * 60)
    result = crew.kickoff()
    print("\n✅ Complete:")
    print(result)
