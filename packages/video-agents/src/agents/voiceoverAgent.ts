import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { Script, VideoContext, VoiceoverResult } from "../types.js";
import { BaseVideoAgent } from "./base.js";

type VoiceoverContext = VideoContext & { script: Script };

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // ElevenLabs "Rachel"

export class VoiceoverAgent extends BaseVideoAgent<VoiceoverContext, VoiceoverResult> {
  constructor() {
    super({
      stageId: "voiceover",
      stageName: "Voiceover Generator",
      description: "Generates narrated audio via ElevenLabs",
    });
  }

  protected async buildOutput(context: VoiceoverContext): Promise<VoiceoverResult> {
    const audioBuffer = await context.clients.elevenlabs.textToSpeech(
      context.script.rawNarration
    );

    const audioPath = join(context.outputDir, `${context.script.id}-voiceover.mp3`);
    await mkdir(dirname(audioPath), { recursive: true });
    await writeFile(audioPath, audioBuffer);

    return {
      audioPath,
      voiceId: DEFAULT_VOICE_ID,
      durationSeconds: context.script.totalDurationSeconds,
      generatedAt: new Date().toISOString(),
    };
  }
}
