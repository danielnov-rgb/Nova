# Nova Platform — Project Plan (Reconciled with Codebase)

> **Purpose:** This is the canonical project plan for Nova. It reflects what is actually built, what needs to be built, and what decisions have been made.  
> **Updated:** 2026-02-11  
> **For Claude Code:** Use this to understand the system, make architectural decisions, and prioritise work.

---

## Part 0: What Nova Is and What Exists Today

### Nova in One Paragraph

Nova is an AI-powered product intelligence platform for B2B SaaS companies. It helps teams discover user problems through research and synthetic interviews, prioritise what to build via structured scoring and voting, design solutions, and measure outcomes through feature analytics. Nova is **generic** — it works for any product company. The first client is Accenture (via their 2gthr platform), but Nova does not embed 2gthr-specific concepts like Paths, Go-Cards, MI, or MyDNA. Those map to Nova's generic hierarchy.

### Tech Stack (Locked In — Do Not Deviate)

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript 5.9 |
| Backend | NestJS 11 · Node.js 18+ · Passport JWT auth |
| Database | PostgreSQL 16 with pgvector |
| Cache | Redis 7 |
| ORM | Prisma 7 |
| Monorepo | pnpm workspaces + Turborepo |
| AI | Claude API (enrichment), custom research agents |

No Firebase. No framework swaps.

### What Is Already Built and Working

**Do not rebuild these modules.** Extend and polish them.

#### Problem Discovery & Scoring [DONE]
- Full Problem CRUD with 11-dimension AI scoring (applicability, severity, frequency, willingness_to_pay, retention_impact, acquisition_potential, viral_coefficient, strategic_fit, feasibility, time_to_value, risk_level)
- Each score: value (0-10), justification (text), confidence (0-1)
- Configurable WeightingProfile per tenant for priority reordering
- Problem enrichment via Claude API (scores, evidence, hypotheses)
- ProblemGroups for thematic clustering with color/icon
- Sprints for time-boxing problem sets
- Import from CSV, Excel, JSON
- Evidence items with source, type, confidence, sentiment
- Vector embeddings (1536-dim) for similarity search
- Admin UI at `/admin/problems` with kanban, list views, filters, bulk actions, weighting sliders

**Still needed:** Problem commenting, favouriting, seeing who favourited, feedback session participation tracking. Problem-based feedback sessions.

#### Voting System [DONE]
- VotingSessions with credit-based allocation (quadratic voting compatible)
- VoterGroups with type (LEADERSHIP, PROJECT_TEAM, EXTERNAL_USER) and weight multipliers
- TeamCodes for shareable join links with max uses and expiry
- Anonymous voting via token-based VotingLinks
- Public sessions with publicToken
- Results: overall, by-group, consensus analysis, participation stats
- Full voter interface at `/voter`
- Admin session management at `/admin/sessions`

#### Research Intelligence [DONE]
- @nova/research-agents: 8 independent agents (SaaS Benchmarks, Pricing Intel, Adoption Signals, Macro Economy, Consumer Spend, Innovation Trends, Internal Performance, Source Scout)
- Agents run concurrently, deduplicate, generate scored reports with evidence chains
- research-intel service: CLI + JSON reports with display hints
- `/research-intel` public page

**Still needed:** Admin UI for triggering, reviewing, iterating on research runs. Store reports in Nova DB as first-class entities.

#### Client Onboarding [DONE]
- ClientContext model: objectives, businessModel, competitiveAdvantages, existingProblems, designSystemUrl, gitRepoUrl, terminologyGlossary
- Admin UI at `/admin/onboarding`
- Terminology glossary CRUD

**Future vision:** Client Knowledge Base with file upload, smart extraction, gap analysis, RAG chatbot.

#### Market Context [DONE]
- TargetAudience with types (EXISTING, TARGET, MARKET), segments, persona grid
- MarketIntelligence by category (INDUSTRY, BENCHMARK, ECONOMIC, PRICING, DEMOGRAPHIC)
- Competitor profiles with strengths, weaknesses, pricing, solutions
- Admin UIs for all

#### Solutions & Projects [DONE]
- Solution model: title, description, mockups, assumptions, status, linked to problems
- ProjectItem for lightweight tracking
- Admin UIs at `/admin/solutions` and `/admin/projects`

**Critical gap:** Solution model has no tree structure. See Part 2.

#### Feature Map & Analytics [DONE]
- Feature model: hierarchical tree via parentId, human-readable featureId slug, status, codeLocations, designFiles, tags
- AnalyticsEvent model: featureId, eventType (VIEW/INTERACT/COMPLETE/ERROR/EXIT/PAGE_VIEW/CUSTOM), sessionId, deviceId, metadata
- PluginConfig per tenant: apiKey, allowedOrigins, eventsPerMinute
- Plugin endpoints: event ingestion, bulk feature import, config management, analytics stats
- Admin feature tree at `/admin/features`
- Analytics dashboard at `/admin/analytics`

