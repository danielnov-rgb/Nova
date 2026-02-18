"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const scrollSections = [
  { id: "overview", label: "Overview" },
  { id: "proof", label: "By the Numbers" },
  { id: "features", label: "Features" },
  { id: "workflows", label: "Workflows" },
  { id: "roles", label: "For You" },
  { id: "acceleration", label: "Velocity" },
  { id: "investment", label: "Investment" },
  { id: "next-steps", label: "Next Steps" },
];

const pageLinks = [
  { href: "/showcase", label: "Home" },
  { href: "/showcase/case-study", label: "Case Study" },
];

export function ShowcaseNav() {
  const [activeSection, setActiveSection] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();
  const isLandingPage = pathname === "/showcase";

  useEffect(() => {
    if (!isLandingPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topEntry = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topEntry.target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    scrollSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [isLandingPage]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1">
          {/* Nova branding */}
          <Link href="/showcase" className="flex-shrink-0 mr-4">
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Nova
            </span>
          </Link>

          {/* Scroll sections (on landing page) or page links */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
            {isLandingPage ? (
              scrollSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {section.label}
                </button>
              ))
            ) : (
              pageLinks.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === page.href
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {page.label}
                </Link>
              ))
            )}
          </div>

          {/* Page links on right (landing page) */}
          {isLandingPage && (
            <div className="flex-shrink-0 hidden md:flex items-center gap-1 ml-2">
              <Link
                href="/showcase/case-study"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              >
                Case Study
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
