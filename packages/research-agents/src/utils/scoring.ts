import { Evidence } from "../types";
import { freshnessDays } from "./time";

export function scoreConfidence(evidence: Evidence[]): number {
  if (evidence.length === 0) return 0.2;
  const avgRelevance =
    evidence.reduce((sum, item) => sum + item.relevanceScore, 0) / evidence.length;
  const normalized = Math.min(1, Math.max(0.2, avgRelevance));
  return Number(normalized.toFixed(2));
}

export function scoreFreshnessFromEvidence(evidence: Evidence[]): number {
  if (evidence.length === 0) return 90;
  const days = evidence.map((item) => freshnessDays(item.source.collectedAt));
  const avg = days.reduce((sum, value) => sum + value, 0) / days.length;
  return Math.round(avg);
}
