// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
// import {
//   ActionButtons,
//   BarCount,
//   BarPreview,
//   CancelButton,
//   CloseButton,
//   ConfirmDeleteButton,
//   CrawlCard,
//   CrawlHeader,
//   CrawlMeta,
//   CrawlName,
//   CrawlsGrid,
//   CrawlStatus,
//   CreateCrawlCard,
//   CreateIcon,
//   CreateSubtext,
//   CreateText,
//   DeleteButton,
//   DeleteButtonWrapper,
//   Description,
//   EmptyState,
//   JoinButton,
//   JoinButtonWrapper,
//   LoadingContainer,
//   MetaItem,
//   MetaLabel,
//   MetaValue,
//   ModalActions,
//   ModalContent,
//   ModalMessage,
//   ModalOverlay,
//   ModalTitle,
//   NotificationContainer,
//   NotificationContent,
//   NotificationIcon,
//   NotificationMessage,
//   Page,
//   PastCrawlCard,
//   PastEventIndicator,
//   Tab,
//   TabContainer,
//   Title,
//   Tooltip,
//   UndoButton,
//   ViewButton,
// } from "./MyCrawls.styles";
// import { styled } from "styled-components";

// export const Notification = styled.div<{
//   $type: "success" | "error" | "info" | "warning";
// }>`
//   background: ${(props) =>
//     props.$type === "success"
//       ? "linear-gradient(45deg, #10b981, #059669)"
//       : props.$type === "error"
//         ? "linear-gradient(45deg, #ef4444, #dc2626)"
//         : props.$type === "warning"
//           ? "linear-gradient(45deg, #f59e0b, #d97706)"
//           : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
//   color: white;
//   padding: 1rem 1.5rem;
//   border-radius: 12px;
//   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 1rem;
//   animation: slideIn 0.3s ease-out;

//   @keyframes slideIn {
//     from {
//       transform: translateX(100%);
//       opacity: 0;
//     }
//     to {
//       transform: translateX(0);
//       opacity: 1;
//     }
//   }

//   /* Mobile */
//   @media (max-width: 768px) {
//     padding: 1rem;
//   }
// `;

// const CreateCrawlCardMobileHidden = styled(CreateCrawlCard)`
//   /* Show on desktop, hide on mobile */
//   display: block;

//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// interface CrawlUser {
//   id: string;
//   name: string | null;
//   email: string;
//   image: string | null;
// }

// interface Crawl {
//   id: string;
//   name: string;
//   description: string;
//   date: string;
//   startTime: string;
//   endTime: string | null;
//   maxParticipants: number;
//   isPublic: boolean;
//   status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
//   city: {
//     id: string;
//     name: string;
//   };
//   creator: CrawlUser;
//   participants: Array<{
//     userId: string;
//   }>;
//   crawlBars: Array<{
//     bar: {
//       id: string;
//       name: string;
//     };
//   }>;
//   _count: {
//     participants: number;
//   };
// }

// type CrawlTab = "discover" | "my-crawls" | "past-events" | "my-past-events";

// interface NotificationData {
//   id: string;
//   type: "success" | "error" | "info" | "warning";
//   message: string;
//   crawlId?: string;
//   crawlName?: string;
//   undoAction?: () => void;
// }

// interface DeleteModalData {
//   crawlId: string;
//   crawlName: string;
//   isDeleting: boolean;
// }

// const MyCrawls = () => {
//   const { data: session, status } = useSession();
//   const [activeTab, setActiveTab] = useState<CrawlTab>("my-crawls");

//   // Separate states for each tab to prevent conflicts
//   const [discoverCrawls, setDiscoverCrawls] = useState<Crawl[]>([]);
//   const [myUpcomingCrawls, setMyUpcomingCrawls] = useState<Crawl[]>([]);
//   const [pastPublicCrawls, setPastPublicCrawls] = useState<Crawl[]>([]);
//   const [myPastCrawls, setMyPastCrawls] = useState<Crawl[]>([]);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isJoining, setIsJoining] = useState<string | null>(null);
//   const [isLeaving, setIsLeaving] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [deleteModal, setDeleteModal] = useState<DeleteModalData | null>(null);

//   const isAuthenticated = !!session;

//   // Add notification
//   const addNotification = useCallback(
//     (notification: Omit<NotificationData, "id">) => {
//       const id = Math.random().toString(36).substr(2, 9);
//       setNotifications((prev) => [...prev, { ...notification, id }]);

//       // Auto remove after 5 seconds (except for notifications with undo)
//       if (!notification.undoAction) {
//         setTimeout(() => {
//           removeNotification(id);
//         }, 5000);
//       }
//     },
//     [],
//   );

//   // Remove notification
//   const removeNotification = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.id !== id),
//     );
//   }, []);

//   // Fetch data for ALL tabs when component mounts or auth changes
//   const fetchAllTabData = useCallback(async () => {
//     try {
//       setIsLoading(true);

//       // Fetch data for all tabs in parallel
//       const promises = [];

//       // Always fetch discover crawls
//       promises.push(
//         fetch("/api/crawls?public=true")
//           .then((res) => (res.ok ? res.json() : []))
//           .then((data) => setDiscoverCrawls(data))
//           .catch(() => setDiscoverCrawls([])),
//       );

//       if (isAuthenticated) {
//         // Fetch user's upcoming crawls
//         promises.push(
//           fetch("/api/crawls/my-crawls")
//             .then((res) => (res.ok ? res.json() : []))
//             .then((data) => {
//               const upcomingCrawls = data.filter(
//                 (crawl: Crawl) => !isCrawlPast(crawl),
//               );
//               setMyUpcomingCrawls(upcomingCrawls);
//             })
//             .catch(() => setMyUpcomingCrawls([])),
//         );

//         // Fetch past public events
//         promises.push(
//           fetch("/api/crawls/past-events?public=true")
//             .then((res) => (res.ok ? res.json() : []))
//             .then((data) => setPastPublicCrawls(data))
//             .catch(() => setPastPublicCrawls([])),
//         );

