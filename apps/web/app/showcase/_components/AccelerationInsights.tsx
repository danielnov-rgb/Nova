"use client";

import { useRef, useState, useEffect } from "react";
import { accelerationData } from "../_data/showcase-content";

function ProgressBar({ percentage, delay, isVisible }: { percentage: number; delay: number; isVisible: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setWidth(percentage), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, percentage]);

  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function AccelerationInsights() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const maxWeeks = Math.max(...accelerationData.map((d) => d.traditionalWeeks));

  return (
    <section ref={sectionRef} id="acceleration" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Velocity Comparison
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Traditional team estimates vs Nova-powered delivery
          </p>
        </div>

        {/* Header row */}
        <div className={`hidden md:grid grid-cols-12 gap-4 mb-6 px-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="col-span-5 text-sm font-semibold text-gray-400 uppercase tracking-wider">Category</div>
          <div className="col-span-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Traditional</div>
          <div className="col-span-3 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Nova</div>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {accelerationData.map((item, index) => (
            <div
              key={item.category}
              className={`group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:bg-gray-900 hover:border-gray-700 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="md:col-span-5">
                <div className="font-medium text-white">{item.category}</div>
                <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
              </div>
              <div className="md:col-span-4">
                <div className="text-red-400 font-semibold mb-2">{item.traditional}</div>
                <ProgressBar
                  percentage={(item.traditionalWeeks / maxWeeks) * 100}
                  delay={(index + 3) * 100}
                  isVisible={isVisible}
                />
              </div>
              <div className="md:col-span-3 md:text-right">
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

        {/* Total */}
        <div className={`mt-8 transition-all duration-700 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-700 rounded-xl p-6">
            <div className="md:col-span-5">
              <div className="text-xl font-bold text-white">TOTAL</div>
              <div className="text-sm text-gray-400 mt-1">Cumulative delivery time</div>
            </div>
            <div className="md:col-span-4">
              <div className="text-3xl font-bold text-red-400">17-24 weeks</div>
            </div>
            <div className="md:col-span-3 md:text-right">
              <div className="text-3xl font-bold text-green-400">3 weeks</div>
            </div>
          </div>
        </div>

        {/* Badge */}
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
