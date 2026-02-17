"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { investment } from "../_data/proposal-content";

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated.current) {
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

  return <span ref={ref}>R{displayValue.toLocaleString()}</span>;
}

const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export function InvestmentTimeline() {
  return (
    <section id="investment" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Investment & Timeline
            </h2>
          </div>
        </AnimatedSection>

        {/* Large total stat */}
        <AnimatedSection className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-2xl blur-xl opacity-30" />
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl px-12 py-8">
              <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedNumber value={investment.totalNumeric} />
              </div>
              <div className="text-lg text-gray-400 mt-2">
                Total 6-Month Investment
              </div>
              <div className="text-sm text-gray-500 mt-1">
                3 × {investment.perFDE}/mo × {investment.duration}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection delay={200} className="mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Engagement Timeline</h3>
            <div className="relative">
              {/* Progress bar */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full w-full" />
              </div>

              {/* Month markers */}
              <div className="flex justify-between mt-3">
                {months.map((month, i) => (
                  <div key={month} className="text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${i === 0 ? "bg-primary-400" : i === months.length - 1 ? "bg-cyan-400" : "bg-gray-600"}`} />
                    <span className="text-xs text-gray-400">{month}</span>
                    <div className="text-[10px] text-gray-600">2025</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly breakdown */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-xl font-bold text-white">{investment.monthly}</div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-xl font-bold text-white">{investment.perFDE}</div>
                <div className="text-xs text-gray-500 mt-1">per FDE/month</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-xl font-bold text-white">{investment.duration}</div>
                <div className="text-xs text-gray-500 mt-1">engagement</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* What This Delivers */}
        <AnimatedSection delay={300}>
          <h3 className="text-lg font-semibold text-white mb-4">What This Delivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investment.whatThisDelivers.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
