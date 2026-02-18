"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShowcaseNav } from "../../_components/ShowcaseNav";
import { AnimatedSection } from "../../_components/AnimatedSection";
import { roles, allRoleSlugs } from "../../_data/role-content";
import { platformFeatures } from "../../_data/showcase-content";

const defaultColors = { bg: "bg-primary-500/20", text: "text-primary-400", border: "border-primary-500/30", gradientFrom: "from-primary-400", gradientTo: "to-cyan-400" };
const colorMap: Record<string, { bg: string; text: string; border: string; gradientFrom: string; gradientTo: string }> = {
  primary: { bg: "bg-primary-500/20", text: "text-primary-400", border: "border-primary-500/30", gradientFrom: "from-primary-400", gradientTo: "to-cyan-400" },
  cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", gradientFrom: "from-cyan-400", gradientTo: "to-blue-400" },
  purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", gradientFrom: "from-purple-400", gradientTo: "to-pink-400" },
  green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", gradientFrom: "from-green-400", gradientTo: "to-emerald-400" },
  orange: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", gradientFrom: "from-orange-400", gradientTo: "to-yellow-400" },
  pink: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30", gradientFrom: "from-pink-400", gradientTo: "to-rose-400" },
};

export default function RolePage() {
  const params = useParams();
  const roleSlug = params.role as string;
  const role = roles[roleSlug];

  if (!role) {
    return (
      <>
        <ShowcaseNav />
        <div className="py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Role Not Found</h1>
          <p className="text-gray-400 mb-8">The role &quot;{roleSlug}&quot; doesn&apos;t exist.</p>
          <Link href="/showcase" className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors">
            Back to Overview
          </Link>
        </div>
      </>
    );
  }

  const colors = colorMap[role.color] ?? defaultColors;
  const relevantFeatures = platformFeatures.filter((f) => role.relevantFeatures.includes(f.id));

  return (
    <>
      <ShowcaseNav />

      {/* Hero */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Link
            href="/showcase#roles"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Roles
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className={`bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} bg-clip-text text-transparent`}>
              {role.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            {role.subtitle}
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Key Metrics */}
      <AnimatedSection id="metrics" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {role.keyMetrics.map((metric, index) => (
              <div key={metric.label} className={`bg-gray-900/50 border ${colors.border} rounded-xl p-5 text-center`}>
                <div className={`text-3xl font-bold ${colors.text}`}>{metric.value}</div>
                <div className="text-sm font-medium text-gray-300 mt-1">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.context}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Pain Points */}
      <AnimatedSection id="challenges" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Challenges You Face</h2>
          <p className="text-xl text-gray-400 mb-8">Common pain points we hear from leaders in your position</p>
          <div className="grid md:grid-cols-2 gap-4">
            {role.painPoints.map((point, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-sm text-gray-400">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Nova Answers */}
      <AnimatedSection id="solutions" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Nova Helps</h2>
          <p className="text-xl text-gray-400 mb-8">Specific capabilities mapped to your challenges</p>
          <div className="space-y-4">
            {role.novaAnswers.map((answer, index) => (
              <div key={index} className={`bg-gray-900/50 border ${colors.border} rounded-xl p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{answer.title}</h3>
                    <p className="text-gray-400">{answer.description}</p>
                  </div>
                  {answer.metric && (
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} text-sm font-medium whitespace-nowrap`}>
                      {answer.metric}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Relevant Features */}
      {relevantFeatures.length > 0 && (
        <>
          <AnimatedSection id="features" className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Relevant Platform Features</h2>
              <p className="text-xl text-gray-400 mb-8">Deep dives into the capabilities that matter most to you</p>
              <div className="space-y-4">
                {relevantFeatures.map((feature) => (
                  <div key={feature.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Capabilities</h4>
                        <ul className="space-y-1.5">
                          {feature.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <svg className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Technical</h4>
                        <ul className="space-y-1.5">
                          {feature.techDetails.map((t, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <svg className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </>
      )}

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {role.callToAction}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/showcase"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium rounded-xl hover:scale-105 transition-all"
            >
              Explore Full Platform
            </Link>
            <Link
              href="/showcase/case-study"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
            >
              Read the Case Study
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
