"use client";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
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

// Styled Components
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
  padding: 1rem 1rem 5rem;
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
    padding: 1.5rem 1.5rem 6rem;
  }
  @media (min-width: 768px) {
    padding: 2rem 2rem 7rem;
  }
  @media (min-width: 1024px) {
    padding: 2rem 3rem 8rem;
    max-width: 1600px;
    margin: 0 auto;
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
    margin-bottom: 0;
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

const BarsContainer = styled.div`
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
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
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
`;

const DistanceBadge = styled.span`
  background: rgba(14, 165, 233, 0.2);
  color: #0ea5e9;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.25rem;
`;

const VIPContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
  }
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
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
  }
  @media (max-width: 1023px) {
    flex: 0 0 180px;
    min-height: 120px;
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
`;

const VIPPrice = styled.div`
  color: #0ea5e9;
  font-size: 0.9rem;
  font-weight: 700;
`;

const PromotionsContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
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
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 130px;
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(34, 197, 94, 0.5);
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
`;

const PromotionDescription = styled.p`
  color: #94a3b8;
  font-size: 0.7rem;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CrawlsContainer = styled.div`
  @media (max-width: 1023px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0.25rem;
  }
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
`;

const CrawlCard = styled(Link)`
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.15),
    rgba(168, 85, 247, 0.15)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  min-height: 120px;
  &:hover {
    border-color: rgba(236, 72, 153, 0.6);
    transform: translateY(-4px);
  }
  @media (max-width: 1023px) {
    flex: 0 0 220px;
  }
`;

const CrawlTitle = styled.h3`
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const CrawlDate = styled.div`
  color: #ec4899;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CrawlParticipants = styled.div`
  color: #94a3b8;
  font-size: 0.7rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
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
`;

const CategoryIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.35rem;
  @media (min-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
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
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 1rem;
`;

// Interfaces
interface Bar {
  id: string;
  name: string;
  district: string | null;
  type: string;
  cityName: string | null;
  imageUrl: string | null;
  coverImage: string | null;
  logoUrl: string | null;
  vipEnabled: boolean;
  address: string;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}

interface VIPPassEnhanced {
  id: string;
  name: string;
  priceCents: number;
  barId: string;
  bar?: { id: string; name: string };
  benefits: string[];
}

interface BarPromotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: { id: string; name: string };
  endDate: string;
}

interface Crawl {
  id: string;
  name: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  city?: { name: string };
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
};

// Promotional data
const promotionalData = [
  {
    id: 1,
    title: "Weekend Special",
    description: "50% off all VIP passes this weekend",
    link: "/app/vip-pass",
  },
  {
    id: 2,
    title: "New Bars Added",
    description: "Discover new partner venues in your area",
    link: "/app/bars",
  },
  {
    id: 3,
    title: "Happy Hour Extended",
    description: "Enjoy extended happy hours all week long",
    link: "/app/promotions",
  },
  {
    id: 4,
    title: "VIP Membership",
    description: "Become a VIP member for exclusive benefits",
    link: "/app/vip-pass",
  },
  {
    id: 5,
    title: "Bar Crawls",
    description: "Join our biggest bar hopping events",
    link: "/app/crawls",
  },
  {
    id: 6,
    title: "Student Night",
    description: "Special discounts for students every Wednesday",
    link: "/app/promotions",
  },
];

// Helper functions
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatDistance = (distance: number): string => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};

