/**
 * Sample Problems Data for Nova Demo
 *
 * This file contains example problems with the full enhanced schema including:
 * - All 11 scoring attributes with justifications
 * - Structured evidence items
 * - Group membership
 * - Various statuses
 *
 * Context: 2gthr life partner app for South African market
 * Focus areas: Career, Wellbeing, Finance
 *
 * Use this as a template for your simulator output.
 */

import {
  EnhancedProblem,
  ProblemGroup,
  WeightingProfile,
  DEFAULT_WEIGHTS,
  calculatePriorityScore,
} from '../../_lib/types/problem';

// ============================================================================
// PROBLEM GROUPS
// ============================================================================

export const sampleGroups: ProblemGroup[] = [
  {
    id: 'grp-career',
    tenantId: 'demo-tenant',
    name: 'Career Aspiration',
    description: 'Problems related to career growth, job searching, and professional development',
    color: '#3B82F6', // blue
    icon: 'briefcase',
    problemCount: 8,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'grp-wellbeing',
    tenantId: 'demo-tenant',
    name: 'Wellbeing & Health',
    description: 'Mental health, physical wellness, and lifestyle balance problems',
    color: '#10B981', // green
    icon: 'heart',
    problemCount: 6,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'grp-finance',
    tenantId: 'demo-tenant',
    name: 'Financial Planning',
    description: 'Budgeting, saving, investing, and financial literacy challenges',
    color: '#F59E0B', // amber
    icon: 'currency',
    problemCount: 5,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'grp-v1',
    tenantId: 'demo-tenant',
    name: 'V1 Launch Candidates',
    description: 'Problems prioritized for the initial product launch',
    color: '#8B5CF6', // purple
    icon: 'rocket',
    problemCount: 10,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'grp-network',
    tenantId: 'demo-tenant',
    name: 'Network Effects',
    description: 'Problems that could drive viral growth and community building',
    color: '#EC4899', // pink
    icon: 'users',
    problemCount: 4,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
];

// ============================================================================
// WEIGHTING PROFILES
// ============================================================================

export const sampleWeightingProfiles: WeightingProfile[] = [
  {
    id: 'wp-default',
    tenantId: 'demo-tenant',
    name: 'Balanced',
    description: 'Default balanced weighting across all attributes',
    isDefault: true,
    weights: DEFAULT_WEIGHTS,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'wp-revenue',
    tenantId: 'demo-tenant',
    name: 'Revenue Focus',
    description: 'Prioritizes problems with high willingness to pay and retention impact',
    isDefault: false,
    weights: {
      applicability: 10,
      severity: 15,
      frequency: 5,
      willingnessToPay: 25,
      retentionImpact: 20,
      acquisitionPotential: 10,
      viralCoefficient: 5,
      strategicFit: 5,
      feasibility: 3,
      timeToValue: 2,
      riskLevel: 0,
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'wp-growth',
    tenantId: 'demo-tenant',
    name: 'Growth Focus',
    description: 'Prioritizes acquisition and viral potential',
    isDefault: false,
    weights: {
      applicability: 15,
      severity: 10,
      frequency: 5,
      willingnessToPay: 10,
      retentionImpact: 10,
      acquisitionPotential: 20,
      viralCoefficient: 15,
      strategicFit: 10,
      feasibility: 3,
      timeToValue: 2,
      riskLevel: 0,
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'wp-quickwin',
    tenantId: 'demo-tenant',
    name: 'Quick Wins',
    description: 'Prioritizes high feasibility and fast time to value',
    isDefault: false,
    weights: {
      applicability: 10,
      severity: 15,
      frequency: 10,
      willingnessToPay: 10,
      retentionImpact: 5,
      acquisitionPotential: 5,
      viralCoefficient: 5,
      strategicFit: 5,
      feasibility: 20,
      timeToValue: 10,
      riskLevel: 5,
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
];

// ============================================================================
// SAMPLE PROBLEMS
// ============================================================================

export const sampleProblems: EnhancedProblem[] = [
  // === CAREER PROBLEMS ===
  {
    id: 'prob-001',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-career',
    title: 'Job search overwhelm and anxiety',
    description: 'Users feel overwhelmed by the job search process, spending hours scrolling job boards without a clear strategy. They report significant anxiety about making the wrong career moves and uncertainty about which opportunities to pursue.',
    hypothesis: 'We believe that providing structured job search guidance with personalized recommendations will reduce anxiety and help users focus on the right opportunities.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-001-1',
        type: 'INTERVIEW_QUOTE',
        content: "I spend hours every evening scrolling through job listings. By the end, I'm exhausted and haven't actually applied to anything. It feels like looking for a needle in a haystack.",
        source: 'User Interview #23',
        reportedBy: 'Thabo M.',
        reportedAt: '2026-01-15T14:30:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.9,
      },
      {
        id: 'ev-001-2',
        type: 'SURVEY_RESPONSE',
        content: '78% of respondents rated job searching as "very stressful" or "extremely stressful"',
        source: 'User Survey Q4 2025',
        reportedAt: '2025-12-01T00:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.85,
      },
      {
        id: 'ev-001-3',
        type: 'ANALYTICS_DATA',
        content: 'Average session time on career section: 45 mins. Completion rate for job applications: 12%',
        source: 'Product Analytics',
        reportedAt: '2026-01-28T00:00:00Z',
        sentiment: 'NEUTRAL',
        weight: 0.7,
      },
    ],
    evidenceSummary: 'Strong evidence across interviews and surveys showing job search overwhelm affects 78% of users, with low application completion rates (12%) despite high engagement time.',
    scores: {
      applicability: { value: 78, justification: 'Affects 78% of early-career users based on survey data', source: 'HUMAN' },
      severity: { value: 85, justification: 'Users report significant stress and anxiety impacting daily life', source: 'HUMAN' },
      frequency: { value: 72, justification: 'Occurs weekly during active job search periods', source: 'HUMAN' },
      willingnessToPay: { value: 65, justification: 'Moderate WTP - users compare to career coaching costs', source: 'HUMAN' },
      retentionImpact: { value: 80, justification: 'Solving this keeps users engaged through career transitions', source: 'HUMAN' },
      acquisitionPotential: { value: 55, justification: 'Career tools attract new users but not primary driver', source: 'AI', aiSuggested: 55, confidence: 0.7 },
      viralCoefficient: { value: 45, justification: 'Some sharing potential with successful job seekers', source: 'AI', aiSuggested: 45, confidence: 0.6 },
      strategicFit: { value: 90, justification: 'Core to 2gthr mission of life planning', source: 'HUMAN' },
      feasibility: { value: 75, justification: 'Requires job board integrations but technically achievable', source: 'HUMAN' },
      timeToValue: { value: 60, justification: 'Medium complexity - needs ML for recommendations', source: 'HUMAN' },
      riskLevel: { value: 70, justification: 'Moderate risk - depends on data quality', source: 'HUMAN' },
    },
    status: 'SHORTLISTED',
    isShortlisted: true,
    shortlistOrder: 1,
    tags: ['career', 'anxiety', 'job-search', 'high-priority'],
    groupIds: ['grp-career', 'grp-v1'],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
    lastScoredAt: '2026-02-08T16:00:00Z',
    lastScoredBy: 'user-daniel',
  },
  {
    id: 'prob-002',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-career',
    title: 'Unclear career progression path',
    description: 'Young professionals lack visibility into what career growth looks like in their industry. They struggle to understand what skills to develop, what roles to target, and what timeline is realistic for advancement.',
    hypothesis: 'We believe that showing industry-specific career maps with skill requirements will help users plan their professional development with confidence.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-002-1',
        type: 'INTERVIEW_QUOTE',
        content: "I've been in my role for 3 years and have no idea what comes next. My manager says 'just keep doing good work' but that's not helpful.",
        source: 'User Interview #18',
        reportedBy: 'Nomvula K.',
        reportedAt: '2026-01-12T11:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.85,
      },
      {
        id: 'ev-002-2',
        type: 'MARKET_RESEARCH',
        content: 'LinkedIn data shows 67% of SA professionals feel uncertain about their next career move',
        source: 'LinkedIn Workforce Report 2025',
        reportedAt: '2025-11-15T00:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.8,
      },
    ],
    evidenceSummary: 'Career path uncertainty affects majority of professionals, with specific pain around skill development prioritization and timeline expectations.',
    scores: {
      applicability: { value: 82, justification: 'Affects 82% of users aged 25-35 in surveys', source: 'HUMAN' },
      severity: { value: 75, justification: 'Causes frustration but not acute daily pain', source: 'HUMAN' },
      frequency: { value: 45, justification: 'Comes up during reflection periods, not daily', source: 'HUMAN' },
      willingnessToPay: { value: 70, justification: 'Users compare to mentorship and coaching costs', source: 'HUMAN' },
      retentionImpact: { value: 85, justification: 'Key differentiator for long-term engagement', source: 'HUMAN' },
      acquisitionPotential: { value: 65, justification: 'Career mapping is a strong marketing hook', source: 'HUMAN' },
      viralCoefficient: { value: 55, justification: 'Users share career insights with colleagues', source: 'AI', aiSuggested: 55 },
      strategicFit: { value: 95, justification: 'Central to 2gthr value proposition', source: 'HUMAN' },
      feasibility: { value: 65, justification: 'Requires industry-specific data collection', source: 'HUMAN' },
      timeToValue: { value: 50, justification: 'Significant research and data work needed', source: 'HUMAN' },
      riskLevel: { value: 60, justification: 'Risk of outdated/inaccurate industry data', source: 'HUMAN' },
    },
    status: 'SHORTLISTED',
    isShortlisted: true,
    shortlistOrder: 2,
    tags: ['career', 'growth', 'skills', 'planning'],
    groupIds: ['grp-career', 'grp-v1'],
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
    lastScoredAt: '2026-02-08T16:30:00Z',
    lastScoredBy: 'user-daniel',
  },

  // === FINANCE PROBLEMS ===
  {
    id: 'prob-003',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-finance',
    title: 'Living paycheck to paycheck with no savings',
    description: 'Many users struggle to build any savings despite steady income. They lack budgeting skills and visibility into where their money goes, leading to constant financial stress and vulnerability to emergencies.',
    hypothesis: 'We believe that providing automated expense tracking with personalized savings goals will help users build emergency funds within 6 months.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-003-1',
        type: 'INTERVIEW_QUOTE',
        content: "I make decent money but I have no idea where it goes. By the 20th of every month, I'm checking my balance before buying groceries.",
        source: 'User Interview #31',
        reportedBy: 'Sipho M.',
        reportedAt: '2026-01-20T15:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.9,
      },
      {
        id: 'ev-003-2',
        type: 'MARKET_RESEARCH',
        content: 'FNB report: 72% of SA middle class has less than R10,000 in emergency savings',
        source: 'FNB Financial Wellness Report 2025',
        reportedAt: '2025-10-01T00:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.85,
      },
      {
        id: 'ev-003-3',
        type: 'SURVEY_RESPONSE',
        content: '68% of respondents said they would "definitely use" a feature that helped them save automatically',
        source: 'Feature Interest Survey',
        reportedAt: '2026-01-25T00:00:00Z',
        sentiment: 'POSITIVE',
        weight: 0.8,
      },
    ],
    evidenceSummary: 'Financial vulnerability is widespread (72% lack emergency savings) with high user interest in automated savings solutions.',
    scores: {
      applicability: { value: 72, justification: '72% of target demographic affected per market research', source: 'HUMAN' },
      severity: { value: 88, justification: 'Causes significant daily stress and life limitations', source: 'HUMAN' },
      frequency: { value: 90, justification: 'Daily concern for most affected users', source: 'HUMAN' },
      willingnessToPay: { value: 55, justification: 'Ironic - those with problem have least to pay', source: 'HUMAN' },
      retentionImpact: { value: 90, justification: 'Financial tools create strong habit loops', source: 'HUMAN' },
      acquisitionPotential: { value: 70, justification: 'Money management is universal pain point', source: 'HUMAN' },
      viralCoefficient: { value: 65, justification: 'Success stories drive word-of-mouth', source: 'HUMAN' },
      strategicFit: { value: 85, justification: 'Core life area for 2gthr', source: 'HUMAN' },
      feasibility: { value: 80, justification: 'Bank integrations available in SA market', source: 'HUMAN' },
      timeToValue: { value: 70, justification: 'Faster than career features, bank APIs exist', source: 'HUMAN' },
      riskLevel: { value: 65, justification: 'Security and compliance considerations', source: 'HUMAN' },
    },
    status: 'SHORTLISTED',
    isShortlisted: true,
    shortlistOrder: 3,
    tags: ['finance', 'savings', 'budgeting', 'stress'],
    groupIds: ['grp-finance', 'grp-v1'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
  },

  // === WELLBEING PROBLEMS ===
  {
    id: 'prob-004',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-wellbeing',
    title: 'Work-life balance deterioration',
    description: 'Users report increasingly blurred boundaries between work and personal life, especially with remote/hybrid work. This leads to burnout, relationship strain, and reduced life satisfaction.',
    hypothesis: 'We believe that providing boundary-setting tools and work-life health scores will help users maintain healthier separation between work and personal time.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-004-1',
        type: 'INTERVIEW_QUOTE',
        content: "Working from home was supposed to give me more time, but now I'm answering emails at 10pm. My partner says they never see me even though I'm physically home.",
        source: 'User Interview #27',
        reportedBy: 'Lerato P.',
        reportedAt: '2026-01-18T16:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.85,
      },
      {
        id: 'ev-004-2',
        type: 'ANALYTICS_DATA',
        content: 'Wellbeing check-ins show 45% of users report work-related stress as primary concern',
        source: 'In-app Surveys',
        reportedAt: '2026-01-30T00:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.75,
      },
    ],
    evidenceSummary: 'Work-life boundary issues affect nearly half of users, with remote work amplifying the problem.',
    scores: {
      applicability: { value: 65, justification: '65% of employed users report boundary issues', source: 'HUMAN' },
      severity: { value: 78, justification: 'Leads to burnout and relationship problems', source: 'HUMAN' },
      frequency: { value: 85, justification: 'Daily struggle for affected users', source: 'HUMAN' },
      willingnessToPay: { value: 50, justification: 'Moderate WTP - seen as "soft" benefit', source: 'HUMAN' },
      retentionImpact: { value: 75, justification: 'Wellness features drive daily engagement', source: 'HUMAN' },
      acquisitionPotential: { value: 45, justification: 'Not primary acquisition driver', source: 'AI', aiSuggested: 45 },
      viralCoefficient: { value: 40, justification: 'Low sharing tendency for personal wellness', source: 'AI', aiSuggested: 40 },
      strategicFit: { value: 80, justification: 'Wellbeing is core 2gthr pillar', source: 'HUMAN' },
      feasibility: { value: 85, justification: 'Mostly UI/UX work, no complex integrations', source: 'HUMAN' },
      timeToValue: { value: 80, justification: 'Quick to build and test', source: 'HUMAN' },
      riskLevel: { value: 80, justification: 'Low technical risk', source: 'HUMAN' },
    },
    status: 'DISCOVERED',
    isShortlisted: false,
    tags: ['wellbeing', 'work-life', 'stress', 'remote-work'],
    groupIds: ['grp-wellbeing'],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
  },
  {
    id: 'prob-005',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-wellbeing',
    title: 'Difficulty maintaining healthy habits',
    description: 'Users start wellness routines (exercise, meditation, healthy eating) but struggle to maintain them beyond a few weeks. They lack accountability and motivation structures.',
    hypothesis: 'We believe that social accountability features and streak-based rewards will help users maintain healthy habits for 30+ days.',
    source: 'SYNTHETIC_INTERVIEW',
    evidenceItems: [
      {
        id: 'ev-005-1',
        type: 'SYNTHETIC_INTERVIEW',
        content: "I've downloaded at least 5 fitness apps. I use them intensely for 2 weeks then forget they exist. I need something that actually sticks.",
        source: 'Synthetic Interview - Young Professional Persona',
        reportedAt: '2026-02-01T00:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.7,
      },
      {
        id: 'ev-005-2',
        type: 'COMPETITOR_INTEL',
        content: 'Noom reports 64% user retention at 6 months with social features vs 23% without',
        source: 'Competitor Analysis',
        reportedAt: '2025-12-15T00:00:00Z',
        sentiment: 'POSITIVE',
        weight: 0.75,
      },
    ],
    evidenceSummary: 'Habit maintenance is a universal challenge with evidence that social features significantly improve retention.',
    scores: {
      applicability: { value: 70, justification: 'Most users attempt wellness habits', source: 'AI', aiSuggested: 70 },
      severity: { value: 60, justification: 'Frustrating but not acute', source: 'AI', aiSuggested: 60 },
      frequency: { value: 50, justification: 'Periodic frustration during restart attempts', source: 'AI', aiSuggested: 50 },
      willingnessToPay: { value: 60, justification: 'Users already pay for fitness apps', source: 'HUMAN' },
      retentionImpact: { value: 85, justification: 'Habit features drive daily opens', source: 'HUMAN' },
      acquisitionPotential: { value: 50, justification: 'Crowded market, not differentiating', source: 'HUMAN' },
      viralCoefficient: { value: 70, justification: 'Social accountability drives sharing', source: 'HUMAN' },
      strategicFit: { value: 75, justification: 'Supports wellbeing pillar', source: 'HUMAN' },
      feasibility: { value: 90, justification: 'Well-understood patterns exist', source: 'HUMAN' },
      timeToValue: { value: 85, justification: 'Quick to implement with existing frameworks', source: 'HUMAN' },
      riskLevel: { value: 85, justification: 'Low risk, proven patterns', source: 'HUMAN' },
    },
    status: 'DISCOVERED',
    isShortlisted: false,
    tags: ['wellbeing', 'habits', 'fitness', 'accountability'],
    groupIds: ['grp-wellbeing', 'grp-network'],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
  },

  // === MORE CAREER PROBLEMS ===
  {
    id: 'prob-006',
    tenantId: 'demo-tenant',
    sprintId: 'sprint-career',
    title: 'CV/Resume never gets responses',
    description: 'Users apply to dozens of jobs but rarely get callbacks. They suspect their CV format or content is the problem but lack feedback on what to improve.',
    hypothesis: 'We believe that AI-powered CV analysis with specific, actionable feedback will increase interview callback rates by 40%.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-006-1',
        type: 'INTERVIEW_QUOTE',
        content: "I've applied to over 50 jobs in the past 3 months. Got maybe 2 responses. Is it my CV? My experience? I have no idea what's wrong.",
        source: 'User Interview #35',
        reportedBy: 'Marcus T.',
        reportedAt: '2026-01-22T10:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.9,
      },
      {
        id: 'ev-006-2',
        type: 'MARKET_RESEARCH',
        content: 'Average response rate for job applications in SA: 2-5%',
        source: 'CareerJunction Industry Report',
        reportedAt: '2025-09-01T00:00:00Z',
        sentiment: 'NEUTRAL',
        weight: 0.7,
      },
    ],
    evidenceSummary: 'Low application response rates (2-5%) create frustration, with users lacking feedback on improvement areas.',
    scores: {
      applicability: { value: 75, justification: 'Affects all active job seekers', source: 'HUMAN' },
      severity: { value: 80, justification: 'Major blocker to career progress', source: 'HUMAN' },
      frequency: { value: 65, justification: 'Felt with each application batch', source: 'HUMAN' },
      willingnessToPay: { value: 75, justification: 'High WTP for career advancement tools', source: 'HUMAN' },
      retentionImpact: { value: 70, justification: 'Point solution, less sticky', source: 'HUMAN' },
      acquisitionPotential: { value: 80, justification: 'Strong marketing hook for job seekers', source: 'HUMAN' },
      viralCoefficient: { value: 60, justification: 'Share success after landing job', source: 'HUMAN' },
      strategicFit: { value: 85, justification: 'Supports career pillar', source: 'HUMAN' },
      feasibility: { value: 85, justification: 'AI/LLM capabilities readily available', source: 'HUMAN' },
      timeToValue: { value: 80, justification: 'Can ship MVP quickly', source: 'HUMAN' },
      riskLevel: { value: 75, justification: 'AI quality variance risk', source: 'HUMAN' },
    },
    status: 'DISCOVERED',
    isShortlisted: false,
    tags: ['career', 'cv', 'resume', 'job-applications'],
    groupIds: ['grp-career'],
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
  },

  // === NETWORK EFFECT PROBLEMS ===
  {
    id: 'prob-007',
    tenantId: 'demo-tenant',
    title: 'No accountability partner for goals',
    description: 'Users set personal goals but lack someone to hold them accountable. Friends and family are unreliable accountability partners, leading to abandoned goals.',
    hypothesis: 'We believe that matching users with accountability partners based on complementary goals will increase goal completion rates by 60%.',
    source: 'RESEARCH',
    evidenceItems: [
      {
        id: 'ev-007-1',
        type: 'INTERVIEW_QUOTE',
        content: "I tell my friends my goals and they say 'good luck' and that's it. I need someone who actually checks in on me.",
        source: 'User Interview #42',
        reportedBy: 'Zanele N.',
        reportedAt: '2026-01-25T14:00:00Z',
        sentiment: 'NEGATIVE',
        weight: 0.85,
      },
    ],
    evidenceSummary: 'Accountability gaps lead to abandoned goals, with users seeking more structured support than friends/family provide.',
    scores: {
      applicability: { value: 60, justification: 'Applies to goal-oriented users', source: 'HUMAN' },
      severity: { value: 55, justification: 'Frustrating but manageable', source: 'HUMAN' },
      frequency: { value: 40, justification: 'Noticed when goals fail', source: 'HUMAN' },
      willingnessToPay: { value: 45, justification: 'Lower WTP for social features', source: 'HUMAN' },
      retentionImpact: { value: 80, justification: 'Social features drive habit', source: 'HUMAN' },
      acquisitionPotential: { value: 75, justification: 'Invite mechanics for growth', source: 'HUMAN' },
      viralCoefficient: { value: 90, justification: 'Inherently social, drives invites', source: 'HUMAN' },
      strategicFit: { value: 85, justification: 'Community is key differentiator', source: 'HUMAN' },
      feasibility: { value: 70, justification: 'Matching algorithm complexity', source: 'HUMAN' },
      timeToValue: { value: 55, justification: 'Needs critical mass to work', source: 'HUMAN' },
      riskLevel: { value: 50, justification: 'Cold start problem risk', source: 'HUMAN' },
    },
    status: 'DISCOVERED',
    isShortlisted: false,
    tags: ['social', 'accountability', 'goals', 'community'],
    groupIds: ['grp-network'],
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
    createdBy: 'user-ray',
  },
];

// ============================================================================
// COMPUTED VALUES
// ============================================================================

// Add priority scores using default weights
export const sampleProblemsWithPriority = sampleProblems.map(problem => ({
  ...problem,
  priorityScore: calculatePriorityScore(problem.scores, DEFAULT_WEIGHTS),
}));

// Sort by priority score (descending)
export const sortedByPriority = [...sampleProblemsWithPriority].sort(
  (a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)
);

// Get shortlisted problems
export const shortlistedProblems = sampleProblemsWithPriority.filter(p => p.isShortlisted);

// Get problems by group
export function getProblemsByGroup(groupId: string): EnhancedProblem[] {
  return sampleProblemsWithPriority.filter(p => p.groupIds.includes(groupId));
}

// Get problems by status
export function getProblemsByStatus(status: EnhancedProblem['status']): EnhancedProblem[] {
  return sampleProblemsWithPriority.filter(p => p.status === status);
}

// Get problems by sprint
export function getProblemsBySprint(sprintId: string): EnhancedProblem[] {
  return sampleProblemsWithPriority.filter(p => p.sprintId === sprintId);
}

export default sampleProblems;
