"use client";
import { NotificationData } from "@/types/socket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";

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

  // Handle notification click - BULLETPROOF VERSION
  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      console.log("🔔 STEP 1: Notification clicked:", notification);

      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      // Use a switch statement with guaranteed navigation
      let targetUrl = "";

      switch (notification.type) {
        case "MESSAGE":
          if (notification.crawlId) {
            targetUrl = `/app`;
          }
          break;
        case "CRAWL_JOIN_REQUEST":
        case "CRAWL_JOIN_APPROVED":
        case "CRAWL_JOIN_REJECTED":
          if (notification.crawlId) {
            targetUrl = `/app/crawls/${notification.crawlId}`;
          }
          break;
        case "HOP_REQUEST":
        case "HOP_ACCEPTED":
          if (notification.barId) {
            targetUrl = `/app/bars/${notification.barId}`;
          }
          break;
        default:
          return; // Don't navigate for other types
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
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              🔔
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "1.75rem",
                  fontWeight: "700",
                }}
              >
                Notifications
              </h1>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  color: "#94a3b8",
                  fontSize: "1rem",
                }}
              >
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Connection Status */}
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: isConnected
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${
                  isConnected
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
                borderRadius: "8px",
                fontSize: "0.8rem",
                color: isConnected ? "#22c55e" : "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#22c55e" : "#ef4444",
                }}
              />
              {isConnected ? "Live" : "Offline"}
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                color: "#8b5cf6",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={markAllAsRead}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                color: "#8b5cf6",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Mark all as read ({unreadCount})
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "4rem 2rem",
                background: "rgba(30, 41, 59, 0.3)",
                borderRadius: "16px",
                border: "2px dashed rgba(139, 92, 246, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "1.5rem",
                  opacity: 0.5,
                }}
              >
                🔔
              </div>
              <h3
                style={{
                  color: "#e2e8f0",
                  marginBottom: "0.75rem",
                  fontWeight: "600",
                  fontSize: "1.25rem",
                }}
              >
                No notifications yet
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  maxWidth: "300px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {!isConnected
                  ? "Connecting to notifications..."
                  : "You're all caught up! Notifications will appear here when you receive messages or requests."}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: notification.read
                    ? "rgba(30, 41, 59, 0.6)"
                    : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)",
                  border: notification.read
                    ? "1px solid rgba(139, 92, 246, 0.1)"
                    : "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  backdropFilter: "blur(10px)",
                }}
                onClick={(e) => {
                  console.log("🖱️ Notification item clicked");
                  e.stopPropagation();
                  e.preventDefault();
                  handleNotificationClick(notification);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      width: "12px",
                      height: "12px",
                      background: "#ec4899",
                      borderRadius: "50%",
                      boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.2)",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.25rem",
                  }}
                >
                  {/* Notification Icon */}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Notification Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 1rem 0",
                        color: "#f8fafc",
                        fontWeight: notification.read ? "400" : "600",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {notification.message}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <small
                          style={{
                            color: notification.read ? "#64748b" : "#94a3b8",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span>🕒</span>
                          {formatTime(new Date(notification.createdAt))}
                        </small>

                        {/* Action Buttons for HOP_REQUEST */}
                        {notification.type === "HOP_REQUEST" &&
                          notification.hopInId && (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.75rem",
                                flexShrink: 0,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleAcceptHop(notification);
                                }}
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.8rem",
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                  border: "none",
                                  borderRadius: "6px",
                                  color: "white",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDeclineHop(notification);
                                }}
                                style={{
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.8rem",
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  borderRadius: "6px",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                      </div>

                      <div
                        style={{
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#8b5cf6",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          fontWeight: "500",
                        }}
                      >
                        {notification.type.replace(/_/g, " ").toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
