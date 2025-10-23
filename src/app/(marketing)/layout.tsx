// src/app/(marketing)/layout.tsx
import Navbar from "@/components/marketing/common/navbar/Navbar";
import Footer from "@/components/marketing/common/footer/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketing-layout">
      <Navbar />
      <main style={{ margin: 0, padding: 0, minHeight: "100vh" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
