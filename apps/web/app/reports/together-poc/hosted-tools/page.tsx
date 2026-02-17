"use client";

import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

const tools = [
  {
    name: "CV Builder",
    ai: "Claude API",
    complexity: "Medium",
    sensitivity: "High (PII)",
    phases: ["Upload", "Analysis", "Improve", "Download"],
    description: "Multi-step CV analysis and generation wizard with AI-powered feedback",
  },
  {
    name: "Interview Story Builder",
    ai: "Vertex AI (Gemini)",
    complexity: "Medium",
    sensitivity: "Medium",
    phases: ["Prefilling", "Input", "Analyzing", "Questions"],
    description: "Generates personalized interview questions based on user's evidence",
  },
  {
    name: "Quick Proof Generator",
    ai: "Vertex AI (Gemini)",
    complexity: "Low",
    sensitivity: "Medium",
    phases: ["Input", "Analyzing", "Projects"],
    description: "Generates proof statements matching evidence to job requirements",
  },
  {
    name: "Role Evidence Matcher",
    ai: "Vertex AI (Gemini)",
    complexity: "Low",
    sensitivity: "Low",
    phases: ["Input", "Rating", "Gap Analysis"],
    description: "Matches collected evidence against role requirements",
  },
  {
    name: "Evidence Mapper",
    ai: "None (client-side)",
    complexity: "Low",
    sensitivity: "Low",
    phases: ["Organize"],
    description: "Category-based evidence collection and organization tool",
  },
];

export default function HostedToolsPage() {
  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Hosted Tools Architecture"
        subtitle="How interactive tools can be hosted as independent microservices"
        badge="Tools Architecture"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Executive Summary */}
      <ContentSection title="Executive Summary">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-300 mb-4">
            Nova's interactive tools can be extracted from the current monolithic React application
            and hosted as independent microservices. This enables:
          </p>
          <CardGrid columns={2}>
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
              <h4 className="text-primary-400 font-semibold mb-1">White-label Deployment</h4>
              <p className="text-sm text-gray-400">Deploy within Accenture's infrastructure</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-1">Data Sovereignty</h4>
              <p className="text-sm text-gray-400">Compliance through isolated service boundaries</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-1">Scalable AI Workloads</h4>
              <p className="text-sm text-gray-400">Separated from the main application</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-1">Secure Data Exchange</h4>
              <p className="text-sm text-gray-400">OAuth2 and encrypted REST APIs</p>
            </div>
          </CardGrid>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Tools Overview */}
      <ContentSection title="Independently Hostable Tools">
        <DataTable
          headers={["Tool", "AI Dependency", "Complexity", "Data Sensitivity"]}
          rows={tools.map((tool) => [
            tool.name,
            tool.ai,
            <span key={`c-${tool.name}`} className={`px-2 py-0.5 rounded text-xs ${tool.complexity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
              {tool.complexity}
            </span>,
            <span key={`s-${tool.name}`} className={`px-2 py-0.5 rounded text-xs ${tool.sensitivity === "High (PII)" ? "bg-red-500/20 text-red-400" : tool.sensitivity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
              {tool.sensitivity}
            </span>,
          ])}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Tool Details */}
      <ContentSection title="Tool Details">
        <div className="space-y-4">
          {tools.map((tool) => (
            <div key={tool.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{tool.name}</h3>
                <span className="text-xs text-gray-500">{tool.ai}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
              <div className="flex items-center gap-2">
                {tool.phases.map((phase, i) => (
                  <div key={phase} className="flex items-center">
                    <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{phase}</span>
                    {i < tool.phases.length - 1 && (
                      <svg className="w-4 h-4 text-gray-600 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Security Controls */}
      <ContentSection title="Security Controls">
        <CardGrid columns={2}>
          <InfoCard title="Encryption in Transit" description="TLS 1.3 required for all API communications" />
          <InfoCard title="Encryption at Rest" description="AES-256-GCM with AWS/Google Cloud KMS" />
          <InfoCard title="Token Authentication" description="JWT validation with RS256/ES256 algorithms" />
          <InfoCard title="Audit Logging" description="Full request/response logging with PII masking" />
        </CardGrid>

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Rate Limiting Tiers</h3>
        <DataTable
          headers={["Tier", "Requests/Min", "Requests/Day", "Max Payload"]}
          rows={[
            ["Free", "10", "100", "1MB"],
            ["Standard", "60", "1,000", "5MB"],
            ["Enterprise", "300", "10,000", "10MB"],
          ]}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* REST API Endpoints */}
      <ContentSection title="REST API Endpoints">
        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="font-mono text-sm text-primary-400 mb-2">POST /api/v1/cv/analyze</h4>
            <p className="text-sm text-gray-400 mb-3">Analyze CV content and return strengths, gaps, and follow-up questions</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Request:</span>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto">
{`{
  "cvText": "string",
  "jobDescription": "string?"
}`}
                </pre>
              </div>
              <div>
                <span className="text-gray-500">Response:</span>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto">
{`{
  "strengths": [...],
  "gaps": [...],
  "overallScore": 85
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="font-mono text-sm text-primary-400 mb-2">POST /api/v1/interview/generate</h4>
            <p className="text-sm text-gray-400 mb-3">Generate personalized interview questions based on role and evidence</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Request:</span>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto">
{`{
  "role": "string",
  "evidenceContext": "string",
  "questionCount": 5
}`}
                </pre>
              </div>
              <div>
                <span className="text-gray-500">Response:</span>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 overflow-x-auto">
{`{
  "questions": [{
    "question": "...",
    "category": "...",
    "tips": [...]
  }]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Implementation Roadmap */}
      <ContentSection title="Implementation Roadmap">
        <div className="space-y-4">
          {[
            { phase: "Phase 1", title: "Foundation", weeks: "1-4", tasks: ["API gateway setup", "OAuth2 validation", "CV Builder service", "Staging deployment"] },
            { phase: "Phase 2", title: "Security Hardening", weeks: "5-6", tasks: ["Rate limiting", "Audit logging", "Encryption at rest", "Penetration testing"] },
            { phase: "Phase 3", title: "Evidence Services", weeks: "7-8", tasks: ["Evidence Analysis service", "Interview Builder service", "Vertex AI integration"] },
            { phase: "Phase 4", title: "Production", weeks: "9-10", tasks: ["Multi-region deployment", "CDN configuration", "Monitoring dashboards", "API documentation"] },
            { phase: "Phase 5", title: "Handover", weeks: "11-12", tasks: ["Integration testing", "Training sessions", "SLA establishment", "Go-live support"] },
          ].map((item) => (
            <div key={item.phase} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs font-medium">{item.phase}</span>
                  <span className="font-semibold text-white">{item.title}</span>
                </div>
                <span className="text-sm text-gray-500">Weeks {item.weeks}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tasks.map((task) => (
                  <span key={task} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{task}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Infrastructure Costs */}
      <ContentSection title="Estimated Infrastructure Costs">
        <DataTable
          headers={["Component", "Monthly Cost (USD)"]}
          rows={[
            ["Kubernetes (3 nodes × 2 regions)", "$600"],
            ["Redis Cluster (2 regions)", "$200"],
            ["API Gateway", "$150"],
            ["CloudFlare/CDN", "$100"],
            ["Logging/Monitoring", "$150"],
            ["AI API Usage (Claude + Vertex)", "$500-2,000*"],
            [<strong key="total">Total</strong>, <strong key="total-value">$1,700-3,200</strong>],
          ]}
        />
        <p className="text-xs text-gray-500 mt-2">*AI costs vary significantly based on usage volume.</p>
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
