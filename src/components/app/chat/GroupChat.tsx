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
//   const [hasJoined, setHasJoined] = useState(false);
//   const [showParticipants, setShowParticipants] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Mobile detection
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     if (!chatroomId) return;
//     loadChatData();
//   }, [chatroomId]);

//   useEffect(() => {
//     if (!socket || !chatroomId || !hasJoined) return;

//     const handleNewMessage = (message: ChatroomMessage) => {
//       setMessages((prev) => [...prev, message]);
//     };

//     const handleUserJoined = (data: { participant: ChatroomParticipant }) => {
//       loadParticipants();
//     };

//     const handleUserLeft = (data: { userId: string }) => {
//       loadParticipants();
//     };

//     socket.on("new_message", handleNewMessage);
//     socket.on("user_joined_chatroom", handleUserJoined);
//     socket.on("user_left_chatroom", handleUserLeft);

//     return () => {
//       socket.off("new_message", handleNewMessage);
//       socket.off("user_joined_chatroom", handleUserJoined);
//       socket.off("user_left_chatroom", handleUserLeft);
//     };
//   }, [socket, chatroomId, hasJoined]);

//   useEffect(() => {
//     if (!socket || !chatroomId || !session?.user?.id) return;

//     socket.emit("join_chatroom", { chatroomId });
//     setHasJoined(true);

//     return () => {
//       socket.emit("leave_chatroom", { chatroomId });
//       setHasJoined(false);
//     };
//   }, [socket, chatroomId, session?.user?.id]);

//   const loadChatData = async () => {
//     try {
//       setIsLoading(true);
//       console.log("🔄 STARTING loadChatData for chatroom:", chatroomId);

//       const [messagesRes, participantsRes] = await Promise.all([
//         fetch(`/api/chat/${chatroomId}/messages`),
//         fetch(`/api/chat/${chatroomId}/participants`),
//       ]);

//       if (messagesRes.ok) {
//         const messagesData = await messagesRes.json();
//         setMessages(messagesData.messages || []);
//       }

//       if (participantsRes.ok) {
//         const participantsData = await participantsRes.json();
//         setParticipants(participantsData.participants || []);
//       }
//     } catch (error) {
//       console.error("💥 Error in loadChatData:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadParticipants = async () => {
//     try {
//       const participantsRes = await fetch(
//         `/api/chat/${chatroomId}/participants`
//       );
//       if (participantsRes.ok) {
//         const participantsData = await participantsRes.json();
//         setParticipants(participantsData.participants || []);
//       }
//     } catch (error) {
//       console.error("Error loading participants:", error);
//     }
//   };

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket || !session?.user?.id) return;

//     try {
//       socket.emit("send_message", {
//         chatroomId,
//         content: newMessage,
//         userId: session.user.id,
//       });
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

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
//         const form = document.querySelector("form");
//         form?.dispatchEvent(
//           new Event("submit", { cancelable: true, bubbles: true })
//         );
//       }
//     };

//     document.addEventListener("keydown", handleKeyPress);
//     return () => document.removeEventListener("keydown", handleKeyPress);
//   }, []);

