# Nova — Product Intelligence Platform: System Context Document

> **Purpose:** Feed this document to Claude Chat so it has full awareness of Nova's architecture, data models, built modules, and planned direction.
> **Generated:** 2026-02-11

---

## 1. What Nova Is

Nova is an AI-powered product development co-pilot for B2B SaaS companies. It helps companies understand their market, discover user problems through synthetic research, prioritise what to build via structured voting, and measure outcomes through feature analytics.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript 5.9 |
| Backend | NestJS 11 · Node.js 18+ · Passport JWT auth |
| Database | PostgreSQL 16 with pgvector (vector embeddings) |
| Cache | Redis 7 |
| ORM | Prisma 7 with PostgreSQL adapter |
| Monorepo | pnpm workspaces + Turborepo |
| Containers | Docker Compose (pgvector/pgvector:pg16, redis:7-alpine) |
| AI Services | Claude API (problem enrichment), custom research agents |

---

## 3. Monorepo Structure

```
nova/
├── apps/
│   ├── api/               # NestJS backend (port 3001)
│   └── web/               # Next.js frontend (port 3000)
├── packages/
│   ├── nova-agent/         # CLI for feature discovery & instrumentation
│   ├── nova-plugin/        # Client-side analytics tracker (JS + React)
│   ├── research-agents/    # Multi-agent research intelligence system
│   ├── ui/                 # Shared React UI components
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TS config
├── services/
│   ├── problem-enricher/   # Python service — enrich problems via Claude API
│   └── research-intel/     # Node service — orchestrate research pipeline
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 4. Data Models (Prisma Schema)

### 4.1 Multi-Tenancy & Auth

**Tenant** — top-level organisation. All data is scoped to a tenant.
Fields: id, name, domain (unique), settings (JSON), timestamps.
Relations: users, clientContexts, problems, votingSessions, solutions, audiences, voterGroups, sprints, weightingProfiles, problemGroups, features, pluginConfig.

**User** — belongs to a tenant.
Fields: id, tenantId, email, passwordHash, role (UserRole enum), firstName, lastName, avatarUrl, timestamps.
Unique constraint: (tenantId, email).

**UserRole** enum: FDE (super admin), ADMIN, MEMBER, VOTER.

### 4.2 Client Onboarding

**ClientContext** — one per tenant, stores onboarding data.
Fields: objectives, businessModel, competitiveAdvantages, existingProblems, designSystemUrl, gitRepoUrl, terminologyGlossary (JSON).

### 4.3 Target Audience

**TargetAudience** — audience definitions per tenant.
Fields: name, type (TargetAudienceType), segments (JSON array), targets (JSON).

**TargetAudienceType** enum: EXISTING, TARGET, MARKET.

### 4.4 Market Intelligence

**MarketIntelligence** — market data entries.
Fields: category (MarketIntelligenceCategory), title, value, source, notes, metadata (JSON).

**MarketIntelligenceCategory** enum: INDUSTRY, BENCHMARK, ECONOMIC, PRICING, DEMOGRAPHIC.

### 4.5 Competitor Research

**Competitor** — competitor profiles.
Fields: name, website, description, strengths (JSON array), weaknesses (JSON array), pricing (JSON), solutions (JSON array), notes.

### 4.6 Voter Groups & Team Codes

**VoterGroup** — categorises voters by type with vote weight multipliers.
Fields: name, type (VoterGroupType), description, weight (Float, default 1.0), defaultCredits (Int, default 10).

**VoterGroupType** enum: LEADERSHIP, PROJECT_TEAM, EXTERNAL_USER.

**TeamCode** — shareable codes for joining voter groups.
Fields: code (unique), maxUses, usesCount, expiresAt, isActive.

**TeamCodeRedemption** — tracks who redeemed which code.

**VoterGroupMembership** — links users to groups.
Fields: joinedVia (JoinMethod enum: TEAM_CODE, EMAIL_LINK, ADMIN_ADD, PUBLIC).

**VotingSessionGroup** — links voting sessions to voter groups with optional credit overrides.

### 4.7 Sprints

**Sprint** — time-boxed periods for organising problems.
Fields: name, description, startDate, endDate, status (SprintStatus).

**SprintStatus** enum: PLANNING, ACTIVE, COMPLETED, ARCHIVED.

### 4.8 Problem Discovery & Voting (Core Domain)

**Problem** — the central entity. Represents a user/market problem.
Fields:
- Basic: title, description, hypothesis ("We believe that…")
- Source & Evidence: source (ProblemSource), evidenceItems (JSON array of EvidenceItem), evidenceSummary (AI text), embedding (vector 1536)
- Scoring: scores (JSON — ScoreWithMeta per attribute), priorityScore (Float, computed)
- Organisation: status (ProblemStatus), isShortlisted, shortlistOrder, tags (String array)
- Metadata: lastScoredAt, lastScoredBy, timestamps

**ProblemSource** enum: SYNTHETIC_INTERVIEW, MANUAL, IMPORT, RESEARCH.

**ProblemStatus** enum: DISCOVERED, SHORTLISTED, BACKLOG, IN_PROGRESS, SOLVED, DISCARDED.

**Scoring Attributes** (11 dimensions — stored in scores JSON):
applicability, severity, frequency, willingness_to_pay, retention_impact, acquisition_potential, viral_coefficient, strategic_fit, feasibility, time_to_value, risk_level.
Each score has: value (0-10), justification (text), confidence (0-1).

### 4.9 Weighting Profiles

**WeightingProfile** — configurable weight sets per tenant for computing priorityScore.
Fields: name, description, isDefault, weights (JSON).

### 4.10 Problem Groups

**ProblemGroup** — organise problems into thematic groups.
Fields: name, description, color (hex), icon.

**ProblemGroupMembership** — many-to-many link between Problem and ProblemGroup.

### 4.11 Voting Sessions

**VotingSession** — a voting round where voters allocate credits to problems.
Fields: title, description, deadline, status (VotingSessionStatus), sessionType (SessionType), config (JSON), isPublic, publicToken (unique), defaultCredits.

**VotingSessionStatus** enum: DRAFT, ACTIVE, CLOSED, ARCHIVED.
**SessionType** enum: SPRINT_BASED, THEMATIC.

**VotingSessionProblem** — links problems to sessions with displayOrder and preScore.

**Vote** — individual credit allocation.
Fields: votingSessionId, problemId, userId, voterGroupId, creditsAssigned, comment.
Unique: (votingSessionId, problemId, userId).

**VotingLink** — token-based anonymous voting links with expiry.

**VoterSession** — tracks registered voter participation (credits, opened/completed timestamps).

### 4.12 Solutions

**Solution** — proposed solutions linked to problems.
Fields: title, description, mockups (JSON array), assumptions (JSON), status (SolutionStatus).

**SolutionStatus** enum: DESIGNED, DEVELOPMENT, TESTING, LIVE, KILLED.

### 4.13 Project Management

**ProjectItem** — lightweight project tracking.
Fields: title, description, problemId (optional), status (ProjectItemStatus), priority, assignee.

**ProjectItemStatus** enum: BACKLOG, IN_PROGRESS, REVIEW, DONE.

### 4.14 Feature Map

**Feature** — hierarchical feature tree with code links.
Fields: featureId (human-readable slug), parentId (self-referential), name, description, status (FeatureStatus), codeLocations (JSON), designFiles (JSON), tags.

**FeatureStatus** enum: DRAFT, ACTIVE, DEPRECATED, ARCHIVED.

### 4.15 Analytics Events

**AnalyticsEvent** — feature usage tracking events.
Fields: featureId, eventType (EventType), eventName, sessionId, deviceId, pageUrl, referrer, userAgent, metadata (JSON), occurredAt.

**EventType** enum: FEATURE_VIEW, FEATURE_INTERACT, FEATURE_COMPLETE, FEATURE_ERROR, FEATURE_EXIT, PAGE_VIEW, CUSTOM.

### 4.16 Plugin Configuration

**PluginConfig** — per-tenant config for the analytics plugin.
Fields: apiKey (unique), isEnabled, allowedOrigins (String array), eventsPerMinute (rate limit).

### 4.17 Audit Log

**AuditLog** — tracks all mutations across the system.
Fields: tenantId, userId, action, entity, entityId, changes (JSON), metadata (JSON).

---

## 5. API Endpoints (NestJS Backend)

All endpoints are at `http://localhost:3001/api`. Most require JWT auth (Bearer token). Tenant scoping is automatic from the JWT.

