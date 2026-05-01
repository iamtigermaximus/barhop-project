// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams } from "next/navigation";
// import styled from "styled-components";
// import Link from "next/link";
// import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";

// // Styled Components (keep all your existing styled components)
// export const Page = styled.div`
//   padding: 2rem 1rem 10rem;
//   margin: 0 auto;
//   background-size: 400% 400%;
//   animation: gradientShift 12s ease infinite;
//   min-height: calc(100vh - 70px);
//   width: 100%;

//   @media (max-width: 768px) {
//     padding: 1rem 0.5rem 10rem;
//   }
// `;

// export const Title = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin-bottom: 1rem;
//   text-align: center;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
//   background-size: 400% 400%;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
//   animation: gradientShift 8s ease infinite;

//   @media (max-width: 768px) {
//     font-size: 2rem;
//     margin-bottom: 0.75rem;
//   }
// `;

// export const Description = styled.p`
//   font-size: 1.2rem;
//   color: #e2e8f0;
//   text-align: center;
//   margin-bottom: 3rem;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;

//   @media (max-width: 768px) {
//     font-size: 1rem;
//     margin-bottom: 1.5rem;
//     padding: 0 0.5rem;
//   }
// `;

// export const ControlsContainer = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-bottom: 2rem;
//   flex-wrap: wrap;
//   justify-content: center;
//   align-items: center;

//   @media (max-width: 768px) {
//     gap: 0.75rem;
//     margin-bottom: 0.75rem;
//     padding: 0 0.5rem;
//   }
// `;

// export const FilterSelect = styled.select`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   padding: 0.5rem 1rem;
//   color: #e2e8f0;
//   font-size: 0.9rem;
//   backdrop-filter: blur(10px);
//   cursor: pointer;
//   transition: all 0.3s ease;
//   min-width: 140px;
//   flex: 1;
//   max-width: 200px;

//   &:hover {
//     border-color: rgba(139, 92, 246, 0.5);
//   }

//   &:focus {
//     outline: none;
//     border-color: rgba(139, 92, 246, 0.7);
//     box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
//   }

//   option {
//     background: rgb(30, 41, 59);
//     color: #e2e8f0;
//   }

//   @media (max-width: 768px) {
//     min-width: 100px;
//     max-width: 120px;
//     padding: 0.4rem 0.6rem;
//     font-size: 0.8rem;
//     flex: 0 1 calc(50% - 0.5rem);
//   }
// `;

// export const FilterCheckbox = styled.label`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   color: #e2e8f0;
//   font-size: 0.9rem;
//   cursor: pointer;
//   padding: 0.5rem 1rem;
//   border-radius: 8px;
//   transition: all 0.3s ease;
//   backdrop-filter: blur(10px);
//   white-space: nowrap;
//   flex: 0 0 auto;

//   &:hover {
//     border-color: rgba(139, 92, 246, 0.5);
//   }

//   input[type="checkbox"] {
//     accent-color: #8b5cf6;
//     transform: scale(0.9);
//   }

//   @media (max-width: 768px) {
//     padding: 0.5rem 0.75rem;
//     font-size: 0.85rem;
//     flex: 0 1 100%;
//     justify-content: center;
//     order: 3;
//     margin-top: 0.25rem;
//   }
// `;

// export const MobileFiltersRow = styled.div`
//   display: flex;
//   gap: 1rem;

//   @media (max-width: 768px) {
//     display: flex;
//     gap: 1rem;
//     width: 100%;
//     justify-content: center;
//     flex-wrap: wrap;
//   }
// `;

// export const BarsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 2rem;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     gap: 1.5rem;
//     padding: 0 0.5rem;
//   }
// `;

// export const BarCard = styled(Link)`
//   background: rgba(30, 41, 59, 0.7);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 1.5rem;
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   transition: all 0.3s ease;
//   text-decoration: none;
//   display: block;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
//     border-color: rgba(139, 92, 246, 0.4);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(139, 92, 246, 0.1),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }

//   @media (max-width: 768px) {
//     padding: 1.25rem;
//     margin: 0 0.25rem;
//   }
// `;

// export const BarName = styled.h3`
//   font-size: 1.5rem;
//   color: #f8fafc;
//   margin-bottom: 0.5rem;
//   font-weight: 600;

//   @media (max-width: 768px) {
//     font-size: 1.25rem;
//   }
// `;

