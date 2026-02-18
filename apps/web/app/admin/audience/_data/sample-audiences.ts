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
 * Sample audiences for 2gthr professional development platform - South African professional services market
 */
export const sampleAudiences: EnhancedAudience[] = [
  // === EXISTING: Core Member Base ===
  {
    id: 'audience-existing-001',
    tenantId: 'demo-tenant',
    name: 'Core Member Base',
    type: 'EXISTING',
    description:
      'Active members on the 2gthr professional development platform across regulated South African professions.',
    totalSize: 150000,
    segments: [
      {
        name: 'Doctors',
        description:
          'HPCSA-registered medical practitioners primarily engaging through CPD programmes and clinical webinars',
        size: 45000,
        percentage: 30,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 0 },
            { range: '25-34', percentage: 10 },
            { range: '35-44', percentage: 15 },
            { range: '45-54', percentage: 25 },
            { range: '55+', percentage: 50 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 34 },
            { gender: 'Male', percentage: 65 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 3 },
            { range: 'R50K-R80K', percentage: 7 },
            { range: 'R80K-R120K', percentage: 18 },
            { range: 'R120K-R250K', percentage: 42 },
            { range: 'R250K+', percentage: 30 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 28 },
            { location: 'Cape Town', percentage: 28 },
            { location: 'Durban', percentage: 18 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 14 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 0 },
            { level: "Bachelor's", percentage: 5 },
            { level: "Master's+", percentage: 95 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 42 },
            { status: 'Part-time', percentage: 3 },
            { status: 'Self-employed', percentage: 48 },
            { status: 'Semi-retired', percentage: 5 },
            { status: 'Other', percentage: 2 },
          ],
        },
        keyCharacteristics: [
          'HPCSA registered with mandatory CPD requirements',
          'Email-first communication preference',
          'Moderate digital adoption, growing telemedicine usage',
          'High loyalty once onboarded, low churn',
          'Strong peer referral networks within specialities',
        ],
        painPoints: [
          'CPD compliance tracking is fragmented and manual',
          'Limited time for professional development outside practice',
          'Difficulty finding SA-accredited online learning content',
        ],
        goals: [
          'Maintain CPD compliance with minimal administrative burden',
          'Stay current with clinical developments and best practices',
          'Network with peers across specialities and provinces',
        ],
      },
      {
        name: 'Lawyers',
        description:
          'LPC-registered legal practitioners engaging through mandatory CPD, practice management, and legal update content',
        size: 28000,
        percentage: 19,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 0 },
            { range: '25-34', percentage: 10 },
            { range: '35-44', percentage: 15 },
            { range: '45-54', percentage: 30 },
            { range: '55+', percentage: 45 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 41 },
            { gender: 'Male', percentage: 58 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 4 },
            { range: 'R50K-R80K', percentage: 10 },
            { range: 'R80K-R120K', percentage: 22 },
            { range: 'R120K-R250K', percentage: 40 },
            { range: 'R250K+', percentage: 24 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 40 },
            { location: 'Cape Town', percentage: 22 },
            { location: 'Durban', percentage: 14 },
            { location: 'Pretoria', percentage: 15 },
            { location: 'Other', percentage: 9 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 0 },
            { level: "Bachelor's", percentage: 30 },
            { level: "Master's+", percentage: 70 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 38 },
            { status: 'Part-time', percentage: 2 },
            { status: 'Self-employed', percentage: 52 },
            { status: 'Semi-retired', percentage: 6 },
            { status: 'Other', percentage: 2 },
          ],
        },
        keyCharacteristics: [
          'LPC registered with mandatory annual CPD obligations',
          'Conservative digital adoption, prefer in-person events',
          'Highly concentrated in Gauteng (Johannesburg + Pretoria)',
          'Strong brand loyalty and institutional affiliations',
          'Prefer long-form content and structured learning',
        ],
        painPoints: [
          'Keeping up with frequent legislative and regulatory changes',
          'CPD scheduling conflicts with court and client commitments',
          'Lack of practice management and business development training',
        ],
        goals: [
          'CPD compliance with practice-relevant content',
          'Stay ahead of legislative developments affecting clients',
          'Grow practice through professional networking and visibility',
        ],
      },
      {
        name: 'Accountants',
        description:
          'SAICA and SAIPA members engaging through CPD programmes, technical updates, and professional networking',
        size: 47000,
        percentage: 31,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 0 },
            { range: '25-34', percentage: 15 },
            { range: '35-44', percentage: 20 },
            { range: '45-54', percentage: 30 },
            { range: '55+', percentage: 35 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 44 },
            { gender: 'Male', percentage: 55 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 5 },
            { range: 'R50K-R80K', percentage: 14 },
            { range: 'R80K-R120K', percentage: 28 },
            { range: 'R120K-R250K', percentage: 38 },
            { range: 'R250K+', percentage: 15 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 35 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 13 },
            { location: 'Pretoria', percentage: 13 },
            { location: 'Other', percentage: 14 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 2 },
            { level: "Bachelor's", percentage: 38 },
            { level: "Master's+", percentage: 60 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 55 },
            { status: 'Part-time', percentage: 4 },
            { status: 'Self-employed', percentage: 35 },
            { status: 'Semi-retired', percentage: 4 },
            { status: 'Other', percentage: 2 },
          ],
        },
        keyCharacteristics: [
          'SAICA/SAIPA members with structured CPD frameworks',
          'Highest digital adoption among professional segments',
          'Comfortable with online learning and digital tools',
          'Tax season creates predictable engagement dips (July-Nov)',
          'Strong demand for IFRS, tax, and regulatory updates',
        ],
        painPoints: [
          'Constant regulatory changes (IFRS, tax legislation, FICA)',
          'Balancing client deadlines with professional development',
          'Demonstrating CPD compliance across multiple bodies',
        ],
        goals: [
          'Efficient CPD tracking across SAICA and IRBA requirements',
          'Technical upskilling in emerging areas (ESG reporting, digital audit)',
          'Build advisory capabilities beyond compliance work',
        ],
      },
      {
        name: 'Other Professionals',
        description:
          'Engineers, actuaries, architects, and other regulated professionals engaging through cross-disciplinary content',
        size: 30000,
        percentage: 20,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 1 },
            { range: '25-34', percentage: 12 },
            { range: '35-44', percentage: 18 },
            { range: '45-54', percentage: 30 },
            { range: '55+', percentage: 39 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 30 },
            { gender: 'Male', percentage: 69 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 5 },
            { range: 'R50K-R80K', percentage: 12 },
            { range: 'R80K-R120K', percentage: 25 },
            { range: 'R120K-R250K', percentage: 38 },
            { range: 'R250K+', percentage: 20 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 35 },
            { location: 'Cape Town', percentage: 24 },
            { location: 'Durban', percentage: 16 },
            { location: 'Pretoria', percentage: 14 },
            { location: 'Other', percentage: 11 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 1 },
            { level: "Bachelor's", percentage: 32 },
            { level: "Master's+", percentage: 67 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 50 },
            { status: 'Part-time', percentage: 3 },
            { status: 'Self-employed', percentage: 38 },
            { status: 'Semi-retired', percentage: 7 },
            { status: 'Other', percentage: 2 },
          ],
        },
        keyCharacteristics: [
          'Diverse mix of ECSA engineers, ASSA actuaries, and SACAP architects',
          'Profession-specific CPD requirements with varying structures',
          'Strong technical orientation and data-driven mindset',
          'Often employed in large corporates or government',
          'Cross-disciplinary interest in leadership and management content',
        ],
        painPoints: [
          'Limited profession-specific content on generalist platforms',
          'CPD tracking across multiple professional bodies',
          'Professional isolation, especially outside Gauteng',
        ],
        goals: [
          'Access profession-specific CPD and technical content',
          'Develop leadership and management capabilities',
          'Connect with peers across provinces and disciplines',
        ],
      },
    ],
    targets: {
      monthlyActiveUsers: 82500,
      retentionRate: 72,
      nps: 38,
    },
    summaryStats: {
      avgAge: 56,
      avgIncome: 145000,
      topLocations: ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
      growthRate: 2.1,
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === TARGET: New Acquisition Profile ===
  {
    id: 'audience-target-001',
    tenantId: 'demo-tenant',
    name: 'New Acquisition Profile',
    type: 'TARGET',
    description:
      'Younger professional cohort targeted for acquisition over the next 12-18 months to diversify and future-proof the member base.',
    totalSize: 40000,
    segments: [
      {
        name: 'Young Doctors',
        description:
          'Registrars and recently qualified practitioners (under 40) with high digital fluency and mobile-first habits',
        size: 8000,
        percentage: 20,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 5 },
            { range: '25-34', percentage: 55 },
            { range: '35-44', percentage: 38 },
            { range: '45-54', percentage: 2 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 52 },
            { gender: 'Male', percentage: 47 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 18 },
            { range: 'R50K-R80K', percentage: 35 },
            { range: 'R80K-R120K', percentage: 30 },
            { range: 'R120K-R250K', percentage: 15 },
            { range: 'R250K+', percentage: 2 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 32 },
            { location: 'Cape Town', percentage: 26 },
            { location: 'Durban', percentage: 20 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 10 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 0 },
            { level: "Bachelor's", percentage: 15 },
            { level: "Master's+", percentage: 85 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 75 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Self-employed', percentage: 8 },
            { status: 'Student', percentage: 10 },
            { status: 'Other', percentage: 2 },
          ],
        },
        keyCharacteristics: [
          'Registrars and community service doctors transitioning to private practice',
          'High smartphone and app adoption, prefer mobile-first learning',
          'Active on social media and professional platforms',
          'Cost-conscious but value career-relevant content',
          'Building CPD habits early in career',
        ],
        painPoints: [
          'Navigating early-career CPD requirements with limited time',
          'Information overload with no curated pathway',
          'Financial pressure from student loans and registrar salaries',
        ],
        goals: [
          'Build CPD portfolio efficiently from day one',
          'Speciality selection guidance and mentorship',
          'Peer networking with fellow early-career doctors',
        ],
      },
      {
        name: 'Young Lawyers',
        description:
          'Candidate attorneys and junior associates (under 40) seeking career acceleration and practical legal skills',
        size: 6000,
        percentage: 15,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 10 },
            { range: '25-34', percentage: 60 },
            { range: '35-44', percentage: 28 },
            { range: '45-54', percentage: 2 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 55 },
            { gender: 'Male', percentage: 44 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 30 },
            { range: 'R50K-R80K', percentage: 35 },
            { range: 'R80K-R120K', percentage: 25 },
            { range: 'R120K-R250K', percentage: 9 },
            { range: 'R250K+', percentage: 1 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 42 },
            { location: 'Cape Town', percentage: 24 },
            { location: 'Durban', percentage: 15 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 7 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 0 },
            { level: "Bachelor's", percentage: 55 },
            { level: "Master's+", percentage: 45 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 72 },
            { status: 'Part-time', percentage: 3 },
            { status: 'Self-employed', percentage: 5 },
            { status: 'Student', percentage: 15 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'Candidate attorneys completing articles or recently admitted',
          'Strong digital literacy, comfortable with online platforms',
          'Price-sensitive given lower early-career salaries',
          'Seeking practical skills not covered in law school',
          'Motivated by career progression and admission to the Bar',
        ],
        painPoints: [
          'Gap between academic training and practice demands',
          'Long working hours limiting time for professional development',
          'Difficulty building professional reputation and network',
        ],
        goals: [
          'Accelerate career from candidate attorney to associate',
          'Build specialisation knowledge and practical skills',
          'Develop professional network beyond their firm',
        ],
      },
      {
        name: 'Young Accountants',
        description:
          'Trainee CAs and recently qualified accountants in the SAICA pipeline, highly digitally engaged',
        size: 10000,
        percentage: 25,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 15 },
            { range: '25-34', percentage: 58 },
            { range: '35-44', percentage: 25 },
            { range: '45-54', percentage: 2 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 50 },
            { gender: 'Male', percentage: 49 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 25 },
            { range: 'R50K-R80K', percentage: 38 },
            { range: 'R80K-R120K', percentage: 25 },
            { range: 'R120K-R250K', percentage: 10 },
            { range: 'R250K+', percentage: 2 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 40 },
            { location: 'Cape Town', percentage: 22 },
            { location: 'Durban', percentage: 15 },
            { location: 'Pretoria', percentage: 13 },
            { location: 'Other', percentage: 10 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 5 },
            { level: "Bachelor's", percentage: 55 },
            { level: "Master's+", percentage: 40 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 60 },
            { status: 'Part-time', percentage: 3 },
            { status: 'Self-employed', percentage: 5 },
            { status: 'Student', percentage: 28 },
            { status: 'Other', percentage: 4 },
          ],
        },
        keyCharacteristics: [
          'SAICA trainees and recently qualified CAs under 40',
          'Highest digital adoption of all target segments',
          'Heavy use of mobile apps, podcasts, and video content',
          'Embedded in Big 4 and mid-tier firm ecosystems',
          'Value structured learning paths aligned with board exams',
        ],
        painPoints: [
          'Intense exam preparation with limited support resources',
          'Training contract workload leaves little free time',
          'Difficulty differentiating beyond the CA(SA) designation',
        ],
        goals: [
          'Pass board exams and complete SAICA qualification',
          'Build technical depth in high-demand specialisations',
          'Transition from audit into advisory or industry roles',
        ],
      },
      {
        name: 'Tech Professionals',
        description:
          'Software engineers, data scientists, and product managers seeking structured professional development',
        size: 8000,
        percentage: 20,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 12 },
            { range: '25-34', percentage: 50 },
            { range: '35-44', percentage: 30 },
            { range: '45-54', percentage: 8 },
            { range: '55+', percentage: 0 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 28 },
            { gender: 'Male', percentage: 70 },
            { gender: 'Other', percentage: 2 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 12 },
            { range: 'R50K-R80K', percentage: 30 },
            { range: 'R80K-R120K', percentage: 32 },
            { range: 'R120K-R250K', percentage: 22 },
            { range: 'R250K+', percentage: 4 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 38 },
            { location: 'Cape Town', percentage: 32 },
            { location: 'Durban', percentage: 10 },
            { location: 'Pretoria', percentage: 10 },
            { location: 'Other', percentage: 10 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 3 },
            { level: 'Some College', percentage: 12 },
            { level: "Bachelor's", percentage: 55 },
            { level: "Master's+", percentage: 30 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 72 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Self-employed', percentage: 15 },
            { status: 'Student', percentage: 5 },
            { status: 'Other', percentage: 3 },
          ],
        },
        keyCharacteristics: [
          'Digital-native with strong self-directed learning habits',
          'Accustomed to global platforms (Coursera, Udemy, Pluralsight)',
          'Value community, open-source contribution, and peer learning',
          'Cape Town tech hub creates geographic concentration',
          'No mandatory CPD but strong culture of continuous learning',
        ],
        painPoints: [
          'SA-specific tech content is sparse and fragmented',
          'Career progression paths less defined than traditional professions',
          'Isolation in remote/hybrid work environments',
        ],
        goals: [
          'Structured upskilling in AI/ML, cloud, and emerging tech',
          'Build professional network within SA tech ecosystem',
          'Access leadership and management development programmes',
        ],
      },
      {
        name: 'Financial Advisors & Consultants',
        description:
          'Independent financial advisors and management consultants seeking CPD, networking, and business development',
        size: 8000,
        percentage: 20,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 2 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 45 },
            { range: '45-54', percentage: 16 },
            { range: '55+', percentage: 2 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 38 },
            { gender: 'Male', percentage: 61 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 10 },
            { range: 'R50K-R80K', percentage: 25 },
            { range: 'R80K-R120K', percentage: 35 },
            { range: 'R120K-R250K', percentage: 25 },
            { range: 'R250K+', percentage: 5 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 42 },
            { location: 'Cape Town', percentage: 25 },
            { location: 'Durban', percentage: 13 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 8 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 2 },
            { level: 'Some College', percentage: 8 },
            { level: "Bachelor's", percentage: 50 },
            { level: "Master's+", percentage: 40 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 40 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Self-employed', percentage: 50 },
            { status: 'Student', percentage: 2 },
            { status: 'Other', percentage: 3 },
          ],
        },
        keyCharacteristics: [
          'IFAs regulated by FSCA, management consultants unregulated',
          'Commission-based income creates variable engagement patterns',
          'Strong networking orientation and referral-driven business',
          'Value content that helps them serve clients better',
          'Mix of CFP holders, CFA charterholders, and MBA graduates',
        ],
        painPoints: [
          'FAIS Fit & Proper CPD requirements are administratively heavy',
          'Client acquisition is competitive and relationship-dependent',
          'Keeping pace with product and regulatory changes across providers',
        ],
        goals: [
          'Streamline CPD compliance across FSCA and product provider requirements',
          'Grow advisory practice through networking and thought leadership',
          'Develop specialisation in high-net-worth or corporate advisory',
        ],
      },
    ],
    targets: {
      monthlyAcquisition: 3500,
      conversionRate: 12,
      cac: 85,
    },
    summaryStats: {
      avgAge: 33,
      avgIncome: 55000,
      topLocations: ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
    },
    createdAt: '2026-02-09T10:00:00Z',
    updatedAt: '2026-02-09T10:00:00Z',
  },

  // === MARKET: SA Professional Services TAM ===
  {
    id: 'audience-market-001',
    tenantId: 'demo-tenant',
    name: 'SA Professional Services TAM',
    type: 'MARKET',
    description:
      'Total addressable market for professional development services across regulated South African professions.',
    totalSize: 176500,
    segments: [
      {
        name: 'Medical & Health',
        description:
          'HPCSA-registered doctors and allied health professionals including dentists, pharmacists, and physiotherapists',
        size: 48500,
        percentage: 27,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 3 },
            { range: '25-34', percentage: 18 },
            { range: '35-44', percentage: 22 },
            { range: '45-54', percentage: 27 },
            { range: '55+', percentage: 30 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 45 },
            { gender: 'Male', percentage: 54 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 8 },
            { range: 'R50K-R80K', percentage: 15 },
            { range: 'R80K-R120K', percentage: 25 },
            { range: 'R120K-R250K', percentage: 32 },
            { range: 'R250K+', percentage: 20 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 28 },
            { location: 'Cape Town', percentage: 22 },
            { location: 'Durban', percentage: 18 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 20 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 2 },
            { level: "Bachelor's", percentage: 20 },
            { level: "Master's+", percentage: 78 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 48 },
            { status: 'Part-time', percentage: 7 },
            { status: 'Self-employed', percentage: 35 },
            { status: 'Semi-retired', percentage: 5 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'HPCSA registration mandatory for all practitioners',
          'CPD is legally required and tracked by professional boards',
          'Allied health professionals (physios, dietitians) are growing segments',
          'Rural-urban distribution more spread than other professions',
          'Strong institutional purchasing through hospital groups',
        ],
      },
      {
        name: 'Legal',
        description:
          'LPC-registered legal practitioners across all provinces and practice areas',
        size: 28000,
        percentage: 16,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 4 },
            { range: '25-34', percentage: 22 },
            { range: '35-44', percentage: 22 },
            { range: '45-54', percentage: 25 },
            { range: '55+', percentage: 27 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 44 },
            { gender: 'Male', percentage: 55 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 12 },
            { range: 'R50K-R80K', percentage: 18 },
            { range: 'R80K-R120K', percentage: 24 },
            { range: 'R120K-R250K', percentage: 30 },
            { range: 'R250K+', percentage: 16 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 38 },
            { location: 'Cape Town', percentage: 20 },
            { location: 'Durban', percentage: 15 },
            { location: 'Pretoria', percentage: 14 },
            { location: 'Other', percentage: 13 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 0 },
            { level: 'Some College', percentage: 0 },
            { level: "Bachelor's", percentage: 42 },
            { level: "Master's+", percentage: 58 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 42 },
            { status: 'Part-time', percentage: 4 },
            { status: 'Self-employed', percentage: 44 },
            { status: 'Semi-retired', percentage: 5 },
            { status: 'Other', percentage: 5 },
          ],
        },
        keyCharacteristics: [
          'LPC registration required for all practising attorneys and advocates',
          'Mandatory CPD of minimum hours per annum',
          'High concentration of sole practitioners and small firms',
          'Growing transformation mandate is diversifying demographics',
          'Advocacy and litigation specialisations dominate in Gauteng',
        ],
      },
      {
        name: 'Financial & Accounting',
        description:
          'SAICA members, SAIPA members, FSCA-registered financial advisors, and CFA charterholders',
        size: 100000,
        percentage: 57,
        demographics: {
          ageDistribution: [
            { range: '18-24', percentage: 6 },
            { range: '25-34', percentage: 28 },
            { range: '35-44', percentage: 25 },
            { range: '45-54', percentage: 22 },
            { range: '55+', percentage: 19 },
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 42 },
            { gender: 'Male', percentage: 57 },
            { gender: 'Other', percentage: 1 },
          ],
          incomeDistribution: [
            { range: 'Under R50K', percentage: 12 },
            { range: 'R50K-R80K', percentage: 22 },
            { range: 'R80K-R120K', percentage: 28 },
            { range: 'R120K-R250K', percentage: 26 },
            { range: 'R250K+', percentage: 12 },
          ],
          locationDistribution: [
            { location: 'Johannesburg', percentage: 40 },
            { location: 'Cape Town', percentage: 22 },
            { location: 'Durban', percentage: 14 },
            { location: 'Pretoria', percentage: 12 },
            { location: 'Other', percentage: 12 },
          ],
          educationDistribution: [
            { level: 'High School', percentage: 2 },
            { level: 'Some College', percentage: 5 },
            { level: "Bachelor's", percentage: 45 },
            { level: "Master's+", percentage: 48 },
          ],
          employmentDistribution: [
            { status: 'Full-time', percentage: 52 },
            { status: 'Part-time', percentage: 5 },
            { status: 'Self-employed', percentage: 32 },
            { status: 'Semi-retired', percentage: 4 },
            { status: 'Other', percentage: 7 },
          ],
        },
        keyCharacteristics: [
          'Largest professional services segment in SA by headcount',
          'SAICA (~50K), SAIPA (~12K), FSCA advisors (~30K), CFA/other (~8K)',
          'Multiple overlapping CPD obligations across regulatory bodies',
          'Strong employer-funded training culture at Big 4 and mid-tier firms',
          'Growing demand for advisory, ESG, and digital transformation skills',
        ],
      },
    ],
    targets: {
      tam: 176500,
      sam: 120000,
      som: 45000,
    },
    summaryStats: {
      avgAge: 45,
      avgIncome: 95000,
      topLocations: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape'],
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
