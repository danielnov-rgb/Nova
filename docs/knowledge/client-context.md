# Client Context

Knowledge about clients, their platforms, and business terminology.

---

## 2gthr / Accenture
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Primary client engagement -->

**2gthr** is a platform built for Accenture focused on member life paths and professional development.

**Key terminology:**
- **Paths** - Member journeys through life/career stages
- **Milestones** - Key checkpoints within paths
- **Go-Cards** - Atomic action items members can complete
- **MyDNA** - Member identity/profile layer
- **MI (Mutual Intelligence)** - Conversational AI assistant
- **MLS** - The broader platform/system that solutions deploy into
- **FDE** - Forward Deployed Engineer (Nova's embedded team model)

**Engagement:** 6-month Forward Deployed team (3 FDEs), Time & Materials model at R1.2M/month. Mid-Feb 2026 to Mid-Aug 2026.

**Deliverables:** 3 validated solutions per month covering content/strategy, technical implementation, documentation, insights, and team acceleration.

**Reports deployed at:** enjoyscale.com (Vercel, from `danielnov-rgb/reports.git`)
- `/reports/together-poc` - POC development velocity report
- `/proposal` - FDE team proposal (password-gated: `nova2025`)
- `/proposal-summary` - Print-friendly one-pager

---

## 2gthr Platform Technical Details
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: From together-poc report content analysis -->

**What it is:** AI-powered professional development platform for Accenture members.

**Tech stack:** React 18 + Vite (frontend), Firebase (backend), Claude API + Google Vertex AI (AI tools)

**POC scope delivered in 3 weeks:**
- 103 UI components, 35,000+ lines of code
- 11 Go-Card types: Article, Quiz, Reflection, Event, Evidence, Assessment, Podcast, Video, Poll, Insights, Tool
- 6 AI-powered tools: CV Builder (Claude), Interview Story Builder (Vertex), Quick Proof Generator (Vertex), Role Evidence Matcher (Vertex), Evidence Co-Create (Vertex), Evidence Mapper (client-side)
- 1 complete learning path: 6 milestones, 29 go-cards, 469 total strides
- Full design system with light/dark mode, 50+ design tokens
- Admin & content management with RBAC

**Key metrics (from report):**
- Acceleration factor: 6-8x (3 weeks vs traditional 17-24 weeks)
- 15 service modules
- 5 Firebase services integrated
- 2 AI provider integrations
- 4 state machines implemented

**User journey:** Signup > Take assessment > Explore path > Complete go-cards > Build portfolio > Track progress

**Portability:** 25-37 day estimated migration from Firebase to enterprise infrastructure. Clean service layer abstraction already in place.

**Hosted tools opportunity:** 5 independently deployable AI tools as microservices. Estimated infra cost: $1,700-3,200/month.

---

## Nova Web App Routes
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Full route table from web app exploration -->

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Sales/landing pages | None |
| `/admin/login` | Admin login | None |
| `/admin` | Admin dashboard | JWT (FDE/ADMIN) |
| `/admin/problems` | Problem management (Kanban/list/card) | JWT |
| `/admin/sessions` | Voting session management | JWT |
| `/admin/sessions/new` | Create session wizard (5 steps) | JWT |
| `/admin/sessions/[id]` | Session details | JWT |
| `/admin/sessions/[id]/results` | Results (overall, by-group, consensus) | JWT |
| `/admin/groups` | Voter group management | JWT |
| `/admin/sprints` | Sprint management | JWT |
| `/admin/import` | CSV/Excel import | JWT |
| `/admin/plugin` | Plugin configuration | JWT |
| `/admin/plugin/demo` | Plugin demo with tracking | JWT |
| `/admin/onboarding` | Client context | JWT |
| `/admin/audience` | Target audience | JWT |
| `/admin/market` | Market intelligence | JWT |
| `/admin/competitors` | Competitor tracking | JWT |
| `/admin/projects` | Project items (Kanban) | JWT |
| `/admin/solutions` | Solution design | JWT |
| `/admin/features` | Feature tracking | JWT |
| `/voter/login` | Voter login | None |
| `/voter/register` | Voter registration | None |
| `/voter/dashboard` | Assigned sessions | JWT (VOTER) |
| `/voter/sessions/[id]` | Vote on problems | JWT |
| `/vote/session/[token]` | Public session join | None/JWT |
| `/join/[code]` | Team code registration | None |
| `/astrolytics/*` | Analytics dashboard (12+ sub-routes) | JWT |
| `/proposal` | FDE proposal (password gated) | Password |
| `/proposal-summary` | Print-friendly summary | None |
| `/reports/together-poc/*` | POC velocity report (7 sub-pages) | None |
| `/research-intel` | Research agents dashboard | JWT |

---

## Astrolytics Dashboard
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Analytics dashboard exploration -->

Full product analytics dashboard at `/astrolytics/` with 12+ sub-routes:
Dashboard, Trends, Funnels, Retention, Paths, Lifecycle, People, Cohorts, Feature Flags, Experiments, Surveys, Session Replay, SQL Query Builder.

Uses custom dark theme (`.astro-light` class for light mode), Recharts for charts, comprehensive type system in `_lib/types.ts`.

**Note:** Currently uses mock/static data - not connected to a real analytics backend yet.
