"use client";
import { useEffect, useState } from "react";
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
  mask: linear-gradient(90deg, transparent, white 5%, white 95%, transparent);

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
  animation: ${autoScroll} ${(props) => props.$duration}ms linear infinite;

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
  flex: 0 0 280px;
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  border-radius: 16px;
  padding: 1.25rem;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 130px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

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
    flex: 0 0 320px;
    min-height: 150px;
    padding: 1.5rem;
  }

  @media (min-width: 768px) {
    flex: 0 0 380px;
    min-height: 170px;
    padding: 1.75rem;
  }

  @media (min-width: 1024px) {
    flex: 0 0 420px;
    min-height: 190px;
    padding: 2rem;
  }
`;

const PromoTitle = styled.h3`
  font-size: 1rem;
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
  font-size: 0.8rem;
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 2;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const ResponsiveContainer = styled.div`
  padding: 1rem 1rem 5rem; /* Increased bottom padding for mobile */
  min-height: 100vh;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;

  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem 6rem; /* More padding for tablets */
  }

  @media (min-width: 768px) {
    padding: 2rem 2rem 7rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 3rem 8rem;
    max-width: 1600px;
    margin: 0 auto;
  }

  @media (min-width: 1280px) {
    padding: 2rem 4rem 8rem;
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

  &:last-child {
    margin-bottom: 0; /* Remove margin from last section since container has padding */
  }

  @media (min-width: 768px) {
    margin-bottom: 2.5rem;
  }

  @media (min-width: 1024px) {
    margin-bottom: 3rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.25rem;

  @media (min-width: 768px) {
    margin-bottom: 1.25rem;
    padding: 0;
  }

  @media (min-width: 1024px) {
    margin-bottom: 1.5rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #38bdf8;
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

// Horizontal scroll for mobile/tablet, grid for desktop
const BarsContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.5) rgba(30, 41, 59, 0.5);

    &::-webkit-scrollbar {
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

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
  }
`;

const BarCard = styled(Link)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.875rem;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 170px;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-4px);
    background: rgba(30, 41, 59, 0.95);
  }

  @media (max-width: 1023px) {
    flex: 0 0 160px;
    min-height: 180px;
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    flex: 0 0 180px;
    min-height: 200px;
    padding: 1rem;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    flex: 0 0 200px;
    min-height: 220px;
    padding: 1.125rem;
  }

  @media (min-width: 1024px) {
    min-height: 240px;
    padding: 1rem;
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
    height: 140px;
  }
`;

const BarName = styled.h3`
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.95rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const BarLocation = styled.p`
  color: #94a3b8;
  font-size: 0.7rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 0.8rem;
  }
`;

// VIP Cards - Horizontal scroll on mobile/tablet, grid on desktop
const VIPContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
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
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 1280px) {
    gap: 2rem;
  }
`;

const VIPCard = styled(Link)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.15),
    rgba(14, 165, 233, 0.15)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
  min-height: 110px;

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-4px);
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.25),
      rgba(14, 165, 233, 0.25)
    );
  }

  @media (max-width: 1023px) {
    flex: 0 0 180px;
    min-height: 120px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    flex: 0 0 200px;
    min-height: 130px;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    min-height: 150px;
    padding: 1.125rem;
  }
`;

const VIPTitle = styled.h3`
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.95rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const VIPPrice = styled.div`
  color: #0ea5e9;
  font-size: 0.9rem;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
  }
`;

// Promotions - Horizontal scroll on mobile/tablet, grid on desktop
const PromotionsContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
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
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
`;

const PromotionCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.875rem;
  border: 1px solid rgba(34, 197, 94, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 130px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(34, 197, 94, 0.5);
    background: rgba(30, 41, 59, 0.95);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
  }

  @media (max-width: 1023px) {
    flex: 0 0 180px;
    min-height: 140px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    flex: 0 0 200px;
    min-height: 150px;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    min-height: 160px;
    padding: 1rem;
  }
`;

const PromotionTitle = styled.h3`
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 0.95rem;
  }
