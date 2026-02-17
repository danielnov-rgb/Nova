# Nova API (@nova/api)

NestJS 11 backend application. Port 3001.

## Stack

- NestJS 11 with TypeScript
- Prisma 7.3 ORM with PostgreSQL + pgvector
- JWT authentication via Passport
- Docker Compose for local PostgreSQL + Redis

## Database Commands

```bash
pnpm db:generate   # Regenerate Prisma client (see hoisting fix in root CLAUDE.md)
pnpm db:push       # Push schema to database
pnpm db:migrate    # Run migrations
```

Schema: `apps/api/prisma/schema.prisma`
Seed: `apps/api/prisma/seed.ts`

## Key Patterns

- Modular NestJS services in `src/`
- Each module has its own controller, service, and DTOs
- Auth guard applied via `@UseGuards(JwtAuthGuard)`
- XLSX import/export for bulk operations

## Prisma + pnpm Hoisting

After `prisma generate`, the client generates to `apps/api/node_modules/.prisma/client` but runtime resolves from the hoisted pnpm store. Always verify with:
```bash
node -e "console.log(require.resolve('@prisma/client'))"
```
And copy if needed (see root CLAUDE.md for full fix).
