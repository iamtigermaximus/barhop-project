// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar/Navbar";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/providers/Providers";
import Footer from "@/components/common/footer/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BarHop - Plan Bar Crawls in Finland",
  description:
    "Plan bar crawls, skip lines with VIP passes, and connect with friends across Finland",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body
        style={{
          background: "#0f172a",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          fontFamily: "var(--font-inter), sans-serif",
          color: "white", // Add this to make text visible
        }}
      >
        <StyledComponentsRegistry>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
