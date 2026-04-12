import { asNumber, asString, buildPaperclipEnv, stringifyPaperclipWakePayload, } from "@paperclipai/adapter-utils/server-utils";
// Ollama Configuration
const OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "tinydolphin";
function buildSystemPrompt(ctx) {
    const paperclipEnv = buildPaperclipEnv(ctx.agent);
    const lines = [
        "You are an autonomous AI agent running under Paperclip orchestration.",
        "",
        "You have access to a shell environment and can execute commands.",
        "Use tools responsibly and follow security best practices.",
        "",
        `Current working directory: ${ctx.context.cwd || "."}`,
        "",
        "Paperclip Environment:",
        ...Object.entries(paperclipEnv).map(([k, v]) => `- ${k}: ${v}`),
        "",
        "Instructions:",
        "1. Execute the task provided in the user message.",
        "2. Report progress and results clearly.",
        "3. If you need to use tools, describe what you would do.",
        "4. Complete the task to the best of your ability.",
    ];
    return lines.join("\n");
}
export async function execute(ctx) {
    // Get configuration
    const baseUrl = asString(ctx.config.baseUrl) || OLLAMA_BASE_URL;
    const model = asString(ctx.config.model) || DEFAULT_MODEL;
    const temperature = asNumber(ctx.config.temperature, 0.7);
    const maxTokens = asNumber(ctx.config.maxTokens, 4096);
    const timeoutMs = asNumber(ctx.config.timeoutMs, 300000);
    // Build messages
    const systemPrompt = buildSystemPrompt(ctx);
    const userMessage = asString(ctx.config.message) || "Execute your assigned task.";
    // Add wake context to user message if present
    const wakeText = stringifyPaperclipWakePayload(ctx.context.paperclipWake);
    const fullUserMessage = wakeText
        ? `${userMessage}\n\nWake Context:\n${wakeText}`
        : userMessage;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullUserMessage },
    ];
    const requestBody = {
        model,
        messages,
        stream: false,
        options: {
            temperature,
            num_predict: maxTokens,
        },
    };
    await ctx.onLog("stdout", `[ollama-local] Calling Ollama with model: ${model}\n`);
    const startTime = Date.now();
    try {
        const response = await Promise.race([
            fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
        ]);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error (${response.status}): ${errorText}`);
        }
        const data = await response.json();
        const elapsed = Date.now() - startTime;
        if (!data.message || !data.message.content) {
            return {
                exitCode: 1,
                signal: null,
                timedOut: false,
                errorMessage: "Ollama returned no message content",
                errorCode: "ollama_empty_response",
            };
        }
        const content = data.message.content;
        await ctx.onLog("stdout", `[ollama-local] Response in ${elapsed}ms\n`);
        return {
            exitCode: 0,
            signal: null,
            timedOut: false,
            provider: "ollama",
            model: data.model,
            usage: {
                inputTokens: data.prompt_eval_count || 0,
                outputTokens: data.eval_count || 0,
            },
            summary: content,
            resultJson: {
                content,
                elapsedMs: elapsed,
            },
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const timedOut = message.includes("timeout");
        if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
            return {
                exitCode: 1,
                signal: null,
                timedOut: false,
                errorMessage: `Cannot connect to Ollama at ${baseUrl}. Start with: ollama serve`,
                errorCode: "ollama_not_running",
            };
        }
        return {
            exitCode: 1,
            signal: null,
            timedOut,
            errorMessage: `Ollama failed: ${message}`,
            errorCode: timedOut ? "ollama_timeout" : "ollama_api_error",
        };
    }
}
export async function testEnvironment(ctx) {
    const baseUrl = asString(ctx.config.baseUrl) || OLLAMA_BASE_URL;
    const model = asString(ctx.config.model) || DEFAULT_MODEL;
    const testedAt = new Date().toISOString();
    try {
        const response = await fetch(`${baseUrl}/api/tags`, { method: "GET" });
        if (!response.ok) {
            return {
                ok: false,
                status: "fail",
                testedAt,
                checks: [{
                        code: "ollama_connect",
                        level: "error",
                        message: `Ollama server not responding at ${baseUrl}`,
                        hint: "Start Ollama with: ollama serve",
                    }],
            };
        }
        const data = await response.json();
        const models = data.models || [];
        const modelNames = models.map((m) => m.name);
        const hasModel = modelNames.some((name) => name === model || name.startsWith(model));
        if (!hasModel) {
            return {
                ok: false,
                status: "fail",
                testedAt,
                checks: [{
                        code: "ollama_model_missing",
                        level: "error",
                        message: `Model '${model}' not found`,
                        hint: `Available: ${modelNames.join(", ")}. Pull with: ollama pull ${model}`,
                    }],
            };
        }
        return {
            ok: true,
            status: "pass",
            testedAt,
            checks: [{
                    code: "ollama_ready",
                    level: "info",
                    message: `Ollama ready. Model '${model}' available.`,
                }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
            return {
                ok: false,
                status: "fail",
                testedAt,
                checks: [{
                        code: "ollama_not_running",
                        level: "error",
                        message: `Cannot connect to Ollama`,
                        hint: "Start Ollama with: ollama serve",
                    }],
            };
        }
        return {
            ok: false,
            status: "fail",
            testedAt,
            checks: [{
                    code: "ollama_error",
                    level: "error",
                    message: `Test failed: ${message}`,
                }],
        };
    }
}
