// // src/components/app/common/DesktopFooter.tsx
// "use client";

// import Footer from "@/components/marketing/common/footer/Footer";
// import { useState, useEffect } from "react";

// export default function Wrappedooter() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   if (isMobile) return null;

//   return <Footer />;
// }
// src/components/app/common/DesktopFooter.tsx
"use client";

import Footer from "@/components/marketing/common/footer/Footer";
import { useState, useEffect } from "react";
import styled from "styled-components";

const FooterWrapper = styled.div<{ $isDesktop: boolean }>`
  @media (min-width: 768px) {
    margin-left: ${({ $isDesktop }) => ($isDesktop ? "240px" : "0")};
  }
`;

export default function DesktopFooter() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Only show on desktop (since mobile has bottom nav)
  if (!isDesktop) return null;

  return (
    <FooterWrapper $isDesktop={isDesktop}>
      <Footer />
    </FooterWrapper>
  );
}
