"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/app/contexts/SocketContext";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";
import styled from "styled-components";

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

// 🆕 NEW INTERFACE FOR PRIVATE CHATROOMS
interface ChatroomInfo {
  id: string;
  name: string;
  description?: string;
  isGroupChat: boolean;
  crawlId?: string;
  participants: ChatroomParticipant[];
  _count: {
    participants: number;
    messages: number;
  };
}

// 🆕 KEEP CRAWL INFO FOR BACKWARD COMPATIBILITY
interface CrawlInfo {
  id: string;
  name: string;
  chatroom?: {
    id: string;
    name: string;
  };
  participants: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  creator: {
    id: string;
  };
  _count: {
    participants: number;
  };
}

// Styled Components - SIMPLE AND FIXED
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 10rem;
`;

const ChatWindow = styled.div`
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const ChatTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const ConnectionStatus = styled.div<{ $isConnected: boolean }>`
  color: ${(props) => (props.$isConnected ? "#10b981" : "#ef4444")};
  font-size: 0.875rem;
  margin: 0;
`;

// THIS IS THE ONLY SCROLLABLE AREA
const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 3px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MessageWrapper = styled.div<{ $isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isCurrentUser ? "flex-end" : "flex-start")};
  gap: 0.25rem;
  max-width: 100%;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
`;

const UserName = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
`;

const MessageTime = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

const MessageBubble = styled.div<{ $isCurrentUser: boolean }>`
  background: ${(props) =>
    props.$isCurrentUser
      ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
      : "rgba(71, 85, 105, 0.3)"};
  color: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: ${(props) =>
    props.$isCurrentUser ? "none" : "1px solid rgba(139, 92, 246, 0.2)"};
  word-break: break-word;
  font-size: 1rem;
  max-width: 70%;
`;

const MessageForm = styled.form`
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(71, 85, 105, 0.3);
  padding: 1rem;
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: rgba(139, 92, 246, 0.5);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  background: ${(props) =>
    props.$disabled
      ? "rgba(71, 85, 105, 0.5)"
      : "linear-gradient(135deg, #8b5cf6, #ec4899)"};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const StatusText = styled.p<{ $color: string }>`
  color: ${(props) => props.$color};
  font-size: 0.75rem;
  margin: 0;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorContent = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: white;
  max-width: 400px;
  width: 100%;
`;

const ErrorTitle = styled.h1`
  margin-bottom: 1rem;
  color: #ef4444;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: #94a3b8;
  margin-bottom: 2rem;
`;

const ErrorButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #ec4899);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
`;

