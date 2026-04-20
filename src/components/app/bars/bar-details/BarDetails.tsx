"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
interface BarDetailsProps {
  barId: string;
}
// Types based on your actual schema
interface City {
  id: string;
  name: string;
  country: string;
}

interface SocialActivity {
  activeUsersCount: number;
  socialMeetupsCount: number;
  isHotspot: boolean;
  heatLevel: number;
  lastActivity: string;
}

interface OperatingHours {
  [key: string]: { open: string; close: string };
}

// Fix: Replace 'any' with proper type
interface ValidHours {
  start: string;
  end: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  imageUrl: string | null;
  accentColor: string | null;
  callToAction: string | null;
  conditions: string[];
  startDate: string;
  endDate: string;
  validDays: string[];
  validHours: ValidHours | null; // Fixed: replaced 'any' with proper type
  isActive: boolean;
  views: number;
  clicks: number;
  redemptions: number;
}

interface VIPPassEnhanced {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents: number | null;
  soldCount: number;
  totalQuantity: number;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  validityStart: string;
  validityEnd: string;
  validDays: string[];
  validHours: ValidHours | null; // Fixed: replaced 'any' with proper type
  isActive: boolean;
  type: string;
}

interface BarStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface BarData {
  id: string;
  name: string;
  description: string | null;
  address: string;
  district: string | null;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  vipCapacity: number | null;
  cityName: string | null;
  city: City | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  coverImage: string | null;
  imageUrl: string | null;
  logoUrl: string | null;
  imageUrls: string[];
  latitude: number | null;
  longitude: number | null;
  operatingHours: OperatingHours | null;
  priceRange: string | null;
  capacity: number | null;
  amenities: string[];
  isVerified: boolean;
  isActive: boolean;
  status: string;
  profileViews: number;
  directionClicks: number;
  callClicks: number;
  websiteClicks: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  claimedAt: string | null;
  vipPassesEnhanced: VIPPassEnhanced[];
  socialActivity: SocialActivity | null;
  currentPromotions: Promotion[];
  staff: BarStaff[];
}

// Styled Components (keep all your existing styled components)
const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  animation: gradientShift 8s ease infinite;

  @media (min-width: 768px) {
    padding: 3rem 10rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem 10rem;
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

const BackButton = styled(Link)`
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

const Header = styled.div`
  margin-bottom: 3rem;
  background-color: transparent !important;
`;

const BarName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const BarMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  background-color: transparent !important;
`;

const Tag = styled.span`
  background: #334155;
  color: #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const VipTag = styled(Tag)`
  background: #0284c7;
  color: white;
`;

const Address = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  background-color: transparent !important;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  background-color: transparent !important;
`;

const Description = styled.p`
  color: #e2e8f0;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeatureText = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const Sidebar = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #334155;
  height: fit-content;

  .quick-info {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #334155;

    h3 {
      color: #f8fafc;
      margin-bottom: 1rem;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #e2e8f0;
      font-size: 0.875rem;

      a {
        color: #0ea5e9;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
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

const VipPrice = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #e2e8f0;
  font-size: 1.125rem;
  background-color: transparent !important;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ef4444;
  font-size: 1.125rem;
`;

const StatusBadge = styled.span<{ $isOpen: boolean }>`
  background: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.$isOpen ? "#22c55e" : "#ef4444")};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid
    ${(props) =>
      props.$isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #334155;
  flex-wrap: wrap;
  background-color: transparent !important;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#94a3b8")};
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? "#0ea5e9" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    color: #f8fafc;
  }
`;

const SocialActivityPanel = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }
`;

const OperatingHoursTable = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .hours-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #334155;

    &:last-child {
      border-bottom: none;
    }

    .day {
      color: #e2e8f0;
      font-weight: 500;
    }

    .hours {
      color: #22c55e;
      font-weight: 600;

      &.closed {
        color: #ef4444;
      }
    }
  }
`;