//   // Loading state
//   if (isLoading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: "rgba(0, 0, 0, 0.8)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000,
//           padding: isMobile ? "1rem" : "2rem",
//         }}
//       >
//         <div
//           style={{
//             // background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             // border: "1px solid rgba(139, 92, 246, 0.3)",
//             borderRadius: "20px",
//             padding: "2rem",
//             maxWidth: "400px",
//             width: "100%",
//             textAlign: "center",
//             color: "#94a3b8",
//           }}
//         >
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
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: "rgba(0, 0, 0, 0.8)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//         padding: isMobile ? "0" : "1rem",
//       }}
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           height: "100%",
//           maxWidth: isMobile ? "100%" : "800px",
//           maxHeight: isMobile ? "100%" : "90vh",
//           background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//           border: isMobile ? "none" : "1px solid rgba(139, 92, 246, 0.3)",
//           borderRadius: isMobile ? 0 : "20px",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: isMobile ? "1rem" : "1.5rem",
//             borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             background: "rgba(30, 41, 59, 0.8)",
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             {isMobile && (
//               <button
//                 onClick={() => setShowParticipants(!showParticipants)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: "#94a3b8",
//                   fontSize: "1.25rem",
//                   cursor: "pointer",
//                   padding: "0.25rem",
//                 }}
//               >
//                 👥
//               </button>
//             )}
//             <div>
//               <h3
//                 style={{
//                   margin: 0,
//                   color: "#f8fafc",
//                   fontSize: isMobile ? "1.1rem" : "1.25rem",
//                 }}
//               >
//                 Group Chat
//               </h3>
//               <p
//                 style={{
//                   margin: 0,
//                   color: "#94a3b8",
//                   fontSize: isMobile ? "0.75rem" : "0.875rem",
//                 }}
//               >
//                 {participants.length} participants • {isConnected ? "🟢" : "🔴"}
//                 {hasJoined && " • ✅"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#94a3b8",
//               fontSize: isMobile ? "1.5rem" : "1.75rem",
//               cursor: "pointer",
//               padding: "0.5rem",
//               minWidth: "44px",
//               minHeight: "44px",
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {/* Main Content */}
//         <div
//           style={{
//             display: "flex",
//             flex: 1,
//             overflow: "hidden",
//             flexDirection: isMobile && showParticipants ? "column" : "row",
//           }}
//         >
//           {/* Participants Sidebar */}
//           {(showParticipants || !isMobile) && (
//             <div
//               style={{
//                 width: isMobile ? "100%" : "250px",
//                 height: isMobile ? "40%" : "auto",
//                 borderRight: isMobile
//                   ? "none"
//                   : "1px solid rgba(139, 92, 246, 0.2)",
//                 borderBottom: isMobile
//                   ? "1px solid rgba(139, 92, 246, 0.2)"
//                   : "none",
//                 padding: isMobile ? "0.75rem" : "1rem",
//                 background: "rgba(15, 23, 42, 0.5)",
//                 overflowY: "auto",
//                 flexShrink: 0,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 <h4
//                   style={{
//                     color: "#f8fafc",
//                     margin: 0,
//                     fontSize: isMobile ? "0.9rem" : "1rem",
//                   }}
//                 >
//                   Participants ({participants.length})
//                 </h4>
//                 {isMobile && (
//                   <button
//                     onClick={() => setShowParticipants(false)}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       color: "#94a3b8",
//                       fontSize: "1rem",
//                       cursor: "pointer",
//                       padding: "0.25rem",
//                     }}
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "0.5rem",
//                 }}
//               >
//                 {participants.map((participant) => (
//                   <div
//                     key={participant.id}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.75rem",
//                       padding: "0.5rem",
//                       borderRadius: "8px",
//                       background:
//                         participant.userId === session?.user?.id
//                           ? "rgba(139, 92, 246, 0.2)"
//                           : "transparent",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: isMobile ? "28px" : "32px",
//                         height: isMobile ? "28px" : "32px",
//                         borderRadius: "50%",
//                         background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "white",
//                         fontSize: isMobile ? "0.75rem" : "0.875rem",
//                         fontWeight: "600",
//                         flexShrink: 0,
//                       }}
//                     >
//                       {participant.user.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div
//                         style={{
//                           color: "#f8fafc",
//                           fontSize: isMobile ? "0.8rem" : "0.875rem",
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                         }}
//                       >
//                         {participant.user.name}
//                         {participant.userId === session?.user?.id && " (You)"}
//                       </div>
//                       <div
//                         style={{
//                           color: "#94a3b8",
//                           fontSize: isMobile ? "0.7rem" : "0.75rem",
//                         }}
//                       >
//                         {participant.role}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Messages Area */}
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               minWidth: 0, // Important for flexbox text overflow
//             }}
//           >
//             {/* Messages */}
//             <div
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: isMobile ? "0.75rem" : "1rem",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: isMobile ? "0.75rem" : "1rem",
//               }}
//             >
//               {messages.length === 0 ? (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     color: "#94a3b8",
//                     padding: "2rem",
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: isMobile ? "2rem" : "3rem",
//                       marginBottom: "1rem",
//                     }}
//                   >
//                     💬
//                   </div>
//                   <p
//                     style={{
//                       margin: 0,
//                       fontSize: isMobile ? "0.9rem" : "1rem",
//                     }}
//                   >
//                     No messages yet. Start the conversation!
//                   </p>
//                   {!isMobile && (
//                     <p
//                       style={{
//                         fontSize: "0.875rem",
//                         marginTop: "0.5rem",
//                         margin: 0,
//                       }}
//                     >
//                       Press Ctrl+Enter to send quickly
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 messages.map((message) => (
//                   <div
//                     key={message.id}
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignSelf:
//                         message.userId === session?.user?.id
//                           ? "flex-end"
//                           : "flex-start",
//                       maxWidth: isMobile ? "85%" : "70%",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.5rem",
//                         marginBottom: "0.25rem",
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: isMobile ? "20px" : "24px",
//                           height: isMobile ? "20px" : "24px",
//                           borderRadius: "50%",
//                           background:
//                             "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "white",
//                           fontSize: isMobile ? "0.7rem" : "0.75rem",
//                           fontWeight: "600",
//                           flexShrink: 0,
//                         }}
//                       >
//                         {message.user.name.charAt(0).toUpperCase()}
//                       </div>
//                       <span
//                         style={{
//                           color: "#94a3b8",
//                           fontSize: isMobile ? "0.7rem" : "0.75rem",
//                         }}
//                       >
//                         {message.user.name}
//                       </span>
//                       <span
//                         style={{
//                           color: "#64748b",
//                           fontSize: isMobile ? "0.7rem" : "0.75rem",
//                         }}
//                       >
//                         {new Date(message.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         background:
//                           message.userId === session?.user?.id
//                             ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
//                             : "rgba(30, 41, 59, 0.8)",
//                         color: "#f8fafc",
//                         padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem",
//                         borderRadius: "12px",
//                         border:
//                           message.userId === session?.user?.id
//                             ? "none"
//                             : "1px solid rgba(139, 92, 246, 0.2)",
//                         wordBreak: "break-word",
//                         fontSize: isMobile ? "0.9rem" : "1rem",
//                       }}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <form
//               onSubmit={sendMessage}
//               style={{
//                 padding: isMobile ? "0.75rem" : "1rem",
//                 borderTop: "1px solid rgba(139, 92, 246, 0.2)",
//                 background: "rgba(30, 41, 59, 0.8)",
//                 flexShrink: 0,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "0.5rem",
//                   alignItems: "flex-end",
//                 }}
//               >
//                 {isMobile && !showParticipants && (
//                   <button
//                     type="button"
//                     onClick={() => setShowParticipants(true)}
//                     style={{
//                       background: "rgba(139, 92, 246, 0.2)",
//                       border: "1px solid rgba(139, 92, 246, 0.3)",
//                       borderRadius: "8px",
//                       padding: "0.75rem",
//                       color: "#94a3b8",
//                       cursor: "pointer",
//                       flexShrink: 0,
//                       minWidth: "44px",
//                       minHeight: "44px",
//                     }}
//                   >
//                     👥
//                   </button>
//                 )}
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder={
//                     isMobile
//                       ? "Type message..."
//                       : "Type your message... (Ctrl+Enter to send)"
//                   }
//                   disabled={!isConnected || !hasJoined}
//                   style={{
//                     flex: 1,
//                     background: "rgba(15, 23, 42, 0.6)",
//                     border: "1px solid rgba(139, 92, 246, 0.3)",
//                     borderRadius: "8px",
//                     padding: isMobile ? "0.75rem" : "0.75rem 1rem",
//                     color: "white",
//                     fontSize: isMobile ? "1rem" : "1rem",
//                     minHeight: "44px",
//                   }}
//                 />
//                 <button
//                   type="submit"
//                   disabled={!newMessage.trim() || !isConnected || !hasJoined}
//                   style={{
//                     background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                     border: "none",
//                     borderRadius: "8px",
//                     padding: isMobile ? "0.75rem 1rem" : "0.75rem 1.5rem",
//                     color: "white",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                     opacity:
//                       newMessage.trim() && isConnected && hasJoined ? 1 : 0.5,
//                     minWidth: "44px",
//                     minHeight: "44px",
//                     fontSize: isMobile ? "0.9rem" : "1rem",
//                   }}
//                 >
//                   {isMobile ? "➤" : "Send"}
//                 </button>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: "0.5rem",
//                   flexWrap: "wrap",
//                   gap: "0.25rem",
//                 }}
//               >
//                 {!isConnected && (
//                   <p
//                     style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}
//                   >
//                     🔴 Disconnected
//                   </p>
//                 )}
//                 {!hasJoined && (
//                   <p
//                     style={{ color: "#f59e0b", fontSize: "0.75rem", margin: 0 }}
//                   >
//                     ⚠️ Connecting...
//                   </p>
//                 )}
//                 {isConnected && hasJoined && (
//                   <p
//                     style={{ color: "#10b981", fontSize: "0.75rem", margin: 0 }}
//                   >
//                     🟢 Connected
//                   </p>
//                 )}
//                 {isMobile && (
//                   <p
//                     style={{ color: "#94a3b8", fontSize: "0.7rem", margin: 0 }}
//                   >
//                     Tap 👥 for participants
//                   </p>
//                 )}
//               </div>
//             </form>
//           </div>
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
import styled, { keyframes } from "styled-components";

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

// ============================================
// STYLED COMPONENTS
// ============================================

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ChatContainer = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: ${(props) =>
    props.$isMobile ? "none" : `1px solid ${props.theme.colors.border}`};
  border-radius: ${(props) => (props.$isMobile ? "0" : "20px")};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-height: 100%;
    border-radius: 0;
  }
`;

const ChatHeader = styled.div<{ $isMobile: boolean }>`
  padding: ${(props) => (props.$isMobile ? "1rem" : "1.5rem")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ParticipantsToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ChatInfo = styled.div``;

const ChatTitle = styled.h3<{ $isMobile: boolean }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${(props) => (props.$isMobile ? "1.1rem" : "1.25rem")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ChatMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MainContent = styled.div<{
  $isMobile: boolean;
  $showParticipants: boolean;
}>`
  display: flex;
  flex: 1;
  overflow: hidden;
  flex-direction: ${(props) =>
    props.$isMobile && props.$showParticipants ? "column" : "row"};
`;

const ParticipantsSidebar = styled.div<{ $isMobile: boolean }>`
  width: ${(props) => (props.$isMobile ? "100%" : "250px")};
  height: ${(props) => (props.$isMobile ? "40%" : "auto")};
  border-right: ${(props) =>
    props.$isMobile ? "none" : `1px solid ${props.theme.colors.border}`};
  border-bottom: ${(props) =>
    props.$isMobile ? `1px solid ${props.theme.colors.border}` : "none"};
  padding: ${(props) => (props.$isMobile ? "0.75rem" : "1rem")};
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  overflow-y: auto;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SidebarTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CloseSidebarButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ParticipantItem = styled.div<{ $isCurrentUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${(props) =>
    props.$isCurrentUser ? `rgba(139, 92, 246, 0.2)` : "transparent"};
`;

const ParticipantAvatar = styled.div<{ $size?: boolean }>`
  width: ${(props) => (props.$size ? "28px" : "32px")};
  height: ${(props) => (props.$size ? "28px" : "32px")};
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${(props) => (props.$size ? "0.75rem" : "0.875rem")};
  font-weight: 600;
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ParticipantName = styled.div<{ $size?: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${(props) => (props.$size ? "0.8rem" : "0.875rem")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ParticipantRole = styled.div<{ $size?: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${(props) => (props.$size ? "0.7rem" : "0.75rem")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const MessagesArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const EmptyMessagesState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIcon = styled.div<{ $isMobile?: boolean }>`
  font-size: ${(props) => (props.$isMobile ? "2rem" : "3rem")};
  margin-bottom: 1rem;
`;

const EmptyText = styled.p<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${(props) => (props.$isMobile ? "0.9rem" : "1rem")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const MessageWrapper = styled.div<{ $isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isCurrentUser ? "flex-end" : "flex-start")};
  gap: 0.25rem;
  max-width: 85%;

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
`;

const MessageAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${(props) => (props.$isMobile ? "20px" : "24px")};
  height: ${(props) => (props.$isMobile ? "20px" : "24px")};
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${(props) => (props.$isMobile ? "0.7rem" : "0.75rem")};
  font-weight: 600;
  flex-shrink: 0;
`;

const MessageUserName = styled.span<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${(props) => (props.$isMobile ? "0.7rem" : "0.75rem")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const MessageTime = styled.span<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${(props) => (props.$isMobile ? "0.7rem" : "0.75rem")};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const MessageBubble = styled.div<{
  $isCurrentUser: boolean;
  $isMobile?: boolean;
}>`
  background: ${(props) =>
    props.$isCurrentUser
      ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
      : props.theme.colors.tertiaryBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${(props) => (props.$isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem")};
  border-radius: 12px;
  border: ${(props) =>
    props.$isCurrentUser ? "none" : `1px solid ${props.theme.colors.border}`};
  word-break: break-word;
  font-size: ${(props) => (props.$isMobile ? "0.9rem" : "1rem")};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const MessageForm = styled.form`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const MessageInput = styled.input<{ $isMobile?: boolean }>`
  flex: 1;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${(props) => (props.$isMobile ? "0.75rem" : "0.75rem 1rem")};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 44px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SendButton = styled.button<{ $disabled: boolean; $isMobile?: boolean }>`
  background: ${(props) =>
    props.$disabled
      ? props.theme.colors.textMuted
      : "linear-gradient(135deg, #8b5cf6, #ec4899)"};
  border: none;
  border-radius: 8px;
  padding: ${(props) => (props.$isMobile ? "0.75rem 1rem" : "0.75rem 1.5rem")};
  color: white;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  min-width: 44px;
  min-height: 44px;
  font-size: ${(props) => (props.$isMobile ? "0.9rem" : "1rem")};
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
  }
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const StatusText = styled.p<{ $color: string }>`
  color: ${(props) => props.$color};
  font-size: 0.75rem;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const LoadingContent = styled.div`
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const LoadingIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const GroupChat = ({ crawlId, chatroomId, onClose }: GroupChatProps) => {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatroomMessage[]>([]);
  const [participants, setParticipants] = useState<ChatroomParticipant[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const handleUserJoined = () => {
      loadParticipants();
    };

    const handleUserLeft = () => {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const form = document.querySelector("form");
        form?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        );
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const loadChatData = async () => {
    try {
      setIsLoading(true);

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
      console.error("Error loading chat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      const participantsRes = await fetch(
        `/api/chat/${chatroomId}/participants`,
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

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingContent>
          <LoadingIcon>💬</LoadingIcon>
          <p>Loading group chat...</p>
        </LoadingContent>
      </LoadingOverlay>
    );
  }

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ChatContainer $isMobile={isMobile}>
        <ChatHeader $isMobile={isMobile}>
          <HeaderLeft>
            {isMobile && (
              <ParticipantsToggle onClick={() => setShowParticipants(true)}>
                👥
              </ParticipantsToggle>
            )}
            <ChatInfo>
              <ChatTitle $isMobile={isMobile}>Group Chat</ChatTitle>
              <ChatMeta>
                {participants.length} participants • {isConnected ? "🟢" : "🔴"}
                {hasJoined && " • ✅"}
              </ChatMeta>
            </ChatInfo>
          </HeaderLeft>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ChatHeader>

        <MainContent $isMobile={isMobile} $showParticipants={showParticipants}>
          {(showParticipants || !isMobile) && (
            <ParticipantsSidebar $isMobile={isMobile}>
              <SidebarHeader>
                <SidebarTitle>
                  Participants ({participants.length})
                </SidebarTitle>
                {isMobile && (
                  <CloseSidebarButton
                    onClick={() => setShowParticipants(false)}
                  >
                    ✕
                  </CloseSidebarButton>
                )}
              </SidebarHeader>
              <ParticipantsList>
                {participants.map((participant) => (
                  <ParticipantItem
                    key={participant.id}
                    $isCurrentUser={participant.userId === session?.user?.id}
                  >
                    <ParticipantAvatar $size={isMobile}>
                      {participant.user.name.charAt(0).toUpperCase()}
                    </ParticipantAvatar>
                    <ParticipantInfo>
                      <ParticipantName $size={isMobile}>
                        {participant.user.name}
                        {participant.userId === session?.user?.id && " (You)"}
                      </ParticipantName>
                      <ParticipantRole $size={isMobile}>
                        {participant.role}
                      </ParticipantRole>
                    </ParticipantInfo>
                  </ParticipantItem>
                ))}
              </ParticipantsList>
            </ParticipantsSidebar>
          )}

          <MessagesArea>
            <MessagesList>
              {messages.length === 0 ? (
                <EmptyMessagesState>
                  <EmptyIcon $isMobile={isMobile}>💬</EmptyIcon>
                  <EmptyText $isMobile={isMobile}>
                    No messages yet. Start the conversation!
                  </EmptyText>
                  {!isMobile && (
                    <EmptyText $isMobile={isMobile}>
                      Press Ctrl+Enter to send quickly
                    </EmptyText>
                  )}
                </EmptyMessagesState>
              ) : (
                <>
                  {messages.map((message) => {
                    const isCurrentUser = message.userId === session?.user?.id;
                    return (
                      <MessageWrapper
                        key={message.id}
                        $isCurrentUser={isCurrentUser}
                      >
                        <MessageHeader>
                          <MessageAvatar $isMobile={isMobile}>
                            {message.user.name.charAt(0).toUpperCase()}
                          </MessageAvatar>
                          <MessageUserName $isMobile={isMobile}>
                            {message.user.name}
                            {isCurrentUser && " (You)"}
                          </MessageUserName>
                          <MessageTime $isMobile={isMobile}>
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </MessageTime>
                        </MessageHeader>
                        <MessageBubble
                          $isCurrentUser={isCurrentUser}
                          $isMobile={isMobile}
                        >
                          {message.content}
                        </MessageBubble>
                      </MessageWrapper>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </MessagesList>

            <MessageForm onSubmit={sendMessage}>
              <InputWrapper>
                {isMobile && !showParticipants && (
                  <ParticipantsToggle onClick={() => setShowParticipants(true)}>
                    👥
                  </ParticipantsToggle>
                )}
                <MessageInput
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    isMobile
                      ? "Type message..."
                      : "Type your message... (Ctrl+Enter to send)"
                  }
                  disabled={!isConnected || !hasJoined}
                  $isMobile={isMobile}
                />
                <SendButton
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected || !hasJoined}
                  $disabled={!newMessage.trim() || !isConnected || !hasJoined}
                  $isMobile={isMobile}
                >
                  {isMobile ? "➤" : "Send"}
                </SendButton>
              </InputWrapper>
              <StatusBar>
                {!isConnected && (
                  <StatusText $color="#ef4444">🔴 Disconnected</StatusText>
                )}
                {!hasJoined && (
                  <StatusText $color="#f59e0b">⚠️ Connecting...</StatusText>
                )}
                {isConnected && hasJoined && (
                  <StatusText $color="#10b981">🟢 Connected</StatusText>
                )}
                {isMobile && (
                  <StatusText $color="#94a3b8">
                    Tap 👥 for participants
                  </StatusText>
                )}
              </StatusBar>
            </MessageForm>
          </MessagesArea>
        </MainContent>
      </ChatContainer>
    </ModalOverlay>
  );
};

export default GroupChat;
