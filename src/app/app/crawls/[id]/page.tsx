import CreatedCrawlDetails from "@/components/app/crawl/created-crawl-details/CreatedCrawlDetails";
import React from "react";

const CreatedCrawlDetailsPage = () => {
  return (
    <div>
      <CreatedCrawlDetails />
    </div>
  );
};

export default CreatedCrawlDetailsPage;
// "use client";
// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   Calendar,
//   MapPin,
//   Clock,
//   Users,
//   Wine,
//   Ticket,
//   CheckCircle,
//   Crown,
// } from "phosphor-react";
// import { useSession } from "next-auth/react";

// const PageWrapper = styled.div`
//   min-height: 100vh;
//   background: ${({ theme }) => theme.colors.primaryBackground};
//   padding: 16px;
//   padding-bottom: 80px;

//   @media (min-width: 768px) {
//     padding-left: 256px;
//     padding-right: 32px;
//     padding-bottom: 32px;
//   }
// `;

// const Container = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   width: 100%;
// `;

// const Header = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
//   margin-bottom: 24px;
// `;

// const BackButton = styled.button`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 12px;
//   padding: 8px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: ${({ theme }) => theme.colors.textPrimary};

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//   }
// `;

// const EventImage = styled.img`
//   width: 100%;
//   height: 250px;
//   object-fit: cover;
//   border-radius: 16px;
//   margin-bottom: 24px;
// `;

// const EventTitle = styled.h1`
//   font-size: 28px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 12px;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const EventStatus = styled.div<{ $status: string }>`
//   display: inline-block;
//   background: ${(props) => {
//     switch (props.$status) {
//       case "ACTIVE":
//         return "linear-gradient(135deg, #10b981, #059669)";
//       case "UPCOMING":
//         return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
//       default:
//         return "linear-gradient(135deg, #f59e0b, #d97706)";
//     }
//   }};
//   color: white;
//   padding: 6px 12px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 16px;
//   display: inline-flex;
//   align-items: center;
//   gap: 6px;
// `;

// const Description = styled.p`
//   font-size: 16px;
//   line-height: 1.6;
//   color: ${({ theme }) => theme.colors.textSecondary};
//   margin-bottom: 24px;
// `;

// const InfoSection = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 16px;
//   padding: 20px;
//   margin-bottom: 24px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const InfoRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   padding: 12px 0;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// const InfoIcon = styled.div`
//   width: 40px;
//   color: ${({ theme }) => theme.colors.primaryAccent};
// `;

// const InfoContent = styled.div`
//   flex: 1;
// `;

// const InfoLabel = styled.div`
//   font-size: 12px;
//   color: ${({ theme }) => theme.colors.textMuted};
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 4px;
// `;

// const InfoValue = styled.div`
//   font-size: 16px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const ParticipationSection = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 16px;
//   padding: 24px;
//   margin-bottom: 24px;
//   text-align: center;
//   border: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const ParticipantCount = styled.div`
//   font-size: 48px;
//   font-weight: 800;
//   color: ${({ theme }) => theme.colors.primaryAccent};
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 8px;
// `;

// const ParticipantLabel = styled.div`
//   font-size: 14px;
//   color: ${({ theme }) => theme.colors.textMuted};
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 16px;
// `;

// const ProgressBarContainer = styled.div`
//   width: 100%;
//   height: 8px;
//   background: ${({ theme }) => theme.colors.tertiaryBackground};
//   border-radius: 4px;
//   overflow: hidden;
//   margin: 16px 0;
// `;

// const ProgressBar = styled.div<{ $percentage: number }>`
//   height: 100%;
//   width: ${(props) => props.$percentage}%;
//   background: linear-gradient(90deg, #10b981, #0ea5e9);
//   border-radius: 4px;
//   transition: width 0.3s;
// `;

// const SpotsRemaining = styled.div`
//   font-size: 14px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-top: 8px;
// `;

// const BarsSection = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 16px;
//   padding: 20px;
//   margin-bottom: 24px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const BarsTitle = styled.h3`
//   font-size: 18px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 16px;
//   font-family: ${({ theme }) => theme.fonts.dm};
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const BarItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   padding: 12px 0;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// const BarNumber = styled.div`
//   width: 28px;
//   height: 28px;
//   background: ${({ theme }) => theme.colors.primaryAccent};
//   color: white;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 12px;
//   font-weight: bold;
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const BarName = styled.div`
//   flex: 1;
//   font-size: 14px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const CTASection = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-top: 24px;
// `;

