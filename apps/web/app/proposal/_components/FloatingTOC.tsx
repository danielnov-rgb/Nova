"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "deliverables", label: "Deliverables" },
  { id: "intelligence", label: "Intelligence" },
  { id: "flexibility", label: "Flexibility" },
  { id: "team", label: "Team" },
  { id: "ip", label: "IP & Ownership" },
  { id: "investment", label: "Investment" },
  { id: "metrics", label: "Metrics" },
  { id: "next-steps", label: "Next Steps" },
];

export function FloatingTOC() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isVisible, setIsVisible] = useState(false);

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
        { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Show TOC after scrolling past hero
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl p-3 shadow-2xl shadow-black/20">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-2 mb-2">
          Contents
        </div>
        <nav className="space-y-0.5">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all text-xs ${
                  isActive
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <div
                  className={`w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
                    isActive ? "bg-primary-400" : "bg-gray-700"
                  }`}
                />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
