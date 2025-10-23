"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";

export const Page = styled.div`
  padding: 2rem 1rem 10rem;
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
    padding: 1rem 0.5rem 10rem;
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

export const Title = styled.h1`
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
    margin-bottom: 0.75rem;
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

export const Description = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

export const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: transparent !important;

  @media (max-width: 768px) {
    gap: 2rem;
    padding: 0 0.5rem;
  }
`;

export const CategorySection = styled.div`
  /* background: rgba(30, 41, 59, 0.7); */
  background-color: transparent !important;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  background-color: transparent !important;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const CategoryTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: transparent !important;
`;

export const CategoryIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  @media (max-width: 768px) {
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
  }
`;

export const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #f8fafc;
  margin: 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const CategoryCount = styled.span`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  background-color: transparent !important;
`;

export const SeeAllButton = styled(Link)`
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.3);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    background: linear-gradient(45deg, #7c3aed, #9333ea);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    align-self: flex-end;
  }
`;

export const BarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  background-color: transparent !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const BarCard = styled(Link)`
  background: rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(51, 65, 85, 0.8);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
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
    padding: 1.25rem;
  }
`;

export const BarImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : "linear-gradient(45deg, #475569, #64748b)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  }
`;

export const BarInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: transparent !important;
`;

export const BarName = styled.h3`
  font-size: 1.1rem;
  color: #f8fafc;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const BarLocation = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "📍";
  }
`;

export const BarDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  background-color: transparent !important;
`;

export const DetailTag = styled.span`
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.1);

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
`;

export const VIPBadge = styled(DetailTag)`
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  color: white;
  font-weight: 700;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

export const StatusBadge = styled.span<{ $isOpen: boolean }>`
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.$isOpen ? "#22c55e" : "#ef4444")};
  border: 1px solid;
  border-color: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-style: italic;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 8px;
  border: 1px dashed rgba(139, 92, 246, 0.2);
  grid-column: 1 / -1;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #e2e8f0;
  font-size: 1.2rem;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #ef4444;
  font-size: 1.2rem;
`;

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  PUB: "🍺",
  CLUB: "🎵",
  LOUNGE: "🍸",
  COCKTAIL_BAR: "🥃",
  RESTAURANT_BAR: "🍽️",
  SPORTS_BAR: "🏈",
  KARAOKE: "🎤",
  LIVE_MUSIC: "🎸",
};

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
  imageUrl: string | null;
  operatingHours?: {
    [key: string]: { open: string; close: string };
  };
  isOpen?: boolean;
}

// Helper function to calculate if bar is currently open
const calculateIsOpen = (
  operatingHours: { [key: string]: { open: string; close: string } } | undefined
): boolean => {
  if (!operatingHours) return false;

  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const todaysHours = operatingHours[today];

  if (!todaysHours) return false;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const openTime = todaysHours.open;
  const closeTime = todaysHours.close;

  if (closeTime < openTime) {
    return currentTime >= openTime;
  } else {
    return currentTime >= openTime && currentTime <= closeTime;
  }
};

export default function Partners() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group bars by type
  const barsByCategory = bars.reduce((acc, bar) => {
    const category = bar.type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bar);
    return acc;
  }, {} as { [key: string]: Bar[] });

  // Sort categories by number of bars (descending)
  const sortedCategories = Object.entries(barsByCategory)
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([category, bars]) => ({
      category,
      bars: bars.sort((a, b) => a.name.localeCompare(b.name)),
    }));

  useEffect(() => {
    const fetchBars = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bars");

        if (!response.ok) {
          throw new Error(`Failed to fetch bars: ${response.status}`);
        }

        const barsData: Bar[] = await response.json();

        // Enhance bars with calculated fields
        const enhancedBars = barsData.map((bar) => ({
          ...bar,
          isOpen: calculateIsOpen(bar.operatingHours),
        }));

        setBars(enhancedBars);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching bars"
        );
      } finally {
        setLoading(false);
      }
    };

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
        <Title>Our Partners</Title>
        <Description>
          Discover our curated selection of premium venues
        </Description>
        <HopprLoader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>Our Partners</Title>
        <Description>
          Discover our curated selection of premium venues
        </Description>
        <ErrorState>Error: {error}</ErrorState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Our Partners</Title>
      <Description>
        Discover {bars.length} premium venues across{" "}
        {new Set(bars.map((bar) => bar.city.name)).size} cities
      </Description>

      <CategoriesContainer>
        {sortedCategories.map(({ category, bars: categoryBars }) => (
          <CategorySection key={category}>
            <CategoryHeader>
              <CategoryTitleWrapper>
                <CategoryIcon>{categoryIcons[category] || "🍻"}</CategoryIcon>
                <div>
                  <CategoryTitle>
                    {category.replace(/_/g, " ")}
                    <CategoryCount>
                      ({categoryBars.length} venue
                      {categoryBars.length !== 1 ? "s" : ""})
                    </CategoryCount>
                  </CategoryTitle>
                </div>
              </CategoryTitleWrapper>

              {categoryBars.length > 5 && (
                <SeeAllButton href={`/app/bars?type=${category.toLowerCase()}`}>
                  See All {categoryBars.length}
                </SeeAllButton>
              )}
            </CategoryHeader>

            <BarsGrid>
              {categoryBars.length > 0 ? (
                categoryBars.slice(0, 5).map((bar) => (
                  <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
                    <BarImage $imageUrl={bar.imageUrl || undefined}>
                      {!bar.imageUrl && categoryIcons[category]}
                    </BarImage>
                    <BarInfo>
                      <BarName>{bar.name}</BarName>
                      <BarLocation>
                        {bar.city.name} • {bar.district}
                      </BarLocation>
                      {/* <BarDetails>
                        {bar.isOpen !== undefined && (
                          <StatusBadge $isOpen={bar.isOpen}>
                            {bar.isOpen ? "Open" : "Closed"}
                          </StatusBadge>
                        )}
                        {bar.vipEnabled && <VIPBadge>VIP</VIPBadge>}
                      </BarDetails> */}
                    </BarInfo>
                  </BarCard>
                ))
              ) : (
                <EmptyState>No venues in this category</EmptyState>
              )}
            </BarsGrid>
          </CategorySection>
        ))}
      </CategoriesContainer>

      {sortedCategories.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "#94a3b8",
          }}
        >
          No partner venues found. Check back soon for new additions!
        </div>
      )}
    </Page>
  );
}
