"use client";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { HopprLoader } from "../ui/Loader/HopprLoader";
import styled from "styled-components";
import Link from "next/link";

export const Page = styled.div`
  padding: 2rem 1rem;
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(15, 23, 42),
    rgb(9, 9, 11),
    rgb(15, 23, 42)
  );
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
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

export const Title = styled.h1`
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

export const Description = styled.p`
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

export const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: transparent !important;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const FilterSelect = styled.select`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.7);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  option {
    background: rgb(30, 41, 59);
    color: #e2e8f0;
  }
`;

export const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
  }

  input[type="checkbox"] {
    accent-color: #8b5cf6;
  }
`;

export const BarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  background-color: transparent !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const BarCard = styled(Link)`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BarName = styled.h3`
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const BarDescription = styled.p`
  color: #e2e8f0;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

export const BarDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const DetailTag = styled.span`
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
`;

export const VIPBadge = styled(DetailTag)`
  background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc);
  color: white;
  font-weight: 700;
  border: 1px solid rgba(139, 92, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export const Address = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #e2e8f0;
  font-size: 1.2rem;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #ef4444;
  font-size: 1.2rem;
`;

export const StatusBadge = styled.span<{ $isOpen: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.$isOpen ? "#22c55e" : "#ef4444")};
  border: 1px solid;
  border-color: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
`;

export const DistanceBadge = styled.span`
  background: rgba(14, 165, 233, 0.2);
  color: #0ea5e9;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(14, 165, 233, 0.3);
`;

export const OperatingHours = styled.div`
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 6px;
  border-left: 3px solid #475569;
`;

export const ResultsCount = styled.div`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  background-color: transparent !important;
`;

interface Bar {
  id: string;
  name: string;
  description: string | null;
  district: string;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  address: string;
  city: {
    name: string;
  };
  latitude: number;
  longitude: number;
  operatingHours?: {
    [key: string]: { open: string; close: string };
  };
  // Calculated fields
  distance?: number;
  isOpen?: boolean;
}

type SortOption = "distance" | "name" | "open";

const formatDistance = (distance: number): string => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};

const getTodaysHours = (
  operatingHours: { [key: string]: { open: string; close: string } } | undefined
): { open: string; close: string } | undefined => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  return operatingHours?.[today];
};

// Helper function to calculate if bar is currently open
const calculateIsOpen = (
  operatingHours: { [key: string]: { open: string; close: string } } | undefined
): boolean => {
  if (!operatingHours) return false;

  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const todaysHours = operatingHours[today];

  if (!todaysHours) return false;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format

  // Handle closing times after midnight (like "04:00")
  const openTime = todaysHours.open;
  const closeTime = todaysHours.close;

  // If close time is before open time (e.g., open at 22:00, close at 04:00), it spans midnight
  if (closeTime < openTime) {
    // If current time is after open time, it's open
    return currentTime >= openTime;
  } else {
    // Normal case: both times on the same day
    return currentTime >= openTime && currentTime <= closeTime;
  }
};

