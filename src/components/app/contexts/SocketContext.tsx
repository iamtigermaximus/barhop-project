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
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
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
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { data: session } = useSession();

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Add notification to state
  const addNotification = (notification: NotificationData) => {
    setNotifications((prev) => {
      // Check if notification already exists to avoid duplicates
      const exists = prev.find((n) => n.id === notification.id);
      if (exists) return prev;
      return [notification, ...prev];
    });
  };

  // Mark single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Update locally first for immediate feedback
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      // Sync with database
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert local change if API call fails
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: false } : notif
        )
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update locally first
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );

      // Sync with database
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Socket connection and event listeners
  useEffect(() => {
    if (!session?.user?.id) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        query: {
          userId: session.user.id,
        },
      }
    );

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    newSocket.on("new_notification", (notification: NotificationData) => {
      addNotification(notification);
    });

    setSocket(newSocket);

    // Fetch existing notifications
    fetchNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, [session]);

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
