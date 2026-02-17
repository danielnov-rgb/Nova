// Together POC Report Content
// Data extracted from Context/.nova-reports/*.md

export const reportMeta = {
  title: "Together POC",
  subtitle: "Development Velocity Report",
  generatedDate: "February 2026",
  accelerationFactor: "6-8x",
  traditionalEstimate: "17-24 weeks",
  pocPeriod: "3 weeks",
};

export const headlineMetrics = [
  { label: "UI Components", value: 103, suffix: "" },
  { label: "Go-Card Types", value: 11, suffix: "" },
  { label: "AI-Powered Tools", value: 6, suffix: "" },
  { label: "Learning Paths", value: 1, suffix: "" },
  { label: "Milestones", value: 6, suffix: "" },
  { label: "Go-Cards Authored", value: 29, suffix: "" },
  { label: "Service Modules", value: 15, suffix: "" },
  { label: "Lines of Code", value: 35000, suffix: "+" },
];

export const features = [
  {
    id: "lms",
    title: "Complete Learning Management System",
    description: "Multi-path learning architecture with milestone-based progression",
    icon: "book",
    highlights: [
      "11 distinct go-card types with rich interactive content",
      "Progress tracking with completion states, badges, and strides",
      "User profile (MyDNA) with aggregated stats and preferences",
      "Jump Back In recommendations based on user activity",
    ],
    techDetails: [
      "React 18 + Vite with Firebase integration",
      "Firestore data layer with 9 collections",
      "Real-time progress subscriptions",
      "Write-time stats aggregation for performance",
    ],
  },
  {
    id: "ai-tools",
    title: "AI-Powered Tooling Suite",
    description: "6 interactive tools with multi-step wizard interfaces and AI processing",
    icon: "sparkles",
    highlights: [
      "CV Builder with PDF/DOCX parsing and SOAR analysis (Claude API)",
      "Interview Story Builder with personalized question generation",
      "Quick Proof Generator for evidence-to-job-requirement matching",
      "Role Evidence Matcher with gap analysis and recommendations",
      "Evidence Co-Create with conversational document builder",
      "Evidence Mapper for categorized evidence organization",
    ],
    techDetails: [
      "Anthropic Claude API for CV analysis and generation",
      "Google Vertex AI (Gemini 2.0 Flash) for real-time tools",
      "Schema-driven AI responses with retry logic",
      "State machines for multi-phase wizard flows",
    ],
  },
  {
    id: "design-system",
    title: "Design System & Theming",
    description: "Comprehensive design system with full light/dark mode support",
    icon: "palette",
    highlights: [
      "103 UI components with consistent styling",
      "50+ semantic design tokens (colors, typography, spacing)",
      "Full light/dark mode via CSS custom properties",
      "Figma MCP integration for design-to-code workflow",
    ],
    techDetails: [
      "Tailwind CSS with extended theme configuration",
      "CSS custom properties for runtime theming",
      "FOUC prevention script for theme persistence",
      "Component patterns documented in design companion",
    ],
  },
  {
    id: "admin",
    title: "Admin & Content Management",
    description: "Role-based access control and content authoring infrastructure",
    icon: "settings",
    highlights: [
      "Admin role protection with automatic redirects",
      "Content seeding system with multi-path registry",
      "User path access control (per-user content gating)",
      "Markdown-based content authoring pipeline",
    ],
    techDetails: [
      "Firebase custom claims for role verification",
      "Cloud Function for AI-assisted content parsing",
      "Seed data with dependency resolution",
      "Protected routes with role-based guards",
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Event Tracking",
    description: "Comprehensive user behavior tracking and engagement metrics",
    icon: "chart",
    highlights: [
      "Page view and session tracking",
      "Path/milestone/card lifecycle events",
      "User action logging (sign up, profile updates)",
      "Batch event queue for performance optimization",
    ],
    techDetails: [
      "428-line analytics service with batch processing",
      "Time-on-page measurement with session context",
      "Non-blocking event dispatch",
      "Structured event taxonomy",
    ],
  },
];

export const velocityComparison = [
  { category: "Core Platform Foundation", traditional: "2-3 weeks", description: "Architecture decisions, Firebase setup, auth implementation, security rules" },
  { category: "Go-Card Engine (11 types)", traditional: "4-6 weeks", description: "Per-type design cycles, component development, testing" },
  { category: "AI-Powered Tools (6 tools)", traditional: "4-5 weeks", description: "Prompt engineering, state machine development, AI integration, testing" },
  { category: "Path Navigation System", traditional: "2-3 weeks", description: "Information architecture, page design, progress logic" },
  { category: "User Profile (MyDNA)", traditional: "1.5-2 weeks", description: "Profile schema design, aggregation logic, onboarding flow" },
  { category: "Design System & Theming", traditional: "1.5-2 weeks", description: "Token definition, migration, dark mode implementation" },
  { category: "Admin Infrastructure", traditional: "1-2 weeks", description: "Role system, admin UI, security review" },
  { category: "Analytics & Tracking", traditional: "0.5-1 week", description: "Event taxonomy, implementation, testing" },
];

export const workflowExamples = [
  {
    id: "gocard",
    title: "Go-Card Type Implementation",
    traditionalSteps: [
      "Product defines card type requirements (2-3 days)",
      "Design creates wireframes (2-3 days)",
      "Design review and iteration (1-2 days)",
      "Design creates high-fidelity mockups (2-3 days)",
      "BA writes acceptance criteria (1-2 days)",
      "Developer implements component (3-5 days)",
      "QA tests and files bugs (2-3 days)",
      "Developer fixes bugs (1-2 days)",
      "Final review and merge (1 day)",
    ],
    traditionalTotal: "15-24 days per card type",
    traditionalMultiplier: "× 11 types = 33-52 weeks",
    novaApproach: "Define requirements and implement in single session with inline iteration",
    eliminated: [
      "Design handoff documentation",
      "BA specification writing",
      "Asynchronous review cycles",
      "Context-switching between roles",
      "Bug ticket creation and triage",
    ],
  },
  {
    id: "ai-tool",
    title: "AI Tool Development (CV Builder)",
    traditionalSteps: [
      "Product writes PRD for AI-powered CV analysis (3-5 days)",
      "Design creates wizard flow mockups (3-4 days)",
      "ML/AI specialist designs prompts (5-7 days)",
      "Backend developer implements Cloud Function (3-5 days)",
      "Frontend developer builds wizard UI (5-7 days)",
      "Integration testing (2-3 days)",
      "Prompt tuning based on testing (3-5 days)",
      "QA regression testing (2-3 days)",
    ],
    traditionalTotal: "26-39 days per tool",
    traditionalMultiplier: "× 6 tools = 31-47 weeks",
    novaApproach: "Design and implement wizard flow with prompt engineering inline",
    eliminated: [
      "ML specialist bottleneck",
      "Backend/frontend coordination overhead",
      "Prompt documentation and handoff",
      "Separate integration testing phase",
      "Multiple deployment cycles for prompt tuning",
    ],
  },
  {
    id: "design-system",
    title: "Design System Migration",
    traditionalSteps: [
      "Design systems engineer audits existing components (3-5 days)",
      "Defines token taxonomy with design team (2-3 days)",
      "Creates migration plan and prioritization (2-3 days)",
      "Implements tokens in design tool and code (5-7 days)",
      "Migrates components in batches with review cycles (10-15 days)",
      "QA visual regression testing (3-5 days)",
      "Documentation updates (2-3 days)",
    ],
    traditionalTotal: "27-41 days",
    novaApproach: "Analyze patterns, define tokens, and migrate components in single pass",
    eliminated: [
      "Token taxonomy review meetings",
      "Batch-based migration with review gates",
      "Separate visual regression testing",
      "Documentation as separate deliverable",
    ],
  },
];

export const technicalComplexity = [
  { indicator: "Firebase services integrated", value: "5", detail: "Auth, Firestore, Storage, Functions, Hosting" },
  { indicator: "AI provider integrations", value: "2", detail: "Anthropic Claude, Google Vertex AI" },
  { indicator: "State machines implemented", value: "4", detail: "Tools with multi-phase flows" },
  { indicator: "Real-time data subscriptions", value: "3", detail: "Progress, responses, evidence" },
  { indicator: "File processing pipelines", value: "2", detail: "PDF/DOCX extraction, document generation" },
  { indicator: "Custom business logic services", value: "15", detail: "Progress, badges, strides, analytics, etc." },
];

export const platformOverview = {
  name: "2gthr",
  tagline: "AI-powered professional development platform",
  description: "2gthr helps users build evidence of their skills and achievements to advance their careers through structured learning paths, AI-powered tools, and evidence collection capabilities.",
  userJourney: [
    "Sign up and complete onboarding questionnaire",
    "Discover learning paths relevant to career goals",
    "Progress through Go-Card activities (articles, quizzes, tools)",
    "Earn rewards (Strides points and badges)",
    "Build evidence portfolio with AI analysis",
    "Track progress via personal dashboard (My DNA)",
  ],
};

export const goCardTypes = [
  { type: "Article", purpose: "Long-form content", features: "Block-based rendering, action rail, hero sections" },
  { type: "Quiz", purpose: "Knowledge assessment", features: "Multi-question flow, per-option feedback, scoring" },
  { type: "Reflection", purpose: "Self-assessment", features: "Prompt display, text input, AI-powered insights" },
  { type: "Event", purpose: "In-person/virtual events", features: "Registration, speaker bios, FAQ, location maps" },
  { type: "Evidence", purpose: "Document upload", features: "File upload, acceptance criteria, version history, AI analysis" },
  { type: "Assessment", purpose: "Skills evaluation", features: "Multi-question assessment, outcome mapping, insights" },
  { type: "Podcast", purpose: "Audio content", features: "Chapter markers, expert bios, engagement tracking" },
  { type: "Video", purpose: "Video content", features: "Embedded player, content engagement, expert bios" },
  { type: "Poll", purpose: "Quick surveys", features: "Option selection, suggested next cards" },
  { type: "Insights", purpose: "AI-generated analysis", features: "Journey narrative, progress snapshot, key learnings" },
  { type: "Tool", purpose: "Interactive utilities", features: "State machine wrapper for embedded AI tools" },
];

export const aiTools = [
  { name: "CV Builder", provider: "Claude API", phases: 4, capabilities: "PDF/DOCX parsing, SOAR analysis, follow-up Q&A, CV generation" },
  { name: "Interview Story Builder", provider: "Vertex AI", phases: 4, capabilities: "Context prefilling, SOAR framework questions, practice coaching" },
  { name: "Quick Proof Generator", provider: "Vertex AI", phases: 3, capabilities: "Evidence-to-requirement matching, seniority-aware difficulty" },
  { name: "Role Evidence Matcher", provider: "Vertex AI", phases: 4, capabilities: "Role parsing, evidence rating, gap analysis with recommendations" },
  { name: "Evidence Co-Create", provider: "Vertex AI", phases: 3, capabilities: "Conversational evidence gathering, document generation (DOCX)" },
  { name: "Evidence Mapper", provider: "None", phases: 1, capabilities: "Category-based evidence organization" },
];

export const accelerationInsights = [
  {
    title: "Role Consolidation",
    description: "Requirements, design, development, and testing occurred as a continuous activity rather than sequential handoffs.",
  },
  {
    title: "Specialist Elimination",
    description: "AI/ML work was embedded in feature development rather than requiring dedicated specialists and coordination overhead.",
  },
  {
    title: "Iteration Compression",
    description: "Design and code evolved together with immediate feedback, eliminating review cycle delays.",
  },
  {
    title: "Documentation Automation",
    description: "Patterns were captured in code and tooling rather than separate documentation artifacts.",
  },
  {
    title: "Integration by Default",
    description: "Components were built with their integrations (AI services, data layers) rather than as isolated units requiring later assembly.",
  },
];

export const contactTeam = [
  { name: "Daniel", email: "daniel@novademo.com" },
];