const PromotionCard = styled.div<{ $type: string }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1.5rem;

  .promo-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;

    .promo-icon {
      font-size: 1.5rem;
    }

    .promo-title {
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .promo-description {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
    }
  }

  .promo-details {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    .promo-date,
    .promo-views {
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
    }
  }
`;

const VipPassesSection = styled.div`
  margin-top: 1rem;

  .vip-passes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .vip-pass-card {
    background: rgba(30, 41, 59, 0.6);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(139, 92, 246, 0.3);
    transition: all 0.3s ease;

    &:hover {
      border-color: #8b5cf6;
      transform: translateY(-4px);
      background: rgba(30, 41, 59, 0.8);
    }

    .vip-pass-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;

      .vip-pass-name {
        color: #f8fafc;
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
      }

      .vip-pass-price {
        text-align: right;

        .current-price {
          color: #38bdf8;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .original-price {
          color: #94a3b8;
          text-decoration: line-through;
          font-size: 0.9rem;
          margin-left: 0.5rem;
        }
      }
    }

    .vip-pass-description {
      color: #94a3b8;
      margin-bottom: 1rem;
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .vip-pass-benefits {
      margin-bottom: 1rem;

      .benefit-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #e2e8f0;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
      }
    }

    .vip-pass-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 0.75rem 0;
      border-top: 1px solid #334155;
      border-bottom: 1px solid #334155;

      .detail-item {
        color: #94a3b8;
        font-size: 0.75rem;

        strong {
          color: #e2e8f0;
        }
      }
    }

    .buy-vip-button {
      width: 100%;
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }
    }
  }
