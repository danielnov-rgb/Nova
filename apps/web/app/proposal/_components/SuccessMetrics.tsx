"use client";

import { AnimatedSection } from "./AnimatedSection";
import { successMetrics } from "../_data/proposal-content";

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  green: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  primary: { bg: "bg-primary-500/10", text: "text-primary-400", dot: "bg-primary-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
};

const categoryIcons: Record<string, React.ReactNode> = {
  Delivery: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  Quality: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  Impact: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Efficiency: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function SuccessMetrics() {
  return (
    <section id="metrics" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Metrics
            </h2>
            <p className="text-xl text-gray-400">
              How we measure and report on engagement outcomes
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {successMetrics.map((metric, index) => {
            const colors = colorMap[metric.color] ?? colorMap.primary!;
            return (
              <AnimatedSection key={metric.category} delay={index * 100}>
                <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${colors!.bg} flex items-center justify-center ${colors!.text}`}>
                        {categoryIcons[metric.category]}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{metric.category} Metrics</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {metric.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors!.dot} flex-shrink-0`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
