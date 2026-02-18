import {
  createDefaultClients,
  HttpAnthropicClient,
  HttpElevenLabsClient,
  HttpHeyGenClient,
} from "@nova/video-agents";
import type { ProvidersConfig } from "./config.js";

export function createClientsFromConfig(config: ProvidersConfig | null) {
  const fallback = createDefaultClients();
  if (!config) return fallback;

  return {
    anthropic: config.anthropic
      ? new HttpAnthropicClient(config.anthropic)
      : fallback.anthropic,
    elevenlabs: config.elevenlabs
      ? new HttpElevenLabsClient(config.elevenlabs)
      : fallback.elevenlabs,
    heygen: config.heygen
      ? new HttpHeyGenClient(config.heygen)
      : fallback.heygen,
  };
}
