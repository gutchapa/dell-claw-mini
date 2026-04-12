import type { UIAdapterModule } from "../types";
import { parseSimpleStdoutLine } from "../transcript";
import { KimiLocalConfigFields } from "./config-fields";
import { buildKimiLocalConfig } from "./build-config";

export const kimiLocalUIAdapter: UIAdapterModule = {
  type: "kimi_local",
  label: "Kimi Local (Direct API)",
  parseStdoutLine: parseSimpleStdoutLine,
  ConfigFields: KimiLocalConfigFields,
  buildAdapterConfig: buildKimiLocalConfig,
};