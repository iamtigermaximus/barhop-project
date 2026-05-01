// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import styled from "styled-components";

// // Styled Components
// const MarketplaceContainer = styled.div`
//   padding: 1rem 1rem 10rem;
//   min-height: 100vh;
//   color: #e2e8f0;
//   max-width: 1200px;
//   margin: 0 auto;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: 800;
//   margin-bottom: 0.5rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;

//   @media (max-width: 768px) {
//     font-size: 1.75rem;
//   }
// `;

// const Subtitle = styled.p`
//   color: #94a3b8;
//   font-size: 1.1rem;
//   padding-bottom: 1rem;

//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;

// const HeaderSection = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background-color: transparent !important;
// `;

// const PassGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//   gap: 1.5rem;
//   margin-top: 2rem;
//   background-color: transparent !important;
// `;

// const PassCard = styled.div<{ $isSoldOut: boolean; $isNearby?: boolean }>`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid
//     ${(props) =>
//       props.$isSoldOut
//         ? "rgba(239, 68, 68, 0.3)"
//         : props.$isNearby
//         ? "rgba(16, 185, 129, 0.5)"
//         : "rgba(139, 92, 246, 0.3)"};
//   border-radius: 16px;
//   padding: 1.5rem;
//   cursor: ${(props) => (props.$isSoldOut ? "not-allowed" : "pointer")};
//   transition: all 0.3s ease;
//   position: relative;
//   opacity: ${(props) => (props.$isSoldOut ? 0.7 : 1)};
//   ${(props) =>
//     props.$isNearby &&
//     `
//     box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
//   `}

//   &:hover {
//     border-color: ${(props) =>
//       props.$isSoldOut
//         ? "rgba(239, 68, 68, 0.5)"
//         : props.$isNearby
//         ? "rgba(16, 185, 129, 0.8)"
//         : "#8b5cf6"};
//     transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-4px)")};
//     box-shadow: ${(props) =>
//       props.$isSoldOut
//         ? "none"
//         : props.$isNearby
//         ? "0 12px 30px rgba(16, 185, 129, 0.4)"
//         : "0 12px 30px rgba(139, 92, 246, 0.3)"};
//   }
// `;

// const PriceSection = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 1rem;
// `;

// const CurrentPrice = styled.div`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 1.4rem;
//   display: inline-block;
// `;

// const OriginalPrice = styled.div`
//   color: #94a3b8;
//   text-decoration: line-through;
//   font-size: 1.1rem;
//   font-weight: 600;
// `;

// const AvailabilityBadge = styled.div<{ $available: number }>`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: ${(props) =>
//     props.$available > 10
//       ? "rgba(16, 185, 129, 0.2)"
//       : props.$available > 0
//       ? "rgba(245, 158, 11, 0.2)"
//       : "rgba(239, 68, 68, 0.2)"};
//   color: ${(props) =>
//     props.$available > 10
//       ? "#10b981"
//       : props.$available > 0
//       ? "#f59e0b"
//       : "#ef4444"};
//   padding: 0.5rem 1rem;
//   border-radius: 12px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$available > 10
//       ? "rgba(16, 185, 129, 0.3)"
//       : props.$available > 0
//       ? "rgba(245, 158, 11, 0.3)"
//       : "rgba(239, 68, 68, 0.3)"};
// `;

// const DistanceBadge = styled.div<{ $distance: number }>`
//   position: absolute;
//   top: 1rem;
//   left: 1rem;
//   background: ${(props) =>
//     props.$distance < 1
//       ? "rgba(16, 185, 129, 0.2)"
//       : props.$distance < 3
//       ? "rgba(245, 158, 11, 0.2)"
//       : "rgba(139, 92, 246, 0.2)"};
//   color: ${(props) =>
//     props.$distance < 1
//       ? "#10b981"
//       : props.$distance < 3
//       ? "#f59e0b"
//       : "#8b5cf6"};
//   padding: 0.5rem 0.75rem;
//   border-radius: 12px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$distance < 1
//       ? "rgba(16, 185, 129, 0.3)"
//       : props.$distance < 3
//       ? "rgba(245, 158, 11, 0.3)"
//       : "rgba(139, 92, 246, 0.3)"};
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
// `;

// const FeatureBadges = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   margin: 1rem 0;
// `;

// const FeatureBadge = styled.div<{
//   $type: "primary" | "success" | "warning" | "info";
// }>`
//   background: ${(props) =>
//     props.$type === "primary"
//       ? "rgba(139, 92, 246, 0.2)"
//       : props.$type === "success"
//       ? "rgba(16, 185, 129, 0.2)"
//       : props.$type === "warning"
//       ? "rgba(245, 158, 11, 0.2)"
//       : "rgba(14, 165, 233, 0.2)"};
//   color: ${(props) =>
//     props.$type === "primary"
//       ? "#8b5cf6"
//       : props.$type === "success"
//       ? "#10b981"
//       : props.$type === "warning"
//       ? "#f59e0b"
//       : "#0ea5e9"};
//   padding: 0.4rem 0.8rem;
//   border-radius: 8px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$type === "primary"
//       ? "rgba(139, 92, 246, 0.3)"
//       : props.$type === "success"
//       ? "rgba(16, 185, 129, 0.3)"
//       : props.$type === "warning"
//       ? "rgba(245, 158, 11, 0.3)"
//       : "rgba(14, 165, 233, 0.3)"};
// `;