#### Packages [DONE]
- **@nova/agent CLI:** Scans JS/TS codebases, discovers features, detects framework, creates Git branches, syncs to Nova API
- **@nova/plugin:** Client-side tracker with React integration (NovaProvider, useNova, NovaFeature, NovaFeedbackWidget), batched event flushing, session/device tracking
- **problem-enricher:** Python service, enriches via Claude API with 11-dim scoring
- **research-intel:** Node service, runs research pipeline, outputs structured JSON

#### Auth & Multi-Tenancy [DONE]
- JWT with roles: FDE, ADMIN, MEMBER, VOTER
- All queries tenant-scoped from JWT
- AuditLog on all mutations

---

## Part 1: The AX/Nova Process Applied to Accenture/2gthr

This documents the methodology followed on the first client engagement. Each phase maps to a Nova module.

**Important:** Nova is generic. The 2gthr terminology (Paths, Milestones, Go-Cards, MI, MyDNA) belongs to Accenture's product architecture. Nova's generic hierarchy maps to it but does not embed it.

### Phase 1: Client Onboarding [DONE]
Ingested Accenture files (PDFs, Excel, FigJam). AI agents extracted and summarised into detailed business descriptions. Output became the context layer for all downstream agents.

- **Nova module:** ClientContext (/admin/onboarding) — exists [DONE]
- **Offline work:** Agent ingestion, comprehensive descriptions, gap analysis [DONE offline]
- **Next:** Evolve into Client Knowledge Base with file upload, smart extraction, gap analysis [NEEDS THINKING]
- **Future:** RAG system + chatbot keeping people and agents informed across modules [FUTURE]

### Phase 2: Deep Research [DONE]
Research agents studied career-stage pain points for SA professionals.

- **Nova module:** research-agents (8 agents) + research-intel service [DONE]
- **Gap:** Admin UI for triggering and reviewing runs [DEMO READY — not built]
- **Gap:** Store research outputs in Nova DB with metadata feeding downstream [BUILD NOW]
- **Future:** Synthetic user personas interviewed at scale [OFFLINE WIP]
- **Future:** General market/product/pricing insights module for SaaS best practices [BUILD NOW eventually]

### Phase 3: Insight Extraction [DONE]
Agent layer transformed research into structured insights tagged with evidence.

- **Offline work:** Structured insight objects produced [DONE]
- **Gap:** Insights need to be a first-class entity in Nova DB, linked to source research and downstream problems [BUILD NOW]
- **Gap:** Filterable insight dashboard with evidence trails [DEMO READY — not built]

### Phase 4: Problem Generation [DONE]
Insights converted to standardised problem statements. Sub-problems identified and clustered.

- **Nova module:** Problem model fully built with CRUD, scoring, grouping, import, enrichment [DONE]
- Generated 50+ problems (methodology targets 500-2,500 at scale) [DONE]
- **Future:** Persona-centric navigation — click a persona, see their relevant insights, problems, solutions [NEEDS THINKING]

### Phase 5: Problem Scoring & Prioritisation [DONE]
11-dimension scoring with configurable weighting profiles.

- **Nova module:** Full scoring engine, WeightingProfile, admin UI with sliders [DONE]
- **Polish needed:** Make weighting interaction feel premium for demos [POLISH]
- **Needed:** Commenting, favouriting, feedback session participation on problems [BUILD NOW]

### Phase 6: Leadership Voting [DONE]
Credit-based voting with voter groups, team codes, consensus analysis.

- **Nova module:** Full voting system [DONE]
- **Needed:** Footer element showing Nova breadth [BUILD NOW]
- **Polish:** Voting results views for leadership [POLISH]

### Phase 7: Solution Design [DONE]
Agent designed solutions mapped to client architecture.

- **Nova module:** Solution model exists (title, description, mockups, assumptions, status) [DONE]
- **Critical gap:** Solution model needs hierarchical tree — see Part 2 [BUILD NOW]

### Phase 8: Solution Decomposition [DONE]
Solutions decomposed into milestones with interaction sequences, specified at BRD level.

- **Done offline with agents** — specs detailed enough for vibe-coding [DONE]
- **Critical gap:** This is where Feature IDs should be minted — see Part 2 [BUILD NOW]
- **Needed:** Tree view in admin showing Solution > Features > Interactions with IDs [DEMO READY]

### Phase 9: Validation Framework [DONE offline]
Assumption extraction, risk scoring, 10 validation tiers. Not yet a Nova module.

### Phase 10: Go-Card Type Development [DONE — 2gthr-specific]
HTML prototypes and data schemas for Go-Card types. Informs how Nova thinks about "interaction types" generically.

