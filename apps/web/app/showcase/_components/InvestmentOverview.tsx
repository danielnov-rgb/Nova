"use client";

import { useRef, useState, useEffect } from "react";
import { investmentSummary } from "../_data/showcase-content";

function AnimatedCurrency({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplay(value);
              clearInterval(timer);
            } else {
              setDisplay(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
      R{display.toLocaleString()}
    </div>
  );
}

export function InvestmentOverview() {
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

  return (
    <section ref={sectionRef} id="investment" className="py-24 px-4 bg-gray-900/30">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Investment & Value
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            What the engagement delivers and what it costs
          </p>
        </div>

        {/* Big number */}
        <div className={`text-center mb-12 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <AnimatedCurrency value={investmentSummary.totalNumeric} />
          <div className="text-xl text-gray-400 mt-2">Total 6-month engagement</div>
          <div className="text-gray-500 mt-1">
            {investmentSummary.teamSize} FDEs × {investmentSummary.perFDE}/mo × {investmentSummary.duration}
          </div>
        </div>

        {/* Stats row */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { label: "Monthly", value: investmentSummary.monthly },
            { label: "Per FDE", value: investmentSummary.perFDE },
            { label: "Team Size", value: `${investmentSummary.teamSize} FDEs` },
            { label: "Duration", value: investmentSummary.duration },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* What this delivers */}
        <div className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="text-xl font-bold text-white text-center mb-8">What This Delivers</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {investmentSummary.deliverables.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
