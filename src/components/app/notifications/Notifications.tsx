"use client";
import { NotificationData } from "@/types/socket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import styled from "styled-components";

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 1rem 0.5rem 10rem;

  @media (min-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    border-radius: 12px;
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  margin: 0.25rem 0 0 0;
  color: #94a3b8;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const ConnectionStatus = styled.div<{ $isConnected: boolean }>`
  padding: 0.4rem 0.6rem;
  background: ${(props) =>
    props.$isConnected ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$isConnected ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${(props) => (props.$isConnected ? "#22c55e" : "#ef4444")};
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    gap: 0.5rem;
  }
`;

const StatusDot = styled.div<{ $isConnected: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => (props.$isConnected ? "#22c55e" : "#ef4444")};

  @media (min-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const BackButton = styled.button`
  padding: 0.6rem 0.8rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: #8b5cf6;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const ClearAllButton = styled.button`
  padding: 0.6rem 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: #8b5cf6;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;

  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 2rem 1rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 12px;
  border: 2px dashed rgba(139, 92, 246, 0.2);

  @media (min-width: 768px) {
    padding: 4rem 2rem;
    border-radius: 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;

  @media (min-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const EmptyTitle = styled.h3`
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;

  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    max-width: 300px;
  }
`;

const NotificationItem = styled.div<{ $read: boolean }>`
  background: ${(props) =>
    props.$read
      ? "rgba(30, 41, 59, 0.6)"
      : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)"};
  border: ${(props) =>
    props.$read
      ? "1px solid rgba(139, 92, 246, 0.1)"
      : "1px solid rgba(139, 92, 246, 0.3)"};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 8px;
  height: 8px;
  background: #ec4899;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);

  @media (min-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 12px;
    height: 12px;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 1.25rem;
  }
`;

const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    font-size: 1.25rem;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.p<{ $read: boolean }>`
  margin: 0 0 0.75rem 0;
  color: #f8fafc;
  font-weight: ${(props) => (props.$read ? "400" : "600")};
  font-size: 0.875rem;
  line-height: 1.4;
  word-wrap: break-word;

  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const LeftMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Time = styled.small<{ $read: boolean }>`
  color: ${(props) => (props.$read ? "#64748b" : "#94a3b8")};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const AcceptButton = styled.button`
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }
`;

const DeclineButton = styled.button`
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  color: #ef4444;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }
`;

const TypeBadge = styled.div`
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  font-weight: 500;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
`;

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    socket,
    isConnected,
    markAllAsRead,
  } = useSocket();

  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle notification click - FIXED VERSION
  // In your Notifications.tsx - REPLACE the existing handleNotificationClick
  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      console.log("🔔 STEP 1: Notification clicked:", notification);

      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      let targetUrl = "";

      switch (notification.type) {
        case "HOP_ACCEPTED":
          // 🆕 OPEN PRIVATE CHAT WHEN HOP-IN IS ACCEPTED
          if (notification.chatroomId) {
            targetUrl = `/app/chat/private/${notification.chatroomId}`;
            console.log("💬 Opening private chat:", targetUrl);
          } else {
            console.warn("No chatroomId found in HOP_ACCEPTED notification");
          }
          break;

        case "MESSAGE":
          if (notification.crawlId) {
            targetUrl = `/app/chat/${notification.crawlId}`;
          } else if (notification.chatroomId) {
            // 🆕 HANDLE PRIVATE CHAT MESSAGES TOO
            targetUrl = `/app/chat/private/${notification.chatroomId}`;
          }
          break;

        case "HOP_REQUEST":
          // Stay on social page to see the request
          targetUrl = "/app/social";
          break;

        case "CRAWL_JOIN_REQUEST":
        case "CRAWL_JOIN_APPROVED":
          if (notification.crawlId) {
            targetUrl = `/app/crawls/${notification.crawlId}`;
          }
          break;

        default:
          console.log(
            "No specific action for notification type:",
            notification.type
          );
          return;
      }

      if (targetUrl) {
        console.log("🎯 FINAL: Navigating to:", targetUrl);

        // METHOD 1: Force navigation with window.location (ALWAYS WORKS)
        window.location.href = targetUrl;

        // METHOD 2: Backup - if window.location doesn't work, try router after delay
        setTimeout(() => {
          if (window.location.pathname !== targetUrl) {
            console.log("🔄 Backup: Using router.push");
            router.push(targetUrl);
          }
        }, 100);
      }
    } catch (error) {
      console.error("💥 Error handling notification click:", error);
    }
  };

  // Handle accepting hop requests
  const handleAcceptHop = async (notification: NotificationData) => {
    if (
      !socket ||
      !isConnected ||
      !notification.hopInId ||
      !session?.user?.id
    ) {
      return;
    }

    try {
      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "ACCEPTED",
        userId: session.user.id,
      });
      await markAsRead(notification.id);
    } catch (err) {
      console.error("Error accepting hop request:", err);
    }
  };

  // Handle declining hop requests
  const handleDeclineHop = async (notification: NotificationData) => {
    if (
      !socket ||
      !isConnected ||
      !notification.hopInId ||
      !session?.user?.id
    ) {
      return;
    }

    try {
      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "DECLINED",
        userId: session.user.id,
      });
      await markAsRead(notification.id);
    } catch (err) {
      console.error("Error declining hop request:", err);
    }
  };

  // Notification icons
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "MESSAGE":
        return "💬";
      case "HOP_REQUEST":
        return "🚗";
      case "HOP_ACCEPTED":
        return "✅";
      case "WAVE":
        return "👋";
      case "CRAWL_JOIN_REQUEST":
        return "📝";
      case "CRAWL_JOIN_APPROVED":
        return "🎉";
      case "CRAWL_JOIN_REJECTED":
        return "❌";
      default:
        return "🔔";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.5 }}
            >
              🔔
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              Loading notifications...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <Header>
          <HeaderLeft>
            <NotificationIcon>🔔</NotificationIcon>
            <HeaderText>
              <Title>Notifications</Title>
              <Subtitle>
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </Subtitle>
            </HeaderText>
          </HeaderLeft>

          <HeaderRight>
            <ConnectionStatus $isConnected={isConnected}>
              <StatusDot $isConnected={isConnected} />
              {isConnected ? "Live" : "Offline"}
            </ConnectionStatus>

            <BackButton onClick={() => router.back()}>← Back</BackButton>
          </HeaderRight>
        </Header>

        {/* Clear All Button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ClearAllButton onClick={markAllAsRead}>
              Mark all as read ({unreadCount})
            </ClearAllButton>
          </div>
        )}

        {/* Notifications List */}
        <NotificationsList>
          {notifications.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔔</EmptyIcon>
              <EmptyTitle>No notifications yet</EmptyTitle>
              <EmptyText>
                {!isConnected
                  ? "Connecting to notifications..."
                  : "You're all caught up! Notifications will appear here when you receive messages or requests."}
              </EmptyText>
            </EmptyState>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                $read={notification.read}
                onClick={(e) => {
                  console.log("🖱️ Notification item clicked");
                  e.stopPropagation();
                  e.preventDefault();
                  handleNotificationClick(notification);
                }}
              >
                {/* Unread indicator */}
                {!notification.read && <UnreadIndicator />}

                <NotificationContent>
                  <ItemIcon>{getNotificationIcon(notification.type)}</ItemIcon>

                  <ItemContent>
                    <Message $read={notification.read}>
                      {notification.message}
                    </Message>

                    <MetaInfo>
                      <LeftMeta>
                        <Time $read={notification.read}>
                          <span>🕒</span>
                          {formatTime(new Date(notification.createdAt))}
                        </Time>

                        {/* Action Buttons for HOP_REQUEST */}
                        {notification.type === "HOP_REQUEST" &&
                          notification.hopInId && (
                            <ActionButtons
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <AcceptButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleAcceptHop(notification);
                                }}
                              >
                                Accept
                              </AcceptButton>
                              <DeclineButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDeclineHop(notification);
                                }}
                              >
                                Decline
                              </DeclineButton>
                            </ActionButtons>
                          )}
                      </LeftMeta>

                      <TypeBadge>
                        {notification.type.replace(/_/g, " ").toLowerCase()}
                      </TypeBadge>
                    </MetaInfo>
                  </ItemContent>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationsList>
      </ContentWrapper>
    </PageContainer>
  );
}
