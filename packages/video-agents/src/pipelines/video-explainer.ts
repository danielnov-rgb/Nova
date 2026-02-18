import { ScriptAgent } from "../agents/scriptAgent.js";
import { VoiceoverAgent } from "../agents/voiceoverAgent.js";
import { VisualAgent } from "../agents/visualAgent.js";
import { createDefaultClients } from "../clients/connectors.js";
import { SequentialPipeline } from "../pipeline.js";
import type { PipelineOptions, VideoContext, VideoReport } from "../types.js";

export function createVideoContext(
  overrides: Partial<VideoContext> = {}
): VideoContext {
  return {
    now: overrides.now ?? new Date(),
    videoType: overrides.videoType ?? "generic",
    clientProfile: overrides.clientProfile,
    outputDir: overrides.outputDir ?? "./data",
    clients: overrides.clients ?? createDefaultClients(),
  };
}

export function createVideoPipeline(
  options: PipelineOptions = {}
): SequentialPipeline {
  return new SequentialPipeline(
    [new ScriptAgent(), new VoiceoverAgent(), new VisualAgent(options)],
    options
  );
}

export async function runVideoExplainer(
  overrides: Partial<VideoContext> = {},
  options: PipelineOptions = {}
): Promise<VideoReport> {
  const context = createVideoContext(overrides);
  const pipeline = createVideoPipeline(options);
  return pipeline.run(context);
}
