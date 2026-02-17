"use client";

import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

export default function SystemOverviewPage() {
  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Platform Overview"
        subtitle="Executive summary of the 2gthr platform architecture and capabilities"
        badge="System Overview"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* What is 2gthr */}
      <ContentSection title="What is 2gthr?">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-lg text-gray-300 mb-4">
            <strong className="text-white">2gthr</strong> is an AI-powered professional development platform
            that helps users build evidence of their skills and achievements to advance their careers.
          </p>
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mt-4">
            <h4 className="text-primary-400 font-semibold mb-2">The Problem It Solves</h4>
            <p className="text-gray-400 text-sm">
              Many professionals struggle to document and present their accomplishments effectively.
              2gthr provides structured learning paths, AI-powered tools, and evidence collection
              capabilities to close the gap between having skills and proving them.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">User Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: "1", label: "Sign Up", desc: "Complete onboarding" },
            { step: "2", label: "Discover", desc: "Browse learning paths" },
            { step: "3", label: "Progress", desc: "Complete Go-Cards" },
            { step: "4", label: "Earn", desc: "Strides & badges" },
            { step: "5", label: "Build", desc: "Evidence portfolio" },
            { step: "6", label: "Track", desc: "My DNA dashboard" },
          ].map((item) => (
            <div key={item.step} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold text-sm flex items-center justify-center mx-auto mb-2">
                {item.step}
              </div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Core Features */}
      <ContentSection title="Core User Features">
        <DataTable
          headers={["Feature", "Description", "Value to User"]}
          rows={[
            ["Learning Paths", "Structured journeys with milestones and activities", "Guided professional development"],
            ["Go-Cards", "Individual learning activities (12+ types)", "Bite-sized, engaging learning"],
            ["CV Builder", "AI-powered resume analysis and improvement", "Better job applications"],
            ["Evidence Collection", "Upload documents, get AI analysis", "Proof of achievements"],
            ["Co-Create", "Guided AI conversations to document achievements", "Easier evidence articulation"],
            ["Insights", "Personalized AI-generated feedback", "Actionable career guidance"],
            ["Progress Tracking", "Points (Strides), badges, completion status", "Motivation and gamification"],
          ]}
        />
      </ContentSection>

      <ContentSection title="Admin Features">
        <DataTable
          headers={["Feature", "Description"]}
          rows={[
            ["Content Management", "Create and edit paths, milestones, and activities"],
            ["Analytics Dashboard", "View user engagement, popular content, completion rates"],
            ["User Management", "Control which paths users can access"],
            ["Content Generator", "AI-assisted content creation from markdown"],
          ]}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Technology Stack */}
      <ContentSection title="Technology Stack">
        <h3 className="text-lg font-semibold text-white mb-4">Frontend (What Users See)</h3>
        <CardGrid columns={3}>
          <InfoCard title="React" description="User interface framework (industry standard)" />
          <InfoCard title="Tailwind CSS" description="Visual styling and design system" />
          <InfoCard title="Vite" description="Fast development and build tooling" />
        </CardGrid>

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Backend (Server & Data)</h3>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <span className="text-orange-400 font-bold">🔥</span>
            </div>
            <div>
              <div className="font-semibold text-white">Firebase</div>
              <div className="text-sm text-gray-400">Google's cloud platform</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: "Firestore", desc: "Database" },
              { name: "Authentication", desc: "User login" },
              { name: "Storage", desc: "File uploads" },
              { name: "Hosting", desc: "Deployment" },
              { name: "Cloud Functions", desc: "AI processing" },
            ].map((item) => (
              <div key={item.name} className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-sm font-medium text-white">{item.name}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Artificial Intelligence</h3>
        <CardGrid columns={2}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                ✨
              </div>
              <div>
                <div className="font-semibold text-white">Gemini 2.0 Flash</div>
                <div className="text-sm text-gray-400">Google (via Firebase)</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Real-time document analysis, insights generation, conversation AI
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                🤖
              </div>
              <div>
                <div className="font-semibold text-white">Claude</div>
                <div className="text-sm text-gray-400">Anthropic</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              CV analysis and generation, content parsing
            </p>
          </div>
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Key Metrics */}
      <ContentSection title="Key Metrics & Scale">
        <h3 className="text-lg font-semibold text-white mb-4">Current State (POC)</h3>
        <CardGrid columns={3}>
          <InfoCard title="Learning Paths" value="1" description="Land Your Next Job" />
          <InfoCard title="Milestones" value="6" description="Per learning path" />
          <InfoCard title="Go-Cards" value="29" description="Individual activities" />
          <InfoCard title="Activity Types" value="12" description="Articles, quizzes, tools, etc." />
          <InfoCard title="AI Tools" value="6" description="CV Builder, Interview Story Builder, etc." />
          <InfoCard title="Life Dimensions" value="5" description="Career, Health, Learning, etc." />
        </CardGrid>

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Technical Capacity</h3>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Database", value: "Scales to millions" },
              { label: "Storage", value: "Unlimited" },
              { label: "AI Processing", value: "On-demand" },
              { label: "Hosting", value: "Global CDN" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="text-white font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Security & Privacy */}
      <ContentSection title="Security & Privacy">
        <DataTable
          headers={["Aspect", "Implementation"]}
          rows={[
            ["Authentication", "Industry-standard Firebase Auth with optional Google sign-in"],
            ["Data Encryption", "All data encrypted in transit (HTTPS) and at rest"],
            ["Access Control", "Role-based permissions (user vs admin)"],
            ["Path Restrictions", "Users only see paths they're authorized to access"],
            ["AI Privacy", "Documents processed by AI are not stored by AI providers"],
          ]}
        />
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
