"use client";

import { useRef, useState, useEffect } from "react";
import { velocityComparison } from "../_data/report-content";

function ProgressBar({ delay, isVisible }: { delay: number; isVisible: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(100);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function VelocityComparison() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const totalWeeks = velocityComparison.reduce((acc, item) => {
    const match = item.traditional.match(/(\d+)-?(\d+)?/);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min;
      return acc + (min + max) / 2;
    }
    return acc;
  }, 0);

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Velocity Comparison
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Traditional team estimates vs Nova-powered delivery
          </p>
        </div>

        {/* Comparison header */}
        <div className={`grid grid-cols-12 gap-4 mb-6 px-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="col-span-5 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Category
          </div>
          <div className="col-span-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Traditional Estimate
          </div>
          <div className="col-span-3 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">
            Nova
          </div>
        </div>

        {/* Comparison rows */}
        <div className="space-y-3">
          {velocityComparison.map((item, index) => (
            <div
              key={item.category}
              className={`group grid grid-cols-12 gap-4 items-center bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:bg-gray-900 hover:border-gray-700 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="col-span-5">
                <div className="font-medium text-white">{item.category}</div>
                <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
              </div>
              <div className="col-span-4">
                <div className="text-red-400 font-semibold mb-2">{item.traditional}</div>
                <ProgressBar delay={(index + 3) * 100} isVisible={isVisible} />
              </div>
              <div className="col-span-3 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total comparison */}
        <div className={`mt-8 transition-all duration-700 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid grid-cols-12 gap-4 items-center bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="col-span-5">
              <div className="text-xl font-bold text-white">TOTAL</div>
              <div className="text-sm text-gray-400 mt-1">Cumulative delivery time</div>
            </div>
            <div className="col-span-4">
              <div className="text-3xl font-bold text-red-400">17-24 weeks</div>
              <div className="text-sm text-gray-500 mt-1">~{Math.round(totalWeeks)} weeks average</div>
            </div>
            <div className="col-span-3 text-right">
              <div className="text-3xl font-bold text-green-400">3 weeks</div>
              <div className="text-sm text-gray-500 mt-1">POC period</div>
            </div>
          </div>
        </div>

        {/* Acceleration badge */}
        <div className={`flex justify-center mt-8 transition-all duration-700 delay-1200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              6-8x
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Acceleration Factor</div>
              <div className="text-gray-400 text-sm">Across all categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
