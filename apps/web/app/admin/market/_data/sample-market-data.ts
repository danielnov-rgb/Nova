import type { MarketIntelligence, MarketIntelligenceCategory } from '../../_lib/api';

/**
 * Sample market intelligence data for demo purposes
 * Focused on South African market context for the 2gthr life partner app
 */
export const sampleMarketData: MarketIntelligence[] = [
  // === INDUSTRY TRENDS ===
  {
    id: 'market-001',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'Mobile App Usage in South Africa',
    value: '28.5M users',
    source: 'Statista 2024',
    notes: 'Smartphone penetration continues to grow, with 51% of the population now using smartphones. Mobile-first approach is essential.',
    metadata: {
      year: 2024,
      growthRate: '8.2%',
      trend: 'increasing',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-002',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'Fintech App Adoption Rate',
    value: '67%',
    source: 'FNB Digital Report 2024',
    notes: 'South Africans show high willingness to adopt financial technology apps, especially for budgeting and payments.',
    metadata: {
      segment: 'Urban adults 25-45',
      comparison: 'Africa average: 42%',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-003',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'Life Planning App Market Size (SA)',
    value: 'R2.3B',
    source: 'Deloitte Africa Tech Trends',
    notes: 'Combined market for wellness, finance, and productivity apps in South Africa. Growing at 15% YoY.',
    metadata: {
      year: 2024,
      projectedGrowth: '18% by 2027',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === BENCHMARKS ===
  {
    id: 'market-004',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Average Time to First Paid Conversion',
    value: '14 days',
    source: 'SaaS Africa Benchmark Report',
    notes: 'For freemium apps in the lifestyle/productivity category. Top performers convert within 7 days.',
    metadata: {
      topQuartile: '7 days',
      bottomQuartile: '30+ days',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-005',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Day 7 Retention Rate (Lifestyle Apps)',
    value: '23%',
    source: 'AppsFlyer SA Report',
    notes: 'Industry benchmark for lifestyle/productivity apps. Top apps achieve 35%+ D7 retention.',
    metadata: {
      topPerformer: '38%',
      category: 'Lifestyle & Productivity',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-006',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Monthly Churn Rate',
    value: '5.2%',
    source: 'Recurly Subscription Benchmark',
    notes: 'For subscription apps in Africa. Health/wellness apps see lower churn at 3.8%.',
    metadata: {
      voluntary: '3.1%',
      involuntary: '2.1%',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-007',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Customer Acquisition Cost (CAC)',
    value: 'R180',
    source: 'Meta Ads SA Benchmark',
    notes: 'Average CAC for lifestyle app installs via paid social. Organic acquisition is 4x more efficient.',
    metadata: {
      organicCac: 'R45',
      paidCac: 'R180',
      referralCac: 'R65',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-008',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Average Revenue Per User (ARPU)',
    value: 'R89/month',
    source: 'Nova Platform Intelligence',
    notes: 'For premium subscription apps in SA. Freemium models see R35 blended ARPU.',
    metadata: {
      premium: 'R149',
      freemium: 'R35',
      enterprise: 'R450',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === ECONOMIC INDICATORS ===
  {
    id: 'market-009',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'South Africa Unemployment Rate',
    value: '32.1%',
    source: 'Stats SA Q4 2024',
    notes: 'Youth unemployment (15-24) significantly higher at 59.7%. Career planning features highly relevant.',
    metadata: {
      youthUnemployment: '59.7%',
      quarter: 'Q4 2024',
      trend: 'stable',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-010',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'Average Household Income',
    value: 'R23,380/month',
    source: 'Stats SA General Household Survey',
    notes: 'Median is significantly lower at R14,500. Large income disparity affects pricing strategy.',
    metadata: {
      median: 'R14,500',
      topQuintile: 'R65,000+',
      bottomQuintile: 'R5,500',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-011',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'Consumer Confidence Index',
    value: '-12',
    source: 'FNB/BER Consumer Confidence',
    notes: 'Negative sentiment persists due to load shedding and cost of living. Value proposition must be clear.',
    metadata: {
      previousQuarter: '-15',
      trend: 'improving',
      historicalAverage: '-5',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-012',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'Digital Spending Growth',
    value: '+18%',
    source: 'Mastercard Digital Economy Index',
    notes: 'South Africans spending more on digital services despite economic headwinds. Strong digital adoption.',
    metadata: {
      subscriptions: '+22%',
      oneTimePurchases: '+12%',
      inAppPurchases: '+28%',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === PRICING INTELLIGENCE ===
  {
    id: 'market-013',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Willingness to Pay (Life Planning Apps)',
    value: 'R79-149/month',
    source: 'Nova User Research',
    notes: 'Sweet spot for premium tier. Users expect significant value at R150+. Free tier essential for acquisition.',
    metadata: {
      budget: 'R49',
      standard: 'R99',
      premium: 'R149',
      enterprise: 'R299+',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-014',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Annual vs Monthly Preference',
    value: '35% prefer annual',
    source: 'Subscription Economy Report SA',
    notes: 'Annual subscribers have 40% lower churn. Offer 2 months free for annual commitment.',
    metadata: {
      annualDiscount: '17% (2 months free)',
      annualChurn: '28% lower',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-015',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Competitor Pricing Range',
    value: 'R0 - R199/month',
    source: 'Competitive Analysis',
    notes: 'Most competitors offer free tier. Premium tiers range from R79-R199. Family plans emerging.',
    metadata: {
      competitors: ['22seven (Free)', 'Stash (R99)', 'Mint (Free)', 'YNAB (R165)'],
      trend: 'Bundling with financial services',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === DEMOGRAPHICS ===
  {
    id: 'market-016',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Target Demographic Size',
    value: '8.2M people',
    source: 'Stats SA Census + Nova Analysis',
    notes: 'Urban professionals aged 25-45 with smartphone access. Primary target for 2gthr.',
    metadata: {
      ageRange: '25-45',
      urbanOnly: true,
      smartphoneOwners: true,
      incomeThreshold: 'R15,000+/month',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-017',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Primary User Persona',
    value: '28-35 year olds',
    source: 'User Research Synthesis',
    notes: 'Core users are early-career professionals navigating major life decisions (career, relationships, finances).',
    metadata: {
      gender: '58% Female, 42% Male',
      education: '72% tertiary educated',
      employment: '68% full-time employed',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-018',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Geographic Distribution',
    value: 'Gauteng 45%',
    source: 'App Store Analytics',
    notes: 'Heavy concentration in Gauteng, followed by Western Cape (25%) and KZN (15%).',
    metadata: {
      gauteng: '45%',
      westernCape: '25%',
      kzn: '15%',
      other: '15%',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-019',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Device Usage Patterns',
    value: '94% Mobile',
    source: 'Google Analytics',
    notes: 'Overwhelmingly mobile usage. Desktop usage spikes during work hours for detailed planning.',
    metadata: {
      mobile: '94%',
      desktop: '5%',
      tablet: '1%',
      peakUsage: '7-9pm',
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
  {
    id: 'market-020',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Life Stage Distribution',
    value: 'Early Career 42%',
    source: 'User Survey 2024',
    notes: 'Users primarily in early career (42%), followed by mid-career (31%) and life transitions (27%).',
    metadata: {
      earlyCareer: '42%',
      midCareer: '31%',
      lifeTransition: '27%',
      topConcerns: ['Career growth', 'Financial stability', 'Relationship goals'],
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },
];

/**
 * Get sample data by category
 */
export function getSampleDataByCategory(category?: MarketIntelligenceCategory) {
  if (!category) return sampleMarketData;
  return sampleMarketData.filter((item) => item.category === category);
}

/**
 * Get category counts for display
 */
export function getCategoryCounts() {
  const counts: Record<MarketIntelligenceCategory, number> = {
    INDUSTRY: 0,
    BENCHMARK: 0,
    ECONOMIC: 0,
    PRICING: 0,
    DEMOGRAPHIC: 0,
  };

  sampleMarketData.forEach((item) => {
    counts[item.category]++;
  });

  return counts;
}

export default sampleMarketData;
