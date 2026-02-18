import { PrismaClient, ProblemSource, ProblemStatus, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file
dotenv.config();

// Create Prisma client with adapter (Prisma 7 requirement)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nova',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with 2gthr demo data...\n');

  // ============================================================================
  // TENANT
  // ============================================================================

  const tenant = await prisma.tenant.upsert({
    where: { domain: '2gthr.nova.ai' },
    update: {},
    create: {
      name: '2gthr',
      domain: '2gthr.nova.ai',
      settings: {
        votingCredits: {
          LEADERSHIP: 50,
          PRODUCT_LEAD: 30,
          TEAM_MEMBER: 10,
        },
      },
    },
  });
  console.log(`Created tenant: ${tenant.name} (${tenant.id})`);

  // ============================================================================
  // CLIENT CONTEXT (Strategy Agent)
  // ============================================================================

  await prisma.clientContext.upsert({
    where: { tenantId: tenant.id },
    update: {
      objectives: 'Build a professional development platform targeting 100,000 active users — 60% from existing 150K member base, 40% new acquisition from younger professionals. Deliver AI-powered career evidence building, structured professional development paths, and measurable career outcomes.',
      businessModel: 'B2B2C — member organization funds platform development; new users acquired via freemium model. Revenue from platform licensing to the member organization and premium features for individual users. 150K captive distribution channel through existing membership.',
      competitiveAdvantages: 'AI-powered evidence building for non-creative professionals. 150K captive member base as built-in distribution. Professional-services focus (doctors, lawyers, accountants) rather than generic career advice. Structured Go-Card micro-action format drives completion rates.',
      existingProblems: 'Older core demographic (55-65) is less app-savvy — onboarding must be frictionless. Evidence deficit for non-creative professionals is the #1 validated problem. Need to attract younger audience (25-45) without alienating core members. CPD compliance is a potential hook but varies by profession.',
    },
    create: {
      tenantId: tenant.id,
      objectives: 'Build a professional development platform targeting 100,000 active users — 60% from existing 150K member base, 40% new acquisition from younger professionals. Deliver AI-powered career evidence building, structured professional development paths, and measurable career outcomes.',
      businessModel: 'B2B2C — member organization funds platform development; new users acquired via freemium model. Revenue from platform licensing to the member organization and premium features for individual users. 150K captive distribution channel through existing membership.',
      competitiveAdvantages: 'AI-powered evidence building for non-creative professionals. 150K captive member base as built-in distribution. Professional-services focus (doctors, lawyers, accountants) rather than generic career advice. Structured Go-Card micro-action format drives completion rates.',
      existingProblems: 'Older core demographic (55-65) is less app-savvy — onboarding must be frictionless. Evidence deficit for non-creative professionals is the #1 validated problem. Need to attract younger audience (25-45) without alienating core members. CPD compliance is a potential hook but varies by profession.',
      terminologyGlossary: {
        'Go-Card': 'Micro-action card — a single focused task within a Milestone (e.g. "Draft your 2-minute elevator pitch")',
        'Path': 'A structured learning/development journey made up of Milestones (e.g. "Land Your Next Job")',
        'Milestone': 'A stage within a Path containing multiple Go-Cards (e.g. "Build Your Evidence Portfolio")',
        'Stride': 'A time-boxed sprint of Go-Cards a user commits to completing (e.g. "This week: 5 Go-Cards")',
        'MyDNA': 'User profile built from completed Go-Cards — their skills, evidence, and achievements',
        'Evidence': 'Tangible proof of professional capability uploaded or generated via AI tools',
        'MI': 'Machine Intelligence companion — the AI assistant embedded in Go-Cards and tools',
      },
    },
  });
  console.log('Seeded ClientContext (Strategy Agent data)');

  // ============================================================================
  // USERS & VOTER GROUPS
  // ============================================================================

  const passwordHash = await bcrypt.hash('password123', 10);
  const demoPasswordHash = await bcrypt.hash('demo123', 10);

  // FDE user
  const fdeUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'fde@nova.ai' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'fde@nova.ai',
      passwordHash,
      role: UserRole.FDE,
      firstName: 'Forward',
      lastName: 'Engineer',
    },
  });
  console.log(`Created FDE user: ${fdeUser.email}`);

  // Admin user
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@demo.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@demo.com',
      passwordHash,
      role: UserRole.ADMIN,
      firstName: 'Demo',
      lastName: 'Admin',
    },
  });

  // Voter Groups
  const leadershipGroup = await prisma.voterGroup.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Leadership' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Leadership',
      type: 'LEADERSHIP',
      description: 'Executive leadership team',
      defaultCredits: 50,
    },
  });

  const productTeamGroup = await prisma.voterGroup.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Product Team' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Product Team',
      type: 'PROJECT_TEAM',
      description: 'Product team with full access',
      defaultCredits: 30,
    },
  });

  const teamMembersGroup = await prisma.voterGroup.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Team Members' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Team Members',
      type: 'PROJECT_TEAM',
      description: 'General team members',
      defaultCredits: 10,
    },
  });

  const clientsGroup = await prisma.voterGroup.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Clients' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Clients',
      type: 'EXTERNAL_USER',
      description: 'External client stakeholders',
      defaultCredits: 50,
    },
  });
  console.log('Created VoterGroups: Leadership, Product Team, Team Members, Clients');

  // FDE demo user
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'fde@novademo.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'fde@novademo.com',
      passwordHash: demoPasswordHash,
      role: UserRole.FDE,
      firstName: 'FDE Admin',
      isDemoMode: false,
    },
  });

  // Create demo users and track references for voting
  interface UserRef { id: string; firstName: string }
  const leadershipUsers: UserRef[] = [];
  const productTeamUsers: UserRef[] = [];
  const teamMemberUsers: UserRef[] = [];
  const clientUsers: UserRef[] = [];

  const demoUsersData = {
    leadership: [
      { firstName: 'Steven', email: 'steven@novademo.com' },
      { firstName: 'Marcel', email: 'marcel@novademo.com' },
      { firstName: 'Bavini', email: 'bavini@novademo.com' },
      { firstName: 'Dee', email: 'dee@novademo.com' },
      { firstName: 'Dave', email: 'dave@novademo.com' },
      { firstName: 'Sonja', email: 'sonja@novademo.com' },
      { firstName: 'Luis', email: 'luis@novademo.com' },
    ],
    productTeam: [
      { firstName: 'Daniel', email: 'daniel@novademo.com' },
      { firstName: 'Jacques', email: 'jacques@novademo.com' },
      { firstName: 'Ray', email: 'ray@novademo.com' },
    ],
    teamMembers: [
      { firstName: 'Meagan', email: 'meagan@novademo.com' },
      { firstName: 'Matt', email: 'matt@novademo.com' },
      { firstName: 'Flo', email: 'flo@novademo.com' },
      { firstName: 'Courtney', email: 'courtney@novademo.com' },
      { firstName: 'Nikolay', email: 'nikolay@novademo.com' },
      { firstName: 'Carmen', email: 'carmen@novademo.com' },
      { firstName: 'Larissa', email: 'larissa@novademo.com' },
      { firstName: 'Rouleaux', email: 'rouleaux@novademo.com' },
      { firstName: 'Muzi', email: 'muzi@novademo.com' },
      { firstName: 'Liezahn', email: 'liezahn@novademo.com' },
      { firstName: 'Camilla', email: 'camilla@novademo.com' },
      { firstName: 'Kylan', email: 'kylan@novademo.com' },
    ],
    clients: [
      { firstName: 'Werner', email: 'werner@novademo.com' },
      { firstName: 'Isak', email: 'isak@novademo.com' },
      { firstName: 'Chantelle', email: 'chantelle@novademo.com' },
      { firstName: 'Lewy', email: 'lewy@novademo.com' },
    ],
  };

  // Leadership users (Demo Mode)
  for (const userData of demoUsersData.leadership) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: userData.email } },
      update: { isDemoMode: true },
      create: {
        tenantId: tenant.id,
        email: userData.email,
        passwordHash: demoPasswordHash,
        role: UserRole.ADMIN,
        firstName: userData.firstName,
        isDemoMode: true,
      },
    });
    await prisma.voterGroupMembership.upsert({
      where: { userId_voterGroupId: { userId: user.id, voterGroupId: leadershipGroup.id } },
      update: {},
      create: { userId: user.id, voterGroupId: leadershipGroup.id, joinedVia: 'ADMIN_ADD' },
    });
    leadershipUsers.push({ id: user.id, firstName: userData.firstName });
  }

  // Product Team users (Full Access)
  for (const userData of demoUsersData.productTeam) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: userData.email } },
      update: { isDemoMode: false },
      create: {
        tenantId: tenant.id,
        email: userData.email,
        passwordHash: demoPasswordHash,
        role: UserRole.ADMIN,
        firstName: userData.firstName,
        isDemoMode: false,
      },
    });
    await prisma.voterGroupMembership.upsert({
      where: { userId_voterGroupId: { userId: user.id, voterGroupId: productTeamGroup.id } },
      update: {},
      create: { userId: user.id, voterGroupId: productTeamGroup.id, joinedVia: 'ADMIN_ADD' },
    });
    productTeamUsers.push({ id: user.id, firstName: userData.firstName });
  }

  // Team Members (Read-only + Comments + Voting)
  for (const userData of demoUsersData.teamMembers) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: userData.email } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: userData.email,
        passwordHash: demoPasswordHash,
        role: UserRole.MEMBER,
        firstName: userData.firstName,
        isDemoMode: false,
      },
    });
    await prisma.voterGroupMembership.upsert({
      where: { userId_voterGroupId: { userId: user.id, voterGroupId: teamMembersGroup.id } },
      update: {},
      create: { userId: user.id, voterGroupId: teamMembersGroup.id, joinedVia: 'ADMIN_ADD' },
    });
    teamMemberUsers.push({ id: user.id, firstName: userData.firstName });
  }

  // Clients (Demo Mode)
  for (const userData of demoUsersData.clients) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: userData.email } },
      update: { isDemoMode: true },
      create: {
        tenantId: tenant.id,
        email: userData.email,
        passwordHash: demoPasswordHash,
        role: UserRole.ADMIN,
        firstName: userData.firstName,
        isDemoMode: true,
      },
    });
    await prisma.voterGroupMembership.upsert({
      where: { userId_voterGroupId: { userId: user.id, voterGroupId: clientsGroup.id } },
      update: {},
      create: { userId: user.id, voterGroupId: clientsGroup.id, joinedVia: 'ADMIN_ADD' },
    });
    clientUsers.push({ id: user.id, firstName: userData.firstName });
  }

  const totalUsers = leadershipUsers.length + productTeamUsers.length + teamMemberUsers.length + clientUsers.length;
  console.log(`Created ${totalUsers} demo users across 4 groups`);

  // ============================================================================
  // PROBLEMS — Import real 2gthr Sprint 1 problems from JSON
  // ============================================================================

  const problemsJsonPath = path.join(__dirname, 'seed-data', 'problems.json');
  const problemsData = JSON.parse(fs.readFileSync(problemsJsonPath, 'utf-8'));
  console.log(`\nImporting ${problemsData.length} real 2gthr problems from seed-data/problems.json...`);

  const problems: Array<{ id: string; title: string }> = [];
  for (const data of problemsData) {
    const problem = await prisma.problem.create({
      data: {
        tenantId: tenant.id,
        title: data.title,
        description: data.description,
        hypothesis: data.hypothesis || null,
        source: data.source as ProblemSource || ProblemSource.IMPORT,
        evidenceItems: data.evidenceItems || [],
        evidenceSummary: data.evidenceSummary || null,
        scores: data.scores || {},
        priorityScore: data.priorityScore || null,
        status: data.status as ProblemStatus || ProblemStatus.DISCOVERED,
        isShortlisted: data.isShortlisted || false,
        tags: data.tags || [],
      },
    });
    problems.push({ id: problem.id, title: problem.title });
  }
  console.log(`Created ${problems.length} problems`);

  // Shortlist top 3 (Evidence Deficit, Insight-Action Gap, Performance Feedback Gaps)
  for (let i = 0; i < Math.min(3, problems.length); i++) {
    await prisma.problem.update({
      where: { id: problems[i].id },
      data: { status: ProblemStatus.SHORTLISTED, isShortlisted: true, shortlistOrder: i },
    });
  }
  // Mark Evidence Deficit as SOLVED (solution built)
  if (problems.length > 0) {
    await prisma.problem.update({
      where: { id: problems[0].id },
      data: { status: ProblemStatus.SOLVED },
    });
  }
  console.log('Shortlisted top 3 problems, marked Evidence Deficit as SOLVED');

  // ============================================================================
  // SPRINT 1
  // ============================================================================

  const sprint1 = await prisma.sprint.create({
    data: {
      tenantId: tenant.id,
      name: 'Sprint 1 — Career Problem Discovery',
      description: 'Discover and prioritize career-focused problems for the 2gthr platform. 41 problems identified through structured research and stakeholder engagement. Evidence Deficit selected as the #1 priority and first solution built.',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2026-01-31'),
      status: 'COMPLETED',
    },
  });

  // Link all problems to Sprint 1
  for (const problem of problems) {
    await prisma.problem.update({
      where: { id: problem.id },
      data: { sprintId: sprint1.id },
    });
  }
  console.log(`Created Sprint 1 and linked ${problems.length} problems`);

  // ============================================================================
  // PROBLEM GROUPS
  // ============================================================================

  const sprint1Group = await prisma.problemGroup.create({
    data: {
      tenantId: tenant.id,
      name: 'Sprint 1 — Problem Discovery',
      description: 'All career-focused problems discovered during Sprint 1 research',
      color: '#6366f1',
      icon: 'target',
    },
  });

  // Link all problems to Sprint 1 group
  for (const problem of problems) {
    await prisma.problemGroupMembership.create({
      data: { problemId: problem.id, groupId: sprint1Group.id },
    });
  }

  // Sprint 2 Next Priority group — top 10 unsolved problems (exclude #0 Evidence Deficit)
  const sprint2Group = await prisma.problemGroup.create({
    data: {
      tenantId: tenant.id,
      name: 'Sprint 2 — Next Priority',
      description: 'Top-scoring unsolved problems for Sprint 2 implementation voting',
      color: '#f59e0b',
      icon: 'zap',
    },
  });

  for (let i = 1; i < Math.min(11, problems.length); i++) {
    await prisma.problemGroupMembership.create({
      data: { problemId: problems[i].id, groupId: sprint2Group.id },
    });
  }
  console.log('Created problem groups: Sprint 1, Sprint 2 Next Priority');

  // ============================================================================
  // VOTING SESSION 1 — CLOSED (Sprint 1 Priority Vote)
  // ============================================================================

  const session1 = await prisma.votingSession.create({
    data: {
      tenantId: tenant.id,
      sprintId: sprint1.id,
      title: 'Sprint 1 — Career Problem Priority Vote',
      description: 'Vote on which career problems to prioritize for the 2gthr platform. Each voter has been allocated credits based on their role. Evidence Deficit emerged as the clear winner.',
      status: 'CLOSED',
      sessionType: 'SPRINT_BASED',
      deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      defaultCredits: 30,
      config: {
        creditsByRole: {
          Leadership: 50,
          'Product Team': 30,
          'Team Members': 10,
          Clients: 50,
        },
      },
    },
  });

  // Link all problems to session 1
  await prisma.votingSessionProblem.createMany({
    data: problems.map((problem, index) => ({
      votingSessionId: session1.id,
      problemId: problem.id,
      displayOrder: index,
    })),
  });

  // Link voter groups to session 1
  await prisma.votingSessionGroup.createMany({
    data: [
      { votingSessionId: session1.id, voterGroupId: leadershipGroup.id, creditsOverride: 50 },
      { votingSessionId: session1.id, voterGroupId: productTeamGroup.id, creditsOverride: 30 },
      { votingSessionId: session1.id, voterGroupId: teamMembersGroup.id, creditsOverride: 10 },
      { votingSessionId: session1.id, voterGroupId: clientsGroup.id, creditsOverride: 50 },
    ],
  });

  console.log('Created Voting Session 1 (CLOSED) with all problems linked');

  // Cast votes — Leadership favours strategic, Product favours feasibility,
  // Team favours day-to-day pain, Clients favour user-facing value
  // Problem indices: 0=Evidence Deficit, 1=Insight-Action Gap, 2=Feedback Gaps,
  // 3=First 90-Days, 4=Burnout, 5=Offer Negotiation, 6=AI Fear, 7=Job App Feedback,
  // 8=Peter Principle, 9=Mid-Career Financial, 10=Skills-Industry Gap,
  // 13=Career Decision Paralysis, 14=Executive Isolation

  type VoteAlloc = { problemIdx: number; credits: number }[];

  // Leadership votes (50 credits each)
  const leadershipVotes: VoteAlloc[] = [
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 13, credits: 16 }, { problemIdx: 14, credits: 9 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 1, credits: 16 }, { problemIdx: 4, credits: 9 }, { problemIdx: 6, credits: 9 }],
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 2, credits: 16 }, { problemIdx: 8, credits: 9 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 14, credits: 25 }, { problemIdx: 13, credits: 9 }],
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 1, credits: 9 }, { problemIdx: 4, credits: 16 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 2, credits: 9 }, { problemIdx: 14, credits: 16 }, { problemIdx: 6, credits: 9 }],
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 13, credits: 16 }, { problemIdx: 3, credits: 9 }],
  ];

  // Product Team votes (30 credits each)
  const productVotes: VoteAlloc[] = [
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 1, credits: 9 }, { problemIdx: 2, credits: 4 }, { problemIdx: 7, credits: 1 }],
    [{ problemIdx: 0, credits: 9 }, { problemIdx: 1, credits: 16 }, { problemIdx: 2, credits: 4 }, { problemIdx: 3, credits: 1 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 2, credits: 9 }, { problemIdx: 7, credits: 4 }, { problemIdx: 10, credits: 1 }],
  ];

  // Team Member votes (10 credits each)
  const teamVotes: VoteAlloc[] = [
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 2, credits: 4 }, { problemIdx: 10, credits: 1 }, { problemIdx: 3, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 1, credits: 4 }, { problemIdx: 3, credits: 1 }, { problemIdx: 5, credits: 1 }],
    [{ problemIdx: 0, credits: 9 }, { problemIdx: 7, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 3, credits: 4 }, { problemIdx: 10, credits: 1 }, { problemIdx: 12, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 1, credits: 4 }, { problemIdx: 6, credits: 1 }, { problemIdx: 8, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 2, credits: 4 }, { problemIdx: 5, credits: 1 }, { problemIdx: 11, credits: 1 }],
    [{ problemIdx: 2, credits: 4 }, { problemIdx: 0, credits: 4 }, { problemIdx: 3, credits: 1 }, { problemIdx: 7, credits: 1 }],
    [{ problemIdx: 0, credits: 9 }, { problemIdx: 4, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 10, credits: 4 }, { problemIdx: 12, credits: 1 }, { problemIdx: 3, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 1, credits: 4 }, { problemIdx: 9, credits: 1 }, { problemIdx: 5, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 3, credits: 4 }, { problemIdx: 7, credits: 1 }, { problemIdx: 2, credits: 1 }],
    [{ problemIdx: 0, credits: 4 }, { problemIdx: 2, credits: 4 }, { problemIdx: 6, credits: 1 }, { problemIdx: 10, credits: 1 }],
  ];

  // Client votes (50 credits each)
  const clientVotes: VoteAlloc[] = [
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 1, credits: 16 }, { problemIdx: 7, credits: 9 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 7, credits: 16 }, { problemIdx: 1, credits: 9 }, { problemIdx: 3, credits: 9 }],
    [{ problemIdx: 0, credits: 25 }, { problemIdx: 2, credits: 16 }, { problemIdx: 10, credits: 9 }],
    [{ problemIdx: 0, credits: 16 }, { problemIdx: 1, credits: 25 }, { problemIdx: 3, credits: 9 }],
  ];

  // Helper to create votes for a group
  async function createVotesForGroup(
    users: UserRef[],
    groupId: string,
    allocations: VoteAlloc[],
  ) {
    for (let i = 0; i < users.length && i < allocations.length; i++) {
      const user = users[i];
      const allocs = allocations[i];

      // Create VoterSession
      await prisma.voterSession.create({
        data: {
          votingSessionId: session1.id,
          userId: user.id,
          creditsAllowed: allocs.reduce((sum, a) => sum + a.credits, 0),
          openedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000 + Math.random() * 3 * 24 * 60 * 60 * 1000),
        },
      });

      for (const alloc of allocs) {
        if (alloc.problemIdx < problems.length) {
          await prisma.vote.create({
            data: {
              votingSessionId: session1.id,
              problemId: problems[alloc.problemIdx].id,
              userId: user.id,
              voterGroupId: groupId,
              creditsAssigned: alloc.credits,
            },
          });
        }
      }
    }
  }

  await createVotesForGroup(leadershipUsers, leadershipGroup.id, leadershipVotes);
  await createVotesForGroup(productTeamUsers, productTeamGroup.id, productVotes);
  await createVotesForGroup(teamMemberUsers, teamMembersGroup.id, teamVotes);
  await createVotesForGroup(clientUsers, clientsGroup.id, clientVotes);

  console.log('Cast votes for all 26 voters across 4 groups');

  // ============================================================================
  // COMMENTS ON TOP 3 PROBLEMS
  // ============================================================================

  const allUsers = [...leadershipUsers, ...productTeamUsers, ...teamMemberUsers, ...clientUsers];
  const findUser = (name: string) => allUsers.find(u => u.firstName === name);

  const comments = [
    // Evidence Deficit (#0)
    { problemIdx: 0, userName: 'Steven', content: 'Core value proposition for our members. Non-creative professionals have no good way to showcase their real-world capabilities — this is the gap we were built to fill.' },
    { problemIdx: 0, userName: 'Daniel', content: 'AI tools can solve this in Sprint 1. The CV Builder and Evidence Portfolio features are technically feasible with current LLM capabilities. We should prototype immediately.' },
    { problemIdx: 0, userName: 'Werner', content: 'Members constantly ask about this. Every client meeting I have, the question of "how do I show what I can actually do?" comes up. Especially from accountants and lawyers.' },
    // Insight-Action Gap (#1)
    { problemIdx: 1, userName: 'Marcel', content: 'Important but harder to measure impact. How do we know if users are actually converting insights into actions versus just consuming content?' },
    { problemIdx: 1, userName: 'Jacques', content: 'The Go-Card micro-action format directly addresses this. Each card is a single actionable step — no more "great advice, now what?" moments.' },
    // Performance Feedback Gaps (#2)
    { problemIdx: 2, userName: 'Meagan', content: 'Mid-career professionals are our sweet spot demographic. They have the most to gain from structured feedback and the purchasing power to pay for premium features.' },
    { problemIdx: 2, userName: 'Ray', content: 'We could build NPS-style feedback loops within Paths. After each Milestone, prompt for reflection and peer feedback. Data goldmine for the analytics layer.' },
  ];

  for (const c of comments) {
    const user = findUser(c.userName);
    if (user && c.problemIdx < problems.length) {
      await prisma.problemComment.create({
        data: {
          problemId: problems[c.problemIdx].id,
          userId: user.id,
          content: c.content,
        },
      });
    }
  }
  console.log(`Created ${comments.length} problem comments`);

  // ============================================================================
  // PROBLEM FAVOURITES
  // ============================================================================

  const favourites = [
    // Leadership favourites top strategic problems
    { problemIdx: 0, userName: 'Steven' },
    { problemIdx: 0, userName: 'Marcel' },
    { problemIdx: 0, userName: 'Dee' },
    { problemIdx: 13, userName: 'Steven' },
    { problemIdx: 14, userName: 'Dee' },
    { problemIdx: 14, userName: 'Sonja' },
    // Product favourites problems they plan to solve
    { problemIdx: 0, userName: 'Daniel' },
    { problemIdx: 1, userName: 'Jacques' },
    { problemIdx: 2, userName: 'Ray' },
    { problemIdx: 0, userName: 'Jacques' },
    // Clients favourite user-facing problems
    { problemIdx: 0, userName: 'Werner' },
    { problemIdx: 0, userName: 'Chantelle' },
    { problemIdx: 7, userName: 'Isak' },
    { problemIdx: 1, userName: 'Lewy' },
  ];

  for (const fav of favourites) {
    const user = findUser(fav.userName);
    if (user && fav.problemIdx < problems.length) {
      await prisma.problemFavourite.create({
        data: {
          problemId: problems[fav.problemIdx].id,
          userId: user.id,
        },
      });
    }
  }
  console.log(`Created ${favourites.length} problem favourites`);

  // ============================================================================
  // VOTING SESSION 2 — ACTIVE (Sprint 2 Next Priority)
  // ============================================================================

  const session2 = await prisma.votingSession.create({
    data: {
      tenantId: tenant.id,
      title: 'Sprint 2 — Next Solution Priority',
      description: 'Vote on which problem to solve next. Evidence Deficit has been built — now decide the second priority for the 2gthr platform.',
      status: 'ACTIVE',
      sessionType: 'THEMATIC',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      defaultCredits: 30,
      config: {
        creditsByRole: {
          Leadership: 50,
          'Product Team': 30,
          'Team Members': 10,
          Clients: 50,
        },
      },
    },
  });

  // Link top 10 unsolved problems (indices 1-10) to session 2
  const session2Problems = problems.slice(1, Math.min(11, problems.length));
  await prisma.votingSessionProblem.createMany({
    data: session2Problems.map((problem, index) => ({
      votingSessionId: session2.id,
      problemId: problem.id,
      displayOrder: index,
    })),
  });

  // Link voter groups to session 2
  await prisma.votingSessionGroup.createMany({
    data: [
      { votingSessionId: session2.id, voterGroupId: leadershipGroup.id, creditsOverride: 50 },
      { votingSessionId: session2.id, voterGroupId: productTeamGroup.id, creditsOverride: 30 },
      { votingSessionId: session2.id, voterGroupId: teamMembersGroup.id, creditsOverride: 10 },
      { votingSessionId: session2.id, voterGroupId: clientsGroup.id, creditsOverride: 50 },
    ],
  });
  console.log('Created Voting Session 2 (ACTIVE) with top 10 unsolved problems');

  // ============================================================================
  // SOLUTION — Evidence Builder (Evidence Deficit)
  // ============================================================================

  if (problems.length > 0) {
    await prisma.solution.create({
      data: {
        tenantId: tenant.id,
        problemId: problems[0].id,
        title: 'Evidence Builder — AI-Powered Portfolio Construction',
        description: 'The "Land Your Next Job" Path — 2gthr\'s first production feature built from Sprint 1\'s #1 problem. A structured 6-milestone journey with 29 Go-Cards and 6 AI-powered tools that help non-creative professionals build tangible evidence portfolios.\n\nMilestones:\n1. Self-Discovery — Identify your unique value proposition\n2. Evidence Audit — Map existing proof of capabilities\n3. Gap Analysis — Find missing evidence for target roles\n4. Evidence Creation — Build new proof using AI tools (CV Builder, Cover Letter Generator, Portfolio Compiler, Achievement Quantifier, Skills Translator, Interview Prep)\n5. Portfolio Assembly — Compile and structure your evidence\n6. Launch Strategy — Deploy your evidence portfolio for job applications',
        status: 'LIVE',
        mockups: [
          { type: 'path_structure', name: 'Land Your Next Job', milestones: 6, goCards: 29, aiTools: 6 },
          { type: 'ai_tools', tools: ['CV Builder', 'Cover Letter Generator', 'Portfolio Compiler', 'Achievement Quantifier', 'Skills Translator', 'Interview Prep'] },
          { type: 'gocard_types', types: ['reflection', 'action', 'ai-assisted', 'peer-review', 'evidence-upload'] },
        ],
        assumptions: {
          validated: [
            { assumption: 'Members will engage with structured portfolio building', status: 'validated', evidence: '78% of beta users completed at least 2 milestones' },
          ],
          partiallyValidated: [
            { assumption: 'AI tools reduce evidence creation time by 80%', status: 'partially_validated', evidence: 'CV Builder achieves 70% time reduction; other tools still being measured' },
          ],
          testing: [
            { assumption: 'Users complete at least 3 milestones in first month', status: 'testing', evidence: 'Current average is 2.4 milestones at Week 3 — trending to meet target' },
            { assumption: 'Evidence portfolios improve interview callback rate by 40%', status: 'testing', evidence: 'Too early to measure — first cohort still in job search phase' },
          ],
        },
      },
    });
    console.log('Created Solution: Evidence Builder — AI-Powered Portfolio Construction');
  }

  // ============================================================================
  // TARGET AUDIENCES (DB records)
  // ============================================================================

  await prisma.targetAudience.create({
    data: {
      tenantId: tenant.id,
      name: 'Core Member Base',
      type: 'EXISTING',
      segments: [
        { name: 'Doctors', size: 45000, ageProfile: '55-65 predominant', body: 'HPCSA', description: 'Medical practitioners — high income, moderate digital adoption, strong CPD requirements' },
        { name: 'Lawyers', size: 28000, ageProfile: '50-65 predominant', body: 'LPC', description: 'Legal practitioners — high income, conservative digital adoption, mandatory CPD' },
        { name: 'Accountants', size: 47000, ageProfile: '45-65 predominant', body: 'SAICA/SAIPA', description: 'Chartered and professional accountants — high income, better digital adoption than medical/legal' },
        { name: 'Other Professionals', size: 30000, ageProfile: '45-65', body: 'Various', description: 'Engineers, actuaries, architects — mixed digital adoption' },
      ],
      targets: {
        totalSize: 150000,
        conversionTarget: 60000,
        conversionRate: 40,
        demographics: { gender: '60% male, 40% female', topLocations: ['Gauteng 45%', 'Western Cape 25%', 'KZN 15%'] },
        digitalBehaviour: 'Moderate — email-first, some mobile, LinkedIn active',
        income: 'R80K-R200K+/month',
      },
    },
  });

  await prisma.targetAudience.create({
    data: {
      tenantId: tenant.id,
      name: 'New Acquisition Target',
      type: 'TARGET',
      segments: [
        { name: 'Young Doctors', size: 8000, ageProfile: '25-40', description: 'Registrars and recently qualified — high digital savviness, career-building phase' },
        { name: 'Young Lawyers', size: 6000, ageProfile: '25-40', description: 'Candidate attorneys and junior associates — ambitious, networking-focused' },
        { name: 'Young Accountants', size: 10000, ageProfile: '25-40', description: 'Trainee and recently qualified CAs — SAICA pipeline, strong career ambition' },
        { name: 'Tech Professionals', size: 8000, ageProfile: '25-45', description: 'Software engineers, data scientists, product managers — high digital literacy, portfolio-oriented' },
        { name: 'Financial Advisors & Consultants', size: 8000, ageProfile: '28-45', description: 'IFAs, management consultants — client-facing, evidence of expertise is critical' },
      ],
      targets: {
        totalTarget: 40000,
        acquisitionChannels: ['Digital marketing', 'Member referrals', 'Professional body partnerships', 'University pipeline'],
        demographics: { gender: '52% female, 48% male', topLocations: ['Gauteng 50%', 'Western Cape 30%', 'KZN 10%'] },
        digitalBehaviour: 'Mobile-first, high digital savviness',
        income: 'R25K-R80K/month, growth trajectory',
      },
    },
  });

  await prisma.targetAudience.create({
    data: {
      tenantId: tenant.id,
      name: 'SA Professional Services TAM',
      type: 'MARKET',
      segments: [
        { name: 'HPCSA Registered Doctors', size: 45000, source: 'HPCSA Register 2025' },
        { name: 'LPC Registered Lawyers', size: 28000, source: 'Legal Practice Council 2025' },
        { name: 'SAICA Chartered Accountants', size: 47000, source: 'SAICA Member Database 2025' },
        { name: 'SAIPA Professional Accountants', size: 35000, source: 'SAIPA Register 2025' },
        { name: 'ECSA Registered Engineers', size: 18000, source: 'ECSA Register 2025' },
        { name: 'ASSA Actuaries', size: 3500, source: 'ASSA Member Database 2025' },
      ],
      targets: {
        totalTAM: 176500,
        ageDistribution: { '25-34': '15%', '35-44': '25%', '45-54': '25%', '55-64': '20%', '65+': '15%' },
        addressableMarket: 'Professionals aged 25-54 with smartphone access — approximately 115,000',
      },
    },
  });
  console.log('Created 3 TargetAudience records (Existing, Target, Market)');

  // ============================================================================
  // MARKET INTELLIGENCE
  // ============================================================================

  const marketData = [
    { category: 'INDUSTRY' as const, title: 'HPCSA Registered Medical Practitioners', value: '~45,000', source: 'HPCSA Annual Report 2025', notes: 'Includes GPs, specialists, and registrars. ~35% are 55+ age bracket. CPD requirement: 25 CEU points per year.' },
    { category: 'INDUSTRY' as const, title: 'LPC Registered Legal Practitioners', value: '~28,000', source: 'Legal Practice Council 2025', notes: 'Attorneys and advocates. Mandatory CPD requirements vary by specialisation. High concentration in Gauteng (55%).' },
    { category: 'INDUSTRY' as const, title: 'SAICA Chartered Accountants', value: '~47,000', source: 'SAICA Member Database 2025', notes: 'CA(SA) designation. Stringent CPD: 120 hours over 3-year rolling period. Highest digital adoption among professional bodies.' },
    { category: 'INDUSTRY' as const, title: 'SAIPA Professional Accountants', value: '~35,000', source: 'SAIPA Register 2025', notes: 'Professional Accountant(SA) designation. Growing segment — younger demographic than SAICA on average.' },
    { category: 'DEMOGRAPHIC' as const, title: 'Professional Services Age Distribution', value: 'See breakdown', source: 'Stats SA / Professional Body Registers', notes: '25-34: 15%, 35-44: 25%, 45-54: 25%, 55-64: 20%, 65+: 15%. Core member base skews older.', metadata: { '25-34': 15, '35-44': 25, '45-54': 25, '55-64': 20, '65+': 15 } },
    { category: 'DEMOGRAPHIC' as const, title: 'Digital Adoption by Age Group (SA Professionals)', value: '25-45: 89% | 55-65: 52%', source: 'Accenture Digital Index SA 2025', notes: 'Under-45 professionals are mobile-first with 89% daily smartphone usage for work. 55-65 bracket shows 52% adoption — email is primary, apps are secondary.' },
    { category: 'DEMOGRAPHIC' as const, title: 'Geographic Distribution of Professionals', value: 'Gauteng 45%', source: 'Professional Body Registers', notes: 'Gauteng: 45%, Western Cape: 25%, KZN: 15%, Other: 15%. Urban concentration above 85% across all professions.' },
    { category: 'BENCHMARK' as const, title: 'CPD Spending per Professional (Annual)', value: 'R8,000-R25,000', source: 'SAICA/HPCSA Fee Schedules', notes: 'Doctors: R15-25K/year, Lawyers: R8-15K/year, Accountants: R10-20K/year. Most spending goes to conferences and short courses — 2gthr can capture a portion of this spend.' },
    { category: 'BENCHMARK' as const, title: 'Professional Development App D7 Retention', value: '23%', source: 'AppsFlyer SA Report 2025', notes: 'Industry benchmark for professional/productivity apps. Top performers achieve 35%+. Key driver is structured content (paths, milestones) vs passive content.' },
    { category: 'BENCHMARK' as const, title: 'Customer Acquisition Cost (Professional Segment)', value: 'R180-R350', source: 'Meta/Google Ads Benchmarks SA', notes: 'Professional audience CAC is 2-3x general consumer. Member referral brings this down to R65. Professional body partnerships could reduce to R40.' },
    { category: 'BENCHMARK' as const, title: 'ARPU for Professional Development Platforms', value: 'R150-R300/month', source: 'Competitive Analysis', notes: 'Premium professional development platforms charge R150-300/month. Freemium conversion rates: 5-8% for professional audiences (higher than consumer).' },
    { category: 'ECONOMIC' as const, title: 'SA Professional Services Market Size', value: 'R3.2B annual CPD spend', source: 'Deloitte SA Professional Services Report', notes: 'Total CPD and professional development spending across doctors, lawyers, accountants. Growing at 8% YoY driven by digital transformation.' },
    { category: 'ECONOMIC' as const, title: 'Unemployment Rate (SA Graduates)', value: '15.5%', source: 'Stats SA Q4 2025', notes: 'Graduate unemployment significantly lower than national 32.1%. However, underemployment (working below qualification) is estimated at 25-30% for recent graduates.' },
  ];

  for (const item of marketData) {
    await prisma.marketIntelligence.create({
      data: {
        tenantId: tenant.id,
        category: item.category,
        title: item.title,
        value: item.value,
        source: item.source,
        notes: item.notes,
        metadata: (item as any).metadata || {},
      },
    });
  }
  console.log(`Created ${marketData.length} MarketIntelligence records`);

  // ============================================================================
  // COMPETITORS
  // ============================================================================

  const competitors = [
    {
      name: 'GetSmarter',
      website: 'https://www.getsmarter.com',
      description: 'Online short courses from leading universities (UCT, Stellenbosch, MIT). Strong SA brand. Focus on upskilling through structured 6-12 week programmes.',
      strengths: ['Strong university brand partnerships', 'SA-specific content', 'Employer-funded pipeline', 'Professional certificates'],
      weaknesses: ['No portfolio building', 'Expensive (R5K-R25K per course)', 'Content consumption only — no evidence creation', 'No AI personalisation'],
      pricing: { range: 'R5,000 - R25,000 per course', model: 'Per-course payment', notes: 'Often employer-funded' },
      solutions: ['Upskilling via short courses', 'Career-relevant certificates', 'University-branded credentials'],
    },
    {
      name: 'LinkedIn Learning',
      website: 'https://www.linkedin.com/learning',
      description: 'Global professional development content library. Massive content catalogue but generic — not SA-specific and no evidence construction.',
      strengths: ['Massive content library (16,000+ courses)', 'LinkedIn profile integration', 'Low cost', 'Employer bulk licensing'],
      weaknesses: ['Not SA-specific', 'No evidence/portfolio construction', 'Passive consumption', 'No structured career paths', 'Generic rather than profession-specific'],
      pricing: { range: 'R300/month', model: 'Subscription', notes: 'Often bundled with LinkedIn Premium' },
      solutions: ['Video-based learning', 'Skills badges on LinkedIn profile', 'Course completion certificates'],
    },
    {
      name: 'Coursera for Business',
      website: 'https://www.coursera.org/business',
      description: 'Global online learning platform with university and industry partnerships. Broad content, strong credentials, but no professional member integration or SA-specific focus.',
      strengths: ['University partnerships (Stanford, Google, IBM)', 'Professional certificates', 'Recognised credentials', 'Broad content'],
      weaknesses: ['Not SA-specific', 'No member organization integration', 'No evidence building tools', 'Generic career advice', 'Expensive for enterprise'],
      pricing: { range: 'R200-R500/user/month (enterprise)', model: 'Subscription/enterprise', notes: 'Individual certificates R500-R5000' },
      solutions: ['Online degrees', 'Professional certificates', 'Guided projects'],
    },
    {
      name: 'Traditional Career Coaching',
      website: null,
      description: 'In-person and virtual 1:1 career coaching — personalised but expensive and does not scale. Popular among SA executives and transitioning professionals.',
      strengths: ['Highly personalised', 'Accountability', 'Network access (coach connections)', 'Deep individual understanding'],
      weaknesses: ['Expensive (R500-R2000/session)', 'Does not scale', 'Quality varies enormously', 'No AI tools', 'No structured evidence building', 'No data or analytics'],
      pricing: { range: 'R500-R2,000 per session', model: 'Per-session or retainer', notes: 'Executive coaching can exceed R5,000/session' },
      solutions: ['1:1 career strategy', 'Interview preparation', 'CV review', 'Networking facilitation'],
    },
  ];

  for (const comp of competitors) {
    await prisma.competitor.create({
      data: {
        tenantId: tenant.id,
        name: comp.name,
        website: comp.website,
        description: comp.description,
        strengths: comp.strengths,
        weaknesses: comp.weaknesses,
        pricing: comp.pricing,
        solutions: comp.solutions,
      },
    });
  }
  console.log(`Created ${competitors.length} Competitor records`);

  // ============================================================================
  // DONE
  // ============================================================================

  console.log('\n========================================');
  console.log('Seed completed successfully!');
  console.log('========================================');
  console.log('\nLogin credentials:');
  console.log('  FDE: fde@nova.ai / password123');
  console.log('  Admin: admin@demo.com / password123');
  console.log('  Demo users: [name]@novademo.com / demo123');
  console.log(`\nData seeded:`);
  console.log(`  ${problems.length} career problems (Sprint 1)`);
  console.log(`  2 voting sessions (1 closed with votes, 1 active)`);
  console.log(`  1 solution (Evidence Builder — LIVE)`);
  console.log(`  3 audience segments + ${marketData.length} market intelligence records`);
  console.log(`  ${competitors.length} competitors`);
  console.log(`  ${totalUsers} demo users across 4 voter groups`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
