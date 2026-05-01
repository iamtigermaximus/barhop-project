"use client";

import styled from "styled-components";
import Link from "next/link";
import { Star, MapPin } from "phosphor-react";

// Make cards more touch-friendly on mobile
const Card = styled(Link)<{ $variant?: "compact" | "full" }>`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  width: ${({ $variant }) => ($variant === "compact" ? "160px" : "100%")};
  flex-shrink: 0;
  margin-bottom: 0;
  text-decoration: none;
  cursor: pointer;

  @media (min-width: 768px) {
    width: ${({ $variant }) => ($variant === "compact" ? "192px" : "100%")};
    margin-bottom: ${({ $variant }) => ($variant === "compact" ? 0 : "16px")};
  }

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const ImageWrapper = styled.div<{ $variant?: "compact" | "full" }>`
  position: relative;
  height: ${({ $variant }) => ($variant === "compact" ? "128px" : "192px")};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RatingBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingText = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 12px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Content = styled.div`
  padding: 12px;
`;

const BarName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: bold;
  font-family: ${({ theme }) =>
    theme.fonts.dm}; /* Changed from heading to dm */
  margin-bottom: 4px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const PriceRange = styled.span`
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: bold;
`;

const GenreTags = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const GenreTag = styled.span`
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const Distance = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// Support both mock data and real API data
interface BarCardProps {
  bar: {
    id: string;
    name: string;
    rating?: string;
    priceRange?: string;
    genres?: string[];
    images?: string[];
    distance?: string;
    // Support real API data too
    coverImage?: string | null;
    imageUrl?: string | null;
    logoUrl?: string | null;
    type?: string;
    district?: string | null;
    cityName?: string | null;
  };
  variant?: "compact" | "full";
}

export default function BarCard({ bar, variant = "full" }: BarCardProps) {
  // Handle both mock data format and API data format
  const getImageUrl = () => {
    if (bar.images?.[0]) return bar.images[0];
    if (bar.coverImage) return bar.coverImage;
    if (bar.imageUrl) return bar.imageUrl;
    if (bar.logoUrl) return bar.logoUrl;
    // Fallback placeholder based on type
    return `https://via.placeholder.com/400x200?text=${encodeURIComponent(bar.name)}`;
  };

  const getRating = () => {
    if (bar.rating) return bar.rating;
    // Generate a reasonable rating for API data
    return "4.2";
  };

  const getPriceRange = () => {
    if (bar.priceRange) return bar.priceRange;
    // Map type to price range for API data
    const priceMap: { [key: string]: string } = {
      PUB: "$$",
      CLUB: "$$$",
      LOUNGE: "$$$",
      COCKTAIL_BAR: "$$$",
      RESTAURANT_BAR: "$$",
      SPORTS_BAR: "$$",
      KARAOKE: "$$",
      LIVE_MUSIC: "$$",
    };
    return bar.type ? priceMap[bar.type] || "$$" : "$$";
  };

  const getGenres = () => {
    if (bar.genres && bar.genres.length > 0) return bar.genres;
    // Map type to genres for API data
    const genreMap: { [key: string]: string[] } = {
      PUB: ["Pub", "Beer"],
      CLUB: ["Club", "Dance"],
      LOUNGE: ["Lounge", "Cocktails"],
      COCKTAIL_BAR: ["Cocktails", "Mixology"],
      RESTAURANT_BAR: ["Dining", "Wine"],
      SPORTS_BAR: ["Sports", "Beer"],
      KARAOKE: ["Karaoke", "Entertainment"],
      LIVE_MUSIC: ["Live Music", "Concerts"],
    };
    return bar.type
      ? genreMap[bar.type] || ["Bar", "Drinks"]
      : ["Bar", "Drinks"];
  };

  const getDistance = () => {
    if (bar.distance) return bar.distance;
    if (bar.distance === undefined && bar.district) {
      return `${bar.district}`;
    }
    return undefined;
  };

  const getLocation = () => {
    if (bar.district && bar.cityName) {
      return `${bar.district} • ${bar.cityName}`;
    }
    if (bar.district) return bar.district;
    if (bar.cityName) return bar.cityName;
    return undefined;
  };

  return (
    <Card href={`/app/bars/${bar.id}`} $variant={variant}>
      <ImageWrapper $variant={variant}>
        <Image src={getImageUrl()} alt={bar.name} />
        <RatingBadge>
          <Star size={12} weight="fill" color="#FF6B35" />
          <RatingText>{getRating()}</RatingText>
        </RatingBadge>
      </ImageWrapper>
      <Content>
        <BarName>{bar.name}</BarName>
        <MetaRow>
          <PriceRange>{getPriceRange()}</PriceRange>
          <GenreTags>
            {getGenres()
              .slice(0, 2)
              .map((g, i) => (
                <GenreTag key={i}>{g}</GenreTag>
              ))}
          </GenreTags>
        </MetaRow>
        {(getDistance() || getLocation()) && (
          <Distance>
            <MapPin size={12} />
            {getDistance() || getLocation()}
          </Distance>
        )}
      </Content>
    </Card>
  );
}