- **For Nova:** A "Type Registry" per client project so the solution bot knows available building blocks [NEEDS THINKING]

### Phase 11: POC Development [DONE — 2gthr-specific, separate repo]
Functioning 2gthr POC in React + Firebase. This is the CLIENT PRODUCT, not Nova.

- **Needed:** Instrument with @nova/plugin for analytics tracking [BUILD NOW]
- **Needed:** Connect analytics back to Nova Feature tree [BUILD NOW]

---

## Part 2: The Architectural Gap — Content-Level Intelligence

### The Problem

Nova's @nova/agent scans codebases and discovers **component-level** features. The plugin tracks usage against them. This is Layer 1.

AX's primary value is designing and optimising **content** that runs inside those components. Nova needs to track not "someone used the ReflectionCard component" but "someone completed the specific reflection card designed as part of a specific solution to address a specific problem." This is Layer 2.

| | Layer 1: Platform Features | Layer 2: Content Features |
|---|---|---|
| Discovered by | @nova/agent (code scanning) | Nova solution design process |
| Examples | MilestoneComponent, /home route | Evidence Deficit path, specific reflection card |
| Who iterates | Client dev team | AX team / Nova |
| Nova's role | Track usage (nice to have) | Design, track, improve (core value) |
| Current state | Fully implemented | The gap to fill |

### Nova's Generic Hierarchy

| Nova Level | 2gthr Mapping | SaaS Example | E-commerce Example |
|---|---|---|---|
| Solution | Path | Feature module | Funnel |
| Feature | Milestone | Step | Stage |
| Interaction | Go-Card | UI element | Element |
| Outcome | Aspiration achieved | Activation metric | Conversion |

### Data Model Decision Needed

**Option A — SolutionNode Tree:** Add a SolutionNode model forming a tree under each Solution. Each node can optionally link to a Feature for analytics.
- SolutionNode: id, solutionId, parentId, level (FEATURE/INTERACTION/OUTCOME), name, description, featureId (FK to Feature), order, metadata

**Option B — Extend Feature Model:** Add `source` field to Feature (CODE_DISCOVERED | SOLUTION_DESIGNED | MANUAL) and optional `solutionId` FK. Solution-designed features live in the same tree as code-discovered ones.
- Simpler. Uses existing analytics pipeline unchanged.

**Recommendation:** Option B for speed. The Feature model already has hierarchy (parentId), human-readable IDs (featureId), and the full analytics pipeline. Adding a source field and solutionId link is minimal schema change.

**Two-way content awareness:** Plan for Accenture potentially creating content in their own tool and pushing solution/feature updates TO Nova, rather than Nova always being the source. Nova must work as both content origin and analytics receiver.

### Feature ID System

**Feature ID Minting [BUILD NOW]:**
- Solution design creates Feature records with source=SOLUTION_DESIGNED
- Feature.featureId slug follows hierarchical convention (e.g., ed-001, ed-001-m1, ed-001-m1-gc01)
- Feature records link back to Solution (solutionId) and through Solution to Problem
- Full provenance: Problem → Solution → Feature → AnalyticsEvent

**Feature ID Manifest [BUILD NOW — scrappy V1]:**
- JSON mapping client routes to Nova Feature IDs
- Plugin consumes manifest to resolve content-level Feature IDs
- V1: manually maintained JSON
- V2 (future): auto-generated from Feature tree + client routing

### Plugin Enhancement [BUILD NOW]

The @nova/plugin already works. Enhancement needed:
- On init: receives Feature ID manifest mapping routes/data to content-level Feature IDs
- Route matching: resolves current route + data context to correct Feature ID
- Events already have the right shape — just need content-level IDs flowing in
- NovaFeature component wraps elements with data-nova-feature for auto-tracking

### Contextual Feedback [SCRAPPY/OFFLINE]

NovaFeedbackWidget already exists. Configure for content-level prompts:
- After milestone completion: "How helpful was this section?" (1-5 + comment)
- After interaction completion: "Was this what you expected?" (yes/no)
- Feedback tagged with Feature ID flows to Nova

---

## Part 3: The Intelligence Loop

### Intelligence Console [DEMO READY — extends existing /admin/analytics]

Dashboard overlaying usage data on the solution/feature tree:
- Per Solution: engagement funnel, feature completion rates, drop-off points
- Per Feature: which interactions perform, where users bounce, time spent
- Per Interaction: completion rate, time spent, feedback sentiment
- Future: overlay with solution design rationale (designed because assumption X)
- Future: Nova AI suggestions

### Content Iteration Pipeline [FUTURE]
Nova suggests changes → generates new content → pushes to client repo. For V1: manually review analytics, manually create content, manually update.

