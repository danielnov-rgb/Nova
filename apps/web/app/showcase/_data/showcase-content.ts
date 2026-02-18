// Nova Leadership Knowledge Pack — Landing Page Content
// All content structured as typed objects for easy editing

export const showcaseMeta = {
  title: "Nova",
  subtitle: "AI-Powered Product Intelligence Platform",
  tagline: "Accelerating 2gthr by 6-8x",
  date: "February 2026",
  badge: "Leadership Knowledge Pack",
};

export const proofNumbers = [
  { label: "Lines of Code", value: 35000, suffix: "+", description: "Production-ready across platform" },
  { label: "UI Components", value: 103, suffix: "", description: "In the 2gthr design system" },
  { label: "Acceleration Factor", value: 6, suffix: "-8x", description: "Faster than traditional development" },
  { label: "POC Duration", value: 3, suffix: " weeks", description: "From zero to full platform" },
  { label: "API Endpoints", value: 80, suffix: "+", description: "RESTful backend services" },
  { label: "Go-Card Types", value: 11, suffix: "", description: "Interactive learning formats" },
  { label: "AI Tools", value: 6, suffix: "", description: "Intelligent automation suite" },
  { label: "Service Modules", value: 15, suffix: "", description: "Backend business logic" },
];

export const platformFeatures = [
  {
    id: "quadratic-voting",
    title: "Quadratic Voting Engine",
    description: "Democratic prioritization where every voice matters proportionally",
    icon: "vote",
    highlights: [
      "Credit-based voting with quadratic cost scaling",
      "Multi-group sessions with role-based credit allocation",
      "Real-time results with consensus and conflict analysis",
      "Anonymous voting links for unbiased participation",
    ],
    techDetails: [
      "Configurable credit pools per voter group",
      "Automated participation tracking",
      "Group-by-group result breakdowns",
      "Public session sharing with join codes",
    ],
  },
  {
    id: "problem-enrichment",
    title: "AI Problem Enrichment",
    description: "Transform raw problem statements into multi-dimensional strategic artifacts",
    icon: "sparkles",
    highlights: [
      "11-dimension scoring (impact, urgency, complexity, innovation, etc.)",
      "Evidence-based summaries with structured citations",
      "Automated stakeholder and market analysis",
      "Batch enrichment for large problem sets",
    ],
    techDetails: [
      "Claude API integration for deep analysis",
      "Structured JSON output with type safety",
      "Evidence items as first-class data objects",
      "Import from CSV, Excel, or JSON",
    ],
  },
  {
    id: "plugin-analytics",
    title: "Plugin Analytics SDK",
    description: "Drop-in analytics tracking for any React application",
    icon: "chart",
    highlights: [
      "Feature-level view, interact, and completion tracking",
      "Automatic session management and device fingerprinting",
      "React components and hooks for zero-config integration",
      "In-app feedback widget with star ratings",
    ],
    techDetails: [
      "Batched event queue with configurable flush intervals",
      "NovaProvider context for app-wide configuration",
      "NovaFeature wrapper with IntersectionObserver auto-tracking",
      "Feedback triggers: floating, overlay, contextual",
    ],
  },
  {
    id: "agent-cli",
    title: "Agent CLI Discovery",
    description: "Automated feature discovery and instrumentation for any codebase",
    icon: "terminal",
    highlights: [
      "AST analysis to discover pages, forms, modals, and components",
      "Auto-detect Next.js, React, Vue, Angular, and Nuxt frameworks",
      "One-command instrumentation with git branch workflow",
      "Sync discovered features to Nova platform",
    ],
    techDetails: [
      "Babel parser for TypeScript/JSX AST traversal",
      "Feature type classification: page, section, form, modal, action",
      "Generated NovaProvider + environment setup",
      "Git branch creation and automated commits",
    ],
  },
  {
    id: "research-intelligence",
    title: "Research Intelligence Pipeline",
    description: "AI-powered competitive and market research with structured outputs",
    icon: "search",
    highlights: [
      "Competitor tracking with automated analysis",
      "Market intelligence entries with evidence linking",
      "Audience definition and segmentation",
      "Sprint management with problem-to-solution flow",
    ],
    techDetails: [
      "Multi-tenant data isolation",
      "Problem → Solution → Feature → Sprint pipeline",
      "Hierarchical feature mapping",
      "Onboarding context for AI personalization",
    ],
  },
  {
    id: "automated-reports",
    title: "Automated Report Generation",
    description: "Interactive client-facing reports generated from platform data",
    icon: "document",
    highlights: [
      "Animated scroll-reveal sections with metrics counters",
      "Velocity comparison with progress bar visualizations",
      "Workflow compression before/after toggles",
      "Auth-gated access with engagement tracking",
    ],
    techDetails: [
      "Content-driven architecture: all data in typed .ts files",
      "Reusable component library: PageHeader, ContentSection, CardGrid",
      "PostHog integration for viewer analytics",
      "Server-rendered with client-side animations",
    ],
  },
];

