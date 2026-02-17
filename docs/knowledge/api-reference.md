# API Reference

All Nova API endpoints organized by module. Base URL: `http://localhost:3001/api`

---

## Authentication
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Auth module endpoint analysis -->

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/auth/register` | None | Create tenant + admin user |
| POST | `/auth/register/voter` | None | Create voter in shared "Public Voters" tenant |
| POST | `/auth/register/team-code` | None | Register via team code (creates VOTER in code's tenant) |
| POST | `/auth/login` | None | Login, returns JWT + user object |
| GET | `/auth/me` | JWT | Get current user profile |

**Login response:** `{ accessToken, user: { id, email, role, tenantId, isDemoMode } }`

---

## Problems
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Problem management endpoints -->

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/problems` | ADMIN/FDE | Create problem |
| GET | `/problems` | Any JWT | List all (query: status, search) |
| GET | `/problems/:id` | Any JWT | Get one problem |
| PUT | `/problems/:id` | ADMIN/FDE | Update problem |
| DELETE | `/problems/:id` | ADMIN/FDE | Delete problem |
| POST | `/problems/import` | ADMIN/FDE | Bulk import JSON |
| POST | `/problems/import/csv` | ADMIN/FDE | CSV import |
| POST | `/problems/import/csv/preview` | ADMIN/FDE | Validate CSV first |
| POST | `/problems/import/excel` | ADMIN/FDE | Excel file upload |
| POST | `/problems/import/excel/preview` | ADMIN/FDE | Validate Excel first |
| POST | `/problems/enrich` | ADMIN/FDE | Single problem enrichment (placeholder) |
| POST | `/problems/enrich/batch` | ADMIN/FDE | Batch enrichment (placeholder) |
| POST | `/problems/import/enriched` | ADMIN/FDE | Import pre-enriched problems |

### Problem Comments & Favorites

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/problems/:id/comments` | Any JWT | List comments |
| POST | `/problems/:id/comments` | Any JWT | Add comment |
| PUT | `/problems/:id/comments/:commentId` | Owner | Update comment |
| DELETE | `/problems/:id/comments/:commentId` | Owner | Delete comment |
| GET | `/problems/:id/favourite` | Any JWT | Check favorite status |
| POST | `/problems/:id/favourite` | Any JWT | Add favorite |
| DELETE | `/problems/:id/favourite` | Any JWT | Remove favorite |
| GET | `/problems/favourites` | Any JWT | List user's favorites |

---

## Voting Sessions (Admin)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: VotingSessionsController endpoints -->

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/voting/sessions` | ADMIN/FDE | Create session (links problems + groups) |
| GET | `/voting/sessions` | Any JWT | List sessions with counts |
| GET | `/voting/sessions/:id` | Any JWT | Get session with vote summaries |
| PUT | `/voting/sessions/:id` | ADMIN/FDE | Update title/status/deadline |
| GET | `/voting/sessions/:id/results` | ADMIN/FDE | Aggregated results by credits |
| GET | `/voting/sessions/:id/results/by-group` | ADMIN/FDE | Results per voter group |
| GET | `/voting/sessions/:id/results/consensus` | ADMIN/FDE | Agreement/conflict analysis |
| GET | `/voting/sessions/:id/participation` | ADMIN/FDE | Participation rates per group |
| GET | `/voting/sessions/:id/voters` | ADMIN/FDE | All voters for session |
| GET | `/voting/sessions/:id/voters/:voterId` | ADMIN/FDE | Individual voter's votes |
| GET | `/voting/sessions/:id/groups` | ADMIN/FDE | Linked groups |
| POST | `/voting/sessions/:id/links` | ADMIN/FDE | Create voting link |
| POST | `/voting/sessions/:id/links/bulk` | ADMIN/FDE | Batch create links |
| GET | `/voting/sessions/:id/links` | ADMIN/FDE | List all links |

---

## Voting (Voter Interface)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Voter and public session endpoints -->

### Anonymous Voter (via VotingLink)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/vote/:token` | None | Get session info via link |
| POST | `/vote/:token` | None | Cast vote via link (auto-creates user) |

### Public Sessions

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/vote/session/:publicToken` | None | Get public session info |
| POST | `/vote/session/:publicToken/join` | JWT | Join public session |

### Authenticated Voter

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/voter/sessions` | JWT | List user's assigned sessions |
| GET | `/voter/sessions/:id` | JWT | Get voting interface |
| POST | `/voter/sessions/:id/vote` | JWT | Cast vote as user |
| POST | `/voter/sessions/:id/vote/bulk` | JWT | Cast multiple votes |
| POST | `/voter/sessions/:id/complete` | JWT | Mark session complete |
| GET | `/voter/sessions/:id/results` | JWT | View results (only after completing) |

---

## Voter Groups & Team Codes
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: VoterGroupsModule endpoints -->

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/voter-groups` | JWT | Create group |
| GET | `/voter-groups` | JWT | List groups with counts |
| GET | `/voter-groups/:id` | JWT | Get group with team codes |
| PUT | `/voter-groups/:id` | JWT | Update group |
| DELETE | `/voter-groups/:id` | JWT | Delete group (cascades) |
| GET | `/voter-groups/:id/members` | JWT | List members |
| POST | `/voter-groups/:id/codes` | JWT | Create team code |
| GET | `/team-codes` | JWT | List all codes |
| PUT | `/team-codes/:id` | JWT | Update code |
| DELETE | `/team-codes/:id` | JWT | Delete code |
| GET | `/team-codes/:code/validate` | None | Check if code is valid |
| POST | `/team-codes/:code/redeem` | JWT | Redeem code, join group |

---

## Plugin & Analytics
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: PluginModule endpoints -->

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/plugin/events` | API Key | Ingest analytics events (batch) |
| POST | `/plugin/features/bulk-import` | API Key | Bulk import feature definitions |
| GET | `/plugin/config` | JWT | Get plugin config |
| PUT | `/plugin/config` | JWT | Update config |
| POST | `/plugin/config/rotate-key` | JWT | Generate new API key |
| GET | `/plugin/analytics` | JWT | Get event stats (query: ?days=N) |

**API Key auth:** Header `x-nova-api-key`, validated by `PluginApiKeyGuard`.

**Event payload:**
```typescript
{
  featureId?: string,
  eventType: 'FEATURE_VIEW' | 'FEATURE_INTERACT' | 'FEATURE_COMPLETE' | 'FEATURE_ERROR' | 'FEATURE_EXIT' | 'PAGE_VIEW' | 'CUSTOM',
  eventName: string,
  sessionId: string,
  deviceId?: string,
  pageUrl?: string,
  metadata?: Record<string, any>,
  occurredAt?: string  // ISO datetime, defaults to now
}
```

---

## Other Modules
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Standard CRUD modules -->

Each follows standard REST patterns with JWT auth:

- **Sprints:** `/sprints` - CRUD for sprint management
- **Onboarding:** `/onboarding` - Client context data (objectives, terminology)
- **Audience:** `/audience` - Target audience definitions
- **Market:** `/market` - Market intelligence entries
- **Competitors:** `/competitors` - Competitor tracking
- **Projects:** `/projects` - Project items (Kanban board)
- **Solutions:** `/solutions` - Solution designs linked to problems
- **Features:** `/features` - Hierarchical feature mapping
- **Problem Groups:** `/problem-groups` - Problem categorization
