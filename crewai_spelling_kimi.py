#!/usr/bin/env python3
"""
CrewAI Spelling App Enhancement - Using Kimi API
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew, BaseLLM
from typing import Any, Dict, List, Optional, Union
import os
import requests

class KimiLLM(BaseLLM):
    """CrewAI-compatible Kimi API wrapper"""
    
    def __init__(self, model: str = "kimi-k2", temperature: Optional[float] = None, **kwargs):
        super().__init__(model=model, temperature=temperature)
        self.api_key = os.getenv("KIMI_API_KEY", "sk-2oznen7txbyuanz5j16g7f3z0ul65y3ld5uluvzqphq6i8wp")
        self.model_name = model
    
    def call(
        self,
        messages: Union[str, List[Dict[str, str]]],
        tools: Optional[List[dict]] = None,
        callbacks: Optional[List[Any]] = None,
        available_functions: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> str:
        """Call Kimi API"""
        
        if isinstance(messages, str):
            prompt = messages
        else:
            prompt = "\n".join([m.get("content", "") for m in messages])
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": self.temperature or 0.7,
            "max_tokens": 2000
        }
        
        try:
            resp = requests.post(
                "https://api.moonshot.cn/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=60
            )
            return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error: {str(e)}"
    
    def supports_function_calling(self) -> bool:
        return False
    
    def get_context_window_size(self) -> int:
        return 128000

# Initialize LLM
llm = KimiLLM(model="kimi-k2")

# Define Agents
coder = Agent(
    role="React Native TypeScript Developer",
    goal="Build enhanced spelling game with hint masking, auto-advance, corrections, and beautiful UI",
    backstory="Expert in React Native, TypeScript, and educational game design.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

ui_designer = Agent(
    role="UI/UX Designer",
    goal="Design visually appealing, kid-friendly interfaces with animations",
    backstory="Creative designer specializing in educational apps.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="TypeScript Code Reviewer",
    goal="Ensure type safety and correct logic",
    backstory="Senior engineer focused on TypeScript correctness.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# Tasks
task_gamescreen = Task(
    description="""
    Create GameScreen.tsx with:
    
    1. **Hint Masking**: Show "XXRX" for "FIRE" (masked letters)
    2. **Auto-Advance**: Green check → auto next word
    3. **Corrections**: "FIRR" → "❌ Should be FIRE"
    4. **Jazzed UI**: Gradients, animations, progress bar
    
    TypeScript interfaces: Word, GameState, Props
    Save to: spelling-app/src/screens/GameScreen.tsx
    """,
    agent=coder,
    expected_output="Complete GameScreen.tsx"
)

task_worddb = Task(
    description="""
    Update words.ts with masked hints:
    - maskedHint: "F_X_" for "FIRE"
    - Different difficulty = different mask patterns
    Save to: spelling-app/src/data/words.ts
    """,
    agent=coder,
    expected_output="Updated words.ts"
)

task_feedback = Task(
    description="""
    Create Feedback.tsx:
    - Correct: Big ✓, "+10 points", auto-advance
    - Wrong: Red X, "Your: FIRR", "Correct: FIRE", Next button
    Save to: spelling-app/src/components/Feedback.tsx
    """,
    agent=coder,
    expected_output="Feedback.tsx"
)

task_homescreen = Task(
    description="""
    Update HomeScreen.tsx:
    - Gradient backgrounds
    - Animated difficulty cards
    - Modern typography
    Save to: spelling-app/src/screens/HomeScreen.tsx
    """,
    agent=ui_designer,
    expected_output="Beautiful HomeScreen.tsx"
)

task_types = Task(
    description="""
    Update types.ts with:
    - Word { word, hint, maskedHint, difficulty }
    - GameState with feedback status
    Save to: spelling-app/src/types.ts
    """,
    agent=coder,
    expected_output="Updated types.ts"
)

task_review = Task(
    description="Review all files for TypeScript errors and logic.",
    agent=reviewer,
    expected_output="Review report"
)

# Create Crew
spelling_crew = Crew(
    agents=[coder, ui_designer, reviewer],
    tasks=[task_gamescreen, task_worddb, task_feedback, task_homescreen, task_types, task_review],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("🚀 CrewAI + Kimi API - Spelling App Enhancement")
    result = spelling_crew.kickoff()
    print("\n✅ Complete:")
    print(result)