export const workflowExamples = [
  {
    id: "gocard",
    title: "Go-Card Type Implementation",
    traditional: {
      steps: [
        "Product defines requirements (2-3 days)",
        "Design creates wireframes (2-3 days)",
        "Design review and iteration (1-2 days)",
        "High-fidelity mockups (2-3 days)",
        "BA writes acceptance criteria (1-2 days)",
        "Developer implements (3-5 days)",
        "QA tests and files bugs (2-3 days)",
        "Bug fixes and final review (2-3 days)",
      ],
      total: "15-24 days per type",
      multiplier: "× 11 types = 33-52 weeks",
    },
    nova: {
      approach: "Define requirements and implement in single session with inline iteration",
      eliminated: [
        "Design handoff documentation",
        "BA specification writing",
        "Asynchronous review cycles",
        "Context-switching between roles",
        "Bug ticket creation and triage",
      ],
    },
  },
  {
    id: "ai-tool",
    title: "AI Tool Development",
    traditional: {
      steps: [
        "Product writes PRD (3-5 days)",
        "Design creates wizard flow (3-4 days)",
        "ML specialist designs prompts (5-7 days)",
        "Backend implements Cloud Function (3-5 days)",
        "Frontend builds wizard UI (5-7 days)",
        "Integration testing (2-3 days)",
        "Prompt tuning (3-5 days)",
        "QA regression testing (2-3 days)",
      ],
      total: "26-39 days per tool",
      multiplier: "× 6 tools = 31-47 weeks",
    },
    nova: {
      approach: "Design and implement wizard flow with prompt engineering inline",
      eliminated: [
        "ML specialist bottleneck",
        "Backend/frontend coordination",
        "Prompt documentation handoff",
        "Separate integration testing",
        "Multiple deployment cycles",
      ],
    },
  },
  {
    id: "design-system",
    title: "Design System Migration",
    traditional: {
      steps: [
        "Audit existing components (3-5 days)",
        "Define token taxonomy (2-3 days)",
        "Create migration plan (2-3 days)",
        "Implement tokens (5-7 days)",
        "Migrate components in batches (10-15 days)",
        "Visual regression testing (3-5 days)",
        "Documentation updates (2-3 days)",
      ],
      total: "27-41 days",
      multiplier: "",
    },
    nova: {
      approach: "Analyze patterns, define tokens, and migrate components in single pass",
      eliminated: [
        "Token taxonomy review meetings",
        "Batch migration with review gates",
        "Separate visual regression testing",
        "Documentation as separate deliverable",
      ],
    },
  },
];

