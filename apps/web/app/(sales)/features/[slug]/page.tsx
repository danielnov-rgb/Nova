import { notFound } from "next/navigation";
import Link from "next/link";
import { features, getFeatureBySlug, getAdjacentFeatures } from "../_data/features";
import {
  HeroSection,
  BenefitsGrid,
  ProcessSteps,
  CapabilitiesList,
  VisualPlaceholder,
  ModuleNavigation,
  ProblemStatement,
  UseCases,
  PersonaValue,
} from "../../../_components/sections";

export function generateStaticParams() {
  return features.map((feature) => ({
    slug: feature.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return { title: "Feature Not Found" };

  return {
    title: `${feature.title} | Nova`,
    description: feature.description,
  };
}

export default async function FeatureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    notFound();
  }

  const { previous, next } = getAdjacentFeatures(slug);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        badge={feature.status === "live" ? "Live Demo Available" : feature.status === "beta" ? "Beta" : "Coming Soon"}
        badgeVariant={feature.status}
        title={feature.title}
        subtitle={feature.tagline}
        description={feature.description}
        primaryCta={feature.demoUrl ? { label: "Try Live Demo", href: feature.demoUrl } : undefined}
        secondaryCta={{ label: "Request Demo", href: "mailto:demo@nova.ai?subject=Nova%20Demo%20Request" }}
      />

      {/* Problem Statement */}
      <ProblemStatement
        problem={feature.problemStatement.problem}
        consequence={feature.problemStatement.consequence}
        solution={feature.problemStatement.solution}
      />

      {/* Capabilities */}
      <CapabilitiesList title="What It Does" capabilities={feature.capabilities} />

      {/* Visual Mockup Placeholder */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisualPlaceholder title={`${feature.shortTitle} Interface`} aspectRatio="video" />
        </div>
      </section>

      {/* Process Steps */}
      <ProcessSteps
        title="How It Works"
        subtitle="A clear workflow from start to finish"
        steps={feature.workflow}
        variant="cards"
      />

      {/* Use Cases */}
      <UseCases title="Real-World Scenarios" useCases={feature.useCases} />

      {/* Persona Value */}
      <PersonaValue title="Value for Your Team" values={feature.personaValues} />

      {/* Benefits */}
      <BenefitsGrid
        title="Why It Matters"
        subtitle={`The business impact of ${feature.shortTitle}`}
        benefits={feature.benefits}
        columns={3}
      />

      {/* Integration Section */}
      {feature.integrations.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How It Connects
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.shortTitle} integrates seamlessly with these Nova modules
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {feature.integrations.map((slug) => {
                const integration = getFeatureBySlug(slug);
                if (!integration) return null;
                return (
                  <Link
                    key={slug}
                    href={`/features/${slug}`}
                    className="group flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <span className="font-medium">{integration.shortTitle}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/20 dark:to-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to see {feature.shortTitle} in action?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {feature.status === "live"
              ? "Try the live demo yourself or schedule a personalized walkthrough with our team."
              : "Schedule a demo to see our roadmap and discuss how Nova can transform your product process."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {feature.demoUrl && (
              <Link
                href={feature.demoUrl}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/25 text-center"
              >
                Try Live Demo
              </Link>
            )}
            <a
              href="mailto:demo@nova.ai?subject=Nova%20Demo%20Request"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors text-center"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <ModuleNavigation previous={previous} next={next} />
    </div>
  );
}
