/**
 * Sample Problems Data for Nova Demo
 *
 * NOTE: Problems are now loaded from the database (API), not from this file.
 * This file only provides weighting profiles for the scoring UI.
 * The real 2gthr Sprint 1 problems (41 career-focused problems) are seeded
 * via prisma/seed.ts and loaded via the problems API.
 */

import {
  EnhancedProblem,
  ProblemGroup,
  WeightingProfile,
  DEFAULT_WEIGHTS,
  calculatePriorityScore,
} from '../../_lib/types/problem';

// Problem groups are now loaded from the database
export const sampleGroups: ProblemGroup[] = [];

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
    id: 'wp-2gthr',
    tenantId: 'demo-tenant',
    name: '2gthr Framework',
    description: 'Based on 2gthr scoring: Relevance, Retention, Value, Ecosystem',
    isDefault: false,
    weights: {
      applicability: 25,
      severity: 10,
      frequency: 10,
      willingnessToPay: 15,
      retentionImpact: 15,
      acquisitionPotential: 5,
      viralCoefficient: 5,
      strategicFit: 10,
      feasibility: 5,
      timeToValue: 0,
      riskLevel: 0,
    },
    createdAt: '2025-11-28T10:00:00Z',
    updatedAt: '2025-11-28T10:00:00Z',
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
// SAMPLE PROBLEMS — now loaded from database via API
// ============================================================================

export const sampleProblems: EnhancedProblem[] = [];

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
