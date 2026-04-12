// Test script for Ollama adapter
const OLLAMA_BASE_URL = "http://localhost:11434";
const MODEL = "phi3:mini";

async function testOllama() {
  console.log("🧪 Testing Ollama Adapter with phi3:mini...\n");
  
  const messages = [
    {
      role: "system",
      content: "You are a helpful coding assistant. Be concise."
    },
    {
      role: "user",
      content: "Write a Python function to calculate factorial. One line."
    }
  ];
  
  const requestBody = {
    model: MODEL,
    messages,
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 4096
    }
  };
  
  console.log("📤 Sending request to Ollama...");
  console.log(`   Model: ${MODEL}`);
  console.log(`   URL: ${OLLAMA_BASE_URL}/api/chat\n`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log("✅ SUCCESS!\n");
    console.log("📊 Stats:");
    console.log(`   Response time: ${duration}ms`);
    console.log(`   Model: ${data.model}`);
    console.log(`   Total duration: ${(data.total_duration / 1e6).toFixed(0)}ms`);
    console.log(`   Prompt tokens: ${data.prompt_eval_count || 'N/A'}`);
    console.log(`   Completion tokens: ${data.eval_count || 'N/A'}`);
    
    console.log("\n📝 Response:");
    console.log("─".repeat(50));
    console.log(data.message.content);
    console.log("─".repeat(50));
    
    return true;
  } catch (error) {
    console.error("\n❌ FAILED!");
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

testOllama();