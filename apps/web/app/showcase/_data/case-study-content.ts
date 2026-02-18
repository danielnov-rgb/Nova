// Nova Leadership Knowledge Pack — Case Study Content
// "2gthr: A Nova Engagement" narrative

export const caseStudyMeta = {
  title: "2gthr: A Nova Engagement",
  subtitle: "How 3 weeks of focused development replaced 17-24 weeks of traditional delivery",
  badge: "Case Study",
  client: "2gthr / Accenture",
};

export const challenge = {
  title: "The Challenge",
  description: "2gthr needed a complete professional development platform — learning paths, interactive content types, AI-powered career tools, and a design system — all while maintaining quality and consistency across a growing product surface. Traditional estimates pointed to 17-24 weeks of work across multiple specialist teams.",
  painPoints: [
    "11 distinct interactive content types requiring individual design and development cycles",
    "6 AI-powered tools needing ML specialist involvement and prompt engineering",
    "A complete design system with 50+ semantic tokens and full theming support",
    "Admin infrastructure, analytics, and user profile systems",
    "Coordination across product, design, development, QA, and ML teams",
  ],
};

export const approach = {
  title: "The Nova Approach",
  description: "Instead of sequential handoffs between specialist teams, Nova's Forward Deployed Engineering model consolidated requirements, design, development, and testing into continuous sessions. AI-powered tooling handled the heavy lifting while human engineers maintained quality and strategic direction.",
  principles: [
    {
      title: "Role Consolidation",
      description: "Requirements, design, development, and testing as a continuous activity — not sequential handoffs.",
    },
    {
      title: "Specialist Elimination",
      description: "AI/ML work embedded in feature development rather than requiring dedicated specialists.",
    },
    {
      title: "Iteration Compression",
      description: "Design and code evolved together with immediate feedback, eliminating review cycle delays.",
    },
    {
      title: "Integration by Default",
      description: "Components built with their integrations (AI services, data layers) rather than as isolated units.",
    },
  ],
};

export const timeline = [
  {
    week: "Week 1",
    title: "Foundation & Core Engine",
    deliverables: [
      "Platform architecture and Firebase setup",
      "Authentication and role-based access",
      "First 5 Go-Card types designed and built",
      "Path navigation system with progress tracking",
      "Design system foundation with token architecture",
    ],
  },
  {
    week: "Week 2",
    title: "AI Tools & Advanced Features",
    deliverables: [
      "Remaining 6 Go-Card types completed",
      "CV Builder with PDF parsing and SOAR analysis",
      "Interview Story Builder with personalized questions",
      "Quick Proof Generator and Role Evidence Matcher",
      "User profile system (MyDNA) with stats aggregation",
    ],
  },
  {
    week: "Week 3",
    title: "Polish, Analytics & Delivery",
    deliverables: [
      "Evidence Co-Create and Evidence Mapper tools",
      "Full light/dark mode theming across all components",
      "Analytics service with batch event processing",
      "Admin infrastructure and content management",
      "Design system documentation and pattern library",
    ],
  },
];

export const results = {
  title: "The Results",
  description: "In 3 weeks, Nova delivered what traditional teams estimate at 17-24 weeks — a 6-8x acceleration factor. Every component was production-ready, tested, and documented.",
  metrics: [
    { label: "UI Components", value: "103", context: "Production-ready, themed" },
    { label: "Go-Card Types", value: "11", context: "Distinct interactive formats" },
    { label: "AI Tools", value: "6", context: "With multi-step wizards" },
    { label: "Lines of Code", value: "35K+", context: "Across the full platform" },
    { label: "Design Tokens", value: "50+", context: "Semantic, themed" },
    { label: "Service Modules", value: "15", context: "Backend business logic" },
    { label: "Learning Paths", value: "1", context: "With 6 milestones" },
    { label: "Traditional Estimate", value: "17-24 wk", context: "Industry standard" },
  ],
};

export const velocityBreakdown = [
  { category: "Core Platform", traditional: "2-3 weeks", nova: "~2 days", factor: "7x" },
  { category: "Go-Card Engine", traditional: "4-6 weeks", nova: "~4 days", factor: "8x" },
  { category: "AI Tools Suite", traditional: "4-5 weeks", nova: "~3 days", factor: "8x" },
  { category: "Navigation System", traditional: "2-3 weeks", nova: "~2 days", factor: "7x" },
  { category: "User Profiles", traditional: "1.5-2 weeks", nova: "~1 day", factor: "8x" },
  { category: "Design System", traditional: "1.5-2 weeks", nova: "~1 day", factor: "8x" },
  { category: "Admin Infrastructure", traditional: "1-2 weeks", nova: "~1 day", factor: "7x" },
  { category: "Analytics", traditional: "0.5-1 week", nova: "~0.5 days", factor: "6x" },
];

export const testimonialPlaceholder = {
  quote: "The pace of delivery was unlike anything we've seen in traditional consulting engagements.",
  attribution: "— 2gthr Team",
  note: "(Placeholder — replace with real quote when available)",
};
