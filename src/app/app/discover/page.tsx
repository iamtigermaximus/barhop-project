"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Crown,
  Star,
  Fire,
  Clock,
  Users,
  Wine,
} from "phosphor-react";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};
  padding: 16px;
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding-left: 256px;
    padding-right: 32px;
    padding-bottom: 32px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  margin-top: 32px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const ViewAllLink = styled.button`
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.3s;

  &:hover {
    gap: 8px;
  }
`;

// Horizontal scroll container for all cards
const HorizontalScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    width: 160px;
    scroll-snap-align: start;

    @media (min-width: 768px) {
      width: 192px;
    }
  }
`;

// VIP Pass Card
const VIPCard = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-4px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const VIPImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const VIPImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VIPBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const VIPContent = styled.div`
  padding: 8px;
`;

const VIPName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const VIPBarName = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const VIPPrice = styled.span`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-size: 14px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 10px;
  }
`;

// Promotion Card
const PromotionCard = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-4px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PromotionImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PromotionDiscount = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PromotionType = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PromotionContent = styled.div`
  padding: 8px;
`;

const PromotionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const PromotionBar = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PromotionPrice = styled.span`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-size: 14px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 10px;
  }
`;

// Event Card
const EventCard = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-4px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventStatus = styled.div<{ $status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${(props) => {
    switch (props.$status) {
      case "ACTIVE":
        return "rgba(16, 185, 129, 0.9)";
      case "UPCOMING":
        return "rgba(139, 92, 246, 0.9)";
      default:
        return "rgba(245, 158, 11, 0.9)";
    }
  }};
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const EventContent = styled.div`
  padding: 8px;
