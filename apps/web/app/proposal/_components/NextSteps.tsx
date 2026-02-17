"use client";

import { AnimatedSection } from "./AnimatedSection";
import { nextSteps, contact } from "../_data/proposal-content";
import { trackEvent } from "../_lib/posthog";

export function NextSteps() {
  return (
    <section id="next-steps" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Next Steps
            </h2>
            <p className="text-xl text-gray-400">
              Four steps to get started
            </p>
          </div>
        </AnimatedSection>

        {/* Steps */}
        <AnimatedSection delay={100} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {nextSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Arrow connector between cards (desktop only) */}
                {index < nextSteps.length - 1 && (
                  <div className="absolute top-6 -right-2.5 hidden md:block z-10">
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                )}

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-cyan-500/20 border border-primary-500/30 flex items-center justify-center mb-4">
                    <span className="text-sm font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Contact CTA */}
        <AnimatedSection delay={300}>
          <div className="relative">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-cyan-500/30 rounded-3xl blur-xl" />

            <div className="relative bg-gray-900/90 backdrop-blur border border-gray-700/50 rounded-3xl p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Accelerate?
              </h3>
              <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
                Let&apos;s discuss how to bring the Forward Deployed team to 2gthr
              </p>

              <a
                href={`mailto:${contact.email}`}
                onClick={() => trackEvent("proposal_cta_clicked", { action: "email" })}
                className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl text-white font-semibold text-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300"
              >
                <svg className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Get in Touch with {contact.name}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection delay={400}>
          <div className="mt-16 text-center">
            <div className="text-gray-600 text-sm">
              Generated with Nova Product Intelligence Platform
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <span>February 2026</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>Confidential</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>Version 1.0</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
