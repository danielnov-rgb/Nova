"use client";

import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

const categories = [
  {
    name: "Core Platform Foundation",
    traditional: "2-3 weeks",
    items: ["React 18 + Vite scaffold", "Firebase integration", "Auth system", "Firestore data layer", "Service abstraction"],
  },
  {
    name: "Go-Card Engine (11 types)",
    traditional: "4-6 weeks",
    items: ["Polymorphic content system", "11 distinct card types", "Shared components", "Completion tracking"],
  },
  {
    name: "AI-Powered Tools (6 tools)",
    traditional: "4-5 weeks",
    items: ["CV Builder", "Interview Story Builder", "Quick Proof Generator", "Role Evidence Matcher", "Evidence Co-Create"],
  },
  {
    name: "Path Navigation System",
    traditional: "2-3 weeks",
    items: ["Home dashboard", "Discover page", "Path/Milestone views", "Progress system", "Jump Back In"],
  },
  {
    name: "User Profile (MyDNA)",
    traditional: "1.5-2 weeks",
    items: ["Profile sections", "Inline editing", "Stats aggregation", "Badge display", "Onboarding flow"],
  },
  {
    name: "Design System & Theming",
    traditional: "1.5-2 weeks",
    items: ["50+ design tokens", "Light/dark mode", "Figma MCP integration", "Component migration"],
  },
  {
    name: "Admin Infrastructure",
    traditional: "1-2 weeks",
    items: ["Role checking", "Protected routes", "Seed data page", "User management", "Content generator"],
  },
  {
    name: "Analytics & Tracking",
    traditional: "0.5-1 week",
    items: ["Page view tracking", "Event logging", "Session tracking", "Batch event queue"],
  },
];

const workflowExamples = [
  {
    title: "Go-Card Type Implementation",
    traditional: "15-24 days per type × 11 types = 33-52 weeks",
    nova: "Single session per type with inline iteration",
    eliminated: ["Design handoff documentation", "BA specification writing", "Asynchronous review cycles", "Bug ticket triage"],
  },
  {
    title: "AI Tool Development (CV Builder)",
    traditional: "26-39 days per tool × 6 tools = 31-47 weeks",
    nova: "Design and implement with prompt engineering inline",
    eliminated: ["ML specialist bottleneck", "Backend/frontend coordination", "Prompt documentation handoff", "Separate integration testing"],
  },
  {
    title: "Design System Migration",
    traditional: "27-41 days",
    nova: "Single pass: define tokens and migrate components",
    eliminated: ["Token taxonomy review meetings", "Batch-based migration", "Visual regression testing", "Separate documentation"],
  },
];

export default function VelocityPage() {
  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Development Velocity"
        subtitle="Quantifying scope delivered and comparing Nova-powered delivery against traditional methods"
        badge="Velocity Report"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Headline Metrics */}
      <ContentSection title="Headline Metrics">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400">103</div>
              <div className="text-sm text-gray-400">Components Built</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">11</div>
              <div className="text-sm text-gray-400">Go-Card Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">6</div>
              <div className="text-sm text-gray-400">AI-Powered Tools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">35K+</div>
              <div className="text-sm text-gray-400">Lines of Code</div>
            </div>
          </div>
        </div>

        <CardGrid columns={3}>
          <InfoCard title="Learning Paths" value="1" />
          <InfoCard title="Milestones" value="6" />
          <InfoCard title="Go-Cards Authored" value="29" />
          <InfoCard title="Service Modules" value="15" />
          <InfoCard title="Custom Hooks" value="12" />
          <InfoCard title="Design Tokens" value="50+" />
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Acceleration Headline */}
      <ContentSection title="Acceleration Factor">
        <div className="bg-gradient-to-r from-primary-900/30 to-cyan-900/30 border border-primary-700/30 rounded-2xl p-8 text-center">
          <div className="text-6xl md:text-7xl font-bold text-white mb-4">
            6-8<span className="text-primary-400">x</span>
          </div>
          <div className="text-xl text-gray-300 mb-6">Faster than traditional delivery</div>
          <div className="flex justify-center gap-8">
            <div>
              <div className="text-sm text-gray-500">Traditional Estimate</div>
              <div className="text-2xl font-bold text-gray-400">17-24 weeks</div>
            </div>
            <div className="w-px bg-gray-700" />
            <div>
              <div className="text-sm text-gray-500">Nova-Powered</div>
              <div className="text-2xl font-bold text-primary-400">3 weeks</div>
            </div>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Category Breakdown */}
      <ContentSection title="Category-by-Category Breakdown">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{category.name}</h3>
                <span className="text-sm text-gray-500">Traditional: {category.traditional}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-primary-400 font-semibold">Traditional Total Estimate</span>
            <span className="text-2xl font-bold text-white">17-24 weeks</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">~20 weeks average</p>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Workflow Compression */}
      <ContentSection title="Workflow Compression Examples">
        <div className="space-y-6">
          {workflowExamples.map((example) => (
            <div key={example.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">{example.title}</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Traditional</div>
                  <div className="text-sm text-gray-300">{example.traditional}</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Nova-Powered</div>
                  <div className="text-sm text-gray-300">{example.nova}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">What was eliminated:</div>
                <div className="flex flex-wrap gap-2">
                  {example.eliminated.map((item) => (
                    <span key={item} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 line-through">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* What Acceleration Represents */}
      <ContentSection title="What the Acceleration Represents">
        <p className="text-gray-300 mb-6">
          The 6-8x acceleration factor is not simply "coding faster." It represents compression
          across the entire delivery lifecycle:
        </p>
        <CardGrid columns={2}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="text-primary-400 font-semibold mb-2">Requirements → Implementation</h4>
            <p className="text-sm text-gray-400">Reduced from weeks to hours</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">Design → Code</h4>
            <p className="text-sm text-gray-400">Figma MCP eliminated handoff delays</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="text-green-400 font-semibold mb-2">Iteration Cycles</h4>
            <p className="text-sm text-gray-400">Continuous refinement vs. discrete review gates</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="text-purple-400 font-semibold mb-2">Specialist Dependencies</h4>
            <p className="text-sm text-gray-400">AI/ML work embedded in feature development</p>
          </div>
        </CardGrid>

        <div className="bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-6 mt-8">
          <p className="text-lg text-gray-300 italic text-center">
            "The result is not just faster delivery, but a different delivery model where the gap
            between 'what we want' and 'what exists' is measured in hours rather than sprints."
          </p>
        </div>
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
