"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import {
  novaIdentity,
  autonomy,
  agentChain,
  enterprise,
  leadershipValue,
  differentiators,
} from "./_data/nova-content";

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e?.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Animate({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const Divider = () => (
  <div className="max-w-5xl mx-auto px-4">
    <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
  </div>
);

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="inline-block px-3 py-1 text-xs font-medium text-primary-400 bg-primary-500/10 border border-primary-500/30 rounded-full mb-4">
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------

function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => setVis(true), []);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />

      <div
        className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ${
          vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Leadership Knowledge Pack &middot; February 2026
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text text-transparent">
            {novaIdentity.name}
          </span>
        </h1>

        <p className="text-2xl md:text-3xl text-white font-semibold mb-4">
          {novaIdentity.tagline}
        </p>

        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-4">
          {novaIdentity.subtitle}
        </p>

        <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
          {novaIdentity.oneLiner}
        </p>

        {/* Scroll indicator */}
        <div className="animate-bounce text-gray-600">
          <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. The Problem
// ---------------------------------------------------------------------------

function ProblemSection() {
  return (
    <section id="problem" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Animate>
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {novaIdentity.problem.headline}
          </h2>
        </Animate>

        <div className="space-y-6">
          {novaIdentity.problem.paragraphs.map((p, i) => (
            <Animate key={i} delay={i * 150}>
              <p className="text-lg text-gray-400 leading-relaxed">{p}</p>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. The Autonomy Spectrum
// ---------------------------------------------------------------------------

const modeColors = ["from-green-500 to-green-600", "from-primary-500 to-primary-600", "from-amber-500 to-amber-600"];

function AutonomySection() {
  return (
    <section id="autonomy" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Animate className="text-center mb-12">
          <SectionLabel>Configurable</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {autonomy.headline}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {autonomy.description}
          </p>
        </Animate>

        {/* Spectrum bar */}
        <Animate delay={200}>
          <div className="relative mb-12">
            <div className="h-2 bg-gradient-to-r from-green-500 via-primary-500 to-amber-500 rounded-full" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-green-400">Fully Autonomous</span>
              <span className="text-xs text-amber-400">Human-Led</span>
            </div>
          </div>
        </Animate>

        <div className="grid md:grid-cols-3 gap-4">
          {autonomy.modes.map((mode, i) => (
            <Animate key={mode.label} delay={i * 100}>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-full">
                <div
                  className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${modeColors[i]} text-white text-xs font-semibold mb-4`}
                >
                  {mode.label}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. The Agent Chain — the core narrative
// ---------------------------------------------------------------------------

const chainColors: Record<string, { border: string; badge: string; text: string }> = {
  blue:    { border: "border-blue-500/30",    badge: "bg-blue-500/20 text-blue-400",    text: "text-blue-400" },
  purple:  { border: "border-purple-500/30",  badge: "bg-purple-500/20 text-purple-400",  text: "text-purple-400" },
  primary: { border: "border-primary-500/30", badge: "bg-primary-500/20 text-primary-400", text: "text-primary-400" },
  cyan:    { border: "border-cyan-500/30",    badge: "bg-cyan-500/20 text-cyan-400",    text: "text-cyan-400" },
  green:   { border: "border-green-500/30",   badge: "bg-green-500/20 text-green-400",   text: "text-green-400" },
  pink:    { border: "border-pink-500/30",    badge: "bg-pink-500/20 text-pink-400",    text: "text-pink-400" },
  amber:   { border: "border-amber-500/30",   badge: "bg-amber-500/20 text-amber-400",   text: "text-amber-400" },
  emerald: { border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-400", text: "text-emerald-400" },
  rose:    { border: "border-rose-500/30",    badge: "bg-rose-500/20 text-rose-400",    text: "text-rose-400" },
};

function AgentCard({
  agent,
  index,
}: {
  agent: (typeof agentChain)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = (chainColors[agent.color] ?? chainColors.primary)!;

  return (
    <Animate delay={index * 60}>
      <div className={`relative bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden hover:${colors.border} transition-colors`}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            {/* Phase number */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center font-bold text-lg`}>
              {agent.phase}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-white">{agent.title}</h3>
              </div>
              <p className={`text-sm ${colors.text} mb-2`}>{agent.role}</p>
              <p className="text-gray-400 leading-relaxed text-sm">
                {agent.summary}
              </p>
            </div>

            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 mt-1 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expandable detail */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 md:px-8 pb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />

            <p className="text-gray-300 leading-relaxed mb-6">
              {agent.description}
            </p>

            <div className="grid md:grid-cols-2 gap-2.5">
              {agent.capabilities.map((cap) => (
                <div
                  key={cap}
                  className="flex items-start gap-3 bg-gray-800/40 border border-gray-700/40 rounded-lg p-3"
                >
                  <div className={`w-5 h-5 rounded-full ${colors.badge} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context flow indicator */}
        {index < agentChain.length - 1 && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Animate>
  );
}

function AgentChainSection() {
  return (
    <section id="agents" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Animate className="text-center mb-16">
          <SectionLabel>The Agent Chain</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            9 Specialized Agents, One Continuous Pipeline
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Each agent feeds context to the next. Strategy informs Research.
            Research informs Prioritization. Priorities drive Solutions. Solutions
            become Code. Code gets Measured. Measurements drive Improvement.
          </p>
        </Animate>

        <div className="space-y-6">
          {agentChain.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. What Makes Nova Different
// ---------------------------------------------------------------------------

function Differentiators() {
  return (
    <section id="different" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Animate className="text-center mb-16">
          <SectionLabel>Why Nova</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Makes This Different
          </h2>
        </Animate>

        <div className="grid md:grid-cols-2 gap-4">
          {differentiators.map((d, i) => (
            <Animate key={d.title} delay={i * 80}>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors h-full">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {d.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {d.description}
                </p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. For Your Team — role value props
// ---------------------------------------------------------------------------

const roleIcons: Record<string, string> = {
  strategy: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  research: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  design: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  development: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  qa: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  marketing: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
};

const roleColorMap: Record<string, string> = {
  strategy: "primary",
  research: "purple",
  design: "pink",
  development: "green",
  qa: "cyan",
  marketing: "amber",
};

function RoleCards() {
  const roles = Object.entries(leadershipValue) as [
    string,
    { role: string; headline: string; points: string[] }
  ][];

  return (
    <section id="roles" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Animate className="text-center mb-16">
          <SectionLabel>For Your Team</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Nova Means for Each Role
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Nova delivers specific value to every function in the product development organization.
          </p>
        </Animate>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(([key, val], i) => {
            const color = roleColorMap[key] ?? "primary";
            const icon = roleIcons[key] ?? roleIcons.strategy;
            const colors = (chainColors[color] ?? chainColors.primary)!;
            return (
              <Animate key={key} delay={i * 100}>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${colors.badge} flex items-center justify-center`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{val.role}</h3>
                  </div>

                  <p className={`${colors.text} font-medium text-sm mb-4 leading-snug`}>
                    {val.headline}
                  </p>

                  <ul className="space-y-2 flex-1">
                    {val.points.slice(0, 4).map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-xs text-gray-400">
                        <svg className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Animate>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7. Enterprise
// ---------------------------------------------------------------------------

function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Animate className="text-center mb-16">
          <SectionLabel>Enterprise</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {enterprise.headline}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {enterprise.description}
          </p>
        </Animate>

        <div className="grid md:grid-cols-2 gap-4">
          {enterprise.capabilities.map((cap, i) => (
            <Animate key={cap.title} delay={i * 100}>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 h-full">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{cap.description}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8. CTA
// ---------------------------------------------------------------------------

function CTA() {
  const { ref, visible } = useInView();

  return (
    <section className="py-24 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
          <div className="relative bg-gray-900/90 backdrop-blur border border-gray-700/50 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Talk?
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Let&apos;s discuss how Nova can transform your team&apos;s product
              development process.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white font-semibold">Daniel Novitzkas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page assembly
// ---------------------------------------------------------------------------

export default function ShowcasePage() {
  return (
    <main className="bg-gray-950 min-h-screen">
      <Hero />
      <Divider />
      <ProblemSection />
      <Divider />
      <AutonomySection />
      <Divider />
      <AgentChainSection />
      <Divider />
      <Differentiators />
      <Divider />
      <RoleCards />
      <Divider />
      <EnterpriseSection />
      <Divider />
      <CTA />
      <div className="h-24" />
    </main>
  );
}
