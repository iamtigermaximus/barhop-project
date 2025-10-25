// // contexts/SocketContext.tsx
// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { NotificationData } from "@/types/socket";

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   notifications: NotificationData[];
//   addNotification: (notification: NotificationData) => void;
//   markAsRead: (notificationId: string) => void;
//   unreadCount: number;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   notifications: [],
//   addNotification: () => {},
//   markAsRead: () => {},
//   unreadCount: 0,
// });

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);

//   useEffect(() => {
//     // Initialize socket connection
//     const socketInstance = io({
//       path: "/api/socket/io",
//       transports: ["polling", "websocket"],
//     });

//     setSocket(socketInstance);

//     socketInstance.on("connect", () => {
//       console.log("✅ Connected to server");
//       setIsConnected(true);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("❌ Disconnected from server");
//       setIsConnected(false);
//     });

//     socketInstance.on("new_notification", (notification: NotificationData) => {
//       console.log("📢 New notification received:", notification);
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   const addNotification = (notification: NotificationData) => {
//     setNotifications((prev) => [notification, ...prev]);
//   };

//   const markAsRead = (notificationId: string) => {
//     setNotifications((prev) =>
//       prev.map((notif) =>
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       )
//     );
//   };

//   const unreadCount = notifications.filter((notif) => !notif.read).length;

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         isConnected,
//         notifications,
//         addNotification,
//         markAsRead,
//         unreadCount,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
// contexts/SocketContext.tsx
// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { NotificationData } from "@/types/socket";

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   notifications: NotificationData[];
//   addNotification: (notification: NotificationData) => void;
//   markAsRead: (notificationId: string) => void;
//   unreadCount: number;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   notifications: [],
//   addNotification: () => {},
//   markAsRead: () => {},
//   unreadCount: 0,
// });

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);

//   useEffect(() => {
//     // Initialize socket connection
//     const socketInstance = io({
//       path: "/api/socket/io",
//       transports: ["polling", "websocket"],
//     });

//     setSocket(socketInstance);

//     socketInstance.on("connect", () => {
//       console.log("✅ Connected to server");
//       setIsConnected(true);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("❌ Disconnected from server");
//       setIsConnected(false);
//     });

//     socketInstance.on("new_notification", (notification: NotificationData) => {
//       console.log("📢 New notification received:", notification);
//       addNotification(notification); // Use the addNotification function instead of direct state update
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   const addNotification = (notification: NotificationData) => {
//     setNotifications((prev) => {
//       // Check if notification already exists by ID
//       const notificationExists = prev.some(
//         (notif) => notif.id === notification.id
//       );

//       if (notificationExists) {
//         console.log(
//           "⚠️ Duplicate notification detected, skipping:",
//           notification.id
//         );
//         return prev; // Don't add duplicate
//       }

//       console.log("✅ Adding new notification:", notification.id);
//       // Add new notification and sort by date (newest first)
//       const updated = [notification, ...prev];
//       return updated.sort(
//         (a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );
//     });
//   };

//   const markAsRead = (notificationId: string) => {
//     setNotifications((prev) =>
//       prev.map((notif) =>
//         notif.id === notificationId ? { ...notif, read: true } : notif
//       )
//     );
//   };

//   const unreadCount = notifications.filter((notif) => !notif.read).length;

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         isConnected,
//         notifications,
//         addNotification,
//         markAsRead,
//         unreadCount,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };
// contexts/SocketContext.tsx
// contexts/SocketContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { NotificationData } from "@/types/socket";
import { io, Socket } from "socket.io-client";

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

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

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

        const response = await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }

        // If socket is connected, notify other devices
        if (socket && isConnected) {
          socket.emit("mark_notification_read", {
            notificationId,
            userId: session?.user?.id,
          });
        }
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
    [socket, isConnected, session]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);

      // Optimistic update
      const now = new Date();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true, readAt: now }))
      );

      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Failed to mark all notifications as read");
    }
  }, []);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("📡 Fetching notifications from API...");

      const response = await fetch("/api/notifications");
      console.log("📨 Notifications API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ Notifications fetched:",
          data.notifications?.length || 0
        );
        setNotifications(data.notifications || []);
      } else {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
    } catch (error) {
      console.error("💥 Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Socket connection and event listeners
  useEffect(() => {
    // Don't connect if no session or session is loading
    if (sessionStatus === "loading") {
      console.log("🔄 Session loading, waiting...");
      return;
    }

    if (!session?.user?.id) {
      console.log("🚫 No user session, skipping socket connection");
      return;
    }

    console.log("🚀 Initializing socket connection for user:", session.user.id);
    setConnectionStatus("connecting");
    setError(null);

    // Use the correct Socket.io URL
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
    console.log("🔗 Connecting to socket server:", socketUrl);

    const newSocket = io(socketUrl, {
      path: "/api/socket/io",
      query: {
        userId: session.user.id,
      },
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully:", newSocket.id);
      setIsConnected(true);
      setConnectionStatus("connected");
      setError(null);

      // Join user's personal room for targeted notifications
      newSocket.emit("join_user_room", session.user.id);
      console.log("🎯 Joined user room:", `user_${session.user.id}`);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("💥 Socket connection error:", error.message);
      setIsConnected(false);
      setConnectionStatus("error");
      setError(`Connection failed: ${error.message}`);
    });

    newSocket.on("new_notification", (notification: NotificationData) => {
      console.log("📢 New notification received via socket:", notification);
      addNotification(notification);
    });

    // Handle notification updates (like when marked as read on other devices)
    newSocket.on(
      "notification_updated",
      (updatedNotification: NotificationData) => {
        console.log("🔄 Notification updated via socket:", updatedNotification);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === updatedNotification.id ? updatedNotification : notif
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

    setSocket(newSocket);

    // Fetch existing notifications
    fetchNotifications();

    return () => {
      console.log("🧹 Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [session, sessionStatus, addNotification, fetchNotifications]);

  return (
    <SocketContext.Provider
      value={{
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
