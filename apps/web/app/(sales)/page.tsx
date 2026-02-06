import Link from "next/link";
import { features } from "./features/_data/features";
import { HeroSection, ProcessSteps } from "../_components/sections";

export default function Home() {
  const platformSteps = [
    {
      step: 1,
      title: "Understand",
      description: "Define your audience, capture objectives, and build your knowledge base",
    },
    {
      step: 2,
      title: "Discover",
      description: "AI-powered research to uncover problems worth solving",
    },
    {
      step: 3,
      title: "Prioritize",
      description: "Credit-based voting to align teams and eliminate politics",
    },
    {
      step: 4,
      title: "Build & Learn",
      description: "Design solutions, track outcomes, and continuously improve",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="Product Intelligence for B2B SaaS"
        subtitle="Know what to build. Build what matters."
        description="Nova is an AI-powered platform that helps product teams discover real user problems, prioritize with evidence, and continuously learn from outcomes."
        primaryCta={{ label: "Try Problem Voting", href: "/features/problem-voting" }}
        secondaryCta={{ label: "Request Demo", href: "mailto:demo@nova.ai?subject=Nova%20Demo%20Request" }}
      />

      {/* Why Nova - The Process */}
      <ProcessSteps
        title="Why Nova?"
        subtitle="A complete system for evidence-driven product decisions"
        steps={platformSteps}
        variant="cards"
      />

      {/* Overview Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Challenge
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Most product teams are flying blind. User research is expensive and slow.
              Prioritization is political. There's no evidence trail connecting decisions to outcomes.
              Nova changes this.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Without Nova</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expensive user research, political prioritization, no evidence trail,
                building features nobody asked for
              </p>
            </div>

            <div className="flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">With Nova</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scalable AI research, transparent voting, complete evidence trails,
                building what actually moves the needle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Modules
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Nine integrated modules that work together across the product lifecycle
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

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to build products people actually want?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            See how Nova can transform your product discovery and prioritization process.
            Try our live Problem Voting demo or schedule a full platform walkthrough.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/features/problem-voting"
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/25"
            >
              Try Problem Voting Demo
            </Link>
            <a
              href="mailto:demo@nova.ai?subject=Nova%20Demo%20Request"
              className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
            >
              Schedule Full Demo
            </a>
          </div>
        </div>
      </section>
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
    live: "Live Demo",
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
