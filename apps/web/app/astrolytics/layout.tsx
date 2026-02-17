import type { Metadata } from "next";
import { AstrolyticsShell } from "./_components/AstrolyticsShell";

export const metadata: Metadata = {
  title: "Astrolytics | Product Analytics",
  description: "White-labeled product analytics powered by Nova",
};

export default function AstrolyticsLayout({ children }: { children: React.ReactNode }) {
  return <AstrolyticsShell>{children}</AstrolyticsShell>;
}
