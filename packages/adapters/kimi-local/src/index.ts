// Kimi Local Adapter for Paperclip
// Direct Kimi API integration - no Ollama middleman

export const ADAPTER_TYPE = "kimi_local";
export const ADAPTER_LABEL = "Kimi Local (Direct API)";

// Re-export for server
export { execute } from "./server/index.js";