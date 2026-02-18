import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { OnboardingService } from '../onboarding/onboarding.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { getToolsForAgent } from './tools/tool-registry';
import { randomUUID } from 'crypto';

// Agent metadata (mirrored from frontend nova-agents.ts for system prompt)
const agentMeta: Record<string, { title: string; phase: string; role: string; summary: string; capabilities: string[] }> = {
  strategy: {
    title: 'Strategy Agent',
    phase: '01',
    role: 'Business Strategy Consultant',
    summary: 'Ingests your business context so every downstream agent inherits it.',
    capabilities: ['Business objective ingestion', 'Competitive advantage mapping', 'Terminology glossary', 'Challenge identification'],
  },
  research: {
    title: 'Research Agent',
    phase: '02',
    role: 'User Research & Market Intelligence',
    summary: 'AI-simulated interviews at scale plus CRM tools for human researchers.',
    capabilities: ['Audience profiling', 'Market intelligence', 'Competitor analysis'],
  },
  discovery: {
    title: 'Discovery & Prioritization',
    phase: '03',
    role: 'Problem Analyst & Democratic Facilitator',
    summary: '11-dimension AI scoring with evidence trails. Quadratic voting.',
    capabilities: ['Problem discovery', 'AI scoring', 'Quadratic voting', 'Evidence trails'],
  },
  solution: {
    title: 'Solution Architecture Agent',
    phase: '04',
    role: 'Solution Designer',
    summary: 'Designs solutions aligned to competitive advantage and technical architecture.',
    capabilities: ['Solution design', 'Architecture mapping', 'Evidence-to-solution linking'],
  },
  engineering: {
    title: 'Engineering Agents',
    phase: '05',
    role: 'Development & Delivery',
    summary: 'Git repo ingestion, POC or production-grade features, analytics instrumented from day one.',
    capabilities: ['Project management', 'Feature tracking', 'Sprint planning'],
  },
  analytics: {
    title: 'Astrolytics',
    phase: '07',
    role: 'Product Analytics Engine',
    summary: 'Full product analytics connected to the intelligence layer.',
    capabilities: ['Funnels', 'Retention', 'Session replay', 'Experiments'],
  },
};

export interface SSEEvent {
  type: 'session' | 'text_delta' | 'tool_use' | 'done' | 'error';
  sessionId?: string;
  text?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolUseId?: string;
  error?: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private anthropic: Anthropic;
  private conversations = new Map<string, Anthropic.MessageParam[]>();

