"use client";

import { useRef, useState, useEffect } from "react";
import { nextSteps, contactInfo } from "../_data/showcase-content";
import { trackEvent } from "../_lib/posthog";

export function NextSteps() {
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
    <section ref={sectionRef} id="next-steps" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Next Steps
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your path forward with Nova
          </p>
        </div>

        {/* Steps */}
        <div className={`grid md:grid-cols-2 gap-6 mb-16 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {nextSteps.map((step, index) => (
            <div key={step.number} className="flex items-start gap-4 bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-cyan-500/20 border border-primary-500/30 flex items-center justify-center">
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`relative transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-cyan-500/30 rounded-3xl blur-xl" />

          <div className="relative bg-gray-900/90 backdrop-blur border border-gray-700/50 rounded-3xl p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let&apos;s Talk
            </h3>
            <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
              Ready to see Nova in action or discuss how it fits your goals?
            </p>

            <a
              href={`mailto:${contactInfo.email}`}
              onClick={() => trackEvent("showcase_cta_clicked", { action: "email" })}
              className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl text-white font-semibold text-xl hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300"
            >
              <svg className="w-6 h-6 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Get in Touch with {contactInfo.name}</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-16 text-center transition-all duration-700 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-gray-600 text-sm">
            Generated with Nova Product Intelligence Platform
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span>February 2026</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Leadership Knowledge Pack</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Confidential</span>
          </div>
        </div>
      </div>
    </section>
  );
}