const Chatroom = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatroomMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crawlInfo, setCrawlInfo] = useState<CrawlInfo | null>(null);
  const [chatroomInfo, setChatroomInfo] = useState<ChatroomInfo | null>(null); // 🆕 NEW STATE
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const crawlId = params.crawlId as string;
  const chatroomId = params.chatroomId as string; // 🆕 GET CHATROOM ID FROM URL

  // 🆕 UPDATED: Fetch chat info - handles BOTH crawl chats and private chats
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        setIsLoading(true);

        // Determine if this is a crawl chat or private chat
        const isCrawlChat = !!crawlId;
        const targetChatroomId = isCrawlChat
          ? crawlInfo?.chatroom?.id
          : chatroomId;

        if (!targetChatroomId && isCrawlChat) {
          // For crawl chats, we need to fetch crawl info first to get the chatroom ID
          const crawlRes = await fetch(
            `/api/crawls/${crawlId}?includeChat=true`
          );
          if (crawlRes.ok) {
            const crawlData: CrawlInfo = await crawlRes.json();
            setCrawlInfo(crawlData);

            if (crawlData.chatroom) {
              // Now fetch the chatroom info
              const chatroomRes = await fetch(
                `/api/chat/${crawlData.chatroom.id}/info`
              );
              if (chatroomRes.ok) {
                const chatroomData: ChatroomInfo = await chatroomRes.json();
                setChatroomInfo(chatroomData);
              }
            } else {
              setError("This crawl doesn't have a chat room");
            }
          } else {
            setError("Failed to load crawl information");
          }
        } else if (targetChatroomId) {
          // For private chats or when we already have the chatroom ID
          const chatroomRes = await fetch(`/api/chat/${targetChatroomId}/info`);
          if (chatroomRes.ok) {
            const chatroomData: ChatroomInfo = await chatroomRes.json();
            setChatroomInfo(chatroomData);
          } else {
            setError("Failed to load chat information");
          }
        } else {
          setError("No chatroom found");
        }
      } catch (error) {
        console.error("Error fetching chat info:", error);
        setError("Failed to load chat information");
      } finally {
        setIsLoading(false);
      }
    };

    if (crawlId || chatroomId) {
      fetchChatInfo();
    }
  }, [crawlId, chatroomId]);

  // 🆕 UPDATED: Load messages for BOTH chat types
  useEffect(() => {
    const loadMessages = async () => {
      const targetChatroomId = crawlInfo?.chatroom?.id || chatroomId;

      if (!targetChatroomId) return;

      try {
        setIsLoading(true);
        const messagesRes = await fetch(
          `/api/chat/${targetChatroomId}/messages`
        );

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setMessages(messagesData.messages || []);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (crawlInfo?.chatroom?.id || chatroomId) {
      loadMessages();
    }
  }, [crawlInfo?.chatroom?.id, chatroomId]);

  // 🆕 UPDATED: Socket.IO event listeners for BOTH chat types
  useEffect(() => {
    const targetChatroomId = crawlInfo?.chatroom?.id || chatroomId;

    if (!socket || !targetChatroomId || !hasJoined) return;

    const handleNewMessage = (message: ChatroomMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, crawlInfo?.chatroom?.id, chatroomId, hasJoined]);

  // 🆕 UPDATED: Join/leave chatroom for BOTH types
  useEffect(() => {
    const targetChatroomId = crawlInfo?.chatroom?.id || chatroomId;

    if (!socket || !targetChatroomId || !session?.user?.id) return;

    socket.emit("join_chatroom", { chatroomId: targetChatroomId });
    setHasJoined(true);

    return () => {
      socket.emit("leave_chatroom", { chatroomId: targetChatroomId });
      setHasJoined(false);
    };
  }, [socket, crawlInfo?.chatroom?.id, chatroomId, session?.user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🆕 UPDATED: Send message for BOTH chat types
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetChatroomId = crawlInfo?.chatroom?.id || chatroomId;

    if (
      !newMessage.trim() ||
      !socket ||
      !session?.user?.id ||
      !targetChatroomId
    )
      return;

    try {
      socket.emit("send_message", {
        chatroomId: targetChatroomId,
        content: newMessage.trim(),
        userId: session.user.id,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // 🆕 UPDATED: Get chat title for BOTH types
  const getChatTitle = () => {
    if (crawlInfo) {
      return `${crawlInfo.name} - Group Chat`;
    }
    if (chatroomInfo) {
      return chatroomInfo.name;
    }
    return "Chat";
  };

  // 🆕 UPDATED: Get back button URL for BOTH types
  const getBackUrl = () => {
    if (crawlInfo) {
      return `/app/crawls/${crawlId}`;
    }
    // For private chats, go back to social page
    return "/app/social";
  };

  // 🆕 UPDATED: Get participant count for BOTH types
  const getParticipantCount = () => {
    if (crawlInfo) {
      return crawlInfo._count.participants;
    }
    if (chatroomInfo) {
      return chatroomInfo._count.participants;
    }
    return 0;
  };

  // Keyboard shortcut
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

  // 🆕 UPDATED: Check if chat is available for BOTH types
  const isChatAvailable = () => {
    if (crawlId) {
      return !!crawlInfo?.chatroom;
    }
    if (chatroomId) {
      return !!chatroomInfo;
    }
    return false;
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
        }}
      >
        <HopprLoader />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <ErrorTitle>Error</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <ErrorButton onClick={() => router.push(getBackUrl())}>
            Back {crawlInfo ? "to Crawl" : "to Social"}
          </ErrorButton>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  if (!isChatAvailable()) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <ErrorTitle>Chat Not Available</ErrorTitle>
          <ErrorMessage>
            {crawlId
              ? "This crawl doesn't have a chat room set up."
              : "This chat room is not available."}
          </ErrorMessage>
          <ErrorButton onClick={() => router.push(getBackUrl())}>
            Back {crawlInfo ? "to Crawl" : "to Social"}
          </ErrorButton>
        </ErrorContent>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <ChatWindow>
        {/* 🆕 UPDATED HEADER */}
        <Header>
          <BackButton onClick={() => router.push(getBackUrl())}>
            ← Back {crawlInfo ? "to Crawl" : "to Social"}
          </BackButton>
          <HeaderInfo>
            <ChatTitle>{getChatTitle()}</ChatTitle>
            <ConnectionStatus $isConnected={isConnected}>
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </ConnectionStatus>
          </HeaderInfo>
        </Header>

        <MessagesArea>
          {messages.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
              <p>No messages yet. Start the conversation!</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Press Ctrl+Enter to send quickly
              </p>
            </EmptyState>
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
                      <UserAvatar>
                        {message.user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <UserName>
                        {message.user.name}
                        {isCurrentUser && " (You)"}
                      </UserName>
                      <MessageTime>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </MessageTime>
                    </MessageHeader>
                    <MessageBubble $isCurrentUser={isCurrentUser}>
                      {message.content}
                    </MessageBubble>
                  </MessageWrapper>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </MessagesArea>

        <MessageForm onSubmit={sendMessage}>
          <InputContainer>
            <MessageInput
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message... (Ctrl+Enter to send)"
              disabled={!isConnected || !hasJoined}
            />
            <SendButton
              type="submit"
              disabled={!newMessage.trim() || !isConnected || !hasJoined}
              $disabled={!newMessage.trim() || !isConnected || !hasJoined}
            >
              Send
            </SendButton>
          </InputContainer>
          <StatusBar>
            {!isConnected && (
              <StatusText $color="#ef4444">🔴 Disconnected</StatusText>
            )}
            {!hasJoined && (
              <StatusText $color="#f59e0b">⚠️ Connecting...</StatusText>
            )}
            {isConnected && hasJoined && (
              <StatusText $color="#10b981">🟢 Connected and ready</StatusText>
            )}
            <StatusText $color="#94a3b8">
              {getParticipantCount()} participants
            </StatusText>
          </StatusBar>
        </MessageForm>
      </ChatWindow>
    </PageContainer>
  );
};

export default Chatroom;
