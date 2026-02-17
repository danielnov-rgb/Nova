"use client";

import { useEffect, type ReactNode } from "react";
import { initPostHog } from "../_lib/posthog";
import { AuthGate } from "./AuthGate";

interface ProposalShellProps {
  children: ReactNode;
}

export function ProposalShell({ children }: ProposalShellProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <AuthGate>{children}</AuthGate>
    </div>
  );
}
