"use client";

import { useEffect, type ReactNode } from "react";
import { initPostHog } from "../_lib/posthog";
import { AuthGate } from "./AuthGate";
import { ThemeProvider } from "./ThemeProvider";

interface ProposalShellProps {
  children: ReactNode;
}

export function ProposalShell({ children }: ProposalShellProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-950 text-white antialiased">
        <AuthGate>{children}</AuthGate>
      </div>
    </ThemeProvider>
  );
}
