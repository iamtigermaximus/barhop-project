// components/common/Footer.tsx
"use client";
import styled from "styled-components";
import Link from "next/link";

const FooterContainer = styled.footer`
  /* background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(15, 23, 42),
    rgb(9, 9, 11),
    rgb(15, 23, 42)
  ); */
  background-color: transparent !important;
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  padding: 3rem 1rem 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);

  @media (min-width: 768px) {
    padding: 4rem 2rem 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    text-align: left;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 640px) {
    align-items: flex-start;
    grid-column: 1 / -1;
  }

  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`;

const FooterLogo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
`;

const FooterDescription = styled.p`
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 100%;

  @media (min-width: 1024px) {
    max-width: 300px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
`;

const FooterTitle = styled.h4`
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const FooterLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0;

  &:hover {
    color: #0ea5e9;
    transform: translateX(4px);
  }
`;

// const SocialLinks = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 0.5rem;
// `;

// const SocialLink = styled.a`
//   color: #cbd5e1;
//   text-decoration: none;
//   font-size: 1.25rem;
//   transition: all 0.3s ease;
//   padding: 0.5rem;

//   &:hover {
//     color: #0ea5e9;
//     transform: translateY(-2px);
//   }
// `;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.p`
  color: #94a3b8;
  font-size: 0.75rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 640px) {
    gap: 1.5rem;
    justify-content: flex-end;
  }
`;

const FooterBottomLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #0ea5e9;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterBrand>
          <FooterLogo href="/">
            <span>🍻</span>
            Hoppr
          </FooterLogo>
          <FooterDescription>
            Connect with new people through shared experiences. Plan crawls,
            skip lines, and create unforgettable memories together.
          </FooterDescription>
          {/* <SocialLinks>
            <SocialLink href="#" aria-label="Instagram">
              📷
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              🐦
            </SocialLink>
            <SocialLink href="#" aria-label="Facebook">
              👍
            </SocialLink>
            <SocialLink href="#" aria-label="TikTok">
              🎵
            </SocialLink>
          </SocialLinks> */}
        </FooterBrand>

        <FooterSection>
          <FooterTitle>Explore</FooterTitle>
          <FooterLink href="/bars">All Bars</FooterLink>
          <FooterLink href="/crawls-dashboard">Discover Crawls</FooterLink>
          <FooterLink href="/crawl-planner">Plan a Crawl</FooterLink>
          <FooterLink href="/vip">VIP Passes</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Company</FooterTitle>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/safety">Safety</FooterLink>
          <FooterLink href="/partners">Venue Partners</FooterLink>
          <FooterLink href="/careers">Careers</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="/help">Help Center</FooterLink>
          <FooterLink href="/contact">Contact Us</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms of Service</FooterLink>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © 2024 Hoppr. All rights reserved. Made with ❤️ in Finland
        </Copyright>
        <FooterLinks>
          <FooterBottomLink href="/privacy">Privacy</FooterBottomLink>
          <FooterBottomLink href="/terms">Terms</FooterBottomLink>
          <FooterBottomLink href="/cookies">Cookies</FooterBottomLink>
          <FooterBottomLink href="/sitemap">Sitemap</FooterBottomLink>
        </FooterLinks>
      </FooterBottom>
    </FooterContainer>
  );
}
