// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useSession } from "next-auth/react";
// import { useSocket } from "../contexts/SocketContext";

// interface GroupChatProps {
//   crawlId: string;
//   chatroomId: string;
//   onClose: () => void;
// }

// interface ChatroomMessage {
//   id: string;
//   content: string;
//   userId: string;
//   chatroomId: string;
//   messageType: string;
//   createdAt: string;
//   user: {
//     id: string;
//     name: string;
//     image?: string;
//   };
// }

// interface ChatroomParticipant {
//   id: string;
//   userId: string;
//   chatroomId: string;
//   role: string;
//   joinedAt: string;
//   user: {
//     id: string;
//     name: string;
//     image?: string;
//   };
// }

// const GroupChat = ({ crawlId, chatroomId, onClose }: GroupChatProps) => {
//   const { data: session } = useSession();
//   const { socket, isConnected } = useSocket();
//   const [messages, setMessages] = useState<ChatroomMessage[]>([]);
//   const [participants, setParticipants] = useState<ChatroomParticipant[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!socket || !chatroomId) return;

//     // 🆕 JOIN THE SPECIFIC CHATROOM
//     socket.emit("join_chatroom", { chatroomId });

//     // Load existing data
//     loadChatData();

//     // 🆕 SOCKET EVENT LISTENERS FOR CHAT
//     socket.on("new_message", (message: ChatroomMessage) => {
//       console.log("💬 New message received:", message);
//       setMessages((prev) => [...prev, message]);
//     });

//     // Note: We'll reload participants when needed instead of real-time joins/leaves
//     // for simplicity. You can add user_joined_chatroom/user_left_chatroom events later.

//     return () => {
//       socket.off("new_message");
//       // 🆕 LEAVE CHATROOM WHEN COMPONENT UNMOUNTS
//       socket.emit("leave_chatroom", { chatroomId });
//     };
//   }, [socket, chatroomId]);

//   const loadChatData = async () => {
//     try {
//       setIsLoading(true);

//       // Load messages
//       const messagesRes = await fetch(`/api/chat/${chatroomId}/messages`);
//       if (messagesRes.ok) {
//         const messagesData = await messagesRes.json();
//         setMessages(messagesData.messages || []);
//       } else {
//         console.error("Failed to load messages:", messagesRes.status);
//       }

//       // Load participants
//       const participantsRes = await fetch(
//         `/api/chat/${chatroomId}/participants`
//       );
//       if (participantsRes.ok) {
//         const participantsData = await participantsRes.json();
//         setParticipants(participantsData.participants || []);
//       } else {
//         console.error("Failed to load participants:", participantsRes.status);
//       }
//     } catch (error) {
//       console.error("Error loading chat data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket || !session?.user?.id) return;

//     try {
//       // 🆕 USE SOCKET TO SEND MESSAGE INSTEAD OF DIRECT API CALL
//       socket.emit("send_message", {
//         chatroomId,
//         content: newMessage,
//         userId: session.user.id,
//       });