// const JoinButton = styled.button`
//   flex: 2;
//   background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
//   border: none;
//   padding: 16px;
//   border-radius: 12px;
//   color: white;
//   font-weight: 700;
//   font-size: 16px;
//   cursor: pointer;
//   transition: all 0.3s;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   &:hover {
//     transform: translateY(-2px);
//     filter: brightness(1.05);
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//     transform: none;
//   }
// `;

// const SecondaryButton = styled.button`
//   flex: 1;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   padding: 16px;
//   border-radius: 12px;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//   }
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   background: rgba(239, 68, 68, 0.1);
//   border-radius: 12px;
//   margin: 1rem;

//   button {
//     margin-top: 1rem;
//     padding: 0.5rem 1rem;
//     background: ${({ theme }) => theme.colors.primaryAccent};
//     border: none;
//     border-radius: 8px;
//     color: white;
//     cursor: pointer;
//   }
// `;

// const SuccessMessage = styled.div`
//   background: rgba(16, 185, 129, 0.1);
//   border: 1px solid rgba(16, 185, 129, 0.3);
//   border-radius: 12px;
//   padding: 12px;
//   margin-bottom: 16px;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   color: #10b981;
//   font-size: 14px;
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// interface Crawl {
//   id: string;
//   name: string;
//   description?: string;
//   date: string;
//   startTime: string;
//   maxParticipants: number;
//   currentParticipants: number;
//   city?: { name: string };
//   crawlBars?: Array<{ bar: { id: string; name: string; address?: string } }>;
//   status: string;
// }

// export default function EventDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { data: session } = useSession();
//   const [event, setEvent] = useState<Crawl | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [joining, setJoining] = useState(false);
//   const [joinSuccess, setJoinSuccess] = useState(false);

//   useEffect(() => {
//     if (params.id) {
//       fetchEventDetails();
//     }
//   }, [params.id]);

//   const fetchEventDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Fetching event with ID:", params.id);

//       let foundEvent = null;

//       // Try direct endpoint
//       try {
//         const res = await fetch(`/api/crawls/${params.id}`);
//         console.log("Direct endpoint response status:", res.status);

//         if (res.ok) {
//           const data = await res.json();
//           console.log("Direct endpoint data:", data);
//           foundEvent = data.data || data;
//         }
//       } catch (err) {
//         console.log("Direct endpoint failed:", err);
//       }

//       // Search through all events if direct failed
//       if (!foundEvent) {
//         try {
//           const res = await fetch("/api/crawls?limit=100");
//           if (res.ok) {
//             const data = await res.json();
//             const events = data.crawls || data.data || data;
//             console.log("All events count:", events?.length);

//             if (Array.isArray(events)) {
//               foundEvent = events.find((e: Crawl) => e.id === params.id);
//               console.log("Found event in list:", foundEvent?.id);
//             }
//           }
//         } catch (err) {
//           console.log("Search all events failed:", err);
//         }
//       }

//       if (foundEvent) {
//         setEvent(foundEvent);
//       } else {
//         setError("Event not found");
//       }
//     } catch (error) {
//       console.error("Error fetching event details:", error);
//       setError("Failed to load event details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJoinEvent = async () => {
//     if (!session) {
//       router.push(
//         `/app/auth/login?callbackUrl=${encodeURIComponent(`/app/events/${params.id}`)}`,
//       );
//       return;
//     }

