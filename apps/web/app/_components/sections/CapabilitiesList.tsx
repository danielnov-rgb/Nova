interface CapabilitiesListProps {
  title?: string;
  capabilities: string[];
}

export function CapabilitiesList({ title, capabilities }: CapabilitiesListProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {title}
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
