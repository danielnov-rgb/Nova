'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SyntheticUser } from '../../_lib/types/synthetic-user';
import { getDemographicLabel } from '../../_lib/types/demographics';

interface PersonaModalProps {
  persona: SyntheticUser;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Generate a consistent avatar URL based on seed
 */
function getAvatarUrl(seed?: string, name?: string): string {
  const identifier = seed || name || 'default';
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(identifier)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Format currency value
 */
function formatCurrency(value?: number, currency?: string): string {
  if (!value) return '—';
  const currencySymbol = currency === 'ZAR' ? 'R' : '$';
  return `${currencySymbol}${value.toLocaleString()}`;
}

/**
 * Info card component for displaying key-value pairs
 */
function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
        {icon}
        {label}
      </div>
      <div className="font-medium text-gray-900 dark:text-white text-sm">
        {value}
      </div>
    </div>
  );
}

/**
 * Chip component for tags/interests
 */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
      {children}
    </span>
  );
}

export default function PersonaModal({
  persona,
  isOpen,
  onClose,
}: PersonaModalProps) {
  const router = useRouter();
  const fullName = `${persona.firstName} ${persona.lastName}`;
  const avatarUrl = getAvatarUrl(persona.avatarSeed, fullName);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const location = [persona.township, persona.city, persona.region, persona.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-5">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {fullName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {persona.profession}
                  {persona.industry && ` • ${persona.industry}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
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
                  {location}
                </p>
                {persona.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                    {persona.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Key stats grid */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard
                label="Age"
                value={`${persona.age} years`}
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />
              <InfoCard
                label="Education"
                value={
                  persona.educationLevel
                    ? getDemographicLabel('educationLevel', persona.educationLevel)
                    : undefined
                }
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                }
              />
              <InfoCard
                label="Monthly Income"
                value={formatCurrency(persona.monthlyIncome, persona.currency)}
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <InfoCard
                label="Marital Status"
                value={
                  persona.maritalStatus
                    ? getDemographicLabel('maritalStatus', persona.maritalStatus)
                    : undefined
                }
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                }
              />
              <InfoCard
                label="Urbanization"
                value={
                  persona.urbanization
                    ? getDemographicLabel('urbanization', persona.urbanization)
                    : undefined
                }
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
              />
              <InfoCard
                label="Tech Savviness"
                value={
                  persona.techSavviness
                    ? getDemographicLabel('techSavviness', persona.techSavviness)
                    : undefined
                }
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Lifestyle indicators */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Lifestyle
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {persona.smokingStatus && (
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-2xl mb-1">
                    {persona.smokingStatus === 'NEVER' ? '🚭' : '🚬'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getDemographicLabel('smokingStatus', persona.smokingStatus)}
                  </div>
                </div>
              )}
              {persona.exerciseFrequency && (
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-2xl mb-1">🏃</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getDemographicLabel('exerciseFrequency', persona.exerciseFrequency)}
                  </div>
                </div>
              )}
              {persona.alcoholConsumption && (
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-2xl mb-1">🍷</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getDemographicLabel('alcoholConsumption', persona.alcoholConsumption)}
                  </div>
                </div>
              )}
              {persona.stressLevel && (
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-2xl mb-1">
                    {persona.stressLevel === 'LOW'
                      ? '😌'
                      : persona.stressLevel === 'MODERATE'
                        ? '😐'
                        : persona.stressLevel === 'HIGH'
                          ? '😰'
                          : '😫'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getDemographicLabel('stressLevel', persona.stressLevel)} stress
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          {persona.interests && persona.interests.length > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.interests.map((interest) => (
                  <Chip key={interest}>{interest}</Chip>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {persona.hobbies && persona.hobbies.length > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Hobbies
              </h3>
              <div className="flex flex-wrap gap-2">
                {persona.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer with view full profile button */}
          <div className="p-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => router.push(`/admin/audience/personas/${persona.id}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
            >
              View Full Profile
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
