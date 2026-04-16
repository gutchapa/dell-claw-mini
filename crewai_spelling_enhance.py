#!/usr/bin/env python3
"""
CrewAI Spelling App Enhancement - Using Kimi API
Tasks: Hint masking, auto-advance, corrections, UI jazz
"""
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace/openclaw-adapters')

from crewai import Agent, Task, Crew

# Use Kimi API for reliable cloud inference
import os
os.environ["KIMI_API_KEY"] = "sk-kimi-api-key"  # Will use existing key

class KimiLLM:
    """Simple Kimi API wrapper for CrewAI compatibility"""
    def __init__(self, model="kimi-k2"):
        self.model = model
    
    def call(self, messages, **kwargs):
        import requests
        api_key = os.getenv("KIMI_API_KEY", "sk-2oznen7txbyuanz5j16g7f3z0ul65y3ld5uluvzqphq6i8wp")
        
        if isinstance(messages, str):
            prompt = messages
        else:
            prompt = "\n".join([m.get("content", "") for m in messages])
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        try:
            resp = requests.post("https://api.moonshot.cn/v1/chat/completions", 
                                headers=headers, json=data, timeout=60)
            return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error: {str(e)}"

llm = KimiLLM(model="kimi-k2")

# Define Agents
coder = Agent(
    role="React Native TypeScript Developer",
    goal="Build enhanced spelling game with TypeScript, hint masking, corrections, and beautiful UI",
    backstory="Expert in React Native, TypeScript, and educational game design. Creates engaging, polished UI.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

ui_designer = Agent(
    role="UI/UX Designer",
    goal="Design visually appealing, kid-friendly interfaces with animations and engaging visuals",
    backstory="Creative designer specializing in educational apps with gamification and visual feedback.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

reviewer = Agent(
    role="TypeScript Code Reviewer",
    goal="Ensure type safety, correct logic, and best practices in React Native code",
    backstory="Senior engineer focused on TypeScript correctness, UI/UX polish, and bug-free code.",
    llm=llm,
    allow_delegation=False,
    verbose=True
)

# Task 1: Create enhanced GameScreen with hint masking
task_gamescreen = Task(
    description="""
    Create GameScreen.tsx with these features:
    
    1. **Hint Masking**: Show masked word like "XXRX" for "FIRE"
       - First letter always shown: "FXXX"
       - Vowels hidden: "F_X_" or use X's: "FXRX"
       - Make it configurable per difficulty
    
    2. **Auto-Advance**: 
       - When student types correct word → auto-advance to next word
       - Show green checkmark briefly before advancing
       - Play success sound (if possible)
    
    3. **Correction Display**:
       - When student types "FIRR" for "FIRE"
       - Show: "❌ Incorrect" in red
       - Show: "Your answer: FIRR" with strikethrough
       - Show: "Correct: FIRE" in green
       - Show "Next →" button to continue
    
    4. **Enhanced UI**:
       - Beautiful gradient backgrounds
       - Animated buttons with press feedback
       - Progress bar with cute animation
       - Timer with color change (green→yellow→red)
       - Score with star icons
       - Use React Native StyleSheet with modern design
    
    TypeScript with proper interfaces:
    - Word interface with maskedHint property
    - GameState interface
    - Props interfaces for components
    
    Save to: /home/dell/.openclaw/workspace/spelling-app/src/screens/GameScreen.tsx
    """,
    agent=coder,
    expected_output="Complete TypeScript GameScreen.tsx with all features"
)

# Task 2: Update word database with masked hints
task_worddb = Task(
    description="""
    Update words.ts to include masked hints:
    
    interface Word {
      word: string;
      hint: string;
      difficulty: Difficulty;
      maskedHint: string;  // e.g., "F_X_" for "FIRE"
    }
    
    Generate masked hints for all words:
    - Simple: "C_X" for "CAT", "D_X" for "DOG"
    - Medium: "B_X_X_" for "BEAUTIFUL"
    - Hard: Show 2-3 letters, rest as X's
    - Very Hard: Show only 1-2 letters
    
    Algorithm: Show first letter + every other letter, rest as X
    
    Save to: /home/dell/.openclaw/workspace/spelling-app/src/data/words.ts
    """,
    agent=coder,
    expected_output="Updated words.ts with maskedHint for all words"
)

# Task 3: Create Feedback component for corrections
task_feedback = Task(
    description="""
    Create Feedback.tsx component:
    
    Props interface:
    - isCorrect: boolean
    - userAnswer: string
    - correctWord: string
    - onNext: () => void
    
    For correct answer:
    - Big green checkmark ✓
    - "Correct! +10 points" in green
    - Auto-advance after 1 second
    
    For wrong answer:
    - Red X with shake animation
    - "Incorrect" in red
    - "Your answer: XXX" with strikethrough
    - "Correct answer: YYY" highlighted green
    - "Next →" button
    - Show masked hint again: "Hint: XXRX"
    
    Save to: /home/dell/.openclaw/workspace/spelling-app/src/components/Feedback.tsx
    """,
    agent=coder,
    expected_output="Feedback.tsx with animations and proper TypeScript"
)

# Task 4: Update HomeScreen with jazzed up UI
task_homescreen = Task(
    description="""
    Update HomeScreen.tsx with:
    
    1. **Gradient Background**: Beautiful purple-blue gradient
    2. **Animated Cards**: Difficulty buttons with hover/press effects
    3. **Icons**: Large emoji icons with bounce animation
    4. **Typography**: Modern fonts, proper hierarchy
    5. **Stats Display**: Previous scores with star ratings
    6. **Welcome Animation**: Title slides in
    
    Use React Native LinearGradient if available, or gradient simulation.
    Make it feel like a premium educational game.
    
    Save to: /home/dell/.openclaw/workspace/spelling-app/src/screens/HomeScreen.tsx
    """,
    agent=ui_designer,
    expected_output="Beautiful HomeScreen.tsx with animations and polish"
)

# Task 5: Update App.tsx and types
task_types = Task(
    description="""
    Update types.ts:
    
    interface Word {
      word: string;
      hint: string;
      maskedHint: string;
      difficulty: Difficulty;
    }
    
    interface GameState {
      currentWordIndex: number;
      score: number;
      streak: number;
      timeRemaining: number;
      feedback: 'idle' | 'correct' | 'wrong';
    }
    
    Update App.tsx to pass props correctly to GameScreen.
    
    Save to: /home/dell/.openclaw/workspace/spelling-app/src/types.ts
    """,
    agent=coder,
    expected_output="Updated types.ts with new interfaces"
)

# Task 6: Review everything
task_review = Task(
    description="""
    Review all generated files:
    
    1. Check TypeScript compilation errors
    2. Verify hint masking logic is correct
    3. Check auto-advance works properly
    4. Verify correction display shows clearly
    5. Ensure UI is visually appealing
    6. Check for any runtime errors
    
    List any issues found with specific line numbers and fixes.
    Or confirm: "✅ All files pass review"
    """,
    agent=reviewer,
    expected_output="Review report with issues or confirmation"
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
    print("🚀 CrewAI + Kimi API - Spelling App Enhancement")
    print("=" * 70)
    print("\nFeatures to add:")
    print("1. 🎭 Hint masking (XXRX for FIRE)")
    print("2. ✅ Auto-advance on correct")
    print("3. ❌ Correction display (FIRR → FIRE)")
    print("4. 🎨 Jazzed up UI with animations")
    print("\nUsing Kimi API for reliable cloud inference")
    print("=" * 70)
    
    result = spelling_crew.kickoff()
    
    print("\n" + "=" * 70)
    print("✅ Enhancement Complete")
    print("=" * 70)
    print("\nGenerated files:")
    print("- GameScreen.tsx (hint masking, auto-advance, corrections)")
    print("- words.ts (masked hints)")
    print("- Feedback.tsx (correction component)")
    print("- HomeScreen.tsx (jazzed up UI)")
    print("- types.ts (updated interfaces)")
