import { randomUUID } from "node:crypto";
import type { BaseVideoAgent } from "./agents/base.js";
import type {
  FailedStage,
  PipelineOptions,
  Script,
  StageRun,
  VideoContext,
  VideoReport,
  VideoResult,
  VoiceoverResult,
} from "./types.js";
import { toIsoString } from "./utils/time.js";

type ScriptContext = VideoContext;
type VoiceoverContext = VideoContext & { script: Script };
type VisualContext = VideoContext & { script: Script; voiceover: VoiceoverResult };

export class SequentialPipeline {
  private readonly scriptAgent: BaseVideoAgent<ScriptContext, Script>;
  private readonly voiceoverAgent: BaseVideoAgent<VoiceoverContext, VoiceoverResult>;
  private readonly visualAgent: BaseVideoAgent<VisualContext, VideoResult>;
  private readonly options: PipelineOptions;

  constructor(
    agents: [
      BaseVideoAgent<ScriptContext, Script>,
      BaseVideoAgent<VoiceoverContext, VoiceoverResult>,
      BaseVideoAgent<VisualContext, VideoResult>,
    ],
    options: PipelineOptions = {}
  ) {
    this.scriptAgent = agents[0];
    this.voiceoverAgent = agents[1];
    this.visualAgent = agents[2];
    this.options = options;
  }

  async run(context: VideoContext): Promise<VideoReport> {
    const pipelineStart = Date.now();
    const stageRuns: StageRun<unknown>[] = [];

    // Stage 1: Script
    const scriptRun = await this.scriptAgent.run(context);
    stageRuns.push(scriptRun);
    if (!scriptRun.output) {
      return this.buildReport(context, stageRuns, pipelineStart, "script");
    }

    // Stage 2: Voiceover (needs script)
    const voiceoverContext: VoiceoverContext = {
      ...context,
      script: scriptRun.output,
    };
    const voiceoverRun = await this.voiceoverAgent.run(voiceoverContext);
    stageRuns.push(voiceoverRun);
    if (!voiceoverRun.output) {
      return this.buildReport(context, stageRuns, pipelineStart, "voiceover");
    }

    // Stage 3: Video (needs script + voiceover)
    const visualContext: VisualContext = {
      ...context,
      script: scriptRun.output,
      voiceover: voiceoverRun.output,
    };
    const videoRun = await this.visualAgent.run(visualContext);
    stageRuns.push(videoRun);
    if (!videoRun.output) {
      return this.buildReport(context, stageRuns, pipelineStart, "video");
    }

    return this.buildReport(context, stageRuns, pipelineStart, null);
  }

  private buildReport(
    context: VideoContext,
    stageRuns: StageRun<unknown>[],
    startMs: number,
    failedAtStage: FailedStage | null
  ): VideoReport {
    const scriptOutput = (stageRuns[0]?.output as Script) ?? null;
    const voiceoverOutput = (stageRuns[1]?.output as VoiceoverResult) ?? null;
    const videoOutput = (stageRuns[2]?.output as VideoResult) ?? null;

    return {
      id: randomUUID(),
      generatedAt: toIsoString(new Date()),
      videoType: context.videoType,
      clientName: context.clientProfile?.name,
      script: scriptOutput,
      voiceover: voiceoverOutput,
      video: videoOutput,
      stageRuns,
      summary: {
        succeeded: failedAtStage === null,
        failedAtStage,
        totalDurationMs: Date.now() - startMs,
      },
    };
  }
}
