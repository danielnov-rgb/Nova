# Decision: Two-Repo Architecture for Reports

**Date:** 2026-02-17
**Status:** Active
**Author:** Daniel

## Context

Needed to deploy client-facing reports and proposals to Vercel while keeping the main Nova platform in a separate monorepo.

## Decision

Maintain two git repos:
1. `Nova.git` - Main monorepo (apps/web, apps/api, packages)
2. `reports.git` - Standalone Next.js app for client-facing content

## Rationale

- Reports need independent deployment to enjoyscale.com
- Leadership reviews reports on a different cadence than platform development
- No backend dependency needed for reports (static/client-only content)
- Avoids coupling report deployments to platform CI/CD

## Consequences

- Design tokens and component patterns are duplicated (not shared via packages)
- Changes to brand colors/patterns must be manually synced
- Future plan: may consolidate into monorepo with `apps/reports` when ready

## Future Consideration

When building a shared design system (`@nova/ui`), consider either:
- Moving reports into the monorepo as `apps/reports`
- Publishing `@nova/ui` to npm for cross-repo consumption
