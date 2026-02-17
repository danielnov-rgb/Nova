# Nova

Nova is a product intelligence platform that helps teams validate assumptions, track feature performance, and make evidence-driven product decisions.

## Monorepo Structure

```
Nova/
├── apps/
│   ├── web/          # @nova/web - Next.js 16 frontend (port 3000)
│   ├── api/          # @nova/api - NestJS backend (port 3001)
├── packages/
│   ├── ui/           # @repo/ui - Shared UI components
│   ├── nova-plugin/  # @nova/plugin - Analytics SDK for client apps
│   ├── nova-agent/   # @nova/agent - CLI for feature discovery
│   ├── research-agents/ # @nova/research-agents - Market intelligence
│   ├── eslint-config/   # @repo/eslint-config
│   └── typescript-config/ # @repo/typescript-config
├── services/
│   ├── problem-enricher/ # Problem enrichment service
│   └── research-intel/   # Research intelligence service
└── docs/
    └── knowledge/        # Shared knowledge base (see below)
```

**Tooling:** pnpm 9 workspaces, Turborepo, TypeScript 5.9, Node 18+

## Key Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build everything (Turbo cached)
pnpm db:generate      # Regenerate Prisma client
pnpm db:push          # Push schema to database
pnpm docker:up        # Start PostgreSQL + Redis
```

## Prisma Client Hoisting Fix

After `pnpm db:generate`, the Prisma client may not resolve correctly due to pnpm hoisting. Find the hoisted path and copy:
```bash
node -e "console.log(require.resolve('@prisma/client'))"
cp -r apps/api/node_modules/.prisma/client/* "<hoisted-path>/.prisma/client/"
```

## Design Tokens

Brand colors are defined in `apps/web/app/globals.css` under `@theme`:
- Primary: Sky blue (#0ea5e9) with full 50-950 scale
- Fonts: Inter (sans), GeistMono (mono)
- Dark-first design with scoped light theme overrides

## Related Repositories

- **Reports** (`danielnov-rgb/reports.git`): Client-facing reports and proposals, deployed to Vercel at enjoyscale.com. Standalone Next.js 15 app.

## Knowledge Base

Project-wide learnings are stored in `docs/knowledge/`. Use `/learn` to add new entries. See each `CLAUDE.md` in apps/ and packages/ for area-specific context.

## Conventions

- Use `workspace:*` protocol for internal package dependencies
- Feature-based folder structure: each route has `_components/`, `_data/`, `_lib/`
- Dark theme is default; light themes use scoped CSS class overrides (`.astro-light`, `.proposal-light`)
- PostHog for product analytics; Nova Plugin for feature tracking
- All client components must have `"use client"` directive
