import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "node:crypto";
import type {
  AnthropicClient,
  GenerateScriptOptions,
  Script,
  ScriptSection,
} from "../types.js";
import { buildGenericSystemPrompt } from "../templates/generic.js";
import { buildPersonalizedSystemPrompt } from "../templates/personalized.js";

export interface AnthropicConfig {
  apiKey: string;
  model?: string;
}

const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";

export class HttpAnthropicClient implements AnthropicClient {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(config: AnthropicConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.model = config.model ?? DEFAULT_MODEL;
  }

  async generateScript(options: GenerateScriptOptions): Promise<Script> {
    const systemPrompt =
      options.videoType === "generic"
        ? buildGenericSystemPrompt()
        : buildPersonalizedSystemPrompt(options.clientProfile!);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content:
            "Generate the video script now. Return ONLY valid JSON matching the schema described.",
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in Claude response");
    }

    return this.parseScript(textBlock.text, options);
  }

  private parseScript(raw: string, options: GenerateScriptOptions): Script {
    // Handle both raw JSON and ```json code blocks
    let jsonStr = raw.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1]!.trim();
    }

    const parsed = JSON.parse(jsonStr) as { sections: ScriptSection[] };

    if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      throw new Error("Invalid script: missing or empty sections array");
    }

    const sections = parsed.sections;
    const totalDuration = sections.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    );

    return {
      id: randomUUID(),
      videoType: options.videoType,
      clientName:
        options.videoType === "personalized"
          ? options.clientProfile?.name
          : undefined,
      totalDurationSeconds: totalDuration,
      sections,
      generatedAt: new Date().toISOString(),
      rawNarration: sections.map((s) => s.narration).join(" "),
    };
  }
}
