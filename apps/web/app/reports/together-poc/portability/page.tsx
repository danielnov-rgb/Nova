"use client";

import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

export default function PortabilityPage() {
  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Frontend Portability"
        subtitle="Technical analysis for backend migration and infrastructure handover"
        badge="Portability Report"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Executive Summary */}
      <ContentSection title="Executive Summary">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-300 mb-4">
            The 2gthr frontend is <strong className="text-white">highly portable</strong> due to its
            clean service-layer abstraction. All Firebase operations are isolated in dedicated service
            files, making backend replacement straightforward.
          </p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 font-semibold">Migration Estimate: 25-37 days</span>
            </div>
            <p className="text-sm text-gray-400">
              Engineering effort to fully decouple frontend from Firebase and connect to any backend.
            </p>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Architecture Diagram */}
      <ContentSection title="Current Architecture">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="space-y-4">
            {/* Frontend Layer */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-400 font-semibold mb-2">React Frontend (Vite)</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-800/50 rounded p-2 text-center text-xs text-gray-400">Pages</div>
                <div className="bg-gray-800/50 rounded p-2 text-center text-xs text-gray-400">Components</div>
                <div className="bg-gray-800/50 rounded p-2 text-center text-xs text-gray-400">Context</div>
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Service Layer */}
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
              <h4 className="text-primary-400 font-semibold mb-2">Service Layer (Abstraction Point)</h4>
              <div className="grid grid-cols-4 gap-2">
                {["firestore.js", "auth.js", "aiService.js", "evidenceService.js"].map((file) => (
                  <div key={file} className="bg-gray-800/50 rounded p-2 text-center text-xs text-gray-400">{file}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Firebase Layer */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Firebase Backend (Current)</h4>
              <div className="grid grid-cols-5 gap-2">
                {["Firestore", "Auth", "Storage", "Functions", "Vertex AI"].map((service) => (
                  <div key={service} className="bg-gray-800/50 rounded p-2 text-center text-xs text-gray-400">{service}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Service Layer Files */}
      <ContentSection title="Service Layer Files">
        <DataTable
          headers={["Service File", "Firebase Dependency", "Portability Notes"]}
          rows={[
            ["firebase.js", "Core - initializes Firebase", "Replace with new backend SDK init"],
            ["firestore.js", "Firestore (858 lines)", "All queries abstracted"],
            ["auth.js", "Firebase Auth", "Clean interface for auth operations"],
            ["evidenceService.js", "Storage + Firestore", "File uploads + metadata"],
            ["cvService.js", "Cloud Functions", "Calls serverless functions"],
            ["aiService.js", "Vertex AI (Gemini)", "AI model configuration"],
            ["progressService.js", <span key="1" className="text-green-400">None</span>, <span key="2" className="text-green-400">Pure JavaScript - fully portable</span>],
            ["badgeService.js", <span key="3" className="text-green-400">None</span>, <span key="4" className="text-green-400">Pure JavaScript - fully portable</span>],
            ["stridesService.js", <span key="5" className="text-green-400">None</span>, <span key="6" className="text-green-400">Pure JavaScript - fully portable</span>],
          ]}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Data Structures */}
      <ContentSection title="Core Data Entities">
        <CardGrid columns={3}>
          <InfoCard title="User" description="UID, email, displayName, isAdmin, allowedPaths" />
          <InfoCard title="Path" description="Learning journey with milestones and content" />
          <InfoCard title="Milestone" description="Grouped activities within a path" />
          <InfoCard title="GoCard" description="Individual learning activity (14 types)" />
          <InfoCard title="Progress" description="User progress on paths and cards" />
          <InfoCard title="Response" description="User submissions for quizzes, reflections" />
          <InfoCard title="Evidence" description="Uploaded files with AI analysis" />
          <InfoCard title="MyDNA Profile" description="User profile with aggregated stats" />
          <InfoCard title="Badge" description="Earned achievements with conditions" />
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Migration Effort */}
      <ContentSection title="Migration Effort Breakdown">
        <DataTable
          headers={["Task", "Effort", "Dependencies"]}
          rows={[
            ["Interface definitions", "2-3 days", "None"],
            ["Adapter pattern implementation", "5-7 days", "Interfaces"],
            ["Auth adapter", "3-5 days", "Auth system specs"],
            ["Data adapter", "5-7 days", "Database schema"],
            ["Storage adapter", "2-3 days", "Storage specs"],
            ["CV service migration", "3-5 days", "API endpoint"],
            ["Testing & validation", "5-7 days", "All adapters"],
          ]}
        />

        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-primary-400 font-semibold">Total Estimated Effort</span>
            <span className="text-2xl font-bold text-white">25-37 days</span>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Portability Assessment */}
      <ContentSection title="Portability Assessment">
        <h3 className="text-lg font-semibold text-white mb-4">Already Clean (No Changes Needed)</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "All React pages", "All UI components", "progressService.js",
            "badgeService.js", "stridesService.js", "React Router",
            "Tailwind CSS", "Vite build system"
          ].map((item) => (
            <span key={item} className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
              {item}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Requires Adapter Pattern (Medium Effort)</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "auth.js", "firestore.js", "evidenceService.js",
            "responseService.js", "myDNAService.js", "adminService.js"
          ].map((item) => (
            <span key={item} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-sm text-yellow-400">
              {item}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Requires Backend Replacement (Higher Effort)</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "cvService.js (Cloud Functions)",
            "aiService.js (Vertex AI)",
            "Firebase Hosting"
          ].map((item) => (
            <span key={item} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-sm text-red-400">
              {item}
            </span>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Key Strengths */}
      <ContentSection title="Key Strengths">
        <CardGrid columns={2}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                ✓
              </div>
              <div className="font-semibold text-white">Isolated Service Files</div>
            </div>
            <p className="text-sm text-gray-400">All Firebase operations in dedicated service files</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                ✓
              </div>
              <div className="font-semibold text-white">Clean UI Layer</div>
            </div>
            <p className="text-sm text-gray-400">No Firebase imports in pages or UI components</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                ✓
              </div>
              <div className="font-semibold text-white">Pure Logic Services</div>
            </div>
            <p className="text-sm text-gray-400">Progress, badges, strides - zero backend dependencies</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                ✓
              </div>
              <div className="font-semibold text-white">Clear Data Model</div>
            </div>
            <p className="text-sm text-gray-400">Well-defined entity relationships</p>
          </div>
        </CardGrid>
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
