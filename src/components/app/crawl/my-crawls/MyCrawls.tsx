"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
import {
  ActionButtons,
  BarCount,
  BarPreview,
  CancelButton,
  CloseButton,
  ConfirmDeleteButton,
  CrawlCard,
  CrawlHeader,
  CrawlMeta,
  CrawlName,
  CrawlsGrid,
  CrawlStatus,
  CreateCrawlCard,
  CreateIcon,
  CreateSubtext,
  CreateText,
  DeleteButton,
  DeleteButtonWrapper,
  Description,
  EmptyState,
  JoinButton,
  JoinButtonWrapper,
  LoadingContainer,
  MetaItem,
  MetaLabel,
  MetaValue,
  ModalActions,
  ModalContent,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
  NotificationContainer,
  NotificationContent,
  NotificationIcon,
  NotificationMessage,
  Page,
  PastCrawlCard,
  PastEventIndicator,
  Tab,
  TabContainer,
  Title,
  Tooltip,
  UndoButton,
  ViewButton,
} from "./MyCrawls.styles";
import { styled } from "styled-components";

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

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CreateCrawlCardMobileHidden = styled(CreateCrawlCard)`
  /* Show on desktop, hide on mobile */
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

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

const MyCrawls = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<CrawlTab>("my-crawls");

  // Separate states for each tab to prevent conflicts
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

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { ...notification, id }]);

      // Auto remove after 5 seconds (except for notifications with undo)
      if (!notification.undoAction) {
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      }
    },
    []
  );

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Fetch data for ALL tabs when component mounts or auth changes
  const fetchAllTabData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch data for all tabs in parallel
      const promises = [];

      // Always fetch discover crawls
      promises.push(
        fetch("/api/crawls?public=true")
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setDiscoverCrawls(data))
          .catch(() => setDiscoverCrawls([]))
      );

      if (isAuthenticated) {
        // Fetch user's upcoming crawls
        promises.push(
          fetch("/api/crawls/my-crawls")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              const upcomingCrawls = data.filter(
                (crawl: Crawl) => !isCrawlPast(crawl)
              );
              setMyUpcomingCrawls(upcomingCrawls);
            })
            .catch(() => setMyUpcomingCrawls([]))
        );

        // Fetch past public events
        promises.push(
          fetch("/api/crawls/past-events?public=true")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setPastPublicCrawls(data))
            .catch(() => setPastPublicCrawls([]))
        );

        // Fetch user's past events
        promises.push(
          fetch("/api/crawls/past-events")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setMyPastCrawls(data))
            .catch(() => setMyPastCrawls([]))
        );
      } else {
        // If not authenticated, clear user-specific data
        setMyUpcomingCrawls([]);
        setPastPublicCrawls([]);
        setMyPastCrawls([]);
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching crawls:", error);
      // Reset all states on error
      setDiscoverCrawls([]);
      setMyUpcomingCrawls([]);
      setPastPublicCrawls([]);
      setMyPastCrawls([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [isAuthenticated]);

  // Also keep the individual tab fetch for when switching tabs (to refresh data)
  const fetchActiveTabData = useCallback(async () => {
    if (isInitialLoad) return; // Don't fetch if we're in initial load

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
            (crawl: Crawl) => !isCrawlPast(crawl)
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

  // Fetch all data when component mounts or auth changes
  useEffect(() => {
    fetchAllTabData();
  }, [fetchAllTabData]);

  // Refresh only active tab data when tab changes (after initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      fetchActiveTabData();
    }
  }, [activeTab, fetchActiveTabData, isInitialLoad]);

  // Quick Delete Function
  const handleQuickDelete = async (crawlId: string, crawlName: string) => {
    if (!isAuthenticated) return;

    setIsDeleting(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Store the previous state for undo
        const previousMyCrawls = [...myUpcomingCrawls];
        const previousDiscoverCrawls = [...discoverCrawls];

        // Optimistically remove the crawl from the UI
        setMyUpcomingCrawls((prev) =>
          prev.filter((crawl) => crawl.id !== crawlId)
        );
        setDiscoverCrawls((prev) =>
          prev.filter((crawl) => crawl.id !== crawlId)
        );

        addNotification({
          type: "success",
          message: `"${crawlName}" has been deleted`,
          crawlId,
          crawlName,
          undoAction: async () => {
            try {
              // Re-fetch all data to restore the crawl
              await fetchAllTabData();
              addNotification({
                type: "info",
                message: `"${crawlName}" has been restored`,
              });
            } catch (error) {
              console.error("Error undoing delete:", error);
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
        // Refresh data to ensure UI is in sync
        await fetchAllTabData();
      }
    } catch (error) {
      console.error("Error deleting crawl:", error);
      addNotification({
        type: "error",
        message: "Failed to delete crawl",
      });
      // Refresh data to ensure UI is in sync
      await fetchAllTabData();
    } finally {
      setIsDeleting(null);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (crawlId: string, crawlName: string) => {
    setDeleteModal({
      crawlId,
      crawlName,
      isDeleting: false,
    });
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!deleteModal) return;

    setDeleteModal((prev) => (prev ? { ...prev, isDeleting: true } : null));

    await handleQuickDelete(deleteModal.crawlId, deleteModal.crawlName);
    setDeleteModal(null);
  };

  // Cancel delete
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
        // Store the previous state for undo
        const previousDiscoverCrawls = [...discoverCrawls];
        const previousMyCrawls = [...myUpcomingCrawls];

        // Refresh all data after joining
        await fetchAllTabData();

        // Show success notification with undo option
        addNotification({
          type: "success",
          message: `You've joined "${crawlName}"!`,
          crawlId,
          crawlName,
          undoAction: async () => {
            try {
              const leaveResponse = await fetch(
                `/api/crawls/${crawlId}/leave`,
                {
                  method: "POST",
                }
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
              console.error("Error leaving crawl:", error);
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
      console.error("Error joining crawl:", error);
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
      console.error("Error leaving crawl:", error);
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

    // If the crawl date is in a previous year, it's definitely past
    if (crawlDate.getFullYear() < now.getFullYear()) {
      return true;
    }

    // If it's the same year but the date has passed, it's past
    if (crawlDate.getFullYear() === now.getFullYear() && crawlDate < now) {
      return true;
    }

    // Also check status
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

  // Calculate tab counts from the correct state variables
  const tabCounts = {
    discover: discoverCrawls.length,
    "my-crawls": myUpcomingCrawls.length,
    "past-events": pastPublicCrawls.length,
    "my-past-events": myPastCrawls.length,
  };

  // Determine which crawls to display based on active tab
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
        <Title>My Bar Crawls</Title>
        <Description>Manage your bar crawls and discover new ones</Description>
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
            <ModalTitle>Delete Crawl</ModalTitle>
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
                {deleteModal.isDeleting ? "Deleting..." : "Delete Crawl"}
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

      <Title>My Bar Crawls</Title>
      <Description>
        {isAuthenticated
          ? "Manage your bar crawls and discover new adventures!"
          : "Sign in to view and manage your bar crawls"}
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
              My Crawls ({tabCounts["my-crawls"]})
            </Tab>
            {/* <Tab
              $active={activeTab === "past-events"}
              onClick={() => setActiveTab("past-events")}
            >
              Past Public ({tabCounts["past-events"]})
            </Tab> */}
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
        {/* Show loading state OR content, not both */}
        {isLoading ? (
          <LoadingContainer>
            <HopprLoader />
          </LoadingContainer>
        ) : (
          <>
            {/* Create Crawl Card - Only show for non-past tabs */}
            {!isPastTab &&
              (isAuthenticated ? (
                <CreateCrawlCardMobileHidden href="/app/crawl-planner">
                  <CreateIcon>🎯</CreateIcon>
                  <CreateText>Create New Crawl</CreateText>
                  <CreateSubtext>Plan your own bar adventure</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ) : (
                <CreateCrawlCardMobileHidden href="/app/auth/signup">
                  <CreateIcon>🔐</CreateIcon>
                  <CreateText>Sign Up to Create Crawls</CreateText>
                  <CreateSubtext>Join to start planning crawls</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ))}

            {/* Display crawls */}
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
                          100
                      )}
                      % full • {crawl.isPublic ? "Public" : "Private"}
                      {userIsCreator && " • Your Crawl"}
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
                            <Tooltip>Delete this crawl permanently</Tooltip>
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
                                ? "Your Crawl"
                                : userInCrawl && canLeave
                                ? "Leave Crawl"
                                : crawlFull
                                ? "Full"
                                : !isAuthenticated
                                ? "Sign Up to Join"
                                : !canJoin
                                ? "Cannot Join"
                                : "Join Crawl"}
                            </JoinButton>

                            {crawlFull && <Tooltip>This crawl is full</Tooltip>}
                            {!isAuthenticated && !crawlFull && (
                              <Tooltip>Sign up to join this crawl</Tooltip>
                            )}
                            {isAuthenticated &&
                              userInCrawl &&
                              userIsCreator && (
                                <Tooltip>You created this crawl</Tooltip>
                              )}
                            {isAuthenticated && userInCrawl && canLeave && (
                              <Tooltip>Click to leave this crawl</Tooltip>
                            )}
                            {isAuthenticated &&
                              !userInCrawl &&
                              !crawlFull &&
                              !canJoin && (
                                <Tooltip>
                                  This crawl is no longer joinable
                                </Tooltip>
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

            {/* Empty State */}
            {displayCrawls.length === 0 && (
              <EmptyState>
                <div
                  className="icon"
                  style={{ backgroundColor: "red !important" }}
                >
                  {activeTab === "discover"
                    ? "🔍"
                    : activeTab === "my-crawls"
                    ? ""
                    : activeTab === "past-events"
                    ? "🏁"
                    : "📖"}
                </div>
                <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
                  {activeTab === "discover" && "No upcoming crawls available"}
                  {activeTab === "my-crawls" && "No upcoming crawls"}
                  {activeTab === "past-events" && "No past events found"}
                  {activeTab === "my-past-events" && "No past events joined"}
                </h3>
                <p>
                  {activeTab === "discover" &&
                    "Check back later for new crawl opportunities!"}
                  {activeTab === "my-crawls" &&
                    "Join a crawl from the Discover tab or create your own!"}
                  {activeTab === "past-events" &&
                    "Past public events will appear here"}
                  {activeTab === "my-past-events" &&
                    "Your past crawl history will appear here"}
                </p>
                {/* {!isPastTab && (
                  <CreateCrawlCard
                    href={isAuthenticated ? "/crawl-planner" : "/auth/signup"}
                    style={{
                      marginTop: "1rem",
                      minHeight: "auto",
                      padding: "1.5rem",
                    }}
                  >
                    <CreateText>
                      {isAuthenticated
                        ? "Create Your First Crawl"
                        : "Be the first to create one!"}
                    </CreateText>
                  </CreateCrawlCard>
                )} */}
              </EmptyState>
            )}
          </>
        )}
      </CrawlsGrid>
    </Page>
  );
};
export default MyCrawls;
