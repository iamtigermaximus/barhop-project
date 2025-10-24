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
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { NotificationData } from "@/types/socket";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationData[];
  addNotification: (notification: NotificationData) => void;
  markAsRead: (notificationId: string) => void;
  unreadCount: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  unreadCount: 0,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io({
      path: "/api/socket/io",
      transports: ["polling", "websocket"],
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socketInstance.on("new_notification", (notification: NotificationData) => {
      console.log("📢 New notification received:", notification);
      addNotification(notification); // Use the addNotification function instead of direct state update
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const addNotification = (notification: NotificationData) => {
    setNotifications((prev) => {
      // Check if notification already exists by ID
      const notificationExists = prev.some(
        (notif) => notif.id === notification.id
      );

      if (notificationExists) {
        console.log(
          "⚠️ Duplicate notification detected, skipping:",
          notification.id
        );
        return prev; // Don't add duplicate
      }

      console.log("✅ Adding new notification:", notification.id);
      // Add new notification and sort by date (newest first)
      const updated = [notification, ...prev];
      return updated.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        addNotification,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
