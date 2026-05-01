// "use client";
// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
// import {
//   ActionButtons,
//   BackButton,
//   BarDetails,
//   BarName,
//   BarsSection,
//   CancelButton,
//   ConfirmButton,
//   CrawlContainer,
//   CrawlDescription,
//   CrawlHeader,
//   CrawlName,
//   DeleteButton,
//   DetailCard,
//   DetailLabel,
//   DetailsGrid,
//   DetailValue,
//   DistanceBadge,
//   EditButton,
//   JoinButton,
//   LyftButton,
//   ModalButtons,
//   ModalContent,
//   ModalMessage,
//   ModalOverlay,
//   ModalTitle,
//   Page,
//   Participant,
//   ParticipantsList,
//   ParticipantsSection,
//   RideShareButtons,
//   RouteMap,
//   RouteStep,
//   RouteSummary,
//   SectionTitle,
//   ShareButton,
//   StatusBadge,
//   StepContent,
//   StepHeader,
//   StepNumber,
//   SummaryGrid,
//   SummaryItem,
//   SummaryLabel,
//   SummaryValue,
//   TimeEstimate,
//   Title,
//   TravelInfo,
//   UberButton,
//   WeatherAlert,
// } from "./CreatedCrawlDetails.styles";

// interface Bar {
//   id: string;
//   name: string;
//   type: string;
//   address: string;
//   latitude: number;
//   longitude: number;
// }

// interface Crawl {
//   id: string;
//   name: string;
//   description: string;
//   date: string;
//   startTime: string;
//   maxParticipants: number;
//   status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
//   city: {
//     id: string;
//     name: string;
//   };
//   creator: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   participants: Array<{
//     userId: string;
//     user: {
//       id: string;
//       name: string;
//       email: string;
//     };
//   }>;
//   crawlBars: Array<{
//     orderIndex: number;
//     bar: Bar;
//   }>;
//   chatroom?: {
//     id: string;
//   };
//   _count: {
//     participants: number;
//   };
// }

// interface BarWithDistance {
//   bar: Bar;
//   orderIndex: number;
//   distanceToNext?: number;
//   travelTime?: number;
//   isWalkable?: boolean;
//   estimatedArrival?: string;
// }

// interface RouteSummary {
//   totalDistance: number;
//   totalWalkTime: number;
//   totalDriveTime: number;
//   maxWalkDistance: number;
//   needsTransportation: boolean;
// }

// interface WeatherData {
//   temperature: number;
//   condition: string;
//   isGoodForCrawl: boolean;
//   description: string;
// }

// // Utility function to calculate distance between coordinates (Haversine formula)
// const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number,
// ): number => {
//   const R = 6371; // Earth's radius in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// // Mock weather data - in a real app, you'd fetch this from a weather API
// export const getMockWeather = (city: string, date: string): WeatherData => {
//   const conditions = ["Sunny", "Partly Cloudy", "Clear", "Cloudy"];
//   const randomCondition =
//     conditions[Math.floor(Math.random() * conditions.length)];

//   return {
//     temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
//     condition: randomCondition,
//     isGoodForCrawl: !["Rainy", "Stormy", "Snowy"].includes(randomCondition),
//     description: `${randomCondition} and pleasant for a crawl`,
//   };
// };

// const CreatedCrawlDetails = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { data: session, status: sessionStatus } = useSession();
//   const [crawl, setCrawl] = useState<Crawl | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isJoining, setIsJoining] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [enhancedBars, setEnhancedBars] = useState<BarWithDistance[]>([]);
//   const [routeSummary, setRouteSummary] = useState<RouteSummary>({
//     totalDistance: 0,
//     totalWalkTime: 0,
//     totalDriveTime: 0,
//     maxWalkDistance: 0,
//     needsTransportation: false,
//   });
//   const [weather, setWeather] = useState<WeatherData | null>(null);

//   const crawlId = params.id as string;

//   useEffect(() => {
//     const fetchCrawl = async () => {
//       try {
//         const response = await fetch(`/api/crawls/${crawlId}?includeChat=true`);
//         if (response.ok) {
//           const crawlData = await response.json();
//           setCrawl(crawlData);

