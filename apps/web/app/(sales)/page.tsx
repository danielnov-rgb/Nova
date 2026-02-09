import Link from "next/link";
import { features } from "./features/_data/features";
import { HeroSection } from "../_components/sections";

// Map features to value chain stages
const valueChainStages = [
  {
    id: "know",
    number: "01",
    title: "Know What to Build",
    description: "Research, discover problems, prioritize with evidence, and design solutions that matter",
    color: "primary",
    modules: ["client-onboarding", "target-audience", "problem-discovery", "problem-voting"],
  },
  {
    id: "build",
    number: "02",
    title: "Build It Right",
    description: "Generate code, create specifications, and ensure quality from day one",
    color: "emerald",
    modules: ["solution-design"],
  },
  {
    id: "launch",
    number: "03",
    title: "Launch It Smart",
    description: "Inject analytics, track usage, and understand market dynamics",
    color: "amber",
    modules: ["analytics-feedback", "market-intelligence"],
  },
  {
    id: "improve",
    number: "04",
    title: "Improve Continuously",
    description: "Close the loop from user feedback to product decisions",
    color: "rose",
    modules: ["project-management", "competitor-research"],
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section - Strong positioning */}
      <HeroSection
        badge="AI-Powered Product Intelligence"
        title="Build Products That Actually Ship and Stick"
        subtitle="The complete platform for evidence-driven product development"
        description="Nova accelerates your entire product lifecycle—from discovering what to build, to measuring what works, to continuously improving based on real outcomes. Stop guessing. Start knowing."
        primaryCta={{ label: "Explore Platform", href: "#value-chain" }}
        secondaryCta={{ label: "Request Demo", href: "/contact" }}
      />

      {/* The Problem Statement */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Most Products Fail to Get Adoption
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Teams build features nobody asked for. User research is expensive and slow.
              Prioritization becomes political. There's no evidence connecting decisions to outcomes.
              The result? Products that ship but don't stick.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Problem 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 mb-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Blind Building</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Teams build based on opinions and hunches. No systematic way to understand what users actually need.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 mb-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Slow Feedback</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Months pass before you know if a feature worked. By then, the team has moved on and lessons are lost.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 mb-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No Evidence Trail</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Decisions aren't documented. Knowledge leaves when people leave. Every project starts from scratch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution - Value Chain */}
      <section id="value-chain" className="py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">The Nova Way</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              A Complete System for Product Success
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Nova isn't a collection of point solutions. It's an integrated platform where each stage
              feeds the next—creating a continuous loop of learning and improvement.
            </p>
          </div>

          {/* Value Chain Visualization */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-emerald-500 via-amber-500 to-rose-500 -translate-y-1/2 z-0" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {valueChainStages.map((stage, index) => (
                <ValueChainCard
                  key={stage.id}
                  number={stage.number}
                  title={stage.title}
                  description={stage.description}
                  color={stage.color}
                  modules={stage.modules}
                  isFirst={index === 0}
                  isLast={index === valueChainStages.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Continuous Loop Indicator */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Outcomes feed back into discovery—your product gets smarter with every cycle
            </div>
          </div>
        </div>
      </section>

      {/* All Platform Modules */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Modules
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Each module is powerful alone. Together, they transform how you build products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.slug}
                slug={feature.slug}
                title={feature.shortTitle}
                description={feature.tagline}
                status={feature.status}
                isLive={feature.status === "live"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Product Teams That Ship
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Whether you're a startup finding product-market fit or an enterprise scaling what works
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PersonaCard
              title="Product Leaders"
              description="Make confident prioritization decisions backed by evidence. Show stakeholders exactly why you're building what you're building."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <PersonaCard
              title="Engineering Teams"
              description="Build with context. Understand why features exist, what problems they solve, and how to measure success."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
            <PersonaCard
              title="Executives"
              description="See the complete picture. Track how product investments connect to business outcomes with full transparency."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/20 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Build Products That Stick?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            See how Nova can transform your product development process.
            Start with our live Problem Voting module or schedule a full platform walkthrough.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/features/problem-voting"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/25 text-center"
            >
              See Problem Voting
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors text-center"
            >
              Request Full Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueChainCard({
  number,
  title,
  description,
  color,
  modules,
  isFirst,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
  modules: string[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const colorStyles: Record<string, { bg: string; text: string; border: string }> = {
    primary: {
      bg: "bg-primary-100 dark:bg-primary-900/30",
      text: "text-primary-600 dark:text-primary-400",
      border: "border-primary-200 dark:border-primary-800",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    rose: {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
    },
  };

  const styles = colorStyles[color] || colorStyles.primary;
  const moduleFeatures = modules.map((slug) => features.find((f) => f.slug === slug)).filter(Boolean);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border ${styles.border} relative`}>
      {/* Number badge */}
      <div className={`w-10 h-10 ${styles.bg} rounded-full flex items-center justify-center mb-4`}>
        <span className={`text-sm font-bold ${styles.text}`}>{number}</span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>

      {/* Module links */}
      <div className="space-y-1">
        {moduleFeatures.map((feature) => (
          <Link
            key={feature!.slug}
            href={`/features/${feature!.slug}`}
            className={`block text-sm ${styles.text} hover:underline`}
          >
            → {feature!.shortTitle}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  slug,
  title,
  description,
  status,
  isLive,
}: {
  slug: string;
  title: string;
  description: string;
  status: "live" | "coming-soon" | "beta";
  isLive: boolean;
}) {
  const statusStyles = {
    live: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    beta: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    "coming-soon": "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };

  const statusLabels = {
    live: "Live",
    beta: "Beta",
    "coming-soon": "Coming Soon",
  };

  return (
    <Link
      href={`/features/${slug}`}
      className={`block p-6 rounded-xl border transition-all hover:shadow-lg ${
        isLive
          ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-950/20 hover:border-primary-400 dark:hover:border-primary-600"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
        Learn more
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function PersonaCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
