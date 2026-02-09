/**
 * Enhanced Problem Data Structure for Nova
 *
 * This defines the comprehensive schema for problems including:
 * - Multi-attribute scoring (11 dimensions)
 * - Structured evidence trails
 * - Weighting profiles for dynamic prioritization
 * - Problem groups for organization
 *
 * Use this schema to generate realistic demo data via simulator.
 */

// ============================================================================
// ENUMS & TYPES
// ============================================================================

export type ProblemSource =
  | 'SYNTHETIC_INTERVIEW'
  | 'MANUAL'
  | 'IMPORT'
  | 'RESEARCH';

export type ProblemStatus =
  | 'DISCOVERED'    // Just found
  | 'SHORTLISTED'   // Selected for deeper analysis
  | 'BACKLOG'       // Ready for solution design
  | 'IN_PROGRESS'   // Being solved
  | 'SOLVED'        // Solution deployed
  | 'DISCARDED';    // Not worth pursuing

export type EvidenceType =
  | 'INTERVIEW_QUOTE'      // Direct quote from user interview
  | 'SURVEY_RESPONSE'      // Survey data
  | 'SUPPORT_TICKET'       // Customer support issue
  | 'ANALYTICS_DATA'       // Usage/behavior data
  | 'MARKET_RESEARCH'      // Third-party research
  | 'COMPETITOR_INTEL'     // What competitors do
  | 'EXPERT_OPINION'       // Subject matter expert input
  | 'SYNTHETIC_INTERVIEW'  // AI-generated interview
  | 'OBSERVATION'          // Direct observation
  | 'OTHER';

export type ScoreSource = 'AI' | 'HUMAN' | 'IMPORT';

export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

// ============================================================================
// SCORING
// ============================================================================

/**
 * Score with metadata for audit trail
 * Each scoring attribute has this structure
 */
export interface ScoreWithMeta {
  value: number;                    // 0-100 (current score)
  aiSuggested?: number;             // AI's initial suggestion
  confidence?: number;              // AI's confidence (0-1)
  justification?: string;           // Why this score?
  source?: ScoreSource;             // Who/what set this score
  lastUpdatedAt?: string;           // ISO timestamp
  lastUpdatedBy?: string;           // User ID or 'AI'
}

/**
 * All 11 scoring attributes for a problem
 * Total weight should sum to 100
 */
export interface ProblemScores {
  // === CORE ATTRIBUTES (typically ~40-50% weight) ===

  /** What percentage of target users are affected by this problem? (0-100) */
  applicability: ScoreWithMeta;

  /** How painful is this problem when encountered? (0-100) */
  severity: ScoreWithMeta;

  /** How often does this problem occur? (0-100) */
  frequency: ScoreWithMeta;

  /** Would users pay to solve this problem? (0-100) */
  willingnessToPay: ScoreWithMeta;

  // === STRATEGIC ATTRIBUTES (typically ~30-40% weight) ===

  /** Does solving this problem improve user retention? (0-100) */
  retentionImpact: ScoreWithMeta;

  /** Does this problem/solution attract new users? (0-100) */
  acquisitionPotential: ScoreWithMeta;

  /** Does solving this drive word-of-mouth? (0-100) */
  viralCoefficient: ScoreWithMeta;

  /** Does this align with company strategy and goals? (0-100) */
  strategicFit: ScoreWithMeta;

  // === EXECUTION ATTRIBUTES (typically ~15-20% weight) ===

  /** Can we realistically build a solution? (0-100, higher = easier) */
  feasibility: ScoreWithMeta;

  /** How quickly can we deliver value? (0-100, higher = faster) */
  timeToValue: ScoreWithMeta;

  /** Implementation risk level (0-100, higher = less risky) */
  riskLevel: ScoreWithMeta;
}

/**
 * Default empty scores structure
 */
export const DEFAULT_SCORES: ProblemScores = {
  applicability: { value: 0 },
  severity: { value: 0 },
  frequency: { value: 0 },
  willingnessToPay: { value: 0 },
  retentionImpact: { value: 0 },
  acquisitionPotential: { value: 0 },
  viralCoefficient: { value: 0 },
  strategicFit: { value: 0 },
  feasibility: { value: 0 },
  timeToValue: { value: 0 },
  riskLevel: { value: 0 },
};