//         // Fetch user's past events
//         promises.push(
//           fetch("/api/crawls/past-events")
//             .then((res) => (res.ok ? res.json() : []))
//             .then((data) => setMyPastCrawls(data))
//             .catch(() => setMyPastCrawls([])),
//         );
//       } else {
//         // If not authenticated, clear user-specific data
//         setMyUpcomingCrawls([]);
//         setPastPublicCrawls([]);
//         setMyPastCrawls([]);
//       }

//       await Promise.all(promises);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       // Reset all states on error
//       setDiscoverCrawls([]);
//       setMyUpcomingCrawls([]);
//       setPastPublicCrawls([]);
//       setMyPastCrawls([]);
//     } finally {
//       setIsLoading(false);
//       setIsInitialLoad(false);
//     }
//   }, [isAuthenticated]);

//   // Also keep the individual tab fetch for when switching tabs (to refresh data)
//   const fetchActiveTabData = useCallback(async () => {
//     if (isInitialLoad) return; // Don't fetch if we're in initial load

//     try {
//       setIsLoading(true);

//       if (activeTab === "discover") {
//         const response = await fetch("/api/crawls?public=true");
//         if (response.ok) {
//           const data = await response.json();
//           setDiscoverCrawls(data);
//         }
//       } else if (activeTab === "my-crawls" && isAuthenticated) {
//         const response = await fetch("/api/crawls/my-crawls");
//         if (response.ok) {
//           const data = await response.json();
//           const upcomingCrawls = data.filter(
//             (crawl: Crawl) => !isCrawlPast(crawl),
//           );
//           setMyUpcomingCrawls(upcomingCrawls);
//         }
//       } else if (activeTab === "past-events" && isAuthenticated) {
//         const response = await fetch("/api/crawls/past-events?public=true");
//         if (response.ok) {
//           const data = await response.json();
//           setPastPublicCrawls(data);
//         }
//       } else if (activeTab === "my-past-events" && isAuthenticated) {
//         const response = await fetch("/api/crawls/past-events");
//         if (response.ok) {
//           const data = await response.json();
//           setMyPastCrawls(data);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching active tab data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeTab, isAuthenticated, isInitialLoad]);

//   // Fetch all data when component mounts or auth changes
//   useEffect(() => {
//     fetchAllTabData();
//   }, [fetchAllTabData]);

//   // Refresh only active tab data when tab changes (after initial load)
//   useEffect(() => {
//     if (!isInitialLoad) {
//       fetchActiveTabData();
//     }
//   }, [activeTab, fetchActiveTabData, isInitialLoad]);

//   // Quick Delete Function
//   const handleQuickDelete = async (crawlId: string, crawlName: string) => {
//     if (!isAuthenticated) return;

//     setIsDeleting(crawlId);

//     try {
//       const response = await fetch(`/api/crawls/${crawlId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         // Store the previous state for undo
//         const previousMyCrawls = [...myUpcomingCrawls];
//         const previousDiscoverCrawls = [...discoverCrawls];

//         // Optimistically remove the crawl from the UI
//         setMyUpcomingCrawls((prev) =>
//           prev.filter((crawl) => crawl.id !== crawlId),
//         );
//         setDiscoverCrawls((prev) =>
//           prev.filter((crawl) => crawl.id !== crawlId),
//         );

//         addNotification({
//           type: "success",
//           message: `"${crawlName}" has been deleted`,
//           crawlId,
//           crawlName,
//           undoAction: async () => {
//             try {
//               // Re-fetch all data to restore the crawl
//               await fetchAllTabData();
//               addNotification({
//                 type: "info",
//                 message: `"${crawlName}" has been restored`,
//               });
//             } catch (error) {
//               console.error("Error undoing delete:", error);
//               addNotification({
//                 type: "error",
//                 message: "Failed to restore crawl",
//               });
//             }
//           },
//         });
//       } else {
//         const errorData = await response.json();
//         addNotification({
//           type: "error",
//           message: errorData.message || "Failed to delete crawl",
//         });
//         // Refresh data to ensure UI is in sync
//         await fetchAllTabData();
//       }
//     } catch (error) {
//       console.error("Error deleting crawl:", error);
//       addNotification({
//         type: "error",
//         message: "Failed to delete crawl",
//       });
//       // Refresh data to ensure UI is in sync
//       await fetchAllTabData();
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   // Show delete confirmation modal
//   const showDeleteConfirmation = (crawlId: string, crawlName: string) => {
//     setDeleteModal({
//       crawlId,
//       crawlName,
//       isDeleting: false,
//     });
//   };

//   // Handle confirmed delete
//   const handleConfirmDelete = async () => {
//     if (!deleteModal) return;

//     setDeleteModal((prev) => (prev ? { ...prev, isDeleting: true } : null));

//     await handleQuickDelete(deleteModal.crawlId, deleteModal.crawlName);
//     setDeleteModal(null);
//   };

//   // Cancel delete
//   const handleCancelDelete = () => {
//     setDeleteModal(null);
//   };

//   const handleJoinCrawl = async (crawlId: string, crawlName: string) => {
//     if (!isAuthenticated) {
//       window.location.href = `/app/auth/signup?redirect=/crawls&crawl=${crawlId}`;
//       return;
//     }

//     setIsJoining(crawlId);

//     try {
//       const response = await fetch(`/api/crawls/${crawlId}/join`, {
//         method: "POST",
//       });

//       if (response.ok) {
//         // Store the previous state for undo
//         const previousDiscoverCrawls = [...discoverCrawls];
//         const previousMyCrawls = [...myUpcomingCrawls];

//         // Refresh all data after joining
//         await fetchAllTabData();

//         // Show success notification with undo option
//         addNotification({
//           type: "success",
//           message: `You've joined "${crawlName}"!`,
//           crawlId,
//           crawlName,
//           undoAction: async () => {
//             try {
//               const leaveResponse = await fetch(
//                 `/api/crawls/${crawlId}/leave`,
//                 {
//                   method: "POST",
//                 },
//               );

