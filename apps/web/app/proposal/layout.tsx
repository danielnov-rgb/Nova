import type { Metadata } from "next";
import { ProposalShell } from "./_components/ProposalShell";

export const metadata: Metadata = {
  title: "Nova — Forward Deployed Team Proposal",
  description: "Forward Deployed Product Intelligence Team proposal for 2gthr Path Differentiation Acceleration",
};

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return <ProposalShell>{children}</ProposalShell>;
}