### A/B Testing [FUTURE]
Plan for variant suffixes in Feature ID schema. Build when there's traffic.

---

## Part 4: What to Build Next

### Tier 1 — Unblock Ray & Prepare for Leadership (This/Next Week)

| # | Task | Effort | Why Now |
|---|---|---|---|
| 1 | Problem commenting and favouriting (with counts/who on detail page) | 2-3 days | Ray needs to interact with problems beyond viewing |
| 2 | Voting page footer: Nova breadth teaser below voting interface | Half day | Strategic plant for leadership expansion |
| 3 | Polish problem scoring UI for leadership demos | 1-2 days | The "wow moment" |
| 4 | Polish voting results views (consensus, participation) | 1 day | Leadership needs clear outcomes |
| 5 | Research outputs into Nova DB as browsable entities | 2 days | Ray needs to see research without CLI |

### Tier 2 — Build the Content Intelligence Bridge (2-4 Weeks)

| # | Task | Effort | Why Now |
|---|---|---|---|
| 6 | Extend Solution model with tree structure (decide Option A vs B) | 2-3 days | Intelligence loop needs this |
| 7 | Feature ID minting: solution design creates Feature records with source=SOLUTION_DESIGNED | 1-2 days | IDs must exist before plugin can track content |
| 8 | Solution tree view in admin with Feature IDs and status | 2-3 days | Accenture needs to see the content tree |
| 9 | Install @nova/plugin on 2gthr POC with content-level Feature IDs | 2-3 days | Starts data flowing back |
| 10 | Insight entity in Nova DB linked to research and problems | 2 days | Completes evidence chain |
| 11 | Intelligence dashboard: feature tree with engagement metrics (extends /admin/analytics) | 3-4 days | The subscription product demo |

### Tier 3 — Deepen the Platform (1-3 Months)

| # | Task | Status |
|---|---|---|
| 12 | Client Knowledge Base with file upload, extraction, gap analysis, RAG | NEEDS THINKING |
| 13 | Research Module admin UI (trigger, review, iterate) | DEMO READY |
| 14 | Persona-centric navigation (click persona → see their world) | NEEDS THINKING |
| 15 | Problem-based feedback sessions | NEEDS THINKING |
| 16 | Validation-to-analytics link | NEEDS THINKING |
| 17 | Generic hierarchy configuration (client defines terminology) | NEEDS THINKING |
| 18 | Synthetic user persona interviews at scale | SCRAPPY/OFFLINE |
| 19 | General market/SaaS intelligence module | BUILD NOW eventually |

### Tier 4 — Autonomous Business Partner (3-12 Months)

Document in architecture. Don't build yet: Content iteration pipeline, A/B testing, auto-repo branching, cross-project learning, self-serve onboarding, AI sales agents.

---

## Part 5: The Accenture Play

**Now (Service):** "We find the right problems, design solutions that fit your architecture, and build POCs."  
**Next (Tool):** "We track whether solutions work. Analytics show which features engage, where drop-off happens — tied to original problems."  
**Eventually (Platform):** "Nova is your product intelligence layer. Discover → build → measure → improve → repeat."

---

## Part 6: Open Questions

### Architecture
1. **Solution decomposition:** Option A (SolutionNode) or Option B (extend Feature with source)? [This week]
2. **Feature ID format:** Hierarchical slug or UUID with metadata? [This week]
3. **Plugin event destination:** Directly to Nova or via client analytics? [Before plugin install]
4. **Dynamic manifest updates:** How does manifest refresh when new solutions are designed? [2-4 weeks]
5. **Content ownership:** Nova as source of truth, client repo as source, or both modes? [2-4 weeks]
6. **Outcome measurement:** Self-report, time-delayed follow-up, external signal? [1-3 months]

### Strategic
7. When to show Accenture the intelligence dashboard? [After 2-3 weeks of POC data]
8. Should Ray use Nova now (rough) or wait for polish? [Give access to working modules, shield WIP]
9. How much architecture to reveal to Accenture? [Show dashboards/analytics. Protect agents/algorithms.]
10. Does 2gthr POC get absorbed or stay as reference? [Either way, Nova analytics sits on top]

---

## Part 7: Instructions for Claude Code

### Do
- Extend Solution model with tree structure for decomposition
- Connect solution decomposition to Feature records for analytics
- Build admin UIs surfacing existing backend capabilities
- Polish existing UIs for demo quality (problems, scoring, voting)
- Add social features to problems (commenting, favouriting)
- Scope everything to tenantId from JWT

### Don't
- Embed 2gthr terminology (Paths, Go-Cards, Milestones, MI, MyDNA) in Nova's core models
- Rebuild modules that work — extend and polish
- Create new packages/services without explicit instruction
- Change the 11-dimension scoring system
- Use Firebase or deviate from the tech stack
