// Nova Leadership Knowledge Pack - Master Content File
// Single source of truth for communicating Nova to Accenture leadership.
// ---
// VERSION: Draft 3 - Reframed as AI orchestration layer with agent chain narrative
// Sources: Nova platform, Astrolytics, report ads, verbal context sessions

// =============================================================================
// WHAT NOVA IS
// =============================================================================

export const novaIdentity = {
  name: "Nova",
  tagline: "Enterprise AI for Product Development",
  subtitle: "The AI orchestration layer that transforms how teams build modern SaaS platforms",
  oneLiner:
    "Nova coordinates specialized AI agents across the entire product lifecycle, from understanding your business strategy to shipping features, measuring outcomes, and continuously improving based on real data. Every agent is configurable: fully autonomous, human-assisted, or anywhere in between.",

  // Why this matters
  problem: {
    headline: "Product Development Is Broken at Scale",
    paragraphs: [
      "Enterprise teams spend more time coordinating than building. Strategy lives in slide decks. Research happens in silos. Priorities are debated in meetings where the loudest voice wins. Features ship without instrumentation, so nobody knows if they worked. Knowledge leaves when people leave.",
      "The tools exist in pieces: Jira for tickets, Figma for design, PostHog for analytics, Google Sheets for prioritization, Confluence for documentation. But nothing connects the full chain from 'why are we building this' to 'did it actually work.'",
      "Nova replaces that fragmentation with a single AI-powered orchestration layer where every stage feeds the next, and every decision is backed by evidence.",
    ],
  },
};

// =============================================================================
// THE AUTONOMY SPECTRUM
// =============================================================================

export const autonomy = {
  headline: "You Control How Much AI Does",
  description:
    "Nova isn't a black box that replaces your team. It's a configurable system where you decide how autonomous each agent should be, per task, per team, per project. The same agent can run 500 synthetic interviews autonomously AND generate interview scripts for your human researchers to use in person.",
  modes: [
    {
      label: "Fully Autonomous",
      description:
        "Agents execute end-to-end with human approval gates at key checkpoints. Best for: routine analysis, code generation, test suites, documentation.",
    },
    {
      label: "Agent-Assisted",
      description:
        "Agents do the heavy lifting and present recommendations. Humans review, adjust, and approve. Best for: prioritization, solution design, experiment proposals.",
    },
    {
      label: "Human-Led",
      description:
        "Agents act as intelligent assistants, generating scripts, guides, templates, and tools that humans execute. Best for: user research, stakeholder interviews, strategic decisions.",
    },
  ],
};

// =============================================================================
// THE AGENT CHAIN
// This is the core narrative. Each agent feeds context to the next.
// =============================================================================