//               if (leaveResponse.ok) {
//                 await fetchAllTabData();
//                 addNotification({
//                   type: "info",
//                   message: `You've left "${crawlName}"`,
//                 });
//               } else {
//                 addNotification({
//                   type: "error",
//                   message: "Failed to leave crawl",
//                 });
//               }
//             } catch (error) {
//               console.error("Error leaving crawl:", error);
//               addNotification({
//                 type: "error",
//                 message: "Failed to leave crawl",
//               });
//             }
//           },
//         });
//       } else {
//         const errorData = await response.json();
//         addNotification({
//           type: "error",
//           message:
//             errorData.message || "Failed to join crawl. Please try again.",
//         });
//       }
//     } catch (error) {
//       console.error("Error joining crawl:", error);
//       addNotification({
//         type: "error",
//         message: "Failed to join crawl. Please try again.",
//       });
//     } finally {
//       setIsJoining(null);
//     }
//   };

//   const handleLeaveCrawl = async (crawlId: string, crawlName: string) => {
//     if (!isAuthenticated) return;

//     setIsLeaving(crawlId);

//     try {
//       const response = await fetch(`/api/crawls/${crawlId}/leave`, {
//         method: "POST",
//       });

//       if (response.ok) {
//         await fetchAllTabData();
//         addNotification({
//           type: "info",
//           message: `You've left "${crawlName}"`,
//         });
//       } else {
//         const errorData = await response.json();
//         addNotification({
//           type: "error",
//           message: errorData.message || "Failed to leave crawl",
//         });
//       }
//     } catch (error) {
//       console.error("Error leaving crawl:", error);
//       addNotification({
//         type: "error",
//         message: "Failed to leave crawl",
//       });
//     } finally {
//       setIsLeaving(null);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     });
//   };

//   const isUserInCrawl = (crawl: Crawl) => {
//     if (!session?.user?.id) return false;
//     return crawl.participants.some((p) => p.userId === session.user.id);
//   };

//   const isUserCreator = (crawl: Crawl) => {
//     if (!session?.user?.id) return false;
//     return crawl.creator.id === session.user.id;
//   };

//   const isCrawlFull = (crawl: Crawl) => {
//     return crawl._count.participants >= crawl.maxParticipants;
//   };

//   const isCrawlPast = (crawl: Crawl) => {
//     const crawlDate = new Date(crawl.date);
//     const now = new Date();

//     // If the crawl date is in a previous year, it's definitely past
//     if (crawlDate.getFullYear() < now.getFullYear()) {
//       return true;
//     }

//     // If it's the same year but the date has passed, it's past
//     if (crawlDate.getFullYear() === now.getFullYear() && crawlDate < now) {
//       return true;
//     }

//     // Also check status
//     return crawl.status === "COMPLETED" || crawl.status === "CANCELLED";
//   };

//   const canJoinCrawl = (crawl: Crawl) => {
//     return (
//       isAuthenticated &&
//       !isUserInCrawl(crawl) &&
//       !isCrawlFull(crawl) &&
//       !isCrawlPast(crawl) &&
//       (crawl.status === "PLANNING" || crawl.status === "UPCOMING")
//     );
//   };

//   const canLeaveCrawl = (crawl: Crawl) => {
//     return (
//       isAuthenticated &&
//       isUserInCrawl(crawl) &&
//       !isUserCreator(crawl) &&
//       !isCrawlPast(crawl)
//     );
//   };

//   const canDeleteCrawl = (crawl: Crawl) => {
//     return isAuthenticated && isUserCreator(crawl) && !isCrawlPast(crawl);
//   };

//   // Calculate tab counts from the correct state variables
//   const tabCounts = {
//     discover: discoverCrawls.length,
//     "my-crawls": myUpcomingCrawls.length,
//     "past-events": pastPublicCrawls.length,
//     "my-past-events": myPastCrawls.length,
//   };

//   // Determine which crawls to display based on active tab
//   const displayCrawls =
//     activeTab === "discover"
//       ? discoverCrawls
//       : activeTab === "my-crawls"
//         ? myUpcomingCrawls
//         : activeTab === "past-events"
//           ? pastPublicCrawls
//           : myPastCrawls;

//   const isPastTab =
//     activeTab === "past-events" || activeTab === "my-past-events";

//   if (status === "loading") {
//     return (
//       <Page>
//         <Title>My Events</Title>
//         <Description>Manage your events and discover new ones</Description>
//         <CrawlsGrid>
//           <LoadingContainer>
//             <HopprLoader />
//           </LoadingContainer>
//         </CrawlsGrid>
//       </Page>
//     );
//   }

//   return (
//     <Page>
//       {/* Delete Confirmation Modal */}
//       {deleteModal && (
//         <ModalOverlay>
//           <ModalContent>
//             <ModalTitle>Delete Event</ModalTitle>
//             <ModalMessage>
//               Are you sure you want to delete &quot;{deleteModal.crawlName}
//               &quot;? This action cannot be undone.
//             </ModalMessage>
//             <ModalActions>
//               <CancelButton onClick={handleCancelDelete}>Cancel</CancelButton>
//               <ConfirmDeleteButton
//                 onClick={handleConfirmDelete}
//                 $isDeleting={deleteModal.isDeleting}
//                 disabled={deleteModal.isDeleting}
//               >
//                 {deleteModal.isDeleting ? "Deleting..." : "Delete Event"}
//               </ConfirmDeleteButton>
//             </ModalActions>
//           </ModalContent>
//         </ModalOverlay>
//       )}

//       {/* Notifications */}
//       <NotificationContainer>
//         {notifications.map((notification) => (
//           <Notification key={notification.id} $type={notification.type}>
//             <NotificationContent>
//               <NotificationIcon>
//                 {notification.type === "success" && "🎉"}
//                 {notification.type === "error" && "❌"}
//                 {notification.type === "info" && "ℹ️"}
//                 {notification.type === "warning" && "⚠️"}
//               </NotificationIcon>
//               <NotificationMessage>{notification.message}</NotificationMessage>
//             </NotificationContent>
//             <div
//               style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
//             >
//               {notification.undoAction && (
//                 <UndoButton onClick={notification.undoAction}>Undo</UndoButton>
//               )}
//               <CloseButton onClick={() => removeNotification(notification.id)}>
//                 ×
//               </CloseButton>
//             </div>
//           </Notification>
//         ))}
//       </NotificationContainer>

//       <Title>My Events</Title>
//       <Description>
//         {isAuthenticated
//           ? "Manage your events and discover new adventures!"
//           : "Sign in to view and manage your events"}
//       </Description>

