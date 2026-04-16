#!/usr/bin/env python3
"""
CrewAI UI Kitten Integration - Eva Design System for Spelling App
Uses Kimi API for reliable cloud inference
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew, BaseLLM
from typing import Any, Dict, List, Optional, Union
import os
import requests
import json

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
            resp = requests.post("https://api.moonshot.cn/v1/chat/completions", 
                                headers=headers, json=data, timeout=60)
            resp_json = resp.json()
            
            if "error" in resp_json:
                return f"API Error: {resp_json['error'].get('message', 'Unknown error')}"
            if "choices" not in resp_json:
                return "API Error: Missing choices"
            
            return resp_json["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error: {str(e)}"
    
    def supports_function_calling(self) -> bool:
        return False
    
    def get_context_window_size(self) -> int:
        return 128000

llm = KimiLLM(model="kimi-k2")

# Define Agents
ui_developer = Agent(
    role="UI Kitten Specialist",
    goal="Integrate UI Kitten Eva Design System into React Native apps for beautiful, consistent UI",
    backstory="Expert in UI Kitten, Eva Design System, and React Native theming. Creates polished, animated interfaces.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

react_specialist = Agent(
    role="React Native Developer",
    goal="Refactor components to use UI Kitten components with proper TypeScript",
    backstory="Expert in React Native component architecture and UI library integration.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

theme_designer = Agent(
    role="Theme Designer",
    goal="Create custom Eva Design System theme for educational apps",
    backstory="Specialist in color theory, accessible design, and custom UI Kitten themes.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Verify UI Kitten integration is correct and complete",
    backstory="Senior engineer who reviews UI library integrations for correctness.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# Tasks
task_theme_config = Task(
    description="""
    Create theme.json and mapping.json for UI Kitten Eva Design System:
    
    1. Custom color palette:
       - Primary: Purple (#6200ee)
       - Success: Green (#4CAF50)
       - Danger: Red (#F44336)
       - Warning: Orange (#FF9800)
       - Background: Light (#f8f9fa) / Dark (#121212)
    
    2. Typography:
       - Heading fonts large and clear
       - Body text readable
       - Button text bold
    
    3. Component mappings:
       - Button: rounded, shadows
       - Card: elevated, bordered
       - Input: clear focus states
    
    Save to: spelling-app/theme.json and spelling-app/mapping.json
    """,
    agent=theme_designer,
    expected_output="theme.json and mapping.json configuration files"
)

task_app_provider = Task(
    description="""
    Update App.tsx to include UI Kitten ApplicationProvider:
    
    1. Import: import * as eva from '@eva-design/eva'
    2. Import: import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
    3. Import: import { default as theme } from './theme.json'
    4. Wrap NavigationContainer with ApplicationProvider
    5. Use eva.dark or eva.light as base
    
    Save to: spelling-app/App.tsx
    """,
    agent=react_specialist,
    expected_output="Updated App.tsx with UI Kitten provider"
)

task_homescreen_ui = Task(
    description="""
    Rewrite HomeScreen.tsx using UI Kitten components:
    
    1. Use Card components for difficulty selection
    2. Add Button with appearance='filled' | 'outline'
    3. Use Layout with proper spacing
    4. Add Icon from @ui-kitten/eva-icons
    5. Add animations with Animated API
    6. Use Text with category='h1', 'h2', 's1'
    
    Make it look premium and polished.
    Save to: spelling-app/src/screens/HomeScreen.tsx
    """,
    agent=ui_developer,
    expected_output="HomeScreen.tsx with UI Kitten components"
)

task_gamescreen_ui = Task(
    description="""
    Rewrite GameScreen.tsx using UI Kitten components:
    
    1. Use Card for game area with elevation
    2. Use Input with label='Your Answer'
    3. Use Button with status='success' | 'danger'
    4. Add ProgressBar for timer
    5. Use Avatar or Icon for feedback
    6. Add Spinner for loading states
    7. Use Layout with proper level spacing
    
    Maintain hint masking and correction features.
    Save to: spelling-app/src/screens/GameScreen.tsx
    """,
    agent=ui_developer,
    expected_output="GameScreen.tsx with UI Kitten components"
)

task_feedback_ui = Task(
    description="""
    Rewrite Feedback.tsx using UI Kitten components:
    
    1. Use Card with status='success' | 'danger'
    2. Add Icon name='checkmark-circle' | 'close-circle'
    3. Use Text with status colors
    4. Add Button with proper styling
    5. Make it pop with animations
    
    Save to: spelling-app/src/components/Feedback.tsx
    """,
    agent=ui_developer,
    expected_output="Feedback.tsx with UI Kitten styling"
)

task_review = Task(
    description="""
    Review all UI Kitten integration:
    
    1. Check all imports are correct
    2. Verify theme is properly loaded
    3. Check components render without errors
    4. Ensure TypeScript types are correct
    5. Verify animations work
    
    Report: PASS or list specific issues.
    """,
    agent=reviewer,
    expected_output="Review report"
)

# Create Crew
ui_crew = Crew(
    agents=[theme_designer, react_specialist, ui_developer, reviewer],
    tasks=[task_theme_config, task_app_provider, task_homescreen_ui, task_gamescreen_ui, task_feedback_ui, task_review],
    verbose=True,
    process="sequential"
)

if __name__ == "__main__":
    print("=" * 70)
    print("🎨 CrewAI + Kimi API - UI Kitten Integration")
    print("Eva Design System for Spelling App")
    print("=" * 70)
    
    result = ui_crew.kickoff()
    
    print("\n" + "=" * 70)
    print("✅ UI Kitten Integration Complete")
    print("=" * 70)