### 5.1 Auth (`/auth`)
- POST `/auth/register` — Register new user
- POST `/auth/register/voter` — Register as voter
- POST `/auth/register/team-code` — Register with team code
- POST `/auth/login` — Login, returns JWT
- GET `/auth/me` — Get current user profile

### 5.2 Problems (`/problems`)
- POST `/problems` — Create problem
- GET `/problems` — List with filters (status, search)
- GET `/problems/:id` — Get details
- PUT `/problems/:id` — Update
- DELETE `/problems/:id` — Delete
- POST `/problems/import` — Import from JSON
- POST `/problems/import/csv/preview` — Preview CSV import
- POST `/problems/import/csv` — Import from CSV
- POST `/problems/import/excel/preview` — Preview Excel import
- POST `/problems/import/excel` — Import from Excel
- POST `/problems/enrich` — Enrich single problem (AI)
- POST `/problems/enrich/batch` — Batch enrich (AI)
- POST `/problems/import/enriched` — Import pre-enriched problems

### 5.3 Voting Sessions (`/voting/sessions`) — Admin
- POST `/voting/sessions` — Create session
- GET `/voting/sessions` — List all
- GET `/voting/sessions/:id` — Get details
- PUT `/voting/sessions/:id` — Update
- GET `/voting/sessions/:id/results` — Results
- GET `/voting/sessions/:id/results/by-group` — Results by voter group
- GET `/voting/sessions/:id/results/consensus` — Consensus analysis
- GET `/voting/sessions/:id/participation` — Participation stats
- GET `/voting/sessions/:id/groups` — Session groups
- POST `/voting/sessions/:id/links` — Create voting link
- POST `/voting/sessions/:id/links/bulk` — Bulk create links
- GET `/voting/sessions/:id/links` — List links
- GET `/voting/sessions/:id/voters` — List voters
- GET `/voting/sessions/:id/voters/:voterId` — Voter details