export const agentChain = [
  {
    id: "strategy",
    phase: "01",
    title: "Strategy Agent",
    role: "Business Strategy Consultant",
    color: "blue",
    summary:
      "Ingests and reasons about the client's entire business context: objectives, competitive advantages, business model, KPIs, target customers, expansion plans, and terminology.",
    description:
      "Every downstream agent inherits this context. The Strategy Agent doesn't just store information. It identifies gaps in strategic clarity, maps features to business objectives, and ensures all subsequent work is aligned with the business reality. New team members get instant, deep understanding of the platform. Knowledge doesn't leave when people do.",
    capabilities: [
      "Business model and competitive advantage mapping",
      "KPI framework and objective documentation",
      "Terminology glossary so Nova speaks the client's language",
      "Strategic gap detection (missing north star, unclear KPIs)",
      "New team member onboarding that walks them through everything",
      "Continuous alignment that flags when work drifts from strategy",
    ],
  },
  {
    id: "research",
    phase: "02",
    title: "Research Agent",
    role: "User Research & Market Intelligence Analyst",
    color: "purple",
    summary:
      "Takes strategic context and conducts research at scale, both through AI-powered analysis and by equipping human researchers with the tools to gather real-world insights.",
    description:
      "The Research Agent operates across two modes. Autonomously, it analyzes micro and macro economic indicators, sector benchmarks, pricing data, conversion rates, time-to-first-value metrics, and competitive density. In human-assisted mode, it builds the entire research infrastructure: CRM-style tools for outreach, targeted prospect lists, outbound messaging, interview scripts tailored to the client's domain, conversation guides, evidence collection frameworks, and transcript processing. Everything feeds into uncovering problems and opportunities worth tackling.",
    capabilities: [
      "AI-simulated interviews at scale (thousands of synthetic user conversations)",
      "CRM-style assistant for human researchers: prospect lists, outbound messaging, follow-ups",
      "Interview script generation tailored to the client's domain and objectives",
      "Conversation guides with evidence collection frameworks",
      "Transcript ingestion and insight synthesis",
      "Macro/micro economic indicators relevant to product strategy",
      "Sector benchmarks: pricing, conversion rates, CAC, time-to-value, retention thresholds",
      "Early adopter community building and engagement",
      "Competitive landscape analysis and solution mapping",
    ],
  },
  {
    id: "discovery",
    phase: "03",
    title: "Discovery & Prioritization",
    role: "Problem Analyst & Democratic Facilitator",
    color: "primary",
    summary:
      "Surfaces problems from research, enriches them with AI scoring, and facilitates team-wide prioritization through quadratic voting.",
    description:
      "Problems flow in from research (human and synthetic). Each problem gets AI enrichment across 11 scoring dimensions: severity, frequency, willingness to pay, retention impact, strategic fit, feasibility, and more. Then the broader team weighs in through quadratic voting: stakeholders allocate credits to the problems they care about most, with quadratic cost scaling to prevent any single voice from dominating. Results break down by voter group with consensus and conflict analysis, giving leadership a defensible, data-backed priority list.",
    capabilities: [
      "11-dimension AI scoring with justification and source tracking",
      "Structured evidence trails including user quotes, survey data, support tickets, and analytics",
      "Quadratic voting with role-based credit allocation",
      "Group-based consensus and conflict analysis",
      "Dynamic weighting profiles to see priorities through different strategic lenses",
      "Import from CSV, Excel, or AI-assisted discovery",
      "Problem clustering with vector similarity and 3D visualization",
    ],
  },
  {
    id: "solution",
    phase: "04",
    title: "Solution Architecture Agent",
    role: "Product Architect & Validation Planner",
    color: "cyan",
    summary:
      "Designs solutions aligned with both the competitive advantage (from Strategy) and the technical architecture (from codebase analysis), then builds the evidence trail for each.",
    description:
      "Once problems are prioritized, this agent proposes solutions that fit the client's system architecture and strategic direction. But it goes further than design. It identifies ways to validate each solution before full build, constructs the evidence trail (why the problem exists, how it persists, who it affects), and even generates the messaging: if we had to advertise this solution to affected users, what would we say? Solutions are tracked across a Kanban-style product backlog with full traceability back to the problem, research, and votes that justified them.",
    capabilities: [
      "Solution design aligned to competitive advantage + system architecture",
      "Validation planning for how to test before full build",
      "Evidence trail construction: problem → research → votes → solution → why it matters",
      "User messaging and value proposition generation per solution",
      "Kanban-style backlog with full problem-to-solution traceability",
      "Assumption tracking for what we're betting on and what needs validation",
      "Solution-to-feature decomposition and sprint planning",
    ],
  },
  {
    id: "engineering",
    phase: "05",
    title: "Engineering Agents",
    role: "Full-Stack Development Partner",
    color: "green",
    summary:
      "Ingests the client's codebase, builds coded solutions (POC or production), injects analytics, writes tests, opens PRs, and integrates with CI/CD.",
    description:
      "Nova can ingest an entire git repository, deeply understand the codebase architecture, and then build. This ranges from rapid POC prototypes to production-grade features, complete with analytics instrumentation baked in from day one. The agents write code, create branches, open PRs with full context, respond to review comments, generate documentation, database schemas, ERDs, BRDs, and PRDs. They write test suites, run simulated users through flows to test edge cases, and integrate with CI/CD for auto-deployment. Nova can also build production AI-powered tools as complete microservices with APIs, OAuth2 security, multi-model orchestration, and self-documenting specs.",
    capabilities: [
      "Git repo ingestion and deep codebase understanding",
      "POC and production-grade feature development",
      "Analytics instrumentation injected automatically (unlocks Astrolytics)",
      "Automated PR workflows: code, branch, PR, review response, deploy",
      "Auto-generated documentation, ERDs, BRDs, PRDs",
      "Test suite generation for unit, integration, and E2E",
      "Simulated user testing and edge case detection",
      "AI Tool Factory for production microservices in hours with APIs, security, and multi-model orchestration",
      "Database schema generation (PostgreSQL, MongoDB, or enterprise stack)",
      "CI/CD integration with merged PRs auto-deploying",
    ],
  },
  {
    id: "design",
    phase: "06",
    title: "Design System Agents",
    role: "Design System Architect & Iteration Engine",
    color: "pink",
    summary:
      "Ports design systems from Figma, builds a frontend component kit, constructs solutions with those components, and iterates on designs based on real performance data.",
    description:
      "Nova creates a bidirectional bridge between Figma and code. It reads the design system, generates production-ready React components following exact design tokens, and builds features using them. But it doesn't stop at translation. As Astrolytics captures how users interact with designs, Nova feeds performance insights back to the design team: which layouts perform better, how users navigate, where they struggle. It can generate A/B variants while maintaining design system compliance, detect drift between Figma and code, and propagate approved changes across all components. Designers control how much creative latitude Nova has.",
    capabilities: [
      "Figma-to-code automation following exact design tokens",
      "Frontend component kit generation from design system",
      "Build solutions using the client's own components",
      "Performance data feedback to designers on what's working and what isn't",
      "A/B variant generation within design system boundaries",
      "Design drift detection with Figma vs code auditing",
      "Component propagation: update once, push everywhere",
      "Documentation sync so component docs stay current automatically",
      "Configurable creative boundaries where designers control Nova's latitude",
    ],
  },
  {
    id: "analytics",
    phase: "07",
    title: "Astrolytics Platform",
    role: "Product Analytics & Experimentation Engine",
    color: "amber",
    summary:
      "Full product analytics platform, comparable to PostHog, Amplitude, or Mixpanel, deeply integrated with the intelligence pipeline so feature performance feeds back into scoring and prioritization.",
    description:
      "Every feature that ships with Nova's instrumentation feeds into Astrolytics, a complete analytics platform with event trends, funnel analysis, retention cohorts, user paths, lifecycle analysis, session replay, feature flags, A/B experiments, surveys, people profiles, behavioral cohorts, and a SQL explorer. The key difference from standalone analytics tools: Astrolytics is connected to Nova's intelligence layer, so feature performance automatically informs prioritization, experiment design, and improvement suggestions.",
    capabilities: [
      "Event trends with multi-series comparison and property breakdowns",
      "Funnel analysis with conversion, drop-off, and median time per step",
      "Retention cohorts with heatmap visualization",
      "User path analysis (Sankey diagrams)",
      "Lifecycle decomposition: new, returning, resurrected, dormant",
      "Session replay with event timeline overlay",
      "Feature flags with percentage and rule-based targeting",
      "A/B experiments with statistical significance tracking",
      "Surveys including NPS, CSAT, and open text",
      "People profiles and behavioral cohort builder",
      "SQL Explorer (NovaQL) for custom queries",
      "Plugin SDK and Agent CLI for automatic instrumentation",
    ],
  },
  {
    id: "growth",
    phase: "08",
    title: "Growth & Forecasting Engine",
    role: "Acquisition Strategist & Financial Modeler",
    color: "emerald",
    summary:
      "Extends analytics into the full acquisition funnel (CAC, LTV, ad optimization, landing page performance) and builds living financial forecasts that self-correct against real data.",
    description:
      "Nova doesn't stop at product analytics. It extends into the acquisition funnel: tracking cost of customer acquisition across channels, lifetime value modeling, ad keyword targeting, landing page optimization, and internal feature promotion, pushing the right functionality to the right users at the right time. It integrates with Google's ad tooling so marketing operates with closed-loop data. Early validation testing generates insights that feed directly into the marketing team's campaigns. Nova also builds financial forecasts (free-to-paid conversion modeling, growth rate projections, CAC/LTV ratios) that update continuously as Astrolytics captures real behavior. Strategy and finance get living projections, not static spreadsheets.",
    capabilities: [
      "CAC tracking across acquisition channels",
      "LTV modeling and cohort-based revenue analysis",
      "Ad funnel tracking across keywords, landing pages, and conversion attribution",
      "Google Ads integration for closed-loop campaign optimization",
      "Internal feature promotion targeting the right functionality to the right user at the right time",
      "Usage forecasting across free users, paid users, growth rate, and conversion rate",
      "Financial projections that self-correct against actual analytics",
      "Forecast vs actual dashboards for strategy and finance teams",
      "Early validation insights that feed marketing campaigns",
    ],
  },
  {
    id: "intelligence",
    phase: "09",
    title: "Intelligence Loop",
    role: "Continuous Improvement Orchestrator",
    color: "rose",
    summary:
      "Connects everything: as features accumulate real-world data, Nova suggests improvements, reprioritizes the backlog, and orchestrates agents to execute, closing the loop from outcome back to strategy.",
    description:
      "This is where Nova's full power emerges. The Intelligence Loop sits between the client's live platform, Astrolytics, and Nova's project management layer. As each feature builds context (usage data, user feedback, performance metrics, financial outcomes) Nova can suggest targeted improvements, reprioritize the entire backlog based on real outcomes, and orchestrate further agents to execute. It identifies patterns across features, surfaces anomalies, proposes experiments, and feeds insights back to the Research and Strategy agents. The product gets smarter with every cycle.",
    capabilities: [
      "Feature-level intelligence where each feature accumulates its own context over time",
      "Backlog reprioritization based on real outcomes, not original estimates",
      "Cross-feature pattern detection and optimization",
      "Automated experiment proposals with human approval gates",
      "Anomaly detection and real-time alerting",
      "Insights fed back to Research and Strategy agents (closed loop)",
      "Agent orchestration to coordinate multiple agents for complex improvements",
      "Integration with external agents and NPC testing frameworks",
    ],
  },
];