// export const BarDescription = styled.p`
//   color: #e2e8f0;
//   margin-bottom: 1rem;
//   line-height: 1.5;

//   @media (max-width: 480px) {
//     font-size: 0.9rem;
//     margin-bottom: 0.75rem;
//   }
// `;

// export const BarDetails = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   margin-bottom: 1rem;
//   flex-wrap: wrap;

//   @media (max-width: 480px) {
//     gap: 0.25rem;
//     margin-bottom: 0.75rem;
//   }
// `;

// export const DetailTag = styled.span`
//   background: rgba(51, 65, 85, 0.6);
//   color: #e2e8f0;
//   padding: 0.25rem 0.75rem;
//   border-radius: 6px;
//   font-size: 0.875rem;
//   backdrop-filter: blur(10px);

//   @media (max-width: 480px) {
//     padding: 0.2rem 0.5rem;
//     font-size: 0.8rem;
//   }
// `;

// export const VIPBadge = styled(DetailTag)`
//   background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc);
//   color: white;
//   font-weight: 700;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
// `;

// export const Address = styled.p`
//   color: #94a3b8;
//   font-size: 0.875rem;

//   @media (max-width: 480px) {
//     font-size: 0.8rem;
//   }
// `;

// export const LoadingState = styled.div`
//   text-align: center;
//   padding: 4rem;
//   color: #e2e8f0;
//   font-size: 1.2rem;
// `;

// export const ErrorState = styled.div`
//   text-align: center;
//   padding: 4rem;
//   color: #ef4444;
//   font-size: 1.2rem;
// `;

// export const StatusBadge = styled.span<{ $isOpen: boolean }>`
//   padding: 0.25rem 0.5rem;
//   border-radius: 12px;
//   font-size: 0.7rem;
//   font-weight: 600;
//   background: ${(props) =>
//     props.$isOpen ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
//   color: ${(props) => (props.$isOpen ? "#22c55e" : "#ef4444")};
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
// `;

// export const DistanceBadge = styled.span`
//   background: rgba(14, 165, 233, 0.2);
//   color: #0ea5e9;
//   padding: 0.25rem 0.75rem;
//   border-radius: 12px;
//   font-size: 0.75rem;
//   font-weight: 600;
//   border: 1px solid rgba(14, 165, 233, 0.3);
// `;

// export const OperatingHours = styled.div`
//   color: #94a3b8;
//   font-size: 0.8rem;
//   margin-bottom: 0.75rem;
//   padding: 0.5rem;
//   background: rgba(30, 41, 59, 0.5);
//   border-radius: 6px;
//   border-left: 3px solid #475569;

//   @media (max-width: 480px) {
//     font-size: 0.75rem;
//     padding: 0.4rem;
//     margin-bottom: 0.5rem;
//   }
// `;

// export const ResultsCount = styled.div`
//   text-align: center;
//   color: #94a3b8;
//   margin-bottom: 1.5rem;
//   font-size: 0.9rem;
//   padding: 0 0.5rem;

//   @media (max-width: 768px) {
//     margin-bottom: 1rem;
//     font-size: 0.85rem;
//   }
// `;

// const LoadMoreButton = styled.button`
//   display: block;
//   margin: 2rem auto 0;
//   padding: 0.75rem 2rem;
//   background: linear-gradient(45deg, #8b5cf6, #3b82f6);
//   color: white;
//   border: none;
//   border-radius: 12px;
//   font-weight: 600;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//     transform: none;
//   }
// `;

// interface Bar {
//   id: string;
//   name: string;
//   description: string | null;
//   district: string | null;
//   type: string;
//   vipEnabled: boolean;
//   vipPrice: number | null;
//   address: string;
//   cityName: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   operatingHours?: {
//     [key: string]: { open: string; close: string };
//   };
//   distance?: number;
//   isOpen?: boolean;
// }

// type SortOption = "distance" | "name" | "open";

// const formatDistance = (distance: number): string => {
//   if (distance < 1) return `${Math.round(distance * 1000)}m`;
//   return `${distance.toFixed(1)}km`;
// };

// const getTodaysHours = (
//   operatingHours:
//     | { [key: string]: { open: string; close: string } }
//     | undefined,
// ): { open: string; close: string } | undefined => {
//   const today = new Date().toLocaleString("en-us", { weekday: "long" });
//   return operatingHours?.[today];
// };

