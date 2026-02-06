import { SalesNav } from "./SalesNav";
import { SalesFooter } from "./SalesFooter";

interface SalesLayoutProps {
  children: React.ReactNode;
}

export function SalesLayout({ children }: SalesLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SalesNav />
      {/* Add padding-top to account for fixed nav */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      <SalesFooter />
    </div>
  );
}
