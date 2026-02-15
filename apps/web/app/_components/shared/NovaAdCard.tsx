"use client";

import { useRef, useState, useEffect } from "react";

const novaCapabilities = [
  {
    title: "Assumption Tracking",
    description: "Nova identifies key assumptions and understands what insights are needed to inform product strategy and UX",
  },
  {
    title: "Built-in Analytics",
    description: "Features launch with analytics already integrated, continuously tracking performance post-launch",
  },
  {
    title: "Visible Backlog",
    description: "Nova manages a transparent backlog, involving humans where key decisions need to be made",
  },
  {
    title: "Evidence-Based Decisions",
    description: "Collects data and evidence trails so decisions are informed, not assumed",
  },
  {
    title: "A/B Testing",
    description: "Test different user experiences (content, designs, gen-AI, imagery, color schemes) to optimize for adoption, retention, and referrals",
  },
  {
    title: "Design System Evolution",
    description: "Humans configure how much \"play\" Nova has to deviate. When better designs are discovered, Nova brings them back into the design system for review and propagates changes across all components",
  },
];

/**
 * NovaAdCard - Promotional card component for Nova platform
 *
 * Use this component to advertise Nova's value proposition within reports
 * and client-facing pages. The card follows the Nova advertising guidelines.
 *
 * Structure:
 * 1. Page break / visual separator
 * 2. "Advertisement" badge + "Powered by Nova" intro
 * 3. Full card with problem statement and Nova solution
 *
 * Styling:
 * - Bright blue border (border-2 border-primary-500)
 * - Animated glow effect
 * - Dark theme optimized
 */
export function NovaAdCard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Page break / visual separator */}
      <div className="py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
      </div>

      {/* Small Nova intro banner */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 text-xs font-medium text-primary-400 bg-primary-500/10 border border-primary-500/30 rounded-full mb-4">
          Advertisement
        </span>
        <p className="text-sm text-gray-500 mb-2">Powered by</p>
        <h3 className="text-2xl font-bold text-white mb-3">
          Nova Product Intelligence Platform
        </h3>
        <p className="text-gray-400 max-w-xl mx-auto">
          Nova doesn't just help you prioritize what to build. It helps you build it faster,
          measure it properly, and improve it continuously through AI that gets smarter with every sprint.
        </p>
      </div>

      {/* Main card with bright blue border */}
      <div className="relative">
        {/* Animated glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />

        {/* Card with bright blue border */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-primary-500 rounded-3xl overflow-hidden shadow-lg shadow-primary-500/10">
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-primary-500 via-cyan-400 to-primary-500" />

          <div className="p-8 md:p-12">
            {/* Problem Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider">
                  The Problem with Features
                </h3>
              </div>

              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  In traditional development, ideas turn into features without a true understanding of whether people want the solution, or if the solution was built the right way.
                </p>
                <p>
                  Once features make it into the backlog, key assumptions are rarely documented or tested. Once live, features leave the backlog - meaning they don't get monitored for performance (or even harm they cause through user frustration or churn).
                </p>
                <p>
                  Features aren't treated like products. Instead of continuous improvement, teams stack more functionality, causing <span className="text-red-400 font-medium">feature bloat</span> and a <span className="text-red-400 font-medium">subpar experience for everyone</span>.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent mb-10" />

            {/* Solution Section */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text text-transparent">
                      Nova: AI Product Owners
                    </span>
                  </h3>
                  <p className="text-gray-400 mt-1">for every feature</p>
                </div>
              </div>

              <p className="text-lg text-gray-300 mb-8">
                Nova deploys leading AI agents to act as <span className="text-primary-400 font-semibold">product owners for every feature</span>.
              </p>

              {/* Capabilities Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {novaCapabilities.map((capability, index) => (
                  <div
                    key={capability.title}
                    className={`group bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-primary-500/30 hover:bg-gray-800/70 transition-all duration-300 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary-500/30 transition-colors">
                        <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{capability.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{capability.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <a
                  href="https://nova.demo"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-xl text-white font-semibold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300"
                >
                  <span>Learn More About Nova</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
