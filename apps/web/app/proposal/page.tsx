import {
  ProposalNav,
  FloatingTOC,
  HeroSection,
  ExecutiveSummary,
  DeliverablesSection,
  ContinuousIntelligence,
  FlexibilitySection,
  TeamSection,
  IPOwnership,
  InvestmentTimeline,
  SuccessMetrics,
  NextSteps,
} from "./_components";

export default function ProposalPage() {
  return (
    <>
      <ProposalNav />
      <FloatingTOC />

      <main>
        {/* Hero — full viewport */}
        <HeroSection />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Executive Summary */}
        <ExecutiveSummary />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Core Deliverables */}
        <DeliverablesSection />

        {/* Continuous Intelligence */}
        <ContinuousIntelligence />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Flexibility & Scope */}
        <FlexibilitySection />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Team Composition */}
        <TeamSection />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* IP & Ownership */}
        <IPOwnership />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Investment & Timeline */}
        <InvestmentTimeline />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Success Metrics */}
        <SuccessMetrics />

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Next Steps + Contact */}
        <NextSteps />
      </main>
    </>
  );
}
