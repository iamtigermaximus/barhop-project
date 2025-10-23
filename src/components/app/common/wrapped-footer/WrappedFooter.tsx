// src/components/app/common/DesktopFooter.tsx
"use client";

import Footer from "@/components/marketing/common/footer/Footer";
import { useState, useEffect } from "react";

export default function Wrappedooter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return <Footer />;
}
