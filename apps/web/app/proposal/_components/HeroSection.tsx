"use client";

import { useEffect, useState } from "react";
import { proposalMeta, executiveSummary } from "../_data/proposal-content";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="overview" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Confidential Proposal · {proposalMeta.date}
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
            {proposalMeta.title}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12">
          {proposalMeta.subtitle}
        </p>

        {/* Key stats */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {executiveSummary.keyFacts.map((fact) => (
            <div key={fact.label} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 md:px-8 md:py-5">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {fact.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {fact.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {proposalMeta.tagline}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-gray-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
