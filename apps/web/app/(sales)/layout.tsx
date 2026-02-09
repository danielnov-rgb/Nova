import { SalesLayout } from "../_components/sales/SalesLayout";
import { SplashScreen } from "../_components/shared/SplashScreen";

export default function SalesRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SplashScreen />
      <SalesLayout>{children}</SalesLayout>
    </>
  );
}
