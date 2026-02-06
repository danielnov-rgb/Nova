"use client";

import { useState } from "react";
import Link from "next/link";
import { NovaLogo } from "../shared/NovaLogo";

const featureLinks = [
  { slug: "client-onboarding", title: "Client Onboarding" },
  { slug: "target-audience", title: "Target Audience" },
  { slug: "market-intelligence", title: "Market Intelligence" },
  { slug: "problem-discovery", title: "Problem Discovery" },
  { slug: "problem-voting", title: "Problem Voting", isLive: true },
  { slug: "competitor-research", title: "Competitor Research" },
  { slug: "project-management", title: "Project Management" },
  { slug: "solution-design", title: "Solution Design" },
  { slug: "analytics-feedback", title: "Analytics & Feedback" },
];

export function SalesNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NovaLogo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                onBlur={() => setTimeout(() => setFeaturesOpen(false), 150)}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Features
                <svg
                  className={`w-4 h-4 transition-transform ${featuresOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 overflow-hidden">
                  {featureLinks.map((feature) => (
                    <Link
                      key={feature.slug}
                      href={`/features/${feature.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span>{feature.title}</span>
                      {feature.isLive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          Live
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Request Demo Button */}
            <a
              href="mailto:demo@nova.ai?subject=Nova%20Demo%20Request"
              className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Request Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-4 space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Features
            </p>
            {featureLinks.map((feature) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <span>{feature.title}</span>
                {feature.isLive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    Live
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-4">
              <a
                href="mailto:demo@nova.ai?subject=Nova%20Demo%20Request"
                className="block w-full text-center px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
