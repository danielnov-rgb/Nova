import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Together POC - Development Velocity Report",
  description: "8-11x acceleration: What takes traditional teams 18-20 weeks, delivered in 3 weeks",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      {/* Standalone layout - no navigation */}
      {children}
    </div>
  );
}