//       <TabContainer>
//         <Tab
//           $active={activeTab === "discover"}
//           onClick={() => setActiveTab("discover")}
//         >
//           Discover ({tabCounts.discover})
//         </Tab>

//         {isAuthenticated && (
//           <>
//             <Tab
//               $active={activeTab === "my-crawls"}
//               onClick={() => setActiveTab("my-crawls")}
//             >
//               My Events ({tabCounts["my-crawls"]})
//             </Tab>
//             {/* <Tab
//               $active={activeTab === "past-events"}
//               onClick={() => setActiveTab("past-events")}
//             >
//               Past Public ({tabCounts["past-events"]})
//             </Tab> */}
//             <Tab
//               $active={activeTab === "my-past-events"}
//               onClick={() => setActiveTab("my-past-events")}
//             >
//               My Past ({tabCounts["my-past-events"]})
//             </Tab>
//           </>
//         )}
//       </TabContainer>

//       <CrawlsGrid>
//         {/* Show loading state OR content, not both */}
//         {isLoading ? (
//           <LoadingContainer>
//             <HopprLoader />
//           </LoadingContainer>
//         ) : (
//           <>
//             {/* Create Crawl Card - Only show for non-past tabs */}
//             {!isPastTab &&
//               (isAuthenticated ? (
//                 <CreateCrawlCardMobileHidden href="/app/crawl-planner">
//                   <CreateIcon>🎯</CreateIcon>
//                   <CreateText>Create New Event</CreateText>
//                   <CreateSubtext>Plan your own adventure</CreateSubtext>
//                 </CreateCrawlCardMobileHidden>
//               ) : (
//                 <CreateCrawlCardMobileHidden href="/app/auth/signup">
//                   <CreateIcon>🔐</CreateIcon>
//                   <CreateText>Sign Up to Create Events</CreateText>
//                   <CreateSubtext>Join to start planning events</CreateSubtext>
//                 </CreateCrawlCardMobileHidden>
//               ))}

//             {/* Display crawls */}
//             {displayCrawls.map((crawl) => {
//               const userInCrawl = isUserInCrawl(crawl);
//               const userIsCreator = isUserCreator(crawl);
//               const crawlFull = isCrawlFull(crawl);
//               const canJoin = canJoinCrawl(crawl);
//               const canLeave = canLeaveCrawl(crawl);
//               const canDelete = canDeleteCrawl(crawl);
//               const isPastCrawl = isCrawlPast(crawl);
//               const CardComponent = isPastCrawl ? PastCrawlCard : CrawlCard;

//               return (
//                 <CardComponent key={crawl.id}>
//                   <CrawlHeader>
//                     <CrawlName>
//                       {crawl.name}
//                       {isPastCrawl && (
//                         <PastEventIndicator>(Past Event)</PastEventIndicator>
//                       )}
//                     </CrawlName>
//                     <CrawlStatus $status={crawl.status}>
//                       {isPastCrawl
//                         ? "Past"
//                         : crawl.status === "PLANNING"
//                           ? "Joinable"
//                           : crawl.status.toLowerCase()}
//                     </CrawlStatus>
//                   </CrawlHeader>

//                   <CrawlMeta>
//                     <MetaItem>
//                       <MetaLabel>Date & Time</MetaLabel>
//                       <MetaValue>{formatDate(crawl.date)}</MetaValue>
//                     </MetaItem>
//                     <MetaItem>
//                       <MetaLabel>City</MetaLabel>
//                       <MetaValue>{crawl.city.name}</MetaValue>
//                     </MetaItem>
//                     <MetaItem>
//                       <MetaLabel>Participants</MetaLabel>
//                       <MetaValue>
//                         {crawl._count.participants}/{crawl.maxParticipants}
//                       </MetaValue>
//                     </MetaItem>
//                     <MetaItem>
//                       <MetaLabel>Bars</MetaLabel>
//                       <MetaValue>{crawl.crawlBars.length} stops</MetaValue>
//                     </MetaItem>
//                   </CrawlMeta>

//                   <BarPreview>
//                     <BarCount>
//                       {Math.floor(
//                         (crawl._count.participants / crawl.maxParticipants) *
//                           100,
//                       )}
//                       % full • {crawl.isPublic ? "Public" : "Private"}
//                       {userIsCreator && " • Your Event"}
//                       {isPastCrawl && " • Past Event"}
//                     </BarCount>
//                   </BarPreview>

//                   <ActionButtons>
//                     <ViewButton href={`/app/crawls/${crawl.id}`}>
//                       {isPastCrawl ? "View Details" : "View Details"}
//                     </ViewButton>

//                     {!isPastCrawl && (
//                       <>
//                         {canDelete ? (
//                           <DeleteButtonWrapper>
//                             <DeleteButton
//                               onClick={() =>
//                                 showDeleteConfirmation(crawl.id, crawl.name)
//                               }
//                               $isDeleting={isDeleting === crawl.id}
//                               disabled={isDeleting === crawl.id}
//                             >
//                               {isDeleting === crawl.id
//                                 ? "Deleting..."
//                                 : "Delete"}
//                             </DeleteButton>
//                             <Tooltip>Delete this event permanently</Tooltip>
//                           </DeleteButtonWrapper>
//                         ) : (
//                           <JoinButtonWrapper>
//                             <JoinButton
//                               onClick={() =>
//                                 userInCrawl && canLeave
//                                   ? handleLeaveCrawl(crawl.id, crawl.name)
//                                   : handleJoinCrawl(crawl.id, crawl.name)
//                               }
//                               $requiresAuth={
//                                 !isAuthenticated || (!canJoin && !canLeave)
//                               }
//                               $isLeaving={userInCrawl && canLeave}
//                               disabled={
//                                 (!canJoin && !canLeave) ||
//                                 isJoining === crawl.id ||
//                                 isLeaving === crawl.id
//                               }
//                             >
//                               {isJoining === crawl.id
//                                 ? "Joining..."
//                                 : isLeaving === crawl.id
//                                   ? "Leaving..."
//                                   : userInCrawl && userIsCreator
//                                     ? "Your Event"
//                                     : userInCrawl && canLeave
//                                       ? "Leave Event"
//                                       : crawlFull
//                                         ? "Full"
//                                         : !isAuthenticated
//                                           ? "Sign Up to Join"
//                                           : !canJoin
//                                             ? "Cannot Join"
//                                             : "Join Event"}
//                             </JoinButton>

