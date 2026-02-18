"use client";

import { ThemeProvider } from "./ThemeProvider";
import { Sidebar } from "./Sidebar";

export function AstrolyticsShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