export const roleCards = [
  {
    slug: "strategy",
    title: "Head of Strategy",
    tagline: "Data-driven prioritization that aligns teams",
    icon: "compass",
    color: "primary",
  },
  {
    slug: "design",
    title: "Head of Design",
    tagline: "103 components built in 3 weeks, not 3 months",
    icon: "palette",
    color: "cyan",
  },
  {
    slug: "marketing",
    title: "Head of Marketing",
    tagline: "Real-time analytics on every user interaction",
    icon: "megaphone",
    color: "purple",
  },
  {
    slug: "development",
    title: "Software Development",
    tagline: "35K+ LoC with plugin SDK and 80+ API endpoints",
    icon: "code",
    color: "green",
  },
  {
    slug: "architecture",
    title: "Tech Architecture",
    tagline: "Scalable multi-tenant platform built on proven stack",
    icon: "layers",
    color: "orange",
  },
  {
    slug: "business-analysis",
    title: "BA & Project Management",
    tagline: "From problem to solution in structured sprints",
    icon: "clipboard",
    color: "pink",
  },
];

export const accelerationData = [
  { category: "Core Platform Foundation", traditional: "2-3 weeks", novaWeeks: 0.4, traditionalWeeks: 2.5, description: "Architecture, auth, security, database setup" },
  { category: "Go-Card Engine (11 types)", traditional: "4-6 weeks", novaWeeks: 0.7, traditionalWeeks: 5, description: "Per-type design, development, testing" },
  { category: "AI-Powered Tools (6 tools)", traditional: "4-5 weeks", novaWeeks: 0.6, traditionalWeeks: 4.5, description: "Prompt engineering, state machines, integration" },
  { category: "Path Navigation System", traditional: "2-3 weeks", novaWeeks: 0.3, traditionalWeeks: 2.5, description: "Information architecture, progress logic" },
  { category: "User Profile (MyDNA)", traditional: "1.5-2 weeks", novaWeeks: 0.25, traditionalWeeks: 1.75, description: "Profile schema, aggregation, onboarding" },
  { category: "Design System & Theming", traditional: "1.5-2 weeks", novaWeeks: 0.25, traditionalWeeks: 1.75, description: "Token definition, dark mode, migration" },
  { category: "Admin Infrastructure", traditional: "1-2 weeks", novaWeeks: 0.2, traditionalWeeks: 1.5, description: "Role system, admin UI, security" },
  { category: "Analytics & Tracking", traditional: "0.5-1 week", novaWeeks: 0.1, traditionalWeeks: 0.75, description: "Event taxonomy, implementation, testing" },
];

export const investmentSummary = {
  monthly: "R1.2M",
  perFDE: "R400K",
  teamSize: 3,
  duration: "6 months",
  total: "R7.2M",
  totalNumeric: 7200000,
  deliverables: [
    "18 complete, validated solutions (3/month)",
    "Continuous monitoring and optimization",
    "Advanced analytics and intelligence",
    "Cross-team integration and knowledge sharing",
    "Complete ownership of all deliverables",
    "Risk-free evaluation of Nova's enterprise potential",
  ],
};

export const ipOwnership = {
  accentureOwns: [
    "Path designs, specifications, and documentation",
    "Go-card content, templates, and implementations",
    "Frontend code, components, and UI implementations",
    "Backend services, APIs, and micro-services",
    "User research findings and insights reports",
    "Analytics dashboards and reporting",
    "All recommendations and strategic guidance",
  ],
  novaRetains: [
    "Nova AI platform software and codebase",
    "Proprietary algorithms, prompts, and agent architectures",
    "Product intelligence methodologies and frameworks",
    "Analytics engines and intelligence systems",
    "Platform enhancements developed during engagement",
  ],
  clarification: "Billable hours are dedicated exclusively to 2gthr deliverables. Nova is used as a tool — like Adobe Creative Suite — not developed on billable time.",
};

export const nextSteps = [
  { number: "01", title: "Explore the Platform", description: "Browse the case study and role-specific deep dives" },
  { number: "02", title: "Ask Questions", description: "We're ready to walk through any section in detail" },
  { number: "03", title: "Schedule a Demo", description: "See Nova in action with live prioritization and enrichment" },
  { number: "04", title: "Start the Conversation", description: "Let's discuss how Nova fits your strategic goals" },
];

export const contactInfo = {
  name: "Daniel",
  email: "daniel@novademo.com",
  role: "Strategic Product Intelligence",
};