// const BarInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 1rem;
//   padding: 1rem;
//   background: rgba(15, 23, 42, 0.6);
//   border-radius: 12px;
//   border: 1px solid rgba(255, 255, 255, 0.1);
// `;

// const BarImage = styled.img`
//   width: 60px;
//   height: 60px;
//   border-radius: 8px;
//   object-fit: cover;
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
// `;

// const BarDetails = styled.div`
//   flex: 1;
// `;

// const ProgressBar = styled.div<{ $percentage: number }>`
//   width: 100%;
//   height: 6px;
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 3px;
//   margin: 1rem 0;
//   overflow: hidden;

//   &::after {
//     content: "";
//     display: block;
//     height: 100%;
//     width: ${(props) => props.$percentage}%;
//     background: ${(props) =>
//       props.$percentage < 50
//         ? "linear-gradient(90deg, #10b981, #0ea5e9)"
//         : props.$percentage < 80
//         ? "linear-gradient(90deg, #f59e0b, #f97316)"
//         : "linear-gradient(90deg, #ef4444, #dc2626)"};
//     transition: width 0.3s ease;
//   }
// `;

// const PurchaseButton = styled.button<{ $isSoldOut: boolean }>`
//   background: ${(props) =>
//     props.$isSoldOut
//       ? "rgba(107, 114, 128, 0.5)"
//       : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
//   border: none;
//   color: white;
//   padding: 1rem 2rem;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 1.1rem;
//   cursor: ${(props) => (props.$isSoldOut ? "not-allowed" : "pointer")};
//   width: 100%;
//   opacity: ${(props) => (props.$isSoldOut ? 0.6 : 1)};
//   transition: all 0.3s ease;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-2px)")};
//     box-shadow: ${(props) =>
//       props.$isSoldOut ? "none" : "0 8px 20px rgba(139, 92, 246, 0.4)"};
//   }
// `;

// const FilterSection = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 2rem;
//   gap: 1rem;
//   background-color: transparent !important;

//   @media (max-width: 768px) {
//     flex-direction: row;
//     flex-wrap: wrap;
//     justify-content: flex-start;
//     margin-bottom: 1rem;
//   }
// `;

// const CityFilter = styled.div`
//   display: flex;
//   gap: 1rem;
//   align-items: center;
//   flex-wrap: nowrap;
//   font-size: 0.9rem;
// `;

// const CityDropdown = styled.select`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: #e2e8f0;
//   padding: 0.75rem 1rem;
//   border-radius: 10px;
//   cursor: pointer;
//   font-weight: 600;
//   min-width: 200px;

//   @media (max-width: 768px) {
//     min-width: 150px;
//     flex: 1;
//   }

//   &:focus {
//     outline: none;
//     border-color: #8b5cf6;
//   }

//   option {
//     background: #1e293b;
//     color: #e2e8f0;
//     padding: 0.5rem;
//   }
// `;

// const SortFilter = styled.select`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: #e2e8f0;
//   padding: 0.75rem 1rem;
//   border-radius: 10px;
//   cursor: pointer;
//   font-weight: 600;
//   min-width: 200px;

//   @media (max-width: 768px) {
//     min-width: 150px;
//     flex: 1;
//   }

//   &:focus {
//     outline: none;
//     border-color: #8b5cf6;
//   }
// `;

// const LocationStatus = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.75rem 1rem;
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 10px;
//   color: #94a3b8;
//   font-size: 0.9rem;

//   @media (max-width: 768px) {
//     width: 100%;
//     justify-content: center;
//     order: 3;
//     margin-top: 0.5rem;
//   }
// `;

// const FiltersRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   flex: 1;
//   background-color: transparent !important;

//   @media (max-width: 768px) {
//     width: 100%;
//     justify-content: space-between;
//   }
// `;

// const LoadingSpinner = styled.div`
//   display: inline-block;
//   width: 50px;
//   height: 50px;
//   border: 3px solid rgba(139, 92, 246, 0.3);
//   border-radius: 50%;
//   border-top-color: #8b5cf6;
//   animation: spin 1s ease-in-out infinite;

//   @keyframes spin {
//     to {
//       transform: rotate(360deg);
//     }
//   }
// `;

// const HowItWorksSection = styled.div`
//   background: rgba(30, 41, 59, 0.5);
//   border-radius: 16px;
//   padding: 3rem 2rem;
//   margin-top: 4rem;
//   border: 1px solid rgba(139, 92, 246, 0.2);
// `;

// const StepGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 2rem;
//   text-align: center;
// `;

// // Interfaces matching your Prisma schema
// interface ValidHours {
//   start: string;
//   end: string;
// }

// interface VIPPass {
//   id: string;
//   barId: string;
//   bar: {
//     id: string;
//     name: string;
//     image?: string;
//     type: string;
//     district: string;
//     latitude: number;
//     longitude: number;
//     city: string;
//   };
//   name: string;
//   description: string;
//   type: string;
//   price: number;
//   originalPrice?: number;
//   benefits: string[];
//   skipLinePriority: boolean;
//   coverFeeIncluded: boolean;
//   coverFeeAmount: number;
//   validity: {
//     start: Date;
//     end: Date;
//     validDays: string[];
//     validHours?: ValidHours;
//   };
//   capacity: {
//     total: number;
//     sold: number;
//     available: number;
//   };
//   maxPerUser: number;
//   distance?: number;
// }