`;

const PromotionDescription = styled.p`
  color: #94a3b8;
  font-size: 0.7rem;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding-bottom: 0.5rem; /* Add small padding at bottom */

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.25rem;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(8, 1fr);
    gap: 1.5rem;
  }
`;

const CategoryCard = styled(Link)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  text-decoration: none;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
    background: rgba(30, 41, 59, 0.95);
  }

  @media (min-width: 768px) {
    padding: 1.25rem 0.5rem;
    min-height: 90px;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem 0.5rem;
    min-height: 100px;
  }
`;

const CategoryIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.35rem;

  @media (min-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

const CategoryName = styled.div`
  color: #f8fafc;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 0.8rem;
  }

  @media (min-width: 1024px) {
    font-size: 0.9rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1rem;

  @media (min-width: 768px) {
    padding: 4rem;
    font-size: 1.125rem;
  }

  @media (min-width: 1024px) {
    padding: 5rem;
    font-size: 1.25rem;
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 1rem;
`;

// Interfaces matching your schema
interface Bar {
  id: string;
  name: string;
  district: string | null;
  type: string;
  city: {
    id: string;
    name: string;
    country: string;
  };
  imageUrl: string | null;
  vipEnabled: boolean;
  address: string;
}

interface VIPPassEnhanced {
  id: string;
  name: string;
  priceCents: number;
  barId: string;
  bar?: {
    name: string;
  };
  type: string;
  benefits: string[];
  isActive: boolean;
}

interface BarPromotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: {
    name: string;
  };
  isActive: boolean;
  isApproved: boolean;
}

// Category icons from your BarType enum
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

// Promotional data for the slider
const promotionalData = [
  {
    id: 1,
    title: "Weekend Special",
    description: "50% off all VIP passes this weekend",
    type: "vip_discount",
    link: "/app/vip-pass",
  },
  {
    id: 2,
    title: "New Bars Added",
    description: "Discover 10 new partner venues in your area",
    type: "new_bars",
    link: "/app/bars",
  },
  {
    id: 3,
    title: "Happy Hour Extended",
    description: "Enjoy extended happy hours all week long",
    type: "promotion",
    link: "/app/promotions",
  },
  {
    id: 4,
    title: "VIP Membership",
    description: "Become a VIP member for exclusive benefits",
    type: "membership",
    link: "/app/vip-pass",
  },
  {
    id: 5,
    title: "Summer Festival",
    description: "Join our biggest bar hopping event of the year",
    type: "event",
    link: "/app/crawls",
  },
  {
    id: 6,
    title: "Student Night",
    description: "Special discounts for students every Wednesday",
    type: "discount",
    link: "/app/promotions",
  },
];

