"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HopprLoader } from "@/components/ui/Loader/HopprLoader";

const Page = styled.div`
  padding: 2rem 1rem;
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  min-height: calc(100vh - 70px);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
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
`;

const CrawlContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CrawlHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CrawlName = styled.h2`
  font-size: 2rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CrawlDescription = styled.p`
  color: #e2e8f0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DetailCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #8b5cf6;
`;

const DetailLabel = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  color: #f8fafc;
  font-size: 1.125rem;
  font-weight: 600;
`;

const BarsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
  padding-bottom: 0.5rem;
`;

// Enhanced Route Components
const RouteMap = styled.div`
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const RouteStep = styled.div<{ $isLast: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const BarName = styled.div`
  color: #f8fafc;
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
  min-width: 200px;
`;

// Fix: Provide default value for $walkable
const DistanceBadge = styled.span<{ $walkable?: boolean }>`
  background: ${(props) =>
    props.$walkable
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #f59e0b, #d97706)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const BarDetails = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

// Fix: Provide default value for $walkable
const TravelInfo = styled.div<{ $walkable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 6px;
  border-left: 3px solid ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
`;

const RideShareButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const RideShareButton = styled.a`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const UberButton = styled(RideShareButton)`
  background: #000;
  color: white;
`;

const LyftButton = styled(RideShareButton)`
  background: #ff00bf;
  color: white;
`;

const TimeEstimate = styled.div`
  color: #8b5cf6;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

const RouteSummary = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

const SummaryValue = styled.div`
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const SummaryLabel = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
`;

// Fix: Provide default value for $isGood
const WeatherAlert = styled.div<{ $isGood?: boolean }>`
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  background: ${(props) =>
    props.$isGood ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$isGood ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"};
  color: ${(props) => (props.$isGood ? "#10b981" : "#f59e0b")};
`;

const ParticipantsSection = styled.div`
  margin-bottom: 2rem;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Participant = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const JoinButton = styled.button<{ $joined: boolean }>`
  background: ${(props) =>
    props.$joined
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ShareButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
  }
`;

const BackButton = styled(Link)`
  background: transparent;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: rgba(100, 116, 139, 0.6);
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const EditButton = styled(Link)`
  background: linear-gradient(45deg, #f59e0b, #d97706);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  background: ${(props) =>
    props.$status === "PLANNING"
      ? "linear-gradient(45deg, #0ea5e9, #3b82f6)"
      : props.$status === "UPCOMING"
      ? "linear-gradient(45deg, #8b5cf6, #a855f7)"
      : props.$status === "ACTIVE"
      ? "linear-gradient(45deg, #10b981, #059669)"
      : props.$status === "COMPLETED"
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #f8fafc;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  color: #e2e8f0;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: rgba(100, 116, 139, 0.6);
    transform: translateY(-2px);
  }
`;

interface Bar {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  crawlBars: Array<{
    orderIndex: number;
    bar: Bar;
  }>;
  _count: {
    participants: number;
  };
}

interface BarWithDistance {
  bar: Bar;
  orderIndex: number;
  distanceToNext?: number;
  travelTime?: number;
  isWalkable?: boolean;
  estimatedArrival?: string;
}

interface RouteSummary {
  totalDistance: number;
  totalWalkTime: number;
  totalDriveTime: number;
  maxWalkDistance: number;
  needsTransportation: boolean;
}

interface WeatherData {
  temperature: number;
  condition: string;
  isGoodForCrawl: boolean;
  description: string;
}

// Utility function to calculate distance between coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
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

// Mock weather data - in a real app, you'd fetch this from a weather API
const getMockWeather = (city: string, date: string): WeatherData => {
  const conditions = ["Sunny", "Partly Cloudy", "Clear", "Cloudy"];
  const randomCondition =
    conditions[Math.floor(Math.random() * conditions.length)];

  return {
    temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
    condition: randomCondition,
    isGoodForCrawl: !["Rainy", "Stormy", "Snowy"].includes(randomCondition),
    description: `${randomCondition} and pleasant for a crawl`,
  };
};

export default function CreatedCrawlDetails() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [crawl, setCrawl] = useState<Crawl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedBars, setEnhancedBars] = useState<BarWithDistance[]>([]);
  const [routeSummary, setRouteSummary] = useState<RouteSummary>({
    totalDistance: 0,
    totalWalkTime: 0,
    totalDriveTime: 0,
    maxWalkDistance: 0,
    needsTransportation: false,
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const crawlId = params.id as string;

  useEffect(() => {
    const fetchCrawl = async () => {
      try {
        const response = await fetch(`/api/crawls/${crawlId}`);
        if (response.ok) {
          const crawlData = await response.json();
          setCrawl(crawlData);

          // Fetch mock weather data
          const weatherData = getMockWeather(
            crawlData.city.name,
            crawlData.date
          );
          setWeather(weatherData);
        } else {
          setError("Crawl not found");
        }
      } catch (error) {
        console.error("Error fetching crawl:", error);
        setError("Failed to load crawl");
      } finally {
        setIsLoading(false);
      }
    };

    if (crawlId) {
      fetchCrawl();
    }
  }, [crawlId]);

  useEffect(() => {
    const calculateRouteMetrics = () => {
      if (!crawl?.crawlBars.length) return;

      const sortedBars = [...crawl.crawlBars].sort(
        (a, b) => a.orderIndex - b.orderIndex
      );
      const enhanced: BarWithDistance[] = [];

      let totalDistance = 0;
      let maxWalkDistance = 0;
      const currentTime = new Date(`${crawl.date}T${crawl.startTime}`);

      for (let i = 0; i < sortedBars.length; i++) {
        const currentBar = sortedBars[i];
        const nextBar = sortedBars[i + 1];

        let distanceToNext = 0;
        let travelTime = 0;
        let isWalkable = false;

        // Calculate arrival time for current bar
        const estimatedArrival = currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        if (nextBar) {
          // Calculate distance between current and next bar
          distanceToNext = calculateDistance(
            currentBar.bar.latitude,
            currentBar.bar.longitude,
            nextBar.bar.latitude,
            nextBar.bar.longitude
          );

          // Convert to miles (1km = 0.621371 miles)
          distanceToNext = distanceToNext * 0.621371;

          // Walking time (assuming 3 mph average walking speed)
          travelTime = (distanceToNext / 3) * 60; // in minutes

          // Consider walkable if under 0.5 miles
          isWalkable = distanceToNext <= 0.5;

          totalDistance += distanceToNext;
          maxWalkDistance = Math.max(maxWalkDistance, distanceToNext);
        }

        enhanced.push({
          ...currentBar,
          distanceToNext,
          travelTime,
          isWalkable,
          estimatedArrival,
        });

        // Update time for next bar (45 minutes at current bar + travel time)
        currentTime.setMinutes(currentTime.getMinutes() + 45); // 45 minutes at bar
        if (travelTime > 0) {
          currentTime.setMinutes(currentTime.getMinutes() + travelTime);
        }
      }

      setEnhancedBars(enhanced);
      setRouteSummary({
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalWalkTime: Math.round((totalDistance / 3) * 60),
        totalDriveTime: Math.round((totalDistance / 25) * 60), // assuming 25 mph average
        maxWalkDistance: Math.round(maxWalkDistance * 10) / 10,
        needsTransportation: maxWalkDistance > 0.5,
      });
    };

    calculateRouteMetrics();
  }, [crawl]);

  const handleJoinCrawl = async () => {
    if (!session) {
      router.push(`/auth/signin?redirect=/crawls/${crawlId}`);
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`/api/crawls/${crawlId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh crawl data to update participants
        const updatedCrawl = await fetch(`/api/crawls/${crawlId}`).then((res) =>
          res.json()
        );
        setCrawl(updatedCrawl);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to join crawl");
      }
    } catch (error) {
      console.error("Error joining crawl:", error);
      setError("Failed to join crawl");
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteCrawl = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/crawls/${crawlId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/my-crawls");
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete crawl");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting crawl:", error);
      setError("Failed to delete crawl");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareCrawl = async () => {
    if (!crawl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${crawl.name}`,
          text: `Join this amazing bar crawl in ${crawl.city.name}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Crawl link copied to clipboard! 📋");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getRideShareLink = (
    fromAddress: string,
    toAddress: string,
    service: "uber" | "lyft"
  ) => {
    if (service === "uber") {
      return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(
        fromAddress
      )}&dropoff[formatted_address]=${encodeURIComponent(toAddress)}`;
    } else {
      return `https://lyft.com/ride?id=lyft&pickup[formatted_address]=${encodeURIComponent(
        fromAddress
      )}&destination[formatted_address]=${encodeURIComponent(toAddress)}`;
    }
  };

  const isUserParticipant =
    session && crawl?.participants.some((p) => p.userId === session.user.id);

  const isCrawlFull =
    crawl && crawl._count.participants >= crawl.maxParticipants;
  const isUserCreator = session && crawl?.creator.id === session.user.id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <Page>
        <HopprLoader />
      </Page>
    );
  }

  if (error || !crawl) {
    return (
      <Page>
        <Title>Crawl Not Found</Title>
        <CrawlContainer style={{ textAlign: "center" }}>
          <p style={{ color: "#e2e8f0", marginBottom: "2rem" }}>
            {error || "The crawl you're looking for doesn't exist."}
          </p>
          <BackButton href="/my-crawls">Back to My Crawls</BackButton>
        </CrawlContainer>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Bar Crawl Details</Title>

      <CrawlContainer>
        <CrawlHeader>
          <CrawlName>{crawl.name}</CrawlName>
          <CrawlDescription>{crawl.description}</CrawlDescription>
          <div style={{ marginTop: "1rem" }}>
            <StatusBadge $status={crawl.status}>
              {crawl.status.toLowerCase()}
            </StatusBadge>
          </div>
        </CrawlHeader>

        <DetailsGrid>
          <DetailCard>
            <DetailLabel>Date & Time</DetailLabel>
            <DetailValue>
              {formatDate(crawl.date)} at {formatTime(crawl.startTime)}
            </DetailValue>
          </DetailCard>

          <DetailCard>
            <DetailLabel>City</DetailLabel>
            <DetailValue>{crawl.city.name}</DetailValue>
          </DetailCard>

          <DetailCard>
            <DetailLabel>Participants</DetailLabel>
            <DetailValue>
              {crawl._count.participants} / {crawl.maxParticipants}
            </DetailValue>
          </DetailCard>

          <DetailCard>
            <DetailLabel>Organizer</DetailLabel>
            <DetailValue>{crawl.creator.name}</DetailValue>
          </DetailCard>
        </DetailsGrid>

        {/* Weather Alert */}
        {weather && (
          <WeatherAlert
            $isGood={weather.isGoodForCrawl}
            style={{ marginBottom: "1.5rem" }}
          >
            {weather.isGoodForCrawl ? "☀️" : "🌧️"} Weather:{" "}
            {weather.temperature}°F and {weather.description}
          </WeatherAlert>
        )}

        <BarsSection>
          <SectionTitle>Crawl Route</SectionTitle>

          {/* Route Summary */}
          <RouteSummary>
            <SummaryGrid>
              <SummaryItem>
                <SummaryValue>{routeSummary.totalDistance} mi</SummaryValue>
                <SummaryLabel>Total Distance</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>
                  {routeSummary.needsTransportation ? "🚗" : "🚶"}
                </SummaryValue>
                <SummaryLabel>
                  {routeSummary.needsTransportation
                    ? "Transport Needed"
                    : "Walkable"}
                </SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{routeSummary.totalWalkTime} min</SummaryValue>
                <SummaryLabel>Walking Time</SummaryLabel>
              </SummaryItem>
              <SummaryItem>
                <SummaryValue>{enhancedBars.length}</SummaryValue>
                <SummaryLabel>Total Stops</SummaryLabel>
              </SummaryItem>
            </SummaryGrid>

            {routeSummary.needsTransportation && (
              <WeatherAlert $isGood={false}>
                🚗 Transportation recommended - longest walk is{" "}
                {routeSummary.maxWalkDistance} miles
              </WeatherAlert>
            )}
          </RouteSummary>

          {/* Enhanced Route Map */}
          <RouteMap>
            {enhancedBars.map((crawlBar, index) => (
              <RouteStep
                key={crawlBar.bar.id}
                $isLast={index === enhancedBars.length - 1}
              >
                <StepNumber>{crawlBar.orderIndex}</StepNumber>
                <StepContent>
                  <StepHeader>
                    <BarName>{crawlBar.bar.name}</BarName>
                    {crawlBar.distanceToNext && crawlBar.distanceToNext > 0 && (
                      <DistanceBadge $walkable={crawlBar.isWalkable}>
                        {crawlBar.distanceToNext.toFixed(1)} mi
                      </DistanceBadge>
                    )}
                  </StepHeader>

                  <BarDetails>
                    {crawlBar.bar.type.replace("_", " ")} •{" "}
                    {crawlBar.bar.address}
                  </BarDetails>

                  {crawlBar.estimatedArrival && (
                    <TimeEstimate>
                      {/* 🕐 Arrive around {crawlBar.estimatedArrival} */}
                    </TimeEstimate>
                  )}

                  {crawlBar.distanceToNext && crawlBar.distanceToNext > 0 && (
                    <>
                      <TravelInfo $walkable={crawlBar.isWalkable}>
                        {crawlBar.isWalkable ? (
                          <>
                            <span>🚶</span>
                            <span>
                              Walk {crawlBar.travelTime?.toFixed(0)} min to next
                              bar
                            </span>
                          </>
                        ) : (
                          <>
                            <span>🚗</span>
                            <span>
                              Drive {crawlBar.travelTime?.toFixed(0)} min to
                              next bar
                            </span>
                          </>
                        )}
                      </TravelInfo>

                      {!crawlBar.isWalkable && enhancedBars[index + 1] && (
                        <RideShareButtons>
                          <UberButton
                            href={getRideShareLink(
                              crawlBar.bar.address,
                              enhancedBars[index + 1].bar.address,
                              "uber"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Uber
                          </UberButton>
                          <LyftButton
                            href={getRideShareLink(
                              crawlBar.bar.address,
                              enhancedBars[index + 1].bar.address,
                              "lyft"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lyft
                          </LyftButton>
                        </RideShareButtons>
                      )}
                    </>
                  )}
                </StepContent>
              </RouteStep>
            ))}
          </RouteMap>
        </BarsSection>

        <ParticipantsSection>
          <SectionTitle>
            Participants ({crawl._count.participants})
          </SectionTitle>
          <ParticipantsList>
            {crawl.participants.map((participant) => (
              <Participant key={participant.userId}>
                {participant.user.name}
                {participant.userId === crawl.creator.id && " 👑"}
              </Participant>
            ))}
          </ParticipantsList>
        </ParticipantsSection>

        <ActionButtons>
          {/* Regular user actions */}
          {!isUserCreator && !isUserParticipant && !isCrawlFull && (
            <JoinButton
              onClick={handleJoinCrawl}
              $joined={false}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Crawl"}
            </JoinButton>
          )}

          {isUserParticipant && (
            <JoinButton $joined={true} disabled>
              Already Joined
            </JoinButton>
          )}

          {isCrawlFull && !isUserParticipant && (
            <JoinButton $joined={false} disabled>
              Crawl Full
            </JoinButton>
          )}

          {/* Creator actions */}
          {isUserCreator && (
            <>
              <EditButton href={`/crawl-planner/edit/${crawlId}`}>
                Edit Crawl
              </EditButton>
              <DeleteButton
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Crawl"}
              </DeleteButton>
            </>
          )}

          <ShareButton onClick={handleShareCrawl}>Share Crawl</ShareButton>

          <BackButton href="/my-crawls">Back to My Crawls</BackButton>
        </ActionButtons>
      </CrawlContainer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Delete Crawl</ModalTitle>
            <ModalMessage>
              Are you sure you want to delete &quot;{crawl.name}&quot;? This
              action cannot be undone and all participants will be removed from
              the crawl.
            </ModalMessage>
            <ModalButtons>
              <CancelButton onClick={() => setShowDeleteModal(false)}>
                Cancel
              </CancelButton>
              <ConfirmButton onClick={handleDeleteCrawl} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
}