// const calculateIsOpen = (
//   operatingHours:
//     | { [key: string]: { open: string; close: string } }
//     | undefined,
// ): boolean => {
//   if (!operatingHours) return false;

//   const today = new Date().toLocaleString("en-us", { weekday: "long" });
//   const todaysHours = operatingHours[today];

//   if (!todaysHours) return false;

//   const now = new Date();
//   const currentTime = now.toTimeString().slice(0, 5);
//   const openTime = todaysHours.open;
//   const closeTime = todaysHours.close;

//   if (closeTime < openTime) {
//     return currentTime >= openTime;
//   } else {
//     return currentTime >= openTime && currentTime <= closeTime;
//   }
// };

// export default function Bars() {
//   const searchParams = useSearchParams();
//   const categoryFromUrl = searchParams.get("type");

//   const [bars, setBars] = useState<Bar[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationLoaded, setLocationLoaded] = useState(false);

//   const [sortBy, setSortBy] = useState<SortOption>("distance");
//   const [filters, setFilters] = useState({
//     showOpenOnly: false,
//     city: "",
//     type: "",
//   });

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalBars, setTotalBars] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   // Apply category from URL when component mounts
//   useEffect(() => {
//     if (categoryFromUrl) {
//       // Convert "karaoke" to "KARAOKE" (uppercase to match enum)
//       const typeValue = categoryFromUrl.toUpperCase();
//       setFilters((prev) => ({ ...prev, type: typeValue }));
//       console.log("🎯 Filtering by category from URL:", typeValue);
//     }
//   }, [categoryFromUrl]);

//   // Get unique cities and types from loaded bars
//   const cities = [
//     ...new Set(bars.map((bar) => bar.cityName).filter(Boolean)),
//   ].sort() as string[];
//   const types = [
//     ...new Set(bars.map((bar) => bar.type.replace(/_/g, " "))),
//   ].sort();

//   // Apply open status filter locally
//   const filteredAndSortedBars = bars
//     .filter((bar) => {
//       if (filters.showOpenOnly && !bar.isOpen) return false;
//       return true;
//     })
//     .sort((a, b) => {
//       if (sortBy === "open") {
//         if (a.isOpen && !b.isOpen) return -1;
//         if (!a.isOpen && b.isOpen) return 1;
//         return a.name.localeCompare(b.name);
//       }
//       return 0;
//     });

//   // Get user location on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log(
//             "📍 Location obtained:",
//             position.coords.latitude,
//             position.coords.longitude,
//           );
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           setLocationLoaded(true);
//         },
//         () => {
//           console.log("📍 Location denied");
//           setLocationLoaded(true);
//         },
//       );
//     } else {
//       setLocationLoaded(true);
//     }
//   }, []);

//   // Fetch bars when location and filters are ready
//   useEffect(() => {
//     if (locationLoaded) {
//       fetchBars(1, false);
//     }
//   }, [locationLoaded, sortBy, filters.city, filters.type]);

//   const fetchBars = async (
//     currentPage: number = 1,
//     isLoadMore: boolean = false,
//   ) => {
//     try {
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       let url = `/api/bars?isActive=true&page=${currentPage}&limit=20`;

//       // Add user location for distance calculation
//       if (userLocation) {
//         url += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}`;
//       }

//       // Only add sortBy if not "distance" (since API defaults to distance)
//       if (sortBy !== "distance") {
//         url += `&sortBy=${sortBy}`;
//       }

//       // Add filters
//       if (filters.city) {
//         url += `&cityName=${encodeURIComponent(filters.city)}`;
//       }
//       if (filters.type) {
//         const typeEnum = filters.type.toUpperCase().replace(/ /g, "_");
//         url += `&barTypes=${typeEnum}`;
//         console.log("🎯 Applying type filter:", typeEnum);
//       }