//           // Fetch mock weather data
//           const weatherData = getMockWeather(
//             crawlData.city.name,
//             crawlData.date,
//           );
//           setWeather(weatherData);
//         } else {
//           setError("Crawl not found");
//         }
//       } catch (error) {
//         console.error("Error fetching crawl:", error);
//         setError("Failed to load crawl");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (crawlId) {
//       fetchCrawl();
//     }
//   }, [crawlId]);

//   useEffect(() => {
//     const calculateRouteMetrics = () => {
//       if (!crawl?.crawlBars.length) return;

//       const sortedBars = [...crawl.crawlBars].sort(
//         (a, b) => a.orderIndex - b.orderIndex,
//       );
//       const enhanced: BarWithDistance[] = [];

//       let totalDistance = 0;
//       let maxWalkDistance = 0;
//       const currentTime = new Date(`${crawl.date}T${crawl.startTime}`);

//       for (let i = 0; i < sortedBars.length; i++) {
//         const currentBar = sortedBars[i];
//         const nextBar = sortedBars[i + 1];

//         let distanceToNext = 0;
//         let travelTime = 0;
//         let isWalkable = false;

//         // Calculate arrival time for current bar
//         const estimatedArrival = currentTime.toLocaleTimeString("en-US", {
//           hour: "numeric",
//           minute: "2-digit",
//           hour12: true,
//         });

//         if (nextBar) {
//           // Calculate distance between current and next bar
//           distanceToNext = calculateDistance(
//             currentBar.bar.latitude,
//             currentBar.bar.longitude,
//             nextBar.bar.latitude,
//             nextBar.bar.longitude,
//           );

//           // Convert to miles (1km = 0.621371 miles)
//           distanceToNext = distanceToNext * 0.621371;

//           // Walking time (assuming 3 mph average walking speed)
//           travelTime = (distanceToNext / 3) * 60; // in minutes

//           // Consider walkable if under 0.5 miles
//           isWalkable = distanceToNext <= 0.5;

//           totalDistance += distanceToNext;
//           maxWalkDistance = Math.max(maxWalkDistance, distanceToNext);
//         }

//         enhanced.push({
//           ...currentBar,
//           distanceToNext,
//           travelTime,
//           isWalkable,
//           estimatedArrival,
//         });

//         // Update time for next bar (45 minutes at current bar + travel time)
//         currentTime.setMinutes(currentTime.getMinutes() + 45); // 45 minutes at bar
//         if (travelTime > 0) {
//           currentTime.setMinutes(currentTime.getMinutes() + travelTime);
//         }
//       }

//       setEnhancedBars(enhanced);
//       setRouteSummary({
//         totalDistance: Math.round(totalDistance * 10) / 10,
//         totalWalkTime: Math.round((totalDistance / 3) * 60),
//         totalDriveTime: Math.round((totalDistance / 25) * 60), // assuming 25 mph average
//         maxWalkDistance: Math.round(maxWalkDistance * 10) / 10,
//         needsTransportation: maxWalkDistance > 0.5,
//       });
//     };

//     calculateRouteMetrics();
//   }, [crawl]);

//   const handleJoinCrawl = async () => {
//     if (!session) {
//       // Use router to navigate to signin page
//       router.push("/app/auth/signin");
//       return;
//     }

//     setIsJoining(true);
//     try {
//       const response = await fetch(`/api/crawls/${crawlId}/join`, {
//         method: "POST",
//       });

