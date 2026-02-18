// =============================================================================
// VIDEO EXPLAINER AGENT — TYPE DEFINITIONS
// =============================================================================

// ─── Video Types ─────────────────────────────────────────────────────────────

export type VideoType = "generic" | "personalized";

export interface ClientProfile {
  name: string;
  industry?: string;
  painPoints?: string[];
  useCases?: string[];
}

// ─── Context (passed through all stages) ─────────────────────────────────────

export interface VideoContext {
  now: Date;
  videoType: VideoType;
  clientProfile?: ClientProfile;
  outputDir: string;
  clients: {
    anthropic: AnthropicClient;
    elevenlabs: ElevenLabsClient;
    heygen: HeyGenClient;
  };
}

// ─── Script (output of ScriptAgent) ──────────────────────────────────────────

export interface ScriptSection {
  id: string;
  label: string;
  durationSeconds: number;
  narration: string;
  visualCue: string;
  onScreenText?: string;
}

export interface Script {
  id: string;
  videoType: VideoType;
  clientName?: string;
  totalDurationSeconds: number;
  sections: ScriptSection[];
  generatedAt: string;
  rawNarration: string;
}

// ─── Voiceover (output of VoiceoverAgent) ────────────────────────────────────

export interface VoiceoverResult {
  audioPath: string;
  voiceId: string;
  durationSeconds: number;
  generatedAt: string;
}

// ─── Video (output of VisualAgent) ───────────────────────────────────────────

export interface VideoResult {
  videoId: string;
  videoPath?: string;
  videoUrl: string;
  durationSeconds: number;
  generatedAt: string;
}

// ─── Stage Run (per-stage execution record) ──────────────────────────────────

export interface StageRun<T> {
  stageId: string;
  stageName: string;
  startedAt: string;
  finishedAt: string;
  output: T | null;
  errors: string[];
}

// ─── Video Report (final pipeline output) ────────────────────────────────────

export type FailedStage = "script" | "voiceover" | "video";

export interface VideoReport {
  id: string;
  generatedAt: string;
  videoType: VideoType;
  clientName?: string;
  script: Script | null;
  voiceover: VoiceoverResult | null;
  video: VideoResult | null;
  stageRuns: StageRun<unknown>[];
  summary: {
    succeeded: boolean;
    failedAtStage: FailedStage | null;
    totalDurationMs: number;
  };
}

// ─── Client Interfaces ───────────────────────────────────────────────────────

export interface GenerateScriptOptions {
  videoType: VideoType;
  clientProfile?: ClientProfile;
}

export interface AnthropicClient {
  generateScript(options: GenerateScriptOptions): Promise<Script>;
}

export interface VoiceOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface ElevenLabsClient {
  textToSpeech(text: string, options?: VoiceOptions): Promise<Buffer>;
  listVoices(): Promise<Array<{ voiceId: string; name: string }>>;
}

export interface HeyGenSubmitOptions {
  script: Script;
  audioPath: string;
}

export interface HeyGenVideoStatus {
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  durationSeconds?: number;
}

export interface HeyGenClient {
  submitVideo(options: HeyGenSubmitOptions): Promise<string>;
  getVideoStatus(videoId: string): Promise<HeyGenVideoStatus>;
}

// ─── Pipeline Options ────────────────────────────────────────────────────────

export interface PipelineOptions {
  heygenPollIntervalMs?: number;
  heygenTimeoutMs?: number;
  downloadVideo?: boolean;
}