const AppHome = () => {
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
  const [promotions, setPromotions] = useState<BarPromotion[]>([]);
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  const duplicatedPromos = [...promotionalData, ...promotionalData];

  // Get user location on mount - ONLY ONCE
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "📍 Location obtained:",
            position.coords.latitude,
            position.coords.longitude,
          );
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoaded(true);
        },
        (error) => {
          console.log("📍 Location denied or error:", error.message);
          setLocationLoaded(true); // Still mark as loaded so we fetch without location
          setUserLocation(null);
        },
      );
    } else {
      console.log("📍 Geolocation not supported");
      setLocationLoaded(true);
      setUserLocation(null);
    }
  }, []);

  // Fetch data ONLY when location is determined (either obtained or denied)
  useEffect(() => {
    if (locationLoaded) {
      fetchHomeData();
    }
  }, [locationLoaded]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with location if available
      let barsUrl = "/api/bars?limit=12&isActive=true";
      if (userLocation) {
        barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;
        console.log("📍 Fetching bars with location:", userLocation);
      } else {
        console.log("📍 Fetching bars without location");
      }

      console.log("📡 Fetching URL:", barsUrl);

      const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
        fetch(barsUrl),
        fetch("/api/vip/passes?limit=6&isActive=true"),
        fetch("/api/promotions?limit=6&isActive=true&isApproved=true"),
        fetch("/api/crawls?limit=3&status=UPCOMING"),
      ]);

      // Handle Bars Response
      if (barsRes.ok) {
        const barsData = await barsRes.json();
        console.log("📦 Bars API response received");

        // Handle different response formats
        let barsArray = barsData;
        if (barsData.data) barsArray = barsData.data;
        if (barsData.bars) barsArray = barsData.bars;
        if (!Array.isArray(barsArray)) barsArray = [];

        console.log(`📊 Found ${barsArray.length} bars`);

        // Calculate distance if user location available (as fallback, though API should have done it)
        const barsWithDistance = barsArray.map((bar: Bar) => {
          let distance = bar.distance; // Use API's distance if available
          if (!distance && userLocation && bar.latitude && bar.longitude) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              bar.latitude,
              bar.longitude,
            );
          }
          return { ...bar, distance };
        });

        // Sort by distance (nearest first) if user location available
        if (userLocation) {
          barsWithDistance.sort((a: Bar, b: Bar) => {
            if (a.distance === undefined && b.distance === undefined) return 0;
            if (a.distance === undefined) return 1;
            if (b.distance === undefined) return -1;
            return a.distance - b.distance;
          });
        }

        setBars(barsWithDistance.slice(0, 8));
        console.log(`✅ Loaded ${barsWithDistance.length} bars for homepage`);
      } else {
        console.error("Bars API failed:", barsRes.status);
      }

      // Handle VIP Passes Response
      if (vipRes.ok) {
        const vipData = await vipRes.json();
        let vipArray = vipData;
        if (vipData.passes) vipArray = vipData.passes;
        if (vipData.data) vipArray = vipData.data;
        if (!Array.isArray(vipArray)) vipArray = [];
        setVipPasses(vipArray.slice(0, 6));
        console.log(`✅ Loaded ${vipArray.length} VIP passes`);
      }

      // Handle Promotions Response
      if (promotionsRes.ok) {
        const promotionsData = await promotionsRes.json();
        let promosArray = promotionsData;
        if (promotionsData.promotions) promosArray = promotionsData.promotions;
        if (promotionsData.data) promosArray = promotionsData.data;
        if (!Array.isArray(promosArray)) promosArray = [];
        setPromotions(promosArray.slice(0, 6));
        console.log(`✅ Loaded ${promosArray.length} promotions`);
      }

      // Handle Crawls Response
      if (crawlsRes.ok) {
        const crawlsData = await crawlsRes.json();
        let crawlsArray = crawlsData;
        if (crawlsData.crawls) crawlsArray = crawlsData.crawls;
        if (crawlsData.data) crawlsArray = crawlsData.data;
        if (!Array.isArray(crawlsArray)) crawlsArray = [];
        setCrawls(crawlsArray.slice(0, 3));
        console.log(`✅ Loaded ${crawlsArray.length} crawls`);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };
  const handlePromoClick = (promo: (typeof promotionalData)[0]) => {
    router.push(promo.link);
  };

  const handlePromotionClick = (promotion: BarPromotion) => {
    router.push(`/app/bars/${promotion.barId}`);
  };

  const getBarImage = (bar: Bar): string => {
    return bar.coverImage || bar.imageUrl || bar.logoUrl || "";
  };

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <LoadingState>
          <div>📍 Getting your location and loading amazing venues...</div>
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
      {/* Promotional Slider */}
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

      {/* Bars Near You */}
      <Section>
        <SectionHeader>
          <SectionTitle>🍸 Bars Near You</SectionTitle>
          <ViewAllButton href="/app/bars">View All →</ViewAllButton>
        </SectionHeader>

        <BarsContainer>
          {bars.length > 0 ? (
            bars.map((bar) => (
              <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
                <BarImage $imageUrl={getBarImage(bar)}>
                  {!getBarImage(bar) && (categoryIcons[bar.type] || "🍻")}
                </BarImage>
                <BarName>{bar.name}</BarName>
                <BarLocation>
                  {bar.district || "Central"} • {bar.cityName || "Helsinki"}
                </BarLocation>
                {bar.distance !== undefined && bar.distance !== null && (
                  <DistanceBadge>
                    📍 {formatDistance(bar.distance)}
                  </DistanceBadge>
                )}
              </BarCard>
            ))
          ) : (
            <div
              style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
            >
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
            vipPasses.map((pass) => (
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
                <VIPPrice>{formatPrice(pass.priceCents)}</VIPPrice>
                {pass.benefits && pass.benefits.length > 0 && (
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#8b5cf6",
                      marginTop: "0.5rem",
                    }}
                  >
                    ✨{" "}
                    {pass.benefits[0].length > 40
                      ? pass.benefits[0].substring(0, 40) + "..."
                      : pass.benefits[0]}
                  </div>
                )}
              </VIPCard>
            ))
          ) : (
            <div
              style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
            >
              No VIP passes available.
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
            promotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                onClick={() => handlePromotionClick(promo)}
              >
                <PromotionTitle>{promo.title}</PromotionTitle>
                <PromotionDescription>
                  {promo.description.length > 80
                    ? promo.description.substring(0, 80) + "..."
                    : promo.description}
                </PromotionDescription>
                {promo.discount && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#22c55e",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {promo.discount}% OFF
                  </div>
                )}
                <div style={{ fontSize: "0.65rem", color: "#64748b" }}>
                  at {promo.bar?.name || "Venue"}
                </div>
                {promo.endDate && (
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "#64748b",
                      marginTop: "0.25rem",
                    }}
                  >
                    Ends {formatDate(promo.endDate)}
                  </div>
                )}
              </PromotionCard>
            ))
          ) : (
            <div
              style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
            >
              No active promotions.
            </div>
          )}
        </PromotionsContainer>
      </Section>

      {/* Bar Crawls / Events */}
      {crawls.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>🎪 Bar Crawls & Events</SectionTitle>
            <ViewAllButton href="/app/crawls">View All →</ViewAllButton>
          </SectionHeader>

          <CrawlsContainer>
            {crawls.map((crawl) => (
              <CrawlCard key={crawl.id} href={`/app/crawls/${crawl.id}`}>
                <CrawlTitle>{crawl.name}</CrawlTitle>
                <CrawlDate>
                  {formatDate(crawl.date)} • {crawl.startTime.substring(0, 5)}
                </CrawlDate>
                <CrawlParticipants>
                  👥 {crawl.currentParticipants || 0}/{crawl.maxParticipants}{" "}
                  participants
                </CrawlParticipants>
              </CrawlCard>
            ))}
          </CrawlsContainer>
        </Section>
      )}

      {/* Browse Categories - Links to filtered bars page */}
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
