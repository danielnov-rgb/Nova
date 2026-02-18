import { randomUUID } from "node:crypto";
import type {
  AnthropicClient,
  ElevenLabsClient,
  GenerateScriptOptions,
  HeyGenClient,
  HeyGenSubmitOptions,
  HeyGenVideoStatus,
  Script,
  ScriptSection,
  VoiceOptions,
} from "../types.js";

// ─── Mock Script Sections ────────────────────────────────────────────────────

const GENERIC_SECTIONS: ScriptSection[] = [
  {
    id: "hook",
    label: "Opening Hook",
    durationSeconds: 10,
    narration:
      "Every product team thinks they know what to build. But without structured intelligence, most are building on assumptions.",
    visualCue: "Abstract data visualization morphing into a clear product roadmap",
    onScreenText: "What if you knew?",
  },
  {
    id: "problem",
    label: "The Challenge",
    durationSeconds: 20,
    narration:
      "Research happens in silos. Prioritization is driven by who speaks loudest. Features ship without instrumentation, so you never learn what worked. And when people leave, their knowledge goes with them.",
    visualCue: "Split-screen showing fragmented tools: spreadsheets, slide decks, sticky notes",
  },
  {
    id: "solution",
    label: "Nova Enters",
    durationSeconds: 25,
    narration:
      "Nova is an AI orchestration layer for product development. Specialized agents research your market in parallel. Problems get scored across 11 dimensions with evidence trails. Your team votes with structured credits. Then Nova tracks whether what you built actually moved the needle.",
    visualCue: "Animated pipeline: research agents flowing into scoring dashboard, then voting interface, then analytics",
    onScreenText: "One continuous pipeline",
  },
  {
    id: "proof",
    label: "The Result",
    durationSeconds: 12,
    narration:
      "Teams using Nova compress their solution discovery cycle by 6 to 8 times. What used to take months happens in weeks, with an evidence trail for every decision.",
    visualCue: "Timeline compression animation: 24 weeks shrinking to 3 weeks",
    onScreenText: "6-8x faster",
  },
  {
    id: "cta",
    label: "Call to Action",
    durationSeconds: 8,
    narration: "See Nova in action. Book a 30-minute walkthrough at heynova.ai.",
    visualCue: "Nova logo with call-to-action button",
    onScreenText: "heynova.ai",
  },
];

const PERSONALIZED_SECTIONS: ScriptSection[] = [
  {
    id: "hook",
    label: "Opening Hook",
    durationSeconds: 12,
    narration:
      "Your organization is building something ambitious. The question is not what to build, but how to build the right things, fast.",
    visualCue: "Client logo transitioning into a complex product landscape",
    onScreenText: "Building the right things",
  },
  {
    id: "mirror",
    label: "Understanding Your World",
    durationSeconds: 18,
    narration:
      "Hundreds of possible directions. Traditional solution discovery takes 17 to 24 weeks per initiative. That is years of work just to understand what matters most.",
    visualCue: "Branching decision tree growing exponentially, then simplifying",
  },
  {
    id: "solution",
    label: "How Nova Helps",
    durationSeconds: 28,
    narration:
      "Nova compressed that timeline to 3 weeks. AI research agents discover and validate problems at scale. Every problem gets scored across 11 dimensions with full evidence trails. Your team votes using structured credits, so priorities reflect genuine conviction, not just seniority.",
    visualCue: "Nova UI walkthrough: research dashboard, scoring panels, voting session",
    onScreenText: "3 weeks, not 24",
  },
  {
    id: "workflow",
    label: "A Day With Nova",
    durationSeconds: 22,
    narration:
      "Solutions map directly to your product hierarchy. Nova designs features aligned to both competitive advantage and system architecture, then tracks delivery through to analytics. Every feature ships instrumented from day one.",
    visualCue: "Animated workflow: problem to solution to feature to analytics dashboard",
  },
  {
    id: "outcomes",
    label: "Expected Results",
    durationSeconds: 18,
    narration:
      "The result is a product organization that learns from every decision. Research feeds prioritization. Prioritization feeds engineering. Engineering feeds analytics. And analytics feeds the next cycle of research.",
    visualCue: "Circular intelligence loop diagram with data flowing between stages",
    onScreenText: "The intelligence loop",
  },
  {
    id: "cta",
    label: "Next Steps",
    durationSeconds: 8,
    narration:
      "This is not a prototype. It is already running. Let us build this together.",
    visualCue: "Partnership handshake visual, then Nova + client logos side by side",
    onScreenText: "Let's build this together",
  },
];

// ─── Mock Clients ────────────────────────────────────────────────────────────

export class MockAnthropicClient implements AnthropicClient {
  async generateScript(options: GenerateScriptOptions): Promise<Script> {
    const sections =
      options.videoType === "generic" ? GENERIC_SECTIONS : PERSONALIZED_SECTIONS;
    const totalDuration = sections.reduce((sum, s) => sum + s.durationSeconds, 0);

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

// Minimal valid MP3 frame header (silence)
const MOCK_MP3_HEADER = Buffer.from([
  0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

export class MockElevenLabsClient implements ElevenLabsClient {
  async textToSpeech(_text: string, _options?: VoiceOptions): Promise<Buffer> {
    return MOCK_MP3_HEADER;
  }

  async listVoices() {
    return [
      { voiceId: "mock-voice-rachel", name: "Rachel" },
      { voiceId: "mock-voice-adam", name: "Adam" },
    ];
  }
}

export class MockHeyGenClient implements HeyGenClient {
  async submitVideo(_options: HeyGenSubmitOptions): Promise<string> {
    return `mock-video-${randomUUID()}`;
  }

  async getVideoStatus(videoId: string): Promise<HeyGenVideoStatus> {
    return {
      status: "completed",
      videoUrl: `https://mock.heygen.com/videos/${videoId}.mp4`,
      durationSeconds: 90,
    };
  }
}

// ─── Default Client Factory ──────────────────────────────────────────────────

export function createDefaultClients() {
  return {
    anthropic: new MockAnthropicClient(),
    elevenlabs: new MockElevenLabsClient(),
    heygen: new MockHeyGenClient(),
  };
}