//       if (response.ok) {
//         // Refresh crawl data to update participants
//         const updatedCrawl = await fetch(
//           `/api/crawls/${crawlId}?includeChat=true`,
//         ).then((res) => res.json());
//         setCrawl(updatedCrawl);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to join event");
//       }
//     } catch (error) {
//       console.error("Error joining crawl:", error);
//       setError("Failed to join event");
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   const handleDeleteCrawl = async () => {
//     setIsDeleting(true);
//     try {
//       const response = await fetch(`/api/crawls/${crawlId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         router.push("/app/my-crawls");
//         router.refresh();
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to delete event");
//         setShowDeleteModal(false);
//       }
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       setError("Failed to delete event");
//       setShowDeleteModal(false);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleShareCrawl = async () => {
//     if (!crawl) return;

//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: `Join ${crawl.name}`,
//           text: `Join this amazing event in ${crawl.city.name}!`,
//           url: window.location.href,
//         });
//       } else {
//         await navigator.clipboard.writeText(window.location.href);
//         alert("Event link copied to clipboard! 📋");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   const getRideShareLink = (
//     fromAddress: string,
//     toAddress: string,
//     service: "uber" | "lyft",
//   ) => {
//     if (service === "uber") {
//       return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(
//         fromAddress,
//       )}&dropoff[formatted_address]=${encodeURIComponent(toAddress)}`;
//     } else {
//       return `https://lyft.com/ride?id=lyft&pickup[formatted_address]=${encodeURIComponent(
//         fromAddress,
//       )}&destination[formatted_address]=${encodeURIComponent(toAddress)}`;
//     }
//   };

//   const isUserParticipant =
//     session && crawl?.participants.some((p) => p.userId === session.user.id);

//   const isCrawlFull =
//     crawl && crawl._count.participants >= crawl.maxParticipants;
//   const isUserCreator = session && crawl?.creator.id === session.user.id;

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // back button text and link based on authentication
//   const getBackButtonProps = () => {
//     if (session) {
//       return {
//         text: "Back to My Events",
//         href: "/app/my-crawls",
//       };
//     } else {
//       return {
//         text: "Back to Events",
//         href: "/app/crawls-dashboard",
//       };
//     }
//   };

//   const backButtonProps = getBackButtonProps();

//   // Check if user can see the Join button
//   const canSeeJoinButton = () => {
//     if (!crawl) return false;

//     // User cannot be the creator
//     if (isUserCreator) return false;

//     // User cannot be already in the crawl
//     if (isUserParticipant) return false;

//     // Crawl cannot be full
//     if (isCrawlFull) return false;

//     // Crawl must be in a joinable status
//     if (!(crawl.status === "PLANNING" || crawl.status === "UPCOMING"))
//       return false;

//     return true;
//   };

//   // Get the appropriate join button text and behavior
//   const getJoinButtonProps = () => {
//     if (!crawl) return { text: "Join Event", onClick: () => {} };

//     if (isJoining) {
//       return { text: "Joining...", onClick: () => {} };
//     }

//     // For non-logged-in users, show "Sign In to Join" that redirects to sign-in
//     if (!session) {
//       return {
//         text: "Login to Join",
//         onClick: () => {
//           router.push("/app/auth/login");
//         },
//       };
//     }

//     // For logged-in users who can join
//     return {
//       text: "Join Event",
//       onClick: handleJoinCrawl,
//     };
//   };

//   const joinButtonProps = getJoinButtonProps();

//   if (isLoading) {
//     return (
//       <Page>
//         <HopprLoader />
//       </Page>
//     );
//   }

//   if (error || !crawl) {
//     return (
//       <Page>
//         <Title>Event Not Found</Title>
//         <CrawlContainer style={{ textAlign: "center" }}>
//           <p style={{ color: "#e2e8f0", marginBottom: "2rem" }}>
//             {error || "The crawl you're looking for doesn't exist."}
//           </p>
//           <BackButton href={backButtonProps.href}>
//             {backButtonProps.text}
//           </BackButton>
//         </CrawlContainer>
//       </Page>
//     );
//   }

//   return (
//     <Page>
//       <Title>Event Details</Title>

//       <CrawlContainer>
//         <CrawlHeader>
//           <CrawlName>{crawl.name}</CrawlName>
//           <CrawlDescription>{crawl.description}</CrawlDescription>
//           <div style={{ marginTop: "1rem" }}>
//             <StatusBadge $status={crawl.status}>
//               {crawl.status.toLowerCase()}
//             </StatusBadge>
//           </div>
//         </CrawlHeader>

//         <DetailsGrid>
//           <DetailCard>
//             <DetailLabel>Date & Time</DetailLabel>
//             <DetailValue>
//               {formatDate(crawl.date)} at {formatTime(crawl.startTime)}
//             </DetailValue>
//           </DetailCard>

//           <DetailCard>
//             <DetailLabel>City</DetailLabel>
//             <DetailValue>{crawl.city.name}</DetailValue>
//           </DetailCard>

//           <DetailCard>
//             <DetailLabel>Participants</DetailLabel>
//             <DetailValue>
//               {crawl._count.participants} / {crawl.maxParticipants}
//             </DetailValue>
//           </DetailCard>

//           <DetailCard>
//             <DetailLabel>Organizer</DetailLabel>
//             <DetailValue>{crawl.creator.name}</DetailValue>
//           </DetailCard>
//         </DetailsGrid>

//         {/* Weather Alert */}
//         {weather && (
//           <WeatherAlert
//             $isGood={weather.isGoodForCrawl}
//             style={{ marginBottom: "1.5rem" }}
//           >
//             {weather.isGoodForCrawl ? "☀️" : "🌧️"} Weather:{" "}
//             {weather.temperature}°F and {weather.description}
//           </WeatherAlert>
//         )}

//         <BarsSection>
//           <SectionTitle>Event Route</SectionTitle>

//           {/* Route Summary */}
//           <RouteSummary>
//             <SummaryGrid>
//               <SummaryItem>
//                 <SummaryValue>{routeSummary.totalDistance} mi</SummaryValue>
//                 <SummaryLabel>Total Distance</SummaryLabel>
//               </SummaryItem>
//               <SummaryItem>
//                 <SummaryValue>
//                   {routeSummary.needsTransportation ? "🚗" : "🚶"}
//                 </SummaryValue>
//                 <SummaryLabel>
//                   {routeSummary.needsTransportation
//                     ? "Transport Needed"
//                     : "Walkable"}
//                 </SummaryLabel>
//               </SummaryItem>
//               <SummaryItem>
//                 <SummaryValue>{routeSummary.totalWalkTime} min</SummaryValue>
//                 <SummaryLabel>Walking Time</SummaryLabel>
//               </SummaryItem>
//               <SummaryItem>
//                 <SummaryValue>{enhancedBars.length}</SummaryValue>
//                 <SummaryLabel>Total Stops</SummaryLabel>
//               </SummaryItem>
//             </SummaryGrid>

//             {routeSummary.needsTransportation && (
//               <WeatherAlert $isGood={false}>
//                 🚗 Transportation recommended - longest walk is{" "}
//                 {routeSummary.maxWalkDistance} miles
//               </WeatherAlert>
//             )}
//           </RouteSummary>

//           {/* Enhanced Route Map */}
//           <RouteMap>
//             {enhancedBars.map((crawlBar, index) => (
//               <RouteStep
//                 key={crawlBar.bar.id}
//                 $isLast={index === enhancedBars.length - 1}
//               >
//                 <StepNumber>{crawlBar.orderIndex}</StepNumber>
//                 <StepContent>
//                   <StepHeader>
//                     <BarName>{crawlBar.bar.name}</BarName>
//                     {crawlBar.distanceToNext && crawlBar.distanceToNext > 0 && (
//                       <DistanceBadge $walkable={crawlBar.isWalkable}>
//                         {crawlBar.distanceToNext.toFixed(1)} mi
//                       </DistanceBadge>
//                     )}
//                   </StepHeader>

//                   <BarDetails>
//                     {crawlBar.bar.type.replace("_", " ")} •{" "}
//                     {crawlBar.bar.address}
//                   </BarDetails>

//                   {crawlBar.estimatedArrival && (
//                     <TimeEstimate>
//                       {/* 🕐 Arrive around {crawlBar.estimatedArrival} */}
//                     </TimeEstimate>
//                   )}

//                   {crawlBar.distanceToNext && crawlBar.distanceToNext > 0 && (
//                     <>
//                       <TravelInfo $walkable={crawlBar.isWalkable}>
//                         {crawlBar.isWalkable ? (
//                           <>
//                             <span>🚶</span>
//                             <span>
//                               Walk {crawlBar.travelTime?.toFixed(0)} min to next
//                               bar
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <span>🚗</span>
//                             <span>
//                               Drive {crawlBar.travelTime?.toFixed(0)} min to
//                               next bar
//                             </span>
//                           </>
//                         )}
//                       </TravelInfo>

//                       {!crawlBar.isWalkable && enhancedBars[index + 1] && (
//                         <RideShareButtons>
//                           <UberButton
//                             href={getRideShareLink(
//                               crawlBar.bar.address,
//                               enhancedBars[index + 1].bar.address,
//                               "uber",
//                             )}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Uber
//                           </UberButton>
//                           <LyftButton
//                             href={getRideShareLink(
//                               crawlBar.bar.address,
//                               enhancedBars[index + 1].bar.address,
//                               "lyft",
//                             )}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Lyft
//                           </LyftButton>
//                         </RideShareButtons>
//                       )}
//                     </>
//                   )}
//                 </StepContent>
//               </RouteStep>
//             ))}
//           </RouteMap>
//         </BarsSection>

//         <ParticipantsSection>
//           <SectionTitle>
//             Participants ({crawl._count.participants})
//           </SectionTitle>
//           <ParticipantsList>
//             {crawl.participants.map((participant) => (
//               <Participant key={participant.userId}>
//                 {participant.user.name}
//                 {participant.userId === crawl.creator.id && " 👑"}
//               </Participant>
//             ))}
//           </ParticipantsList>
//         </ParticipantsSection>

//         <ActionButtons>
//           {/* Show Join button for users who can join (including non-logged-in) */}
//           {canSeeJoinButton() && (
//             <JoinButton
//               onClick={joinButtonProps.onClick}
//               $joined={false}
//               disabled={isJoining && !!session}
//             >
//               {joinButtonProps.text}
//             </JoinButton>
//           )}

//           {/* Show appropriate state buttons */}
//           {isUserParticipant && (
//             <JoinButton $joined={true} disabled>
//               Already Joined
//             </JoinButton>
//           )}

//           {isCrawlFull && !isUserParticipant && (
//             <JoinButton $joined={false} disabled>
//               Event Full
//             </JoinButton>
//           )}

//           {/* Creator actions */}
//           {isUserCreator && (
//             <>
//               <EditButton href={`/app/crawl-planner/edit/${crawlId}`}>
//                 Edit Event
//               </EditButton>
//               <DeleteButton
//                 onClick={() => setShowDeleteModal(true)}
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? "Deleting..." : "Delete Event"}
//               </DeleteButton>
//             </>
//           )}

