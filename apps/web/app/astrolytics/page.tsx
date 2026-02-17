import Link from "next/link";

const features = [
  {
    title: "Trends",
    description: "Track how events change over time with multi-series charts and breakdowns.",
    href: "/astrolytics/trends",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
      </svg>
    ),
  },
  {
    title: "Funnels",
    description: "Measure conversion between steps and identify where users drop off.",
    href: "/astrolytics/funnels",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
  },
  {
    title: "Retention",
    description: "Understand cohort retention with heatmaps and time-based curves.",
    href: "/astrolytics/retention",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "User Profiles",
    description: "Browse individual users, their events, sessions, and properties.",
    href: "/astrolytics/people",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Feature Flags",
    description: "Roll out features gradually with targeting rules and percentage rollouts.",
    href: "/astrolytics/feature-flags",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    title: "Session Replay",
    description: "Watch real user sessions to understand behavior and debug issues.",
    href: "/astrolytics/session-replay",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Connect Your Data",
    description: "Point Astrolytics at your Nova instance or pipe events directly via SDK.",
  },
  {
    number: "02",
    title: "Explore Insights",
    description: "Use trends, funnels, retention, and paths to understand user behavior.",
  },
  {
    number: "03",
    title: "Act on Findings",
    description: "Feed insights into Nova's problem discovery and sprint planning workflow.",
  },
];

export default function AstrolyticsHome() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/30 rounded-2xl blur-xl" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Astro</span>
            <span className="text-white">lytics</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Product analytics that speaks your brand — powered by your data, styled for your team.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/astrolytics/dashboard"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/20"
            >
              Open Dashboard
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/astrolytics/trends"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-all font-medium"
            >
              Explore Trends
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Everything You Need</h2>
            <p className="text-gray-400">A complete analytics suite, white-labeled for your brand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-20" />

        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-gray-400">Three steps from data to decisions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-cyan-500/20 border border-primary-500/30 mb-4">
                  <span className="text-sm font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-20" />

        {/* Built on Nova */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50 mb-6">
            <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-cyan-400 rounded flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">N</span>
            </div>
            <span className="text-gray-300 text-sm">Built on Nova</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Analytics meets{" "}
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              problem discovery
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Astrolytics feeds directly into Nova&apos;s problem discovery, quadratic voting, and sprint planning — turning data into prioritized action.
          </p>
          <Link
            href="/astrolytics/dashboard"
            className="group inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Get started
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
