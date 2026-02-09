import type { TargetAudience, TargetAudienceType } from '../../_lib/api';

/**
 * Enhanced segment with detailed demographic breakdowns for charting
 */
export interface EnhancedSegment {
  name: string;
  description?: string;
  size: number;
  percentage: number;
  demographics: {
    ageDistribution: { range: string; percentage: number }[];
    genderDistribution: { gender: string; percentage: number }[];
    incomeDistribution: { range: string; percentage: number }[];
    locationDistribution: { location: string; percentage: number }[];
    educationDistribution: { level: string; percentage: number }[];
    employmentDistribution: { status: string; percentage: number }[];
  };
  keyCharacteristics: string[];
  painPoints?: string[];
  goals?: string[];
}

/**
 * Enhanced audience with detailed segments for visualization
 */
export interface EnhancedAudience extends Omit<TargetAudience, 'segments'> {
  description: string;
  totalSize: number;
  segments: EnhancedSegment[];
  summaryStats: {
    avgAge: number;
    avgIncome: number;
    topLocations: string[];
    growthRate?: number;
  };
}

/**
 * Sample audiences for demo - South African market context for 2gthr app
 */
export const sampleAudiences: EnhancedAudience[] = [
  // === EXISTING CUSTOMERS ===
  {
    id: 'audience-existing-001',
    tenantId: 'demo-tenant',
    name: 'Current 2gthr Users',
    type: 'EXISTING',
    description: 'Active users currently using the 2gthr app for life planning and personal development.',
    totalSize: 12500,
    segments: [
      {
        name: 'Young Professionals',
        description: 'Early-career individuals focused on career growth and financial planning',
        size: 5625,
        percentage: 45,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 25 },
            { range: '25-34', percentage: 55 },
            { range: '35-44', percentage: 15 },
            { range: '45-54', percentage: 4 },
            { range: '55+', percentage: 1 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 58 },
            { gender: 'Male', percentage: 40 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 15 },
            { range: 'R25K-R50K', percentage: 35 },
            { range: 'R50K-R75K', percentage: 28 },
            { range: 'R75K-R100K', percentage: 15 },
            { range: 'R100K+', percentage: 7 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 42 },
            { location: 'Cape Town', percentage: 28 },
            { location: 'Durban', percentage: 15 },
            { location: 'Pretoria', percentage: 10 },
            { location: 'Other', percentage: 5 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 12 },
            { level: 'Some College', percentage: 18 },
            { level: "Bachelor's", percentage: 45 },
            { level: "Master's+", percentage: 25 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 72 },
            { status: 'Part-time', percentage: 8 },
            { status: 'Self-employed', percentage: 12 },
            { status: 'Unemployed', percentage: 5 },
            { status: 'Student', percentage: 3 },
          ],
        },
        keyCharacteristics: [
          'Tech-savvy and mobile-first',
          'Ambitious with clear career goals',
          'Value work-life balance',
          'Active on social media',
        ],
        painPoints: [
          'Feeling overwhelmed by competing priorities',
          'Lack of structured planning approach',
          'Financial uncertainty',
        ],
        goals: [
          'Career advancement',
          'Financial stability',
          'Personal growth',
        ],
      },
      {
        name: 'Life Transitioners',
        description: 'Individuals going through major life changes (new job, marriage, parenthood)',
        size: 3750,
        percentage: 30,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 8 },
            { range: '25-34', percentage: 45 },
            { range: '35-44', percentage: 35 },
            { range: '45-54', percentage: 10 },
            { range: '55+', percentage: 2 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 62 },
            { gender: 'Male', percentage: 36 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 8 },
            { range: 'R25K-R50K', percentage: 22 },
            { range: 'R50K-R75K', percentage: 32 },
            { range: 'R75K-R100K', percentage: 25 },
            { range: 'R100K+', percentage: 13 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 38 },
            { location: 'Cape Town', percentage: 32 },
            { location: 'Durban', percentage: 18 },
            { location: 'Pretoria', percentage: 8 },
            { location: 'Other', percentage: 4 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 8 },
            { level: 'Some College', percentage: 15 },
            { level: "Bachelor's", percentage: 48 },
            { level: "Master's+", percentage: 29 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 65 },
            { status: 'Part-time', percentage: 10 },
            { status: 'Self-employed', percentage: 15 },
            { status: 'Unemployed', percentage: 3 },
            { status: 'Other', percentage: 7 },
          ],
        },
        keyCharacteristics: [
          'Seeking stability during change',
          'Planning-oriented mindset',
          'Willing to invest in self-improvement',
          'Family-focused decisions',
        ],
        painPoints: [
          'Uncertainty about the future',
          'Managing multiple life domains simultaneously',
          'Time constraints',
        ],
        goals: [
          'Successful life transitions',
          'Family well-being',
          'Long-term security',
        ],
      },
      {
        name: 'Growth Seekers',
        description: 'Established professionals focused on optimization and continuous improvement',
        size: 3125,
        percentage: 25,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 5 },
            { range: '25-34', percentage: 30 },
            { range: '35-44', percentage: 40 },
            { range: '45-54', percentage: 20 },
            { range: '55+', percentage: 5 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 52 },
            { gender: 'Male', percentage: 46 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 3 },
            { range: 'R25K-R50K', percentage: 12 },
            { range: 'R50K-R75K', percentage: 25 },
            { range: 'R75K-R100K', percentage: 35 },
            { range: 'R100K+', percentage: 25 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 45 },
            { location: 'Cape Town', percentage: 30 },
            { location: 'Durban', percentage: 12 },
            { location: 'Pretoria', percentage: 8 },
            { location: 'Other', percentage: 5 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 5 },
            { level: 'Some College', percentage: 10 },
            { level: "Bachelor's", percentage: 42 },
            { level: "Master's+", percentage: 43 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 60 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Self-employed', percentage: 28 },
            { status: 'Other', percentage: 7 },
          ],
        },
        keyCharacteristics: [
          'High achievers with clear goals',
          'Data-driven decision makers',
          'Value efficiency and optimization',
          'Willing to pay for premium features',
        ],
        painPoints: [
          'Feeling stuck despite success',
          'Work-life imbalance',
          'Need for fresh perspectives',
        ],
        goals: [
          'Peak performance',
          'Leadership growth',
          'Legacy building',
        ],
      },
    ],
    targets: {
      monthlyActiveUsers: 12500,
      retentionRate: 68,
      nps: 42,
    },
    summaryStats: {
      avgAge: 32,
      avgIncome: 65000,
      topLocations: ['Johannesburg', 'Cape Town', 'Durban'],
      growthRate: 8.5,
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === TARGET AUDIENCE ===
  {
    id: 'audience-target-001',
    tenantId: 'demo-tenant',
    name: 'Target Acquisition Profile',
    type: 'TARGET',
    description: 'Ideal customer profiles we want to acquire in the next 12 months.',
    totalSize: 50000,
    segments: [
      {
        name: 'Corporate Professionals',
        description: 'Mid-to-senior level employees at large companies seeking work-life balance',
        size: 20000,
        percentage: 40,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 5 },
            { range: '25-34', percentage: 40 },
            { range: '35-44', percentage: 40 },
            { range: '45-54', percentage: 12 },
            { range: '55+', percentage: 3 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 55 },
            { gender: 'Male', percentage: 43 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 2 },
            { range: 'R25K-R50K', percentage: 15 },
            { range: 'R50K-R75K', percentage: 30 },
            { range: 'R75K-R100K', percentage: 35 },
            { range: 'R100K+', percentage: 18 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 50 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 12 },
            { location: 'Pretoria', percentage: 8 },
            { location: 'Other', percentage: 5 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 5 },
            { level: 'Some College', percentage: 10 },
            { level: "Bachelor's", percentage: 50 },
            { level: "Master's+", percentage: 35 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 92 },
            { status: 'Part-time', percentage: 3 },
            { status: 'Self-employed', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'Work at companies with 500+ employees',
          'Have employer wellness benefits',
          'Busy schedules with limited personal time',
          'Value productivity tools',
        ],
        painPoints: [
          'Burnout and stress',
          'Career stagnation',
          'Disconnection from personal goals',
        ],
        goals: [
          'Better work-life integration',
          'Career progression',
          'Health and wellness',
        ],
      },
      {
        name: 'Entrepreneurs & Founders',
        description: 'Small business owners and startup founders managing multiple responsibilities',
        size: 12500,
        percentage: 25,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 12 },
            { range: '25-34', percentage: 48 },
            { range: '35-44', percentage: 28 },
            { range: '45-54', percentage: 10 },
            { range: '55+', percentage: 2 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 42 },
            { gender: 'Male', percentage: 56 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 15 },
            { range: 'R25K-R50K', percentage: 20 },
            { range: 'R50K-R75K', percentage: 25 },
            { range: 'R75K-R100K', percentage: 22 },
            { range: 'R100K+', percentage: 18 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 45 },
            { location: 'Cape Town', percentage: 35 },
            { location: 'Durban', percentage: 10 },
            { location: 'Pretoria', percentage: 5 },
            { location: 'Other', percentage: 5 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 15 },
            { level: 'Some College', percentage: 20 },
            { level: "Bachelor's", percentage: 40 },
            { level: "Master's+", percentage: 25 },
          ],
          employmentDistribution: [
            { status: 'Self-employed', percentage: 85 },
            { status: 'Full-time', percentage: 10 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'High agency and self-direction',
          'Comfortable with technology',
          'Network-oriented',
          'Growth mindset',
        ],
        painPoints: [
          'Wearing too many hats',
          'Isolation and loneliness',
          'Financial unpredictability',
        ],
        goals: [
          'Business growth',
          'Personal brand building',
          'Sustainable success',
        ],
      },
      {
        name: 'Recent Graduates',
        description: 'University graduates entering the workforce and navigating early career decisions',
        size: 17500,
        percentage: 35,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 65 },
            { range: '25-34', percentage: 32 },
            { range: '35-44', percentage: 3 },
            { range: '45-54', percentage: 0 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 58 },
            { gender: 'Male', percentage: 40 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 45 },
            { range: 'R25K-R50K', percentage: 40 },
            { range: 'R50K-R75K', percentage: 12 },
            { range: 'R75K-R100K', percentage: 3 },
            { range: 'R100K+', percentage: 0 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 40 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 20 },
            { location: 'Pretoria', percentage: 10 },
            { location: 'Other', percentage: 5 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 5 },
            { level: "Bachelor's", percentage: 80 },
            { level: "Master's+", percentage: 15 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 45 },
            { status: 'Part-time', percentage: 15 },
            { status: 'Unemployed', percentage: 25 },
            { status: 'Student', percentage: 10 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'Digital natives',
          'Value-conscious but willing to invest in growth',
          'Seeking mentorship and guidance',
          'Active on social platforms',
        ],
        painPoints: [
          'Job market uncertainty',
          'Student debt',
          'Lack of direction',
        ],
        goals: [
          'Land first job',
          'Build professional network',
          'Financial independence',
        ],
      },
    ],
    targets: {
      monthlyAcquisition: 4000,
      conversionRate: 8,
      cac: 150,
    },
    summaryStats: {
      avgAge: 29,
      avgIncome: 52000,
      topLocations: ['Johannesburg', 'Cape Town', 'Durban'],
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === MARKET DEMOGRAPHICS ===
  {
    id: 'audience-market-001',
    tenantId: 'demo-tenant',
    name: 'South African Market Reality',
    type: 'MARKET',
    description: 'Total addressable market demographics for life planning apps in South Africa.',
    totalSize: 8200000,
    segments: [
      {
        name: 'Urban Professionals',
        description: 'Working professionals in major metropolitan areas with smartphone access',
        size: 3280000,
        percentage: 40,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 18 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 25 },
            { range: '45-54', percentage: 15 },
            { range: '55+', percentage: 7 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 52 },
            { gender: 'Male', percentage: 47 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 20 },
            { range: 'R25K-R50K', percentage: 35 },
            { range: 'R50K-R75K', percentage: 25 },
            { range: 'R75K-R100K', percentage: 12 },
            { range: 'R100K+', percentage: 8 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 38 },
            { location: 'Cape Town', percentage: 22 },
            { location: 'Durban', percentage: 18 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 10 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 25 },
            { level: 'Some College', percentage: 20 },
            { level: "Bachelor's", percentage: 38 },
            { level: "Master's+", percentage: 17 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 58 },
            { status: 'Part-time', percentage: 12 },
            { status: 'Self-employed', percentage: 15 },
            { status: 'Unemployed', percentage: 10 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'Regular smartphone users',
          'Exposed to digital advertising',
          'Some disposable income',
          'Interested in self-improvement',
        ],
      },
      {
        name: 'Students & Early Career',
        description: 'University students and recent graduates under 28',
        size: 2460000,
        percentage: 30,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 70 },
            { range: '25-34', percentage: 28 },
            { range: '35-44', percentage: 2 },
            { range: '45-54', percentage: 0 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 55 },
            { gender: 'Male', percentage: 43 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 65 },
            { range: 'R25K-R50K', percentage: 25 },
            { range: 'R50K-R75K', percentage: 8 },
            { range: 'R75K-R100K', percentage: 2 },
            { range: 'R100K+', percentage: 0 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 35 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 20 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 8 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 15 },
            { level: 'Some College', percentage: 45 },
            { level: "Bachelor's", percentage: 35 },
            { level: "Master's+", percentage: 5 },
          ],
          employmentDistribution: [
            { status: 'Student', percentage: 55 },
            { status: 'Full-time', percentage: 20 },
            { status: 'Part-time', percentage: 10 },
            { status: 'Unemployed', percentage: 12 },
            { status: 'Other', percentage: 3 },
          ],
        },
        keyCharacteristics: [
          'Heavy social media users',
          'Price-sensitive',
          'Open to trying new apps',
          'Seeking career guidance',
        ],
      },
      {
        name: 'Established Adults',
        description: 'Mid-career to senior professionals with stable income',
        size: 2460000,
        percentage: 30,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 0 },
            { range: '25-34', percentage: 15 },
            { range: '35-44', percentage: 40 },
            { range: '45-54', percentage: 30 },
            { range: '55+', percentage: 15 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 48 },
            { gender: 'Male', percentage: 51 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R25K', percentage: 5 },
            { range: 'R25K-R50K', percentage: 20 },
            { range: 'R50K-R75K', percentage: 30 },
            { range: 'R75K-R100K', percentage: 28 },
            { range: 'R100K+', percentage: 17 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 40 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 15 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 8 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 20 },
            { level: 'Some College', percentage: 15 },
            { level: "Bachelor's", percentage: 40 },
            { level: "Master's+", percentage: 25 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 65 },
            { status: 'Self-employed', percentage: 20 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Other', percentage: 10 },
          ],
        },
        keyCharacteristics: [
          'Established in careers',
          'Family responsibilities',
          'Higher purchasing power',
          'Less time for app exploration',
        ],
      },
    ],
    targets: {
      tam: 8200000,
      sam: 2500000,
      som: 125000,
    },
    summaryStats: {
      avgAge: 34,
      avgIncome: 48000,
      topLocations: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
];