### 5.4 Public Voting (`/vote`)
- GET `/vote/:token` — Get session by token (no auth)
- POST `/vote/:token` — Cast vote (no auth)
- POST `/vote/:token/bulk` — Cast multiple votes (no auth)
- GET `/vote/session/:publicToken` — Public session info
- POST `/vote/session/:publicToken/join` — Join public session (JWT)

### 5.5 Authenticated Voter (`/voter`)
- GET `/voter/sessions` — My assigned sessions
- GET `/voter/sessions/:id` — Voter interface for session
- POST `/voter/sessions/:id/vote` — Cast vote
- POST `/voter/sessions/:id/votes` — Cast multiple votes
- POST `/voter/sessions/:id/complete` — Mark complete

### 5.6 Voter Groups (`/voter-groups`)
- Full CRUD on groups
- GET `/voter-groups/:id/members` — Group members
- POST `/voter-groups/:id/codes` — Create team code

### 5.7 Team Codes (`/team-codes`)
- GET `/team-codes` — List all (admin)
- PUT `/team-codes/:id` — Update
- DELETE `/team-codes/:id` — Delete
- GET `/team-codes/:code/validate` — Validate code (public)
- POST `/team-codes/:code/redeem` — Redeem code (JWT)

### 5.8 Sprints (`/sprints`)
- Full CRUD
- GET `/sprints/unassigned-problems` — Problems not in any sprint
- POST `/sprints/:id/problems` — Assign problems
- DELETE `/sprints/:id/problems` — Unassign problems

