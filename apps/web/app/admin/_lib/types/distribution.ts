/**
 * Condition operators for distribution rules
 */
export type ConditionOperator = 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'CONTAINS';

/**
 * A distribution rule for generating statistically accurate personas
 * Example: "When profession = Doctor, smokingStatus is { NEVER: 65%, FORMER: 20%, REGULAR: 15% }"
 */
export interface DistributionRule {
  id: string;
  templateId: string;

  // Condition: when this rule applies
  conditionAttribute: string; // e.g., "profession"
  conditionOperator: ConditionOperator;
  conditionValue: string; // e.g., "Doctor"

  // Target: what to distribute
  targetAttribute: string; // e.g., "smokingStatus"
  distribution: Record<string, number>; // e.g., { "NEVER": 65, "FORMER": 20, "REGULAR": 15 }

  // Metadata
  dataSource?: string; // e.g., "CDC 2023", "Stats SA 2024"
  priority: number;
  notes?: string;
}

/**
 * Template containing multiple distribution rules
 */
export interface DistributionTemplate {
  id: string;
  tenantId?: string; // null = global template
  name: string;
  description?: string;
  category: string; // e.g., "profession", "health", "lifestyle", "location"
  isGlobal: boolean;
  isActive: boolean;
  rules: DistributionRule[];
  dataSource?: string;
  sourceUrl?: string;
  validAsOf?: string; // Date when this data was valid
  createdAt: string;
  updatedAt: string;
}

/**
 * Request to create a distribution template
 */
export interface CreateDistributionTemplateDto {
  name: string;
  description?: string;
  category: string;
  isGlobal?: boolean;
  dataSource?: string;
  sourceUrl?: string;
  validAsOf?: string;
  rules?: CreateDistributionRuleDto[];
}

/**
 * Request to create a distribution rule
 */
export interface CreateDistributionRuleDto {
  conditionAttribute: string;
  conditionOperator?: ConditionOperator;
  conditionValue: string;
  targetAttribute: string;
  distribution: Record<string, number>;
  priority?: number;
  dataSource?: string;
  notes?: string;
}

/**
 * Sample distribution rules for South Africa
 * These define realistic demographic correlations
 */
export const sampleDistributionRules: Omit<DistributionRule, 'id' | 'templateId'>[] = [
  // Doctor smoking rates (based on medical literature)
  {
    conditionAttribute: 'profession',
    conditionOperator: 'EQUALS',
    conditionValue: 'Doctor',
    targetAttribute: 'smokingStatus',
    distribution: { NEVER: 65, FORMER: 20, OCCASIONAL: 10, REGULAR: 5 },
    priority: 10,
    dataSource: 'SAMJ 2022',
    notes: 'Doctors tend to smoke less than general population',
  },
  // Township urbanization
  {
    conditionAttribute: 'township',
    conditionOperator: 'NOT_EQUALS',
    conditionValue: '',
    targetAttribute: 'urbanization',
    distribution: { URBAN_MAJOR_CITY: 60, URBAN_SMALL_CITY: 25, SUBURBAN: 10, RURAL_TOWN: 5 },
    priority: 5,
    dataSource: 'Stats SA Census',
    notes: 'Townships are typically near urban centers',
  },
  // Income by education level
  {
    conditionAttribute: 'educationLevel',
    conditionOperator: 'EQUALS',
    conditionValue: 'DOCTORATE',
    targetAttribute: 'incomeRange',
    distribution: {
      RANGE_100K_150K: 20,
      RANGE_150K_200K: 35,
      RANGE_200K_300K: 30,
      OVER_300K: 15,
    },
    priority: 8,
    dataSource: 'Stats SA Labour Market',
    notes: 'PhD holders typically earn higher incomes',
  },
  // Tech savviness by age
  {
    conditionAttribute: 'ageRange',
    conditionOperator: 'EQUALS',
    conditionValue: 'RANGE_18_24',
    targetAttribute: 'techSavviness',
    distribution: { INTERMEDIATE: 20, ADVANCED: 50, EXPERT: 30 },
    priority: 6,
    dataSource: 'General assumption',
    notes: 'Younger generations tend to be more tech-savvy',
  },
  {
    conditionAttribute: 'ageRange',
    conditionOperator: 'EQUALS',
    conditionValue: 'RANGE_65_PLUS',
    targetAttribute: 'techSavviness',
    distribution: { NOVICE: 30, BASIC: 40, INTERMEDIATE: 25, ADVANCED: 5 },
    priority: 6,
    dataSource: 'General assumption',
    notes: 'Older generations may be less tech-savvy on average',
  },
];

/**
 * Validate that distribution percentages sum to 100
 */
export function validateDistribution(distribution: Record<string, number>): boolean {
  const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01; // Allow small floating point errors
}

/**
 * Apply a distribution rule to generate a value
 */
export function applyDistribution(distribution: Record<string, number>): string {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const [value, percentage] of Object.entries(distribution)) {
    cumulative += percentage;
    if (random <= cumulative) {
      return value;
    }
  }

  // Fallback to last value
  return Object.keys(distribution).pop() || '';
}