`;

const PhotosSection = styled.div`
  margin-top: 1rem;

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .photo-card {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #1e293b;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .cover-photo {
    margin-bottom: 2rem;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.01);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const MapSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .map-placeholder {
    border-radius: 8px;
    overflow: hidden;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

// Helper functions
const calculateIsOpen = (operatingHours?: OperatingHours | null): boolean => {
  if (!operatingHours) return false;

  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const todaysHours = operatingHours[today];

  if (!todaysHours || todaysHours.open === "Closed") return false;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  if (todaysHours.close < todaysHours.open) {
    return currentTime >= todaysHours.open;
  } else {
    return currentTime >= todaysHours.open && currentTime <= todaysHours.close;
  }
};

const getTodayHours = (operatingHours?: OperatingHours | null) => {
  if (!operatingHours) return undefined;
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  return operatingHours[today];
};

// Main Component
const BarDetails = ({ barId }: BarDetailsProps) => {
  // const params = useParams();
  const router = useRouter();
  const [bar, setBar] = useState<BarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "vip" | "photos">(
    "overview",
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Fetch bar data - wrapped in useCallback to avoid dependency issues
  const fetchBar = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      if (!barId) {
        throw new Error("Bar ID is required");
      }

      const response = await fetch(`/api/bars/${barId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Bar not found");
        }
        throw new Error(`Failed to fetch bar: ${response.status}`);
      }

      const barData: BarData = await response.json();
      setBar(barData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching bar details",
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [barId]);

  useEffect(() => {
    fetchBar();
  }, [fetchBar]);

  const handleVipClick = (): void => {
    setActiveTab("vip");
  };

  const handlePhotoClick = (url: string): void => {
    setSelectedPhoto(url);
  };

  const handleCloseModal = (): void => {
    setSelectedPhoto(null);
  };

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAllImages = (): string[] => {
    const images: string[] = [];
    if (bar?.coverImage) images.push(bar.coverImage);
    if (bar?.imageUrls && bar.imageUrls.length > 0) {
      images.push(...bar.imageUrls);
    }
    return images;
  };

  const isOpen = calculateIsOpen(bar?.operatingHours);
  const todayHours = getTodayHours(bar?.operatingHours);
  const allImages = getAllImages();
  const hasVipPasses =
    bar?.vipPassesEnhanced && bar.vipPassesEnhanced.length > 0;

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div style={{ textAlign: "center" }}>
            <p>Loading bar details...</p>
          </div>
        </LoadingState>
      </Container>
    );
  }

  if (error || !bar) {
    return (
      <Container>
        <ErrorState>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <p>{error || "Bar not found"}</p>
            <BackButton href="/app/bars">← Back to All Bars</BackButton>
          </div>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton href="/app/bars">← Back to All Bars</BackButton>

      <Header>
        <BarName>{bar.name}</BarName>
        <BarMeta>
          <Tag>{bar.cityName || "Helsinki"}</Tag>
          {bar.district && <Tag>{bar.district}</Tag>}
          <Tag>{bar.type.replace(/_/g, " ")}</Tag>
          {bar.vipEnabled && <VipTag>VIP Available</VipTag>}
          {bar.isVerified && (
            <Tag style={{ background: "#22c55e", color: "white" }}>
              ✓ Verified
            </Tag>
          )}
          {bar.socialActivity?.isHotspot && (
            <Tag
              style={{
                background: "rgba(249, 115, 22, 0.2)",
                color: "#f97316",
                border: "1px solid rgba(249, 115, 22, 0.3)",
              }}
            >
              🔥 Hotspot
            </Tag>
          )}
        </BarMeta>
        <Address>{bar.address}</Address>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <StatusBadge $isOpen={isOpen}>
            {isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </StatusBadge>
          {isOpen && todayHours && (
            <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Today: {todayHours.open} - {todayHours.close}
            </span>
          )}
          {bar.socialActivity && (
            <Tag
              style={{
                background: "rgba(59, 130, 246, 0.2)",
                color: "#3b82f6",
              }}
            >
              👥 {bar.socialActivity.activeUsersCount} people here
            </Tag>
          )}
        </div>
      </Header>

      <TabNavigation>
        <Tab
          $isActive={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Tab>
        {hasVipPasses && (
          <Tab
            $isActive={activeTab === "vip"}
            onClick={() => setActiveTab("vip")}
          >
            VIP Passes ({bar.vipPassesEnhanced.length})
          </Tab>
        )}
        {allImages.length > 0 && (
          <Tab
            $isActive={activeTab === "photos"}
            onClick={() => setActiveTab("photos")}
          >
            Photos ({allImages.length})
          </Tab>
        )}
      </TabNavigation>

      <ContentGrid>
        <MainContent>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              {bar.description && <Description>{bar.description}</Description>}

              {bar.socialActivity && (
                <SocialActivityPanel>
                  <h3>Live Activity</h3>
                  <div
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>👥</span>
                      <div>
                        <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                          {bar.socialActivity.activeUsersCount}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          People here
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>🎯</span>
                      <div>
                        <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                          {bar.socialActivity.socialMeetupsCount}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          Active meetups
                        </div>
                      </div>
                    </div>
                    {bar.socialActivity.heatLevel > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>🔥</span>
                        <div>
                          <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                            Heat Level {bar.socialActivity.heatLevel}/10
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SocialActivityPanel>
              )}

              {bar.amenities && bar.amenities.length > 0 && (
                <>
                  <h2
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    Amenities
                  </h2>
                  <FeaturesGrid>
                    {bar.amenities.map((amenity, index) => (
                      <Feature key={index}>
                        <span>✅</span>
                        <FeatureText>{amenity.replace(/_/g, " ")}</FeatureText>
                      </Feature>
                    ))}
                  </FeaturesGrid>
                </>
              )}

              {bar.operatingHours && (
                <OperatingHoursTable>
                  <h3>Operating Hours</h3>
                  {Object.entries(bar.operatingHours).map(([day, hours]) => (
                    <div key={day} className="hours-row">
                      <span className="day">{day}</span>
                      <span
                        className={`hours ${hours.open === "Closed" ? "closed" : ""}`}
                      >
                        {hours.open === "Closed"
                          ? "Closed"
                          : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </OperatingHoursTable>
              )}

              {bar.currentPromotions && bar.currentPromotions.length > 0 && (
                <>
                  <h2
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    Current Promotions
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {bar.currentPromotions.map((promo) => (
                      <PromotionCard key={promo.id} $type={promo.type}>
                        <div className="promo-header">
                          <span className="promo-icon">
                            {promo.type === "HAPPY_HOUR" && "🎉"}
                            {promo.type === "LADIES_NIGHT" && "👩‍🎤"}
                            {promo.type === "LIVE_MUSIC" && "🎵"}
                            {promo.type === "THEME_NIGHT" && "🎭"}
                            {promo.type === "DRINK_SPECIAL" && "🍹"}
                            {promo.type === "FOOD_SPECIAL" && "🍽️"}
                            {promo.type === "VIP_OFFER" && "👑"}
                          </span>
                          <div>
                            <h4 className="promo-title">{promo.title}</h4>
                            <p className="promo-description">
                              {promo.description}
                            </p>
                          </div>
                        </div>
                        <div className="promo-details">
                          <span className="promo-date">
                            {formatDate(promo.startDate)} -{" "}
                            {formatDate(promo.endDate)}
                          </span>
                          {promo.discount && (
                            <span className="promo-date">
                              {promo.discount}% OFF
                            </span>
                          )}
                          <span className="promo-views">
                            👁️ {promo.views} views
                          </span>
                        </div>
                      </PromotionCard>
                    ))}
                  </div>
                </>
              )}

              {bar.staff && bar.staff.length > 0 && (
                <>
                  <h2
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    Staff
                  </h2>
                  <FeaturesGrid>
                    {bar.staff.map((member) => (
                      <Feature key={member.id}>
                        <span>👤</span>
                        <div>
                          <FeatureText>{member.name}</FeatureText>
                          <div
                            style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                          >
                            {member.role.replace(/_/g, " ")}
                          </div>
                        </div>
                      </Feature>
                    ))}
                  </FeaturesGrid>
                </>
              )}
            </>
          )}

          {/* VIP PASSES TAB */}
          {activeTab === "vip" && hasVipPasses && (
            <VipPassesSection>
              <h2 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
                VIP Passes
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
                Skip the line and enjoy exclusive benefits
              </p>
              <div className="vip-passes-grid">
                {bar.vipPassesEnhanced.map((pass) => (
                  <div key={pass.id} className="vip-pass-card">
                    <div className="vip-pass-header">
                      <h3 className="vip-pass-name">{pass.name}</h3>
                      <div className="vip-pass-price">
                        <span className="current-price">
                          {formatPrice(pass.priceCents)}
                        </span>
                        {pass.originalPriceCents &&
                          pass.originalPriceCents > pass.priceCents && (
                            <span className="original-price">
                              {formatPrice(pass.originalPriceCents)}
                            </span>
                          )}
                      </div>
                    </div>
                    <p className="vip-pass-description">{pass.description}</p>
                    <div className="vip-pass-benefits">
                      {pass.benefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <span>✅</span>
                          {benefit}
                        </div>
                      ))}
                      {pass.benefits.length > 3 && (
                        <div
                          className="benefit-item"
                          style={{ color: "#8b5cf6" }}
                        >
                          +{pass.benefits.length - 3} more benefits
                        </div>
                      )}
                    </div>
                    <div className="vip-pass-details">
                      <div className="detail-item">
                        <strong>Valid:</strong> {pass.validDays.join(", ")}
                      </div>
                      <div className="detail-item">
                        <strong>Available:</strong>{" "}
                        {pass.totalQuantity - pass.soldCount} left
                      </div>
                    </div>
                    <button
                      className="buy-vip-button"
                      onClick={() => router.push(`/checkout?pass=${pass.id}`)}
                    >
                      Buy Now - {formatPrice(pass.priceCents)}
                    </button>
                  </div>
                ))}
              </div>
            </VipPassesSection>
          )}

          {/* PHOTOS TAB */}
          {activeTab === "photos" && allImages.length > 0 && (
            <PhotosSection>
              <h2 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
                Photos
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
                Explore the atmosphere of {bar.name}
              </p>

              {bar.coverImage && (
                <div
                  className="cover-photo"
                  onClick={() => handlePhotoClick(bar.coverImage!)}
                >
                  <img src={bar.coverImage} alt={`${bar.name} cover`} />
                </div>
              )}

              {bar.imageUrls && bar.imageUrls.length > 0 && (
                <div className="photos-grid">
                  {bar.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="photo-card"
                      onClick={() => handlePhotoClick(url)}
                    >
                      <img src={url} alt={`${bar.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </PhotosSection>
          )}
        </MainContent>

        <Sidebar>
          {bar.vipEnabled && (
            <>
              {bar.vipPrice && (
                <VipPrice>VIP from {formatPrice(bar.vipPrice * 100)}</VipPrice>
              )}
              <ActionButton onClick={handleVipClick}>
                {hasVipPasses ? "View VIP Passes" : "Get VIP Access"}
              </ActionButton>
            </>
          )}

          <div className="quick-info">
            <h3>Quick Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>📍 Location:</strong>
                <span>{bar.cityName || "Helsinki"}</span>
              </div>
              {bar.district && (
                <div className="info-item">
                  <strong>🏘️ District:</strong>
                  <span>{bar.district}</span>
                </div>
              )}
              <div className="info-item">
                <strong>🏷️ Type:</strong>
                <span>{bar.type.replace(/_/g, " ")}</span>
              </div>
              {bar.priceRange && (
                <div className="info-item">
                  <strong>💰 Price Range:</strong>
                  <span>{bar.priceRange.replace(/_/g, " ")}</span>
                </div>
              )}
              {bar.capacity && (
                <div className="info-item">
                  <strong>👥 Capacity:</strong>
                  <span>{bar.capacity} people</span>
                </div>
              )}
              {bar.phone && (
                <div className="info-item">
                  <strong>📞 Phone:</strong>
                  <span>{bar.phone}</span>
                </div>
              )}
              {bar.email && (
                <div className="info-item">
                  <strong>📧 Email:</strong>
                  <span>{bar.email}</span>
                </div>
              )}
              {bar.website && (
                <div className="info-item">
                  <strong>🌐 Website:</strong>
                  <a
                    href={bar.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </div>
              )}
              {bar.instagram && (
                <div className="info-item">
                  <strong>📷 Instagram:</strong>
                  <a
                    href={`https://instagram.com/${bar.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{bar.instagram.replace("@", "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {(bar.profileViews > 0 || bar.directionClicks > 0) && (
            <div className="quick-info">
              <h3>Engagement</h3>
              <div className="info-grid">
                {bar.profileViews > 0 && (
                  <div className="info-item">
                    <strong>👁️ Profile Views:</strong>
                    <span>{bar.profileViews.toLocaleString()}</span>
                  </div>
                )}
                {bar.directionClicks > 0 && (
                  <div className="info-item">
                    <strong>📍 Direction Clicks:</strong>
                    <span>{bar.directionClicks.toLocaleString()}</span>
                  </div>
                )}
                {bar.callClicks > 0 && (
                  <div className="info-item">
                    <strong>📞 Call Clicks:</strong>
                    <span>{bar.callClicks.toLocaleString()}</span>
                  </div>
                )}
                {bar.shareCount > 0 && (
                  <div className="info-item">
                    <strong>🔄 Shares:</strong>
                    <span>{bar.shareCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <MapSection>
            <h3>Location</h3>
            <div className="map-placeholder">
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "8px",
                  padding: "2rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  border: "1px solid #334155",
                }}
              >
                🗺️ Map View
                <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  {bar.address}
                </div>
                {bar.latitude && bar.longitude && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "0.25rem",
                      color: "#64748b",
                    }}
                  >
                    📍 {bar.latitude.toFixed(4)}, {bar.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            </div>
          </MapSection>
        </Sidebar>
      </ContentGrid>

      {selectedPhoto && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalImage src={selectedPhoto} alt="Full size" />
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BarDetails;