### 5.9 Onboarding (`/onboarding`)
- GET `/onboarding` — Get client context
- PUT `/onboarding` — Update client context
- GET/PUT `/onboarding/terminology` — Get/update glossary
- POST `/onboarding/terminology/:term` — Add term
- DELETE `/onboarding/terminology/:term` — Remove term

### 5.10 Audience (`/audience`)
- Full CRUD, filter by ?type

### 5.11 Market Intelligence (`/market`)
- Full CRUD, filter by ?category

### 5.12 Competitors (`/competitors`)
- Full CRUD

### 5.13 Projects (`/projects`)
- Full CRUD
- GET `/projects/by-status` — Grouped by status
- PUT `/projects/reorder` — Reorder items

### 5.14 Solutions (`/solutions`)
- Full CRUD
- GET `/solutions/by-problem/:problemId` — Solutions for a problem

### 5.15 Features (`/features`)
- Full CRUD
- POST `/features/bulk-import` — Bulk import
- GET `/features/tree` — Hierarchical tree
- GET `/features/by-feature-id/:featureId` — By slug
- GET `/features/:id/events/count` — Event count

### 5.16 Plugin (`/plugin`)
- POST `/plugin/events` — Ingest events (API key auth via x-nova-api-key)
- POST `/plugin/features/bulk-import` — Bulk import features (API key auth)
- GET `/plugin/config` — Get config (JWT)
- PUT `/plugin/config` — Update config (JWT)
- POST `/plugin/config/rotate-key` — Rotate API key (JWT)
- GET `/plugin/analytics` — Analytics stats (JWT, ?days filter)

### 5.17 Problem Groups (`/problem-groups`)
- Full CRUD on groups
- POST/DELETE/GET `/problem-groups/:id/problems` — Manage group membership
- POST `/problem-groups/bulk/add` — Bulk add
- POST `/problem-groups/bulk/remove` — Bulk remove

---

## 6. Frontend Pages (Next.js App Router)

### 6.1 Sales/Marketing Site (`/(sales)`)
- `/` — Landing page with hero, benefits, process steps, use cases
- `/features/[slug]` — Individual feature pages
- `/contact` — Contact form

### 6.2 Admin Dashboard (`/admin`)
- `/admin` — Dashboard home
- `/admin/login` — Admin login
- `/admin/onboarding` — Client context setup
- `/admin/problems` — Problem list (Kanban, list views, filters, bulk actions, weighting sliders)
- `/admin/problems/[id]` — Problem detail
- `/admin/problems/new` — Create problem
- `/admin/import` — Import problems (CSV/Excel)
- `/admin/sessions` — Voting sessions list
- `/admin/sessions/[id]` — Session detail, results, voters, links
- `/admin/sessions/new` — Create session (problem selector, voter groups, preview)
- `/admin/groups` — Problem groups management
- `/admin/sprints` — Sprint management
- `/admin/audience` — Audience management with persona grid, demographic charts
- `/admin/audience/personas` — Persona management
- `/admin/competitors` — Competitor profiles
- `/admin/market` — Market intelligence
- `/admin/solutions` — Solutions management
- `/admin/projects` — Project management
- `/admin/features` — Feature map
- `/admin/analytics` — Analytics dashboard
- `/admin/plugin` — Plugin config & demo

### 6.3 Voter Interface (`/voter`)
- `/voter/login` — Voter login
- `/voter/register` — Voter registration
- `/voter/dashboard` — Voter dashboard (assigned sessions)
- `/voter/sessions/[id]` — Voting interface
- `/voter/join/[publicToken]` — Join public session

