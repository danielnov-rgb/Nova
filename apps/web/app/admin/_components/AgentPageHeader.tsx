"use client";

import { getAgent, agentColors } from "../_data/nova-agents";

interface AgentPageHeaderProps {
  agentId: string;
}

export function AgentPageHeader({ agentId }: AgentPageHeaderProps) {
  const agent = getAgent(agentId);
  if (!agent) return null;

  const colors = agentColors[agent.color] ?? agentColors.blue!;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 mb-6`}>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.badge} text-white`}>
          {agent.phase}
        </span>
        <div>
          <h2 className={`text-sm font-semibold ${colors.text}`}>{agent.title}</h2>
          <p className="text-xs text-gray-500">{agent.role}</p>
        </div>
        <p className="text-xs text-gray-400 ml-auto max-w-md text-right hidden md:block">
          {agent.summary}
        </p>
      </div>
    </div>
  );
}
