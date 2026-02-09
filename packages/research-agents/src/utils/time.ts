export function toIsoString(date: Date): string {
  return date.toISOString();
}

export function daysBetween(later: Date, earlier: Date): number {
  const ms = later.getTime() - earlier.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function freshnessDays(publishedAt?: string, fallbackDays = 90): number {
  if (!publishedAt) return fallbackDays;
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return fallbackDays;
  return daysBetween(new Date(), published);
}
