# Architecture Knowledge

Learnings about system architecture, infrastructure, and deployment.

---

## Prisma Client Hoisting in pnpm Monorepo
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Discovered during initial monorepo setup -->

pnpm hoists `@prisma/client` to the store at `node_modules/.pnpm/@prisma+client@<version>_<hash>/node_modules/.prisma/client/`, but `prisma generate` outputs to `apps/api/node_modules/.prisma/client`. The runtime resolves the hoisted path, so the generated client is invisible.

**Fix:** Copy after generate:
```bash
cp -r apps/api/node_modules/.prisma/client/* "$(dirname $(node -e "console.log(require.resolve('@prisma/client'))"))/../../.prisma/client/"
```

---

## Two-Repo Deployment Architecture
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Discovered when building the FDE proposal -->

Nova has two git repos:
- `danielnov-rgb/Nova.git` - Main platform (monorepo). Not currently deployed to production.
- `danielnov-rgb/reports.git` - Client-facing reports and proposals. Deployed to Vercel at enjoyscale.com.

The reports repo is a standalone Next.js 15 app (not part of the monorepo). It shares design language (colors, patterns) but not code with the main repo. Future plan: consolidate into one deployment.

---

## Theme System Pattern
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Built across Astrolytics and Proposal features -->

Dark-first design. Light themes use scoped CSS class overrides with `!important`:
- Wrap section in `<div className="light-theme">` (or `astro-light`, etc.)
- CSS rules like `.light-theme .bg-gray-950 { background-color: #fff !important; }`
- ThemeProvider + useTheme() hook for toggle state
- System preference detection: `window.matchMedia("(prefers-color-scheme: light)")`
- localStorage for persistence

Use `.preserve-dark` class to keep elements dark inside light-themed sections (e.g., ad cards).

---

## Monorepo Structure
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Full monorepo overview from codebase analysis -->

```
Nova/
├── apps/
│   ├── web/          # Next.js 15.5 frontend (port 3000)
│   └── api/          # NestJS 11 backend (port 3001)
├── packages/
│   ├── nova-plugin/  # Analytics tracking SDK (@nova/plugin)
│   ├── nova-agent/   # CLI feature discovery tool
│   ├── research-agents/ # Market research orchestration
│   └── ui/           # Shared UI components (placeholder)
├── services/
│   ├── problem-enricher/ # AI problem enrichment service
│   └── research-intel/   # Research data pipeline
└── docs/knowledge/   # Shared knowledge base
```

**Key commands:**
- `pnpm dev` - Start all apps
- `pnpm build` - Build all
- `pnpm db:generate` - Regenerate Prisma client
- `pnpm db:push` - Push schema to DB
- `pnpm db:seed` - Seed demo data

---

## API Module Architecture (NestJS)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Comprehensive API exploration -->

The API (`apps/api`) is a NestJS 11 app with 16 feature modules:

| Module | Purpose |
|--------|---------|
| DatabaseModule | Prisma connection management (singleton) |
| AuthModule | JWT auth, registration, login, team code auth |
| ProblemsModule | Problem CRUD, CSV/Excel import, enrichment |
| VotingModule | Sessions, links, vote casting, results |
| VoterGroupsModule | Groups, team codes, membership |
| SprintsModule | Sprint management |
| OnboardingModule | Client context data |
| AudienceModule | Target audience definitions |
| MarketModule | Market intelligence tracking |
| CompetitorsModule | Competitor research |
| ProjectsModule | Project item management (Kanban) |
| SolutionsModule | Solution design tracking |
| FeaturesModule | Feature mapping (hierarchical) |
| PluginModule | Analytics event ingestion, plugin config |
| ProblemGroupsModule | Problem categorization |

**Global configuration in `main.ts`:**
- CORS: localhost:3000
- ValidationPipe: whitelist, transform, forbidNonWhitelisted
- DemoModeInterceptor: blocks mutations for demo users

---

## Authentication System
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Auth flow analysis across web + API -->

**JWT Setup:**
- Secret: `JWT_SECRET` env var (required)
- Expiry: 7 days
- Strategy: Passport `JwtStrategy`
- Payload: `{ sub: userId, email, tenantId, role, isDemoMode? }`

**Guards:**
- `JwtAuthGuard` - Validates Bearer token
- `RolesGuard` - Checks `@Roles()` decorator against user role

**Roles:** FDE, ADMIN, MEMBER, VOTER

**Frontend auth storage (localStorage):**
- Token: `nova_admin_token`
- User: `nova_admin_user` (JSON)
- Functions: `getToken()`, `getUser()`, `setAuth()`, `clearAuth()`, `isAuthenticated()`

**Demo Mode:**
- Users with `isDemoMode=true` can browse but mutations are blocked by `DemoModeInterceptor`
- Exceptions: voting, comments, favorites, auth endpoints
- API returns `{ statusCode: 403, demoMode: true, contactTeam }` on blocked writes

---

## Multi-Tenant Architecture
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Tenant isolation pattern in API -->

All data is scoped by `tenantId`. Controllers extract it from JWT: `req.user.tenantId`.

**Key constraints:**
- `@@unique([tenantId, email])` on User
- `@@unique([tenantId, name])` on VoterGroup
- All service queries filter by tenantId

**Tenant creation:** Transactional - `$transaction()` creates Tenant + first ADMIN user together.

---

## Plugin Analytics Pipeline
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: End-to-end analytics flow from SDK to dashboard -->

```
Client App → @nova/plugin tracker → batch events → POST /plugin/events
                                                        ↓
                                                  PluginApiKeyGuard (x-nova-api-key)
                                                        ↓
                                                  PluginService.ingestEvents()
                                                        ↓
                                                  AnalyticsEvent table (Prisma)
                                                        ↓
                                                  GET /plugin/analytics → Dashboard
```

- Events batched client-side (default: 10 events or 5s)
- Auto-flush on page visibility change
- API key format: `nova_` + 32 random chars

---

## Research Intelligence Pipeline
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Research agents package analysis -->

```
runTrendIntel(context)
    ↓
ResearchOrchestrator (max 3 concurrent)
    ↓
7 Specialized Agents (parallel execution)
    ├── SaasBenchmarksAgent
    ├── PricingIntelAgent
    ├── AdoptionSignalsAgent
    ├── MacroEconomyAgent
    ├── ConsumerSpendAgent
    ├── InternalPerformanceAgent
    └── SourceScoutAgent
    ↓
Deduplicate insights → ResearchReport
    ↓
services/research-intel/data/latest.json
    ↓
/research-intel page (web app)
```

8 insight categories: saas-benchmarks, pricing-intel, adoption, macro-economy, consumer-spend, innovation-trends, internal-performance, source-scout.

---

## Environment Variables
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Consolidated from both apps -->

**API (`apps/api/.env`):**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nova?schema=public
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

**Web (`apps/web/.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_POSTHOG_KEY=         # Optional - PostHog analytics
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_PROPOSAL_PASSWORD=nova2025
```
