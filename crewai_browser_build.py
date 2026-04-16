#!/usr/bin/env python3
"""
CrewAI Mobile Browser Builder
Uses llama.cpp for local LLM inference
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew
from adapters.llama_cpp_adapter import LlamaLLM

# Initialize llama.cpp LLM
llm = LlamaLLM(model="phi3-mini")

# Define Agents
coder = Agent(
    role="React Native Developer",
    goal="Build a simple mobile browser with WebView, address bar, and navigation",
    backstory="Expert in React Native and mobile app development. Writes clean, working code.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Review React Native code for correctness, best practices, and functionality",
    backstory="Senior engineer who ensures code is production-ready and bug-free.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# Define Tasks
code_task = Task(
    description="""
    Create a simple mobile browser app in React Native with:
    
    1. package.json with dependencies:
       - expo
       - react-native-webview
       - @react-navigation/native
       - react-native-safe-area-context
    
    2. App.tsx with:
       - WebView component for rendering web pages
       - Address bar with TextInput for URL entry
       - Back button (◀) - disabled when can't go back
       - Forward button (▶) - disabled when can't go forward
       - Refresh button (↻)
       - SafeAreaView for proper layout
       - TypeScript with proper types
    
    3. app.json Expo configuration
    4. README.md with install instructions
    
    Save all files to: /home/dell/.openclaw/workspace/mobile-browser/
    
    Make it simple but functional. Use purple (#6200ee) as primary color.
    """,
    agent=coder,
    expected_output="4 complete files: package.json, App.tsx, app.json, README.md"
)

review_task = Task(
    description="""
    Review the generated mobile browser code:
    
    1. Check React Native syntax is valid
    2. Verify WebView is properly imported and used
    3. Check navigation buttons work correctly
    4. Ensure TypeScript types are correct
    5. Verify no missing imports or dependencies
    6. Check styling is consistent
    
    If issues found, list them with specific fixes needed.
    If no issues: "✅ Code passes review"
    """,
    agent=reviewer,
    expected_output="Review report with issues or confirmation"
)

# Create Crew
browser_crew = Crew(
    agents=[coder, reviewer],
    tasks=[code_task, review_task],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CrewAI Mobile Browser Build")
    print("Using llama.cpp for local inference")
    print("=" * 60)
    
    result = browser_crew.kickoff()
    
    print("\n" + "=" * 60)
    print("✅ CrewAI Build Complete")
    print(result)
