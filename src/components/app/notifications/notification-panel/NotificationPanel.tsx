// "use client";
// import { NotificationData } from "@/types/socket";

// import { useSocket } from "../../contexts/SocketContext";
// import {
//   ModalButton,
//   ModalContent,
//   ModalHeader,
//   ModalOverlay,
//   ModalUserImage,
// } from "../../social/Social.styles";

// interface NotificationsPanelProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
//   const { notifications, unreadCount, markAsRead } = useSocket();

//   if (!isOpen) return null;

//   // Function to handle notification actions (same as in Social.tsx)
//   const handleAcceptHop = async (notification: NotificationData) => {
//     // You'll need to implement this or pass it as a prop
//     console.log("Accept hop:", notification);
//   };

//   const handleDeclineHop = async (notification: NotificationData) => {
//     // You'll need to implement this or pass it as a prop
//     console.log("Decline hop:", notification);
//   };

//   return (
//     <ModalOverlay onClick={onClose}>
//       <ModalContent
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           maxWidth: "500px",
//           maxHeight: "80vh",
//           background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//           border: "1px solid rgba(139, 92, 246, 0.3)",
//           boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
//         }}
//       >
//         <ModalHeader
//           style={{
//             background: "rgba(30, 41, 59, 0.8)",
//             borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
//             padding: "1.5rem",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.75rem",
//               }}
//             >
//               <div
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                   borderRadius: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "16px",
//                 }}
//               >
//                 🔔
//               </div>
//               <div>
//                 <h3
//                   style={{
//                     margin: 0,
//                     color: "#f8fafc",
//                     fontSize: "1.25rem",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Notifications
//                 </h3>
//                 <p
//                   style={{
//                     margin: 0,
//                     color: "#94a3b8",
//                     fontSize: "0.875rem",
//                   }}
//                 >
//                   {unreadCount > 0
//                     ? `${unreadCount} unread ${
//                         unreadCount === 1 ? "message" : "messages"
//                       }`
//                     : "All caught up!"}
//                 </p>
//               </div>
//             </div>
//             <ModalButton
//               $variant="secondary"
//               onClick={onClose}
//               style={{
//                 padding: "8px 12px",
//                 background: "rgba(139, 92, 246, 0.1)",
//                 border: "1px solid rgba(139, 92, 246, 0.3)",
//               }}
//             >
//               ✕
//             </ModalButton>
//           </div>
//         </ModalHeader>

//         <div
//           style={{
//             overflowY: "auto",
//             padding: "1rem",
//             background: "rgba(15, 23, 42, 0.5)",
//           }}
//         >
//           {notifications.length === 0 ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 color: "#94a3b8",
//                 padding: "3rem 2rem",
//                 background: "rgba(30, 41, 59, 0.3)",
//                 borderRadius: "12px",
//                 border: "1px dashed rgba(139, 92, 246, 0.2)",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "3rem",
//                   marginBottom: "1rem",
//                   opacity: 0.5,
//                 }}
//               >
//                 🔔
//               </div>
//               <h4
//                 style={{
//                   color: "#e2e8f0",
//                   marginBottom: "0.5rem",
//                   fontWeight: "500",
//                 }}
//               >
//                 No notifications yet
//               </h4>
//               <p style={{ margin: 0, fontSize: "0.875rem" }}>
//                 Notifications will appear here when you receive waves or hop-in
//                 requests
//               </p>
//             </div>
//           ) : (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.75rem",
//               }}
//             >
//               {notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   style={{
//                     background: notification.read
//                       ? "rgba(30, 41, 59, 0.6)"
//                       : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)",
//                     border: notification.read
//                       ? "1px solid rgba(139, 92, 246, 0.1)"
//                       : "1px solid rgba(139, 92, 246, 0.3)",
//                     borderRadius: "12px",
//                     padding: "1.25rem",
//                     cursor: "pointer",
//                     transition: "all 0.2s ease",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                   onClick={() =>
//                     !notification.read && markAsRead(notification.id)
//                   }
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                     e.currentTarget.style.boxShadow =
//                       "0 8px 25px rgba(139, 92, 246, 0.15)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "none";
//                   }}
//                 >
//                   {/* Unread indicator */}
//                   {!notification.read && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "12px",
//                         right: "12px",
//                         width: "8px",
//                         height: "8px",
//                         background: "#ec4899",
//                         borderRadius: "50%",
//                         animation: "pulse 2s infinite",
//                       }}
//                     ></div>
//                   )}

//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: "1rem",
//                     }}
//                   >
//                     <ModalUserImage
//                       $imageUrl={notification.fromUser?.image || undefined}
//                       style={{
//                         width: "44px",
//                         height: "44px",
//                         fontSize: "16px",
//                         border: notification.read
//                           ? "2px solid rgba(139, 92, 246, 0.3)"
//                           : "2px solid #8b5cf6",
//                       }}
//                     >
//                       {!notification.fromUser?.image &&
//                         (notification.fromUser?.name?.charAt(0).toUpperCase() ||
//                           "U")}
//                     </ModalUserImage>

