"use client";
import styled from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  min-height: 100vh;
  animation: gradientShift 8s ease infinite;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
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

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;

  &:hover {
    color: #f8fafc;
  }
`;

export const Header = styled.div`
  margin-bottom: 3rem;
`;

export const BarName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const BarMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Tag = styled.span`
  background: #334155;
  color: #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const VipTag = styled(Tag)`
  background: #0284c7;
  color: white;
`;

export const Address = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const MainContent = styled.div``;

export const Description = styled.p`
  color: #e2e8f0;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

export const FeatureText = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
`;

export const Sidebar = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #334155;
  height: fit-content;
`;

export const ActionButton = styled.button`
  width: 100%;
  background: #0284c7;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0369a1;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #475569;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  background: transparent;
  color: #f8fafc;
  border: 2px solid #475569;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5e9;
    transform: translateY(-2px);
  }
`;

export const VipPrice = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 1.5rem;
`;

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #e2e8f0;
  font-size: 1.125rem;
`;

export const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ef4444;
  font-size: 1.125rem;
`;
