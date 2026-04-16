#!/usr/bin/env python3
"""
CrewAI Driving Assistant Skill Builder
Uses llama.cpp (or Kimi if needed) for local LLM inference
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew
from adapters.llama_cpp_adapter import LlamaLLM

llm = LlamaLLM(model="phi3-mini")

coder = Agent(
    role="Node.js Developer",
    goal="Build a driving assistant skill that finds nearby places using Google Places API",
    backstory="Expert in Node.js, API integration, and building practical utility scripts.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Review Node.js code for correctness and best practices",
    backstory="Senior engineer who ensures code works correctly.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

code_task = Task(
    description="""
    Create nearby.js Node.js script that:
    1. Takes latitude and longitude as command line arguments
    2. Uses Google Places API to find nearby:
       - Petrol bunks (gas stations) within 10km
       - Restaurants within 5km
       - Toll plazas within 15km
       - ATMs within 5km
    3. Outputs formatted results for Telegram (HTML format)
    4. Handles API errors gracefully
    5. Uses axios or node-fetch for HTTP requests
    6. Reads GOOGLE_PLACES_API_KEY from environment variable
    
    Save to: /home/dell/.openclaw/skills/driving-assistant/nearby.js
    
    Make it functional and well-commented.
    """,
    agent=coder,
    expected_output="Complete working nearby.js script"
)

review_task = Task(
    description="""
    Review nearby.js:
    1. Check Node.js syntax is valid
    2. Verify Google Places API integration is correct
    3. Check error handling for missing API key
    4. Verify output format is suitable for Telegram
    5. Check command line argument parsing
    
    Output: "PASS" or list issues with fixes.
    """,
    agent=reviewer,
    expected_output="Review result"
)

crew = Crew(
    agents=[coder, reviewer],
    tasks=[code_task, review_task],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("🚗 CrewAI Driving Assistant Builder")
    result = crew.kickoff()
    print("\n✅ Complete:", result)
