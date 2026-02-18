"use client";

import { useEffect, useState } from "react";
import { showcaseMeta, proofNumbers } from "../_data/showcase-content";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroStats = proofNumbers.slice(0, 4);

  return (
    <section id="overview" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />

      <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {showcaseMeta.badge} · {showcaseMeta.date}
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
            {showcaseMeta.title}
          </span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-4">
          {showcaseMeta.subtitle}
        </p>
        <p className="text-xl md:text-2xl text-gray-500 mb-12">
          {showcaseMeta.tagline}
        </p>

        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {heroStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold text-white">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
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