/**
 * Get audience by type
 */
export function getAudienceByType(type: TargetAudienceType): EnhancedAudience | undefined {
  return sampleAudiences.find((a) => a.type === type);
}

/**
 * Get all audiences
 */
export function getAllAudiences(): EnhancedAudience[] {
  return sampleAudiences;
}

/**
 * Aggregate demographic data across all segments for an audience
 */
export function getAggregatedDemographics(audience: EnhancedAudience) {
  const aggregated = {
    ageDistribution: {} as Record<string, number>,
    genderDistribution: {} as Record<string, number>,
    incomeDistribution: {} as Record<string, number>,
    locationDistribution: {} as Record<string, number>,
    educationDistribution: {} as Record<string, number>,
    employmentDistribution: {} as Record<string, number>,
  };

  audience.segments.forEach((segment) => {
    const weight = segment.percentage / 100;

    segment.demographics.ageDistribution.forEach((d) => {
      aggregated.ageDistribution[d.range] =
        (aggregated.ageDistribution[d.range] || 0) + d.percentage * weight;
    });

    segment.demographics.genderDistribution.forEach((d) => {
      aggregated.genderDistribution[d.gender] =
        (aggregated.genderDistribution[d.gender] || 0) + d.percentage * weight;
    });

    segment.demographics.incomeDistribution.forEach((d) => {
      aggregated.incomeDistribution[d.range] =
        (aggregated.incomeDistribution[d.range] || 0) + d.percentage * weight;
    });

    segment.demographics.locationDistribution.forEach((d) => {
      aggregated.locationDistribution[d.location] =
        (aggregated.locationDistribution[d.location] || 0) + d.percentage * weight;
    });

    segment.demographics.educationDistribution.forEach((d) => {
      aggregated.educationDistribution[d.level] =
        (aggregated.educationDistribution[d.level] || 0) + d.percentage * weight;
    });

    segment.demographics.employmentDistribution.forEach((d) => {
      aggregated.employmentDistribution[d.status] =
        (aggregated.employmentDistribution[d.status] || 0) + d.percentage * weight;
    });
  });

  return aggregated;
}

/**
 * Compare demographics across audience types
 */
export function compareDemographics(
  dimension: 'age' | 'gender' | 'income' | 'location' | 'education' | 'employment'
) {
  const dimensionMap = {
    age: 'ageDistribution',
    gender: 'genderDistribution',
    income: 'incomeDistribution',
    location: 'locationDistribution',
    education: 'educationDistribution',
    employment: 'employmentDistribution',
  } as const;

  const key = dimensionMap[dimension];

  return sampleAudiences.map((audience) => ({
    type: audience.type,
    name: audience.name,
    data: getAggregatedDemographics(audience)[key],
  }));
}

export default sampleAudiences;