// type SortOption = "distance" | "price" | "availability";

// // Helper functions
// const getBarImage = (bar: { image?: string; name: string }): string => {
//   if (bar.image && bar.image.startsWith("http")) {
//     return bar.image;
//   }

//   const initial = bar.name.charAt(0).toUpperCase();
//   return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
// };

// const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// interface VIPMarketplaceProps {
//   initialCity: string;
// }

// export default function VIPMarketplace({ initialCity }: VIPMarketplaceProps) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCity, setSelectedCity] = useState(initialCity);
//   const [sortBy, setSortBy] = useState<SortOption>("distance");
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState<string | null>(null);

//   const cities = [
//     { name: "Helsinki", value: "helsinki" },
//     { name: "Tampere", value: "tampere" },
//     { name: "Turku", value: "turku" },
//   ];

//   const getUserLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       return;
//     }

//     setLocationLoading(true);
//     setLocationError(null);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         setLocationLoading(false);
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         setLocationError("Unable to retrieve your location");
//         setLocationLoading(false);

//         const city = cities.find((c) => c.value === selectedCity);
//         if (city) {
//           setUserLocation({
//             latitude:
//               city.value === "helsinki"
//                 ? 60.1699
//                 : city.value === "tampere"
//                 ? 61.4978
//                 : 60.4518,
//             longitude:
//               city.value === "helsinki"
//                 ? 24.9384
//                 : city.value === "tampere"
//                 ? 23.761
//                 : 22.2666,
//           });
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 60000,
//       }
//     );
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     fetchVIPPasses();
//   }, [selectedCity, userLocation]);

//   const fetchVIPPasses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/vip/passes?city=${selectedCity}`);
//       if (!response.ok) throw new Error("Failed to fetch passes");

//       const data = await response.json();

//       let passesWithDistance = data.passes;
//       if (userLocation) {
//         passesWithDistance = data.passes.map((pass: VIPPass) => ({
//           ...pass,
//           distance: calculateDistance(
//             userLocation.latitude,
//             userLocation.longitude,
//             pass.bar.latitude,
//             pass.bar.longitude
//           ),
//         }));
//       }

//       setVipPasses(passesWithDistance);
//     } catch (error) {
//       console.error("Error fetching VIP passes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSortedPasses = () => {
//     const sorted = [...vipPasses];

//     switch (sortBy) {
//       case "distance":
//         return sorted.sort(
//           (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
//         );
//       case "price":
//         return sorted.sort((a, b) => a.price - b.price);
//       case "availability":
//         return sorted.sort(
//           (a, b) => b.capacity.available - a.capacity.available
//         );
//       default:
//         return sorted;
//     }
//   };

//   const handlePurchaseClick = (pass: VIPPass) => {
//     if (!session) {
//       // Redirect to your existing login page with callback URL
//       router.push(
//         `/app/auth/login?callbackUrl=${encodeURIComponent(
//           `/app/vip/payment?passId=${pass.id}`
//         )}`
//       );
//       return;
//     }

//     router.push(`/app/vip-pass/vip-payment?passId=${pass.id}`);
//   };

//   const getAvailabilityText = (available: number) => {
//     if (available === 0) return "Sold Out";
//     if (available <= 3) return `${available} left`;
//     if (available <= 10) return "Limited";
//     return "Available";
//   };

//   const getPassTypeIcon = (type: string) => {
//     switch (type) {
//       case "SKIP_LINE":
//         return "🚀";
//       case "PREMIUM_ENTRY":
//         return "⭐";
//       case "COVER_INCLUDED":
//         return "🎫";
//       default:
//         return "🎪";
//     }
//   };

//   const formatValidDays = (days: string[]) => {
//     return days
//       .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
//       .join(", ");
//   };

//   const formatValidHours = (validHours?: ValidHours) => {
//     if (!validHours) return "";
//     return `${validHours.start} - ${validHours.end}`;
//   };

//   const formatDistance = (distance?: number) => {
//     if (distance === undefined || distance === null || isNaN(distance)) {
//       return "Unknown";
//     }
//     if (distance < 1) return `${Math.round(distance * 1000)}m`;
//     return `${distance.toFixed(1)}km`;
//   };

//   const isNearby = (distance?: number) => {
//     return distance !== undefined && distance < 2;
//   };

//   const formatBarType = (type: string) => {
//     return type.toLowerCase().replace("_", " ");
//   };

//   const sortedPasses = getSortedPasses();

//   if (loading) {
//     return (
//       <MarketplaceContainer>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "50vh",
//             gap: "1rem",
//             backgroundColor: "transparent !important",
//           }}
//         >
//           <LoadingSpinner />
//           <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
//             Loading VIP passes for{" "}
//             {cities.find((c) => c.value === selectedCity)?.name}...
//           </p>
//         </div>
//       </MarketplaceContainer>
//     );
//   }

//   return (
//     <MarketplaceContainer>
//       <HeaderSection>
//         <Title>VIP Marketplace</Title>
//         <Subtitle>
//           Discover VIP passes at bars near you. Skip the line and enjoy
//           exclusive access to{" "}
//           {cities.find((c) => c.value === selectedCity)?.name}&apos;s hottest
//           venues.
//         </Subtitle>
//       </HeaderSection>

