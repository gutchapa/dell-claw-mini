#!/usr/bin/env python3
"""
SmolLM2 vs DeepSeek R1 8B Benchmark
Same bubble sort task, timed comparison.

Models:
- SmolLM2-1.7B-Instruct: Small, fast, good for CPU
- DeepSeek-R1-Distill-Llama-8B: Larger, reasoning-focused, slower on CPU

Task: Write a Python bubble sort with visual animation
"""

import time
import gc
import sys
import psutil
import os
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Test configuration
BUBBLE_SORT_PROMPT = """Write a Python bubble sort implementation with visual animation using ASCII bars and time.sleep. 

Requirements:
1. Show the array as horizontal bars made of █ characters
2. Highlight elements being compared in red (use ANSI colors)
3. Use time.sleep() for animation delay
4. Show each comparison and swap step-by-step
5. Include a random 10-element demo

Return only the complete Python code."""

MAX_TOKENS = 800  # Enough for code + explanation

MODELS = {
    "smollm2": {
        "name": "HuggingFaceTB/SmolLM2-1.7B-Instruct",
        "description": "Small 1.7B model, fast on CPU",
        "expected_speed": "5-10 tok/s"
    },
    "deepseek": {
        "name": "deepseek-ai/DeepSeek-R1-Distill-Llama-8B", 
        "description": "8B reasoning model, slower on CPU",
        "expected_speed": "1-2 tok/s"
    }
}


def get_memory_usage():
    """Get current process memory usage in MB."""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024


def format_memory(mb):
    """Format memory in human-readable format."""
    if mb > 1024:
        return f"{mb/1024:.2f} GB"
    return f"{mb:.2f} MB"


def load_model(model_key):
    """Load a model by key."""
    config = MODELS[model_key]
    model_name = config["name"]
    
    print(f"\n{'='*70}")
    print(f"Loading: {model_key.upper()}")
    print(f"Model: {model_name}")
    print(f"Description: {config['description']}")
    print(f"Expected speed: {config['expected_speed']}")
    print(f"{'='*70}\n")
    
    # Load tokenizer
    print("📥 Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        trust_remote_code=True
    )
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Load model (CPU only)
    print("📥 Loading model weights...")
    print("   This may take a moment...")
    
    start_time = time.time()
    
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float32,
        device_map=None,
        trust_remote_code=True,
        low_cpu_mem_usage=True
    )
    
    model = model.to("cpu")
    
    load_time = time.time() - start_time
    print(f"✅ Model loaded in {load_time:.2f}s")
    
    mem_after_load = get_memory_usage()
    print(f"💾 RAM after loading: {format_memory(mem_after_load)}\n")
    
    return model, tokenizer, load_time


def run_inference(model, tokenizer, prompt, max_tokens=800):
    """Run inference and return timing stats."""
    
    # Format prompt based on model
    if "smollm" in tokenizer.name_or_path.lower():
        # SmolLM format
        messages = [{"role": "user", "content": prompt}]
        formatted = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
    elif "deepseek" in tokenizer.name_or_path.lower():
        # DeepSeek format
        messages = [{"role": "user", "content": prompt}]
        formatted = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
    else:
        formatted = prompt
    
    # Tokenize
    inputs = tokenizer(formatted, return_tensors="pt", padding=True)
    inputs = {k: v.to("cpu") for k, v in inputs.items()}
    
    input_tokens = inputs["input_ids"].shape[1]
    print(f"📝 Input tokens: {input_tokens}")
    
    # Clear garbage
    gc.collect()
    mem_before = get_memory_usage()
    
    # Generate
    print(f"🤖 Generating (max {max_tokens} tokens)...")
    start_time = time.time()
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.95,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )
    
    generation_time = time.time() - start_time
    mem_after = get_memory_usage()
    
    # Decode
    output_tokens = outputs.shape[1] - input_tokens
    response = tokenizer.decode(outputs[0][input_tokens:], skip_special_tokens=True)
    
    # Stats
    tokens_per_sec = output_tokens / generation_time if generation_time > 0 else 0
    
    return {
        "response": response,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "generation_time": generation_time,
        "tokens_per_sec": tokens_per_sec,
        "ram_before": mem_before,
        "ram_after": mem_after,
        "ram_delta": mem_after - mem_before
    }


