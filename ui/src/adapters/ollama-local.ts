import type { UIAdapterModule } from "./types";
import { SchemaConfigFields, buildSchemaAdapterConfig } from "./schema-config-fields";

export const ollamaLocalUIAdapter: UIAdapterModule = {
  type: "ollama_local",
  label: "Ollama Local",
  ConfigFields: SchemaConfigFields,
  buildAdapterConfig: buildSchemaAdapterConfig,
  parseStdoutLine: (line: string, ts: string) => {
    return [{
      kind: "stdout" as const,
      ts,
      text: line,
    }];
  },
};