// ============================================================================
// EVIDENCE
// ============================================================================

/**
 * Structured evidence item supporting a problem
 */
export interface EvidenceItem {
  id: string;
  type: EvidenceType;

  /** The actual evidence content (quote, data point, observation) */
  content: string;

  /** Where this evidence came from */
  source: string;

  /** Link to source document/system */
  sourceUrl?: string;

  /** Person who reported/collected this evidence */
  reportedBy?: string;

  /** When the evidence was collected */
  reportedAt?: string;

  /** Sentiment of the evidence */
  sentiment?: Sentiment;

  /** Importance weight (0-1) */
  weight?: number;

  /** Flexible additional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================================================
// PROBLEM
// ============================================================================

/**
 * Enhanced Problem with full scoring and evidence
 * This is the main data structure for the problem scoring system
 */
export interface EnhancedProblem {
  // === IDENTITY ===
  id: string;
  tenantId: string;
  sprintId?: string;

  // === CONTENT ===
  /** Short, descriptive problem title */
  title: string;

  /** Detailed problem description */
  description: string;

  /** "We believe that..." hypothesis statement */
  hypothesis?: string;

  // === SOURCE & EVIDENCE ===
  source: ProblemSource;

  /** Structured array of evidence items */
  evidenceItems: EvidenceItem[];

  /** AI-generated summary of all evidence */
  evidenceSummary?: string;

  // === SCORING ===
  /** All 11 scoring attributes with metadata */
  scores: ProblemScores;

  /** Computed priority score (calculated from weights) */
  priorityScore?: number;

  // === ORGANIZATION ===
  status: ProblemStatus;

  /** Quick flag for two-list UI filtering */
  isShortlisted: boolean;

  /** Manual ordering position in shortlist */
  shortlistOrder?: number;

  /** Flexible tags for categorization */
  tags: string[];

  /** IDs of groups this problem belongs to */
  groupIds: string[];

  // === METADATA ===
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastScoredAt?: string;
  lastScoredBy?: string;
}

/**
 * Problem for list display (subset of fields)
 */
export interface ProblemListItem {
  id: string;
  title: string;
  description?: string;
  status: ProblemStatus;
  isShortlisted: boolean;
  shortlistOrder?: number;
  priorityScore?: number;
  tags: string[];
  groupIds: string[];
  scores: {
    applicability: { value: number };
    severity: { value: number };
    frequency: { value: number };
    willingnessToPay: { value: number };
    feasibility: { value: number };
    strategicFit: { value: number };
  };
  evidenceCount?: number;
  createdAt: string;
}

// ============================================================================
// WEIGHTING PROFILE
// ============================================================================

/**
 * Weight values for each scoring attribute
 * Should sum to 100
 */
export interface WeightValues {
  // Core (typically ~40-50%)
  applicability: number;
  severity: number;
  frequency: number;
  willingnessToPay: number;

  // Strategic (typically ~30-40%)
  retentionImpact: number;
  acquisitionPotential: number;
  viralCoefficient: number;
  strategicFit: number;

  // Execution (typically ~15-20%)
  feasibility: number;
  timeToValue: number;
  riskLevel: number;
}

/**
 * Default weighting profile
 * Balanced across all categories
 */
export const DEFAULT_WEIGHTS: WeightValues = {
  applicability: 15,
  severity: 20,
  frequency: 10,
  willingnessToPay: 15,
  retentionImpact: 10,
  acquisitionPotential: 5,
  viralCoefficient: 5,
  strategicFit: 10,
  feasibility: 5,
  timeToValue: 3,
  riskLevel: 2,
};

/**
 * Weighting profile for dynamic prioritization
 */
export interface WeightingProfile {
  id: string;
  tenantId: string;

  /** Profile name (e.g., "V1 Launch Focus", "Revenue Priority") */
  name: string;

  description?: string;