//       // Clear input immediately for better UX
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message. Please try again.");
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "90vw",
//           height: "80vh",
//           maxWidth: "800px",
//           background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//           border: "1px solid rgba(139, 92, 246, 0.3)",
//           borderRadius: "20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000,
//         }}
//       >
//         <div style={{ color: "#94a3b8", textAlign: "center" }}>
//           <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💬</div>
//           <p>Loading group chat...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         width: "90vw",
//         height: "80vh",
//         maxWidth: "800px",
//         background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//         border: "1px solid rgba(139, 92, 246, 0.3)",
//         borderRadius: "20px",
//         display: "flex",
//         flexDirection: "column",
//         zIndex: 1000,
//         overflow: "hidden",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           padding: "1.5rem",
//           borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           background: "rgba(30, 41, 59, 0.8)",
//         }}
//       >
//         <div>
//           <h3 style={{ margin: 0, color: "#f8fafc" }}>Group Chat</h3>
//           <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.875rem" }}>
//             {participants.length} participants •{" "}
//             {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
//           </p>
//         </div>
//         <button
//           onClick={onClose}
//           style={{
//             background: "none",
//             border: "none",
//             color: "#94a3b8",
//             fontSize: "1.5rem",
//             cursor: "pointer",
//             padding: "0.5rem",
//           }}
//         >
//           ×
//         </button>
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           display: "flex",
//           flex: 1,
//           overflow: "hidden",
//         }}
//       >
//         {/* Participants Sidebar */}
//         <div
//           style={{
//             width: "250px",
//             borderRight: "1px solid rgba(139, 92, 246, 0.2)",
//             padding: "1rem",
//             background: "rgba(15, 23, 42, 0.5)",
//             overflowY: "auto",
//           }}
//         >
//           <h4
//             style={{ color: "#f8fafc", marginBottom: "1rem", fontSize: "1rem" }}
//           >
//             Participants
//           </h4>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
//           >
//             {participants.map((participant) => (
//               <div
//                 key={participant.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.75rem",
//                   padding: "0.5rem",
//                   borderRadius: "8px",
//                   background:
//                     participant.userId === session?.user?.id
//                       ? "rgba(139, 92, 246, 0.2)"
//                       : "transparent",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "32px",
//                     height: "32px",
//                     borderRadius: "50%",
//                     background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "white",
//                     fontSize: "0.875rem",
//                     fontWeight: "600",
//                   }}
//                 >
//                   {participant.user.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ color: "#f8fafc", fontSize: "0.875rem" }}>
//                     {participant.user.name}
//                     {participant.userId === session?.user?.id && " (You)"}
//                   </div>
//                   <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
//                     {participant.role}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Messages Area */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Messages */}
//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               padding: "1rem",
//               display: "flex",
//               flexDirection: "column",
//               gap: "1rem",
//             }}
//           >
//             {messages.length === 0 ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   color: "#94a3b8",
//                   padding: "2rem",
//                 }}
//               >
//                 <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
//                 <p>No messages yet. Start the conversation!</p>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignSelf:
//                       message.userId === session?.user?.id
//                         ? "flex-end"
//                         : "flex-start",
//                     maxWidth: "70%",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       marginBottom: "0.25rem",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "24px",
//                         height: "24px",
//                         borderRadius: "50%",
//                         background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "white",
//                         fontSize: "0.75rem",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {message.user.name.charAt(0).toUpperCase()}
//                     </div>
//                     <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
//                       {message.user.name}
//                     </span>
//                     <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
//                       {new Date(message.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       background:
//                         message.userId === session?.user?.id
//                           ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
//                           : "rgba(30, 41, 59, 0.8)",
//                       color: "#f8fafc",
//                       padding: "0.75rem 1rem",
//                       borderRadius: "12px",
//                       border:
//                         message.userId === session?.user?.id
//                           ? "none"
//                           : "1px solid rgba(139, 92, 246, 0.2)",
//                     }}
//                   >
//                     {message.content}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <form
//             onSubmit={sendMessage}
//             style={{
//               padding: "1rem",
//               borderTop: "1px solid rgba(139, 92, 246, 0.2)",
//               background: "rgba(30, 41, 59, 0.8)",
//             }}
//           >
//             <div style={{ display: "flex", gap: "0.5rem" }}>
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type your message..."
//                 disabled={!isConnected}
//                 style={{
//                   flex: 1,
//                   background: "rgba(15, 23, 42, 0.6)",
//                   border: "1px solid rgba(139, 92, 246, 0.3)",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1rem",
//                   color: "white",
//                   fontSize: "1rem",
//                 }}
//               />
//               <button
//                 type="submit"
//                 disabled={!newMessage.trim() || !isConnected}
//                 style={{
//                   background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "0.75rem 1.5rem",
//                   color: "white",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                   opacity: newMessage.trim() && isConnected ? 1 : 0.5,
//                 }}
//               >
//                 Send
//               </button>
//             </div>
//             {!isConnected && (
//               <p
//                 style={{
//                   color: "#ef4444",
//                   fontSize: "0.75rem",
//                   marginTop: "0.5rem",
//                 }}
//               >
//                 🔴 Disconnected - Reconnecting...
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupChat;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      const messagesUrl = `/api/chat/${chatroomId}/messages`;
      const participantsUrl = `/api/chat/${chatroomId}/participants`;

      console.log("📡 API URLs:", { messagesUrl, participantsUrl });

      const [messagesRes, participantsRes] = await Promise.all([
        fetch(messagesUrl),
        fetch(participantsUrl),
      ]);

      console.log("📨 API Responses:", {
        messagesStatus: messagesRes.status,
        messagesOk: messagesRes.ok,
        participantsStatus: participantsRes.status,
        participantsOk: participantsRes.ok,
      });

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        console.log("💬 Messages data received:", messagesData);
        setMessages(messagesData.messages || []);
        console.log(
          "✅ Set messages count:",
          messagesData.messages?.length || 0
        );
      } else {
        console.error("❌ Failed to load messages:", messagesRes.status);
        const errorText = await messagesRes.text();
        console.error("Error response:", errorText);
      }

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json();
        setParticipants(participantsData.participants || []);
        console.log(
          "✅ Set participants count:",
          participantsData.participants?.length || 0
        );
      } else {
        console.error(
          "❌ Failed to load participants:",
          participantsRes.status
        );
      }
    } catch (error) {
      console.error("💥 Error in loadChatData:", error);
    } finally {
      setIsLoading(false);
      console.log("🏁 FINISHED loadChatData");
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

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90vw",
          height: "80vh",
          maxWidth: "800px",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div style={{ color: "#94a3b8", textAlign: "center" }}>
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
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        height: "80vh",
        maxWidth: "800px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(30, 41, 59, 0.8)",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#f8fafc" }}>Group Chat</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.875rem" }}>
            {participants.length} participants •{" "}
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            {hasJoined && " • ✅ Joined"}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "250px",
            borderRight: "1px solid rgba(139, 92, 246, 0.2)",
            padding: "1rem",
            background: "rgba(15, 23, 42, 0.5)",
            overflowY: "auto",
          }}
        >
          <h4
            style={{ color: "#f8fafc", marginBottom: "1rem", fontSize: "1rem" }}
          >
            Participants
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
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
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {participant.user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f8fafc", fontSize: "0.875rem" }}>
                    {participant.user.name}
                    {participant.userId === session?.user?.id && " (You)"}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    {participant.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  padding: "2rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
                <p>No messages yet. Start the conversation!</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                  Press Ctrl+Enter to send quickly
                </p>
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
                    maxWidth: "70%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      {message.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                      {message.user.name}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
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
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border:
                        message.userId === session?.user?.id
                          ? "none"
                          : "1px solid rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            style={{
              padding: "1rem",
              borderTop: "1px solid rgba(139, 92, 246, 0.2)",
              background: "rgba(30, 41, 59, 0.8)",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message... (Ctrl+Enter to send)"
                disabled={!isConnected || !hasJoined}
                style={{
                  flex: 1,
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected || !hasJoined}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  opacity:
                    newMessage.trim() && isConnected && hasJoined ? 1 : 0.5,
                }}
              >
                Send
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              {!isConnected && (
                <p style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}>
                  🔴 Disconnected - Reconnecting...
                </p>
              )}
              {!hasJoined && (
                <p style={{ color: "#f59e0b", fontSize: "0.75rem", margin: 0 }}>
                  ⚠️ Connecting to chat...
                </p>
              )}
              {isConnected && hasJoined && (
                <p style={{ color: "#10b981", fontSize: "0.75rem", margin: 0 }}>
                  🟢 Connected to chatroom
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