  constructor(
    private configService: ConfigService,
    private onboardingService: OnboardingService,
  ) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY not set — Astra chat will not work');
    }
    this.anthropic = new Anthropic({ apiKey: apiKey || '' });
  }

  async *streamMessage(
    tenantId: string,
    user: { id: string; email: string; firstName?: string },
    dto: ChatMessageDto,
  ): AsyncGenerator<SSEEvent> {
    const sessionId = dto.sessionId || randomUUID();
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, []);
    }
    const messages = this.conversations.get(sessionId)!;

    // Build system prompt with current DB state
    const systemPrompt = await this.buildSystemPrompt(tenantId, dto.pageContext.agentId, user);

    // Get tools for this page
    const tools = getToolsForAgent(dto.pageContext.agentId);

    // Add user message to history
    messages.push({ role: 'user', content: dto.message });

    // Yield session ID first
    yield { type: 'session', sessionId };

    try {
      const requestParams: Anthropic.MessageCreateParams = {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
        ...(tools.length > 0 && { tools }),
      };

      const stream = this.anthropic.messages.stream(requestParams);

      let fullText = '';

      stream.on('text', (text) => {
        fullText += text;
      });

      // Collect events from the stream
      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            yield { type: 'text_delta', text: event.delta.text };
          }
        }
      }

      // Get the final message to check for tool use and save to history
      const finalMessage = await stream.finalMessage();

      // Process any tool use blocks
      for (const block of finalMessage.content) {
        if (block.type === 'tool_use') {
          yield {
            type: 'tool_use',
            toolName: block.name,
            toolInput: block.input as Record<string, unknown>,
            toolUseId: block.id,
          };
        }
      }

      // Save assistant response to conversation history
      messages.push({ role: 'assistant', content: finalMessage.content });

      // If there were tool uses, add tool results and get a follow-up response
      const toolUseBlocks = finalMessage.content.filter(b => b.type === 'tool_use');
      if (toolUseBlocks.length > 0) {
        // Add tool results (all succeed — actions are dispatched to frontend)
        const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map(block => ({
          type: 'tool_result' as const,
          tool_use_id: (block as Anthropic.ToolUseBlock).id,
          content: `Successfully applied ${(block as Anthropic.ToolUseBlock).name} on the page. The user can see the updated field.`,
        }));

        messages.push({ role: 'user', content: toolResults });

        // Get Claude's follow-up response after tool use
        const followUp = this.anthropic.messages.stream({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1024,
          system: systemPrompt,
          messages,
          ...(tools.length > 0 && { tools }),
        });

        for await (const event of followUp) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            yield { type: 'text_delta', text: event.delta.text };
          }
        }

        const followUpMessage = await followUp.finalMessage();
        messages.push({ role: 'assistant', content: followUpMessage.content });
      }

      yield { type: 'done' };
    } catch (err: any) {
      this.logger.error('Anthropic streaming error', err);
      let errorMsg = 'Something went wrong. Please try again.';
      if (err?.status === 400 && err?.message?.includes('credit balance')) {
        errorMsg = 'The Anthropic API key has no credits. Please add credits at console.anthropic.com.';
      } else if (err?.status === 401) {
        errorMsg = 'Invalid Anthropic API key. Please check your configuration.';
      } else if (err?.status === 429) {
        errorMsg = 'Rate limited — please wait a moment and try again.';
      }
      yield { type: 'error', error: errorMsg };
    }
  }

  private async buildSystemPrompt(
    tenantId: string,
    agentId: string,
    user: { firstName?: string; email: string },
  ): Promise<string> {
    const agent = agentMeta[agentId] || agentMeta.strategy!;

    let contextSection = '';
    try {
      const ctx = await this.onboardingService.getClientContext(tenantId);
      const glossary = ctx.terminologyGlossary as Record<string, string>;
      contextSection = `
## Current Business Context (from database)
${ctx.objectives ? `**Objectives**: ${ctx.objectives}` : '**Objectives**: _Not yet provided_'}
${ctx.businessModel ? `**Business Model**: ${ctx.businessModel}` : '**Business Model**: _Not yet provided_'}
${ctx.competitiveAdvantages ? `**Competitive Advantages**: ${ctx.competitiveAdvantages}` : '**Competitive Advantages**: _Not yet provided_'}
${ctx.existingProblems ? `**Known Challenges**: ${ctx.existingProblems}` : '**Known Challenges**: _Not yet provided_'}
**Terminology**: ${Object.keys(glossary).length > 0 ? Object.entries(glossary).map(([t, d]) => `${t}: ${d}`).join('; ') : '_No terms defined yet_'}`;
    } catch {
      contextSection = '\n## Current Business Context\n_Unable to load — database may be unavailable._';
    }

    return `You are Astra, an AI assistant embedded in the Nova product development platform. You're helping ${user.firstName || user.email.split('@')[0]} on the ${agent.title} page.

## Your Personality
- Friendly, concise, professional
- You speak the language of business strategy and product development
- When the user describes their business, extract structured information and use tools to fill in form fields
- Keep responses short (2-3 sentences) unless the user asks for a detailed explanation

## Current Page
**${agent.title}** (Phase ${agent.phase}) — ${agent.role}
${agent.summary}
Capabilities: ${agent.capabilities.join(', ')}
${contextSection}

## Instructions
1. Help the user understand this page and what information Nova needs
2. When the user describes their business, extract relevant details and use tools to fill in form fields
3. Confirm what you filled after using tools — be specific about which field
4. The user still needs to click "Save" to persist changes — filling fields is just a draft
5. If no tools are available for this page, just provide helpful explanations and guidance
6. Do NOT use markdown headers in responses — keep it conversational`;
  }
}
