import type {
  PipelineOptions,
  Script,
  VideoContext,
  VideoResult,
  VoiceoverResult,
} from "../types.js";
import { pollUntilDone } from "../utils/polling.js";
import { BaseVideoAgent } from "./base.js";

type VisualContext = VideoContext & { script: Script; voiceover: VoiceoverResult };

const DEFAULT_POLL_INTERVAL_MS = 10_000;
const DEFAULT_TIMEOUT_MS = 600_000;

export class VisualAgent extends BaseVideoAgent<VisualContext, VideoResult> {
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(options: PipelineOptions = {}) {
    super({
      stageId: "video",
      stageName: "Video Generator",
      description: "Generates video via HeyGen with avatar and voiceover",
    });
    this.pollIntervalMs = options.heygenPollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    this.timeoutMs = options.heygenTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  protected async buildOutput(context: VisualContext): Promise<VideoResult> {
    const videoId = await context.clients.heygen.submitVideo({
      script: context.script,
      audioPath: context.voiceover.audioPath,
    });

    const result = await pollUntilDone(
      () => context.clients.heygen.getVideoStatus(videoId),
      (status) => status.status === "completed" || status.status === "failed",
      {
        intervalMs: this.pollIntervalMs,
        timeoutMs: this.timeoutMs,
      }
    );

    if (result.status === "failed") {
      throw new Error(`HeyGen video generation failed for job ${videoId}`);
    }

    return {
      videoId,
      videoUrl: result.videoUrl!,
      durationSeconds:
        result.durationSeconds ?? context.script.totalDurationSeconds,
      generatedAt: new Date().toISOString(),
    };
  }
}
