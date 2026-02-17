"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "deliverables", label: "Deliverables" },
  { id: "intelligence", label: "Intelligence" },
  { id: "flexibility", label: "Flexibility" },
  { id: "team", label: "Team" },
  { id: "ip", label: "IP" },
  { id: "investment", label: "Investment" },
  { id: "metrics", label: "Metrics" },
  { id: "next-steps", label: "Next Steps" },
];

export function ProposalNav() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {section.label}
              </button>
            );
          })}

          {/* Powered by Nova */}
          <div className="ml-auto flex-shrink-0 flex items-center gap-2 pl-4">
            <div className="w-4 h-4 bg-gradient-to-br from-primary-400 to-cyan-400 rounded flex items-center justify-center">
              <span className="text-[7px] font-bold text-white">N</span>
            </div>
            <span className="text-xs text-gray-500">Nova</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
