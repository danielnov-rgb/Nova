interface PersonaValueItem {
  persona: "Product" | "Engineering" | "Executive";
  value: string;
}

interface PersonaValueProps {
  title?: string;
  values: PersonaValueItem[];
}

const personaIcons: Record<string, React.ReactNode> = {
  Product: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Engineering: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Executive: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

const personaColors: Record<string, { bg: string; text: string; border: string }> = {
  Product: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  Engineering: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  Executive: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
};

export function PersonaValue({ title = "Value for Your Team", values }: PersonaValueProps) {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((item, index) => {
            const colors = personaColors[item.persona] ?? {
              bg: "bg-gray-100 dark:bg-gray-800",
              text: "text-gray-600 dark:text-gray-400",
              border: "border-gray-200 dark:border-gray-700",
            };
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-xl border ${colors.border} p-6`}
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.text} mb-4`}>
                  {personaIcons[item.persona]}
                </div>
                <h3 className={`font-semibold ${colors.text} mb-2`}>
                  For {item.persona}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