//       <FilterSection>
//         <FiltersRow>
//           <CityFilter>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 flex: 1,
//               }}
//             >
//               <CityDropdown
//                 value={selectedCity}
//                 onChange={(e) => setSelectedCity(e.target.value)}
//               >
//                 {cities.map((city) => (
//                   <option key={city.value} value={city.value}>
//                     {city.name}
//                   </option>
//                 ))}
//               </CityDropdown>
//             </div>
//           </CityFilter>

//           <SortFilter
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value as SortOption)}
//           >
//             <option value="distance">Sort by: Nearest</option>
//             <option value="price">Sort by: Price</option>
//             <option value="availability">Sort by: Availability</option>
//           </SortFilter>
//         </FiltersRow>

//         <LocationStatus>
//           {locationLoading ? (
//             <>
//               <LoadingSpinner style={{ width: "16px", height: "16px" }} />
//               <span>Getting your location...</span>
//             </>
//           ) : locationError ? (
//             <>
//               <span>📍</span>
//               <span>
//                 Using {cities.find((c) => c.value === selectedCity)?.name}{" "}
//                 center
//               </span>
//               <button
//                 onClick={getUserLocation}
//                 style={{
//                   background: "none",
//                   border: "1px solid rgba(139, 92, 246, 0.3)",
//                   color: "#8b5cf6",
//                   padding: "0.25rem 0.5rem",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "0.8rem",
//                 }}
//               >
//                 Retry
//               </button>
//             </>
//           ) : userLocation ? (
//             <>
//               <span style={{ color: "#10b981" }}>📍</span>
//               <span>Showing bars near you</span>
//             </>
//           ) : (
//             <>
//               <span>📍</span>
//               <span>Enable location for nearby bars</span>
//             </>
//           )}
//         </LocationStatus>
//       </FilterSection>

//       {sortedPasses.length === 0 ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "4rem 2rem",
//             color: "#64748b",
//             background: "rgba(30, 41, 59, 0.5)",
//             borderRadius: "16px",
//             border: "1px solid rgba(139, 92, 246, 0.2)",
//           }}
//         >
//           <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎪</div>
//           <h3
//             style={{
//               color: "#f8fafc",
//               marginBottom: "0.5rem",
//               fontSize: "1.5rem",
//             }}
//           >
//             No VIP passes available in{" "}
//             {cities.find((c) => c.value === selectedCity)?.name}
//           </h3>
//           <p style={{ fontSize: "1.1rem" }}>
//             Check back later for new exclusive passes
//           </p>
//         </div>
//       ) : (
//         <PassGrid>
//           {sortedPasses.map((pass) => {
//             const isSoldOut = pass.capacity.available === 0;
//             const percentageSold =
//               (pass.capacity.sold / pass.capacity.total) * 100;
//             const isNearbyBar = isNearby(pass.distance);

//             return (
//               <PassCard
//                 key={pass.id}
//                 $isSoldOut={isSoldOut}
//                 $isNearby={isNearbyBar}
//               >
//                 <AvailabilityBadge $available={pass.capacity.available}>
//                   {getAvailabilityText(pass.capacity.available)}
//                 </AvailabilityBadge>

//                 {pass.distance !== undefined && !isNaN(pass.distance) && (
//                   <DistanceBadge $distance={pass.distance}>
//                     <span>📍</span>
//                     {formatDistance(pass.distance)}
//                   </DistanceBadge>
//                 )}

//                 <BarInfo>
//                   <BarImage
//                     src={getBarImage(pass.bar)}
//                     alt={pass.bar.name}
//                     onError={(e) => {
//                       e.currentTarget.src = getBarImage({
//                         name: pass.bar.name,
//                       });
//                     }}
//                   />
//                   <BarDetails>
//                     <h3
//                       style={{
//                         color: "#f8fafc",
//                         margin: "0 0 0.25rem 0",
//                         fontSize: "1.1rem",
//                         fontWeight: "700",
//                       }}
//                     >
//                       {pass.bar.name}
//                     </h3>
//                     <p
//                       style={{
//                         color: "#0ea5e9",
//                         margin: "0 0 0.25rem 0",
//                         fontWeight: "600",
//                         fontSize: "0.9rem",
//                       }}
//                     >
//                       {formatBarType(pass.bar.type)} • {pass.bar.district}
//                     </p>
//                     <p
//                       style={{
//                         color: "#94a3b8",
//                         margin: 0,
//                         fontSize: "0.8rem",
//                       }}
//                     >
//                       {pass.bar.city}
//                       {pass.validity.validHours && (
//                         <>
//                           <br />
//                           {formatValidHours(pass.validity.validHours)}
//                         </>
//                       )}
//                     </p>
//                   </BarDetails>
//                 </BarInfo>

//                 <div style={{ marginBottom: "1rem" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       marginBottom: "0.5rem",
//                     }}
//                   >
//                     <span style={{ fontSize: "1.2rem" }}>
//                       {getPassTypeIcon(pass.type)}
//                     </span>
//                     <h4
//                       style={{
//                         color: "#f8fafc",
//                         margin: 0,
//                         fontSize: "1.3rem",
//                         fontWeight: "700",
//                       }}
//                     >
//                       {pass.name}
//                     </h4>
//                   </div>
//                   <p
//                     style={{
//                       color: "#94a3b8",
//                       margin: 0,
//                       lineHeight: "1.5",
//                     }}
//                   >
//                     {pass.description}
//                   </p>
//                 </div>

