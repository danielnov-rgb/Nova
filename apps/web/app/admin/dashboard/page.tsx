"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { agentChain, agentColors, novaIdentity, type NovaAgent } from "../_data/nova-agents";
import { problemsApi, sessionsApi, solutionsApi, featuresApi } from "../_lib/api";

interface DashboardStats {
  problems: number;
  sessions: number;
  solutions: number;
  features: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ problems: 0, sessions: 0, solutions: 0, features: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [problems, sessions, solutions, features] = await Promise.allSettled([
          problemsApi.list(),
          sessionsApi.list(),
          solutionsApi.list(),
          featuresApi.list({ rootOnly: true }),
        ]);
        setStats({
          problems: problems.status === "fulfilled" ? problems.value.length : 0,
          sessions: sessions.status === "fulfilled" ? sessions.value.length : 0,
          solutions: solutions.status === "fulfilled" ? solutions.value.length : 0,
          features: features.status === "fulfilled" ? features.value.length : 0,
        });
      } catch {
        // Stats are non-critical, keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
              Agent Pipeline
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {novaIdentity.name}
            <span className="text-gray-500 font-normal"> × 2gthr</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            {novaIdentity.subtitle}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Problems Discovered" value={stats.problems} loading={loading} />
          <StatCard label="Voting Sessions" value={stats.sessions} loading={loading} />
          <StatCard label="Solutions Designed" value={stats.solutions} loading={loading} />
          <StatCard label="Features Tracked" value={stats.features} loading={loading} />
        </div>

        {/* Agent Pipeline */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-1">The Agent Chain</h2>
          <p className="text-sm text-gray-400 mb-6">
            Each agent feeds context to the next. Click any agent to explore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentChain.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      {loading ? (
        <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-white">{value}</p>
      )}
    </div>
  );
}

function AgentCard({ agent, index }: { agent: NovaAgent; index: number }) {
  const colors = agentColors[agent.color] ?? agentColors.blue!;
  const isClickable = agent.route !== null;

  const content = (
    <div
      className={`relative rounded-xl border p-5 transition-all ${
        isClickable
          ? `${colors.border} hover:border-opacity-60 cursor-pointer hover:shadow-lg hover:shadow-${agent.color}-500/5`
          : "border-gray-800 opacity-60"
      } bg-gray-900`}
    >
      {/* Phase + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.badge} text-white`}>
            {agent.phase}
          </span>
          <span className={`text-sm font-semibold ${colors.text}`}>
            {agent.title}
          </span>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Role */}
      <p className="text-xs text-gray-500 mb-2">{agent.role}</p>

      {/* Summary */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4">
        {agent.summary}
      </p>

      {/* Capabilities preview */}
      <div className="flex flex-wrap gap-1.5">
        {agent.capabilities.slice(0, 3).map((cap, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
          >
            {cap.length > 40 ? cap.slice(0, 37) + "..." : cap}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
            +{agent.capabilities.length - 3} more
          </span>
        )}
      </div>

      {/* Flow connector */}
      {index < agentChain.length - 1 && (
        <div className="hidden lg:block absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </div>
      )}
    </div>
  );

  if (isClickable && agent.route) {
    return <Link href={agent.route}>{content}</Link>;
  }

  return content;
}

function StatusBadge({ status }: { status: NovaAgent["status"] }) {
  const styles = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    configured: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "coming-soon": "bg-gray-800 text-gray-500 border-gray-700",
  };
  const labels = {
    active: "Active",
    configured: "Configured",
    "coming-soon": "Coming Soon",
  };

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
