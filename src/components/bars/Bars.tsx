"use client";
import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HopprLoader } from "../ui/Loader/HopprLoader";

const Page = styled.div`
  padding: 2rem 1rem;
  /* max-width: 1200px; */
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(15, 23, 42),
    rgb(9, 9, 11),
    rgb(15, 23, 42)
  );
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  min-height: calc(100vh - 70px);
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
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

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;

  @media (max-width: 768px) {
    font-size: 2rem;
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

const Description = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const BarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  background-color: transparent !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const BarCard = styled(Link)`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BarName = styled.h3`
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const BarDescription = styled.p`
  color: #e2e8f0;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const BarDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const DetailTag = styled.span`
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
`;

const VIPBadge = styled(DetailTag)`
  background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc);
  color: white;
  font-weight: 700;
  border: 1px solid rgba(139, 92, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Address = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #e2e8f0;
  font-size: 1.2rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #ef4444;
  font-size: 1.2rem;
`;

interface Bar {
  id: string;
  name: string;
  description: string | null;
  district: string;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  address: string;
  city: {
    name: string;
  };
}

export default function Bars() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBars() {
      try {
        setLoading(true);
        const response = await fetch("/api/bars");

        if (!response.ok) {
          throw new Error("Failed to fetch bars");
        }

        const data = await response.json();
        setBars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBars();
  }, []);

  // Add inline style to body to ensure gradient background
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(-45deg, rgb(9, 9, 11), rgb(15, 23, 42), rgb(9, 9, 11), rgb(15, 23, 42))";
    document.body.style.backgroundSize = "400% 400%";
    document.body.style.animation = "gradientShift 12s ease infinite";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.animation = "";
    };
  }, []);

  if (loading) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        {/* <LoadingState>Loading bars...</LoadingState> */}
        <HopprLoader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        <ErrorState>Error: {error}</ErrorState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Explore All Bars</Title>
      <Description>Discover {bars.length} bars across Finland</Description>

      <BarsGrid>
        {bars.map((bar) => (
          <BarCard key={bar.id} href={`/bars/${bar.id}`}>
            <BarName>{bar.name}</BarName>
            <BarDescription>
              {bar.description || "A great place to enjoy nightlife"}
            </BarDescription>
            <BarDetails>
              <DetailTag>{bar.city.name}</DetailTag>
              <DetailTag>{bar.district}</DetailTag>
              <DetailTag>{bar.type.replace(/_/g, " ")}</DetailTag>
              {bar.vipEnabled && bar.vipPrice && (
                <VIPBadge>VIP: €{bar.vipPrice}</VIPBadge>
              )}
            </BarDetails>
            <Address>{bar.address}</Address>
          </BarCard>
        ))}
      </BarsGrid>
    </Page>
  );
}
