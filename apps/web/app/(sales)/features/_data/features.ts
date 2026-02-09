export interface FeatureModule {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  status: "live" | "coming-soon" | "beta";
  demoUrl?: string;
  problemStatement: {
    problem: string;
    consequence: string;
    solution: string;
  };
  capabilities: string[];
  workflow: { step: number; title: string; description: string }[];
  benefits: { title: string; description: string; icon: string }[];
  useCases: { scenario: string; persona: string; outcome: string }[];
  personaValues: { persona: "Product" | "Engineering" | "Executive"; value: string }[];
  integrations: string[];
}

export const features: FeatureModule[] = [
  {
    slug: "client-onboarding",
    title: "Client Onboarding & Knowledge Base",
    shortTitle: "Client Onboarding",
    tagline: "The foundation that makes everything else work",
    description:
      "A central repository that aligns ALL teams on objectives, terminology, and ways of working. Without this foundation, it's impossible to know what to build.",
    status: "coming-soon",
    problemStatement: {
      problem: "Teams lack a single source of truth for company objectives, terminology, and strategic direction.",
      consequence: "Misalignment leads to building the wrong features, wasted engineering cycles, and conflicting priorities across departments.",
      solution: "Nova creates a living knowledge base that keeps everyone aligned and automatically flags gaps in strategic clarity.",
    },
    capabilities: [
      "Central project repository for all team alignment",
      "Objective and KPI documentation with gap detection",
      "Business model and competitive advantage mapping",
      "Team terminology glossary (Nova speaks your language)",
      "New team member onboarding that 'talks them through' everything",
      "Design system and codebase connection",
      "Highlights gaps in clarity (missing northstar, unclear KPIs)",
    ],
    workflow: [
      { step: 1, title: "Define Objectives", description: "Document your company's goals, KPIs, and what success looks like" },
      { step: 2, title: "Map Your Business", description: "Capture business model, competitive advantages, and existing solutions" },
      { step: 3, title: "Connect Systems", description: "Link your design system (Figma) and codebase for deep integration" },
      { step: 4, title: "Build Glossary", description: "Define your terminology so Nova speaks your company's language" },
    ],
    benefits: [
      { icon: "target", title: "Team Alignment", description: "Everyone works from the same understanding of goals and priorities" },
      { icon: "lightbulb", title: "Gap Detection", description: "Automatically identifies missing clarity in strategy and objectives" },
      { icon: "users", title: "Fast Onboarding", description: "New team members get up to speed in days, not weeks" },
    ],
    useCases: [
      { scenario: "New PM joins and needs to understand why we built feature X", persona: "Product Manager", outcome: "Nova walks them through the entire decision chain from problem to solution" },
      { scenario: "Engineering asks 'why are we building this?' for the third time", persona: "Engineering Lead", outcome: "Link them to the evidence trail showing user research, votes, and strategic fit" },
      { scenario: "Board wants to know if product strategy aligns with company goals", persona: "CEO", outcome: "Dashboard shows direct connection between every feature and company objectives" },
    ],
    personaValues: [
      { persona: "Product", value: "Stop repeating context in every meeting. Nova maintains institutional knowledge that anyone can query." },
      { persona: "Engineering", value: "Clear rationale for every feature request. No more building in the dark." },
      { persona: "Executive", value: "Confidence that product work is aligned with business strategy. Real-time visibility into priorities." },
    ],
    integrations: ["target-audience", "problem-discovery", "solution-design"],
  },
  {
    slug: "target-audience",
    title: "Target Audience Dashboard",
    shortTitle: "Target Audience",
    tagline: "Know who you're building for",
    description:
      "Understand who you serve, who you want to serve, and what the market reality looks like. Align your entire team on users and track audience changes over time.",
    status: "coming-soon",
    problemStatement: {
      problem: "Teams have vague or conflicting ideas about who their users are and what segments to prioritize.",
      consequence: "Products get built for imaginary users, leading to poor product-market fit and wasted resources on features nobody wants.",
      solution: "Nova provides a data-backed view of your audience with reality checks against market demographics.",
    },
    capabilities: [
      "Define and validate target customer segments",
      "Quantify market size with demographics and reachable audience",
      "Align team on shared persona understanding",
      "Track audience composition changes over time",
      "Realism validation ('You're targeting 5K doctors but only 3K exist')",
      "Smart suggestions based on stated objectives",
      "Gap analysis between current and target customers",
    ],
    workflow: [
      { step: 1, title: "Import Existing Data", description: "Connect customer data from CSV, CRM, or API integrations" },
      { step: 2, title: "Define Target Segments", description: "Specify who you want to reach with numeric targets" },
      { step: 3, title: "Validate Against Market", description: "Check targets against real market data and demographics" },
      { step: 4, title: "Align & Track", description: "Share segments across team and monitor changes over time" },
    ],
    benefits: [
      { icon: "users", title: "Know Your Users", description: "Crystal clear understanding of who you're building for" },
      { icon: "chart", title: "Quantify Market", description: "Real numbers on market size and reachable audience" },
      { icon: "target", title: "Align Teams", description: "Everyone shares the same user understanding" },
      { icon: "trending", title: "Track Changes", description: "Monitor audience evolution over time" },
    ],
    useCases: [
      { scenario: "Sales says we need feature Y but product thinks our users don't need it", persona: "Product Manager", outcome: "Data shows whether the requesting segment is in our target audience" },
      { scenario: "We want to expand into healthcare but don't know if it's viable", persona: "Strategy Lead", outcome: "Market data reveals actual number of healthcare professionals in target regions" },
      { scenario: "Investors ask about TAM/SAM/SOM", persona: "CEO", outcome: "Export market sizing with confidence because it's based on real demographic data" },
    ],
    personaValues: [
      { persona: "Product", value: "Make prioritization decisions backed by real user data, not gut feelings or loudest voice." },
      { persona: "Engineering", value: "Understand who will use what you build. Context makes better technical decisions." },
      { persona: "Executive", value: "Validate market assumptions before committing resources. Data-backed expansion decisions." },
    ],
    integrations: ["client-onboarding", "problem-discovery", "market-intelligence"],
  },
  {
    slug: "market-intelligence",
    title: "Market Intelligence Dashboard",
    shortTitle: "Market Intelligence",
    tagline: "Combined client + market data for complete business picture",
    description:
      "Nova's proprietary market intelligence combined with your client data. Benchmarks, economic data, pricing insights, and validation for your targets.",
    status: "coming-soon",
    problemStatement: {
      problem: "Companies make strategic decisions without understanding how they compare to market benchmarks or economic realities.",
      consequence: "Unrealistic targets, mispriced products, and strategies that ignore market conditions lead to failed launches and missed opportunities.",
      solution: "Nova combines your internal data with proprietary market intelligence to give context to every decision.",
    },
    capabilities: [
      "Nova benchmarks: time-to-ARR by sector, conversion rates, avg CAC/LTV",
      "Macro and micro economic data informing strategy",
      "Pricing insights: how target users spend disposable income",
      "Budget and target validation for SaaS companies",
      "Industry-specific growth patterns and trends",
      "Competitive density analysis by market segment",
    ],
    workflow: [
      { step: 1, title: "Connect Your Data", description: "Import your metrics, revenue data, and customer information" },
      { step: 2, title: "Benchmark Analysis", description: "Compare against Nova's proprietary industry benchmarks" },
      { step: 3, title: "Market Context", description: "Layer in economic trends and market conditions" },
      { step: 4, title: "Strategic Insights", description: "Get actionable recommendations based on combined data" },
    ],
    benefits: [
      { icon: "database", title: "Proprietary Data", description: "Access Nova's unique market intelligence dataset" },
      { icon: "chart", title: "Industry Benchmarks", description: "Know how you compare to sector averages" },
      { icon: "globe", title: "Economic Context", description: "Factor in macro trends that affect your business" },
    ],
    useCases: [
      { scenario: "Our conversion rate is 2.5% - is that good or bad?", persona: "Product Manager", outcome: "Benchmark shows industry average is 1.8%, you're outperforming" },
      { scenario: "What should we price our enterprise tier at?", persona: "Revenue Lead", outcome: "Pricing intelligence shows what similar products charge and what users pay" },
      { scenario: "Should we enter the APAC market this year?", persona: "CEO", outcome: "Economic data shows market readiness and competitive landscape by region" },
    ],
    personaValues: [
      { persona: "Product", value: "Set realistic goals based on what's actually achievable in your market." },
      { persona: "Engineering", value: "Understand competitive technical landscape before building." },
      { persona: "Executive", value: "Board-ready market analysis. No more guessing at benchmarks." },
    ],
    integrations: ["target-audience", "competitor-research", "analytics-feedback"],
  },
  {
    slug: "problem-discovery",
    title: "Problem Discovery & Analytics",
    shortTitle: "Problem Discovery",
    tagline: "AI + real research combined for human clarity",
    description:
      "Combines AI-powered synthetic interviews with real-world research. Crawls massive data volumes, clusters problems with vector similarity, and presents them with human clarity.",
    status: "coming-soon",
    problemStatement: {
      problem: "Traditional user research is too slow and expensive to conduct at the scale needed for comprehensive problem discovery.",
      consequence: "Teams either skip research entirely or base decisions on small sample sizes, missing critical problems that affect most users.",
      solution: "Nova conducts thousands of AI-simulated interviews, validated against real research, to surface problems you'd never find manually.",
    },
    capabilities: [
      "AI-simulated interviews with synthetic user personas",
      "Integration with real user research and feedback",
      "Vector-based problem clustering and similarity",
      "3D visualization of problem relationships",
      "Evidence trails: who faces it, severity, frequency",
      "Export and shortlist for prioritization",
      "Problem validation against market segments",
    ],
    workflow: [
      { step: 1, title: "Generate Insights", description: "AI conducts thousands of simulated user interviews" },
      { step: 2, title: "Cluster Problems", description: "Similar problems are grouped using vector similarity" },
      { step: 3, title: "Visualize & Explore", description: "Navigate problem space in 3D to find patterns" },
      { step: 4, title: "Shortlist & Prioritize", description: "Export top problems to voting system for team decision" },
    ],
    benefits: [
      { icon: "lightbulb", title: "Scale Research", description: "Conduct thousands of interviews impossible with humans alone" },
      { icon: "eye", title: "Human Clarity", description: "AI findings presented in understandable, actionable format" },
      { icon: "puzzle", title: "Pattern Recognition", description: "Discover problem clusters you'd never find manually" },
    ],
    useCases: [
      { scenario: "We think users struggle with onboarding but aren't sure why", persona: "Product Manager", outcome: "AI interviews reveal 4 distinct onboarding friction points, ranked by severity" },
      { scenario: "Support tickets are up but themes are unclear", persona: "Support Lead", outcome: "Problem clustering shows the 3 root causes behind 80% of tickets" },
      { scenario: "We need to validate a hypothesis before building", persona: "Engineering Lead", outcome: "Run 500 synthetic interviews in hours instead of months of user research" },
    ],
    personaValues: [
      { persona: "Product", value: "Research at scale. Validate ideas in hours, not months. Never build blind again." },
      { persona: "Engineering", value: "Clear problem definitions before you start coding. Understand the 'why' behind every feature." },
      { persona: "Executive", value: "Evidence-based roadmap. Every feature tied to a validated user problem." },
    ],
    integrations: ["target-audience", "problem-voting", "competitor-research"],
  },
  {
    slug: "problem-voting",
    title: "Problem Voting System",
    shortTitle: "Problem Voting",
    tagline: "Credit-based prioritization that eliminates politics",
    description:
      "A transparent, evidence-based voting system where team members allocate credits to problems they believe matter most. Full audit trail of who voted for what and why.",
    status: "live",
    // No demoUrl - live feature requires manual demo setup via /contact
    problemStatement: {
      problem: "Prioritization meetings devolve into political battles where the loudest voice or highest title wins.",
      consequence: "Teams build features that don't move the needle because decisions were made on politics, not evidence.",
      solution: "Nova's credit-based voting forces deliberate allocation and creates a transparent record of every prioritization decision.",
    },
    capabilities: [
      "Credit-based voting eliminates political maneuvering",
      "Role-based credit allocation (CEO vs IC)",
      "Multi-credit voting per problem",
      "Full evidence trail of all decisions",
      "Shareable voting links for stakeholders",
      "Real-time results dashboard",
      "Auto-generates prioritized backlog",
    ],
    workflow: [
      { step: 1, title: "Create Session", description: "Admin imports problems and configures voting rules" },
      { step: 2, title: "Invite Voters", description: "Generate shareable links for team members and stakeholders" },
      { step: 3, title: "Allocate Credits", description: "Each voter distributes their credits across problems" },
      { step: 4, title: "Review Results", description: "See aggregated priorities with full transparency on who voted for what" },
    ],
    benefits: [
      { icon: "shield", title: "Eliminate Politics", description: "Credit-based system ensures fair, objective prioritization" },
      { icon: "eye", title: "Full Transparency", description: "Complete audit trail of every vote and decision" },
      { icon: "check", title: "Actionable Output", description: "Directly generates your prioritized product backlog" },
    ],
    useCases: [
      { scenario: "The CEO keeps pushing their pet feature over user needs", persona: "Product Manager", outcome: "Voting data shows the feature only got 3% of credits - conversation backed by evidence" },
      { scenario: "We can't agree on Q2 priorities in planning", persona: "Engineering Lead", outcome: "Run a vote, get clear priorities, move on. No more 4-hour debates" },
      { scenario: "Board asks how we decide what to build", persona: "CEO", outcome: "Show transparent voting results with full evidence trail" },
    ],
    personaValues: [
      { persona: "Product", value: "End prioritization debates with data. Every stakeholder gets a voice, weighted appropriately." },
      { persona: "Engineering", value: "Clear sprint priorities. No more mid-sprint pivots because someone changed their mind." },
      { persona: "Executive", value: "Defensible prioritization process. Show exactly how and why decisions were made." },
    ],
    integrations: ["problem-discovery", "project-management"],
  },
  {
    slug: "competitor-research",
    title: "Competitor & Market Research",
    shortTitle: "Competitor Research",
    tagline: "Pricing insights and early adopter community building",
    description:
      "Understand what problems cost people, what they spend on solutions (tech AND manual workarounds), and build an early adopter community for real insights.",
    status: "coming-soon",
    problemStatement: {
      problem: "Teams don't understand the competitive landscape or what users currently pay (in money and time) to solve problems.",
      consequence: "Mispriced products, features that duplicate existing solutions, and missed opportunities to differentiate.",
      solution: "Nova maps the full solution landscape including manual workarounds and builds an early adopter community for continuous insights.",
    },
    capabilities: [
      "Pricing intelligence: what problems cost, what people pay",
      "Solution mapping including manual workarounds (not just tech)",
      "Automated competitor analysis and sentiment",
      "Early adopter community building tools",
      "Real users giving real insights (overcomes cold-start)",
      "Interview guide generation for human research",
      "CRM setup guidance for community management",
    ],
    workflow: [
      { step: 1, title: "Map Landscape", description: "Identify all competitors and alternative solutions" },
      { step: 2, title: "Analyze Pricing", description: "Understand what users pay and are willing to pay" },
      { step: 3, title: "Build Community", description: "Attract early adopters who become brand champions" },
      { step: 4, title: "Gather Insights", description: "Real feedback from real users in your community" },
    ],
    benefits: [
      { icon: "chart", title: "Pricing Intelligence", description: "Know what people pay and will pay for solutions" },
      { icon: "users", title: "Early Adopters", description: "Build a community of champions before launch" },
      { icon: "globe", title: "Market Reality", description: "See all solutions including manual workarounds" },
    ],
    useCases: [
      { scenario: "How much should we charge for our new feature?", persona: "Product Manager", outcome: "Pricing data shows users currently spend $50/mo on manual workarounds - room to charge $30" },
      { scenario: "We don't have any users yet to talk to", persona: "Founder", outcome: "Early adopter community building gets you 100 engaged users in weeks" },
      { scenario: "What are competitors doing that we're missing?", persona: "Strategy Lead", outcome: "Automated competitive analysis shows feature gaps and opportunities" },
    ],
    personaValues: [
      { persona: "Product", value: "Price with confidence. Understand willingness to pay before you launch." },
      { persona: "Engineering", value: "Know what already exists before building. Avoid reinventing wheels." },
      { persona: "Executive", value: "Competitive intelligence for strategic planning. Early adopter pipeline for launch." },
    ],
    integrations: ["problem-discovery", "market-intelligence", "solution-design"],
  },
  {
    slug: "project-management",
    title: "Project Management & Kanban",
    shortTitle: "Project Management",
    tagline: "Problem-to-solution pipeline with assumption tracking",
    description:
      "Track problems through your development pipeline with customizable stages, assumption documentation, and team workflow management.",
    status: "coming-soon",
    problemStatement: {
      problem: "Standard project management tools lose the context of why features were built - the problems, research, and decisions behind them.",
      consequence: "Teams forget the original problem, make changes that break assumptions, and can't learn from past decisions.",
      solution: "Nova keeps the full evidence trail attached to every item as it moves through your pipeline.",
    },
    capabilities: [
      "Customizable pipeline stages and buckets",
      "Problem-specific detail pages with full context",
      "Solution documentation and design links",
      "Assumption tracking per solution",
      "Team assignment and workflow management",
      "Progress tracking and bottleneck detection",
      "Integration with external tools (Jira, Linear, etc.)",
    ],
    workflow: [
      { step: 1, title: "Import Priorities", description: "Pull in prioritized problems from voting results" },
      { step: 2, title: "Configure Pipeline", description: "Set up stages that match your development process" },
      { step: 3, title: "Track Progress", description: "Move items through stages with full context preserved" },
      { step: 4, title: "Monitor & Optimize", description: "Identify bottlenecks and improve flow over time" },
    ],
    benefits: [
      { icon: "puzzle", title: "Full Context", description: "Problems carry all research and evidence through pipeline" },
      { icon: "check", title: "Track Assumptions", description: "Document what you're betting on for each solution" },
      { icon: "trending", title: "Flow Optimization", description: "Identify and fix bottlenecks in your process" },
    ],
    useCases: [
      { scenario: "Why did we build this feature? What problem did it solve?", persona: "Product Manager", outcome: "Click any item to see the full trail: research, votes, decisions, and outcomes" },
      { scenario: "This sprint is stuck - what's blocking us?", persona: "Engineering Lead", outcome: "Pipeline view shows exactly where items are bottlenecked" },
      { scenario: "Are we shipping what we planned to ship?", persona: "CEO", outcome: "Dashboard shows priority items flowing through pipeline with status" },
    ],
    personaValues: [
      { persona: "Product", value: "Never lose context again. Every feature carries its 'why' through the entire lifecycle." },
      { persona: "Engineering", value: "Clear pipeline visibility. Know what's coming and what's blocked." },
      { persona: "Executive", value: "Real-time progress visibility without asking for status updates." },
    ],
    integrations: ["problem-voting", "solution-design", "analytics-feedback"],
  },
  {
    slug: "solution-design",
    title: "Solution Design & Prototyping",
    shortTitle: "Solution Design",
    tagline: "Auto-generate mockups in your design system",
    description:
      "Generate solution artifacts in your company's design language. Component-based modular design with assumption documentation built in.",
    status: "coming-soon",
    problemStatement: {
      problem: "Translating problems into visual solutions is slow, and design decisions often lack documented rationale.",
      consequence: "Bottlenecked design resources, inconsistent UI, and no record of why specific design decisions were made.",
      solution: "Nova generates mockups in your design system and captures assumptions alongside every design decision.",
    },
    capabilities: [
      "Mockup generation using your design system",
      "Component-based modular design approach",
      "Assumption documentation for each design decision",
      "Export to Figma or your design tool",
      "Code scaffolding based on solution specs",
      "Design-to-development handoff automation",
      "Version control for design iterations",
    ],
    workflow: [
      { step: 1, title: "Select Problem", description: "Choose a prioritized problem to solve" },
      { step: 2, title: "Generate Options", description: "AI creates multiple solution mockups in your style" },
      { step: 3, title: "Refine & Document", description: "Iterate on designs and document assumptions" },
      { step: 4, title: "Export & Build", description: "Hand off to development with full context" },
    ],
    benefits: [
      { icon: "puzzle", title: "Your Design Language", description: "Solutions look like they belong in your product" },
      { icon: "lightbulb", title: "Multiple Options", description: "AI generates several approaches to evaluate" },
      { icon: "check", title: "Built-in Documentation", description: "Assumptions captured alongside every design" },
    ],
    useCases: [
      { scenario: "We need 3 mockup options for tomorrow's review", persona: "Product Manager", outcome: "Generate options in hours, not days, all in your design system" },
      { scenario: "Design handoff is always missing context", persona: "Engineering Lead", outcome: "Mockups come with documented assumptions and rationale" },
      { scenario: "Our design team is bottlenecked", persona: "Design Lead", outcome: "AI generates first drafts, designers refine - 3x more output" },
    ],
    personaValues: [
      { persona: "Product", value: "Visualize ideas faster. Get mockups without waiting for design availability." },
      { persona: "Engineering", value: "Clear specs with documented assumptions. Know what you're building and why." },
      { persona: "Executive", value: "Faster design cycles. Ship more without expanding headcount." },
    ],
    integrations: ["client-onboarding", "project-management", "analytics-feedback"],
  },
  {
    slug: "analytics-feedback",
    title: "Analytics & Feedback Loop",
    shortTitle: "Analytics & Feedback",
    tagline: "Measure everything, learn continuously",
    description:
      "Track user journeys from ad to conversion, run A/B tests, collect feedback, and let the system self-prioritize your backlog based on real data.",
    status: "coming-soon",
    problemStatement: {
      problem: "Teams ship features and never learn if they worked. Feedback is scattered and disconnected from original assumptions.",
      consequence: "Repeated mistakes, no continuous improvement, and a backlog that doesn't reflect what users actually need.",
      solution: "Nova closes the loop by tracking outcomes against assumptions and automatically surfacing new problems to solve.",
    },
    capabilities: [
      "Full user journey tracking (ad to signup to paid)",
      "Behavioral analytics (clicks, time, frustration signals)",
      "A/B testing infrastructure",
      "Automated user interview triggers",
      "Review collection and sentiment analysis",
      "Self-prioritizing backlog based on real data",
      "Content and copy optimization recommendations",
    ],
    workflow: [
      { step: 1, title: "Instrument", description: "Add tracking to capture user behavior" },
      { step: 2, title: "Monitor", description: "Watch how users interact with your solutions" },
      { step: 3, title: "Test", description: "Run experiments to optimize performance" },
      { step: 4, title: "Learn & Iterate", description: "Feed insights back into problem discovery" },
    ],
    benefits: [
      { icon: "trending", title: "Complete Picture", description: "See the full journey from first touch to retention" },
      { icon: "lightbulb", title: "Self-Improving", description: "System learns and reprioritizes automatically" },
      { icon: "chart", title: "Data-Driven", description: "Every decision backed by real user behavior" },
    ],
    useCases: [
      { scenario: "Did last quarter's features actually improve retention?", persona: "Product Manager", outcome: "Analytics show feature X improved retention 12%, feature Y had no impact" },
      { scenario: "Where are users dropping off?", persona: "Growth Lead", outcome: "Journey visualization shows the exact step where 40% abandon" },
      { scenario: "What should we build next quarter?", persona: "CEO", outcome: "Backlog auto-prioritizes based on biggest impact opportunities from real data" },
    ],
    personaValues: [
      { persona: "Product", value: "Know if your features worked. Learn from every release and compound improvements." },
      { persona: "Engineering", value: "See the impact of your work. Data proves whether solutions solved problems." },
      { persona: "Executive", value: "Continuous improvement machine. The more you use Nova, the better it gets at prioritizing." },
    ],
    integrations: ["problem-discovery", "project-management", "market-intelligence"],
  },
];

export function getFeatureBySlug(slug: string): FeatureModule | undefined {
  return features.find((f) => f.slug === slug);
}

export function getAdjacentFeatures(slug: string): {
  previous: { slug: string; title: string } | undefined;
  next: { slug: string; title: string } | undefined;
} {
  const index = features.findIndex((f) => f.slug === slug);
  const prevFeature = index > 0 ? features[index - 1] : undefined;
  const nextFeature = index >= 0 && index < features.length - 1 ? features[index + 1] : undefined;
  return {
    previous: prevFeature ? { slug: prevFeature.slug, title: prevFeature.shortTitle } : undefined,
    next: nextFeature ? { slug: nextFeature.slug, title: nextFeature.shortTitle } : undefined,
  };
}
