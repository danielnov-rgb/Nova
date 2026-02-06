interface Step {
  step: number;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
  variant?: "horizontal" | "vertical" | "cards" | "timeline" | "split";
}

export function ProcessSteps({ title, subtitle, steps, variant = "horizontal" }: ProcessStepsProps) {
  if (variant === "vertical") {
    return (
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-100 dark:to-primary-900" />

              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.step} className="relative flex gap-6">
                    {/* Step number */}
                    <div className="relative z-10 w-16 h-16 flex-shrink-0 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/25">
                      {step.step}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "cards") {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl font-bold text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-primary-500/30 bg-gray-950/60 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-[0.2em] text-primary-300 uppercase">
                    Step {step.step}
                  </span>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/15 text-primary-200 border border-primary-500/40 text-sm font-semibold">
                    0{step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-primary-400 to-primary-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "timeline") {
    return (
      <section className="py-16 sm:py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl font-bold text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/60 via-primary-300/40 to-primary-500/60" />
            <div className="space-y-8 md:space-y-12">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="relative md:grid md:grid-cols-2 md:items-center"
                >
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/50 flex items-center justify-center text-primary-200 font-semibold shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                    {step.step}
                  </div>

                  <div className="md:odd:pr-12 md:odd:text-right md:even:pl-12">
                    <div className="inline-block rounded-xl border border-gray-800 bg-gray-900/70 p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && (
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            <div className="relative">
              <div className="hidden lg:block absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/60 via-primary-300/30 to-primary-500/60" />
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-center gap-4 rounded-xl border border-primary-500/20 bg-white dark:bg-gray-900 p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-500/15 border border-primary-500/40 flex items-center justify-center text-primary-500 font-semibold">
                      {step.step}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={`${step.step}-detail`}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg shadow-primary-500/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-primary-500">
                      Step {step.step}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary-400/60 to-transparent" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          {/* Horizontal connector line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-100 via-primary-500 to-primary-100 dark:from-primary-900 dark:via-primary-500 dark:to-primary-900" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Step number */}
                <div className="relative z-10 w-24 h-24 mx-auto bg-white dark:bg-gray-950 rounded-full border-4 border-primary-500 flex items-center justify-center text-primary-500 font-bold text-3xl mb-6 shadow-lg">
                  {step.step}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {step.description}
                </p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
