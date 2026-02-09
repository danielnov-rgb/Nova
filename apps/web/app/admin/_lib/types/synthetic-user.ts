import {
  Gender,
  AgeRange,
  EducationLevel,
  EmploymentStatus,
  IncomeRange,
  UrbanizationType,
  MaritalStatus,
  HousingType,
  SmokingStatus,
  AlcoholConsumption,
  ExerciseFrequency,
  TechSavviness,
  DietType,
  StressLevel,
  PrimaryDevice,
  ShoppingPreference,
  ConsciousnessLevel,
  DecisionMakingRole,
  BudgetAuthority,
  CompanySize,
} from './demographics';

/**
 * Full synthetic user persona with all demographic attributes
 */
export interface SyntheticUser {
  id: string;
  tenantId: string;
  audienceSegmentId?: string;

  // === IDENTITY ===
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarSeed?: string; // For consistent avatar generation
  bio?: string;

  // === BASIC DEMOGRAPHICS ===
  age: number;
  ageRange: AgeRange;
  gender: Gender;

  // === PHYSICAL ATTRIBUTES ===
  heightCm?: number;
  weightKg?: number;
  eyeColor?: string;
  hairColor?: string;
  ethnicity?: string;

  // === LOCATION ===
  country: string;
  region?: string; // State/Province
  city?: string;
  township?: string; // For township background
  postalCode?: string;
  urbanization?: UrbanizationType;

  // === EDUCATION ===
  educationLevel?: EducationLevel;
  fieldOfStudy?: string;
  almaMater?: string;
  graduationYear?: number;

  // === EMPLOYMENT ===
  employmentStatus?: EmploymentStatus;
  profession?: string;
  jobTitle?: string;
  industry?: string;
  company?: string;
  yearsInRole?: number;
  yearsInIndustry?: number;
  isRemote?: boolean;

  // === FINANCIAL ===
  incomeRange?: IncomeRange;
  monthlyIncome?: number; // In user's currency
  currency: string;
  netWorth?: string;
  debtLevel?: string;

  // === HOUSEHOLD ===
  maritalStatus?: MaritalStatus;
  householdSize?: number;
  numberOfChildren?: number;
  childrenAges?: number[];
  housingType?: HousingType;
  hasVehicle?: boolean;
  vehicleCount?: number;
  hasPets?: boolean;
  petTypes?: string[];

  // === HEALTH & LIFESTYLE ===
  smokingStatus?: SmokingStatus;
  alcoholConsumption?: AlcoholConsumption;
  exerciseFrequency?: ExerciseFrequency;
  dietType?: DietType;
  hasChronicConditions?: boolean;
  chronicConditions?: string[];
  sleepHours?: number;
  stressLevel?: StressLevel;

  // === TECHNOLOGY ===
  techSavviness?: TechSavviness;
  primaryDevice?: PrimaryDevice;
  socialPlatforms?: string[];
  screenTimeHours?: number;

  // === INTERESTS & PERSONALITY ===
  hobbies?: string[];
  interests?: string[];
  values?: string[];
  personalityTraits?: string[];
  mbtiType?: string;

  // === PURCHASING BEHAVIOR ===
  shoppingPreference?: ShoppingPreference;
  priceConsciousness?: ConsciousnessLevel;
  brandLoyalty?: ConsciousnessLevel;
  monthlyDiscretionary?: number;

  // === B2B SPECIFIC ===
  decisionMakingRole?: DecisionMakingRole;
  budgetAuthority?: BudgetAuthority;
  companySize?: CompanySize;

  // === CUSTOM ATTRIBUTES ===
  customAttributes?: Record<string, unknown>;

  // === METADATA ===
  generationBatchId?: string;
  generatedAt: string;
  qualityScore?: number; // 0-1, how well it matches distributions
  createdAt: string;
  updatedAt: string;
}

/**
 * Preview card view - minimal data for grid display
 */
export interface SyntheticUserPreview {
  id: string;
  firstName: string;
  lastName: string;
  avatarSeed?: string;
  age: number;
  gender: Gender;
  profession?: string;
  city?: string;
  country: string;
  incomeRange?: IncomeRange;
}

/**
 * Modal summary view - medium detail
 */
export interface SyntheticUserSummary extends SyntheticUserPreview {
  bio?: string;
  educationLevel?: EducationLevel;
  employmentStatus?: EmploymentStatus;
  maritalStatus?: MaritalStatus;
  urbanization?: UrbanizationType;
  smokingStatus?: SmokingStatus;
  techSavviness?: TechSavviness;
  interests?: string[];
  audienceSegmentId?: string;
  township?: string;
  industry?: string;
  monthlyIncome?: number;
  currency?: string;
}

/**
 * Helper to convert full user to preview
 */
export function toPreview(user: SyntheticUser): SyntheticUserPreview {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarSeed: user.avatarSeed,
    age: user.age,
    gender: user.gender,
    profession: user.profession,
    city: user.city,
    country: user.country,
    incomeRange: user.incomeRange,
  };
}

/**
 * Helper to convert full user to summary
 */
export function toSummary(user: SyntheticUser): SyntheticUserSummary {
  return {
    ...toPreview(user),
    bio: user.bio,
    educationLevel: user.educationLevel,
    employmentStatus: user.employmentStatus,
    maritalStatus: user.maritalStatus,
    urbanization: user.urbanization,
    smokingStatus: user.smokingStatus,
    techSavviness: user.techSavviness,
    interests: user.interests,
    audienceSegmentId: user.audienceSegmentId,
    township: user.township,
    industry: user.industry,
    monthlyIncome: user.monthlyIncome,
    currency: user.currency,
  };
}

/**
 * Get age range from numeric age
 */
export function getAgeRange(age: number): AgeRange {
  if (age < 25) return 'RANGE_18_24';
  if (age < 35) return 'RANGE_25_34';
  if (age < 45) return 'RANGE_35_44';
  if (age < 55) return 'RANGE_45_54';
  if (age < 65) return 'RANGE_55_64';
  return 'RANGE_65_PLUS';
}
