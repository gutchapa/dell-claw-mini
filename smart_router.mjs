import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

async function askOllamaIfItCanHandle(prompt) {
    const triagePrompt = `Classify this query as 'SMART_HOME', 'LOCAL', or 'CLOUD'. 
Query: "${prompt}"
Classification (Reply with one word only):`;
    
    try {
        const res = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "tinydolphin",
                prompt: triagePrompt,
                stream: false,
                options: { temperature: 0.0, num_predict: 5 }
            })
        });
        const data = await res.json();
        return data.response.trim().toUpperCase();
    } catch (e) {
        return "CLOUD";
    }
}

async function runSmartHome(prompt) {
    if (prompt.toLowerCase().includes("mute") && prompt.toLowerCase().includes("google")) {
        console.log("--> 🏠 Executing Smart Home Command (Google TV)...");
        await execAsync("node google_tv_cmd.js");
        return "Google TV successfully muted via local API.";
    }
    return "Unknown smart home command.";
}

async function main() {
    const prompt = process.argv.slice(2).join(" ");
    const startTime = performance.now();
    
    const triageResult = await askOllamaIfItCanHandle(prompt);
    
    let result = "";
    if (triageResult.includes("SMART") || triageResult.includes("HOME")) {
        result = await runSmartHome(prompt);
    } else {
        result = "Routed to cloud/local.";
    }
    
    const endTime = performance.now();
    console.log(`\n================ [ RESULT ] ================`);
    console.log(result);
    console.log(`\n⏱️ Total Execution Time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`============================================\n`);
}

main();
