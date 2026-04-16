#!/usr/bin/env python3
"""Ollama LLM Adapter for CrewAI - Routes to local agents"""
import subprocess
import json
import os

class OllamaLLM:
    def __init__(self, model="phi3:mini"):
        self.model = model
        self.workspace = os.environ.get('WORKSPACE', '/home/dell/.openclaw/workspace')
    
    def call(self, prompt, **kwargs):
        task_id = f"crewai_{hash(prompt) & 0xFFFFFFFF}"
        task_file = f"{self.workspace}/orchestrator/queue/{task_id}.json"
        os.makedirs(os.path.dirname(task_file), exist_ok=True)
        
        with open(task_file, 'w') as f:
            json.dump({'id': task_id, 'desc': prompt[:200], 'agent': 'coder', 'status': 'queued'}, f)
        
        # Run agent
        agent_script = f"{self.workspace}/subagents/coder/run-kimi.py"
        result = subprocess.run(['python3', agent_script, task_file], capture_output=True, text=True, timeout=120)
        
        # Read output
        output_file = f"{self.workspace}/agent-output/{task_id}/generated.py"
        if os.path.exists(output_file):
            with open(output_file, 'r') as f:
                return f.read()
        return result.stdout if result.stdout else "No output"
