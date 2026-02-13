"use client";

import { useRef, useState, useEffect } from "react";
import { contactTeam } from "../_data/report-content";

export function NextSteps() {
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
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What's Next?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This POC demonstrates what's possible. Here's how we can continue.
          </p>
        </div>

        {/* Opportunities grid */}
        <div className={`grid md:grid-cols-2 gap-6 mb-16 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Production Deployment
            </h3>
            <p className="text-gray-400 text-sm">
              Take the POC to production with proper infrastructure, security hardening, and user onboarding. The codebase is production-ready.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Backend Migration
            </h3>
            <p className="text-gray-400 text-sm">
              The frontend is designed with a clean service layer abstraction. Migrate from Firebase to Accenture's infrastructure in 25-37 days.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Hosted Tools as Services
            </h3>
            <p className="text-gray-400 text-sm">
              Extract the AI-powered tools (CV Builder, Interview Story Builder) as standalone microservices with OAuth2 integration.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Additional Learning Paths
            </h3>
            <p className="text-gray-400 text-sm">
              Create new learning paths for different professional development journeys. The content authoring pipeline is proven and efficient.
            </p>
          </div>
        </div>

        {/* Contact section */}
        <div className={`bg-gradient-to-r from-primary-900/30 to-cyan-900/30 border border-primary-700/30 rounded-2xl p-8 text-center transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to Continue?
          </h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Contact the team to discuss next steps, pricing, and timeline.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {contactTeam.map((person) => (
              <a
                key={person.email}
                href={`mailto:${person.email}`}
                className="group flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 hover:border-primary-500/50 hover:bg-gray-900/80 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {person.name[0]}
                </div>
                <div className="text-left">
                  <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                    {person.name}
                  </div>
                  <div className="text-sm text-gray-500">{person.role}</div>
                </div>
              </a>
            ))}
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
            <span>Together POC</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Version 1.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}
