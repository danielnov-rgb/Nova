# Nova - Product Intelligence Platform

AI-powered product development co-pilot for B2B SaaS companies.

## Overview

Nova helps companies understand their market, discover user problems through synthetic research, prioritize what to build, and measure outcomes.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS (Next.js)
- **Backend:** NestJS (Node.js)
- **Database:** PostgreSQL with pgvector
- **Cache:** Redis

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- Docker (for local database)

### Setup

```bash
# Install dependencies
pnpm install

# Start database containers
pnpm docker:up

# Generate Prisma client and push schema
pnpm db:push

# Start development servers
pnpm dev
```

### Access Points

- **Web App:** http://localhost:3000
- **API:** http://localhost:3001/api

## Project Structure

```
nova/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
└── docker-compose.yml
```

## Development

```bash
# Run both frontend and API in development mode
pnpm dev

# Run only the frontend
pnpm dev --filter=@nova/web

# Run only the API
pnpm dev --filter=@nova/api

# Database commands
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Create migration
pnpm db:studio    # Open Prisma Studio (in api folder)

# Docker
pnpm docker:up    # Start PostgreSQL and Redis
pnpm docker:down  # Stop containers
```

## Architecture

See the full architecture documentation in the plan file for detailed information about:

- System architecture (cloud + local ML cluster)
- Core modules (10 phases)
- Data models
- Implementation roadmap

## License

Private - All rights reserved
