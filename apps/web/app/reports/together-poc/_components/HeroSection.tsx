"use client";

import { useEffect, useState } from "react";
import { reportMeta } from "../_data/report-content";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Generated February 2026
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          <span className="text-white">{reportMeta.title}</span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-400 mb-12">
          {reportMeta.subtitle}
        </p>

        {/* Acceleration stat */}
        <div className="relative inline-block mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl px-12 py-8">
            <div className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              {reportMeta.accelerationFactor}
            </div>
            <div className="text-xl text-gray-400 mt-2">
              Faster than traditional delivery
            </div>
          </div>
        </div>

        {/* Comparison line */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          What takes traditional teams{" "}
          <span className="text-red-400 font-semibold">{reportMeta.traditionalEstimate}</span>,
          delivered in{" "}
          <span className="text-green-400 font-semibold">{reportMeta.pocPeriod}</span>
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
