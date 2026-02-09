'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { samplePersonas } from '../../_data/sample-personas';
import { getDemographicLabel } from '../../../_lib/types/demographics';

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
 * Section component for organizing persona data
 */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/**
 * Data row component
 */
function DataRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

/**
 * Chip component for tags
 */
function Chip({
  children,
  color = 'primary',
}: {
  children: React.ReactNode;
  color?: 'primary' | 'gray' | 'green' | 'blue';
}) {
  const colorClasses = {
    primary:
      'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}

export default function PersonaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personaId = params.id as string;

  // Find persona from sample data
  const persona = samplePersonas.find((p) => p.id === personaId);

  if (!persona) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Persona not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The persona you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/audience/personas"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${persona.firstName} ${persona.lastName}`;
  const avatarUrl = getAvatarUrl(persona.avatarSeed, fullName);
  const location = [persona.township, persona.city, persona.region, persona.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back button and breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href="/admin/audience/personas"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Persona Library
                </Link>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {fullName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {fullName}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
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
                <p className="text-gray-600 dark:text-gray-300 mt-4">{persona.bio}</p>
              )}
              {persona.qualityScore && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {Math.round(persona.qualityScore * 100)}% Quality Score
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Demographics */}
          <Section
            title="Demographics"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <DataRow label="Age" value={`${persona.age} years`} />
            <DataRow label="Age Range" value={getDemographicLabel('ageRange', persona.ageRange)} />
            <DataRow label="Gender" value={getDemographicLabel('gender', persona.gender)} />
            <DataRow label="Ethnicity" value={persona.ethnicity} />
            {persona.heightCm && <DataRow label="Height" value={`${persona.heightCm} cm`} />}
            {persona.weightKg && <DataRow label="Weight" value={`${persona.weightKg} kg`} />}
            <DataRow label="Eye Color" value={persona.eyeColor} />
            <DataRow label="Hair Color" value={persona.hairColor} />
          </Section>

          {/* Location */}
          <Section
            title="Location"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <DataRow label="Country" value={persona.country} />
            <DataRow label="Region/Province" value={persona.region} />
            <DataRow label="City" value={persona.city} />
            {persona.township && (
              <DataRow label="Township" value={persona.township} />
            )}
            <DataRow label="Urbanization" value={persona.urbanization ? getDemographicLabel('urbanization', persona.urbanization) : undefined} />
          </Section>

          {/* Education */}
          <Section
            title="Education"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            }
          >
            <DataRow label="Education Level" value={persona.educationLevel ? getDemographicLabel('educationLevel', persona.educationLevel) : undefined} />
            <DataRow label="Field of Study" value={persona.fieldOfStudy} />
            <DataRow label="Alma Mater" value={persona.almaMater} />
            <DataRow label="Graduation Year" value={persona.graduationYear} />
          </Section>

          {/* Employment */}
          <Section
            title="Employment"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            <DataRow label="Status" value={persona.employmentStatus ? getDemographicLabel('employmentStatus', persona.employmentStatus) : undefined} />
            <DataRow label="Profession" value={persona.profession} />
            <DataRow label="Job Title" value={persona.jobTitle} />
            <DataRow label="Industry" value={persona.industry} />
            <DataRow label="Company" value={persona.company} />
            <DataRow label="Years in Role" value={persona.yearsInRole} />
            <DataRow label="Years in Industry" value={persona.yearsInIndustry} />
            <DataRow label="Remote Worker" value={persona.isRemote ? 'Yes' : persona.isRemote === false ? 'No' : undefined} />
          </Section>

          {/* Financial */}
          <Section
            title="Financial"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <DataRow label="Income Range" value={persona.incomeRange ? getDemographicLabel('incomeRange', persona.incomeRange) : undefined} />
            <DataRow label="Monthly Income" value={formatCurrency(persona.monthlyIncome, persona.currency)} />
            <DataRow label="Currency" value={persona.currency} />
          </Section>

          {/* Household */}
          <Section
            title="Household"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          >
            <DataRow label="Marital Status" value={persona.maritalStatus ? getDemographicLabel('maritalStatus', persona.maritalStatus) : undefined} />
            <DataRow label="Household Size" value={persona.householdSize} />
            <DataRow label="Number of Children" value={persona.numberOfChildren} />
            {persona.childrenAges && persona.childrenAges.length > 0 && (
              <DataRow label="Children Ages" value={persona.childrenAges.join(', ')} />
            )}
            <DataRow label="Housing Type" value={persona.housingType ? getDemographicLabel('housingType', persona.housingType) : undefined} />
            <DataRow label="Has Vehicle" value={persona.hasVehicle ? `Yes (${persona.vehicleCount})` : persona.hasVehicle === false ? 'No' : undefined} />
            <DataRow label="Has Pets" value={persona.hasPets ? `Yes (${persona.petTypes?.join(', ')})` : persona.hasPets === false ? 'No' : undefined} />
          </Section>

          {/* Health & Lifestyle */}
          <Section
            title="Health & Lifestyle"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          >
            <DataRow label="Smoking Status" value={persona.smokingStatus ? getDemographicLabel('smokingStatus', persona.smokingStatus) : undefined} />
            <DataRow label="Alcohol Consumption" value={persona.alcoholConsumption ? getDemographicLabel('alcoholConsumption', persona.alcoholConsumption) : undefined} />
            <DataRow label="Exercise Frequency" value={persona.exerciseFrequency ? getDemographicLabel('exerciseFrequency', persona.exerciseFrequency) : undefined} />
            <DataRow label="Diet Type" value={persona.dietType} />
            <DataRow label="Sleep Hours" value={persona.sleepHours ? `${persona.sleepHours} hours` : undefined} />
            <DataRow label="Stress Level" value={persona.stressLevel ? getDemographicLabel('stressLevel', persona.stressLevel) : undefined} />
            {persona.hasChronicConditions && persona.chronicConditions && (
              <DataRow label="Chronic Conditions" value={persona.chronicConditions.join(', ')} />
            )}
          </Section>

          {/* Technology */}
          <Section
            title="Technology"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            <DataRow label="Tech Savviness" value={persona.techSavviness ? getDemographicLabel('techSavviness', persona.techSavviness) : undefined} />
            <DataRow label="Primary Device" value={persona.primaryDevice} />
            <DataRow label="Screen Time" value={persona.screenTimeHours ? `${persona.screenTimeHours} hours/day` : undefined} />
            {persona.socialPlatforms && persona.socialPlatforms.length > 0 && (
              <div className="py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
                  Social Platforms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {persona.socialPlatforms.map((platform) => (
                    <Chip key={platform} color="blue">
                      {platform}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Interests & Personality - Full width */}
          <div className="lg:col-span-2">
            <Section
              title="Interests & Personality"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {persona.interests && persona.interests.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Interests
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.interests.map((interest) => (
                        <Chip key={interest} color="primary">
                          {interest}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                {persona.hobbies && persona.hobbies.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Hobbies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.hobbies.map((hobby) => (
                        <Chip key={hobby} color="gray">
                          {hobby}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                {persona.values && persona.values.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Values
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.values.map((value) => (
                        <Chip key={value} color="green">
                          {value}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                {persona.mbtiType && (
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      MBTI Type
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
                      {persona.mbtiType}
                    </span>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* Purchasing Behavior */}
          <Section
            title="Purchasing Behavior"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          >
            <DataRow label="Shopping Preference" value={persona.shoppingPreference} />
            <DataRow label="Price Consciousness" value={persona.priceConsciousness} />
            <DataRow label="Brand Loyalty" value={persona.brandLoyalty} />
          </Section>

          {/* B2B Context */}
          {(persona.decisionMakingRole || persona.budgetAuthority || persona.companySize) && (
            <Section
              title="B2B Context"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            >
              <DataRow label="Decision Making Role" value={persona.decisionMakingRole} />
              <DataRow label="Budget Authority" value={persona.budgetAuthority} />
              <DataRow label="Company Size" value={persona.companySize} />
            </Section>
          )}
        </div>

        {/* Metadata footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <span>ID: {persona.id}</span>
            <span>Generated: {new Date(persona.generatedAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(persona.updatedAt).toLocaleDateString()}</span>
            {persona.generationBatchId && <span>Batch: {persona.generationBatchId}</span>}
          </div>
        </div>
      </main>
    </div>
  );
}
