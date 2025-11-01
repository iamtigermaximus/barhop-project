"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Auto-scroll animation
const autoScroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// Styled Components - Updated Promo Slider with Auto-scroll
const PromoSliderWrapper = styled.div`
  position: relative;
  margin: 0 -0.5rem;
  overflow: hidden;
  mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);

  @media (min-width: 768px) {
    margin: 0 -1rem;
  }

  @media (min-width: 1024px) {
    margin: 0 -1.5rem;
  }
`;

const PromoSlider = styled.div<{ $duration: number }>`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  width: max-content;

  /* Auto-scroll animation */
  animation: ${autoScroll} ${(props) => props.$duration}ms linear infinite;

  /* Pause animation on hover */
  &:hover {
    animation-play-state: paused;
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    gap: 2rem;
    padding: 1.5rem;
  }
`;

const PromoCard = styled.div`
  flex: 0 0 300px;
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 140px;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
  }

  @media (min-width: 640px) {
    flex: 0 0 350px;
    min-height: 160px;
  }

  @media (min-width: 768px) {
    flex: 0 0 400px;
    min-height: 180px;
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    flex: 0 0 450px;
    min-height: 200px;
    padding: 2.5rem;
  }
`;

const PromoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 2;

  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const PromoDescription = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 2;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
  }
`;

const ResponsiveContainer = styled.div`
  padding: 1rem 1rem 10rem;
  min-height: 100vh;
  background-size: 400% 400%;

  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem 10rem;
  }

  @media (min-width: 768px) {
    padding: 2rem 2rem 10rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 3rem 10rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (min-width: 1280px) {
    padding: 2rem 4rem 10rem;
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

const Section = styled.section`
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }

  @media (min-width: 1024px) {
    margin-bottom: 4rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;

  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.75rem;
  }
`;

const ViewAllButton = styled(Link)`
  color: #0ea5e9;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: #38bdf8;
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

// Horizontal Scroll Grids - Responsive
const HorizontalGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem;
  margin: 0 -0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 768px) {
    gap: 1.5rem;
    padding: 1rem;
    margin: 0 -1rem;
  }

  @media (min-width: 1024px) {
    gap: 2rem;
    padding: 1.5rem;
    margin: 0 -1.5rem;
  }

  @media (min-width: 1280px) {
    &::-webkit-scrollbar {
      display: block;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(30, 41, 59, 0.5);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.5);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.7);
    }
  }
`;

// Bar Card - Responsive
const BarCard = styled(Link)`
  flex: 0 0 160px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 180px;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }

  @media (min-width: 640px) {
    flex: 0 0 180px;
    min-height: 200px;
  }

  @media (min-width: 768px) {
    flex: 0 0 200px;
    min-height: 220px;
    padding: 1.25rem;
  }

  @media (min-width: 1024px) {
    flex: 0 0 220px;
    min-height: 240px;
  }

  @media (min-width: 1280px) {
    flex: 0 0 240px;
  }
`;

const BarImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : "linear-gradient(45deg, #475569, #64748b)"};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 100px;
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    height: 120px;
  }
`;

const BarName = styled.h3`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const BarLocation = styled.p`
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

// VIP Pass Card - Responsive
const VIPCard = styled(Link)`
  flex: 0 0 200px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(14, 165, 233, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  min-height: 120px;

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    flex: 0 0 220px;
    min-height: 140px;
    padding: 1.25rem;
  }

  @media (min-width: 1024px) {
    flex: 0 0 240px;
    min-height: 160px;
  }

  @media (min-width: 1280px) {
    flex: 0 0 260px;
  }
`;

const VIPTitle = styled.h3`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const VIPPrice = styled.div`
  color: #0ea5e9;
  font-size: 1rem;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

// Category Grid - Responsive
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.25rem;
    padding: 0;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const CategoryCard = styled(Link)`
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1.25rem 0.75rem;
  text-decoration: none;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 1.5rem 1rem;
    min-height: 100px;
  }

  @media (min-width: 1024px) {
    padding: 1.75rem 1.25rem;
    min-height: 120px;
  }