const AppHome = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
  const [promotions, setPromotions] = useState<BarPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create duplicated array for seamless looping
  const duplicatedPromos = [...promotionalData, ...promotionalData];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch bars from your API
      const barsResponse = await fetch("/api/bars?limit=12");
      if (!barsResponse.ok) throw new Error("Failed to fetch bars");
      const barsData = await barsResponse.json();
      setBars(Array.isArray(barsData) ? barsData : barsData.bars || []);

      // Fetch VIP passes from your API
      const vipResponse = await fetch("/api/vip/passes?limit=6");
      if (vipResponse.ok) {
        const vipData = await vipResponse.json();
        setVipPasses(Array.isArray(vipData) ? vipData : vipData.passes || []);
      }

      // Fetch promotions from your API
      const promosResponse = await fetch("/api/promotions?limit=6");
      if (promosResponse.ok) {
        const promosData = await promosResponse.json();
        setPromotions(Array.isArray(promosData) ? promosData : promosData.promotions || []);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoClick = (promo: typeof promotionalData[0]) => {
    router.push(promo.link);
  };

  const handlePromotionClick = (promotion: BarPromotion) => {
    router.push(`/app/bars/${promotion.barId}`);
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <LoadingState>
          <div>✨ Loading amazing venues and deals... ✨</div>
        </LoadingState>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer>
        <ErrorState>
          {error}
          <button
            onClick={() => fetchHomeData()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#8b5cf6",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </ErrorState>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      {/* Auto-scrolling Promotional Slider */}
      <Section>
        <PromoSliderWrapper>
          <PromoSlider $duration={30000}>
            {duplicatedPromos.map((promo, index) => (
              <PromoCard 
                key={`${promo.id}-${index}`} 
                onClick={() => handlePromoClick(promo)}
              >
                <PromoTitle>{promo.title}</PromoTitle>
                <PromoDescription>{promo.description}</PromoDescription>
              </PromoCard>
            ))}
          </PromoSlider>
        </PromoSliderWrapper>
      </Section>

      {/* Single column layout - all sections stacked vertically */}
      
      {/* Bars Near You */}
      <Section>
        <SectionHeader>
          <SectionTitle>🍸 Bars Near You</SectionTitle>
          <ViewAllButton href="/app/bars">View All →</ViewAllButton>
        </SectionHeader>

        <BarsContainer>
          {bars.length > 0 ? (
            bars.slice(0, 8).map((bar) => (
              <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
                <BarImage $imageUrl={bar.imageUrl || undefined}>
                  {!bar.imageUrl && (categoryIcons[bar.type] || "🍻")}
                </BarImage>
                <BarName>{bar.name}</BarName>
                <BarLocation>
                  {bar.district || "Central"} • {bar.city?.name || "Helsinki"}
                </BarLocation>
              </BarCard>
            ))
          ) : (
            <div style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}>
              No bars available at the moment.
            </div>
          )}
        </BarsContainer>
      </Section>

      {/* VIP Passes */}
      <Section>
        <SectionHeader>
          <SectionTitle>⭐ VIP Passes</SectionTitle>
          <ViewAllButton href="/app/vip-pass">View All →</ViewAllButton>
        </SectionHeader>

        <VIPContainer>
          {vipPasses.length > 0 ? (
            vipPasses.slice(0, 6).map((pass) => (
              <VIPCard key={pass.id} href={`/app/vip-pass/${pass.id}`}>
                <VIPTitle>{pass.name}</VIPTitle>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    marginBottom: "0.5rem",
                  }}
                >
                  {pass.bar?.name || "Premium Venue"}
                </div>
                <VIPPrice>€{(pass.priceCents / 100).toFixed(2)}</VIPPrice>
                {pass.benefits && pass.benefits.length > 0 && (
                  <div style={{ fontSize: "0.65rem", color: "#8b5cf6", marginTop: "0.5rem" }}>
                    ✨ {pass.benefits[0]}
                  </div>
                )}
              </VIPCard>
            ))
          ) : (
            <div style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}>
              No VIP passes available at the moment.
            </div>
          )}
        </VIPContainer>
      </Section>

      {/* Current Promotions */}
      <Section>
        <SectionHeader>
          <SectionTitle>🎉 Current Promotions</SectionTitle>
          <ViewAllButton href="/app/promotions">View All →</ViewAllButton>
        </SectionHeader>

        <PromotionsContainer>
          {promotions.length > 0 ? (
            promotions.slice(0, 6).map((promo) => (
              <PromotionCard 
                key={promo.id} 
                onClick={() => handlePromotionClick(promo)}
              >
                <PromotionTitle>{promo.title}</PromotionTitle>
                <PromotionDescription>{promo.description}</PromotionDescription>
                {promo.discount && (
                  <div style={{ fontSize: "0.7rem", color: "#22c55e", marginBottom: "0.5rem", fontWeight: 600 }}>
                    {promo.discount}% OFF
                  </div>
                )}
                <div style={{ fontSize: "0.65rem", color: "#64748b" }}>
                  at {promo.bar?.name || "Venue"}
                </div>
              </PromotionCard>
            ))
          ) : (
            <div style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}>
              No active promotions at the moment.
            </div>
          )}
        </PromotionsContainer>
      </Section>

      {/* Browse Categories */}
      <Section>
        <SectionHeader>
          <SectionTitle>🔍 Browse Categories</SectionTitle>
        </SectionHeader>

        <CategoryGrid>
          {Object.entries(categoryIcons).map(([category, icon]) => (
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
    </ResponsiveContainer>
  );
};

export default AppHome;