//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <p
//                         style={{
//                           margin: "0 0 0.5rem 0",
//                           color: "#f8fafc",
//                           fontWeight: notification.read ? "400" : "600",
//                           fontSize: "0.95rem",
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         {notification.message}
//                       </p>

//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           flexWrap: "wrap",
//                           gap: "0.5rem",
//                         }}
//                       >
//                         <small
//                           style={{
//                             color: notification.read ? "#64748b" : "#94a3b8",
//                             fontSize: "0.75rem",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "0.25rem",
//                           }}
//                         >
//                           <span>🕒</span>
//                           {new Date(notification.createdAt).toLocaleTimeString(
//                             [],
//                             {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             }
//                           )}
//                         </small>

//                         {notification.type === "HOP_REQUEST" &&
//                           notification.hopInId && (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 gap: "0.5rem",
//                                 flexShrink: 0,
//                               }}
//                             >
//                               <ModalButton
//                                 $variant="primary"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleAcceptHop(notification);
//                                 }}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   background:
//                                     "linear-gradient(135deg, #10b981, #059669)",
//                                   border: "none",
//                                 }}
//                               >
//                                 ✅ Accept
//                               </ModalButton>
//                               <ModalButton
//                                 $variant="secondary"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeclineHop(notification);
//                                 }}
//                                 style={{
//                                   padding: "6px 12px",
//                                   fontSize: "12px",
//                                   background: "rgba(239, 68, 68, 0.1)",
//                                   border: "1px solid rgba(239, 68, 68, 0.3)",
//                                   color: "#ef4444",
//                                 }}
//                               >
//                                 ❌ Decline
//                               </ModalButton>
//                             </div>
//                           )}

//                         {notification.type === "WAVE" && (
//                           <div
//                             style={{
//                               background: "rgba(34, 197, 94, 0.1)",
//                               color: "#22c55e",
//                               padding: "4px 8px",
//                               borderRadius: "6px",
//                               fontSize: "0.75rem",
//                               border: "1px solid rgba(34, 197, 94, 0.2)",
//                             }}
//                           >
//                             👋 Wave
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <style jsx>{`
//           @keyframes pulse {
//             0% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.5;
//             }
//             100% {
//               opacity: 1;
//             }
//           }
//         `}</style>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// export default NotificationsPanel;
// components/notifications/NotificationPanel.tsx
"use client";
// import { NotificationData } from "@/types/socket";
import { useSocket } from "../../contexts/SocketContext";
import {
  ModalButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalUserImage,
} from "../../social/Social.styles";
import { useSession } from "next-auth/react";
export enum NotificationType {
  HOP_REQUEST = "HOP_REQUEST",
  HOP_ACCEPTED = "HOP_ACCEPTED",
  HOP_DECLINED = "HOP_DECLINED",
  WAVE = "WAVE",
  MESSAGE = "MESSAGE",
  SYSTEM = "SYSTEM",
  MEETUP_INVITE = "MEETUP_INVITE",
  CRAWL_JOIN_REQUEST = "CRAWL_JOIN_REQUEST",
  CRAWL_JOIN_APPROVED = "CRAWL_JOIN_APPROVED",
  CRAWL_JOIN_REJECTED = "CRAWL_JOIN_REJECTED",
}

