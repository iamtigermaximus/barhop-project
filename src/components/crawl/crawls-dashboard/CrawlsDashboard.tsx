"use client";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect } from "react";

const Page = styled.div`
  padding: 2rem 1rem;
  /* 
  max-width: 1200px; */
  margin: 0 auto;
  /* background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  ); */
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  min-height: calc(100vh - 70px);
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  /* border-bottom: 1px solid rgba(139, 92, 246, 0.2); */
  padding-bottom: 1rem;
  justify-content: center;
  background-color: transparent !important;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" : "transparent"};
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)"};
  color: ${(props) => (props.$active ? "white" : "#e2e8f0")};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
        : "rgba(139, 92, 246, 0.1)"};
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }
`;

const CreateCrawlCard = styled(Link)`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(30, 41, 59, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
  }
`;

const CreateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const CreateText = styled.div`
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CrawlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CrawlCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

const CrawlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CrawlName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  flex: 1;
`;

const CrawlStatus = styled.span<{
  $status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}>`
  background: ${(props) =>
    props.$status === "PLANNING"
      ? "linear-gradient(45deg, #0ea5e9, #3b82f6)"
      : props.$status === "UPCOMING"
      ? "linear-gradient(45deg, #8b5cf6, #a855f7)"
      : props.$status === "ACTIVE"
      ? "linear-gradient(45deg, #10b981, #059669)"
      : props.$status === "COMPLETED"
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CrawlMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
`;

const MetaValue = styled.span`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
`;

const BarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const BarCount = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ViewButton = styled(Link)`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }
`;

const JoinButton = styled.button<{ $requiresAuth?: boolean }>`
  background: ${(props) =>
    props.$requiresAuth
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #10b981, #059669)"};
  border: 1px solid
    ${(props) =>
      props.$requiresAuth
        ? "rgba(107, 114, 128, 0.3)"
        : "rgba(16, 185, 129, 0.3)"};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.$requiresAuth ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  flex: 1;
  opacity: ${(props) => (props.$requiresAuth ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$requiresAuth
        ? "linear-gradient(45deg, #6b7280, #4b5563)"
        : "linear-gradient(45deg, #059669, #047857)"};
    transform: ${(props) =>
      props.$requiresAuth ? "none" : "translateY(-1px)"};
    box-shadow: ${(props) =>
      props.$requiresAuth ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)"};
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  border: 1px solid #374151;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  &:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1f2937;
  }
`;

const JoinButtonWrapper = styled.div`
  position: relative;
  flex: 1;

  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  grid-column: 1 / -1;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e2e8f0;
  grid-column: 1 / -1;
`;

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  isPublic: boolean;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    participants: number;
  };
}

export default function CrawlsDashboard() {
  const [activeTab, setActiveTab] = useState<"discover">("discover");
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch crawls on component mount
  useEffect(() => {
    const fetchCrawls = async () => {
      try {
        setIsLoading(true);

        // Fetch public crawls
        const publicResponse = await fetch("/api/crawls?public=true");
        if (publicResponse.ok) {
          const publicCrawls = await publicResponse.json();
          setCrawls(publicCrawls);
        }
      } catch (error) {
        console.error("Error fetching crawls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrawls();
  }, []);

  const handleJoinCrawl = async (crawlId: string) => {
    // Redirect to signup since user needs to be authenticated
    window.location.href = `/auth/signup?redirect=/crawls-dashboard&crawl=${crawlId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Page>
        <Title>Bar Crawls</Title>
        <Description>Discover amazing bar crawls in your city</Description>
        <CrawlsGrid>
          <LoadingState>
            <p>Loading crawls...</p>
          </LoadingState>
        </CrawlsGrid>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Bar Crawls</Title>
      <Description>
        Discover amazing bar crawls in your city. Sign up to join or create your
        own!
      </Description>

      <TabContainer>
        <Tab
          $active={activeTab === "discover"}
          onClick={() => setActiveTab("discover")}
        >
          Discover Crawls ({crawls.length})
        </Tab>
      </TabContainer>

      <CrawlsGrid>
        {/* Show create crawl card for non-authenticated users */}
        <CreateCrawlCard href="/auth/signup">
          <CreateIcon>🔐</CreateIcon>
          <CreateText>Sign Up to Create Crawls</CreateText>
        </CreateCrawlCard>

        {/* Public/Discoverable Crawls */}
        {crawls.map((crawl) => (
          <CrawlCard key={crawl.id}>
            <CrawlHeader>
              <CrawlName>{crawl.name}</CrawlName>
              <CrawlStatus $status={crawl.status}>
                {crawl.status === "PLANNING"
                  ? "Joinable"
                  : crawl.status.toLowerCase()}
              </CrawlStatus>
            </CrawlHeader>

            <CrawlMeta>
              <MetaItem>
                <MetaLabel>Date & Time</MetaLabel>
                <MetaValue>{formatDate(crawl.date)}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>City</MetaLabel>
                <MetaValue>{crawl.city.name}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Participants</MetaLabel>
                <MetaValue>
                  {crawl._count.participants}/{crawl.maxParticipants}
                </MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Created by</MetaLabel>
                <MetaValue>{crawl.creator.name}</MetaValue>
              </MetaItem>
            </CrawlMeta>

            <BarPreview>
              <BarCount>
                {Math.floor(
                  (crawl._count.participants / crawl.maxParticipants) * 100
                )}
                % full • {crawl.isPublic ? "Public" : "Private"}
              </BarCount>
            </BarPreview>

            <ActionButtons>
              <ViewButton href={`/crawls/${crawl.id}`}>View Details</ViewButton>

              <JoinButtonWrapper>
                <JoinButton
                  onClick={() => handleJoinCrawl(crawl.id)}
                  $requiresAuth={true}
                  disabled={crawl._count.participants >= crawl.maxParticipants}
                >
                  {crawl._count.participants >= crawl.maxParticipants
                    ? "Full"
                    : "Sign Up to Join"}
                </JoinButton>

                {crawl._count.participants >= crawl.maxParticipants && (
                  <Tooltip>This crawl is full</Tooltip>
                )}
                {crawl._count.participants < crawl.maxParticipants && (
                  <Tooltip>Sign up to join this crawl</Tooltip>
                )}
              </JoinButtonWrapper>
            </ActionButtons>
          </CrawlCard>
        ))}

        {/* Empty State */}
        {crawls.length === 0 && (
          <EmptyState>
            <div className="icon">🔍</div>
            <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
              No public crawls available
            </h3>
            <p>Check back later for new crawl opportunities!</p>
            <CreateCrawlCard
              href="/auth/signup"
              style={{
                marginTop: "1rem",
                minHeight: "auto",
                padding: "1.5rem",
              }}
            >
              <CreateText>Be the first to create one!</CreateText>
            </CreateCrawlCard>
          </EmptyState>
        )}
      </CrawlsGrid>
    </Page>
  );
}
