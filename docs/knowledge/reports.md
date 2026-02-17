# Reports & Proposals

Structure and content of client-facing reports deployed to enjoyscale.com.

---

## Together POC Report Structure
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Full analysis of together-poc report in both repos -->

### Location

**Main monorepo:** `apps/web/app/reports/together-poc/`
**Reports repo (deployed):** Same structure in `danielnov-rgb/reports.git`

### Navigation (7 pages)

| Route | Page | Purpose |
|-------|------|---------|
| `/reports/together-poc` | Overview | Hero, metrics, features, velocity, workflows |
| `/reports/together-poc/system-overview` | Platform | What 2gthr is, tech stack, features |
| `/reports/together-poc/learning-path` | Learning Path | 6 milestones, gamification |
| `/reports/together-poc/design-system` | Design System | 103 components, tokens, maturity |
| `/reports/together-poc/portability` | Portability | 25-37 day migration estimate |
| `/reports/together-poc/hosted-tools` | Hosted Tools | 5 independently deployable tools |
| `/reports/together-poc/velocity` | Velocity | 6-8x acceleration breakdown |

### Core Components (`_components/`)

- `HeroSection` - Full-viewport with animated gradient orbs, 6-8x stat
- `MetricsGrid` - 8 headline metrics with animated number counters
- `FeatureShowcase` - 5 expandable feature cards with highlights + tech details
- `VelocityComparison` - 8 categories with animated progress bars
- `WorkflowCompression` - 3 workflow examples with toggle views
- `NextSteps` - 4 opportunity cards + contact CTA
- `PageHeader` - Reusable page title/subtitle/badge
- `ContentSection` - Section wrapper + CardGrid + InfoCard + DataTable
- `ReportNav` - Sticky navigation with active state

### Content Data (`_data/report-content.ts`)

Single source of truth for all report content:

**Key metrics:**
- Acceleration factor: 6-8x
- Traditional estimate: 17-24 weeks
- POC period: 3 weeks
- UI Components: 103
- Go-Card Types: 11
- AI-Powered Tools: 6
- Lines of Code: 35,000+

**Data exports:** reportMeta, headlineMetrics (8), features (5), velocityComparison (8 categories), workflowExamples (3), technicalComplexity (6), platformOverview, goCardTypes (11), aiTools (6), accelerationInsights (5), contactTeam

---

## FDE Proposal
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Proposal pages analysis -->

### Location

**Main monorepo:** `apps/web/app/proposal/`
**Reports repo (deployed):** Same route in reports.git

### Auth Gate

Password-protected client-side gate. Password: `NEXT_PUBLIC_PROPOSAL_PASSWORD` (default: `nova2025`).
Visitor enters name + password. Name stored in sessionStorage and sent to PostHog for tracking.

### Components

- `ProposalShell` - Client wrapper: AuthGate + PostHog provider
- `AuthGate` - Name + password form
- `ProposalNav` - Single-page scroll nav with active section detection
- `HeroSection` - Stats: R1.2M/mo, 6 Months, 3 FDEs
- `ExecutiveSummary` - Overview + 4 key fact cards
- `DeliverablesSection` - 5 expandable deliverable cards
- `ContinuousIntelligence` - Analytics capabilities grid
- `FlexibilitySection` - Pivot options + cross-team integration
- `TeamSection` - 3 FDE profile cards
- `IPOwnership` - Two-column: Accenture owns vs Nova retains
- `InvestmentTimeline` - R7.2M total with animated counter
- `SuccessMetrics` - 4 metric categories
- `NextSteps` - 4 action items
- `AnimatedSection` - Reusable IntersectionObserver wrapper
- `ThemeProvider` - Dark/light toggle with system preference detection

### Proposal Summary

Route: `/proposal-summary` - Print-friendly one-pager.
Includes link to full proposal with password hint.

### PostHog Integration

Events tracked: `proposal_viewed`, `proposal_section_viewed`, `proposal_scroll_depth`, `proposal_cta_clicked`.
Fallback: If no PostHog key configured, initialization is skipped silently.

---

## Report Component Patterns
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Reusable patterns across reports -->

**Layout pattern:**
```tsx
// layout.tsx - Server component
export const metadata = { title: "...", description: "..." };
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <Nav />
      {children}
    </div>
  );
}
```

**Section pattern:**
Each page imports from barrel `_components/index.ts` and data from `_data/*.ts`.
Sections separated by: `<div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />`

**Animation pattern:**
All major sections use IntersectionObserver with threshold 0.1.
Entry: `opacity-0 translate-y-8` to `opacity-100 translate-y-0` with `transition-all duration-700`.
Staggered children: `transitionDelay: ${index * 100}ms`.

---

## NovaAdCard System
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Advertising component analysis -->

Shared advertising component at `apps/web/app/_components/shared/NovaAdCard.tsx`.

**Usage:** Placed after main content in reports and voter pages.

**Structure:**
1. Visual separator / page break
2. "Advertisement" badge + "Powered by Nova" intro
3. Main card with problem/solution messaging
4. 6 capabilities in 2-column grid
5. CTA button

**Styling:** `border-2 border-primary-500`, animated glow effect, dark theme optimized.
Uses `.preserve-dark` class to stay dark in light-themed sections.
