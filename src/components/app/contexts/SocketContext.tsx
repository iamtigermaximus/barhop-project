"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { NotificationData } from "@/types/socket";
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: NotificationData) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  connectionStatus: "connected" | "disconnected" | "connecting" | "error";
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  fetchNotifications: async () => {},
  isLoading: false,
  error: null,
  connectionStatus: "disconnected",
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting" | "error"
  >("disconnected");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status: sessionStatus } = useSession();

  // Use ref to track if we're already connecting
  const isConnecting = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Debug logging
  useEffect(() => {
    console.log("🔍 DEBUG - SocketContext state:");
    console.log("Session status:", sessionStatus);
    console.log("User ID:", session?.user?.id);
    console.log("Socket connected:", isConnected);
    console.log("Connection status:", connectionStatus);
    console.log("Notifications count:", notifications.length);
    console.log("Unread count:", unreadCount);
  }, [
    sessionStatus,
    session,
    isConnected,
    connectionStatus,
    notifications.length,
    unreadCount,
  ]);

  // Helper function to get JWT token
  const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/token");
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
      console.warn("Token fetch failed with status:", response.status);
      return null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  // Add notification to state with deduplication
  const addNotification = useCallback((notification: NotificationData) => {
    console.log("📨 Adding notification to state:", notification);
    setNotifications((prev) => {
      const exists = prev.find((n) => n.id === notification.id);
      if (exists) {
        console.log(
          "⚠️ Notification already exists, skipping:",
          notification.id
        );
        return prev;
      }
      console.log("✅ New notification added:", notification.id);
      return [notification, ...prev];
    });
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        setError(null);

        // Optimistic update
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, read: true, readAt: new Date() }
              : notif
          )
        );

        const token = await getToken();
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

        const response = await fetch(
          `${backendUrl}/api/notifications/mark-read`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ notificationId }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to mark notification as read: ${response.status}`
          );
        }

        const result = await response.json();
        console.log("✅ Notification marked as read:", notificationId);

        // If socket is connected, notify other devices
        if (socketRef.current?.connected) {
          socketRef.current.emit("mark_notification_read", {
            notificationId,
            userId: session?.user?.id,
          });
        }

        // Update with server response
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? result.notification : notif
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
        setError("Failed to mark notification as read");

        // Revert optimistic update
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, read: false, readAt: undefined }
              : notif
          )
        );
      }
    },
    [session?.user?.id]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);

      // Get all unread notifications first
      const unreadNotifications = notifications.filter((n) => !n.read);
      if (unreadNotifications.length === 0) return;

      // Optimistic update
      const now = new Date();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true, readAt: now }))
      );

      // Mark each notification individually
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }

      console.log("✅ All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Failed to mark all notifications as read");
    }
  }, [notifications, markAsRead]);

  // Fetch notifications from BACKEND API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("📡 Fetching notifications from BACKEND API...");

      const token = await getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

      const response = await fetch(`${backendUrl}/api/notifications`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log(
        "📨 Backend notifications API response status:",
        response.status
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ Notifications fetched from backend:",
          data.notifications?.length || 0
        );
        setNotifications(data.notifications || []);
      } else {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
    } catch (error) {
      console.error("💥 Error fetching notifications from backend:", error);
      setError("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Socket connection and event listeners
  useEffect(() => {
    // Prevent multiple connection attempts
    if (isConnecting.current) {
      console.log("🔄 Socket connection already in progress, skipping...");
      return;
    }

    // Don't connect if no session or session is loading
    if (sessionStatus === "loading") {
      console.log("🔄 Session loading, waiting...");
      return;
    }

    if (!session?.user?.id) {
      console.log("🚫 No user session, skipping socket connection");
      // Clean up existing socket if no session
      if (socketRef.current) {
        console.log("🧹 Disconnecting socket due to no session");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus("disconnected");
      }
      return;
    }

    const connectSocket = async () => {
      isConnecting.current = true;

      try {
        console.log(
          "🚀 Initializing socket connection to EXTERNAL server for user:",
          session.user.id
        );
        setConnectionStatus("connecting");
        setError(null);

        const token = await getToken();
        if (!token) {
          console.error("No authentication token available");
          setConnectionStatus("error");
          setError("Authentication failed");
          isConnecting.current = false;
          return;
        }

        // Use the EXTERNAL Socket.io URL
        const socketUrl =
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
        console.log("🔗 Connecting to EXTERNAL socket server:", socketUrl);

        // Clean up existing socket
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        const newSocket = io(socketUrl, {
          auth: {
            token: token,
          },
          transports: ["websocket", "polling"],
          timeout: 10000,
          forceNew: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = newSocket;

        newSocket.on("connect", () => {
          console.log(
            "✅ Socket connected successfully to EXTERNAL server:",
            newSocket.id
          );
          setIsConnected(true);
          setConnectionStatus("connected");
          setError(null);
          isConnecting.current = false;

          // Join user's personal room for targeted notifications
          newSocket.emit("join_user_room", session.user.id);
          console.log("🎯 Joined user room for user:", session.user.id);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setIsConnected(false);
          setConnectionStatus("disconnected");
          isConnecting.current = false;
        });

        newSocket.on("connect_error", (error) => {
          console.error("💥 Socket connection error:", error.message);
          setIsConnected(false);
          setConnectionStatus("error");
          setError(`Connection failed: ${error.message}`);
          isConnecting.current = false;
        });

        newSocket.on("new_notification", (notification: NotificationData) => {
          console.log("📢 New notification received via socket:", notification);
          addNotification(notification);
        });

        // Handle notification updates (like when marked as read on other devices)
        newSocket.on(
          "notification_updated",
          (updatedNotification: NotificationData) => {
            console.log(
              "🔄 Notification updated via socket:",
              updatedNotification
            );
            setNotifications((prev) =>
              prev.map((notif) =>
                notif.id === updatedNotification.id
                  ? updatedNotification
                  : notif
              )
            );
          }
        );

        newSocket.on("reconnect", (attemptNumber) => {
          console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
          setIsConnected(true);
          setConnectionStatus("connected");
          setError(null);
        });

        newSocket.on("reconnect_attempt", (attemptNumber) => {
          console.log("🔄 Reconnection attempt:", attemptNumber);
          setConnectionStatus("connecting");
        });

        newSocket.on("reconnect_error", (error) => {
          console.error("💥 Reconnection error:", error);
          setConnectionStatus("error");
        });

        newSocket.on("reconnect_failed", () => {
          console.error("💥 Reconnection failed after all attempts");
          setConnectionStatus("error");
          setError("Failed to reconnect to server");
        });

        setSocket(newSocket);

        // Fetch existing notifications from BACKEND
        fetchNotifications();
      } catch (error) {
        console.error("💥 Socket connection setup error:", error);
        setConnectionStatus("error");
        setError("Failed to setup socket connection");
        isConnecting.current = false;
      }
    };

    connectSocket();

    return () => {
      console.log("🧹 Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      isConnecting.current = false;
    };
  }, [session, sessionStatus, addNotification, fetchNotifications]);

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    isLoading,
    error,
    connectionStatus,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
