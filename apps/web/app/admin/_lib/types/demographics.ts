// === DEMOGRAPHIC ENUMS ===

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type AgeRange =
  | 'RANGE_18_24'
  | 'RANGE_25_34'
  | 'RANGE_35_44'
  | 'RANGE_45_54'
  | 'RANGE_55_64'
  | 'RANGE_65_PLUS';

export type EducationLevel =
  | 'NO_FORMAL_EDUCATION'
  | 'HIGH_SCHOOL'
  | 'VOCATIONAL'
  | 'SOME_COLLEGE'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE'
  | 'PROFESSIONAL';

export type EmploymentStatus =
  | 'EMPLOYED_FULL_TIME'
  | 'EMPLOYED_PART_TIME'
  | 'SELF_EMPLOYED'
  | 'FREELANCE'
  | 'UNEMPLOYED'
  | 'STUDENT'
  | 'RETIRED'
  | 'HOMEMAKER'
  | 'UNABLE_TO_WORK';

export type IncomeRange =
  | 'UNDER_25K'
  | 'RANGE_25K_50K'
  | 'RANGE_50K_75K'
  | 'RANGE_75K_100K'
  | 'RANGE_100K_150K'
  | 'RANGE_150K_200K'
  | 'RANGE_200K_300K'
  | 'OVER_300K';

export type UrbanizationType =
  | 'URBAN_MAJOR_CITY'
  | 'URBAN_SMALL_CITY'
  | 'SUBURBAN'
  | 'RURAL_TOWN'
  | 'RURAL_REMOTE';

export type MaritalStatus =
  | 'SINGLE'
  | 'MARRIED'
  | 'DOMESTIC_PARTNERSHIP'
  | 'DIVORCED'
  | 'WIDOWED'
  | 'SEPARATED';

export type HousingType =
  | 'OWN_HOUSE'
  | 'OWN_APARTMENT'
  | 'RENT_HOUSE'
  | 'RENT_APARTMENT'
  | 'LIVE_WITH_FAMILY'
  | 'STUDENT_HOUSING'
  | 'OTHER';

export type SmokingStatus = 'NEVER' | 'FORMER' | 'OCCASIONAL' | 'REGULAR' | 'HEAVY';

export type AlcoholConsumption = 'NEVER' | 'RARELY' | 'SOCIAL' | 'MODERATE' | 'FREQUENT';

export type ExerciseFrequency = 'NEVER' | 'RARELY' | 'ONCE_WEEK' | 'FEW_TIMES_WEEK' | 'DAILY';

export type TechSavviness = 'NOVICE' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type DietType =
  | 'OMNIVORE'
  | 'PESCATARIAN'
  | 'VEGETARIAN'
  | 'VEGAN'
  | 'KETO'
  | 'PALEO'
  | 'HALAL'
  | 'KOSHER'
  | 'OTHER';

export type StressLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export type PrimaryDevice = 'MOBILE' | 'DESKTOP' | 'TABLET';

export type ShoppingPreference = 'ONLINE' | 'IN_STORE' | 'MIXED';

export type ConsciousnessLevel = 'LOW' | 'MODERATE' | 'HIGH';

export type DecisionMakingRole = 'DECISION_MAKER' | 'INFLUENCER' | 'USER' | 'GATEKEEPER';

export type BudgetAuthority = 'NONE' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNLIMITED';

export type CompanySize = 'STARTUP' | 'SMB' | 'MIDMARKET' | 'ENTERPRISE';

// Distribution type for segment-level percentages
export type Distribution<T extends string = string> = Partial<Record<T, number>>;

// Helper to get display label for enum values
export const demographicLabels: Record<string, Record<string, string>> = {
  gender: {
    MALE: 'Male',
    FEMALE: 'Female',
    NON_BINARY: 'Non-binary',
    OTHER: 'Other',
    PREFER_NOT_TO_SAY: 'Prefer not to say',
  },
  ageRange: {
    RANGE_18_24: '18-24',
    RANGE_25_34: '25-34',
    RANGE_35_44: '35-44',
    RANGE_45_54: '45-54',
    RANGE_55_64: '55-64',
    RANGE_65_PLUS: '65+',
  },
  educationLevel: {
    NO_FORMAL_EDUCATION: 'No formal education',
    HIGH_SCHOOL: 'High school',
    VOCATIONAL: 'Vocational/Trade',
    SOME_COLLEGE: 'Some college',
    BACHELORS: "Bachelor's degree",
    MASTERS: "Master's degree",
    DOCTORATE: 'Doctorate (PhD)',
    PROFESSIONAL: 'Professional (MD, JD, etc.)',
  },
  employmentStatus: {
    EMPLOYED_FULL_TIME: 'Full-time employee',
    EMPLOYED_PART_TIME: 'Part-time employee',
    SELF_EMPLOYED: 'Self-employed',
    FREELANCE: 'Freelancer',
    UNEMPLOYED: 'Unemployed',
    STUDENT: 'Student',
    RETIRED: 'Retired',
    HOMEMAKER: 'Homemaker',
    UNABLE_TO_WORK: 'Unable to work',
  },
  incomeRange: {
    UNDER_25K: 'Under R25,000',
    RANGE_25K_50K: 'R25,000 - R50,000',
    RANGE_50K_75K: 'R50,000 - R75,000',
    RANGE_75K_100K: 'R75,000 - R100,000',
    RANGE_100K_150K: 'R100,000 - R150,000',
    RANGE_150K_200K: 'R150,000 - R200,000',
    RANGE_200K_300K: 'R200,000 - R300,000',
    OVER_300K: 'Over R300,000',
  },
  urbanization: {
    URBAN_MAJOR_CITY: 'Major city',
    URBAN_SMALL_CITY: 'Small city',
    SUBURBAN: 'Suburban',
    RURAL_TOWN: 'Rural town',
    RURAL_REMOTE: 'Remote/Rural',
  },
  maritalStatus: {
    SINGLE: 'Single',
    MARRIED: 'Married',
    DOMESTIC_PARTNERSHIP: 'Domestic partnership',
    DIVORCED: 'Divorced',
    WIDOWED: 'Widowed',
    SEPARATED: 'Separated',
  },
  housingType: {
    OWN_HOUSE: 'Own house',
    OWN_APARTMENT: 'Own apartment',
    RENT_HOUSE: 'Rent house',
    RENT_APARTMENT: 'Rent apartment',
    LIVE_WITH_FAMILY: 'Live with family',
    STUDENT_HOUSING: 'Student housing',
    OTHER: 'Other',
  },
  smokingStatus: {
    NEVER: 'Never smoked',
    FORMER: 'Former smoker',
    OCCASIONAL: 'Occasional smoker',
    REGULAR: 'Regular smoker',
    HEAVY: 'Heavy smoker',
  },
  alcoholConsumption: {
    NEVER: 'Never',
    RARELY: 'Rarely',
    SOCIAL: 'Socially',
    MODERATE: 'Moderately',
    FREQUENT: 'Frequently',
  },
  exerciseFrequency: {
    NEVER: 'Never',
    RARELY: 'Rarely',
    ONCE_WEEK: 'Once a week',
    FEW_TIMES_WEEK: 'Few times a week',
    DAILY: 'Daily',
  },
  techSavviness: {
    NOVICE: 'Novice',
    BASIC: 'Basic',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
  },
  stressLevel: {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    VERY_HIGH: 'Very high',
  },
};

// Helper function to get label for any demographic value
export function getDemographicLabel(category: string, value: string): string {
  return demographicLabels[category]?.[value] || value;
}
