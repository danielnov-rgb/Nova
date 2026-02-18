import type { Metadata } from "next";
import { ShowcaseShell } from "./_components/ShowcaseShell";

export const metadata: Metadata = {
  title: "Nova — AI-Powered Product Intelligence",
  description: "Leadership Knowledge Pack: How Nova accelerates product development by 6-8x",
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <ShowcaseShell>{children}</ShowcaseShell>;
}
