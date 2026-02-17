"use client";

import { AnimatedSection } from "./AnimatedSection";
import { ipOwnership } from "../_data/proposal-content";

export function IPOwnership() {
  return (
    <section id="ip" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Intellectual Property & Ownership
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Clear ownership boundaries with complete transparency
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Accenture Owns */}
          <AnimatedSection delay={100}>
            <div className="bg-gray-900/50 border border-cyan-800/50 rounded-xl p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">What Accenture Owns</h3>
                  <p className="text-xs text-cyan-400">100% rights to all deliverables</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {ipOwnership.accentureOwns.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Unrestricted Rights</h4>
                <ul className="space-y-1.5">
                  {ipOwnership.accentureRights.map((right) => (
                    <li key={right} className="text-xs text-gray-400 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* Nova Retains */}
          <AnimatedSection delay={200}>
            <div className="bg-gray-900/50 border border-primary-800/50 rounded-xl p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-cyan-400 rounded flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">N</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">What Nova Retains</h3>
                  <p className="text-xs text-primary-400">Platform IP</p>
                </div>
              </div>

              <ul className="space-y-2">
                {ipOwnership.novaRetains.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        {/* Clear Separation */}
        <AnimatedSection delay={300}>
          <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-2">Clear Separation</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {ipOwnership.clarification}
            </p>
            <div className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-gray-500 italic">
                {ipOwnership.analogy}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
