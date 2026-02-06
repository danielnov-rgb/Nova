import Link from "next/link";

interface HeroSectionProps {
  badge?: string;
  badgeVariant?: "live" | "coming-soon" | "beta";
  title: string;
  subtitle: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export function HeroSection({
  badge,
  badgeVariant = "coming-soon",
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  const badgeStyles = {
    live: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    "coming-soon": "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    beta: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-950/20 dark:to-gray-950" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {badge && (
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-6 ${badgeStyles[badgeVariant]}`}>
              {badge}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {title}
          </h1>

          <p className="text-xl sm:text-2xl text-primary-600 dark:text-primary-400 font-medium mb-4">
            {subtitle}
          </p>

          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/25"
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
