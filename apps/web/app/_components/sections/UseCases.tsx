interface UseCase {
  scenario: string;
  persona: string;
  outcome: string;
}

interface UseCasesProps {
  title?: string;
  useCases: UseCase[];
}

export function UseCases({ title = "Real-World Scenarios", useCases }: UseCasesProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  {useCase.persona}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                "{useCase.scenario}"
              </h3>

              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <p>{useCase.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
