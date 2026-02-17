"use client";

import { AnimatedSection } from "./AnimatedSection";
import { flexibilityOptions, crossTeamIntegration } from "../_data/proposal-content";

export function FlexibilitySection() {
  return (
    <section id="flexibility" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Flexibility & Scope Adaptation
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Strategic flexibility to maximize value as priorities evolve
            </p>
          </div>
        </AnimatedSection>

        {/* Pivot Options */}
        <AnimatedSection className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">If priorities shift, the team can pivot to:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flexibilityOptions.map((option, index) => (
              <AnimatedSection key={option.title} delay={index * 80}>
                <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                  <div className="relative">
                    <h4 className="text-base font-semibold text-white mb-1.5">{option.title}</h4>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* Cross-Team Integration */}
        <AnimatedSection delay={200}>
          <h3 className="text-lg font-semibold text-white mb-6">Cross-Team Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Inbound */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-white">Inbound</h4>
              </div>
              <ul className="space-y-2.5">
                {crossTeamIntegration.inbound.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outbound */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-white">Outbound</h4>
              </div>
              <ul className="space-y-2.5">
                {crossTeamIntegration.outbound.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2">
            {crossTeamIntegration.focusAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300"
              >
                {area}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
