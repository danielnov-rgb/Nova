import { PrismaClient, ProblemSource, ProblemStatus, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Create Prisma client with adapter (Prisma 7 requirement)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nova',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'demo.nova.ai' },
    update: {},
    create: {
      name: 'Demo Company',
      domain: 'demo.nova.ai',
      settings: {
        votingCredits: {
          CEO: 50,
          PRODUCT_LEAD: 30,
          TEAM_MEMBER: 10,
        },
      },
    },
  });

  console.log(`Created tenant: ${tenant.name} (${tenant.id})`);

  // Create FDE user
  const passwordHash = await bcrypt.hash('password123', 10);
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

  // Create admin user
  const adminUser = await prisma.user.upsert({
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

  console.log(`Created admin user: ${adminUser.email}`);

  // Sample problems - realistic B2B SaaS issues discovered through research
  const problemsData = [
    {
      title: 'Users struggle to find relevant reports',
      description:
        'During user interviews, 73% of respondents mentioned difficulty navigating the reporting dashboard. Average time to find a specific report is 4.2 minutes, compared to industry standard of under 1 minute.',
      evidence: {
        sources: ['user_interviews', 'analytics'],
        interviewCount: 47,
        severity: 'high',
        quotes: [
          "I waste 30 minutes a day just hunting for the reports I need",
          "The search function never finds what I'm looking for",
        ],
      },
      scores: { severity: 8, willingness_to_pay: 7, retention_impact: 8, feasibility: 6 },
      tags: ['ux', 'navigation', 'search', 'reports'],
    },
    {
      title: 'Onboarding takes too long for new team members',
      description:
        'New users require an average of 3 weeks to become productive. 45% of trial users churn before completing onboarding. Competitor analysis shows best-in-class solutions achieve productivity in 3 days.',
      evidence: {
        sources: ['analytics', 'support_tickets', 'competitor_analysis'],
        avgOnboardingDays: 21,
        trialChurnRate: 0.45,
        quotes: [
          "My team gave up after a week of trying to figure it out",
          "Too many features, not enough guidance",
        ],
      },
      scores: { severity: 9, willingness_to_pay: 8, retention_impact: 9, feasibility: 5 },
      tags: ['onboarding', 'activation', 'churn'],
    },
    {
      title: 'Lack of real-time collaboration features',
      description:
        'Teams working on shared projects report frustration with manual sync processes. 62% of enterprise prospects cite real-time collaboration as a key purchase criterion.',
      evidence: {
        sources: ['sales_calls', 'competitor_analysis'],
        lostDeals: 12,
        dealValueLost: 340000,
        quotes: [
          "We went with [Competitor] because they let multiple people work at once",
          "Our team is distributed, we need live updates",
        ],
      },
      scores: { severity: 7, willingness_to_pay: 9, retention_impact: 6, feasibility: 4 },
      tags: ['collaboration', 'real-time', 'enterprise'],
    },
    {
      title: 'Integration with existing tools is painful',
      description:
        'Users report spending 8+ hours setting up integrations with tools like Salesforce, HubSpot, and Slack. 35% of support tickets are integration-related.',
      evidence: {
        sources: ['support_tickets', 'user_interviews'],
        avgSetupTime: 8.5,
        supportTicketPercentage: 0.35,
        requestedIntegrations: ['Salesforce', 'HubSpot', 'Slack', 'Jira', 'Notion'],
      },
      scores: { severity: 7, willingness_to_pay: 6, retention_impact: 7, feasibility: 6 },
      tags: ['integrations', 'api', 'setup'],
    },
    {
      title: 'Mobile experience is severely limited',
      description:
        "Mobile usage has grown 200% YoY but app functionality is limited to viewing only. Users can't take key actions on mobile, forcing them back to desktop.",
      evidence: {
        sources: ['analytics', 'app_store_reviews'],
        mobileUsersPercent: 0.42,
        appStoreRating: 2.8,
        quotes: [
          "The app is basically useless - I can only look at things",
          "Please let me approve requests from my phone",
        ],
      },
      scores: { severity: 6, willingness_to_pay: 5, retention_impact: 5, feasibility: 7 },
      tags: ['mobile', 'app', 'feature-parity'],
    },
    {
      title: 'Pricing structure confuses customers',
      description:
        'Sales cycle is 40% longer than competitors due to pricing negotiations. 28% of prospects request custom quotes because they cannot understand the pricing page.',
      evidence: {
        sources: ['sales_data', 'user_interviews'],
        avgSalesCycleDays: 67,
        customQuoteRequests: 0.28,
        quotes: [
          "I honestly have no idea what it will cost us at scale",
          "Why are there 7 different add-ons?",
        ],
      },
      scores: { severity: 5, willingness_to_pay: 3, retention_impact: 4, feasibility: 8 },
      tags: ['pricing', 'sales', 'transparency'],
    },
    {
      title: 'Export functionality is too limited',
      description:
        'Users need to export data in formats we do not support (Excel with formatting, PDF reports). Current CSV-only export results in hours of manual reformatting.',
      evidence: {
        sources: ['support_tickets', 'user_interviews'],
        weeklyExportRequests: 340,
        requestedFormats: ['xlsx', 'pdf', 'custom templates'],
        quotes: [
          "I export CSV then spend an hour making it presentable",
          "My boss only accepts PDF reports",
        ],
      },
      scores: { severity: 5, willingness_to_pay: 6, retention_impact: 4, feasibility: 8 },
      tags: ['export', 'reporting', 'formats'],
    },
    {
      title: 'Permissions system is too rigid',
      description:
        'Enterprise clients need granular permissions but our current system only offers 3 roles. 67% of enterprise deals require custom permission work.',
      evidence: {
        sources: ['sales_calls', 'support_tickets'],
        enterpriseDealsAffected: 0.67,
        avgCustomWorkHours: 24,
        requestedPermissions: ['view-only', 'department-level', 'project-specific', 'time-limited'],
      },
      scores: { severity: 7, willingness_to_pay: 8, retention_impact: 6, feasibility: 5 },
      tags: ['permissions', 'rbac', 'enterprise', 'security'],
    },
    {
      title: 'No audit trail for compliance',
      description:
        'Regulated industries (finance, healthcare) cannot adopt product due to missing audit logs. Represents $2M+ in annual lost revenue.',
      evidence: {
        sources: ['sales_calls', 'legal_review'],
        lostRevenueAnnual: 2100000,
        industriesAffected: ['finance', 'healthcare', 'government'],
        complianceFrameworks: ['SOC2', 'HIPAA', 'FedRAMP'],
      },
      scores: { severity: 8, willingness_to_pay: 9, retention_impact: 7, feasibility: 6 },
      tags: ['compliance', 'audit', 'enterprise', 'security'],
    },
    {
      title: 'Notifications are overwhelming and not actionable',
      description:
        'Users receive average of 47 notifications per day. 89% of users have disabled notifications entirely, causing them to miss critical updates.',
      evidence: {
        sources: ['analytics', 'user_interviews'],
        avgDailyNotifications: 47,
        disabledNotificationPercent: 0.89,
        quotes: [
          "I turned them all off because it was constant noise",
          "I missed an important deadline because I didn't see the alert",
        ],
      },
      scores: { severity: 6, willingness_to_pay: 4, retention_impact: 6, feasibility: 7 },
      tags: ['notifications', 'ux', 'attention'],
    },
    {
      title: 'Bulk operations are missing or slow',
      description:
        'Power users managing 100+ items must update them one-by-one. Simple batch updates that should take minutes require hours of manual work.',
      evidence: {
        sources: ['user_interviews', 'support_tickets'],
        avgItemsPerUser: 156,
        timePerItemUpdate: 45, // seconds
        quotes: [
          "I spent my entire Friday updating 200 entries",
          "Any way to do this in bulk? Please?",
        ],
      },
      scores: { severity: 6, willingness_to_pay: 6, retention_impact: 5, feasibility: 7 },
      tags: ['bulk-operations', 'power-users', 'efficiency'],
    },
    {
      title: 'Search does not understand natural language',
      description:
        'Users must know exact field names and syntax to search effectively. Failed searches lead to support tickets and user frustration.',
      evidence: {
        sources: ['analytics', 'support_tickets'],
        failedSearchRate: 0.34,
        searchSupportTicketsWeekly: 89,
        examples: [
          '"last month sales" returns nothing',
          'Users try "John" when they need "user:john"',
        ],
      },
      scores: { severity: 5, willingness_to_pay: 5, retention_impact: 4, feasibility: 5 },
      tags: ['search', 'nlp', 'ux'],
    },
  ];

  // Create problems
  const problems = [];
  for (const data of problemsData) {
    const problem = await prisma.problem.create({
      data: {
        tenantId: tenant.id,
        title: data.title,
        description: data.description,
        source: ProblemSource.RESEARCH,
        evidenceItems: [data.evidence], // Schema uses evidenceItems (array) instead of evidence
        scores: data.scores,
        tags: data.tags,
        status: ProblemStatus.DISCOVERED,
      },
    });
    problems.push(problem);
    console.log(`Created problem: ${problem.title}`);
  }

  // Create a sample voting session
  const votingSession = await prisma.votingSession.create({
    data: {
      tenantId: tenant.id,
      title: 'Q1 2026 Priority Vote',
      description:
        'Vote on which problems to prioritize for Q1 development. Each voter has been allocated credits based on their role.',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      config: {
        creditsByRole: {
          CEO: 50,
          PRODUCT_LEAD: 30,
          TEAM_MEMBER: 10,
        },
      },
    },
  });

  console.log(`Created voting session: ${votingSession.title}`);

  // Link problems to voting session
  await prisma.votingSessionProblem.createMany({
    data: problems.map((problem, index) => ({
      votingSessionId: votingSession.id,
      problemId: problem.id,
      displayOrder: index,
    })),
  });

  console.log(`Linked ${problems.length} problems to voting session`);

  // Create sample voting links
  const votingLinks = [
    { email: 'ceo@demo.com', creditsAllowed: 50 },
    { email: 'product@demo.com', creditsAllowed: 30 },
    { email: 'engineer1@demo.com', creditsAllowed: 10 },
    { email: 'engineer2@demo.com', creditsAllowed: 10 },
    { email: 'designer@demo.com', creditsAllowed: 10 },
  ];

  for (const link of votingLinks) {
    const created = await prisma.votingLink.create({
      data: {
        votingSessionId: votingSession.id,
        email: link.email,
        creditsAllowed: link.creditsAllowed,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      },
    });
    console.log(`Created voting link for ${link.email}: /vote/${created.token}`);
  }

  console.log('\n========================================');
  console.log('Seed completed successfully!');
  console.log('========================================');
  console.log('\nLogin credentials:');
  console.log('  FDE: fde@nova.ai / password123');
  console.log('  Admin: admin@demo.com / password123');
  console.log(`\nTenant ID: ${tenant.id}`);
  console.log(`Voting Session ID: ${votingSession.id}`);
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
