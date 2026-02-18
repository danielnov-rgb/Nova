"use client";

interface AstraChatToggleProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AstraChatToggle({ onClick, isOpen }: AstraChatToggleProps) {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      title="Open Astra"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl group-hover:bg-violet-500/30 transition-colors" />

      {/* Button */}
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/25 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </button>
  );
}