export enum HopInStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  fromUserId: string;
  message?: string;
  barId?: string;
  crawlId?: string;
  chatroomId?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  hopInId?: string;
  meetupId?: string;
  fromUser?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  hopIn?: {
    id: string;
    barId?: string;
    bar?: {
      id: string;
      name: string;
    };
    status: HopInStatus;
  };
  crawl?: {
    id: string;
    name: string;
  };
}
interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    socket,
    isConnected,
    markAllAsRead,
  } = useSocket();

  const { data: session } = useSession();

  if (!isOpen) return null;

  // ✅ REAL: Handle accepting hop requests
  const handleAcceptHop = async (notification: NotificationData) => {
    if (!socket || !isConnected || !notification.hopInId) {
      console.error(
        "❌ Cannot accept hop: socket not connected or missing hopInId"
      );
      return;
    }

    if (!session?.user?.id) {
      console.error("❌ Cannot accept hop: no user session");
      return;
    }

    try {
      console.log("✅ Accepting hop request:", notification.hopInId);

      // Emit socket event to accept the hop request
      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "ACCEPTED",
        userId: session.user.id, // Current user accepting the request
      });

      // Mark the notification as read
      await markAsRead(notification.id);

      console.log("🎉 Hop request accepted successfully");
    } catch (err) {
      console.error("💥 Error accepting hop request:", err);
    }
  };

  // ✅ REAL: Handle declining hop requests (SILENT)
  const handleDeclineHop = async (notification: NotificationData) => {
    if (!socket || !isConnected || !notification.hopInId) {
      console.error(
        "❌ Cannot decline hop: socket not connected or missing hopInId"
      );
      return;
    }

    if (!session?.user?.id) {
      console.error("❌ Cannot decline hop: no user session");
      return;
    }

    try {
      console.log("❌ Declining hop request:", notification.hopInId);

      // Emit socket event to decline the hop request
      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "DECLINED",
        userId: session.user.id, // Current user declining the request
      });

      // Just mark as read locally - no success message (SILENT DECLINE)
      await markAsRead(notification.id);

      console.log("🗑️ Hop request declined silently");
    } catch (err) {
      console.error("💥 Error declining hop request:", err);
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

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "95vw",
          maxWidth: "400px",
          maxHeight: "70vh",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          borderRadius: "16px",
          margin: "20px auto",
        }}
      >
        {/* Header */}
        <ModalHeader
          style={{
            background: "rgba(30, 41, 59, 0.9)",
            borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            padding: "1rem 1.25rem",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                🔔
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#f8fafc",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    }}
                  >
                    Notifications
                  </h3>
                  <div
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: isConnected
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${
                        isConnected
                          ? "rgba(34, 197, 94, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                      }`,
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      color: isConnected ? "#22c55e" : "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isConnected ? "#22c55e" : "#ef4444",
                        animation: isConnected ? "pulse 1s infinite" : "none",
                      }}
                    />
                    {isConnected ? "Live" : "Offline"}
                  </div>
                </div>
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    color: "#94a3b8",
                    fontSize: "0.8rem",
                  }}
                >
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
            </div>
            <ModalButton
              $variant="secondary"
              onClick={onClose}
              style={{
                padding: "6px 10px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                fontSize: "12px",
                minWidth: "auto",
              }}
            >
              ✕
            </ModalButton>
          </div>
        </ModalHeader>

        {/* Notifications List */}
        <div
          style={{
            overflowY: "auto",
            padding: "0.75rem",
            background: "rgba(15, 23, 42, 0.5)",
            maxHeight: "calc(70vh - 80px)",
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "2rem 1rem",
                background: "rgba(30, 41, 59, 0.3)",
                borderRadius: "12px",
                border: "1px dashed rgba(139, 92, 246, 0.2)",
                margin: "1rem 0",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "0.75rem",
                  opacity: 0.5,
                }}
              >
                🔔
              </div>
              <h4
                style={{
                  color: "#e2e8f0",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                No notifications yet
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", lineHeight: "1.4" }}>
                {!isConnected
                  ? "Connecting to notifications..."
                  : "Notifications will appear here when you receive waves or hop-in requests"}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {notifications.map((notification) => (
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
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "6px",
                        height: "6px",
                        background: "#ec4899",
                        borderRadius: "50%",
                        animation: "pulse 2s infinite",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    {/* User Avatar */}
                    <ModalUserImage
                      $imageUrl={notification.fromUser?.image || undefined}
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "14px",
                        border: notification.read
                          ? "2px solid rgba(139, 92, 246, 0.3)"
                          : "2px solid #8b5cf6",
                        flexShrink: 0,
                      }}
                    >
                      {!notification.fromUser?.image &&
                        (notification.fromUser?.name?.charAt(0).toUpperCase() ||
                          "U")}
                    </ModalUserImage>

                    {/* Notification Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: "#f8fafc",
                          fontWeight: notification.read ? "400" : "500",
                          fontSize: "0.85rem",
                          lineHeight: "1.3",
                          wordBreak: "break-word",
                        }}
                      >
                        {notification.message}
                      </p>

                      {/* Meta Info and Actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <small
                          style={{
                            color: notification.read ? "#64748b" : "#94a3b8",
                            fontSize: "0.7rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <span>🕒</span>
                          {formatTime(new Date(notification.createdAt))}
                        </small>

                        {/* Action Buttons - Only show for HOP_REQUEST with hopInId */}
                        {notification.type === "HOP_REQUEST" &&
                          notification.hopInId && (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.4rem",
                                flexShrink: 0,
                              }}
                            >
                              <ModalButton
                                $variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptHop(notification);
                                }}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "11px",
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                  border: "none",
                                  minWidth: "auto",
                                }}
                              >
                                ✅ Accept
                              </ModalButton>
                              <ModalButton
                                $variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeclineHop(notification);
                                }}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "11px",
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#ef4444",
                                  minWidth: "auto",
                                }}
                              >
                                ❌ Decline
                              </ModalButton>
                            </div>
                          )}

                        {/* Notification Type Badge */}
                        {notification.type === "WAVE" && (
                          <div
                            style={{
                              background: "rgba(34, 197, 94, 0.1)",
                              color: "#22c55e",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              border: "1px solid rgba(34, 197, 94, 0.2)",
                            }}
                          >
                            👋 Wave
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid rgba(139, 92, 246, 0.1)",
              background: "rgba(30, 41, 59, 0.5)",
            }}
          >
            <ModalButton
              $variant="secondary"
              onClick={markAllAsRead}
              style={{
                width: "100%",
                padding: "0.5rem",
                fontSize: "0.8rem",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              Mark all as read ({unreadCount})
            </ModalButton>
          </div>
        )}

        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NotificationsPanel;
