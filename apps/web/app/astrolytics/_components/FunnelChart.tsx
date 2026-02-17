"use client";

import type { FunnelStep } from "../_lib/types";
import { formatNumber } from "../_lib/formatters";

interface FunnelChartProps {
  steps: FunnelStep[];
}

export function FunnelChart({ steps }: FunnelChartProps) {
  const maxCount = steps[0]?.count ?? 1;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const widthPercent = (step.count / maxCount) * 100;
        const prevCount = i > 0 ? steps[i - 1].count : null;
        const dropOffCount = prevCount ? prevCount - step.count : 0;

        return (
          <div key={step.name}>
            {/* Drop-off indicator between steps */}
            {i > 0 && (
              <div className="flex items-center gap-2 ml-4 mb-2 text-xs">
                <svg className="w-3 h-3 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="text-red-400/80">
                  {formatNumber(dropOffCount)} dropped ({step.dropOff.toFixed(1)}%)
                </span>
              </div>
            )}

            {/* Funnel bar */}
            <div className="flex items-center gap-4">
              <div className="w-44 flex-shrink-0 text-right">
                <div className="text-sm font-medium text-white">{step.name}</div>
                <div className="text-xs text-gray-500">{step.medianTime}</div>
              </div>
              <div className="flex-1 relative">
                <div
                  className="h-10 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center transition-all duration-700"
                  style={{ width: `${Math.max(widthPercent, 4)}%`, opacity: 0.2 + (widthPercent / 100) * 0.8 }}
                >
                  <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: `${Math.max(widthPercent, 4)}%` }}>
                    <div className="h-10 w-full rounded-lg bg-gradient-to-r from-primary-500/30 to-cyan-500/30 border border-primary-500/20" />
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm font-semibold text-white">{formatNumber(step.count)}</span>
                  {i > 0 && (
                    <span className="ml-2 text-xs text-gray-400">({step.conversionRate.toFixed(1)}%)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Overall conversion */}
      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-sm text-gray-400">Overall Conversion</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
            {((steps[steps.length - 1].count / steps[0].count) * 100).toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500">
            ({formatNumber(steps[0].count)} → {formatNumber(steps[steps.length - 1].count)})
          </span>
        </div>
      </div>
    </div>
  );
}
