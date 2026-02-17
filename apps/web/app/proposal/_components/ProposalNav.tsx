"use client";

import { useTheme } from "./ThemeProvider";

export function ProposalNav() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left — Overview */}
          <button
            onClick={() => {
              const el = document.getElementById("overview");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex items-center gap-3"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-[9px] font-bold" style={{ color: "#fff" }}>N</span>
            </div>
            <span className="text-sm font-medium text-white">Overview</span>
          </button>

          {/* Right — Segmented Light/Dark toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-800/50">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                theme === "light"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                theme === "dark"
                  ? "bg-gray-700 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              Dark
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
