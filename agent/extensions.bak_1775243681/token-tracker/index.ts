import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

/**
 * Token Tracker Extension
 * Shows token usage and cost after each API response
 */
export default function (pi: ExtensionAPI) {
  // Track API responses for token usage
  pi.on("api_response", async (event, ctx) => {
    const usage = event.response?.usage;
    if (usage) {
      const input = usage.inputTokens || usage.input_tokens || 0;
      const output = usage.outputTokens || usage.output_tokens || 0;
      const total = usage.totalTokens || usage.total_tokens || (input + output);
      const contextWindow = 262144; // Kimi Code context window
      const contextUsed = ((total / contextWindow) * 100).toFixed(2);
      
      // Estimate cost (Kimi Code approximate pricing)
      const cost = (input * 0.0000015) + (output * 0.000006);
      
      ctx.ui.notify(
        `🔥 ${input.toLocaleString()} in / ${output.toLocaleString()} out | ${contextUsed}% ctx | $${cost.toFixed(4)}`,
        "info"
      );
    }
  });

  // Show on session start
  pi.on("session_start", async () => {
    console.log("[Token Tracker] Monitoring API usage...");
  });
}