  /** Only one profile can be default per tenant */
  isDefault: boolean;

  /** Weight values (should sum to 100) */
  weights: WeightValues;

  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PROBLEM GROUPS
// ============================================================================

/**
 * Problem group for organizing and creating voting sessions
 */
export interface ProblemGroup {
  id: string;
  tenantId: string;

  /** Group name (e.g., "Career Aspiration", "V1 Launch") */
  name: string;

  description?: string;

  /** Color for UI display (hex) */
  color?: string;

  /** Optional icon name */
  icon?: string;

  /** Count of problems in this group */
  problemCount?: number;

  /** Voting sessions created from this group */
  votingSessionIds?: string[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Junction record for problem-group relationship
 */
export interface ProblemGroupMembership {
  id: string;
  problemId: string;
  groupId: string;
  addedAt: string;
  addedBy?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate priority score from scores and weights
 */
export function calculatePriorityScore(
  scores: ProblemScores,
  weights: WeightValues
): number {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  if (totalWeight === 0) return 0;

  const weightedSum =
    (scores.applicability.value * weights.applicability) +
    (scores.severity.value * weights.severity) +
    (scores.frequency.value * weights.frequency) +
    (scores.willingnessToPay.value * weights.willingnessToPay) +
    (scores.retentionImpact.value * weights.retentionImpact) +
    (scores.acquisitionPotential.value * weights.acquisitionPotential) +
    (scores.viralCoefficient.value * weights.viralCoefficient) +
    (scores.strategicFit.value * weights.strategicFit) +
    (scores.feasibility.value * weights.feasibility) +
    (scores.timeToValue.value * weights.timeToValue) +
    (scores.riskLevel.value * weights.riskLevel);

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Validate that weights sum to 100
 */
export function validateWeights(weights: WeightValues): boolean {
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  return total === 100;
}

/**
 * Get human-readable label for score attribute
 */
export const SCORE_LABELS: Record<keyof WeightValues, string> = {
  applicability: 'Applicability',
  severity: 'Severity',
  frequency: 'Frequency',
  willingnessToPay: 'Willingness to Pay',
  retentionImpact: 'Retention Impact',
  acquisitionPotential: 'Acquisition Potential',
  viralCoefficient: 'Viral Coefficient',
  strategicFit: 'Strategic Fit',
  feasibility: 'Feasibility',
  timeToValue: 'Time to Value',
  riskLevel: 'Risk Level',
};

/**
 * Get description for each score attribute
 */
export const SCORE_DESCRIPTIONS: Record<keyof WeightValues, string> = {
  applicability: 'What percentage of target users are affected?',
  severity: 'How painful is this problem when encountered?',
  frequency: 'How often does this problem occur?',
  willingnessToPay: 'Would users pay to solve this problem?',
  retentionImpact: 'Does solving this improve user retention?',
  acquisitionPotential: 'Does this attract new users?',
  viralCoefficient: 'Does solving this drive word-of-mouth?',
  strategicFit: 'Does this align with company strategy?',
  feasibility: 'Can we realistically build a solution?',
  timeToValue: 'How quickly can we deliver value?',
  riskLevel: 'What is the implementation risk? (higher = less risky)',
};

/**
 * Group score attributes by category
 */
export const SCORE_CATEGORIES = {
  core: ['applicability', 'severity', 'frequency', 'willingnessToPay'] as const,
  strategic: ['retentionImpact', 'acquisitionPotential', 'viralCoefficient', 'strategicFit'] as const,
  execution: ['feasibility', 'timeToValue', 'riskLevel'] as const,
};

// ============================================================================
// CSV HELPERS
// ============================================================================

/**
 * CSV column headers for problem export/import
 */
export const CSV_HEADERS = [
  'id',
  'title',
  'description',
  'hypothesis',
  'source',
  'status',
  'tags',
  'group_ids',
  'applicability',
  'applicability_justification',
  'severity',
  'severity_justification',
  'frequency',
  'frequency_justification',
  'willingness_to_pay',
  'wtp_justification',
  'retention_impact',
  'acquisition_potential',
  'viral_coefficient',
  'strategic_fit',
  'feasibility',
  'time_to_value',
  'risk_level',
  'evidence_items',
  'is_shortlisted',
  'shortlist_order',
] as const;

/**
 * Convert EnhancedProblem to CSV row
 */
export function problemToCsvRow(problem: EnhancedProblem): Record<string, string> {
  return {
    id: problem.id,
    title: problem.title,
    description: problem.description || '',
    hypothesis: problem.hypothesis || '',
    source: problem.source,
    status: problem.status,
    tags: problem.tags.join(','),
    group_ids: problem.groupIds.join(','),
    applicability: String(problem.scores.applicability.value),
    applicability_justification: problem.scores.applicability.justification || '',
    severity: String(problem.scores.severity.value),
    severity_justification: problem.scores.severity.justification || '',
    frequency: String(problem.scores.frequency.value),
    frequency_justification: problem.scores.frequency.justification || '',
    willingness_to_pay: String(problem.scores.willingnessToPay.value),
    wtp_justification: problem.scores.willingnessToPay.justification || '',
    retention_impact: String(problem.scores.retentionImpact.value),
    acquisition_potential: String(problem.scores.acquisitionPotential.value),
    viral_coefficient: String(problem.scores.viralCoefficient.value),
    strategic_fit: String(problem.scores.strategicFit.value),
    feasibility: String(problem.scores.feasibility.value),
    time_to_value: String(problem.scores.timeToValue.value),
    risk_level: String(problem.scores.riskLevel.value),
    evidence_items: JSON.stringify(problem.evidenceItems),
    is_shortlisted: String(problem.isShortlisted),
    shortlist_order: problem.shortlistOrder ? String(problem.shortlistOrder) : '',
  };
}

/**
 * Parse CSV row to EnhancedProblem
 */
export function csvRowToProblem(
  row: Record<string, string>,
  tenantId: string
): Partial<EnhancedProblem> {
  return {
    id: row.id || undefined,
    tenantId,
    title: row.title,
    description: row.description || undefined,
    hypothesis: row.hypothesis || undefined,
    source: (row.source as ProblemSource) || 'IMPORT',
    status: (row.status as ProblemStatus) || 'DISCOVERED',
    tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
    groupIds: row.group_ids ? row.group_ids.split(',').map(g => g.trim()) : [],
    scores: {
      applicability: {
        value: parseInt(row.applicability) || 0,
        justification: row.applicability_justification || undefined,
        source: 'IMPORT',
      },
      severity: {
        value: parseInt(row.severity) || 0,
        justification: row.severity_justification || undefined,
        source: 'IMPORT',
      },
      frequency: {
        value: parseInt(row.frequency) || 0,
        justification: row.frequency_justification || undefined,
        source: 'IMPORT',
      },
      willingnessToPay: {
        value: parseInt(row.willingness_to_pay) || 0,
        justification: row.wtp_justification || undefined,
        source: 'IMPORT',
      },
      retentionImpact: {
        value: parseInt(row.retention_impact) || 0,
        source: 'IMPORT',
      },
      acquisitionPotential: {
        value: parseInt(row.acquisition_potential) || 0,
        source: 'IMPORT',
      },
      viralCoefficient: {
        value: parseInt(row.viral_coefficient) || 0,
        source: 'IMPORT',
      },
      strategicFit: {
        value: parseInt(row.strategic_fit) || 0,
        source: 'IMPORT',
      },
      feasibility: {
        value: parseInt(row.feasibility) || 0,
        source: 'IMPORT',
      },
      timeToValue: {
        value: parseInt(row.time_to_value) || 0,
        source: 'IMPORT',
      },
      riskLevel: {
        value: parseInt(row.risk_level) || 0,
        source: 'IMPORT',
      },
    },
    evidenceItems: row.evidence_items ? JSON.parse(row.evidence_items) : [],
    isShortlisted: row.is_shortlisted === 'true',
    shortlistOrder: row.shortlist_order ? parseInt(row.shortlist_order) : undefined,
  };
}
