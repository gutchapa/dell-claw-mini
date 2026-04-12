#!/usr/bin/env python3
"""
Ollama Benchmark: SmolLM2 vs DeepSeek R1 8B
Same bubble sort task, zero token cost via Ollama API.

Models:
- smollm2:latest (1.7B) - Small, fast
- deepseek-r1:8b (8B) - Reasoning-focused, slower

Task: Write Python bubble sort with visual animation
"""

import time
import subprocess
import json
import sys

# Test configuration
BUBBLE_SORT_PROMPT = """Write a Python bubble sort implementation with visual animation using ASCII bars and time.sleep.

Requirements:
1. Show the array as horizontal bars made of █ characters
2. Highlight elements being compared in red (use ANSI colors)
3. Use time.sleep() for animation delay
4. Show each comparison and swap step-by-step
5. Include a random 10-element demo

Return only the complete Python code."""

MODELS = {
    "smollm2": {
        "name": "smollm2:latest",
        "description": "Small 1.7B model, fast",
        "expected_speed": "fast"
    },
    "deepseek": {
        "name": "deepseek-r1:8b",
        "description": "8B reasoning model, slower",
        "expected_speed": "slow"
    }
}


def check_ollama():
    """Check if Ollama is running."""
    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except:
        return False


def check_model(model_name):
    """Check if model is available in Ollama."""
    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True
        )
        return model_name in result.stdout
    except:
        return False


def pull_model(model_name):
    """Pull model via Ollama."""
    print(f"📥 Pulling {model_name}...")
    print("   This may take a few minutes for first download...")
    
    try:
        result = subprocess.run(
            ["ollama", "pull", model_name],
            capture_output=True,
            text=True,
            timeout=600
        )
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("❌ Pull timed out (10 minutes)")
        return False
    except Exception as e:
        print(f"❌ Pull failed: {e}")
        return False


def generate_ollama(model_name, prompt, max_tokens=800):
    """Generate response using Ollama API."""
    
    start_time = time.time()
    
    try:
        # Use ollama CLI with generate command
        result = subprocess.run(
            [
                "ollama", "generate",
                "--model", model_name,
                "--prompt", prompt,
                "--options", f"num_predict={max_tokens},temperature=0.7"
            ],
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes max
        )
        
        generation_time = time.time() - start_time
        
        if result.returncode != 0:
            print(f"❌ Generation failed: {result.stderr}")
            return None
        
        # Parse response - ollama returns JSONL
        lines = result.stdout.strip().split('\n')
        full_response = ""
        
        for line in lines:
            try:
                data = json.loads(line)
                if 'response' in data:
                    full_response += data['response']
            except json.JSONDecodeError:
                # Handle non-JSON lines
                full_response += line
        
        # Estimate tokens (rough approximation)
        output_tokens = len(full_response.split())
        
        return {
            "response": full_response,
            "generation_time": generation_time,
            "output_tokens": output_tokens,
            "tokens_per_sec": output_tokens / generation_time if generation_time > 0 else 0
        }
        
    except subprocess.TimeoutExpired:
        print("❌ Generation timed out (5 minutes)")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def benchmark_model(model_key):
    """Run benchmark on a model via Ollama."""
    
    config = MODELS[model_key]
    model_name = config["name"]
    
    print(f"\n{'='*70}")
    print(f"BENCHMARK: {model_key.upper()}")
    print(f"Model: {model_name}")
    print(f"Description: {config['description']}")
    print(f"Expected: {config['expected_speed']}")
    print(f"{'='*70}\n")
    
    # Check if model exists
    if not check_model(model_name):
        print(f"⚠️  Model {model_name} not found locally")
        if not pull_model(model_name):
            print(f"❌ Failed to pull {model_name}")
            return None
        print(f"✅ Model pulled successfully\n")
    else:
        print(f"✅ Model {model_name} already available\n")
    
    # Run inference
    print(f"🧪 Running bubble sort task...")
    print(f"Prompt length: {len(BUBBLE_SORT_PROMPT)} chars")
    print(f"Max tokens: 800\n")
    
    results = generate_ollama(model_name, BUBBLE_SORT_PROMPT, 800)
    
    if results is None:
        return None
    
    # Print results
    print(f"\n{'='*70}")
    print(f"RESULTS: {model_key.upper()}")
    print(f"{'='*70}")
    print(f"Generation time:  {results['generation_time']:.2f}s")
    print(f"Output tokens:    ~{results['output_tokens']} (estimated)")
    print(f"Speed:            {results['tokens_per_sec']:.2f} tok/s")
    print(f"{'='*70}\n")
    
    # Show response preview
    print("📝 RESPONSE PREVIEW (first 800 chars):")
    print("-" * 70)
    print(results['response'][:800])
    print("-" * 70)
    
    # Save response to file
    output_file = f"/tmp/bubble_sort_{model_key}_ollama.py"
    with open(output_file, 'w') as f:
        f.write(results['response'])
    print(f"\n💾 Full response saved to: {output_file}")
    
    return results


def run_comparison():
    """Run both models and compare."""
    
    print("\n" + "="*70)
    print("OLLAMA BENCHMARK: SmolLM2-1.7B vs DeepSeek-R1-8B")
    print("="*70)
    print(f"\nTask: Bubble sort with visual animation")
    print(f"Method: Ollama API (zero token cost)")
    
    # Check Ollama
    if not check_ollama():
        print("\n❌ Ollama not running!")
        print("Start with: ollama serve")
        return
    
    print("✅ Ollama is running\n")
    
    results = {}
    
    # Test SmolLM2 first
    print("\n" + "🔄 " * 35)
    results["smollm2"] = benchmark_model("smollm2")
    
    if results["smollm2"] is None:
        print("\n⚠️  Skipping DeepSeek due to SmolLM2 failure")
        return
    
    # Brief pause
    time.sleep(2)
    
    # Test DeepSeek
    print("\n\n" + "🔄 " * 35)
    results["deepseek"] = benchmark_model("deepseek")
    
    # Final comparison
    if results["smollm2"] and results["deepseek"]:
        print("\n\n" + "="*70)
        print("FINAL COMPARISON")
        print("="*70)
        
        smol = results["smollm2"]
        deep = results["deepseek"]
        
        print(f"\n{'Metric':<25} {'SmolLM2-1.7B':<20} {'DeepSeek-8B':<20}")
        print("-" * 70)
        print(f"{'Generation time':<25} {smol['generation_time']:.2f}s{'':<15} {deep['generation_time']:.2f}s")
        print(f"{'Output tokens':<25} ~{smol['output_tokens']:<19} ~{deep['output_tokens']}")
        print(f"{'Speed':<25} {smol['tokens_per_sec']:.2f} tok/s{'':<12} {deep['tokens_per_sec']:.2f} tok/s")
        
        speedup = deep['generation_time'] / smol['generation_time'] if smol['generation_time'] > 0 else 0
        print(f"\n📊 SmolLM2 is {speedup:.1f}x faster than DeepSeek")
        print("="*70)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Benchmark SmolLM2 vs DeepSeek R1 8B via Ollama (zero token)"
    )
    parser.add_argument(
        "--model",
        choices=["smollm2", "deepseek", "both"],
        default="both",
        help="Which model to test (default: both)"
    )
    
    args = parser.parse_args()
    
    if args.model == "both":
        run_comparison()
    else:
        result = benchmark_model(args.model)
        if result:
            print(f"\n✅ Benchmark complete!")