//                 <FeatureBadges>
//                   {isNearbyBar && (
//                     <FeatureBadge $type="success">🏃‍♂️ Nearby</FeatureBadge>
//                   )}
//                   {pass.skipLinePriority && (
//                     <FeatureBadge $type="primary">🚀 Skip Line</FeatureBadge>
//                   )}
//                   {pass.coverFeeIncluded && (
//                     <FeatureBadge $type="info">✅ Cover Included</FeatureBadge>
//                   )}
//                   <FeatureBadge $type="warning">
//                     {pass.maxPerUser === 1
//                       ? "1 per person"
//                       : `${pass.maxPerUser} max`}
//                   </FeatureBadge>
//                 </FeatureBadges>

//                 <div style={{ margin: "1.5rem 0" }}>
//                   <h5
//                     style={{
//                       color: "#f8fafc",
//                       margin: "0 0 0.75rem 0",
//                       fontSize: "1rem",
//                     }}
//                   >
//                     What&apos;s Included:
//                   </h5>
//                   {pass.benefits.map((benefit, index) => (
//                     <div
//                       key={index}
//                       style={{
//                         color: "#94a3b8",
//                         marginBottom: "0.5rem",
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "0.75rem",
//                         fontSize: "0.9rem",
//                         lineHeight: "1.4",
//                       }}
//                     >
//                       <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>
//                       {benefit}
//                     </div>
//                   ))}
//                 </div>

//                 <div style={{ margin: "1.5rem 0" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginBottom: "0.5rem",
//                       fontSize: "0.9rem",
//                       color: "#94a3b8",
//                     }}
//                   >
//                     <span>
//                       {pass.capacity.available} of {pass.capacity.total}{" "}
//                       available
//                     </span>
//                     <span>{Math.round(percentageSold)}% sold</span>
//                   </div>
//                   <ProgressBar $percentage={percentageSold} />
//                 </div>

//                 <PriceSection>
//                   <CurrentPrice>€{pass.price}</CurrentPrice>
//                   {pass.originalPrice && pass.originalPrice > pass.price && (
//                     <OriginalPrice>€{pass.originalPrice}</OriginalPrice>
//                   )}
//                 </PriceSection>

//                 <PurchaseButton
//                   $isSoldOut={isSoldOut}
//                   onClick={() => handlePurchaseClick(pass)}
//                   disabled={isSoldOut}
//                 >
//                   {isSoldOut ? "Sold Out" : `Buy Now - €${pass.price}`}
//                 </PurchaseButton>
//               </PassCard>
//             );
//           })}
//         </PassGrid>
//       )}

//       <HowItWorksSection>
//         <h3
//           style={{
//             textAlign: "center",
//             marginBottom: "3rem",
//             color: "#f8fafc",
//             fontSize: "2rem",
//             fontWeight: "700",
//           }}
//         >
//           How VIP Passes Work
//         </h3>
//         <StepGrid>
//           {[
//             {
//               step: "1",
//               icon: "📍",
//               title: "Find Nearby Bars",
//               description:
//                 "Enable location to see VIP passes at bars closest to you with real-time distance calculations",
//             },
//             {
//               step: "2",
//               icon: "🛒",
//               title: "Buy Pass",
//               description:
//                 "Purchase VIP pass in app for skip-the-line access and exclusive benefits",
//             },
//             {
//               step: "3",
//               icon: "📱",
//               title: "Get QR Code",
//               description:
//                 "Receive unique QR code instantly in your VIP wallet within the app",
//             },
//             {
//               step: "4",
//               icon: "🎯",
//               title: "Show & Enter",
//               description:
//                 "Present QR code at entrance to bypass queues and walk straight in",
//             },
//           ].map((step, index) => (
//             <div key={index} style={{ padding: "1.5rem" }}>
//               <div
//                 style={{
//                   fontSize: "3rem",
//                   marginBottom: "1rem",
//                   background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 {step.icon}
//               </div>
//               <div
//                 style={{
//                   fontSize: "2rem",
//                   fontWeight: "700",
//                   color: "#8b5cf6",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {step.step}
//               </div>
//               <h4
//                 style={{
//                   color: "#f8fafc",
//                   marginBottom: "1rem",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 {step.title}
//               </h4>
//               <p
//                 style={{
//                   color: "#94a3b8",
//                   fontSize: "0.95rem",
//                   lineHeight: "1.5",
//                 }}
//               >
//                 {step.description}
//               </p>
//             </div>
//           ))}
//         </StepGrid>
//       </HowItWorksSection>
//     </MarketplaceContainer>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

// ============================================
// STYLED COMPONENTS WITH THEME
// ============================================

const MarketplaceContainer = styled.div`
  padding: 2rem 1rem 10rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};

  @media (min-width: 768px) {
    margin-left: 240px;
    padding: 2rem 2rem 8rem;
    max-width: calc(100% - 240px);
  }

  @media (max-width: 767px) {
    padding: 1rem 1rem 6rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  padding-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  padding: 1rem;
`;

const PassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const PassCard = styled.div<{ $isSoldOut: boolean; $isNearby?: boolean }>`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid
    ${(props) =>
      props.$isSoldOut
        ? "rgba(239, 68, 68, 0.3)"
        : props.$isNearby
          ? "rgba(16, 185, 129, 0.5)"
          : props.theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: ${(props) => (props.$isSoldOut ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  position: relative;
  opacity: ${(props) => (props.$isSoldOut ? 0.7 : 1)};
  ${(props) =>
    props.$isNearby &&
    `
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  `}

  &:hover {
    border-color: ${(props) =>
      props.$isSoldOut
        ? "rgba(239, 68, 68, 0.5)"
        : props.$isNearby
          ? "rgba(16, 185, 129, 0.8)"
          : props.theme.colors.primaryAccent};
    transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-4px)")};
    box-shadow: ${(props) =>
      props.$isSoldOut
        ? "none"
        : props.$isNearby
          ? "0 12px 30px rgba(16, 185, 129, 0.4)"
          : "0 12px 30px rgba(139, 92, 246, 0.3)"};
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.div`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.4rem;
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const OriginalPrice = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const AvailabilityBadge = styled.div<{ $available: number }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${(props) =>
    props.$available > 10
      ? "rgba(16, 185, 129, 0.2)"
      : props.$available > 0
        ? "rgba(245, 158, 11, 0.2)"
        : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) =>
    props.$available > 10
      ? "#10b981"
      : props.$available > 0
        ? "#f59e0b"
        : "#ef4444"};
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
  border-color: ${(props) =>
    props.$available > 10
      ? "rgba(16, 185, 129, 0.3)"
      : props.$available > 0
        ? "rgba(245, 158, 11, 0.3)"
        : "rgba(239, 68, 68, 0.3)"};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const DistanceBadge = styled.div<{ $distance: number }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) =>
    props.$distance < 1
      ? "rgba(16, 185, 129, 0.2)"
      : props.$distance < 3
        ? "rgba(245, 158, 11, 0.2)"
        : "rgba(139, 92, 246, 0.2)"};
  color: ${(props) =>
    props.$distance < 1
      ? "#10b981"
      : props.$distance < 3
        ? "#f59e0b"
        : props.theme.colors.primaryAccent};
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
  border-color: ${(props) =>
    props.$distance < 1
      ? "rgba(16, 185, 129, 0.3)"
      : props.$distance < 3
        ? "rgba(245, 158, 11, 0.3)"
        : "rgba(139, 92, 246, 0.3)"};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const FeatureBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const FeatureBadge = styled.div<{
  $type: "primary" | "success" | "warning" | "info";
}>`
  background: ${(props) =>
    props.$type === "primary"
      ? "rgba(139, 92, 246, 0.2)"
      : props.$type === "success"
        ? "rgba(16, 185, 129, 0.2)"
        : props.$type === "warning"
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(14, 165, 233, 0.2)"};
  color: ${(props) =>
    props.$type === "primary"
      ? props.theme.colors.primaryAccent
      : props.$type === "success"
        ? "#10b981"
        : props.$type === "warning"
          ? "#f59e0b"
          : props.theme.colors.secondaryAccent};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
  border-color: ${(props) =>
    props.$type === "primary"
      ? "rgba(139, 92, 246, 0.3)"
      : props.$type === "success"
        ? "rgba(16, 185, 129, 0.3)"
        : props.$type === "warning"
          ? "rgba(245, 158, 11, 0.3)"
          : "rgba(14, 165, 233, 0.3)"};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const BarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BarImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
`;

const BarDetails = styled.div`
  flex: 1;
`;

const BarName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarType = styled.p`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarLocation = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassHeader = styled.div`
  margin-bottom: 1rem;
`;

const PassHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const PassIcon = styled.span`
  font-size: 1.2rem;
`;

const PassName = styled.h4`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BenefitsTitle = styled.h5`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BenefitItem = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BenefitCheck = styled.span`
  color: #10b981;
  flex-shrink: 0;
`;

const ProgressSection = styled.div`
  margin: 1.5rem 0;
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 3px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.$percentage}%;
    background: ${(props) =>
      props.$percentage < 50
        ? "linear-gradient(90deg, #10b981, #0ea5e9)"
        : props.$percentage < 80
          ? "linear-gradient(90deg, #f59e0b, #f97316)"
          : "linear-gradient(90deg, #ef4444, #dc2626)"};
    transition: width 0.3s ease;
  }
`;

const PurchaseButton = styled.button<{ $isSoldOut: boolean }>`
  background: ${(props) =>
    props.$isSoldOut
      ? "rgba(107, 114, 128, 0.5)"
      : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: ${(props) => (props.$isSoldOut ? "not-allowed" : "pointer")};
  width: 100%;
  opacity: ${(props) => (props.$isSoldOut ? 0.6 : 1)};
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.$isSoldOut ? "none" : "0 8px 20px rgba(139, 92, 246, 0.4)"};
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const CityFilter = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 0.9rem;
`;

const StyledSelect = styled.select`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  min-width: 200px;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    min-width: 150px;
    flex: 1;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }

  option {
    background: ${({ theme }) => theme.colors.secondaryBackground};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 0.5rem;
  }
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 3;
    margin-top: 0.5rem;
  }
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primaryAccent};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    background: rgba(139, 92, 246, 0.1);
  }
`;

const LocationDot = styled.span<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "#10b981" : "inherit")};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primaryAccent};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const HowItWorksSection = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-top: 4rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HowItWorksTitle = styled.h3`
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 2rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StepCard = styled.div`
  padding: 1.5rem;
`;

const StepIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StepNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryAccent};
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StepTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// ============================================
// TYPES & INTERFACES
// ============================================

interface ValidHours {
  start: string;
  end: string;
}

