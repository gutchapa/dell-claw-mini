#!/usr/bin/env python3
"""
MODULAR CrewAI Mobile Browser Builder
Breaks down into small, manageable tasks for Phi-3
Uses llama.cpp for local inference
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
    goal="Write clean, working React Native code",
    backstory="Expert mobile developer who writes modular, testable code.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Ensure code quality and correctness",
    backstory="Senior engineer who reviews for bugs and best practices.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# MODULAR TASKS - One file per task

task_package_json = Task(
    description="""
    Create package.json for a React Native mobile browser app.
    
    Required dependencies:
    - expo: ~50.0.0
    - react-native-webview: 13.6.4
    - @react-navigation/native: ^6.1.9
    - react-native-safe-area-context: 4.8.2
    - react: 18.2.0
    - react-native: 0.73.2
    
    Dev dependencies:
    - typescript: ^5.1.3
    
    Output ONLY the JSON content. No markdown, no explanation.
    """,
    agent=coder,
    expected_output="Valid package.json content"
)

task_app_tsx = Task(
    description="""
    Create App.tsx for a React Native mobile browser.
    
    Must include:
    - WebView from react-native-webview
    - SafeAreaView from react-native-safe-area-context
    - TextInput for URL entry (purple #6200ee border)
    - Back button (◀) - disabled when can't go back
    - Forward button (▶) - disabled when can't go forward  
    - Refresh button (↻)
    - TypeScript with proper types
    - Simple, clean code
    
    Use functional components and hooks (useState, useRef).
    
    Output ONLY the TypeScript code. No markdown, no explanation.
    """,
    agent=coder,
    expected_output="Complete App.tsx code"
)

task_app_json = Task(
    description="""
    Create app.json Expo configuration for mobile browser.
    
    Include:
    - name: "Simple Browser"
    - slug: "mobile-browser"
    - version: "1.0.0"
    - orientation: portrait
    - ios supportsTablet: true
    - android package: com.yourcompany.mobilebrowser
    
    Output ONLY the JSON content.
    """,
    agent=coder,
    expected_output="Valid app.json content"
)

task_readme = Task(
    description="""
    Create README.md for mobile browser project.
    
    Include:
    - Project title: Simple Mobile Browser
    - Features: WebView, navigation, address bar
    - Install instructions: npm install, npx expo start
    - Usage: npx expo start --android or --ios
    
    Output ONLY the markdown content.
    """,
    agent=coder,
    expected_output="README.md content"
)

# Review tasks
task_review_package = Task(
    description="""
    Review the generated package.json:
    - Check all required dependencies are present
    - Verify versions are reasonable
    - Check for syntax errors
    
    Output: "PASS" or list issues found.
    """,
    agent=reviewer,
    expected_output="Review result: PASS or issues list"
)

task_review_app = Task(
    description="""
    Review the generated App.tsx:
    - Check React Native syntax is valid
    - Verify imports are correct
    - Check navigation buttons logic
    - Look for any obvious bugs
    
    Output: "PASS" or list issues with fixes.
    """,
    agent=reviewer,
    expected_output="Review result: PASS or issues list"
)

# Create Crew with sequential execution
browser_crew = Crew(
    agents=[coder, reviewer],
    tasks=[
        task_package_json,
        task_review_package,
        task_app_tsx,
        task_review_app,
        task_app_json,
        task_readme
    ],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 MODULAR CrewAI + Llama.cpp Browser Build")
    print("6 sequential tasks - manageable for Phi-3")
    print("=" * 60)
    
    result = browser_crew.kickoff()
    
    print("\n" + "=" * 60)
    print("✅ Build Complete")
    print("=" * 60)
    print("\nNow manually save the generated files to:")
    print("/home/dell/.openclaw/workspace/mobile-browser/")
