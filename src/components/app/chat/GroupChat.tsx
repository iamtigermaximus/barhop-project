"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../contexts/SocketContext";

interface GroupChatProps {
  crawlId: string;
  chatroomId: string;
  onClose: () => void;
}

interface ChatroomMessage {
  id: string;
  content: string;
  userId: string;
  chatroomId: string;
  messageType: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ChatroomParticipant {
  id: string;
  userId: string;
  chatroomId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

const GroupChat = ({ crawlId, chatroomId, onClose }: GroupChatProps) => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatroomMessage[]>([]);
  const [participants, setParticipants] = useState<ChatroomParticipant[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!chatroomId) return;
    loadChatData();
  }, [chatroomId]);

  useEffect(() => {
    if (!socket || !chatroomId || !hasJoined) return;

    const handleNewMessage = (message: ChatroomMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserJoined = (data: { participant: ChatroomParticipant }) => {
      loadParticipants();
    };

    const handleUserLeft = (data: { userId: string }) => {
      loadParticipants();
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_joined_chatroom", handleUserJoined);
    socket.on("user_left_chatroom", handleUserLeft);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_joined_chatroom", handleUserJoined);
      socket.off("user_left_chatroom", handleUserLeft);
    };
  }, [socket, chatroomId, hasJoined]);

  useEffect(() => {
    if (!socket || !chatroomId || !session?.user?.id) return;

    socket.emit("join_chatroom", { chatroomId });
    setHasJoined(true);

    return () => {
      socket.emit("leave_chatroom", { chatroomId });
      setHasJoined(false);
    };
  }, [socket, chatroomId, session?.user?.id]);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 STARTING loadChatData for chatroom:", chatroomId);

      const [messagesRes, participantsRes] = await Promise.all([
        fetch(`/api/chat/${chatroomId}/messages`),
        fetch(`/api/chat/${chatroomId}/participants`),
      ]);

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
      }

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json();
        setParticipants(participantsData.participants || []);
      }
    } catch (error) {
      console.error("💥 Error in loadChatData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      const participantsRes = await fetch(
        `/api/chat/${chatroomId}/participants`
      );
      if (participantsRes.ok) {
        const participantsData = await participantsRes.json();
        setParticipants(participantsData.participants || []);
      }
    } catch (error) {
      console.error("Error loading participants:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !session?.user?.id) return;

    try {
      socket.emit("send_message", {
        chatroomId,
        content: newMessage,
        userId: session.user.id,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const form = document.querySelector("form");
        form?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        <div
          style={{
            // background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            // border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "20px",
            padding: "2rem",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💬</div>
          <p>Loading group chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: isMobile ? "0" : "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          maxWidth: isMobile ? "100%" : "800px",
          maxHeight: isMobile ? "100%" : "90vh",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: isMobile ? "none" : "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: isMobile ? 0 : "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: isMobile ? "1rem" : "1.5rem",
            borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(30, 41, 59, 0.8)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isMobile && (
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                👥
              </button>
            )}
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                }}
              >
                Group Chat
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                }}
              >
                {participants.length} participants • {isConnected ? "🟢" : "🔴"}
                {hasJoined && " • ✅"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: isMobile ? "1.5rem" : "1.75rem",
              cursor: "pointer",
              padding: "0.5rem",
              minWidth: "44px",
              minHeight: "44px",
            }}
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            flexDirection: isMobile && showParticipants ? "column" : "row",
          }}
        >
          {/* Participants Sidebar */}
          {(showParticipants || !isMobile) && (
            <div
              style={{
                width: isMobile ? "100%" : "250px",
                height: isMobile ? "40%" : "auto",
                borderRight: isMobile
                  ? "none"
                  : "1px solid rgba(139, 92, 246, 0.2)",
                borderBottom: isMobile
                  ? "1px solid rgba(139, 92, 246, 0.2)"
                  : "none",
                padding: isMobile ? "0.75rem" : "1rem",
                background: "rgba(15, 23, 42, 0.5)",
                overflowY: "auto",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h4
                  style={{
                    color: "#f8fafc",
                    margin: 0,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  Participants ({participants.length})
                </h4>
                {isMobile && (
                  <button
                    onClick={() => setShowParticipants(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "1rem",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      background:
                        participant.userId === session?.user?.id
                          ? "rgba(139, 92, 246, 0.2)"
                          : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "28px" : "32px",
                        height: isMobile ? "28px" : "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        fontWeight: "600",
                        flexShrink: 0,
                      }}
                    >
                      {participant.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: "#f8fafc",
                          fontSize: isMobile ? "0.8rem" : "0.875rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {participant.user.name}
                        {participant.userId === session?.user?.id && " (You)"}
                      </div>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                        }}
                      >
                        {participant.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0, // Important for flexbox text overflow
            }}
          >
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: isMobile ? "0.75rem" : "1rem",
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "0.75rem" : "1rem",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: "2rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: isMobile ? "2rem" : "3rem",
                      marginBottom: "1rem",
                    }}
                  >
                    💬
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    No messages yet. Start the conversation!
                  </p>
                  {!isMobile && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        marginTop: "0.5rem",
                        margin: 0,
                      }}
                    >
                      Press Ctrl+Enter to send quickly
                    </p>
                  )}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf:
                        message.userId === session?.user?.id
                          ? "flex-end"
                          : "flex-start",
                      maxWidth: isMobile ? "85%" : "70%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.25rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: isMobile ? "20px" : "24px",
                          height: isMobile ? "20px" : "24px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #8b5cf6, #ec4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {message.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                        }}
                      >
                        {message.user.name}
                      </span>
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: isMobile ? "0.7rem" : "0.75rem",
                        }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      style={{
                        background:
                          message.userId === session?.user?.id
                            ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                            : "rgba(30, 41, 59, 0.8)",
                        color: "#f8fafc",
                        padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem",
                        borderRadius: "12px",
                        border:
                          message.userId === session?.user?.id
                            ? "none"
                            : "1px solid rgba(139, 92, 246, 0.2)",
                        wordBreak: "break-word",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={sendMessage}
              style={{
                padding: isMobile ? "0.75rem" : "1rem",
                borderTop: "1px solid rgba(139, 92, 246, 0.2)",
                background: "rgba(30, 41, 59, 0.8)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-end",
                }}
              >
                {isMobile && !showParticipants && (
                  <button
                    type="button"
                    onClick={() => setShowParticipants(true)}
                    style={{
                      background: "rgba(139, 92, 246, 0.2)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      color: "#94a3b8",
                      cursor: "pointer",
                      flexShrink: 0,
                      minWidth: "44px",
                      minHeight: "44px",
                    }}
                  >
                    👥
                  </button>
                )}
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    isMobile
                      ? "Type message..."
                      : "Type your message... (Ctrl+Enter to send)"
                  }
                  disabled={!isConnected || !hasJoined}
                  style={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "8px",
                    padding: isMobile ? "0.75rem" : "0.75rem 1rem",
                    color: "white",
                    fontSize: isMobile ? "1rem" : "1rem",
                    minHeight: "44px",
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected || !hasJoined}
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    border: "none",
                    borderRadius: "8px",
                    padding: isMobile ? "0.75rem 1rem" : "0.75rem 1.5rem",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity:
                      newMessage.trim() && isConnected && hasJoined ? 1 : 0.5,
                    minWidth: "44px",
                    minHeight: "44px",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {isMobile ? "➤" : "Send"}
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.5rem",
                  flexWrap: "wrap",
                  gap: "0.25rem",
                }}
              >
                {!isConnected && (
                  <p
                    style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}
                  >
                    🔴 Disconnected
                  </p>
                )}
                {!hasJoined && (
                  <p
                    style={{ color: "#f59e0b", fontSize: "0.75rem", margin: 0 }}
                  >
                    ⚠️ Connecting...
                  </p>
                )}
                {isConnected && hasJoined && (
                  <p
                    style={{ color: "#10b981", fontSize: "0.75rem", margin: 0 }}
                  >
                    🟢 Connected
                  </p>
                )}
                {isMobile && (
                  <p
                    style={{ color: "#94a3b8", fontSize: "0.7rem", margin: 0 }}
                  >
                    Tap 👥 for participants
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
