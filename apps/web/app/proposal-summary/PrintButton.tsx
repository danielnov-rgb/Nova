"use client";

export function PrintButton() {
  return (
    <div className="no-print mt-8 text-center">
      <button
        onClick={() => window.print()}
        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
