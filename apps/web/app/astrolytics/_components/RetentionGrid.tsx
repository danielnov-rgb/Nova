"use client";

import type { RetentionCohort } from "../_lib/types";
import { formatNumber } from "../_lib/formatters";

interface RetentionGridProps {
  cohorts: RetentionCohort[];
}

function getCellColor(value: number): string {
  if (value === 0) return "transparent";
  if (value >= 80) return "rgba(14, 165, 233, 0.7)";  // primary-500
  if (value >= 60) return "rgba(14, 165, 233, 0.55)";
  if (value >= 40) return "rgba(14, 165, 233, 0.4)";
  if (value >= 30) return "rgba(14, 165, 233, 0.3)";
  if (value >= 20) return "rgba(14, 165, 233, 0.2)";
  return "rgba(14, 165, 233, 0.1)";
}

export function RetentionGrid({ cohorts }: RetentionGridProps) {
  const maxDays = Math.max(...cohorts.map((c) => c.retention.length));
  const dayHeaders = Array.from({ length: maxDays }, (_, i) =>
    i === 0 ? "Day 0" : `Day ${i * 7}`
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cohort
            </th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Users
            </th>
            {dayHeaders.map((header) => (
              <th
                key={header}
                className="text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => (
            <tr key={cohort.period} className="border-b border-gray-800/50">
              <td className="py-2 px-3 text-sm font-medium text-white whitespace-nowrap">
                {cohort.period}
              </td>
              <td className="py-2 px-3 text-sm text-gray-400">
                {formatNumber(cohort.totalUsers)}
              </td>
              {cohort.retention.map((value, i) => (
                <td key={i} className="py-2 px-2 text-center">
                  {value > 0 ? (
                    <div
                      className="inline-flex items-center justify-center w-14 h-8 rounded-md text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: getCellColor(value),
                        color: value >= 40 ? "#fff" : value > 0 ? "#e2e8f0" : "transparent",
                      }}
                    >
                      {value.toFixed(0)}%
                    </div>
                  ) : (
                    <div className="w-14 h-8" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
