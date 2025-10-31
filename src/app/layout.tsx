// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { AuthProvider } from "@/components/marketing/common/providers/Providers";
import "./globals.css"; // Import your single global CSS here

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

// export const metadata: Metadata = {
//   title: "BarHop - Plan Bar Crawls in Finland",
//   description:
//     "Plan bar crawls, skip lines with VIP passes, and connect with friends across Finland",
// };

export const metadata: Metadata = {
  title: "Hoppr",
  description:
    "Plan bar crawls, skip lines with VIP passes, and connect with friends across Finland",

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>{children}</AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
