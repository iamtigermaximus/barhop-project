"use client";

import {
  FooterContainer,
  FooterContent,
  FooterBrand,
  FooterLogo,
  FooterDescription,
  FooterSectionsGrid,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterBottom,
  Copyright,
  FooterLinks,
  FooterBottomLink,
} from "./Footer.styles";

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
        </FooterBrand>

        <FooterSectionsGrid>
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
        </FooterSectionsGrid>
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
