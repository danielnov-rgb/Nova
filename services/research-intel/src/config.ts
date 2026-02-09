import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { HttpDatasetConfig, HttpSearchConfig } from "@nova/research-agents";

export interface ProvidersConfig {
  search?: HttpSearchConfig;
  datasets?: HttpDatasetConfig;
  internal?: HttpDatasetConfig;
}

export interface ConfigLoadResult {
  config: ProvidersConfig | null;
  resolvedPath: string | null;
}

const defaultConfigPath = "./config/providers.json";

export async function loadProvidersConfig(path?: string): Promise<ConfigLoadResult> {
  const resolvedPath = resolve(path ?? defaultConfigPath);

  if (!existsSync(resolvedPath)) {
    return { config: null, resolvedPath: null };
  }

  const raw = await readFile(resolvedPath, "utf-8");
  const config = JSON.parse(raw) as ProvidersConfig;
  return { config, resolvedPath };
}
