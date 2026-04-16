#!/usr/bin/env python3
"""
CrewAI Spelling App Enhancement - Using Kimi API with proper error handling
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew, BaseLLM
from typing import Any, Dict, List, Optional, Union
import os
import requests
import json

class KimiLLM(BaseLLM):
    """CrewAI-compatible Kimi API wrapper with error handling"""
    
    def __init__(self, model: str = "kimi-k2", temperature: Optional[float] = None, **kwargs):
        super().__init__(model=model, temperature=temperature)
        self.api_key = os.getenv("KIMI_API_KEY", "sk-2oznen7txbyuanz5j16g7f3z0ul65y3ld5uluvzqphq6i8wp")
        self.model_name = model
        self.endpoint = "https://api.moonshot.cn/v1/chat/completions"
    
    def call(
        self,
        messages: Union[str, List[Dict[str, str]]],
        tools: Optional[List[dict]] = None,
        callbacks: Optional[List[Any]] = None,
        available_functions: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> str:
        """Call Kimi API with proper error handling"""
        
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
            resp = requests.post(self.endpoint, headers=headers, json=data, timeout=60)
            resp_json = resp.json()
            
            # Check for API errors first
            if "error" in resp_json:
                error_msg = resp_json["error"].get("message", "Unknown API error")
                return f"API Error: {error_msg}"
            
            # Check for choices
            if "choices" not in resp_json:
                return f"API Error: Unexpected response format - missing 'choices'"
            
            choices = resp_json["choices"]
            if not choices or len(choices) == 0:
                return "API Error: Empty choices in response"
            
            return choices[0]["message"]["content"]
            
        except requests.exceptions.Timeout:
            return "API Error: Request timeout (60s)"
        except requests.exceptions.ConnectionError:
            return "API Error: Connection failed"
        except json.JSONDecodeError:
            return "API Error: Invalid JSON response"
        except Exception as e:
            return f"API Error: {str(e)}"
    
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
    goal="Ensure type safety, correct logic, and best practices in React Native code",
    backstory="Senior engineer focused on TypeScript correctness.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# Tasks
task_gamescreen = Task(
    description="""
    Create GameScreen.tsx with TypeScript:
    
    1. Hint masking: Show "F_X_" for "FIRE" (first letter + alternating reveals)
    2. Auto-advance: 2 second delay after correct, then next word
    3. Corrections: Show "Your: FIRR" strikethrough, "Correct: FIRE" green
    4. Beautiful UI: Gradient effects, animations, progress bar
    
    Use proper TypeScript interfaces: Word, GameState, Props
    Save to: spelling-app/src/screens/GameScreen.tsx
    """,
    agent=coder,
    expected_output="Complete TypeScript GameScreen.tsx"
)

task_worddb = Task(
    description="""
    Update words.ts with masked hints:
    - Add maskedHint field to Word interface
    - Generate masks: "C_X" for "CAT", "F_X_" for "FIRE", etc.
    - Different difficulties = different mask patterns
    
    Save to: spelling-app/src/data/words.ts
    """,
    agent=coder,
    expected_output="Updated words.ts with maskedHint for all words"
)

task_feedback = Task(
    description="""
    Create Feedback.tsx component:
    - Correct: Big ✓, "+10 points", green, auto-advance trigger
    - Wrong: Red X, strikethrough on user answer, correct in green
    - Props interface: isCorrect, userAnswer, correctAnswer, onNext
    
    Save to: spelling-app/src/components/Feedback.tsx
    """,
    agent=coder,
    expected_output="Feedback.tsx with proper TypeScript"
)

task_homescreen = Task(
    description="""
    Update HomeScreen.tsx:
    - Animated entrance (fade in, slide up)
    - Gradient-style buttons with shine effect
    - Animated press effects (scale down/up)
    - Decorative footer
    - Professional typography
    
    Save to: spelling-app/src/screens/HomeScreen.tsx
    """,
    agent=ui_designer,
    expected_output="Beautiful animated HomeScreen.tsx"
)

task_types = Task(
    description="""
    Update types.ts:
    - Word: { word, hint, maskedHint, difficulty }
    - GameState: add feedback status
    - Proper TypeScript exports
    
    Save to: spelling-app/src/types.ts
    """,
    agent=coder,
    expected_output="Updated types.ts"
)

task_review = Task(
    description="""
    Review all generated files for:
    1. TypeScript compilation errors
    2. Proper hint masking logic
    3. Auto-advance timing correct
    4. Correction display accurate
    5. UI animations working
    
    Report: "PASS - All checks successful" or list specific issues.
    """,
    agent=reviewer,
    expected_output="Review report with PASS or issues list"
)

# Create Crew
spelling_crew = Crew(
    agents=[coder, ui_designer, reviewer],
    tasks=[task_gamescreen, task_worddb, task_feedback, task_homescreen, task_types, task_review],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 CrewAI + Kimi API - Spelling App Enhancement (v2 with error handling)")
    print("=" * 70)
    
    result = spelling_crew.kickoff()
    
    print("\n" + "=" * 70)
    print("✅ CrewAI Execution Complete")
    print("=" * 70)
    print(f"\nFinal Result: {result}")
