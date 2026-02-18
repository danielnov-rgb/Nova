// Nova Agent Chain — Single source of truth for agent metadata across admin pages.
// Derived from the showcase content (together-report/app/showcase/_data/nova-content.ts).

export interface NovaAgent {
  id: string;
  phase: string;
  title: string;
  role: string;
  color: string;
  summary: string;
  capabilities: string[];
  route: string | null;
  status: "active" | "configured" | "coming-soon";
}

export const novaIdentity = {
  name: "Nova",
  tagline: "Enterprise AI for Product Development",
  subtitle:
    "The AI orchestration layer that transforms how teams build modern SaaS platforms",
  oneLiner:
    "Nova coordinates specialized AI agents across the entire product lifecycle, from understanding your business strategy to shipping features, measuring outcomes, and continuously improving based on real data.",
};

export const agentChain: NovaAgent[] = [
  {
    id: "strategy",
    phase: "01",
    title: "Strategy Agent",
    role: "Business Strategy Consultant",
    color: "blue",
    summary:
      "Ingests and reasons about the client's entire business context: objectives, competitive advantages, business model, KPIs, and terminology.",
    capabilities: [
      "Business model and competitive advantage mapping",
      "KPI framework and objective documentation",
      "Terminology glossary so Nova speaks your language",
      "Strategic gap detection (missing north star, unclear KPIs)",
      "New team member onboarding context",
      "Continuous alignment that flags when work drifts from strategy",
    ],
    route: "/admin/onboarding",
    status: "active",
  },
  {
    id: "research",
    phase: "02",
    title: "Research Agent",
    role: "User Research & Market Intelligence Analyst",
    color: "purple",
    summary:
      "Conducts research at scale through AI-powered analysis and by equipping human researchers with tools to gather real-world insights.",
    capabilities: [
      "AI-simulated interviews at scale",
      "CRM-style assistant for human researchers",
      "Interview script generation tailored to domain",
      "Transcript ingestion and insight synthesis",
      "Macro/micro economic indicators",
      "Competitive landscape analysis",
    ],
    route: "/admin/audience",
    status: "active",
  },
  {
    id: "discovery",
    phase: "03",
    title: "Discovery & Prioritization",
    role: "Problem Analyst & Democratic Facilitator",
    color: "primary",
    summary:
      "Surfaces problems from research, enriches them with 11-dimension AI scoring, and facilitates team-wide prioritization through quadratic voting.",
    capabilities: [
      "11-dimension AI scoring with justification and source tracking",
      "Structured evidence trails with user quotes, surveys, analytics",
      "Quadratic voting with role-based credit allocation",
      "Group-based consensus and conflict analysis",
      "Dynamic weighting profiles for different strategic lenses",
      "Import from CSV, Excel, or AI-assisted discovery",
    ],
    route: "/admin/problems",
    status: "active",
  },
  {
    id: "solution",
    phase: "04",
    title: "Solution Architecture Agent",
    role: "Product Architect & Validation Planner",
    color: "cyan",
    summary:
      "Designs solutions aligned with competitive advantage and technical architecture, then builds the evidence trail for each.",
    capabilities: [
      "Solution design aligned to competitive advantage + system architecture",
      "Validation planning for how to test before full build",
      "Evidence trail: problem → research → votes → solution",
      "Kanban-style backlog with full traceability",
      "Assumption tracking and validation",
      "Solution-to-feature decomposition",
    ],
    route: "/admin/solutions",
    status: "active",
  },
  {
    id: "engineering",
    phase: "05",
    title: "Engineering Agents",
    role: "Full-Stack Development Partner",
    color: "green",
    summary:
      "Ingests the codebase, builds coded solutions (POC or production), injects analytics, writes tests, opens PRs, and integrates with CI/CD.",
    capabilities: [
      "Git repo ingestion and deep codebase understanding",
      "POC and production-grade feature development",
      "Analytics instrumentation injected automatically",
      "Automated PR workflows with review response",
      "Auto-generated documentation, ERDs, BRDs, PRDs",
      "AI Tool Factory for production microservices",
    ],
    route: "/admin/projects",
    status: "active",
  },
  {
    id: "design",
    phase: "06",
    title: "Design System Agents",
    role: "Design System Architect & Iteration Engine",
    color: "pink",
    summary:
      "Ports design systems from Figma, builds a frontend component kit, and iterates on designs based on real performance data.",
    capabilities: [
      "Figma-to-code automation following exact design tokens",
      "Frontend component kit generation",
      "Performance data feedback to designers",
      "A/B variant generation within design system boundaries",
      "Design drift detection with Figma vs code auditing",
      "Component propagation: update once, push everywhere",
    ],
    route: null,
    status: "coming-soon",
  },
  {
    id: "analytics",
    phase: "07",
    title: "Astrolytics Platform",
    role: "Product Analytics & Experimentation Engine",
    color: "amber",
    summary:
      "Full product analytics comparable to PostHog, Amplitude, or Mixpanel — deeply integrated with the intelligence pipeline.",
    capabilities: [
      "Event trends with multi-series comparison",
      "Funnel analysis with conversion and drop-off",
      "Retention cohorts with heatmap visualization",
      "User path analysis (Sankey diagrams)",
      "Session replay with event timeline overlay",
      "Feature flags, A/B experiments, surveys",
    ],
    route: "/astrolytics",
    status: "active",
  },
  {
    id: "growth",
    phase: "08",
    title: "Growth & Forecasting Engine",
    role: "Acquisition Strategist & Financial Modeler",
    color: "emerald",
    summary:
      "Extends analytics into the full acquisition funnel (CAC, LTV, ad optimization) and builds living financial forecasts.",
    capabilities: [
      "CAC tracking across acquisition channels",
      "LTV modeling and cohort-based revenue analysis",
      "Google Ads integration for closed-loop optimization",
      "Internal feature promotion targeting",
      "Financial projections that self-correct against real data",
      "Forecast vs actual dashboards",
    ],
    route: null,
    status: "coming-soon",
  },
  {
    id: "intelligence",
    phase: "09",
    title: "Intelligence Loop",
    role: "Continuous Improvement Orchestrator",
    color: "rose",
    summary:
      "Connects everything: as features accumulate real-world data, Nova suggests improvements, reprioritizes the backlog, and orchestrates agents to execute.",
    capabilities: [
      "Feature-level intelligence accumulating context over time",
      "Backlog reprioritization based on real outcomes",
      "Cross-feature pattern detection and optimization",
      "Automated experiment proposals with approval gates",
      "Anomaly detection and real-time alerting",
      "Insights fed back to Research and Strategy agents",
    ],
    route: null,
    status: "coming-soon",
  },
];

export function getAgent(id: string): NovaAgent | undefined {
  return agentChain.find((a) => a.id === id);
}

// Color mapping for Tailwind classes
export const agentColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", badge: "bg-blue-500" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", badge: "bg-purple-500" },
  primary: { bg: "bg-primary-500/10", text: "text-primary-400", border: "border-primary-500/30", badge: "bg-primary-500" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", badge: "bg-cyan-500" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", badge: "bg-green-500" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30", badge: "bg-pink-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", badge: "bg-amber-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", badge: "bg-emerald-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", badge: "bg-rose-500" },
};
