import type {
  HeyGenClient,
  HeyGenSubmitOptions,
  HeyGenVideoStatus,
  ScriptSection,
} from "../types.js";

export interface HeyGenConfig {
  apiKey: string;
  avatarId?: string;
  voiceId?: string;
  backgroundId?: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.heygen.com";
const DEFAULT_AVATAR_ID = "Abigail_expressive_2024112501"; // Abigail (Upper Body)
const DEFAULT_VOICE_ID = "453c20e1525a429080e2ad9e4b26f2cd"; // Archer - confident English

export class HttpHeyGenClient implements HeyGenClient {
  private readonly config: HeyGenConfig;
  private readonly baseUrl: string;

  constructor(config: HeyGenConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  async submitVideo(options: HeyGenSubmitOptions): Promise<string> {
    const payload = this.buildPayload(options);

    const response = await fetch(`${this.baseUrl}/v2/video/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `HeyGen submit failed (${response.status}): ${body}`
      );
    }

    const data = (await response.json()) as {
      data: { video_id: string };
    };

    return data.data.video_id;
  }

  async getVideoStatus(videoId: string): Promise<HeyGenVideoStatus> {
    const url = `${this.baseUrl}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HeyGen status check failed (${response.status})`);
    }

    const data = (await response.json()) as {
      data: {
        status: string;
        video_url?: string;
        duration?: number;
      };
    };

    const status = data.data.status;

    return {
      status:
        status === "completed"
          ? "completed"
          : status === "failed"
            ? "failed"
            : status === "processing"
              ? "processing"
              : "pending",
      videoUrl: data.data.video_url,
      durationSeconds: data.data.duration,
    };
  }

  private buildPayload(options: HeyGenSubmitOptions) {
    const avatarId = this.config.avatarId ?? DEFAULT_AVATAR_ID;
    const voiceId = this.config.voiceId ?? DEFAULT_VOICE_ID;

    return {
      video_inputs: options.script.sections.map((section: ScriptSection) => ({
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          voice_id: voiceId,
          input_text: section.narration,
          speed: 1.0,
        },
        background: this.config.backgroundId
          ? { type: "template", template_id: this.config.backgroundId }
          : { type: "color", value: "#0f172a" },
      })),
      dimension: { width: 1920, height: 1080 },
    };
  }
}
