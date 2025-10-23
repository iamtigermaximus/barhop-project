"use client";
import styled from "styled-components";
import Link from "next/link";

export const FooterContainer = styled.footer`
  background-color: transparent !important;
  padding: 2rem 1rem 1.5rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);

  @media (min-width: 768px) {
    padding: 4rem 2rem 2rem;
  }
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;

  @media (min-width: 640px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 2rem;
    text-align: left;
  }
`;

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
`;

export const FooterLogo = styled(Link)`
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

export const FooterDescription = styled.p`
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 100%;

  @media (min-width: 1024px) {
    max-width: 300px;
  }
`;

export const FooterSectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    grid-column: 2 / -1;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
`;

export const FooterTitle = styled.h4`
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

export const FooterLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  padding: 0.2rem 0;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }

  &:hover {
    color: #0ea5e9;
    transform: translateX(4px);
  }
`;

export const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
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

export const Copyright = styled.p`
  color: #94a3b8;
  font-size: 0.75rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 640px) {
    gap: 1.5rem;
    justify-content: flex-end;
  }
`;

export const FooterBottomLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #0ea5e9;
  }
`;
