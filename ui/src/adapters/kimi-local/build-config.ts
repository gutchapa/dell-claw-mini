// FIX: Define local type since @paperclipai/adapter-utils doesn't export proper CreateConfigValues
export interface KimiLocalConfigValues {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export function buildKimiLocalConfig(values: KimiLocalConfigValues): Record<string, unknown> {
  return {
    apiKey: values.apiKey ?? "",
    model: values.model ?? "kimi-code",
    temperature: Number(values.temperature ?? 0.7),
    maxTokens: Number(values.maxTokens ?? 4096),
    timeoutMs: Number(values.timeoutMs ?? 120000),
  };
}