//       console.log("📡 Fetching bars:", url);
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch bars: ${response.status}`);
//       }

//       const result = await response.json();
//       const barsArray = result.data || result.bars || result;
//       const pagination = result.pagination;

//       // Calculate open status for each bar
//       const enhancedBars = barsArray.map((bar: Bar) => ({
//         ...bar,
//         isOpen: calculateIsOpen(bar.operatingHours),
//       }));

//       if (isLoadMore) {
//         setBars((prev) => [...prev, ...enhancedBars]);
//       } else {
//         setBars(enhancedBars);
//       }

//       if (pagination) {
//         setTotalPages(pagination.totalPages);
//         setTotalBars(pagination.totalCount);
//         setHasMore(pagination.hasNextPage);
//         setPage(currentPage);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while fetching bars",
//       );
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   const loadMore = () => {
//     if (hasMore && !loadingMore && page < totalPages) {
//       fetchBars(page + 1, true);
//     }
//   };

//   // Add inline style to body
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       @keyframes gradientShift {
//         0% { background-position: 0% 50%; }
//         50% { background-position: 100% 50%; }
//         100% { background-position: 0% 50%; }
//       }
//     `;
//     document.head.appendChild(style);

//     document.body.style.background =
//       "linear-gradient(-45deg, rgb(9, 9, 11), rgb(15, 23, 42), rgb(9, 9, 11), rgb(15, 23, 42))";
//     document.body.style.backgroundSize = "400% 400%";
//     document.body.style.animation = "gradientShift 12s ease infinite";

//     return () => {
//       document.body.style.background = "";
//       document.body.style.backgroundSize = "";
//       document.body.style.animation = "";
//       document.head.removeChild(style);
//     };
//   }, []);

//   if (loading && bars.length === 0) {
//     return (
//       <Page>
//         <Title>Explore All Bars</Title>
//         <HopprLoader />
//       </Page>
//     );
//   }

//   if (error) {
//     return (
//       <Page>
//         <Title>Explore All Bars</Title>
//         <ErrorState>Error: {error}</ErrorState>
//       </Page>
//     );
//   }

//   // Show category filter description
//   const categoryName = filters.type ? filters.type.replace(/_/g, " ") : "";

//   return (
//     <Page>
//       <Title>Explore All Bars</Title>
//       <Description>
//         {categoryName
//           ? `Showing ${categoryName} bars`
//           : `Discover ${totalBars} bars across Finland`}
//       </Description>

//       <ControlsContainer>
//         <MobileFiltersRow>
//           <FilterSelect
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value as SortOption)}
//           >
//             <option value="distance">
//               📍 Sort by Distance (Nearest First)
//             </option>
//             <option value="name">📝 Sort by Name</option>
//             <option value="open">🟢 Sort by Open First</option>
//           </FilterSelect>

//           <FilterSelect
//             value={filters.city}
//             onChange={(e) =>
//               setFilters((prev) => ({ ...prev, city: e.target.value }))
//             }
//           >
//             <option value="">All Cities</option>
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </FilterSelect>

//           <FilterSelect
//             value={filters.type}
//             onChange={(e) =>
//               setFilters((prev) => ({ ...prev, type: e.target.value }))
//             }
//           >
//             <option value="">All Types</option>
//             {types.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </FilterSelect>
//         </MobileFiltersRow>

//         <FilterCheckbox>
//           <input
//             type="checkbox"
//             checked={filters.showOpenOnly}
//             onChange={(e) =>
//               setFilters((prev) => ({
//                 ...prev,
//                 showOpenOnly: e.target.checked,
//               }))
//             }
//           />
//           Show Open Only
//         </FilterCheckbox>
//       </ControlsContainer>

//       <ResultsCount>
//         Showing {filteredAndSortedBars.length} of {totalBars} bars
//         {categoryName && ` • ${categoryName}`}
//         {!userLocation &&
//           sortBy === "distance" &&
//           " • Enable location for nearest bars"}
//         {filters.showOpenOnly && " • Open now"}
//         {filters.city && ` • In ${filters.city}`}
//       </ResultsCount>

//       <BarsGrid>
//         {filteredAndSortedBars.map((bar) => {
//           const todaysHours = getTodaysHours(bar.operatingHours);

//           return (
//             <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 <BarName>{bar.name}</BarName>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "0.5rem",
//                     flexDirection: "column",
//                     alignItems: "flex-end",
//                   }}
//                 >
//                   {bar.distance !== undefined && bar.distance !== null && (
//                     <DistanceBadge>
//                       📍 {formatDistance(bar.distance)}
//                     </DistanceBadge>
//                   )}
//                   {bar.isOpen !== undefined && (
//                     <StatusBadge $isOpen={bar.isOpen}>
//                       {bar.isOpen ? "🟢 Open" : "🔴 Closed"}
//                     </StatusBadge>
//                   )}
//                 </div>
//               </div>

