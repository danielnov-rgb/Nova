import Link from "next/link";
import { NovaLogo } from "../shared/NovaLogo";

const featureLinks = [
  { slug: "client-onboarding", title: "Client Onboarding" },
  { slug: "target-audience", title: "Target Audience" },
  { slug: "market-intelligence", title: "Market Intelligence" },
  { slug: "problem-discovery", title: "Problem Discovery" },
  { slug: "problem-voting", title: "Problem Voting" },
  { slug: "competitor-research", title: "Competitor Research" },
  { slug: "project-management", title: "Project Management" },
  { slug: "solution-design", title: "Solution Design" },
  { slug: "analytics-feedback", title: "Analytics & Feedback" },
];

export function SalesFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <NovaLogo size="md" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              AI-powered product intelligence platform for B2B SaaS companies.
            </p>
            <a
              href="mailto:demo@nova.ai?subject=Nova%20Demo%20Request"
              className="inline-block mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Request Demo
            </a>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {featureLinks.slice(0, 5).map((feature) => (
                <li key={feature.slug}>
                  <Link
                    href={`/features/${feature.slug}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Features Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">More</h4>
            <ul className="space-y-2">
              {featureLinks.slice(5).map((feature) => (
                <li key={feature.slug}>
                  <Link
                    href={`/features/${feature.slug}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:demo@nova.ai"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            {new Date().getFullYear()} Nova. Built for enterprise product teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
