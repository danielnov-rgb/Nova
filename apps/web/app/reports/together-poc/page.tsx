import {
  HeroSection,
  MetricsGrid,
  FeatureShowcase,
  VelocityComparison,
  WorkflowCompression,
  NextSteps,
} from "./_components";

export default function TogetherPOCReport() {
  return (
    <main>
      {/* Hero Section - 8-11x acceleration headline */}
      <HeroSection />

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Metrics Grid - What was delivered */}
      <MetricsGrid />

      {/* Feature Showcase - Expandable feature cards */}
      <FeatureShowcase />

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Velocity Comparison - Traditional vs Nova */}
      <VelocityComparison />

      {/* Workflow Compression - Before/after examples */}
      <WorkflowCompression />

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Next Steps - CTA and contact */}
      <NextSteps />
    </main>
  );
}
