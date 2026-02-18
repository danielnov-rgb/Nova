import type { MarketIntelligence, MarketIntelligenceCategory } from '../../_lib/api';

/**
 * Sample market intelligence data for demo purposes
 * Focused on South African professional services market for the 2gthr professional development platform
 */
export const sampleMarketData: MarketIntelligence[] = [
  // === INDUSTRY TRENDS ===
  {
    id: 'market-001',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'HPCSA Registered Medical Practitioners',
    value: '~45,000',
    source: 'HPCSA Annual Report 2025',
    notes: 'Health Professions Council of South Africa registered practitioners including doctors, dentists, and allied health professionals. Mandatory CPD requirements create consistent demand for professional development.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-002',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'LPC Registered Legal Practitioners',
    value: '~28,000',
    source: 'Legal Practice Council 2025',
    notes: 'Attorneys, advocates, and candidate legal practitioners registered with the Legal Practice Council. Annual CPD compliance is enforced with minimum hour requirements.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-003',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'SAICA Chartered Accountants',
    value: '~47,000',
    source: 'SAICA Member Database 2025',
    notes: 'South African Institute of Chartered Accountants members. SAICA enforces structured CPD with verifiable and non-verifiable hour categories. Largest professional accounting body in SA.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-004',
    tenantId: 'demo-tenant',
    category: 'INDUSTRY',
    title: 'Professional Development Market Size',
    value: 'R3.2B annual CPD spend',
    source: 'Industry Aggregated Estimates 2025',
    notes: 'Total annual spend on continuing professional development across medical, legal, and accounting professions in South Africa. Includes conference fees, online courses, workshops, and study materials.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },

  // === BENCHMARKS ===
  {
    id: 'market-005',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'CPD Spending per Professional',
    value: 'R8,000-R25,000/year',
    source: 'Professional Body Survey Data 2025',
    notes: 'Range varies by profession and seniority. Medical specialists at the higher end, junior accountants at the lower end. Employer-funded CPD accounts for approximately 60% of total spend.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-006',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'D7 Retention (Professional Dev Apps)',
    value: '23%',
    source: 'AppsFlyer SA Report 2025',
    notes: 'Industry benchmark for professional development and education apps. Top performers achieve 35%+ D7 retention through personalised learning paths and community engagement features.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-007',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Customer Acquisition Cost (Professional Segment)',
    value: 'R180-R350',
    source: 'Digital Marketing Benchmark SA 2025',
    notes: 'CAC for professional services segment via paid digital channels. Higher than consumer apps due to niche targeting. Professional body partnerships and referral programmes can reduce CAC by 40-60%.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-008',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'ARPU Professional Development Platforms',
    value: 'R150-R300/month',
    source: 'SaaS Africa Benchmark Report 2025',
    notes: 'Average revenue per user for professional development platforms in SA. Higher ARPU driven by professional willingness to invest in career-relevant credentials and compliance-required CPD.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-009',
    tenantId: 'demo-tenant',
    category: 'BENCHMARK',
    title: 'Freemium Conversion Rate (Professional)',
    value: '5-8%',
    source: 'Subscription Economy Report SA 2025',
    notes: 'Conversion rate from free to paid tiers for professional-focused platforms. Higher than consumer average (2-4%) due to clear ROI linkage to career progression and CPD compliance needs.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },

  // === ECONOMIC INDICATORS ===
  {
    id: 'market-010',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'SA Professional Services Market Size',
    value: 'R3.2B annual CPD spend',
    source: 'Industry Aggregated Estimates 2025',
    notes: 'Total addressable market for continuing professional development across regulated professions. Excludes informal learning and in-house corporate training budgets estimated at an additional R1.8B.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-011',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'Graduate Unemployment Rate',
    value: '15.5%',
    source: 'Stats SA Quarterly Labour Force Survey 2025',
    notes: 'Graduate unemployment rate compared to national rate of 32.1%. Professional qualifications significantly improve employment outcomes, reinforcing the value proposition of career development platforms.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-012',
    tenantId: 'demo-tenant',
    category: 'ECONOMIC',
    title: 'Digital Spending Growth',
    value: '+18% YoY',
    source: 'Mastercard Digital Economy Index 2025',
    notes: 'South African professionals increasing spend on digital services and online learning platforms despite broader economic headwinds. Subscription-based professional tools growing fastest at +22% YoY.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },

  // === PRICING INTELLIGENCE ===
  {
    id: 'market-013',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Willingness to Pay (Professional Dev)',
    value: 'R150-R300/month',
    source: 'Nova User Research 2025',
    notes: 'Sweet spot for professional development platform subscriptions. Professionals view CPD spend as a tax-deductible business expense, reducing price sensitivity. Annual plans preferred for compliance tracking.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-014',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Competitor Pricing Range',
    value: 'R200-R25,000/course',
    source: 'Competitive Analysis 2025',
    notes: 'GetSmarter: R5,000-R25,000 per course; LinkedIn Learning: ~R300/month; Coursera: R200-R500/month. Wide range reflects difference between short courses and full certificate programmes.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-015',
    tenantId: 'demo-tenant',
    category: 'PRICING',
    title: 'Member-Funded Model Advantage',
    value: 'Organization covers base cost',
    source: '2gthr Business Model Analysis 2025',
    notes: 'Professional body or employer covers base subscription cost for members/employees. Users pay only for premium features and additional content. Reduces individual price friction and increases adoption rates by 3-5x.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },

  // === DEMOGRAPHICS ===
  {
    id: 'market-016',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Professional Services Age Distribution',
    value: '35-54 accounts for 50%',
    source: 'Professional Body Membership Reports 2025',
    notes: 'Age distribution: 25-34 (15%), 35-44 (25%), 45-54 (25%), 55-64 (20%), 65+ (15%). Mid-career professionals form the largest segment, with high CPD engagement and spending power.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-017',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Digital Adoption by Age',
    value: '25-45: 89%, 55-65: 52%',
    source: 'SA Digital Readiness Survey 2025',
    notes: 'Significant digital adoption gap between younger and older professionals. Platform must support hybrid delivery (digital + in-person) to serve the full market. Older professionals prefer structured, formal learning formats.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-018',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Geographic Distribution',
    value: 'Gauteng 45%, WC 25%, KZN 15%',
    source: 'Professional Body Registration Data 2025',
    notes: 'Professional services heavily concentrated in major metropolitan areas. Gauteng (Johannesburg/Pretoria) dominates, followed by Western Cape (Cape Town) and KwaZulu-Natal (Durban). Remaining 15% spread across other provinces.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-019',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Gender Distribution by Profession',
    value: 'Accounting trending female',
    source: 'Professional Body Demographic Reports 2025',
    notes: 'Accounting profession trending towards gender parity with increasing female membership. Legal and medical professions still male-dominated in senior roles despite growing female entry at junior levels. Platform should address equity and inclusion in content curation.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'market-020',
    tenantId: 'demo-tenant',
    category: 'DEMOGRAPHIC',
    title: 'Target Demographic (2gthr)',
    value: '190K+ professionals aged 25-65',
    source: 'Combined Professional Body Registrations 2025',
    notes: 'Total addressable user base of 190,000+ professionals with active professional body registration across HPCSA, LPC, and SAICA. All require ongoing CPD compliance, creating a natural recurring engagement driver for the platform.',
    metadata: {},
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
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