`;

const CategoryIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.25rem;
  }
`;

const CategoryName = styled.div`
  color: #f8fafc;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

// Promotion Card - Responsive
const PromotionCard = styled.div`
  flex: 0 0 180px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(34, 197, 94, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 140px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
  }

  @media (min-width: 768px) {
    flex: 0 0 200px;
    min-height: 160px;
    padding: 1.25rem;
  }

  @media (min-width: 1024px) {
    flex: 0 0 220px;
    min-height: 180px;
  }

  @media (min-width: 1280px) {
    flex: 0 0 240px;
  }
`;

const PromotionTitle = styled.h3`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const PromotionDescription = styled.p`
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const PromotionCode = styled.div`
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.2);
  text-align: center;

  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }
`;

// Loading State - Responsive
const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 1rem;

  @media (min-width: 768px) {
    padding: 3rem;
    font-size: 1.125rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem;
    font-size: 1.25rem;
  }
`;

// Grid Layout for Desktop
const DesktopGrid = styled.div`
  display: block;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    gap: 3rem;
  }
`;

// Interfaces
interface Bar {
  id: string;
  name: string;
  district: string;
  type: string;
  city: { name: string };
  imageUrl: string | null;
  vipEnabled: boolean;
  distance?: number;
}

interface VIPPass {
  id: string;
  name: string;
  price: number;
  bar: { name: string };
}

// Category icons
const categoryIcons: { [key: string]: string } = {
  PUB: "🍺",
  CLUB: "🎵",
  LOUNGE: "🍸",
  COCKTAIL_BAR: "🥃",
  RESTAURANT_BAR: "🍽️",
  SPORTS_BAR: "🏈",
  KARAOKE: "🎤",
  LIVE_MUSIC: "🎸",
  WINE_BAR: "🍷",
  ROOFTOP_BAR: "🏙️",
  IRISH_PUB: "☘️",
  BEER_GARDEN: "🌳",
};

// Mock promotional data - Extended for smooth looping
const promotionalData = [
  {
    id: 1,
    title: "Weekend Special",
    description: "50% off all VIP passes this weekend",
    type: "vip_discount",
  },
  {
    id: 2,
    title: "New Bars Added",
    description: "Discover 10 new partner venues in your area",
    type: "new_bars",
  },
  {
    id: 3,
    title: "Happy Hour Extended",
    description: "Enjoy extended happy hours all week long",
    type: "promotion",
  },
  {
    id: 4,
    title: "VIP Membership",
    description: "Become a VIP member for exclusive benefits",
    type: "membership",
  },
  {
    id: 5,
    title: "Summer Festival",
    description: "Join our biggest bar hopping event of the year",
    type: "event",
  },
  {
    id: 6,
    title: "Student Night",
    description: "Special discounts for students every Wednesday",
    type: "discount",
  },
];

// Mock promotions data
const mockPromotions = [
  {
    id: 1,
    title: "2-for-1 Cocktails",
    description: "Every Thursday 6-9 PM at selected bars",
    code: "HOPPR23",
    bar: "Sky Bar & Lounge",
  },
  {
    id: 2,
    title: "Free Cover Before 11 PM",
    description: "Show this code at entrance for free cover",
    code: "FREECOVER",
    bar: "Club Pulse & Rhythm",
  },
  {
    id: 3,
    title: "Whiskey Tasting Night",
    description: "Complimentary whiskey tasting experience",
    code: "TASTING23",
    bar: "Spirit Masters Lounge",
  },
  {
    id: 4,
    title: "Student Night Special",
    description: "50% off all drinks with student ID",
    code: "STUDENT50",
    bar: "University Pub House",
  },
];

