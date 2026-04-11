import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
