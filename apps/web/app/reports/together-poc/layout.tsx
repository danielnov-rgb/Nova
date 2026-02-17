import type { Metadata } from "next";
import { ReportNav } from "./_components/ReportNav";

export const metadata: Metadata = {
  title: "Together POC - Development Velocity Report",
  description: "6-8x acceleration: What takes traditional teams 17-24 weeks, delivered in 3 weeks",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <ReportNav />
      {children}
    </div>
  );
}
