import type { ElevenLabsClient, VoiceOptions } from "../types.js";

export interface ElevenLabsConfig {
  apiKey: string;
  defaultVoiceId?: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

export class HttpElevenLabsClient implements ElevenLabsClient {
  private readonly config: ElevenLabsConfig;
  private readonly baseUrl: string;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  async textToSpeech(text: string, options: VoiceOptions = {}): Promise<Buffer> {
    const voiceId =
      options.voiceId ?? this.config.defaultVoiceId ?? DEFAULT_VOICE_ID;

    const url = `${this.baseUrl}/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": this.config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `ElevenLabs TTS failed (${response.status}): ${body}`
      );
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async listVoices(): Promise<Array<{ voiceId: string; name: string }>> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        "xi-api-key": this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs list voices failed (${response.status})`);
    }

    const data = (await response.json()) as {
      voices: Array<{ voice_id: string; name: string }>;
    };

    return data.voices.map((v) => ({
      voiceId: v.voice_id,
      name: v.name,
    }));
  }
}