interface VIPPass {
  id: string;
  barId: string;
  bar: {
    id: string;
    name: string;
    image?: string;
    type: string;
    district: string;
    latitude: number;
    longitude: number;
    city: string;
  };
  name: string;
  description: string;
  type: string;
  price: number;
  originalPrice?: number;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  validity: {
    start: Date;
    end: Date;
    validDays: string[];
    validHours?: ValidHours;
  };
  capacity: {
    total: number;
    sold: number;
    available: number;
  };
  maxPerUser: number;
  distance?: number;
}

type SortOption = "distance" | "price" | "availability";

interface VIPMarketplaceProps {
  initialCity: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getBarImage = (bar: { image?: string; name: string }): string => {
  if (bar.image && bar.image.startsWith("http")) {
    return bar.image;
  }
  const initial = bar.name.charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function VIPMarketplace({ initialCity }: VIPMarketplaceProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const cities = [
    { name: "Helsinki", value: "helsinki" },
    { name: "Tampere", value: "tampere" },
    { name: "Turku", value: "turku" },
  ];

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Unable to retrieve your location");
        setLocationLoading(false);

        const city = cities.find((c) => c.value === selectedCity);
        if (city) {
          setUserLocation({
            latitude:
              city.value === "helsinki"
                ? 60.1699
                : city.value === "tampere"
                  ? 61.4978
                  : 60.4518,
            longitude:
              city.value === "helsinki"
                ? 24.9384
                : city.value === "tampere"
                  ? 23.761
                  : 22.2666,
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    fetchVIPPasses();
  }, [selectedCity, userLocation]);

  const fetchVIPPasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vip/passes?city=${selectedCity}`);
      if (!response.ok) throw new Error("Failed to fetch passes");

      const data = await response.json();

      let passesWithDistance = data.passes;
      if (userLocation) {
        passesWithDistance = data.passes.map((pass: VIPPass) => ({
          ...pass,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pass.bar.latitude,
            pass.bar.longitude,
          ),
        }));
      }

      setVipPasses(passesWithDistance);
    } catch (error) {
      console.error("Error fetching VIP passes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedPasses = () => {
    const sorted = [...vipPasses];

    switch (sortBy) {
      case "distance":
        return sorted.sort(
          (a, b) => (a.distance || Infinity) - (b.distance || Infinity),
        );
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "availability":
        return sorted.sort(
          (a, b) => b.capacity.available - a.capacity.available,
        );
      default:
        return sorted;
    }
  };

  const handlePurchaseClick = (pass: VIPPass) => {
    if (!session) {
      router.push(
        `/app/auth/login?callbackUrl=${encodeURIComponent(
          `/app/vip/payment?passId=${pass.id}`,
        )}`,
      );
      return;
    }
    router.push(`/app/vip-pass/vip-payment?passId=${pass.id}`);
  };

  const getAvailabilityText = (available: number) => {
    if (available === 0) return "Sold Out";
    if (available <= 3) return `${available} left`;
    if (available <= 10) return "Limited";
    return "Available";
  };

  const getPassTypeIcon = (type: string) => {
    switch (type) {
      case "SKIP_LINE":
        return "🚀";
      case "PREMIUM_ENTRY":
        return "⭐";
      case "COVER_INCLUDED":
        return "🎫";
      default:
        return "🎪";
    }
  };

  const formatValidHours = (validHours?: ValidHours) => {
    if (!validHours) return "";
    return `${validHours.start} - ${validHours.end}`;
  };

  const formatDistance = (distance?: number) => {
    if (distance === undefined || distance === null || isNaN(distance)) {
      return "Unknown";
    }
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const isNearby = (distance?: number) => {
    return distance !== undefined && distance < 2;
  };

  const formatBarType = (type: string) => {
    return type.toLowerCase().replace("_", " ");
  };

  const sortedPasses = getSortedPasses();
  const currentCity = cities.find((c) => c.value === selectedCity);

  if (loading) {
    return (
      <MarketplaceContainer>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>
              Loading VIP passes for {currentCity?.name}...
            </LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </MarketplaceContainer>
    );
  }

  return (
    <MarketplaceContainer>
      <ContentWrapper>
        <HeaderSection>
          <Title>VIP Marketplace</Title>
          <Subtitle>
            Discover VIP passes at bars near you. Skip the line and enjoy
            exclusive access to {currentCity?.name}&apos;s hottest venues.
          </Subtitle>
        </HeaderSection>

        <FilterSection>
          <FiltersRow>
            <CityFilter>
              <StyledSelect
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.name}
                  </option>
                ))}
              </StyledSelect>
            </CityFilter>

            <StyledSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="distance">Sort by: Nearest</option>
              <option value="price">Sort by: Price</option>
              <option value="availability">Sort by: Availability</option>
            </StyledSelect>
          </FiltersRow>

          <LocationStatus>
            {locationLoading ? (
              <>
                <LoadingSpinner style={{ width: "16px", height: "16px" }} />
                <span>Getting your location...</span>
              </>
            ) : locationError ? (
              <>
                <span>📍</span>
                <span>Using {currentCity?.name} center</span>
                <RetryButton onClick={getUserLocation}>Retry</RetryButton>
              </>
            ) : userLocation ? (
              <>
                <LocationDot $active>📍</LocationDot>
                <span>Showing bars near you</span>
              </>
            ) : (
              <>
                <span>📍</span>
                <span>Enable location for nearby bars</span>
              </>
            )}
          </LocationStatus>
        </FilterSection>

        {sortedPasses.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎪</EmptyIcon>
            <EmptyTitle>
              No VIP passes available in {currentCity?.name}
            </EmptyTitle>
            <EmptyText>Check back later for new exclusive passes</EmptyText>
          </EmptyState>
        ) : (
          <PassGrid>
            {sortedPasses.map((pass) => {
              const isSoldOut = pass.capacity.available === 0;
              const percentageSold =
                (pass.capacity.sold / pass.capacity.total) * 100;
              const isNearbyBar = isNearby(pass.distance);

              return (
                <PassCard
                  key={pass.id}
                  $isSoldOut={isSoldOut}
                  $isNearby={isNearbyBar}
                >
                  <AvailabilityBadge $available={pass.capacity.available}>
                    {getAvailabilityText(pass.capacity.available)}
                  </AvailabilityBadge>

                  {pass.distance !== undefined && !isNaN(pass.distance) && (
                    <DistanceBadge $distance={pass.distance}>
                      <span>📍</span>
                      {formatDistance(pass.distance)}
                    </DistanceBadge>
                  )}

                  <BarInfo>
                    <BarImage
                      src={getBarImage(pass.bar)}
                      alt={pass.bar.name}
                      onError={(e) => {
                        e.currentTarget.src = getBarImage({
                          name: pass.bar.name,
                        });
                      }}
                    />
                    <BarDetails>
                      <BarName>{pass.bar.name}</BarName>
                      <BarType>
                        {formatBarType(pass.bar.type)} • {pass.bar.district}
                      </BarType>
                      <BarLocation>
                        {pass.bar.city}
                        {pass.validity.validHours && (
                          <>
                            <br />
                            {formatValidHours(pass.validity.validHours)}
                          </>
                        )}
                      </BarLocation>
                    </BarDetails>
                  </BarInfo>

                  <PassHeader>
                    <PassHeaderRow>
                      <PassIcon>{getPassTypeIcon(pass.type)}</PassIcon>
                      <PassName>{pass.name}</PassName>
                    </PassHeaderRow>
                    <PassDescription>{pass.description}</PassDescription>
                  </PassHeader>

                  <FeatureBadges>
                    {isNearbyBar && (
                      <FeatureBadge $type="success">🏃‍♂️ Nearby</FeatureBadge>
                    )}
                    {pass.skipLinePriority && (
                      <FeatureBadge $type="primary">🚀 Skip Line</FeatureBadge>
                    )}
                    {pass.coverFeeIncluded && (
                      <FeatureBadge $type="info">
                        ✅ Cover Included
                      </FeatureBadge>
                    )}
                    <FeatureBadge $type="warning">
                      {pass.maxPerUser === 1
                        ? "1 per person"
                        : `${pass.maxPerUser} max`}
                    </FeatureBadge>
                  </FeatureBadges>

                  <div style={{ margin: "1.5rem 0" }}>
                    <BenefitsTitle>What&apos;s Included:</BenefitsTitle>
                    {pass.benefits.map((benefit, index) => (
                      <BenefitItem key={index}>
                        <BenefitCheck>✓</BenefitCheck>
                        {benefit}
                      </BenefitItem>
                    ))}
                  </div>

                  <ProgressSection>
                    <ProgressStats>
                      <span>
                        {pass.capacity.available} of {pass.capacity.total}{" "}
                        available
                      </span>
                      <span>{Math.round(percentageSold)}% sold</span>
                    </ProgressStats>
                    <ProgressBar $percentage={percentageSold} />
                  </ProgressSection>

                  <PriceSection>
                    <CurrentPrice>€{pass.price}</CurrentPrice>
                    {pass.originalPrice && pass.originalPrice > pass.price && (
                      <OriginalPrice>€{pass.originalPrice}</OriginalPrice>
                    )}
                  </PriceSection>

                  <PurchaseButton
                    $isSoldOut={isSoldOut}
                    onClick={() => handlePurchaseClick(pass)}
                    disabled={isSoldOut}
                  >
                    {isSoldOut ? "Sold Out" : `Buy Now - €${pass.price}`}
                  </PurchaseButton>
                </PassCard>
              );
            })}
          </PassGrid>
        )}

        <HowItWorksSection>
          <HowItWorksTitle>How VIP Passes Work</HowItWorksTitle>
          <StepGrid>
            <StepCard>
              <StepIcon>📍</StepIcon>
              <StepNumber>1</StepNumber>
              <StepTitle>Find Nearby Bars</StepTitle>
              <StepDescription>
                Enable location to see VIP passes at bars closest to you with
                real-time distance calculations
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepIcon>🛒</StepIcon>
              <StepNumber>2</StepNumber>
              <StepTitle>Buy Pass</StepTitle>
              <StepDescription>
                Purchase VIP pass in app for skip-the-line access and exclusive
                benefits
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepIcon>📱</StepIcon>
              <StepNumber>3</StepNumber>
              <StepTitle>Get QR Code</StepTitle>
              <StepDescription>
                Receive unique QR code instantly in your VIP wallet within the
                app
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepIcon>🎯</StepIcon>
              <StepNumber>4</StepNumber>
              <StepTitle>Show & Enter</StepTitle>
              <StepDescription>
                Present QR code at entrance to bypass queues and walk straight
                in
              </StepDescription>
            </StepCard>
          </StepGrid>
        </HowItWorksSection>
      </ContentWrapper>
    </MarketplaceContainer>
  );
}
