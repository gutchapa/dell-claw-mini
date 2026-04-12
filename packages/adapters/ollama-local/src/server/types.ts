export interface OllamaLocalAdapterConfig {
  /** Ollama server base URL (default: http://localhost:11434) */
  baseUrl?: string;
  /** Model to use (default: tinydolphin) */
  model?: string;
  /** Temperature (0-1, default: 0.7) */
  temperature?: number;
  /** Max tokens to generate (default: 4096) */
  maxTokens?: number;
}