//               <BarDescription>
//                 {bar.description || "A great place to enjoy nightlife"}
//               </BarDescription>

//               {todaysHours && (
//                 <OperatingHours>
//                   <strong>Today:</strong> {todaysHours.open} -{" "}
//                   {todaysHours.close}
//                 </OperatingHours>
//               )}

//               <BarDetails>
//                 <DetailTag>{bar.cityName || "Helsinki"}</DetailTag>
//                 <DetailTag>{bar.district || "Central"}</DetailTag>
//                 <DetailTag>{bar.type.replace(/_/g, " ")}</DetailTag>
//                 {bar.vipEnabled && <VIPBadge>⭐ VIP Available</VIPBadge>}
//               </BarDetails>
//               <Address>{bar.address}</Address>
//             </BarCard>
//           );
//         })}
//       </BarsGrid>

//       {hasMore && !loading && bars.length > 0 && (
//         <LoadMoreButton onClick={loadMore} disabled={loadingMore}>
//           {loadingMore
//             ? "Loading more..."
//             : `Load More (${totalBars - bars.length} remaining)`}
//         </LoadMoreButton>
//       )}

//       {loadingMore && (
//         <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
//           Loading more bars...
//         </div>
//       )}

//       {!hasMore && bars.length > 0 && (
//         <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
//           You&apos;ve seen all {totalBars} bars 🎉
//         </div>
//       )}
//     </Page>
//   );
// }
"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";

// Styled Components with Theme
export const Page = styled.div`
  padding: 2rem 1rem 10rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.primaryBackground};
  min-height: calc(100vh - 70px);
  width: 100%;

  @media (min-width: 768px) {
    margin-left: 240px;
    padding: 2rem 2rem 8rem;
    width: calc(100% - 240px);
  }

  @media (max-width: 767px) {
    padding: 1rem 0.5rem 6rem;
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
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
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
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }
`;

export const FilterSelect = styled.select`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  flex: 1;
  max-width: 200px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  option {
    background: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    min-width: 100px;
    max-width: 120px;
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    flex: 0 1 calc(50% - 0.5rem);
  }
`;

export const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex: 0 0 auto;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    flex: 0 1 100%;
    justify-content: center;
    order: 3;
    margin-top: 0.25rem;
  }
`;

export const MobileFiltersRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const BarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
`;

export const BarCard = styled(Link)`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: ${({ theme }) => theme.colors.primaryAccent};
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
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const BarDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
`;

export const BarDetails = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
`;

export const DetailTag = styled.span`
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 480px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
  }
`;

export const VIPBadge = styled(DetailTag)`
  background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc);
  color: white;
  font-weight: 700;
  border: 1px solid rgba(139, 92, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export const Address = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textSecondary};
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
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const DistanceBadge = styled.span`
  background: rgba(14, 165, 233, 0.2);
  color: ${({ theme }) => theme.colors.secondaryAccent};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(14, 165, 233, 0.3);
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const OperatingHours = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 6px;
  border-left: 3px solid #475569;
  font-family: ${({ theme }) => theme.fonts.mono};

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.4rem;
    margin-bottom: 0.5rem;
  }
`;

export const ResultsCount = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  padding: 0 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 2rem;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface Bar {
  id: string;
  name: string;
  description: string | null;
  district: string | null;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  address: string;
  cityName: string | null;
  latitude: number | null;
  longitude: number | null;
  operatingHours?: { [key: string]: { open: string; close: string } };
  distance?: number;
  isOpen?: boolean;
}

type SortOption = "distance" | "name" | "open";

const formatDistance = (distance: number): string => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};

const getTodaysHours = (
  operatingHours:
    | { [key: string]: { open: string; close: string } }
    | undefined,
): { open: string; close: string } | undefined => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  return operatingHours?.[today];
};

const calculateIsOpen = (
  operatingHours:
    | { [key: string]: { open: string; close: string } }
    | undefined,
): boolean => {
  if (!operatingHours) return false;
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  const todaysHours = operatingHours[today];
  if (!todaysHours) return false;
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const openTime = todaysHours.open;
  const closeTime = todaysHours.close;
  if (closeTime < openTime) {
    return currentTime >= openTime;
  } else {
    return currentTime >= openTime && currentTime <= closeTime;
  }
};

