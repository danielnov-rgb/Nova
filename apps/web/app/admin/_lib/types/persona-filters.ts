import {
  Gender,
  AgeRange,
  EducationLevel,
  EmploymentStatus,
  IncomeRange,
  UrbanizationType,
  SmokingStatus,
  TechSavviness,
} from './demographics';

/**
 * Filter options for querying synthetic users
 */
export interface SyntheticUserFilter {
  // Segment
  audienceSegmentId?: string;
  audienceSegmentIds?: string[];

  // Demographics
  ageRange?: AgeRange | AgeRange[];
  ageMin?: number;
  ageMax?: number;
  gender?: Gender | Gender[];

  // Location
  country?: string | string[];
  region?: string | string[];
  city?: string | string[];
  township?: string | string[];
  urbanization?: UrbanizationType | UrbanizationType[];

  // Education & Employment
  educationLevel?: EducationLevel | EducationLevel[];
  employmentStatus?: EmploymentStatus | EmploymentStatus[];
  profession?: string | string[];
  industry?: string | string[];

  // Financial
  incomeRange?: IncomeRange | IncomeRange[];
  monthlyIncomeMin?: number;
  monthlyIncomeMax?: number;

  // Lifestyle
  smokingStatus?: SmokingStatus | SmokingStatus[];
  techSavviness?: TechSavviness | TechSavviness[];

  // Search
  search?: string; // Full-text search across name, bio, profession
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Filter option for dropdowns
 */
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * Available filters with their options
 */
export interface AvailableFilters {
  professions: FilterOption[];
  industries: FilterOption[];
  cities: FilterOption[];
  townships: FilterOption[];
  countries: FilterOption[];
}

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_PAGE = 1;

/**
 * Create an empty filter
 */
export function createEmptyFilter(): SyntheticUserFilter {
  return {};
}

/**
 * Check if filter has any active values
 */
export function hasActiveFilters(filter: SyntheticUserFilter): boolean {
  return Object.values(filter).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.length > 0;
    if (typeof v === 'number') return true;
    return false;
  });
}

/**
 * Count active filters
 */
export function countActiveFilters(filter: SyntheticUserFilter): number {
  let count = 0;
  for (const value of Object.values(filter)) {
    if (Array.isArray(value) && value.length > 0) {
      count++;
    } else if (typeof value === 'string' && value.length > 0) {
      count++;
    } else if (typeof value === 'number') {
      count++;
    }
  }
  return count;
}

/**
 * Apply filter to a list of users (client-side filtering)
 */
import type { SyntheticUser } from './synthetic-user';

export function applyFilter(
  users: SyntheticUser[],
  filter: SyntheticUserFilter
): SyntheticUser[] {
  return users.filter((user) => {
    // Search filter
    if (filter.search) {
      const search = filter.search.toLowerCase();
      const searchable = [
        user.firstName,
        user.lastName,
        user.bio,
        user.profession,
        user.city,
        user.township,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(search)) return false;
    }

    // Age filter
    if (filter.ageMin && user.age < filter.ageMin) return false;
    if (filter.ageMax && user.age > filter.ageMax) return false;
    if (filter.ageRange) {
      const ranges = Array.isArray(filter.ageRange) ? filter.ageRange : [filter.ageRange];
      if (!ranges.includes(user.ageRange)) return false;
    }

    // Gender filter
    if (filter.gender) {
      const genders = Array.isArray(filter.gender) ? filter.gender : [filter.gender];
      if (!genders.includes(user.gender)) return false;
    }

    // Location filters
    if (filter.country) {
      const countries = Array.isArray(filter.country) ? filter.country : [filter.country];
      if (!countries.includes(user.country)) return false;
    }
    if (filter.city) {
      const cities = Array.isArray(filter.city) ? filter.city : [filter.city];
      if (!user.city || !cities.includes(user.city)) return false;
    }
    if (filter.township) {
      const townships = Array.isArray(filter.township) ? filter.township : [filter.township];
      if (!user.township || !townships.includes(user.township)) return false;
    }
    if (filter.urbanization) {
      const types = Array.isArray(filter.urbanization) ? filter.urbanization : [filter.urbanization];
      if (!user.urbanization || !types.includes(user.urbanization)) return false;
    }

    // Education & Employment filters
    if (filter.educationLevel) {
      const levels = Array.isArray(filter.educationLevel)
        ? filter.educationLevel
        : [filter.educationLevel];
      if (!user.educationLevel || !levels.includes(user.educationLevel)) return false;
    }
    if (filter.profession) {
      const professions = Array.isArray(filter.profession) ? filter.profession : [filter.profession];
      if (!user.profession || !professions.some((p) => user.profession?.includes(p))) return false;
    }
    if (filter.industry) {
      const industries = Array.isArray(filter.industry) ? filter.industry : [filter.industry];
      if (!user.industry || !industries.includes(user.industry)) return false;
    }

    // Financial filters
    if (filter.incomeRange) {
      const ranges = Array.isArray(filter.incomeRange) ? filter.incomeRange : [filter.incomeRange];
      if (!user.incomeRange || !ranges.includes(user.incomeRange)) return false;
    }
    if (filter.monthlyIncomeMin && user.monthlyIncome && user.monthlyIncome < filter.monthlyIncomeMin)
      return false;
    if (filter.monthlyIncomeMax && user.monthlyIncome && user.monthlyIncome > filter.monthlyIncomeMax)
      return false;

    // Lifestyle filters
    if (filter.smokingStatus) {
      const statuses = Array.isArray(filter.smokingStatus)
        ? filter.smokingStatus
        : [filter.smokingStatus];
      if (!user.smokingStatus || !statuses.includes(user.smokingStatus)) return false;
    }
    if (filter.techSavviness) {
      const levels = Array.isArray(filter.techSavviness)
        ? filter.techSavviness
        : [filter.techSavviness];
      if (!user.techSavviness || !levels.includes(user.techSavviness)) return false;
    }

    return true;
  });
}

/**
 * Paginate results
 */
export function paginate<T>(
  items: T[],
  options: PaginationOptions
): PaginatedResponse<T> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE } = options;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