def benchmark_model(model_key):
    """Run full benchmark on a model."""
    
    # Load
    model, tokenizer, load_time = load_model(model_key)
    
    # Run inference
    print(f"🧪 Running bubble sort task...")
    print(f"{'='*70}\n")
    
    results = run_inference(model, tokenizer, BUBBLE_SORT_PROMPT, MAX_TOKENS)
    
    # Print results
    print(f"\n{'='*70}")
    print(f"RESULTS: {model_key.upper()}")
    print(f"{'='*70}")
    print(f"Load time:        {load_time:.2f}s")
    print(f"Input tokens:     {results['input_tokens']}")
    print(f"Output tokens:    {results['output_tokens']}")
    print(f"Generation time:  {results['generation_time']:.2f}s")
    print(f"Speed:            {results['tokens_per_sec']:.2f} tok/s")
    print(f"RAM delta:        {format_memory(results['ram_delta'])}")
    print(f"{'='*70}\n")
    
    # Show response preview
    print("📝 RESPONSE PREVIEW (first 800 chars):")
    print("-" * 70)
    print(results['response'][:800])
    print("-" * 70)
    
    # Cleanup
    del model, tokenizer
    gc.collect()
    
    return results


def run_comparison():
    """Run both models and compare."""
    
    print("\n" + "="*70)
    print("BUBBLE SORT BENCHMARK: SmolLM2-1.7B vs DeepSeek-R1-8B")
    print("="*70)
    print(f"\nTask: {BUBBLE_SORT_PROMPT[:100]}...")
    
    results = {}
    
    # Test SmolLM2
    print("\n\n" + "🔄 " * 35)
    results["smollm2"] = benchmark_model("smollm2")
    
    # Cleanup between runs
    print("\n🧹 Cleaning up memory...")
    gc.collect()
    time.sleep(2)
    
    # Test DeepSeek
    print("\n\n" + "🔄 " * 35)
    results["deepseek"] = benchmark_model("deepseek")
    
    # Final comparison
    print("\n\n" + "="*70)
    print("FINAL COMPARISON")
    print("="*70)
    
    smol = results["smollm2"]
    deep = results["deepseek"]
    
    print(f"\n{'Metric':<25} {'SmolLM2-1.7B':<20} {'DeepSeek-8B':<20}")
    print("-" * 70)
    print(f"{'Output tokens':<25} {smol['output_tokens']:<20} {deep['output_tokens']:<20}")
    print(f"{'Generation time':<25} {smol['generation_time']:.2f}s{'':<15} {deep['generation_time']:.2f}s")
    print(f"{'Speed':<25} {smol['tokens_per_sec']:.2f} tok/s{'':<12} {deep['tokens_per_sec']:.2f} tok/s")
    print(f"{'RAM increase':<25} {format_memory(smol['ram_delta']):<20} {format_memory(deep['ram_delta']):<20}")
    
    speedup = deep['generation_time'] / smol['generation_time'] if smol['generation_time'] > 0 else 0
    print(f"\n📊 SmolLM2 is {speedup:.1f}x faster than DeepSeek on CPU")
    print("="*70)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Benchmark SmolLM2 vs DeepSeek R1 8B on bubble sort task"
    )
    parser.add_argument(
        "--model",
        choices=["smollm2", "deepseek", "both"],
        default="both",
        help="Which model to test (default: both)"
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=800,
        help="Maximum tokens to generate"
    )
    
    args = parser.parse_args()
    
    MAX_TOKENS = args.max_tokens
    
    if args.model == "both":
        run_comparison()
    else:
        benchmark_model(args.model)
