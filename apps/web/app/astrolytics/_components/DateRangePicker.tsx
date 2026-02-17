"use client";

import { useState } from "react";

const presets = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"] as const;

interface DateRangePickerProps {
  className?: string;
}

export function DateRangePicker({ className = "" }: DateRangePickerProps) {
  const [selected, setSelected] = useState<string>(presets[1]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-gray-600 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {selected}
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-gray-800 border border-gray-700 rounded-lg py-1 shadow-xl min-w-[160px]">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => { setSelected(preset); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  selected === preset ? "text-violet-400 bg-violet-500/10" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