export default function Bars() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("type");

  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [filters, setFilters] = useState({
    showOpenOnly: false,
    city: "",
    type: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBars, setTotalBars] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (categoryFromUrl) {
      const typeValue = categoryFromUrl.toUpperCase();
      setFilters((prev) => ({ ...prev, type: typeValue }));
    }
  }, [categoryFromUrl]);

  const cities = [
    ...new Set(bars.map((bar) => bar.cityName).filter(Boolean)),
  ].sort() as string[];
  const types = [
    ...new Set(bars.map((bar) => bar.type.replace(/_/g, " "))),
  ].sort();

  const filteredAndSortedBars = bars
    .filter((bar) => {
      if (filters.showOpenOnly && !bar.isOpen) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "open") {
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoaded(true);
        },
        () => setLocationLoaded(true),
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (locationLoaded) {
      fetchBars(1, false);
    }
  }, [locationLoaded, sortBy, filters.city, filters.type]);

  const fetchBars = async (
    currentPage: number = 1,
    isLoadMore: boolean = false,
  ) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      let url = `/api/bars?isActive=true&page=${currentPage}&limit=20`;
      if (userLocation)
        url += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}`;
      if (sortBy !== "distance") url += `&sortBy=${sortBy}`;
      if (filters.city) url += `&cityName=${encodeURIComponent(filters.city)}`;
      if (filters.type) {
        const typeEnum = filters.type.toUpperCase().replace(/ /g, "_");
        url += `&barTypes=${typeEnum}`;
      }

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch bars: ${response.status}`);

      const result = await response.json();
      const barsArray = result.data || result.bars || result;
      const pagination = result.pagination;

      const enhancedBars = barsArray.map((bar: Bar) => ({
        ...bar,
        isOpen: calculateIsOpen(bar.operatingHours),
      }));

      if (isLoadMore) setBars((prev) => [...prev, ...enhancedBars]);
      else setBars(enhancedBars);

      if (pagination) {
        setTotalPages(pagination.totalPages);
        setTotalBars(pagination.totalCount);
        setHasMore(pagination.hasNextPage);
        setPage(currentPage);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching bars",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore && page < totalPages) {
      fetchBars(page + 1, true);
    }
  };

  if (loading && bars.length === 0) {
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

  const categoryName = filters.type ? filters.type.replace(/_/g, " ") : "";

  return (
    <Page>
      <Title>Explore All Bars</Title>
      <Description>
        {categoryName
          ? `Showing ${categoryName} bars`
          : `Discover ${totalBars} bars across Finland`}
      </Description>

      <ControlsContainer>
        <MobileFiltersRow>
          <FilterSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="distance">
              📍 Sort by Distance (Nearest First)
            </option>
            <option value="name">📝 Sort by Name</option>
            <option value="open">🟢 Sort by Open First</option>
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
        </MobileFiltersRow>

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
        Showing {filteredAndSortedBars.length} of {totalBars} bars
        {categoryName && ` • ${categoryName}`}
        {!userLocation &&
          sortBy === "distance" &&
          " • Enable location for nearest bars"}
        {filters.showOpenOnly && " • Open now"}
        {filters.city && ` • In ${filters.city}`}
      </ResultsCount>

      <BarsGrid>
        {filteredAndSortedBars.map((bar) => {
          const todaysHours = getTodaysHours(bar.operatingHours);
          return (
            <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
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
                  {bar.distance !== undefined && bar.distance !== null && (
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
                <DetailTag>{bar.cityName || "Helsinki"}</DetailTag>
                <DetailTag>{bar.district || "Central"}</DetailTag>
                <DetailTag>{bar.type.replace(/_/g, " ")}</DetailTag>
                {bar.vipEnabled && <VIPBadge>⭐ VIP Available</VIPBadge>}
              </BarDetails>
              <Address>{bar.address}</Address>
            </BarCard>
          );
        })}
      </BarsGrid>

      {hasMore && !loading && bars.length > 0 && (
        <LoadMoreButton onClick={loadMore} disabled={loadingMore}>
          {loadingMore
            ? "Loading more..."
            : `Load More (${totalBars - bars.length} remaining)`}
        </LoadMoreButton>
      )}

      {loadingMore && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Loading more bars...
        </div>
      )}

      {!hasMore && bars.length > 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
          You&apos;ve seen all {totalBars} bars 🎉
        </div>
      )}
    </Page>
  );
}
