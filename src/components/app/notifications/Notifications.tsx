"use client";
import { useState, useEffect } from "react";
import { NotificationData } from "@/types/socket";
import { useSocket } from "../contexts/SocketContext";

const Notifications = () => {
  const { notifications, unreadCount, markAsRead } = useSocket();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        padding: "1rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 0",
          borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
          Notifications
        </h1>
        <p
          style={{
            margin: "0.25rem 0 0 0",
            color: "#94a3b8",
            fontSize: "0.9rem",
          }}
        >
          {unreadCount > 0
            ? `${unreadCount} unread messages`
            : "All caught up!"}
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
          paddingBottom: "0.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "0.5rem 1rem",
            background:
              activeTab === "all" ? "rgba(139, 92, 246, 0.2)" : "transparent",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          style={{
            padding: "0.5rem 1rem",
            background:
              activeTab === "unread"
                ? "rgba(139, 92, 246, 0.2)"
                : "transparent",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "0.9rem",
            cursor: "pointer",
            position: "relative",
          }}
        >
          Unread
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                background: "#ec4899",
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredNotifications.map((notification) => (
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
            }}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            {/* Notification content similar to the panel above */}
            <p style={{ margin: "0 0 0.5rem 0", color: "#f8fafc" }}>
              {notification.message}
            </p>
            <small style={{ color: "#94a3b8" }}>
              {formatTime(new Date(notification.createdAt))}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