//                             {crawlFull && <Tooltip>This event is full</Tooltip>}
//                             {!isAuthenticated && !crawlFull && (
//                               <Tooltip>Sign up to join this event</Tooltip>
//                             )}
//                             {isAuthenticated &&
//                               userInCrawl &&
//                               userIsCreator && (
//                                 <Tooltip>You created this event</Tooltip>
//                               )}
//                             {isAuthenticated && userInCrawl && canLeave && (
//                               <Tooltip>Click to leave this event</Tooltip>
//                             )}
//                             {isAuthenticated &&
//                               !userInCrawl &&
//                               !crawlFull &&
//                               !canJoin && (
//                                 <Tooltip>
//                                   This event is no longer joinable
//                                 </Tooltip>
//                               )}
//                           </JoinButtonWrapper>
//                         )}
//                       </>
//                     )}

//                     {isPastCrawl && (
//                       <ViewButton
//                         href={`/app/crawls/${crawl.id}`}
//                         style={{ flex: 1 }}
//                       >
//                         View Memories
//                       </ViewButton>
//                     )}
//                   </ActionButtons>
//                 </CardComponent>
//               );
//             })}

//             {/* Empty State */}
//             {displayCrawls.length === 0 && (
//               <EmptyState>
//                 <div
//                   className="icon"
//                   style={{ backgroundColor: "red !important" }}
//                 >
//                   {activeTab === "discover"
//                     ? "🔍"
//                     : activeTab === "my-crawls"
//                       ? ""
//                       : activeTab === "past-events"
//                         ? "🏁"
//                         : "📖"}
//                 </div>
//                 <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
//                   {activeTab === "discover" && "No upcoming events available"}
//                   {activeTab === "my-crawls" && "No upcoming events"}
//                   {activeTab === "past-events" && "No past events found"}
//                   {activeTab === "my-past-events" && "No past events joined"}
//                 </h3>
//                 <p>
//                   {activeTab === "discover" &&
//                     "Check back later for new events!"}
//                   {activeTab === "my-crawls" &&
//                     "Join an event from the Discover tab or create your own!"}
//                   {activeTab === "past-events" &&
//                     "Past public events will appear here"}
//                   {activeTab === "my-past-events" &&
//                     "Your past event history will appear here"}
//                 </p>
//                 {/* {!isPastTab && (
//                   <CreateCrawlCard
//                     href={isAuthenticated ? "/crawl-planner" : "/auth/signup"}
//                     style={{
//                       marginTop: "1rem",
//                       minHeight: "auto",
//                       padding: "1.5rem",
//                     }}
//                   >
//                     <CreateText>
//                       {isAuthenticated
//                         ? "Create Your First Crawl"
//                         : "Be the first to create one!"}
//                     </CreateText>
//                   </CreateCrawlCard>
//                 )} */}
//               </EmptyState>
//             )}
//           </>
//         )}
//       </CrawlsGrid>
//     </Page>
//   );
// };
// export default MyCrawls;
"use client";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";

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
  line-height: 1.2;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Description = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" : "transparent"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${(props) =>
    props.$active ? "white" : props.theme.colors.textSecondary};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
        : "rgba(139, 92, 246, 0.1)"};
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
  }
`;

export const CreateCrawlCard = styled(Link)`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(16px);
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    background: ${({ theme }) => theme.colors.tertiaryBackground};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 160px;
  }
`;

const CreateCrawlCardMobileHidden = styled(CreateCrawlCard)`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CreateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const CreateText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const CreateSubtext = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const CrawlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
    margin-top: 1.5rem;
  }
`;

export const CrawlCard = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const PastCrawlCard = styled(CrawlCard)`
  opacity: 0.7;
  border-color: rgba(107, 114, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(107, 114, 128, 0.2);
    border-color: rgba(107, 114, 128, 0.5);
  }
`;

export const CrawlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CrawlName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  flex: 1;
  line-height: 1.3;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const PastEventIndicator = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 0.5rem;
  font-style: italic;
  display: block;
  margin-top: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 0.65rem;
    margin-left: 0;
  }
`;

export const CrawlStatus = styled.span<{
  $status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}>`
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
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.mono};

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
`;

export const CrawlMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MetaLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const BarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const BarCount = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const ViewButton = styled(Link)`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
`;

