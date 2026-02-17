# Data Models

Prisma schema documentation and key data structures.

---

## Problem Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Core domain model from Prisma schema analysis -->

The central domain entity. Key fields:

```
Problem {
  id, title, description, hypothesis
  source: SYNTHETIC_INTERVIEW | MANUAL | IMPORT | RESEARCH
  status: DISCOVERED | SHORTLISTED | BACKLOG | IN_PROGRESS | SOLVED | DISCARDED
  evidenceItems: Json[]         # Array of evidence objects (NOT "evidence")
  evidenceSummary: String       # AI-generated summary text
  scores: Json                  # Dict of ScoreWithMeta objects
  priorityScore: Float          # Computed from scores
  embedding: Vector(1536)?      # pgvector for semantic search
  tags: String[]
  tenantId, sprintId?
}
```

**Evidence item shape:**
```typescript
{ id, type, content, source, sourceUrl, reportedBy, reportedAt, sentiment, weight }
```

**Score dimensions (11 total):**
- Core: applicability, severity, frequency, willingnessToPay
- Strategic: retentionImpact, acquisitionPotential, viralCoefficient, strategicFit
- Execution: feasibility, timeToValue, riskLevel

**Score shape:**
```typescript
{ value: number, confidence: number, justification: string, source: string }
```

**Relations:** votes, solutions, groups, comments, favourites

---

## VotingSession Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Voting system analysis -->

```
VotingSession {
  id, title, description, deadline
  status: DRAFT | ACTIVE | CLOSED | ARCHIVED
  sessionType: SPRINT_BASED | THEMATIC
  defaultCredits: Int           # Top-level field (NOT inside config)
  config: Json                  # Only: { creditsByRole?, requiredFields? }
  isPublic: Boolean
  publicToken: String?          # For shareable public sessions
  tenantId, sprintId?
}
```

**Junction tables:**
- `VotingSessionProblem` - Links problems with displayOrder
- `VotingSessionGroup` - Links voter groups with creditsOverride

---

## Vote Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Individual vote records -->

```
Vote {
  id, credits: Int, comment?
  votingSessionId, problemId, userId
  votedAt: DateTime
  @@unique([votingSessionId, problemId, userId])  # One vote per user per problem
}
```

Votes are upsertable - updating reuses the existing record.

---

## VoterGroup Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Voter organization system -->

```
VoterGroup {
  id, name
  type: LEADERSHIP | PROJECT_TEAM | EXTERNAL_USER
  defaultCredits: Int
  tenantId
}

VoterGroupMembership {
  userId, voterGroupId
  joinedVia: TEAM_CODE | EMAIL_LINK | ADMIN_ADD | PUBLIC
  joinedAt
}
```

---

## TeamCode Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Team code registration flow -->

```
TeamCode {
  id, code: String @unique       # Normalized to uppercase
  voterGroupId
  maxUses: Int?
  expiresAt: DateTime?
  isActive: Boolean
  uses: Int (default 0)
}

TeamCodeRedemption {
  id, teamCodeId, userId, redeemedAt
}
```

**Validation:** Must be active, not expired, not at max uses.

---

## VoterSession Model
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Tracks voter participation in sessions -->

```
VoterSession {
  id, votingSessionId, userId
  openedAt: DateTime?
  completedAt: DateTime?         # Set when voter marks "complete"
  creditsAllowed: Int?
}
```

Auto-created when authenticated user first accesses a session.

---

## User & Tenant Models
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Multi-tenant user system -->

```
Tenant {
  id, name, domain?, settings: Json?
  users[], voterGroups[], votingSessions[], problems[]
}

User {
  id, email, password (hashed)
  role: FDE | ADMIN | MEMBER | VOTER
  isDemoMode: Boolean (default false)
  tenantId
  @@unique([tenantId, email])
}
```

---

## Other Key Models
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Supporting models from schema -->

```
Sprint { id, name, status: PLANNING|ACTIVE|COMPLETED|ARCHIVED, startDate, endDate, tenantId }
Solution { id, title, description, status: DESIGNED|DEVELOPMENT|TESTING|LIVE|KILLED, problemId }
Feature { id, name, description, type, parentId?, codeFileUrl?, designFileUrl? }
ProblemGroup { id, name, color, icon, tenantId }
ProblemComment { id, content, problemId, userId, createdAt }
ProblemFavourite { id, problemId, userId, @@unique([problemId, userId]) }
AnalyticsEvent { id, eventType, eventName, featureId?, sessionId, deviceId?, metadata, occurredAt }
PluginConfig { id, tenantId, apiKey, allowedOrigins, eventsPerMinute }
ClientContext { id, tenantId, objectives, businessModel, terminology }
VotingLink { id, email, token, creditsAllowed, votingSessionId }
WeightingProfile { id, name, weights, tenantId }
AuditLog { id, action, entityType, entityId, userId, changes, createdAt }
```

---

## Seed Data (Demo)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Seed script for development -->

**Tenant:** "Demo Company" (demo.nova.ai)

**Users (26):**
- FDE: `fde@nova.ai` / password123 (full access)
- Admin: `admin@demo.com` / password123
- Demo FDE: `fde@novademo.com` / demo123 (full access, demo mode)
- 7 Leadership (demo mode), 3 Product team, 12 Team members, 4 Clients (demo mode)

**Groups (4):** Leadership (50 credits), Product Team (30), Team Members (10), Clients (50)

**Problems (12):** Realistic B2B SaaS issues with evidence and scores

**Session:** "Q1 2026 Priority Vote" (ACTIVE) with all 12 problems and 5 voting links