// =============================================================================
// ENTERPRISE DEPLOYMENT
// =============================================================================

export const enterprise = {
  headline: "Enterprise-Grade from Day One",
  description:
    "Nova is designed for enterprise teams. It deploys to your infrastructure, runs your models, and keeps your data under your control.",
  capabilities: [
    {
      title: "Client-Hosted Deployment",
      description:
        "Nova deploys to client-specific servers and infrastructure. No data ever leaves your environment. No data is consumed by Nova's central systems.",
    },
    {
      title: "Bring Your Own Models",
      description:
        "Run client-hosted models within Nova. Use frontier models for general tasks, local models for sensitive data, or go fully offline. Multi-model orchestration built in.",
    },
    {
      title: "Security & Compliance",
      description:
        "OAuth2, JWT with RBAC, rate limiting, audit logging, PII masking. Full compliance with enterprise security requirements.",
    },
    {
      title: "Clear IP Boundaries",
      description:
        "All designs, code, features, and content created for the client belong to the client. Nova's platform, agents, and methodologies are licensed. Clean separation.",
    },
  ],
};

// =============================================================================
// FOR YOUR TEAM - role-specific value props
// =============================================================================

export const leadershipValue = {
  strategy: {
    role: "Head of Strategy",
    headline: "Every decision backed by evidence, every priority defensible",
    points: [
      "Strategy Agent internalizes business model, KPIs, and competitive advantages, surfacing gaps in strategic clarity",
      "11-dimension AI scoring replaces gut-feel prioritization with data",
      "Quadratic voting creates mathematical consensus across stakeholders",
      "Dynamic weighting profiles show how priorities shift under different strategic lenses",
      "Living financial forecasts that self-correct against real usage data",
      "Full decision audit trail where every priority links back to research, evidence, and votes",
    ],
  },
  research: {
    role: "Research Team",
    headline: "Research at scale, AI-powered and human-powered, working together",
    points: [
      "AI conducts thousands of synthetic interviews while human researchers go deep on critical segments",
      "CRM-style tools for outreach: prospect lists, outbound messaging, interview scripts, conversation guides",
      "Transcript processing and insight synthesis that turns conversations into structured findings",
      "Macro/micro economic analysis: pricing benchmarks, conversion rates, time-to-value metrics",
      "Early adopter community building and engagement tooling",
      "Every insight structured for the right audience: design, product, engineering, marketing",
    ],
  },
  design: {
    role: "Head of Design",
    headline: "Your design system becomes living infrastructure that gets smarter",
    points: [
      "Figma-to-code automation producing production-ready components following your exact design tokens",
      "Real performance data flows back to designers: which layouts work, how users navigate, where they struggle",
      "A/B variant generation within design system boundaries to test without breaking consistency",
      "Design drift detection with automated Figma vs code auditing",
      "Component propagation where you approve a change once and it pushes everywhere",
      "You control how much creative latitude Nova has with configurable boundaries",
    ],
  },
  development: {
    role: "Software Development",
    headline: "Ship features with docs, tests, and analytics from day one",
    points: [
      "Nova ingests your git repo and deeply understands the codebase architecture",
      "Builds POC or production-grade features with your components and design system",
      "Analytics instrumentation injected automatically with no separate tracking sprint",
      "Auto-generated documentation, ERDs, BRDs, database schemas, and test suites",
      "Automated PR workflows: code, branch, PR with full context, review responses",
      "AI Tool Factory for production microservices with APIs, security, and multi-model orchestration in hours",
    ],
  },
  qa: {
    role: "QA & Testing",
    headline: "Test suites generated alongside code, simulated users find edge cases",
    points: [
      "Unit, integration, and E2E tests written as features are built, not as an afterthought",
      "Simulated users run through every flow to detect edge cases before real users hit them",
      "Nova taps into external testing agents and NPC frameworks for comprehensive coverage",
      "Session replay shows exactly what users experience for debugging UX issues from real sessions",
      "Continuous regression testing as features evolve and improve",
      "Quality built in from the start, not retrofitted after bugs are found",
    ],
  },
  marketing: {
    role: "Head of Marketing",
    headline: "Closed-loop system from user insight to campaign optimization to revenue",
    points: [
      "Full analytics: funnels, retention, paths, lifecycle, NPS, session replay, everything in one place",
      "CAC tracking across channels, LTV modeling, ad keyword optimization with Google Ads integration",
      "Landing page performance and conversion attribution so you know what's actually driving growth",
      "Internal feature promotion that pushes the right functionality to the right users at the right time",
      "Early validation insights feed directly into campaign messaging and positioning",
      "Usage forecasting with living financial models and projections that update against real data",
    ],
  },
};

