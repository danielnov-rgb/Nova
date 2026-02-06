import { SalesLayout } from "../_components/sales/SalesLayout";

export default function SalesRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SalesLayout>{children}</SalesLayout>;
}
