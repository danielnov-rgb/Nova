"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const reportPages = [
  { href: "/reports/together-poc", label: "Overview" },
  { href: "/reports/together-poc/system-overview", label: "Platform" },
  { href: "/reports/together-poc/learning-path", label: "Learning Path" },
  { href: "/reports/together-poc/design-system", label: "Design System" },
  { href: "/reports/together-poc/portability", label: "Portability" },
  { href: "/reports/together-poc/hosted-tools", label: "Hosted Tools" },
  { href: "/reports/together-poc/velocity", label: "Velocity" },
];

export function ReportNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto scrollbar-hide">
          {reportPages.map((page) => {
            const isActive = pathname === page.href;
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {page.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
