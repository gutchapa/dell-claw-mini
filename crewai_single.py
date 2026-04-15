#!/usr/bin/env python3
from crewai import Agent, Task, Crew

ollama_llm = "ollama/smollm2"

coder = Agent(
    role="TypeScript Developer",
    goal="Write package.json",
    backstory="TypeScript expert",
    llm=ollama_llm,
    allow_delegation=False
)

task = Task(
    description="Write package.json for RAG system with PGlite and Ollama dependencies",
    agent=coder,
    expected_output="package.json content"
)

crew = Crew(agents=[coder], tasks=[task], verbose=True)

if __name__ == "__main__":
    print("🚀 Testing CrewAI with single small task")
    result = crew.kickoff()
    print(f"✅ Result: {result}")