// =============================================================================
// WHAT MAKES NOVA DIFFERENT (concise differentiators)
// =============================================================================

export const differentiators = [
  {
    title: "One Platform, Full Lifecycle",
    description:
      "From business strategy through research, prioritization, build, measurement, and continuous improvement. One system where every stage feeds the next.",
  },
  {
    title: "Configurable Autonomy",
    description:
      "Not a black box. Every agent can be fully autonomous, human-assisted, or human-led. You control the spectrum per task, per team, per project.",
  },
  {
    title: "Agents That Inherit Context",
    description:
      "Each agent passes context forward. The Engineering Agent knows WHY a feature exists because the Strategy, Research, and Prioritization agents built the evidence trail.",
  },
  {
    title: "Evidence Everywhere",
    description:
      "Every decision carries its trail, from the research that surfaced the problem, through the votes that prioritized it, to the analytics that measure it. No more 'why did we build this?'",
  },
  {
    title: "Analytics Built In, Not Bolted On",
    description:
      "Features ship instrumented. Astrolytics captures performance from day one. No separate tracking sprint, no analytics tech debt.",
  },
  {
    title: "Living Forecasts",
    description:
      "Financial and usage projections that self-correct against real data. Strategy works with living models, not static spreadsheets.",
  },
  {
    title: "Composable AI",
    description:
      "Nova orchestrates itself with any external agent, from testing NPCs to code analysis tools, frontier models, or client-hosted secure models. The ceiling is the ceiling of coordinated AI.",
  },
  {
    title: "Knowledge That Never Leaves",
    description:
      "Nova internalizes institutional knowledge: architecture, business model, strategic context. When people leave, the knowledge stays.",
  },
];
