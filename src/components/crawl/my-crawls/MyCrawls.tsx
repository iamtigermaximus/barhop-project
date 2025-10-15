"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";

const Page = styled.div`
  padding: 2rem 1rem;
  margin: 0 auto;
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
  box-sizing: border-box;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    min-height: calc(100dvh - 70px);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.75rem 0.25rem;
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
  line-height: 1.2;
  padding: 0 1rem;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
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
  line-height: 1.5;
  padding: 0 1rem;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.75rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 1rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 1rem;
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
  white-space: nowrap;
  flex-shrink: 0;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 0.7rem 1.25rem;
    font-size: 0.95rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: 120px;
    text-align: center;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 100px;
    border-radius: 6px;
  }

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
        : "rgba(139, 92, 246, 0.1)"};
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }

  /* Disable hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const CrawlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
    margin-top: 1.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0 0.25rem;
    gap: 0.75rem;
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
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 2.5rem 1.5rem;
    min-height: 180px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 160px;
    border-radius: 12px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
    min-height: 140px;
    border-radius: 10px;
  }

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(30, 41, 59, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
  }

  /* Reduce hover effect on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const CreateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const CreateText = styled.div`
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CreateSubtext = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
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
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.75rem;
    border-radius: 14px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 10px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  /* Reduce hover effect on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CrawlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const CrawlName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  flex: 1;
  line-height: 1.3;
  word-wrap: break-word;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
    width: 100%;
  }
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
  white-space: nowrap;
  flex-shrink: 0;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    align-self: flex-start;
  }
`;

const CrawlMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
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

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const MetaValue = styled.span`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const BarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const BarCount = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
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
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 38px;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const ManageButton = styled(Link)`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 38px;
  }

  &:hover {
    background: linear-gradient(45deg, #7c3aed, #2563eb);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  grid-column: 1 / -1;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;

    /* Mobile */
    @media (max-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    /* Small mobile */
    @media (max-width: 480px) {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e2e8f0;
  grid-column: 1 / -1;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const RoleBadge = styled.span<{ $isCreator: boolean }>`
  background: ${(props) =>
    props.$isCreator
      ? "linear-gradient(45deg, #f59e0b, #d97706)"
      : "linear-gradient(45deg, #6b7280, #4b5563)"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
  white-space: nowrap;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
    margin-left: 0.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.15rem 0.3rem;
    margin-left: 0;
    margin-top: 0.25rem;
    display: inline-block;
  }
`;

// ... rest of your interfaces remain the same ...
interface CrawlUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string | null;
  maxParticipants: number;
  isPublic: boolean;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: CrawlUser;
  participants: Array<{
    userId: string;
  }>;
  crawlBars: Array<{
    bar: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    participants: number;
  };
}

type CrawlTab = "created" | "participating" | "upcoming" | "past";

const MyCrawls = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<CrawlTab>("upcoming");
  const [allCrawls, setAllCrawls] = useState<Crawl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all user's crawls (created + joined)
  const fetchMyCrawls = async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      console.log("Fetching user crawls...");

      const response = await fetch("/api/crawls"); // No query params = get user's crawls
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user crawls:", data);
        setAllCrawls(data);
      } else {
        console.error("Failed to fetch user crawls");
        setAllCrawls([]);
      }
    } catch (error) {
      console.error("Error fetching user crawls:", error);
      setAllCrawls([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when session changes
  useEffect(() => {
    if (session) {
      fetchMyCrawls();
    }
  }, [session]);

  // Filter crawls based on active tab
  const getFilteredCrawls = () => {
    const now = new Date();

    switch (activeTab) {
      case "created":
        // Crawls where user is the creator
        return allCrawls.filter((crawl) => isUserCreator(crawl));

      case "participating":
        // Crawls where user is participating (including ones they created)
        return allCrawls.filter((crawl) => isUserParticipant(crawl));

      case "upcoming":
        // All crawls that are upcoming (both created and joined)
        return allCrawls.filter(
          (crawl) =>
            isUserParticipant(crawl) &&
            new Date(crawl.date) >= now &&
            crawl.status !== "COMPLETED" &&
            crawl.status !== "CANCELLED"
        );

      case "past":
        // All past crawls (both created and joined)
        return allCrawls.filter(
          (crawl) =>
            isUserParticipant(crawl) &&
            (new Date(crawl.date) < now ||
              crawl.status === "COMPLETED" ||
              crawl.status === "CANCELLED")
        );

      default:
        return allCrawls;
    }
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

  const isUserCreator = (crawl: Crawl) => {
    return session?.user?.id === crawl.creator.id;
  };

  const isUserParticipant = (crawl: Crawl) => {
    if (!session?.user?.id) return false;
    return crawl.participants.some((p) => p.userId === session.user.id);
  };

  // Calculate tab counts from all crawls
  const calculateTabCounts = () => {
    const now = new Date();

    const createdCount = allCrawls.filter((crawl) =>
      isUserCreator(crawl)
    ).length;

    const participatingCount = allCrawls.filter((crawl) =>
      isUserParticipant(crawl)
    ).length;

    const upcomingCount = allCrawls.filter(
      (crawl) =>
        isUserParticipant(crawl) &&
        new Date(crawl.date) >= now &&
        crawl.status !== "COMPLETED" &&
        crawl.status !== "CANCELLED"
    ).length;

    const pastCount = allCrawls.filter(
      (crawl) =>
        isUserParticipant(crawl) &&
        (new Date(crawl.date) < now ||
          crawl.status === "COMPLETED" ||
          crawl.status === "CANCELLED")
    ).length;

    return {
      created: createdCount,
      participating: participatingCount,
      upcoming: upcomingCount,
      past: pastCount,
    };
  };

  const tabCounts = calculateTabCounts();
  const displayCrawls = getFilteredCrawls();

  if (status === "loading") {
    return (
      <Page>
        <Title>My Crawls</Title>
        <Description>Managing your bar crawl adventures</Description>
        <LoadingState>
          <p>Loading your crawls...</p>
        </LoadingState>
      </Page>
    );
  }

  if (!session) {
    return (
      <Page>
        <Title>My Crawls</Title>
        <Description>Sign in to view and manage your crawls</Description>
        <EmptyState>
          <div className="icon">🔐</div>
          <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
            Authentication Required
          </h3>
          <p>Please sign in to view your crawls</p>
          <CreateCrawlCard
            href="/auth/signin"
            style={{
              marginTop: "1rem",
              minHeight: "auto",
              padding: "1.5rem",
            }}
          >
            <CreateText>Sign In</CreateText>
          </CreateCrawlCard>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>My Crawls</Title>
      <Description>
        Manage your created crawls and track the ones you&apos;re participating
        in
      </Description>

      <TabsContainer>
        <Tab
          $active={activeTab === "upcoming"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({tabCounts.upcoming})
        </Tab>
        <Tab
          $active={activeTab === "created"}
          onClick={() => setActiveTab("created")}
        >
          Created ({tabCounts.created})
        </Tab>
        <Tab
          $active={activeTab === "participating"}
          onClick={() => setActiveTab("participating")}
        >
          Participating ({tabCounts.participating})
        </Tab>
        <Tab
          $active={activeTab === "past"}
          onClick={() => setActiveTab("past")}
        >
          Past ({tabCounts.past})
        </Tab>
      </TabsContainer>

      <CrawlsGrid>
        {/* Create New Crawl Card - Only show in created tab */}
        {activeTab === "created" && (
          <CreateCrawlCard href="/crawl-planner">
            <CreateIcon>🎯</CreateIcon>
            <CreateText>Create New Crawl</CreateText>
            <CreateSubtext>Plan your next bar adventure</CreateSubtext>
          </CreateCrawlCard>
        )}

        {/* Display crawls */}
        {!isLoading &&
          displayCrawls.map((crawl) => {
            const userIsCreator = isUserCreator(crawl);
            const userIsParticipant = isUserParticipant(crawl);

            return (
              <CrawlCard key={crawl.id}>
                <CrawlHeader>
                  <CrawlName>
                    {crawl.name}
                    <RoleBadge $isCreator={userIsCreator}>
                      {userIsCreator ? "Creator" : "Participant"}
                    </RoleBadge>
                  </CrawlName>
                  <CrawlStatus $status={crawl.status}>
                    {crawl.status.toLowerCase()}
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
                    <MetaLabel>Bars</MetaLabel>
                    <MetaValue>{crawl.crawlBars.length} stops</MetaValue>
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
                  <ViewButton href={`/crawls/${crawl.id}`}>
                    View Details
                  </ViewButton>

                  {userIsCreator ? (
                    <ManageButton href={`/crawls/${crawl.id}/manage`}>
                      Manage
                    </ManageButton>
                  ) : (
                    <ViewButton href={`/crawls/${crawl.id}/chat`}>
                      Chat
                    </ViewButton>
                  )}
                </ActionButtons>
              </CrawlCard>
            );
          })}

        {/* Loading State */}
        {isLoading && (
          <LoadingState>
            <p>Loading your crawls...</p>
          </LoadingState>
        )}

        {/* Empty State */}
        {!isLoading && displayCrawls.length === 0 && (
          <EmptyState>
            <div className="icon">
              {activeTab === "created"
                ? "📝"
                : activeTab === "participating"
                ? "👥"
                : activeTab === "upcoming"
                ? "📅"
                : "🏁"}
            </div>
            <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
              {activeTab === "created" && "No crawls created yet"}
              {activeTab === "participating" &&
                "Not participating in any crawls"}
              {activeTab === "upcoming" && "No upcoming crawls"}
              {activeTab === "past" && "No past crawls"}
            </h3>
            <p>
              {activeTab === "created" &&
                "Create your first crawl to get started!"}
              {activeTab === "participating" &&
                "Join a crawl from the discover page!"}
              {activeTab === "upcoming" &&
                "All your upcoming crawls will appear here"}
              {activeTab === "past" && "Your completed crawls will appear here"}
            </p>
            {activeTab === "created" && (
              <CreateCrawlCard
                href="/crawl-planner"
                style={{
                  marginTop: "1rem",
                  minHeight: "auto",
                  padding: "1.5rem",
                }}
              >
                <CreateText>Create Your First Crawl</CreateText>
              </CreateCrawlCard>
            )}
            {(activeTab === "participating" || activeTab === "upcoming") && (
              <CreateCrawlCard
                href="/crawls"
                style={{
                  marginTop: "1rem",
                  minHeight: "auto",
                  padding: "1.5rem",
                }}
              >
                <CreateText>Discover Crawls</CreateText>
              </CreateCrawlCard>
            )}
          </EmptyState>
        )}
      </CrawlsGrid>
    </Page>
  );
};

export default MyCrawls;