### 6.4 Public Routes
- `/vote/[token]` — Anonymous voting via link
- `/join/[code]` — Join via team code
- `/research-intel` — Research intelligence viewer

---

## 7. Packages Detail

### 7.1 @nova/agent (Feature Discovery CLI)
CLI tool that scans JavaScript/TypeScript codebases to automatically discover features (pages, components, forms, modals) and generate Nova plugin instrumentation. Detects framework (Next.js, React, Vue, Angular, Nuxt), creates Git branches, and syncs features to the Nova API.
Commands: `auth`, `discover`, `config`.
Status: Implemented.

### 7.2 @nova/plugin (Analytics Tracker)
Client-side library for tracking feature usage. Core JS tracker + React integration (NovaProvider, useNova, NovaFeature, NovaFeedbackWidget, useNovaFeedback). Batches events and flushes to `/plugin/events` endpoint. Session and device tracking built in.
Status: Implemented.

### 7.3 @nova/research-agents (Multi-Agent Intelligence)
Research orchestration system with 8 independent agents: SaaS Benchmarks, Pricing Intel, Adoption Signals, Macro Economy, Consumer Spend, Innovation Trends, Internal Performance, Source Scout. Runs concurrently, deduplicates insights, generates scored reports with evidence chains.
Status: Implemented.

### 7.4 @repo/ui (Shared Components)
Shared React component library (Button, Card, Code). Currently stub implementations.
Status: Minimal/Stub.

---

## 8. Services Detail

### 8.1 problem-enricher (Python)
Reads problems from Excel, enriches each via Claude API with 11-dimensional scoring, evidence generation, and hypothesis formulation. Outputs JSON, CSV, or TypeScript. Supports resume, dry-run, token tracking.
Status: Implemented.

### 8.2 research-intel (Node.js)
CLI service that runs the research-agents pipeline and writes structured JSON reports to disk. Accepts CLI args for markets, industries, horizon, focus areas. Outputs timestamped reports + latest.json + manifest.json with display hints for dashboards.
Status: Implemented.

---

## 9. Infrastructure

### Docker Compose
- **PostgreSQL 16** with pgvector extension (port 5432), DB name: nova
- **Redis 7** Alpine (port 6379)
- Named volumes for data persistence

### Key Commands
```bash
pnpm install          # Install all deps
pnpm docker:up        # Start Postgres + Redis
pnpm db:push          # Push Prisma schema
pnpm dev              # Start API (3001) + Web (3000)
pnpm db:studio        # Prisma Studio (in api folder)
pnpm db:seed          # Seed database
```

---

## 10. Authentication Architecture

- JWT-based auth via @nestjs/jwt and passport-jwt
- Roles: FDE (super admin / forward deployed engineer), ADMIN, MEMBER, VOTER
- Multi-tenant: tenant scoping derived from JWT claims
- Public endpoints: voting links (token-based), team code validation, public session join
- Plugin auth: separate API key via x-nova-api-key header

---

## 11. Key Architectural Patterns

1. **Multi-tenant by default** — every query is scoped to tenantId from JWT
2. **Credit-based voting** — voters allocate limited credits across problems (quadratic voting compatible)
3. **11-dimension scoring** — problems scored across applicability, severity, frequency, willingness to pay, retention impact, acquisition potential, viral coefficient, strategic fit, feasibility, time to value, risk level
4. **Configurable weighting** — WeightingProfile lets each tenant define how scores map to priority
5. **Evidence-driven problems** — each problem carries structured evidence items with source, type, confidence, sentiment
6. **Feature tree with analytics bridge** — features form a hierarchy; the plugin tracks real usage against the feature map
7. **Research agent pipeline** — independent agents produce insights that feed into market intelligence and problem discovery
8. **Problem enrichment** — Claude API enriches raw problems with scores, evidence, and hypotheses