`;

const EventName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const EventDate = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EventParticipants = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 60px;
  height: 3px;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.$percentage}%;
    background: linear-gradient(90deg, #10b981, #0ea5e9);
    border-radius: 2px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Types
interface VIPPass {
  id: string;
  name: string;
  description: string | null;
  type: string;
  priceCents?: number;
  price?: number;
  barId: string;
  bar?: {
    id: string;
    name: string;
    district?: string;
    city?: string;
  };
  benefits: string[];
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: { id: string; name: string; district?: string };
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  accentColor?: string | null;
  callToAction?: string | null;
  isActive?: boolean;
  isApproved?: boolean;
}

interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  city?: { name: string };
  crawlBars?: Array<{ bar: { name: string } }>;
  status: string;
}

// Helper functions
const getPlaceholderImage = (): string => {
  return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
};

const getEventImage = (): string => {
  return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg";
};

const getVIPImage = (): string => {
  return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
};

const getPriceInEuros = (pass: VIPPass): number => {
  if (pass.priceCents !== undefined && pass.priceCents !== null) {
    return pass.priceCents / 100;
  }
  if (pass.price !== undefined && pass.price !== null) {
    const price = pass.price;
    return price > 100 ? price / 100 : price;
  }
  return 0;
};

export default function DiscoverPage() {
  const router = useRouter();
  const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [upcomingPromotions, setUpcomingPromotions] = useState<Promotion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  const fetchDiscoverData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vipRes, promotionsRes, eventsRes] = await Promise.all([
        fetch("/api/vip/passes?limit=20&isActive=true"),
        fetch(
          "/api/promotions?isActive=true&isApproved=true&limit=30&includeUpcoming=true",
        ),
        fetch("/api/crawls?limit=20&status=UPCOMING"),
      ]);

      // Fetch VIP passes
      if (vipRes.ok) {
        const vipData = await vipRes.json();
        let vipArray = vipData.passes || vipData.data || vipData;
        if (!Array.isArray(vipArray)) vipArray = [];
        setVipPasses(vipArray);
      }

      // Fetch and filter promotions
      if (promotionsRes.ok) {
        const data = await promotionsRes.json();
        let promosArray = data.promotions || data.data || data;
        if (!Array.isArray(promosArray)) promosArray = [];

        const now = new Date();
        const active: Promotion[] = [];
        const upcoming: Promotion[] = [];

        promosArray.forEach((promo: Promotion) => {
          if (promo.startDate && promo.endDate) {
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);

            if (startDate <= now && endDate >= now) {
              active.push(promo);
            } else if (startDate > now) {
              upcoming.push(promo);
            }
          }
        });

        setActivePromotions(active.slice(0, 10));
        setUpcomingPromotions(upcoming.slice(0, 10));
      }

      // Fetch events
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        let eventsArray = eventsData.crawls || eventsData.data || eventsData;
        if (!Array.isArray(eventsArray)) eventsArray = [];
        setEvents(eventsArray.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching discover data:", error);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPromotionTypeIcon = (type: string): string => {
    switch (type) {
      case "HAPPY_HOUR":
        return "🍻";
      case "DRINK_SPECIAL":
        return "🍹";
      case "FOOD_SPECIAL":
        return "🍽️";
      case "LADIES_NIGHT":
        return "👩‍🎤";
      case "VIP_OFFER":
        return "👑";
      default:
        return "🎉";
    }
  };

  const getPromotionTypeLabel = (type: string): string => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getEventStatusText = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Live";
      case "UPCOMING":
        return "Soon";
      default:
        return "Join";
    }
  };

  const getEventPercentage = (event: Event) => {
    return Math.round(
      (event.currentParticipants / event.maxParticipants) * 100,
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>Discover amazing offers and events...</LoadingState>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <Header>
            <BackButton onClick={() => router.push("/app")}>
              <ArrowLeft size={20} />
            </BackButton>
            <Title>Discover</Title>
          </Header>
          <EmptyState>
            <p>{error}</p>
            <ViewAllLink
              onClick={() => fetchDiscoverData()}
              style={{ marginTop: 16 }}
            >
              Try Again →
            </ViewAllLink>
          </EmptyState>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <BackButton onClick={() => router.push("/app")}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Discover</Title>
        </Header>

        {/* Active Promotions Section */}
        {activePromotions.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>
                <Fire size={24} weight="fill" />
                Active Promotions
              </SectionTitle>
              <ViewAllLink
                onClick={() => router.push("/app/promotions?tab=active")}
              >
                View all →
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {activePromotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  onClick={() => router.push(`/app/promotions/${promo.id}`)}
                >
                  <PromotionImageWrapper>
                    <PromotionImage
                      src={promo.imageUrl || getPlaceholderImage()}
                      alt={promo.title}
                    />
                    {promo.discount && promo.discount > 0 && (
                      <PromotionDiscount>
                        {promo.discount}% OFF
                      </PromotionDiscount>
                    )}
                    <PromotionType>
                      {getPromotionTypeIcon(promo.type)}{" "}
                      {getPromotionTypeLabel(promo.type)}
                    </PromotionType>
                  </PromotionImageWrapper>
                  <PromotionContent>
                    <PromotionTitle>{promo.title}</PromotionTitle>
                    <PromotionBar>
                      <MapPin size={10} /> {promo.bar?.name || "Venue"}
                    </PromotionBar>
                    <PromotionPrice>
                      {promo.discount && promo.discount > 0
                        ? Math.round(30 - (30 * promo.discount) / 100)
                        : "Special"}
                    </PromotionPrice>
                  </PromotionContent>
                </PromotionCard>
              ))}
            </HorizontalScroll>
          </>
        )}

        {/* Upcoming Promotions Section */}
        {upcomingPromotions.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>
                <Clock size={24} />
                Upcoming Promotions
              </SectionTitle>
              <ViewAllLink
                onClick={() => router.push("/app/promotions?tab=upcoming")}
              >
                View all →
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {upcomingPromotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  onClick={() => router.push(`/app/promotions/${promo.id}`)}
                >
                  <PromotionImageWrapper>
                    <PromotionImage
                      src={promo.imageUrl || getPlaceholderImage()}
                      alt={promo.title}
                    />
                    <PromotionType>
                      {getPromotionTypeIcon(promo.type)}{" "}
                      {getPromotionTypeLabel(promo.type)}
                    </PromotionType>
                  </PromotionImageWrapper>
                  <PromotionContent>
                    <PromotionTitle>{promo.title}</PromotionTitle>
                    <PromotionBar>
                      <MapPin size={10} /> {promo.bar?.name || "Venue"}
                    </PromotionBar>
                    <PromotionPrice>Coming soon</PromotionPrice>
                  </PromotionContent>
                </PromotionCard>
              ))}
            </HorizontalScroll>
          </>
        )}

        {/* Events Section */}
        {events.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>
                <Calendar size={24} />
                Events
              </SectionTitle>
              <ViewAllLink onClick={() => router.push("/app/events")}>
                View all →
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  onClick={() => router.push(`/app/events/${event.id}`)}
                >
                  <EventImageWrapper>
                    <EventImage src={getEventImage()} alt={event.name} />
                    <EventStatus $status={event.status}>
                      {getEventStatusText(event.status)}
                    </EventStatus>
                  </EventImageWrapper>
                  <EventContent>
                    <EventName>{event.name}</EventName>
                    <EventDate>
                      <Calendar size={10} />{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </EventDate>
                    <EventParticipants>
                      <span>
                        <Users size={10} /> {event.currentParticipants}/
                        {event.maxParticipants}
                      </span>
                      <ProgressBar $percentage={getEventPercentage(event)} />
                    </EventParticipants>
                    {event.crawlBars && event.crawlBars.length > 0 && (
                      <EventParticipants style={{ marginTop: 4 }}>
                        <span>
                          <Wine size={10} /> {event.crawlBars.length} venues
                        </span>
                      </EventParticipants>
                    )}
                  </EventContent>
                </EventCard>
              ))}
            </HorizontalScroll>
          </>
        )}
        {/* VIP Passes Section */}
        {vipPasses.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>
                <Crown size={24} weight="fill" />
                VIP Passes
              </SectionTitle>
              <ViewAllLink onClick={() => router.push("/app/vip-passes")}>
                View all →
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {vipPasses.map((pass) => {
                const priceInEuros = getPriceInEuros(pass);
                return (
                  <VIPCard
                    key={pass.id}
                    onClick={() => router.push(`/app/vip-pass/${pass.id}`)}
                  >
                    <VIPImageWrapper>
                      <VIPImage src={getVIPImage()} alt={pass.name} />
                      <VIPBadge>
                        <Star size={10} weight="fill" color="#FF6B35" />
                        <span>VIP</span>
                      </VIPBadge>
                    </VIPImageWrapper>
                    <VIPContent>
                      <VIPName>{pass.name}</VIPName>
                      <VIPBarName>
                        <MapPin size={10} /> {pass.bar?.name || "Premium Venue"}
                      </VIPBarName>
                      <VIPPrice>{priceInEuros.toFixed(2)}</VIPPrice>
                    </VIPContent>
                  </VIPCard>
                );
              })}
            </HorizontalScroll>
          </>
        )}

        {/* Empty State */}
        {vipPasses.length === 0 &&
          activePromotions.length === 0 &&
          upcomingPromotions.length === 0 &&
          events.length === 0 && (
            <EmptyState>
              <p>No offers or events available at the moment.</p>
              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                Check back soon!
              </p>
            </EmptyState>
          )}
      </Container>
    </PageWrapper>
  );
}
