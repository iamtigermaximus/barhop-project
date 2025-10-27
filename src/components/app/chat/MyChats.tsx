"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 2rem 1rem;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  padding: 0.75rem 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #8b5cf6;
  cursor: pointer;
  font-weight: 500;
`;

const Title = styled.h1`
  color: #f8fafc;
  margin: 0;
`;

const ChatsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ChatCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-2px);
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChatName = styled.h3`
  color: #f8fafc;
  margin: 0;
`;

const ParticipantList = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 3rem 1rem;
`;

interface Chatroom {
  id: string;
  name: string;
  isGroupChat: boolean;
  participants: Array<{
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }>;
  _count: {
    messages: number;
  };
}

export default function MyChats() {
  const { data: session } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chatroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyChats = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/chat/my-chats");
        if (response.ok) {
          const data = await response.json();
          setChats(data.chatrooms || []);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyChats();
  }, [session]);

  const getOtherParticipants = (chat: Chatroom) => {
    return chat.participants
      .filter((p) => p.user.id !== session?.user?.id)
      .map((p) => p.user.name || "Unknown User")
      .join(", ");
  };

  if (isLoading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            Loading your chats...
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <BackButton onClick={() => router.push("/app/social")}>
            ← Back to Social
          </BackButton>
          <Title>My Chats</Title>
        </Header>

        {chats.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
            <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
              No chats yet
            </h3>
            <p>
              Your private chats will appear here after you accept hop requests.
            </p>
          </EmptyState>
        ) : (
          <ChatsGrid>
            {chats.map((chat) => (
              <ChatCard
                key={chat.id}
                onClick={() => router.push(`/app/chat/private/${chat.id}`)}
              >
                <ChatHeader>
                  <ChatName>
                    {chat.isGroupChat
                      ? chat.name
                      : `Chat with ${getOtherParticipants(chat)}`}
                  </ChatName>
                  <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {chat._count.messages} messages
                  </div>
                </ChatHeader>
                <ParticipantList>
                  With: {getOtherParticipants(chat)}
                </ParticipantList>
              </ChatCard>
            ))}
          </ChatsGrid>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}
