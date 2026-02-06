import Link from "next/link";

interface NavItem {
  slug: string;
  title: string;
}

interface ModuleNavigationProps {
  previous?: NavItem;
  next?: NavItem;
}

export function ModuleNavigation({ previous, next }: ModuleNavigationProps) {
  return (
    <section className="py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Previous */}
          <div className="flex-1">
            {previous ? (
              <Link
                href={`/features/${previous.slug}`}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-500">Previous</p>
                  <p className="font-medium">{previous.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Center - Back to overview */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            All Features
          </Link>

          {/* Next */}
          <div className="flex-1 flex justify-end">
            {next ? (
              <Link
                href={`/features/${next.slug}`}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-500">Next</p>
                  <p className="font-medium">{next.title}</p>
                </div>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
