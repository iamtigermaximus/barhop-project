"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
import {
  ActionButtons,
  BackButton,
  BarDetails,
  BarName,
  BarsSection,
  CancelButton,
  ConfirmButton,
  CrawlContainer,
  CrawlDescription,
  CrawlHeader,
  CrawlName,
  DeleteButton,
  DetailCard,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  DistanceBadge,
  EditButton,
  JoinButton,
  LyftButton,
  ModalButtons,
  ModalContent,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
  Page,
  Participant,
  ParticipantsList,
  ParticipantsSection,
  RideShareButtons,
  RouteMap,
  RouteStep,
  RouteSummary,
  SectionTitle,
  ShareButton,
  StatusBadge,
  StepContent,
  StepHeader,
  StepNumber,
  SummaryGrid,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  TimeEstimate,
  Title,
  TravelInfo,
  UberButton,
  WeatherAlert,
} from "./CreatedCrawlDetails.styles";
import GroupChat from "@/components/app/chat/GroupChat";

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
  chatroom?: {
    id: string;
  };
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
export const getMockWeather = (city: string, date: string): WeatherData => {
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

const CreatedCrawlDetails = () => {
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
  const [showChat, setShowChat] = useState(false);

  const crawlId = params.id as string;

  useEffect(() => {
    const fetchCrawl = async () => {
      try {
        const response = await fetch(`/api/crawls/${crawlId}?includeChat=true`);
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
      // Use router to navigate to signin page
      router.push("/app/auth/signin");
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`/api/crawls/${crawlId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh crawl data to update participants
        const updatedCrawl = await fetch(
          `/api/crawls/${crawlId}?includeChat=true`
        ).then((res) => res.json());
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
        router.push("/app/my-crawls");
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

  // back button text and link based on authentication
  const getBackButtonProps = () => {
    if (session) {
      return {
        text: "Back to My Crawls",
        href: "/app/my-crawls",
      };
    } else {
      return {
        text: "Back to Crawls",
        href: "/app/crawls-dashboard",
      };
    }
  };

  const backButtonProps = getBackButtonProps();

  // Check if user can see the Join button
  const canSeeJoinButton = () => {
    if (!crawl) return false;

    // User cannot be the creator
    if (isUserCreator) return false;

    // User cannot be already in the crawl
    if (isUserParticipant) return false;

    // Crawl cannot be full
    if (isCrawlFull) return false;

    // Crawl must be in a joinable status
    if (!(crawl.status === "PLANNING" || crawl.status === "UPCOMING"))
      return false;

    return true;
  };

  // Get the appropriate join button text and behavior
  const getJoinButtonProps = () => {
    if (!crawl) return { text: "Join Crawl", onClick: () => {} };

    if (isJoining) {
      return { text: "Joining...", onClick: () => {} };
    }

    // For non-logged-in users, show "Sign In to Join" that redirects to sign-in
    if (!session) {
      return {
        text: "Login to Join",
        onClick: () => {
          router.push("/app/auth/login");
        },
      };
    }

    // For logged-in users who can join
    return {
      text: "Join Crawl",
      onClick: handleJoinCrawl,
    };
  };

  const joinButtonProps = getJoinButtonProps();

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
          <BackButton href={backButtonProps.href}>
            {backButtonProps.text}
          </BackButton>
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
          {/* Show Join button for users who can join (including non-logged-in) */}
          {canSeeJoinButton() && (
            <JoinButton
              onClick={joinButtonProps.onClick}
              $joined={false}
              disabled={isJoining && !!session}
            >
              {joinButtonProps.text}
            </JoinButton>
          )}

          {/* Show appropriate state buttons */}
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

          {/* 🆕 ADD CHAT BUTTON HERE - Only show if user is participant/creator AND crawl has chatroom */}
          {(isUserParticipant || isUserCreator) && crawl?.chatroom && (
            <button
              onClick={() => setShowChat(true)}
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            >
              <span>💬</span>
              Group Chat ({crawl._count.participants} people)
            </button>
          )}

          <ShareButton onClick={handleShareCrawl}>Share Crawl</ShareButton>

          <BackButton href={backButtonProps.href}>
            {backButtonProps.text}
          </BackButton>
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

      {/* 🆕 ADD GROUP CHAT MODAL */}
      {showChat && crawl?.chatroom && (
        <GroupChat
          crawlId={crawl.id}
          chatroomId={crawl.chatroom.id}
          onClose={() => setShowChat(false)}
        />
      )}
    </Page>
  );
};

export default CreatedCrawlDetails;
