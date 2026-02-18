// Nova Leadership Knowledge Pack — Role-Specific Content
// Each role gets a personalized value proposition page

export interface RoleContent {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  painPoints: { title: string; description: string }[];
  novaAnswers: { title: string; description: string; metric?: string }[];
  keyMetrics: { label: string; value: string; context: string }[];
  relevantFeatures: string[];
  callToAction: string;
}

export const roles: Record<string, RoleContent> = {
  strategy: {
    slug: "strategy",
    title: "Nova for Strategy Leaders",
    subtitle: "Data-driven prioritization that cuts through opinion-based debates",
    color: "primary",
    painPoints: [
      {
        title: "Prioritization Paralysis",
        description: "Dozens of competing initiatives with no objective way to rank them. Every stakeholder thinks their problem is most urgent.",
      },
      {
        title: "Slow Feedback Loops",
        description: "Months between strategic decisions and measurable outcomes. By the time you learn what worked, the landscape has changed.",
      },
      {
        title: "Siloed Intelligence",
        description: "Market research, user feedback, and competitive analysis live in separate documents. No single source of strategic truth.",
      },
      {
        title: "Resource Misallocation",
        description: "Without clear priority signals, teams spread thin across too many initiatives rather than focusing on highest-impact work.",
      },
    ],
    novaAnswers: [
      {
        title: "Quadratic Voting for Fair Prioritization",
        description: "Every stakeholder gets credits to distribute. Quadratic cost scaling prevents any single voice from dominating. You get a mathematically fair ranking.",
        metric: "11-dimension scoring per problem",
      },
      {
        title: "AI-Enriched Problem Analysis",
        description: "Raw problem statements are automatically enriched with impact, urgency, complexity, and innovation scores. Evidence is cited and structured.",
        metric: "Seconds, not weeks, per analysis",
      },
      {
        title: "Unified Intelligence Pipeline",
        description: "Competitors, market trends, audience data, and problem statements all flow through one platform. Research feeds directly into prioritization.",
      },
      {
        title: "6-8x Development Acceleration",
        description: "Once priorities are set, Nova's FDE model delivers solutions 6-8 times faster than traditional waterfall. Strategy translates to shipped product in weeks.",
        metric: "3 solutions delivered per month",
      },
    ],
    keyMetrics: [
      { label: "Acceleration", value: "6-8x", context: "faster than traditional development" },
      { label: "Solutions/Month", value: "3", context: "complete, validated deliverables" },
      { label: "POC Timeline", value: "3 weeks", context: "from zero to full platform" },
      { label: "Scoring Dimensions", value: "11", context: "per problem analysis" },
    ],
    relevantFeatures: ["quadratic-voting", "problem-enrichment", "research-intelligence"],
    callToAction: "See how Nova turns strategic priorities into shipped solutions",
  },

  design: {
    slug: "design",
    title: "Nova for Design Leaders",
    subtitle: "103 production-ready components in 3 weeks — without sacrificing quality",
    color: "cyan",
    painPoints: [
      {
        title: "Design-Development Gap",
        description: "Weeks lost in handoff cycles. Designs get misinterpreted, developers ask clarifying questions, and review rounds drag on.",
      },
      {
        title: "Design System Drift",
        description: "Components diverge from the design system as teams grow. Maintaining consistency across multiple teams and codebases is exhausting.",
      },
      {
        title: "Prototyping Speed",
        description: "High-fidelity prototypes take days or weeks. By the time you can test an idea, the strategic window may have moved.",
      },
      {
        title: "Scale Without Headcount",
        description: "The backlog of design work grows faster than you can hire. Every new product initiative needs UI, but design capacity is fixed.",
      },
    ],
    novaAnswers: [
      {
        title: "Inline Design-Development",
        description: "Requirements, design, and code happen in the same session. No handoff documents, no async review cycles. The designer and developer are the same flow.",
        metric: "Zero handoff delay",
      },
      {
        title: "103 Components in 3 Weeks",
        description: "A complete design system with 50+ semantic tokens, full light/dark mode, and consistent patterns — built during the POC period.",
        metric: "103 production components",
      },
      {
        title: "Figma MCP Integration",
        description: "Design-to-code workflow using Figma's MCP bridge. Design tokens translate directly to Tailwind configuration.",
      },
      {
        title: "Design System as Code",
        description: "Components, tokens, and patterns live in the codebase. Every component is a source of truth — no separate documentation to maintain.",
        metric: "50+ semantic tokens",
      },
    ],
    keyMetrics: [
      { label: "Components", value: "103", context: "production-ready UI components" },
      { label: "Design Tokens", value: "50+", context: "semantic color, type, spacing" },
      { label: "Go-Card Types", value: "11", context: "distinct interactive formats" },
      { label: "Theme Support", value: "Full", context: "light/dark with CSS custom properties" },
    ],
    relevantFeatures: ["automated-reports", "plugin-analytics"],
    callToAction: "See the design system and component library in action",
  },

  marketing: {
    slug: "marketing",
    title: "Nova for Marketing Leaders",
    subtitle: "Real-time analytics on every user interaction, without a data team",
    color: "purple",
    painPoints: [
      {
        title: "Analytics Blind Spots",
        description: "Page views and sign-ups only tell part of the story. You need feature-level engagement data, but instrumenting it requires engineering resources.",
      },
      {
        title: "Slow Insight Cycles",
        description: "Getting answers from data takes days or weeks. By the time a report lands on your desk, the campaign window has closed.",
      },
      {
        title: "User Journey Gaps",
        description: "You can see where users start and where they convert, but the middle is a black box. What features drive retention? What causes churn?",
      },
      {
        title: "Feedback Collection Friction",
        description: "Surveys have low response rates. In-app feedback requires custom development. User sentiment is guesswork.",
      },
    ],
    novaAnswers: [
      {
        title: "Drop-in Analytics SDK",
        description: "The Nova Plugin SDK tracks feature views, interactions, and completions with a single React wrapper. No custom instrumentation code needed.",
        metric: "Zero-config feature tracking",
      },
      {
        title: "Agent-Powered Discovery",
        description: "The Nova Agent CLI scans your codebase, discovers every page, form, and interactive component, and instruments them automatically.",
        metric: "One-command instrumentation",
      },
      {
        title: "Built-in Feedback Widget",
        description: "Star ratings and comments collected in context — floating, overlay, or contextual modes. No separate survey tool needed.",
      },
      {
        title: "Behavioral Analytics Pipeline",
        description: "Heat maps, user journey analysis, funnel understanding, behavioral segmentation, and predictive insights — all powered by the event stream.",
        metric: "5 analytics capabilities",
      },
    ],
    keyMetrics: [
      { label: "Event Types", value: "7", context: "view, interact, complete, error, exit, page, custom" },
      { label: "Analytics Modes", value: "5", context: "heat maps, journeys, funnels, segments, predictions" },
      { label: "Feedback Modes", value: "3", context: "floating, overlay, contextual" },
      { label: "Auto-Enrichment", value: "Full", context: "URL, user agent, referrer, timestamp" },
    ],
    relevantFeatures: ["plugin-analytics", "agent-cli"],
    callToAction: "See the analytics pipeline and feedback system live",
  },

  development: {
    slug: "development",
    title: "Nova for Developers",
    subtitle: "35,000+ lines of production code with a modern, well-architected stack",
    color: "green",
    painPoints: [
      {
        title: "Boilerplate Overhead",
        description: "Every new feature requires auth setup, API routes, data validation, error handling. 60% of dev time is infrastructure, not business logic.",
      },
      {
        title: "Integration Complexity",
        description: "Connecting AI services, payment systems, analytics, and third-party APIs creates a web of dependencies that's hard to test and maintain.",
      },
      {
        title: "SDK Fragmentation",
        description: "Analytics, feedback, feature flags — each requires a separate SDK with its own initialization, context providers, and event schemas.",
      },
      {
        title: "Documentation Debt",
        description: "API docs are outdated the day they're written. New team members spend weeks understanding the codebase because tribal knowledge isn't captured.",
      },
    ],
    novaAnswers: [
      {
        title: "Full-Stack Platform",
        description: "Next.js 15 frontend + NestJS 11 API + Prisma 7 ORM. Auth, RBAC, multi-tenancy, and analytics built-in. Start building features on day one.",
        metric: "80+ API endpoints ready",
      },
      {
        title: "Plugin SDK",
        description: "One SDK for analytics, feature tracking, and feedback. React hooks and components that drop into any app. Typed events, batched delivery, automatic enrichment.",
        metric: "npm install @nova/plugin",
      },
      {
        title: "Agent CLI",
        description: "Run `nova-agent discover .` to auto-detect your app's features. Run with `--instrument` to generate tracking code on a new git branch.",
        metric: "One-command setup",
      },
      {
        title: "Knowledge Base as Code",
        description: "All project knowledge lives in structured Markdown and TypeScript data files. AI agents can read and contribute. Documentation stays current because it's part of the build.",
        metric: "35K+ lines documented",
      },
    ],
    keyMetrics: [
      { label: "Lines of Code", value: "35K+", context: "across frontend and backend" },
      { label: "API Endpoints", value: "80+", context: "RESTful with JWT auth" },
      { label: "NestJS Modules", value: "16", context: "organized business logic" },
      { label: "Tech Stack", value: "Modern", context: "Next.js 15, NestJS 11, Prisma 7" },
    ],
    relevantFeatures: ["plugin-analytics", "agent-cli", "problem-enrichment"],
    callToAction: "Explore the technical architecture and API reference",
  },

  architecture: {
    slug: "architecture",
    title: "Nova for Tech Architects",
    subtitle: "Scalable multi-tenant platform on a proven, enterprise-ready stack",
    color: "orange",
    painPoints: [
      {
        title: "Multi-Tenancy Complexity",
        description: "Building data isolation between clients without duplicating infrastructure. Row-level security, tenant-scoped queries, and shared services are hard to get right.",
      },
      {
        title: "AI Integration Patterns",
        description: "Integrating LLMs into production systems requires structured prompts, retry logic, cost controls, and output validation. No established patterns exist.",
      },
      {
        title: "Monorepo vs Micro-Services",
        description: "Choosing the right architecture for a growing platform. Too monolithic and teams block each other. Too micro and coordination overhead kills velocity.",
      },
      {
        title: "Scalability Unknowns",
        description: "Will the architecture handle 10x users? 100x data? Where are the bottlenecks? Without a working prototype, these questions are theoretical.",
      },
    ],
    novaAnswers: [
      {
        title: "Proven Multi-Tenant Architecture",
        description: "Every model is tenant-scoped via Prisma middleware. JWT tokens carry tenantId. Guards enforce isolation at the controller level. Battle-tested with multiple concurrent tenants.",
        metric: "Row-level tenant isolation",
      },
      {
        title: "AI Integration Blueprint",
        description: "Claude API for deep analysis, structured JSON output with Zod validation, retry queues for failed enrichments, cost tracking per request. Production-ready patterns.",
        metric: "Type-safe AI outputs",
      },
      {
        title: "Monorepo with Turborepo",
        description: "pnpm workspaces with shared packages (@nova/plugin, @nova/shared). Independent apps (web, api) with shared types. Best of both worlds — code sharing without microservice overhead.",
        metric: "pnpm + Turborepo",
      },
      {
        title: "Working Prototype as Proof",
        description: "Not a slide deck — a running system. 80+ endpoints, 16 NestJS modules, real data flowing through the entire pipeline. Architecture decisions validated by code.",
        metric: "Running production system",
      },
    ],
    keyMetrics: [
      { label: "Backend Modules", value: "16", context: "NestJS feature modules" },
      { label: "Database Models", value: "20+", context: "Prisma schema with relations" },
      { label: "Auth System", value: "JWT", context: "with RBAC and multi-tenant guards" },
      { label: "Monorepo", value: "pnpm", context: "Turborepo with shared packages" },
    ],
    relevantFeatures: ["quadratic-voting", "problem-enrichment", "plugin-analytics"],
    callToAction: "Review the system architecture and data model",
  },

  "business-analysis": {
    slug: "business-analysis",
    title: "Nova for BA & Project Management",
    subtitle: "From problem identification to shipped solution in structured sprints",
    color: "pink",
    painPoints: [
      {
        title: "Requirements Ambiguity",
        description: "Stakeholders describe problems differently. Without structured problem statements, teams build the wrong solutions and discover it late.",
      },
      {
        title: "Estimation Uncertainty",
        description: "How long will this take? Traditional estimation is a guess. Scope creep is the norm. Deadlines slip because complexity was underestimated.",
      },
      {
        title: "Stakeholder Alignment",
        description: "Getting 6+ stakeholders to agree on priorities requires weeks of meetings. Even then, alignment is fragile and breaks at the first blocker.",
      },
      {
        title: "Traceability Gaps",
        description: "From business need to deployed feature — the chain is broken. Requirements live in one tool, designs in another, code in a third. Impact analysis is manual.",
      },
    ],
    novaAnswers: [
      {
        title: "Structured Problem Pipeline",
        description: "Problems are imported, enriched with AI, scored on 11 dimensions, and prioritized through voting. Every problem has evidence, stakeholders, and clear criteria.",
        metric: "Problem → Solution → Feature → Sprint",
      },
      {
        title: "Evidence-Based Estimation",
        description: "The 2gthr POC proves what's achievable: 17-24 weeks of traditional work delivered in 3 weeks. Real velocity data replaces guesswork.",
        metric: "6-8x faster delivery",
      },
      {
        title: "Democratic Alignment",
        description: "Quadratic voting creates mathematical consensus. Every stakeholder participates, results are transparent, and priorities are defensible with data.",
        metric: "Consensus + conflict analysis",
      },
      {
        title: "End-to-End Traceability",
        description: "Problem → enriched analysis → voting session → solution design → feature breakdown → sprint assignment. The entire chain is tracked in Nova.",
      },
    ],
    keyMetrics: [
      { label: "Pipeline Steps", value: "6", context: "problem to deployment" },
      { label: "Scoring Dimensions", value: "11", context: "per problem enrichment" },
      { label: "Sprint Management", value: "Built-in", context: "with problem linking" },
      { label: "Import Formats", value: "4", context: "JSON, CSV, Excel, manual" },
    ],
    relevantFeatures: ["quadratic-voting", "problem-enrichment", "research-intelligence"],
    callToAction: "See the problem-to-solution pipeline in action",
  },
};

export const allRoleSlugs = Object.keys(roles);