export const JoinButton = styled.button<{
  $requiresAuth?: boolean;
  $isLeaving?: boolean;
}>`
  background: ${(props) =>
    props.$isLeaving
      ? "linear-gradient(45deg, #f59e0b, #d97706)"
      : props.$requiresAuth
        ? "linear-gradient(45deg, #6b7280, #4b5563)"
        : "linear-gradient(45deg, #10b981, #059669)"};
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.$requiresAuth ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  flex: 1;
  opacity: ${(props) => (props.$requiresAuth ? 0.6 : 1)};
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props.$requiresAuth ? "none" : "translateY(-1px)"};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

export const DeleteButton = styled.button<{ $isDeleting?: boolean }>`
  background: ${(props) =>
    props.$isDeleting
      ? "linear-gradient(45deg, #dc2626, #b91c1c)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  opacity: ${(props) => (props.$isDeleting ? 0.7 : 1)};

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.secondaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.secondaryBackground};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const JoinButtonWrapper = styled.div`
  position: relative;
  flex: 1;

  &:hover ${Tooltip} {
    opacity: 1;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const DeleteButtonWrapper = styled.div`
  position: relative;
  flex: 1;

  &:hover ${Tooltip} {
    opacity: 1;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  width: 100%;
  grid-column: 1 / -1;
`;

export const NotificationContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;

  @media (max-width: 768px) {
    left: 1rem;
    right: 1rem;
    top: 80px;
  }
`;

export const Notification = styled.div<{
  $type: "success" | "error" | "info" | "warning";
}>`
  background: ${(props) =>
    props.$type === "success"
      ? "linear-gradient(45deg, #10b981, #059669)"
      : props.$type === "error"
        ? "linear-gradient(45deg, #ef4444, #dc2626)"
        : props.$type === "warning"
          ? "linear-gradient(45deg, #f59e0b, #d97706)"
          : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const NotificationIcon = styled.div`
  font-size: 1.25rem;
`;

export const NotificationMessage = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const UndoButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
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
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ModalMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  background: rgba(107, 114, 128, 0.3);
  border: 1px solid rgba(107, 114, 128, 0.4);
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(107, 114, 128, 0.4);
  }
`;

export const ConfirmDeleteButton = styled.button<{ $isDeleting?: boolean }>`
  background: ${(props) =>
    props.$isDeleting
      ? "linear-gradient(45deg, #dc2626, #b91c1c)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$isDeleting ? 0.7 : 1)};
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

// ============================================
// TYPES & INTERFACES
// ============================================

interface CrawlUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string | null;
  maxParticipants: number;
  isPublic: boolean;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: CrawlUser;
  participants: Array<{
    userId: string;
  }>;
  crawlBars: Array<{
    bar: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    participants: number;
  };
}

type CrawlTab = "discover" | "my-crawls" | "past-events" | "my-past-events";

interface NotificationData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  crawlId?: string;
  crawlName?: string;
  undoAction?: () => void;
}

interface DeleteModalData {
  crawlId: string;
  crawlName: string;
  isDeleting: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

const MyCrawls = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<CrawlTab>("my-crawls");

  const [discoverCrawls, setDiscoverCrawls] = useState<Crawl[]>([]);
  const [myUpcomingCrawls, setMyUpcomingCrawls] = useState<Crawl[]>([]);
  const [pastPublicCrawls, setPastPublicCrawls] = useState<Crawl[]>([]);
  const [myPastCrawls, setMyPastCrawls] = useState<Crawl[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModalData | null>(null);

  const isAuthenticated = !!session;

  const addNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { ...notification, id }]);

      if (!notification.undoAction) {
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const fetchAllTabData = useCallback(async () => {
    try {
      setIsLoading(true);

      const promises = [];

      promises.push(
        fetch("/api/crawls?public=true")
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setDiscoverCrawls(data))
          .catch(() => setDiscoverCrawls([])),
      );

      if (isAuthenticated) {
        promises.push(
          fetch("/api/crawls/my-crawls")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              const upcomingCrawls = data.filter(
                (crawl: Crawl) => !isCrawlPast(crawl),
              );
              setMyUpcomingCrawls(upcomingCrawls);
            })
            .catch(() => setMyUpcomingCrawls([])),
        );

        promises.push(
          fetch("/api/crawls/past-events?public=true")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setPastPublicCrawls(data))
            .catch(() => setPastPublicCrawls([])),
        );

        promises.push(
          fetch("/api/crawls/past-events")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setMyPastCrawls(data))
            .catch(() => setMyPastCrawls([])),
        );
      } else {
        setMyUpcomingCrawls([]);
        setPastPublicCrawls([]);
        setMyPastCrawls([]);
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching events:", error);
      setDiscoverCrawls([]);
      setMyUpcomingCrawls([]);
      setPastPublicCrawls([]);
      setMyPastCrawls([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [isAuthenticated]);

  const fetchActiveTabData = useCallback(async () => {
    if (isInitialLoad) return;

    try {
      setIsLoading(true);

      if (activeTab === "discover") {
        const response = await fetch("/api/crawls?public=true");
        if (response.ok) {
          const data = await response.json();
          setDiscoverCrawls(data);
        }
      } else if (activeTab === "my-crawls" && isAuthenticated) {
        const response = await fetch("/api/crawls/my-crawls");
        if (response.ok) {
          const data = await response.json();
          const upcomingCrawls = data.filter(
            (crawl: Crawl) => !isCrawlPast(crawl),
          );
          setMyUpcomingCrawls(upcomingCrawls);
        }
      } else if (activeTab === "past-events" && isAuthenticated) {
        const response = await fetch("/api/crawls/past-events?public=true");
        if (response.ok) {
          const data = await response.json();
          setPastPublicCrawls(data);
        }
      } else if (activeTab === "my-past-events" && isAuthenticated) {
        const response = await fetch("/api/crawls/past-events");
        if (response.ok) {
          const data = await response.json();
          setMyPastCrawls(data);
        }
      }
    } catch (error) {
      console.error("Error fetching active tab data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, isAuthenticated, isInitialLoad]);

  useEffect(() => {
    fetchAllTabData();
  }, [fetchAllTabData]);

  useEffect(() => {
    if (!isInitialLoad) {
      fetchActiveTabData();
    }
  }, [activeTab, fetchActiveTabData, isInitialLoad]);

  const handleQuickDelete = async (crawlId: string, crawlName: string) => {
    if (!isAuthenticated) return;

    setIsDeleting(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMyUpcomingCrawls((prev) =>
          prev.filter((crawl) => crawl.id !== crawlId),
        );
        setDiscoverCrawls((prev) =>
          prev.filter((crawl) => crawl.id !== crawlId),
        );

        addNotification({
          type: "success",
          message: `"${crawlName}" has been deleted`,
          crawlId,
          crawlName,
          undoAction: async () => {
            try {
              await fetchAllTabData();
              addNotification({
                type: "info",
                message: `"${crawlName}" has been restored`,
              });
            } catch (error) {
              addNotification({
                type: "error",
                message: "Failed to restore crawl",
              });
            }
          },
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          message: errorData.message || "Failed to delete crawl",
        });
        await fetchAllTabData();
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to delete crawl",
      });
      await fetchAllTabData();
    } finally {
      setIsDeleting(null);
    }
  };

  const showDeleteConfirmation = (crawlId: string, crawlName: string) => {
    setDeleteModal({
      crawlId,
      crawlName,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;

    setDeleteModal((prev) => (prev ? { ...prev, isDeleting: true } : null));
    await handleQuickDelete(deleteModal.crawlId, deleteModal.crawlName);
    setDeleteModal(null);
  };

  const handleCancelDelete = () => {
    setDeleteModal(null);
  };

  const handleJoinCrawl = async (crawlId: string, crawlName: string) => {
    if (!isAuthenticated) {
      window.location.href = `/app/auth/signup?redirect=/crawls&crawl=${crawlId}`;
      return;
    }

    setIsJoining(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchAllTabData();

        addNotification({
          type: "success",
          message: `You've joined "${crawlName}"!`,
          crawlId,
          crawlName,
          undoAction: async () => {
            try {
              const leaveResponse = await fetch(
                `/api/crawls/${crawlId}/leave`,
                { method: "POST" },
              );

              if (leaveResponse.ok) {
                await fetchAllTabData();
                addNotification({
                  type: "info",
                  message: `You've left "${crawlName}"`,
                });
              } else {
                addNotification({
                  type: "error",
                  message: "Failed to leave crawl",
                });
              }
            } catch (error) {
              addNotification({
                type: "error",
                message: "Failed to leave crawl",
              });
            }
          },
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          message:
            errorData.message || "Failed to join crawl. Please try again.",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to join crawl. Please try again.",
      });
    } finally {
      setIsJoining(null);
    }
  };

  const handleLeaveCrawl = async (crawlId: string, crawlName: string) => {
    if (!isAuthenticated) return;

    setIsLeaving(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}/leave`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchAllTabData();
        addNotification({
          type: "info",
          message: `You've left "${crawlName}"`,
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          message: errorData.message || "Failed to leave crawl",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to leave crawl",
      });
    } finally {
      setIsLeaving(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isUserInCrawl = (crawl: Crawl) => {
    if (!session?.user?.id) return false;
    return crawl.participants.some((p) => p.userId === session.user.id);
  };

  const isUserCreator = (crawl: Crawl) => {
    if (!session?.user?.id) return false;
    return crawl.creator.id === session.user.id;
  };

  const isCrawlFull = (crawl: Crawl) => {
    return crawl._count.participants >= crawl.maxParticipants;
  };

  const isCrawlPast = (crawl: Crawl) => {
    const crawlDate = new Date(crawl.date);
    const now = new Date();

    if (crawlDate.getFullYear() < now.getFullYear()) return true;
    if (crawlDate.getFullYear() === now.getFullYear() && crawlDate < now)
      return true;
    return crawl.status === "COMPLETED" || crawl.status === "CANCELLED";
  };

  const canJoinCrawl = (crawl: Crawl) => {
    return (
      isAuthenticated &&
      !isUserInCrawl(crawl) &&
      !isCrawlFull(crawl) &&
      !isCrawlPast(crawl) &&
      (crawl.status === "PLANNING" || crawl.status === "UPCOMING")
    );
  };

  const canLeaveCrawl = (crawl: Crawl) => {
    return (
      isAuthenticated &&
      isUserInCrawl(crawl) &&
      !isUserCreator(crawl) &&
      !isCrawlPast(crawl)
    );
  };

  const canDeleteCrawl = (crawl: Crawl) => {
    return isAuthenticated && isUserCreator(crawl) && !isCrawlPast(crawl);
  };

  const tabCounts = {
    discover: discoverCrawls.length,
    "my-crawls": myUpcomingCrawls.length,
    "past-events": pastPublicCrawls.length,
    "my-past-events": myPastCrawls.length,
  };

  const displayCrawls =
    activeTab === "discover"
      ? discoverCrawls
      : activeTab === "my-crawls"
        ? myUpcomingCrawls
        : activeTab === "past-events"
          ? pastPublicCrawls
          : myPastCrawls;

  const isPastTab =
    activeTab === "past-events" || activeTab === "my-past-events";

  if (status === "loading") {
    return (
      <Page>
        <Title>My Events</Title>
        <Description>Manage your events and discover new ones</Description>
        <CrawlsGrid>
          <LoadingContainer>
            <HopprLoader />
          </LoadingContainer>
        </CrawlsGrid>
      </Page>
    );
  }

  return (
    <Page>
      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Delete Event</ModalTitle>
            <ModalMessage>
              Are you sure you want to delete &quot;{deleteModal.crawlName}
              &quot;? This action cannot be undone.
            </ModalMessage>
            <ModalActions>
              <CancelButton onClick={handleCancelDelete}>Cancel</CancelButton>
              <ConfirmDeleteButton
                onClick={handleConfirmDelete}
                $isDeleting={deleteModal.isDeleting}
                disabled={deleteModal.isDeleting}
              >
                {deleteModal.isDeleting ? "Deleting..." : "Delete Event"}
              </ConfirmDeleteButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Notifications */}
      <NotificationContainer>
        {notifications.map((notification) => (
          <Notification key={notification.id} $type={notification.type}>
            <NotificationContent>
              <NotificationIcon>
                {notification.type === "success" && "🎉"}
                {notification.type === "error" && "❌"}
                {notification.type === "info" && "ℹ️"}
                {notification.type === "warning" && "⚠️"}
              </NotificationIcon>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContent>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              {notification.undoAction && (
                <UndoButton onClick={notification.undoAction}>Undo</UndoButton>
              )}
              <CloseButton onClick={() => removeNotification(notification.id)}>
                ×
              </CloseButton>
            </div>
          </Notification>
        ))}
      </NotificationContainer>

      <Title>My Events</Title>
      <Description>
        {isAuthenticated
          ? "Manage your events and discover new adventures!"
          : "Sign in to view and manage your events"}
      </Description>

      <TabContainer>
        <Tab
          $active={activeTab === "discover"}
          onClick={() => setActiveTab("discover")}
        >
          Discover ({tabCounts.discover})
        </Tab>

        {isAuthenticated && (
          <>
            <Tab
              $active={activeTab === "my-crawls"}
              onClick={() => setActiveTab("my-crawls")}
            >
              My Events ({tabCounts["my-crawls"]})
            </Tab>
            <Tab
              $active={activeTab === "my-past-events"}
              onClick={() => setActiveTab("my-past-events")}
            >
              My Past ({tabCounts["my-past-events"]})
            </Tab>
          </>
        )}
      </TabContainer>

      <CrawlsGrid>
        {isLoading ? (
          <LoadingContainer>
            <HopprLoader />
          </LoadingContainer>
        ) : (
          <>
            {!isPastTab &&
              (isAuthenticated ? (
                <CreateCrawlCardMobileHidden href="/app/crawl-planner">
                  <CreateIcon>🎯</CreateIcon>
                  <CreateText>Create New Event</CreateText>
                  <CreateSubtext>Plan your own adventure</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ) : (
                <CreateCrawlCardMobileHidden href="/app/auth/signup">
                  <CreateIcon>🔐</CreateIcon>
                  <CreateText>Sign Up to Create Events</CreateText>
                  <CreateSubtext>Join to start planning events</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ))}

            {displayCrawls.map((crawl) => {
              const userInCrawl = isUserInCrawl(crawl);
              const userIsCreator = isUserCreator(crawl);
              const crawlFull = isCrawlFull(crawl);
              const canJoin = canJoinCrawl(crawl);
              const canLeave = canLeaveCrawl(crawl);
              const canDelete = canDeleteCrawl(crawl);
              const isPastCrawl = isCrawlPast(crawl);
              const CardComponent = isPastCrawl ? PastCrawlCard : CrawlCard;

              return (
                <CardComponent key={crawl.id}>
                  <CrawlHeader>
                    <CrawlName>
                      {crawl.name}
                      {isPastCrawl && (
                        <PastEventIndicator>(Past Event)</PastEventIndicator>
                      )}
                    </CrawlName>
                    <CrawlStatus $status={crawl.status}>
                      {isPastCrawl
                        ? "Past"
                        : crawl.status === "PLANNING"
                          ? "Joinable"
                          : crawl.status.toLowerCase()}
                    </CrawlStatus>
                  </CrawlHeader>

                  <CrawlMeta>
                    <MetaItem>
                      <MetaLabel>Date & Time</MetaLabel>
                      <MetaValue>{formatDate(crawl.date)}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>City</MetaLabel>
                      <MetaValue>{crawl.city.name}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Participants</MetaLabel>
                      <MetaValue>
                        {crawl._count.participants}/{crawl.maxParticipants}
                      </MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Bars</MetaLabel>
                      <MetaValue>{crawl.crawlBars.length} stops</MetaValue>
                    </MetaItem>
                  </CrawlMeta>

                  <BarPreview>
                    <BarCount>
                      {Math.floor(
                        (crawl._count.participants / crawl.maxParticipants) *
                          100,
                      )}
                      % full • {crawl.isPublic ? "Public" : "Private"}
                      {userIsCreator && " • Your Event"}
                      {isPastCrawl && " • Past Event"}
                    </BarCount>
                  </BarPreview>

                  <ActionButtons>
                    <ViewButton href={`/app/crawls/${crawl.id}`}>
                      {isPastCrawl ? "View Details" : "View Details"}
                    </ViewButton>

                    {!isPastCrawl && (
                      <>
                        {canDelete ? (
                          <DeleteButtonWrapper>
                            <DeleteButton
                              onClick={() =>
                                showDeleteConfirmation(crawl.id, crawl.name)
                              }
                              $isDeleting={isDeleting === crawl.id}
                              disabled={isDeleting === crawl.id}
                            >
                              {isDeleting === crawl.id
                                ? "Deleting..."
                                : "Delete"}
                            </DeleteButton>
                            <Tooltip>Delete this event permanently</Tooltip>
                          </DeleteButtonWrapper>
                        ) : (
                          <JoinButtonWrapper>
                            <JoinButton
                              onClick={() =>
                                userInCrawl && canLeave
                                  ? handleLeaveCrawl(crawl.id, crawl.name)
                                  : handleJoinCrawl(crawl.id, crawl.name)
                              }
                              $requiresAuth={
                                !isAuthenticated || (!canJoin && !canLeave)
                              }
                              $isLeaving={userInCrawl && canLeave}
                              disabled={
                                (!canJoin && !canLeave) ||
                                isJoining === crawl.id ||
                                isLeaving === crawl.id
                              }
                            >
                              {isJoining === crawl.id
                                ? "Joining..."
                                : isLeaving === crawl.id
                                  ? "Leaving..."
                                  : userInCrawl && userIsCreator
                                    ? "Your Event"
                                    : userInCrawl && canLeave
                                      ? "Leave Event"
                                      : crawlFull
                                        ? "Full"
                                        : !isAuthenticated
                                          ? "Sign Up to Join"
                                          : !canJoin
                                            ? "Cannot Join"
                                            : "Join Event"}
                            </JoinButton>

                            {crawlFull && <Tooltip>This event is full</Tooltip>}
                            {!isAuthenticated && !crawlFull && (
                              <Tooltip>Sign up to join this event</Tooltip>
                            )}
                            {isAuthenticated &&
                              userInCrawl &&
                              userIsCreator && (
                                <Tooltip>You created this event</Tooltip>
                              )}
                            {isAuthenticated && userInCrawl && canLeave && (
                              <Tooltip>Click to leave this event</Tooltip>
                            )}
                          </JoinButtonWrapper>
                        )}
                      </>
                    )}

                    {isPastCrawl && (
                      <ViewButton
                        href={`/app/crawls/${crawl.id}`}
                        style={{ flex: 1 }}
                      >
                        View Memories
                      </ViewButton>
                    )}
                  </ActionButtons>
                </CardComponent>
              );
            })}

            {displayCrawls.length === 0 && (
              <EmptyState>
                <div className="icon">
                  {activeTab === "discover"
                    ? "🔍"
                    : activeTab === "my-crawls"
                      ? "📅"
                      : activeTab === "past-events"
                        ? "🏁"
                        : "📖"}
                </div>
                <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
                  {activeTab === "discover" && "No upcoming events available"}
                  {activeTab === "my-crawls" && "No upcoming events"}
                  {activeTab === "past-events" && "No past events found"}
                  {activeTab === "my-past-events" && "No past events joined"}
                </h3>
                <p>
                  {activeTab === "discover" &&
                    "Check back later for new events!"}
                  {activeTab === "my-crawls" &&
                    "Join an event from the Discover tab or create your own!"}
                  {activeTab === "past-events" &&
                    "Past public events will appear here"}
                  {activeTab === "my-past-events" &&
                    "Your past event history will appear here"}
                </p>
              </EmptyState>
            )}
          </>
        )}
      </CrawlsGrid>
    </Page>
  );
};

export default MyCrawls;
