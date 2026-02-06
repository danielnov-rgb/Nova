interface ProblemStatementProps {
  problem: string;
  consequence: string;
  solution: string;
}

export function ProblemStatement({ problem, consequence, solution }: ProblemStatementProps) {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* The Problem */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 p-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
              The Problem
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{problem}</p>
          </div>

          {/* The Consequence */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-900/50 p-6">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              The Cost
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{consequence}</p>
          </div>

          {/* The Solution */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-200 dark:border-green-900/50 p-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
              Nova's Solution
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{solution}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
