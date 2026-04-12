import type { ComponentType } from "react";
import type { AdapterConfigFieldsProps } from "../types";

// Simple configuration fields for Kimi adapter
// In production, this would have proper form inputs

export const KimiLocalConfigFields: ComponentType<AdapterConfigFieldsProps> = () => {
  return (
    <div>
      <p>Kimi Local Adapter Configuration</p>
      <ul>
        <li>apiKey: Kimi API key (or set KIMI_API_KEY env var)</li>
        <li>model: kimi-code (default) or other Kimi models</li>
        <li>temperature: 0.0 - 2.0 (default: 0.7)</li>
        <li>maxTokens: Maximum tokens to generate (default: 4096)</li>
        <li>timeoutMs: Request timeout in ms (default: 120000)</li>
      </ul>
    </div>
  );
};

export default KimiLocalConfigFields;