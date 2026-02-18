import type Anthropic from '@anthropic-ai/sdk';
import { strategyTools } from './strategy-tools';

const toolsByAgent: Record<string, Anthropic.Tool[]> = {
  strategy: strategyTools,
};

export function getToolsForAgent(agentId: string): Anthropic.Tool[] {
  return toolsByAgent[agentId] || [];
}