//           {/* 🆕 UPDATED CHAT BUTTON - Link to separate chat page */}
//           {(isUserParticipant || isUserCreator) && crawl?.chatroom && (
//             <JoinButton
//               as="a"
//               href={`/app/chat/${crawl.id}`}
//               $joined={false}
//               style={{
//                 textDecoration: "none",
//                 textAlign: "center",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "0.5rem",
//               }}
//             >
//               <span>💬</span>
//               Group Chat ({crawl._count.participants})
//             </JoinButton>
//           )}

//           <ShareButton onClick={handleShareCrawl}>Share Event</ShareButton>

//           <BackButton href={backButtonProps.href}>
//             {backButtonProps.text}
//           </BackButton>
//         </ActionButtons>
//       </CrawlContainer>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <ModalOverlay>
//           <ModalContent>
//             <ModalTitle>Delete Event</ModalTitle>
//             <ModalMessage>
//               Are you sure you want to delete &quot;{crawl.name}&quot;? This
//               action cannot be undone and all participants will be removed from
//               the event.
//             </ModalMessage>
//             <ModalButtons>
//               <CancelButton onClick={() => setShowDeleteModal(false)}>
//                 Cancel
//               </CancelButton>
//               <ConfirmButton onClick={handleDeleteCrawl} disabled={isDeleting}>
//                 {isDeleting ? "Deleting..." : "Yes, Delete"}
//               </ConfirmButton>
//             </ModalButtons>
//           </ModalContent>
//         </ModalOverlay>
//       )}
//     </Page>
//   );
// };