export default function AppHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Create duplicated array for seamless looping
  const duplicatedPromos = [...promotionalData, ...promotionalData];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Default to Helsinki if location denied
          setUserLocation({ latitude: 60.1699, longitude: 24.9384 });
        }
      );
    }

    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch bars
      const barsResponse = await fetch("/api/bars?limit=12");
      const barsData = await barsResponse.json();

      // Fetch VIP passes
      const vipResponse = await fetch("/api/vip/passes?limit=6");
      const vipData = await vipResponse.json();

      setBars(barsData.bars || barsData);
      setVipPasses(vipData.passes || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <LoadingState>Loading amazing venues and deals...</LoadingState>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      {/* Auto-scrolling Promotional Slider */}
      <Section>
        <PromoSliderWrapper>
          <PromoSlider $duration={30000}>
            {" "}
            {/* 30 seconds for full loop */}
            {duplicatedPromos.map((promo, index) => (
              <PromoCard key={`${promo.id}-${index}`}>
                <PromoTitle>{promo.title}</PromoTitle>
                <PromoDescription>{promo.description}</PromoDescription>
              </PromoCard>
            ))}
          </PromoSlider>
        </PromoSliderWrapper>
      </Section>

      <DesktopGrid>
        <GridColumn>
          {/* Bars Near You */}
          <Section>
            <SectionHeader>
              <SectionTitle>Bars Near You</SectionTitle>
              <ViewAllButton href="/app/bars">View All</ViewAllButton>
            </SectionHeader>

            <HorizontalGrid>
              {bars.slice(0, 8).map((bar) => (
                <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
                  <BarImage $imageUrl={bar.imageUrl || undefined}>
                    {!bar.imageUrl && (categoryIcons[bar.type] || "🍻")}
                  </BarImage>
                  <BarName>{bar.name}</BarName>
                  <BarLocation>
                    {bar.district} • {bar.city.name}
                  </BarLocation>
                </BarCard>
              ))}
            </HorizontalGrid>
          </Section>

          {/* Current Promotions */}
          <Section>
            <SectionHeader>
              <SectionTitle>Current Promotions</SectionTitle>
              <ViewAllButton href="/app/promotions">View All</ViewAllButton>
            </SectionHeader>

            <HorizontalGrid>
              {mockPromotions.map((promo) => (
                <PromotionCard key={promo.id}>
                  <PromotionTitle>{promo.title}</PromotionTitle>
                  <PromotionDescription>
                    {promo.description}
                  </PromotionDescription>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#64748b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    at {promo.bar}
                  </div>
                  <PromotionCode>{promo.code}</PromotionCode>
                </PromotionCard>
              ))}
            </HorizontalGrid>
          </Section>
        </GridColumn>

        <GridColumn>
          {/* VIP Passes */}
          <Section>
            <SectionHeader>
              <SectionTitle>VIP Passes</SectionTitle>
              <ViewAllButton href="/app/vip-pass">View All</ViewAllButton>
            </SectionHeader>

            <HorizontalGrid>
              {vipPasses.slice(0, 6).map((pass) => (
                <VIPCard key={pass.id} href={`/app/vip-pass`}>
                  <VIPTitle>{pass.name}</VIPTitle>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {pass.bar.name}
                  </div>
                  <VIPPrice>€{pass.price}</VIPPrice>
                </VIPCard>
              ))}
            </HorizontalGrid>
          </Section>

          {/* Browse Categories */}
          <Section>
            <SectionHeader>
              <SectionTitle>Browse Categories</SectionTitle>
            </SectionHeader>

            <CategoryGrid>
              {Object.entries(categoryIcons)
                .slice(0, 12)
                .map(([category, icon]) => (
                  <CategoryCard
                    key={category}
                    href={`/app/bars?type=${category.toLowerCase()}`}
                  >
                    <CategoryIcon>{icon}</CategoryIcon>
                    <CategoryName>{category.replace(/_/g, " ")}</CategoryName>
                  </CategoryCard>
                ))}
            </CategoryGrid>
          </Section>
        </GridColumn>
      </DesktopGrid>
    </ResponsiveContainer>
  );
}