//     try {
//       setJoining(true);
//       const res = await fetch(`/api/crawls/${params.id}/join`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.ok) {
//         setJoinSuccess(true);
//         await fetchEventDetails();
//         setTimeout(() => setJoinSuccess(false), 3000);
//       } else {
//         const errorData = await res.json();
//         console.error("Join failed:", errorData);
//       }
//     } catch (error) {
//       console.error("Error joining event:", error);
//     } finally {
//       setJoining(false);
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatTime = (timeString: string): string => {
//     return new Date(timeString).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusText = (status: string): string => {
//     switch (status) {
//       case "ACTIVE":
//         return "Live Now";
//       case "UPCOMING":
//         return "Upcoming";
//       default:
//         return "Planning";
//     }
//   };

//   const getStatusIcon = (status: string): string => {
//     switch (status) {
//       case "ACTIVE":
//         return "🔴";
//       case "UPCOMING":
//         return "🟣";
//       default:
//         return "🟡";
//     }
//   };

//   const getEventImage = (): string => {
//     return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg";
//   };

//   const percentage = event
//     ? Math.round((event.currentParticipants / event.maxParticipants) * 100)
//     : 0;

//   const spotsRemaining = event
//     ? event.maxParticipants - event.currentParticipants
//     : 0;

//   const isFull = spotsRemaining === 0;
//   const isActive = event?.status === "ACTIVE";

//   if (loading) {
//     return (
//       <PageWrapper>
//         <Container>
//           <LoadingState>Loading event details...</LoadingState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   if (error || !event) {
//     return (
//       <PageWrapper>
//         <Container>
//           <Header>
//             <BackButton onClick={() => router.push("/app")}>
//               <ArrowLeft size={20} />
//             </BackButton>
//           </Header>
//           <ErrorState>
//             <p>{error || "Event not found"}</p>
//             <button onClick={() => router.push("/app")}>Back to Home</button>
//           </ErrorState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   return (
//     <PageWrapper>
//       <Container>
//         <Header>
//           <BackButton onClick={() => router.push("/app")}>
//             <ArrowLeft size={20} />
//           </BackButton>
//         </Header>

//         <EventImage src={getEventImage()} alt={event.name} />

//         <EventStatus $status={event.status}>
//           {getStatusIcon(event.status)} {getStatusText(event.status)}
//         </EventStatus>

//         <EventTitle>{event.name}</EventTitle>

//         {event.description && <Description>{event.description}</Description>}

//         <InfoSection>
//           <InfoRow>
//             <InfoIcon>
//               <Calendar size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Date</InfoLabel>
//               <InfoValue>{formatDate(event.date)}</InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <Clock size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Time</InfoLabel>
//               <InfoValue>{formatTime(event.startTime)}</InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <MapPin size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>City</InfoLabel>
//               <InfoValue>{event.city?.name || "Helsinki"}</InfoValue>
//             </InfoContent>
//           </InfoRow>
//         </InfoSection>

//         <ParticipationSection>
//           <ParticipantCount>
//             {event.currentParticipants}/{event.maxParticipants}
//           </ParticipantCount>
//           <ParticipantLabel>Participants</ParticipantLabel>
//           <ProgressBarContainer>
//             <ProgressBar $percentage={percentage} />
//           </ProgressBarContainer>
//           <SpotsRemaining>
//             {isFull ? "Event is full!" : `${spotsRemaining} spots remaining`}
//           </SpotsRemaining>
//         </ParticipationSection>

//         {event.crawlBars && event.crawlBars.length > 0 && (
//           <BarsSection>
//             <BarsTitle>
//               <Wine size={20} />
//               Venues on this crawl
//             </BarsTitle>
//             {event.crawlBars.map((item, index) => (
//               <BarItem key={index}>
//                 <BarNumber>{index + 1}</BarNumber>
//                 <BarName>{item.bar.name}</BarName>
//                 <Wine size={16} color="#8b5cf6" />
//               </BarItem>
//             ))}
//           </BarsSection>
//         )}

//         {joinSuccess && (
//           <SuccessMessage>
//             <CheckCircle size={20} />
//             Successfully joined the event!
//           </SuccessMessage>
//         )}

//         <CTASection>
//           <SecondaryButton onClick={() => router.push("/app")}>
//             Back to Home
//           </SecondaryButton>
//           <JoinButton
//             onClick={handleJoinEvent}
//             disabled={joining || isFull || !isActive}
//           >
//             {joining
//               ? "Joining..."
//               : isFull
//                 ? "Event Full"
//                 : !isActive
//                   ? "Not Available Yet"
//                   : `Join Event →`}
//           </JoinButton>
//         </CTASection>
//       </Container>
//     </PageWrapper>
//   );
// }
