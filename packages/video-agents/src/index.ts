// Types
export * from "./types.js";

// Pipeline
export { SequentialPipeline } from "./pipeline.js";

// Agents
export { BaseVideoAgent } from "./agents/base.js";
export { ScriptAgent } from "./agents/scriptAgent.js";
export { VoiceoverAgent } from "./agents/voiceoverAgent.js";
export { VisualAgent } from "./agents/visualAgent.js";

// Clients
export { HttpAnthropicClient } from "./clients/anthropic.js";
export type { AnthropicConfig } from "./clients/anthropic.js";
export { HttpElevenLabsClient } from "./clients/elevenlabs.js";
export type { ElevenLabsConfig } from "./clients/elevenlabs.js";
export { HttpHeyGenClient } from "./clients/heygen.js";
export type { HeyGenConfig } from "./clients/heygen.js";
export {
  MockAnthropicClient,
  MockElevenLabsClient,
  MockHeyGenClient,
  createDefaultClients,
} from "./clients/connectors.js";

// Pipeline factory
export {
  createVideoContext,
  createVideoPipeline,
  runVideoExplainer,
} from "./pipelines/video-explainer.js";
