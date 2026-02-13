"use client";

import { useEffect, useState, useRef } from "react";
import { headlineMetrics } from "../_data/report-content";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {displayValue.toLocaleString()}{suffix}
    </div>
  );
}

export function MetricsGrid() {
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

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Was Delivered
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A production-grade learning platform with comprehensive features
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {headlineMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900 hover:border-gray-700 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />

              <div className="relative">
                <AnimatedNumber value={metric.value} suffix={metric.suffix} />
                <div className="text-sm text-gray-400 mt-2">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary badge */}
        <div className={`flex justify-center mt-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
            <span className="text-primary-400 font-semibold">35,000+</span>
            <span className="text-gray-300">lines of production code</span>
          </div>
        </div>
      </div>
    </section>
  );
}