// export default CreatedCrawlDetails;
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
import styled from "styled-components";
import Link from "next/link";

// ============================================
// STYLED COMPONENTS WITH THEME
// ============================================

const gradientShift = `
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const Page = styled.div`
  padding: 2rem 1rem 10rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.primaryBackground};
  min-height: calc(100vh - 70px);
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    margin-left: 240px;
    padding: 2rem 2rem 8rem;
    width: calc(100% - 240px);
  }

  @media (max-width: 767px) {
    padding: 1rem 1rem 6rem;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
  animation: ${gradientShift} 8s ease infinite;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const CrawlContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const CrawlHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const CrawlName = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CrawlDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const DetailCard = styled.div`
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid ${({ theme }) => theme.colors.primaryAccent};
`;

export const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const DetailValue = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const BarsSection = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
  padding-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const RouteMap = styled.div`
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RouteStep = styled.div<{ $isLast: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const StepNumber = styled.div`
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
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const StepContent = styled.div`
  flex: 1;
`;

export const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const BarName = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
  min-width: 200px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const DistanceBadge = styled.span<{ $walkable?: boolean }>`
  background: ${(props) =>
    props.$walkable
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #f59e0b, #d97706)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const BarDetails = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const TravelInfo = styled.div<{ $walkable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 6px;
  border-left: 3px solid ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const RideShareButtons = styled.div`
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

export const UberButton = styled(RideShareButton)`
  background: #000;
  color: white;
`;

export const LyftButton = styled(RideShareButton)`
  background: #ff00bf;
  color: white;
`;

export const TimeEstimate = styled.div`
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const RouteSummary = styled.div`
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SummaryItem = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

export const SummaryValue = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const WeatherAlert = styled.div<{ $isGood?: boolean }>`
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
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ParticipantsSection = styled.div`
  margin-bottom: 2rem;
`;

export const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Participant = styled.div`
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const JoinButton = styled.button<{ $joined: boolean }>`
  background: ${(props) =>
    props.$joined
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const ShareButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const BackButton = styled(Link)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const DeleteButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const EditButton = styled(Link)`
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
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
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
  font-family: ${({ theme }) => theme.fonts.mono};
`;

// Modal Components
export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ModalMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const ConfirmButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-2px);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// ============================================
// TYPES & INTERFACES
// ============================================

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

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

const getMockWeather = (city: string, date: string): WeatherData => {
  const conditions = ["Sunny", "Partly Cloudy", "Clear", "Cloudy"];
  const randomCondition =
    conditions[Math.floor(Math.random() * conditions.length)];
  return {
    temperature: Math.floor(Math.random() * 30) + 60,
    condition: randomCondition,
    isGoodForCrawl: !["Rainy", "Stormy", "Snowy"].includes(randomCondition),
    description: `${randomCondition} and pleasant for a crawl`,
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

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

  const crawlId = params.id as string;

  useEffect(() => {
    const fetchCrawl = async () => {
      try {
        const response = await fetch(`/api/crawls/${crawlId}?includeChat=true`);
        if (response.ok) {
          const crawlData = await response.json();
          setCrawl(crawlData);
          const weatherData = getMockWeather(
            crawlData.city.name,
            crawlData.date,
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
        (a, b) => a.orderIndex - b.orderIndex,
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

        const estimatedArrival = currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        if (nextBar) {
          distanceToNext = calculateDistance(
            currentBar.bar.latitude,
            currentBar.bar.longitude,
            nextBar.bar.latitude,
            nextBar.bar.longitude,
          );
          distanceToNext = distanceToNext * 0.621371;
          travelTime = (distanceToNext / 3) * 60;
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

        currentTime.setMinutes(currentTime.getMinutes() + 45);
        if (travelTime > 0) {
          currentTime.setMinutes(currentTime.getMinutes() + travelTime);
        }
      }

      setEnhancedBars(enhanced);
      setRouteSummary({
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalWalkTime: Math.round((totalDistance / 3) * 60),
        totalDriveTime: Math.round((totalDistance / 25) * 60),
        maxWalkDistance: Math.round(maxWalkDistance * 10) / 10,
        needsTransportation: maxWalkDistance > 0.5,
      });
    };

    calculateRouteMetrics();
  }, [crawl]);

  const handleJoinCrawl = async () => {
    if (!session) {
      router.push("/app/auth/signin");
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`/api/crawls/${crawlId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        const updatedCrawl = await fetch(
          `/api/crawls/${crawlId}?includeChat=true`,
        ).then((res) => res.json());
        setCrawl(updatedCrawl);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to join event");
      }
    } catch (error) {
      console.error("Error joining crawl:", error);
      setError("Failed to join event");
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
        setError(errorData.message || "Failed to delete event");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
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
          text: `Join this amazing event in ${crawl.city.name}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Event link copied to clipboard! 📋");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const getRideShareLink = (
    fromAddress: string,
    toAddress: string,
    service: "uber" | "lyft",
  ) => {
    if (service === "uber") {
      return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(
        fromAddress,
      )}&dropoff[formatted_address]=${encodeURIComponent(toAddress)}`;
    } else {
      return `https://lyft.com/ride?id=lyft&pickup[formatted_address]=${encodeURIComponent(
        fromAddress,
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

  const getBackButtonProps = () => {
    if (session) {
      return { text: "Back to My Events", href: "/app/my-crawls" };
    } else {
      return { text: "Back to Events", href: "/app/crawls-dashboard" };
    }
  };

  const backButtonProps = getBackButtonProps();

  const canSeeJoinButton = () => {
    if (!crawl) return false;
    if (isUserCreator) return false;
    if (isUserParticipant) return false;
    if (isCrawlFull) return false;
    if (!(crawl.status === "PLANNING" || crawl.status === "UPCOMING"))
      return false;
    return true;
  };

  const getJoinButtonProps = () => {
    if (!crawl) return { text: "Join Event", onClick: () => {} };
    if (isJoining) return { text: "Joining...", onClick: () => {} };
    if (!session) {
      return {
        text: "Login to Join",
        onClick: () => router.push("/app/auth/login"),
      };
    }
    return { text: "Join Event", onClick: handleJoinCrawl };
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
        <ContentWrapper>
          <Title>Event Not Found</Title>
          <CrawlContainer style={{ textAlign: "center" }}>
            <ErrorText>
              {error || "The crawl you're looking for doesn't exist."}
            </ErrorText>
            <BackButton href={backButtonProps.href}>
              {backButtonProps.text}
            </BackButton>
          </CrawlContainer>
        </ContentWrapper>
      </Page>
    );
  }

  return (
    <Page>
      <ContentWrapper>
        <Title>Event Details</Title>

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
            <SectionTitle>Event Route</SectionTitle>

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
                      {crawlBar.distanceToNext &&
                        crawlBar.distanceToNext > 0 && (
                          <DistanceBadge $walkable={crawlBar.isWalkable}>
                            {crawlBar.distanceToNext.toFixed(1)} mi
                          </DistanceBadge>
                        )}
                    </StepHeader>

                    <BarDetails>
                      {crawlBar.bar.type.replace("_", " ")} •{" "}
                      {crawlBar.bar.address}
                    </BarDetails>

                    {crawlBar.estimatedArrival && <TimeEstimate />}

                    {crawlBar.distanceToNext && crawlBar.distanceToNext > 0 && (
                      <>
                        <TravelInfo $walkable={crawlBar.isWalkable}>
                          {crawlBar.isWalkable ? (
                            <>
                              <span>🚶</span>
                              <span>
                                Walk {crawlBar.travelTime?.toFixed(0)} min to
                                next bar
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
                                "uber",
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
                                "lyft",
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
            {canSeeJoinButton() && (
              <JoinButton
                onClick={joinButtonProps.onClick}
                $joined={false}
                disabled={isJoining && !!session}
              >
                {joinButtonProps.text}
              </JoinButton>
            )}

            {isUserParticipant && (
              <JoinButton $joined={true} disabled>
                Already Joined
              </JoinButton>
            )}

            {isCrawlFull && !isUserParticipant && (
              <JoinButton $joined={false} disabled>
                Event Full
              </JoinButton>
            )}

            {isUserCreator && (
              <>
                <EditButton href={`/app/crawl-planner/edit/${crawlId}`}>
                  Edit Event
                </EditButton>
                <DeleteButton
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Event"}
                </DeleteButton>
              </>
            )}

            {(isUserParticipant || isUserCreator) && crawl?.chatroom && (
              <JoinButton
                as="a"
                href={`/app/chat/${crawl.id}`}
                $joined={false}
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span>💬</span>
                Group Chat ({crawl._count.participants})
              </JoinButton>
            )}

            <ShareButton onClick={handleShareCrawl}>Share Event</ShareButton>
            <BackButton href={backButtonProps.href}>
              {backButtonProps.text}
            </BackButton>
          </ActionButtons>
        </CrawlContainer>

        {showDeleteModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Delete Event</ModalTitle>
              <ModalMessage>
                Are you sure you want to delete &quot;{crawl.name}&quot;? This
                action cannot be undone and all participants will be removed
                from the event.
              </ModalMessage>
              <ModalButtons>
                <CancelButton onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </CancelButton>
                <ConfirmButton
                  onClick={handleDeleteCrawl}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </ConfirmButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </Page>
  );
};

export default CreatedCrawlDetails;
