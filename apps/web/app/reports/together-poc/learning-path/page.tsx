"use client";

import { useState } from "react";
import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

const milestones = [
  {
    id: 1,
    title: "Define Your Target & Map the Evidence Gap",
    duration: "1.5 hrs",
    strides: 38,
    cards: 5,
    outcomes: [
      "Understand why qualified candidates fail",
      "Learn the 5 evidence surfaces",
      "Identify 1-3 target roles",
      "Complete evidence audit",
    ],
  },
  {
    id: 2,
    title: "Transform Your Resume with SOAR",
    duration: "2 hrs",
    strides: 38,
    cards: 4,
    outcomes: [
      "Master SOAR methodology",
      "Identify and rewrite 3 weakest bullets",
      "Produce Resume v1 with impact statements",
    ],
  },
  {
    id: 3,
    title: "Build Your Proof-of-Work Portfolio",
    duration: "4-6 hrs",
    strides: 65,
    cards: 5,
    outcomes: [
      "Understand quick-proof projects",
      "Create Artifact 1 from existing achievement",
      "Create Artifact 2 (quick-proof project)",
    ],
  },
  {
    id: 4,
    title: "Optimize Your Digital Presence",
    duration: "2.5 hrs",
    strides: 55,
    cards: 5,
    outcomes: [
      "Rewrite LinkedIn headline and About section",
      "Learn 4-paragraph cover letter framework",
      "Write role-specific cover letter",
    ],
  },
  {
    id: 5,
    title: "Validate & Stress-Test Your Evidence",
    duration: "3.5 hrs",
    strides: 63,
    cards: 6,
    outcomes: [
      "Complete peer review exchange",
      "Produce Resume v2 incorporating feedback",
      "Build interview story frameworks",
    ],
  },
  {
    id: 6,
    title: "Deploy, Learn, Iterate",
    duration: "5-8 hrs",
    strides: 50,
    cards: 4,
    outcomes: [
      "Learn strategic deployment (10-3-1 rule)",
      "Apply to 3 real roles",
      "Measure growth from M1 baseline",
    ],
  },
];

export default function LearningPathPage() {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Learning Path Breakdown"
        subtitle="Land Your Next Job: The Evidence-Based Approach"
        badge="Land Your Next Job"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Path Overview */}
      <ContentSection title="Path Overview">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Who This Path Is For</h3>
          <p className="text-gray-400 mb-4">
            Professionals at any career stage who struggle to get callbacks despite being qualified,
            document and articulate their achievements, and stand out in a competitive job market.
          </p>
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
            <h4 className="text-primary-400 font-semibold mb-2">The Problem: The Evidence Deficit</h4>
            <p className="text-sm text-gray-400">
              Most job seekers fail not because they lack skills, but because they lack evidence.
              This path addresses the gap between what professionals can do and what they can prove
              to a stranger in under seven seconds.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">What You'll Have Upon Completion</h3>
        <CardGrid columns={3}>
          <InfoCard title="SOAR-Transformed CV" description="Quantified impact statements" />
          <InfoCard title="2 Portfolio Artifacts" description="Experience + quick-proof project" />
          <InfoCard title="Optimized LinkedIn" description="Passive evidence platform" />
          <InfoCard title="Cover Letter Template" description="4-paragraph evidence-based" />
          <InfoCard title="Interview Stories" description="Structured for verbal delivery" />
          <InfoCard title="3 Real Applications" description="Full evidence packages deployed" />
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Path Statistics */}
      <ContentSection title="Path Statistics">
        <CardGrid columns={3}>
          <InfoCard title="Milestones" value="6" />
          <InfoCard title="Go-Cards" value="29" description="Activities" />
          <InfoCard title="Total Strides" value="469" description="Points available" />
          <InfoCard title="Estimated Duration" value="12-16" description="Hours" />
          <InfoCard title="Difficulty" value="Beginner" />
          <InfoCard title="Dimension" value="Career" />
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Milestone Breakdown */}
      <ContentSection title="Milestone Breakdown">
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
            >
              <button
                onClick={() => setExpandedMilestone(expandedMilestone === milestone.id ? null : milestone.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 font-bold flex items-center justify-center">
                    {milestone.id}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{milestone.title}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-3 mt-1">
                      <span>{milestone.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{milestone.cards} cards</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                      <span>{milestone.strides} strides</span>
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedMilestone === milestone.id ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedMilestone === milestone.id && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3">
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {milestone.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Gamification */}
      <ContentSection title="Gamification & Rewards">
        <h3 className="text-lg font-semibold text-white mb-4">Strides Distribution</h3>
        <DataTable
          headers={["Milestone", "Strides Available", "% of Total"]}
          rows={[
            ["M1: Define Your Target", "38", "8%"],
            ["M2: Transform Resume", "38", "8%"],
            ["M3: Build Portfolio", "65", "14%"],
            ["M4: Digital Presence", "55", "12%"],
            ["M5: Validate Evidence", "63", "13%"],
            ["M6: Deploy & Iterate", "50", "11%"],
          ]}
        />

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Badge System</h3>
        <CardGrid columns={2}>
          <InfoCard title="Activity Badges" description="Complete specific go-cards (e.g., Gap Analyst, Quick Prover)" />
          <InfoCard title="Knowledge Badges" description="Complete all articles/videos in a milestone" />
          <InfoCard title="Milestone Badges" description="Complete all essential activities (All Clear)" />
          <InfoCard title="Path Badge" description="Complete entire path with all badges (Evidence Champion)" />
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Key Concepts */}
      <ContentSection title="Key Concepts Taught">
        <DataTable
          headers={["Concept", "First Introduced", "Applied In"]}
          rows={[
            ["Evidence Deficit", "M1 Article", "Throughout"],
            ["5 Evidence Surfaces", "M1 Article", "M1-M6"],
            ["SOAR Method", "M2 Article", "CV, LinkedIn, Cover Letter, Interviews"],
            ["Quick-Proof Projects", "M3 Article", "M3 Evidence cards"],
            ["4-Paragraph Cover Letter", "M4 Article", "M4 Evidence card"],
            ["Blind Spots & Peer Review", "M5 Article", "M5 Evidence card"],
            ["10-3-1 Rule", "M6 Article", "M6 Evidence card"],
          ]}
        />
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