// Helper function to calculate distance between coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default function Bars() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Filter and sort state
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filters, setFilters] = useState({
    showOpenOnly: false,
    city: "",
    type: "",
  });

  // Get unique cities and types for filter dropdowns
  const cities = [...new Set(bars.map((bar) => bar.city.name))].sort();
  const types = [
    ...new Set(bars.map((bar) => bar.type.replace(/_/g, " "))),
  ].sort();

  // Apply sorting and filtering
  const sortedAndFilteredBars = bars
    .filter((bar) => {
      // Filter by open status
      if (filters.showOpenOnly && !bar.isOpen) return false;

      // Filter by city
      if (filters.city && bar.city.name !== filters.city) return false;

      // Filter by type
      if (filters.type && bar.type.replace(/_/g, " ") !== filters.type)
        return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          // Sort by distance (nearest first), bars without distance go last
          if (!a.distance && !b.distance) return 0;
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;

        case "open":
          // Sort by open status (open first), then by name
          if (a.isOpen && !b.isOpen) return -1;
          if (!a.isOpen && b.isOpen) return 1;
          return a.name.localeCompare(b.name);

        case "name":
        default:
          // Sort alphabetically by name
          return a.name.localeCompare(b.name);
      }
    });

  useEffect(() => {
    // Fetch bars function - defined inside useEffect to avoid dependency issues
    const fetchBars = async (location: typeof userLocation) => {
      try {
        setLoading(true);
        const response = await fetch("/api/bars");

        if (!response.ok) {
          throw new Error(`Failed to fetch bars: ${response.status}`);
        }

        const barsData: Bar[] = await response.json();

        // Enhance bars with calculated fields
        const enhancedBars = barsData.map((bar) => ({
          ...bar,
          isOpen: calculateIsOpen(bar.operatingHours),
          distance: location
            ? calculateDistance(
                location.latitude,
                location.longitude,
                bar.latitude,
                bar.longitude
              )
            : undefined,
        }));

        setBars(enhancedBars);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching bars"
        );
      } finally {
        setLoading(false);
      }
    };

    // Get user location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          // Fetch bars AFTER we have location
          fetchBars(location);
        },
        () => {
          console.log(
            "Location access denied, proceeding without distance calculation"
          );
          // Fetch bars without location
          fetchBars(null);
        }
      );
    } else {
      // Browser doesn't support geolocation, fetch without location
      fetchBars(null);
    }
  }, []); // ✅ EMPTY dependency array - runs only once

  // Add inline style to body to ensure gradient background
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(-45deg, rgb(9, 9, 11), rgb(15, 23, 42), rgb(9, 9, 11), rgb(15, 23, 42))";
    document.body.style.backgroundSize = "400% 400%";
    document.body.style.animation = "gradientShift 12s ease infinite";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.animation = "";
    };
  }, []);

  if (loading) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        <HopprLoader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        <ErrorState>Error: {error}</ErrorState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Explore All Bars</Title>
      <Description>Discover {bars.length} bars across Finland</Description>

      {/* Filter and Sort Controls */}
      <ControlsContainer>
        <FilterSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="name">Sort by Name</option>
          <option value="distance">Sort by Distance</option>
          <option value="open">Sort by Open First</option>
        </FilterSelect>

        <FilterSelect
          value={filters.city}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, city: e.target.value }))
          }
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </FilterSelect>

        <FilterCheckbox>
          <input
            type="checkbox"
            checked={filters.showOpenOnly}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                showOpenOnly: e.target.checked,
              }))
            }
          />
          Show Open Only
        </FilterCheckbox>
      </ControlsContainer>

      <ResultsCount>
        Showing {sortedAndFilteredBars.length} of {bars.length} bars
        {filters.showOpenOnly && " • Open now"}
        {filters.city && ` • In ${filters.city}`}
        {filters.type && ` • ${filters.type}`}
      </ResultsCount>

      <BarsGrid>
        {sortedAndFilteredBars.map((bar) => {
          const todaysHours = getTodaysHours(bar.operatingHours);

          return (
            <BarCard key={bar.id} href={`/bars/${bar.id}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <BarName>{bar.name}</BarName>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {bar.distance && (
                    <DistanceBadge>
                      📍 {formatDistance(bar.distance)}
                    </DistanceBadge>
                  )}
                  {bar.isOpen !== undefined && (
                    <StatusBadge $isOpen={bar.isOpen}>
                      {bar.isOpen ? "🟢 Open" : "🔴 Closed"}
                    </StatusBadge>
                  )}
                </div>
              </div>

              <BarDescription>
                {bar.description || "A great place to enjoy nightlife"}
              </BarDescription>

              {todaysHours && (
                <OperatingHours>
                  <strong>Today:</strong> {todaysHours.open} -{" "}
                  {todaysHours.close}
                </OperatingHours>
              )}

              <BarDetails>
                <DetailTag>{bar.city.name}</DetailTag>
                <DetailTag>{bar.district}</DetailTag>
                <DetailTag>{bar.type.replace(/_/g, " ")}</DetailTag>
                {bar.vipEnabled && bar.vipPrice && (
                  <VIPBadge>VIP: €{bar.vipPrice}</VIPBadge>
                )}
              </BarDetails>
              <Address>{bar.address}</Address>
            </BarCard>
          );
        })}
      </BarsGrid>
    </Page>
  );
}
