import { asNumber, asString, buildPaperclipEnv, renderPaperclipWakePrompt, stringifyPaperclipWakePayload, } from "@paperclipai/adapter-utils/server-utils";
// Kimi API Configuration
const KIMI_API_BASE_URL = "https://api.kimi.com/coding";
const DEFAULT_MODEL = "kimi-code";
function nonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function buildWakePayload(ctx) {
    return {
        runId: ctx.runId,
        agentId: ctx.agent.id,
        companyId: ctx.agent.companyId,
        taskId: nonEmpty(ctx.context.taskId) ?? nonEmpty(ctx.context.issueId),
        issueId: nonEmpty(ctx.context.issueId),
        wakeReason: nonEmpty(ctx.context.wakeReason),
    };
}
function buildSystemPrompt(ctx) {
    const wakePayload = buildWakePayload(ctx);
    const paperclipEnv = buildPaperclipEnv(ctx.agent);
    const lines = [
        "You are an autonomous AI agent running under Paperclip orchestration.",
        "",
        "Context:",
        `- Run ID: ${wakePayload.runId}`,
        `- Agent ID: ${wakePayload.agentId}`,
        `- Company ID: ${wakePayload.companyId}`,
        `- Task ID: ${wakePayload.taskId ?? "N/A"}`,
        `- Issue ID: ${wakePayload.issueId ?? "N/A"}`,
        `- Wake Reason: ${wakePayload.wakeReason ?? "N/A"}`,
        "",
        "Environment:",
        ...Object.entries(paperclipEnv).map(([k, v]) => `- ${k}=${v}`),
        "",
        "Instructions:",
        "1. Execute the task provided in the user message.",
        "2. Report progress and results clearly.",
        "3. If you need to use tools, describe what you would do.",
        "4. Complete the task to the best of your ability.",
        "",
    ];
    const structuredWake = ctx.context.paperclipWake;
    if (structuredWake && Object.keys(structuredWake).length > 0) {
        lines.push("Structured Wake Payload:");
        lines.push("```json");
        lines.push(JSON.stringify(structuredWake, null, 2));
        lines.push("```");
        lines.push("");
    }
    const wakePrompt = renderPaperclipWakePrompt(structuredWake);
    if (wakePrompt) {
        lines.push("Wake Prompt:");
        lines.push(wakePrompt);
    }
    return lines.join("\n");
}
async function callKimiAPI(apiKey, request, onLog) {
    const url = `${KIMI_API_BASE_URL}/v1/chat/completions`;
    await onLog("stdout", `[kimi-local] Calling Kimi API with model: ${request.model}\n`);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kimi API error (${response.status}): ${errorText}`);
    }
    return response.json();
}
export async function execute(ctx) {
    // Get configuration
    const apiKey = asString(ctx.config.apiKey, "").trim() || process.env.KIMI_API_KEY || "";
    if (!apiKey) {
        return {
            exitCode: 1,
            signal: null,
            timedOut: false,
            errorMessage: "Kimi API key not configured. Set apiKey in adapter config or KIMI_API_KEY environment variable.",
            errorCode: "kimi_api_key_missing",
        };
    }
    const model = asString(ctx.config.model, "").trim() || DEFAULT_MODEL;
    const temperature = Math.max(0, Math.min(2, asNumber(ctx.config.temperature, 0.7)));
    const maxTokens = Math.max(1, asNumber(ctx.config.maxTokens, 4096));
    const timeoutMs = Math.max(0, asNumber(ctx.config.timeoutMs, 120000));
    // Build the prompt
    const systemPrompt = buildSystemPrompt(ctx);
    const userMessage = asString(ctx.config.message, "").trim() || "Execute your assigned task.";
    // Add wake context to user message if present
    const wakeText = stringifyPaperclipWakePayload(ctx.context.paperclipWake);
    const fullUserMessage = wakeText
        ? `${userMessage}\n\nWake Context:\n${wakeText}`
        : userMessage;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullUserMessage },
    ];
    const request = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
    };
    // Execute with timeout
    const startTime = Date.now();
    try {
        const response = await Promise.race([
            callKimiAPI(apiKey, request, ctx.onLog),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
        ]);
        const elapsed = Date.now() - startTime;
        if (response.choices.length === 0) {
            return {
                exitCode: 1,
                signal: null,
                timedOut: false,
                errorMessage: "Kimi API returned no choices",
                errorCode: "kimi_no_choices",
            };
        }
        const choice = response.choices[0];
        const content = choice.message.content;
        await ctx.onLog("stdout", `[kimi-local] Response received in ${elapsed}ms\n`);
        await ctx.onLog("stdout", `[kimi-local] Tokens used: ${response.usage.total_tokens} (prompt: ${response.usage.prompt_tokens}, completion: ${response.usage.completion_tokens})\n`);
        return {
            exitCode: 0,
            signal: null,
            timedOut: false,
            provider: "kimi",
            model: response.model,
            usage: {
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.completion_tokens,
            },
            summary: content,
            resultJson: {
                content,
                finishReason: choice.finish_reason,
                elapsedMs: elapsed,
            },
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const timedOut = message.includes("timeout");
        return {
            exitCode: 1,
            signal: null,
            timedOut,
            errorMessage: `Kimi API call failed: ${message}`,
            errorCode: timedOut ? "kimi_timeout" : "kimi_api_error",
        };
    }
}
