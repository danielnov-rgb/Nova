'use client';

import { SyntheticUser, SyntheticUserPreview } from '../../_lib/types/synthetic-user';
import { demographicLabels, getDemographicLabel } from '../../_lib/types/demographics';

interface PersonaCardProps {
  persona: SyntheticUser | SyntheticUserPreview;
  onClick?: () => void;
}

/**
 * Generate a consistent avatar URL based on seed
 */
function getAvatarUrl(seed?: string, name?: string): string {
  // Using DiceBear API for consistent avatars
  const identifier = seed || name || 'default';
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(identifier)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Format income range for display
 */
function formatIncome(incomeRange?: string): string | null {
  if (!incomeRange) return null;
  return demographicLabels.incomeRange?.[incomeRange] || incomeRange;
}

/**
 * Get gender icon
 */
function getGenderIcon(gender: string): string {
  switch (gender) {
    case 'MALE':
      return '♂';
    case 'FEMALE':
      return '♀';
    default:
      return '⚥';
  }
}

export default function PersonaCard({ persona, onClick }: PersonaCardProps) {
  const fullName = `${persona.firstName} ${persona.lastName}`;
  const avatarUrl = getAvatarUrl(persona.avatarSeed, fullName);
  const incomeLabel = formatIncome(persona.incomeRange);
  const genderIcon = getGenderIcon(persona.gender);
  const genderLabel = getDemographicLabel('gender', persona.gender);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer"
    >
      {/* Avatar and basic info */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700"
          />
          {/* Gender indicator */}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs">
            {genderIcon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {fullName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {persona.age} years old, {genderLabel}
          </p>
        </div>
      </div>

      {/* Profession and location */}
      <div className="mt-3 space-y-1">
        {persona.profession && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {persona.profession}
          </p>
        )}
        {persona.city && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {persona.city}, {persona.country}
          </p>
        )}
      </div>

      {/* Quick attributes */}
      {incomeLabel && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {incomeLabel}
          </span>
        </div>
      )}

      {/* Hover indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-4 h-4 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>
    </div>
  );
}
