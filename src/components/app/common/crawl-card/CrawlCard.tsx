"use client";

import styled from "styled-components";
import Link from "next/link";
import { Calendar, MapPin } from "phosphor-react";

const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  min-width: 280px;
  flex-shrink: 0;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CrawlName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: bold;
  font-family: ${({ theme }) =>
    theme.fonts.dm}; /* Changed from heading to dm */
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  margin-top: 4px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarThumbs = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const BarThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: -8px;
  border: 2px solid ${({ theme }) => theme.colors.secondaryBackground};
`;

const Overflow = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  margin-right: -8px;
  border: 2px solid ${({ theme }) => theme.colors.secondaryBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Attendees = styled.div`
  display: flex;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: -8px;
  border: 2px solid ${({ theme }) => theme.colors.secondaryBackground};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// Support both mock data and real API data
interface CrawlCardProps {
  crawl: {
    id: string;
    name: string;
    startTime: string;
    bars?: string[];
    attendees?: string[];
    distance?: string;
    // Support real API data
    date?: string;
    maxParticipants?: number;
    currentParticipants?: number;
  };
  // Optional: provide custom bar images and attendee avatars
  barImages?: { [barId: string]: string };
  attendeeAvatars?: { [userId: string]: string };
}

// Default mock data for when API doesn't provide everything
const DEFAULT_BAR_IMAGES = [
  "https://images.unsplash.com/photo-1572116466296-3c5c7e8b6e5a?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1572116466296-3c5c7e8b6e5a?w=100&h=100&fit=crop",
];

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop",
];

export default function CrawlCard({
  crawl,
  barImages = {},
  attendeeAvatars = {},
}: CrawlCardProps) {
  const formatDate = (startTime: string) => {
    const date = new Date(startTime);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (startTime: string) => {
    const date = new Date(startTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Use startTime or fallback to date
  const startTime =
    crawl.startTime ||
    (crawl.date
      ? new Date(crawl.date).toISOString()
      : new Date().toISOString());

  // Get bars to display (use provided bars or generate some)
  const displayBars = crawl.bars?.slice(0, 4) || ["1", "2", "3"];
  const barCount = crawl.bars?.length || 3;

  // Get attendees to display
  const displayAttendees = crawl.attendees?.slice(0, 5) || [
    "1",
    "2",
    "3",
    "4",
    "5",
  ];

  // Format participant count if available from API
  const participantText =
    crawl.currentParticipants && crawl.maxParticipants
      ? `${crawl.currentParticipants}/${crawl.maxParticipants} participants`
      : `${barCount} bars`;

  return (
    <Card href={`/app/crawls/${crawl.id}`}>
      <Header>
        <div>
          <CrawlName>{crawl.name}</CrawlName>
          <DateRow>
            <Calendar size={12} />
            {formatDate(startTime)} · {formatTime(startTime)}
          </DateRow>
        </div>
      </Header>
      <BarThumbs>
        {displayBars.map((barId, i) => (
          <BarThumb
            key={i}
            src={
              barImages[barId] ||
              DEFAULT_BAR_IMAGES[i % DEFAULT_BAR_IMAGES.length]
            }
            alt={`Bar ${i + 1}`}
          />
        ))}
        {barCount > 4 && <Overflow>+{barCount - 4}</Overflow>}
      </BarThumbs>
      <Footer>
        <Attendees>
          {displayAttendees.map((userId, i) => (
            <Avatar
              key={i}
              src={
                attendeeAvatars[userId] ||
                DEFAULT_AVATARS[i % DEFAULT_AVATARS.length]
              }
              alt={`Attendee ${i + 1}`}
            />
          ))}
        </Attendees>
        <Meta>
          <MapPin size={12} />
          {crawl.distance || participantText}
        </Meta>
      </Footer>
    </Card>
  );
}
