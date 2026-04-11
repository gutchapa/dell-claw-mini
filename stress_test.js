import fs from "fs";
import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

// Generate a massive dummy payload (approx 10,000 words / 15k tokens)
let giantBlock = "The quick brown fox jumps over the lazy dog. ".repeat(10000);

const prompt = `Summarize the following text:\n\n${giantBlock}\n\nCan you summarize this?`;

async function runLocal(prompt) {
    console.log("--> 🛡️ ROUTING TO LOCAL EXECUTION (DeepSeek-R1 1.5B via Ollama)...");
    console.log(`Payload length: ${prompt.length} characters.`);
    
    const startTime = performance.now();
    try {
        const res = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek-r1:1.5b",
                messages: [{ role: "user", content: prompt }],
                stream: false
            })
        });
        
        const data = await res.json();
        const endTime = performance.now();
        console.log(`\n⏱️ Execution Time: ${(endTime - startTime).toFixed(2)}ms`);
        let cleaned = data.message?.content || JSON.stringify(data);
        if (cleaned.includes("</think>")) cleaned = cleaned.split("</think>")[1];
        return cleaned.trim();
    } catch(e) {
        return "Error: " + e.message;
    }
}

runLocal(prompt).then(console.log);
