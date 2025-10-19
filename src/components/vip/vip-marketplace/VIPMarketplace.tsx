// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import styled from "styled-components";

// const MarketplaceContainer = styled.div`
//   padding: 1rem;
//   background: #0f172a;
//   min-height: 100vh;
//   color: #e2e8f0;
//   max-width: 1200px;
//   margin: 0 auto;
// `;

// const HeaderSection = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
//   padding: 2rem 1rem;
//   background: linear-gradient(
//     135deg,
//     rgba(30, 41, 59, 0.8),
//     rgba(15, 23, 42, 0.9)
//   );
//   border-radius: 16px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
// `;

// const PassGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//   gap: 1.5rem;
//   margin-top: 2rem;
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
//       rgba(255, 255, 255, 0.2),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }
// `;

// const FilterSection = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 2rem;
//   flex-wrap: wrap;
//   gap: 1rem;
// `;

// const CityFilter = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   flex-wrap: wrap;
// `;

// const CityButton = styled.button<{ $isActive: boolean }>`
//   background: ${(props) =>
//     props.$isActive
//       ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
//       : "rgba(30, 41, 59, 0.8)"};
//   border: 1px solid
//     ${(props) => (props.$isActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
//   color: ${(props) => (props.$isActive ? "white" : "#94a3b8")};
//   padding: 0.75rem 1.5rem;
//   border-radius: 10px;
//   cursor: pointer;
//   font-weight: 600;
//   transition: all 0.3s ease;

//   &:hover {
//     border-color: #8b5cf6;
//     color: white;
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

// // Modal Components
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.7);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
//   padding: 1rem;
// `;

// const ModalContent = styled.div`
//   background: linear-gradient(135deg, #1e293b, #0f172a);
//   border-radius: 20px;
//   padding: 2.5rem;
//   max-width: 500px;
//   width: 100%;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
//   position: relative;
// `;

// const ModalHeader = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const ModalTitle = styled.h2`
//   color: #f8fafc;
//   font-size: 1.8rem;
//   font-weight: 700;
//   margin-bottom: 0.5rem;
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const ModalDescription = styled.p`
//   color: #94a3b8;
//   font-size: 1.1rem;
//   line-height: 1.5;
// `;

// const ModalBenefits = styled.div`
//   background: rgba(15, 23, 42, 0.6);
//   border-radius: 12px;
//   padding: 1.5rem;
//   margin: 1.5rem 0;
//   border: 1px solid rgba(255, 255, 255, 0.1);
// `;

// const BenefitItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-bottom: 0.75rem;
//   color: #e2e8f0;

//   &:last-child {
//     margin-bottom: 0;
//   }
// `;

// const BenefitIcon = styled.div`
//   color: #10b981;
//   font-size: 1.2rem;
// `;

// const ModalActions = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 2rem;
// `;

// const PrimaryButton = styled.button`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   border: none;
//   color: white;
//   padding: 1rem 2rem;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 1.1rem;
//   cursor: pointer;
//   flex: 1;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
//   }
// `;

// const SecondaryButton = styled.button`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: #94a3b8;
//   padding: 1rem 2rem;
//   border-radius: 12px;
//   font-weight: 600;
//   font-size: 1.1rem;
//   cursor: pointer;
//   flex: 1;
//   transition: all 0.3s ease;

//   &:hover {
//     border-color: #8b5cf6;
//     color: white;
//   }
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: none;
//   border: none;
//   color: #94a3b8;
//   font-size: 1.5rem;
//   cursor: pointer;
//   padding: 0.5rem;
//   border-radius: 8px;
//   transition: all 0.3s ease;

//   &:hover {
//     background: rgba(139, 92, 246, 0.1);
//     color: #8b5cf6;
//   }
// `;

// interface ValidHours {
//   start: string;
//   end: string;
// }

// interface BarLocation {
//   latitude: number;
//   longitude: number;
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

// // Helper function to create placeholder SVG images
// const getPlaceholderImage = (barName: string): string => {
//   const initial = barName.charAt(0).toUpperCase();
//   return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
// };

// // Calculate distance between two coordinates using Haversine formula
// const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number => {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in kilometers
// };

// export default function VIPMarketplace() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [purchasing, setPurchasing] = useState<string | null>(null);
//   const [selectedCity, setSelectedCity] = useState("helsinki");
//   const [sortBy, setSortBy] = useState<SortOption>("distance");

//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [selectedPass, setSelectedPass] = useState<VIPPass | null>(null);

//   const cities = [
//     {
//       name: "Helsinki",
//       value: "helsinki",
//       center: { lat: 60.1699, lng: 24.9384 },
//     },
//     {
//       name: "Tampere",
//       value: "tampere",
//       center: { lat: 61.4978, lng: 23.761 },
//     },
//     { name: "Turku", value: "turku", center: { lat: 60.4518, lng: 22.2666 } },
//     { name: "Espoo", value: "espoo", center: { lat: 60.2055, lng: 24.6559 } },
//   ];

//   // Get user's location
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

//         // Fallback to city center if location access is denied
//         const city = cities.find((c) => c.value === selectedCity);
//         if (city) {
//           setUserLocation({
//             latitude: city.center.lat,
//             longitude: city.center.lng,
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

//       // Calculate distances if user location is available
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

//   // Sort passes based on selected criteria
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
//       setSelectedPass(pass);
//       setShowLoginModal(true);
//       return;
//     }

//     handlePurchase(pass);
//   };

//   const handlePurchase = async (pass: VIPPass) => {
//     if (!session) return;

//     if (pass.capacity.available === 0) {
//       return;
//     }

//     setPurchasing(pass.id);

//     try {
//       const response = await fetch("/api/vip/purchase", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ vipPassId: pass.id }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert(
//           `🎉 Success! You've purchased the ${pass.name}\nQR Code: ${
//             result.pass.qrCode
//           }\nExpires: ${new Date(result.pass.expiresAt).toLocaleDateString()}`
//         );
//         fetchVIPPasses(); // Refresh available passes
//       } else {
//         alert(`❌ ${result.error}`);
//       }
//     } catch (error) {
//       console.error("Purchase error:", error);
//       alert("❌ Failed to purchase VIP pass");
//     } finally {
//       setPurchasing(null);
//       setShowLoginModal(false);
//       setSelectedPass(null);
//     }
//   };

//   const handleLogin = () => {
//     router.push("/auth/login");
//   };

//   const handleSignUp = () => {
//     router.push("/auth/signup");
//   };

//   const closeModal = () => {
//     setShowLoginModal(false);
//     setSelectedPass(null);
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
//     if (!distance) return "Unknown";
//     if (distance < 1) return `${Math.round(distance * 1000)}m`;
//     return `${distance.toFixed(1)}km`;
//   };

//   const isNearby = (distance?: number) => {
//     return distance !== undefined && distance < 2; // Within 2km
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
//           }}
//         >
//           <LoadingSpinner />
//           <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
//             Loading VIP passes for {selectedCity}...
//           </p>
//         </div>
//       </MarketplaceContainer>
//     );
//   }

//   return (
//     <>
//       <MarketplaceContainer>
//         {/* Header */}
//         <HeaderSection>
//           <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
//           <h1
//             style={{
//               fontSize: "3rem",
//               fontWeight: "800",
//               marginBottom: "1rem",
//               background: "linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundSize: "300% 300%",
//               animation: "gradient 3s ease infinite",
//             }}
//           >
//             VIP Marketplace
//           </h1>
//           <p
//             style={{
//               color: "#94a3b8",
//               fontSize: "1.2rem",
//               maxWidth: "600px",
//               margin: "0 auto",
//               lineHeight: "1.6",
//             }}
//           >
//             Discover VIP passes at bars near you. Skip the line and enjoy
//             exclusive access to Helsinki&apos;s hottest venues.
//           </p>
//         </HeaderSection>

//         {/* Filters and Location */}
//         <FilterSection>
//           <CityFilter>
//             {cities.map((city) => (
//               <CityButton
//                 key={city.value}
//                 $isActive={selectedCity === city.value}
//                 onClick={() => setSelectedCity(city.value)}
//               >
//                 {city.name}
//               </CityButton>
//             ))}
//           </CityFilter>

//           <div
//             style={{
//               display: "flex",
//               gap: "1rem",
//               alignItems: "center",
//               flexWrap: "wrap",
//             }}
//           >
//             <SortFilter
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as SortOption)}
//             >
//               <option value="distance">Sort by: Nearest</option>
//               <option value="price">Sort by: Price</option>
//               <option value="availability">Sort by: Availability</option>
//             </SortFilter>

//             <LocationStatus>
//               {locationLoading ? (
//                 <>
//                   <LoadingSpinner style={{ width: "16px", height: "16px" }} />
//                   <span>Getting your location...</span>
//                 </>
//               ) : locationError ? (
//                 <>
//                   <span>📍</span>
//                   <span>Using {selectedCity} center</span>
//                   <button
//                     onClick={getUserLocation}
//                     style={{
//                       background: "none",
//                       border: "1px solid rgba(139, 92, 246, 0.3)",
//                       color: "#8b5cf6",
//                       padding: "0.25rem 0.5rem",
//                       borderRadius: "6px",
//                       cursor: "pointer",
//                       fontSize: "0.8rem",
//                     }}
//                   >
//                     Retry
//                   </button>
//                 </>
//               ) : userLocation ? (
//                 <>
//                   <span style={{ color: "#10b981" }}>📍</span>
//                   <span>Showing bars near you</span>
//                 </>
//               ) : (
//                 <>
//                   <span>📍</span>
//                   <span>Enable location for nearby bars</span>
//                 </>
//               )}
//             </LocationStatus>
//           </div>
//         </FilterSection>

//         {/* VIP Passes Grid */}
//         {sortedPasses.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "4rem 2rem",
//               color: "#64748b",
//               background: "rgba(30, 41, 59, 0.5)",
//               borderRadius: "16px",
//               border: "1px solid rgba(139, 92, 246, 0.2)",
//             }}
//           >
//             <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎪</div>
//             <h3
//               style={{
//                 color: "#f8fafc",
//                 marginBottom: "0.5rem",
//                 fontSize: "1.5rem",
//               }}
//             >
//               No VIP passes available in{" "}
//               {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
//             </h3>
//             <p style={{ fontSize: "1.1rem" }}>
//               Check back later for new exclusive passes
//             </p>
//           </div>
//         ) : (
//           <PassGrid>
//             {sortedPasses.map((pass) => {
//               const isSoldOut = pass.capacity.available === 0;
//               const percentageSold =
//                 (pass.capacity.sold / pass.capacity.total) * 100;
//               const isNearbyBar = isNearby(pass.distance);

//               return (
//                 <PassCard
//                   key={pass.id}
//                   $isSoldOut={isSoldOut}
//                   $isNearby={isNearbyBar}
//                 >
//                   <AvailabilityBadge $available={pass.capacity.available}>
//                     {getAvailabilityText(pass.capacity.available)}
//                   </AvailabilityBadge>

//                   {pass.distance && (
//                     <DistanceBadge $distance={pass.distance}>
//                       <span>📍</span>
//                       {formatDistance(pass.distance)}
//                     </DistanceBadge>
//                   )}

//                   {/* Bar Information */}
//                   <BarInfo>
//                     <BarImage
//                       src={pass.bar.image || getPlaceholderImage(pass.bar.name)}
//                       alt={pass.bar.name}
//                       onError={(e) => {
//                         e.currentTarget.src = getPlaceholderImage(
//                           pass.bar.name
//                         );
//                       }}
//                     />
//                     <BarDetails>
//                       <h3
//                         style={{
//                           color: "#f8fafc",
//                           margin: "0 0 0.25rem 0",
//                           fontSize: "1.1rem",
//                           fontWeight: "700",
//                         }}
//                       >
//                         {pass.bar.name}
//                       </h3>
//                       <p
//                         style={{
//                           color: "#0ea5e9",
//                           margin: "0 0 0.25rem 0",
//                           fontWeight: "600",
//                           fontSize: "0.9rem",
//                         }}
//                       >
//                         {pass.bar.type.replace("_", " ")} • {pass.bar.district}
//                       </p>
//                       <p
//                         style={{
//                           color: "#94a3b8",
//                           margin: 0,
//                           fontSize: "0.8rem",
//                         }}
//                       >
//                         {formatValidDays(pass.validity.validDays)}
//                         {pass.validity.validHours && (
//                           <>
//                             <br />
//                             {formatValidHours(pass.validity.validHours)}
//                           </>
//                         )}
//                       </p>
//                     </BarDetails>
//                   </BarInfo>

//                   {/* Pass Name and Type */}
//                   <div style={{ marginBottom: "1rem" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.5rem",
//                         marginBottom: "0.5rem",
//                       }}
//                     >
//                       <span style={{ fontSize: "1.2rem" }}>
//                         {getPassTypeIcon(pass.type)}
//                       </span>
//                       <h4
//                         style={{
//                           color: "#f8fafc",
//                           margin: 0,
//                           fontSize: "1.3rem",
//                           fontWeight: "700",
//                         }}
//                       >
//                         {pass.name}
//                       </h4>
//                     </div>
//                     <p
//                       style={{
//                         color: "#94a3b8",
//                         margin: 0,
//                         lineHeight: "1.5",
//                       }}
//                     >
//                       {pass.description}
//                     </p>
//                   </div>

//                   {/* Feature Badges */}
//                   <FeatureBadges>
//                     {isNearbyBar && (
//                       <FeatureBadge $type="success">🏃‍♂️ Nearby</FeatureBadge>
//                     )}
//                     {pass.skipLinePriority && (
//                       <FeatureBadge $type="primary">🚀 Skip Line</FeatureBadge>
//                     )}
//                     {pass.coverFeeIncluded && (
//                       <FeatureBadge $type="info">
//                         ✅ Cover Included
//                       </FeatureBadge>
//                     )}
//                     <FeatureBadge $type="warning">
//                       {pass.maxPerUser === 1
//                         ? "1 per person"
//                         : `${pass.maxPerUser} max`}
//                     </FeatureBadge>
//                   </FeatureBadges>

//                   {/* Benefits */}
//                   <div style={{ margin: "1.5rem 0" }}>
//                     <h5
//                       style={{
//                         color: "#f8fafc",
//                         margin: "0 0 0.75rem 0",
//                         fontSize: "1rem",
//                       }}
//                     >
//                       What&apos;s Included:
//                     </h5>
//                     {pass.benefits.map((benefit, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           color: "#94a3b8",
//                           marginBottom: "0.5rem",
//                           display: "flex",
//                           alignItems: "flex-start",
//                           gap: "0.75rem",
//                           fontSize: "0.9rem",
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         <span style={{ color: "#10b981", flexShrink: 0 }}>
//                           ✓
//                         </span>
//                         {benefit}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Progress Bar */}
//                   <div style={{ margin: "1.5rem 0" }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "0.5rem",
//                         fontSize: "0.9rem",
//                         color: "#94a3b8",
//                       }}
//                     >
//                       <span>
//                         {pass.capacity.available} of {pass.capacity.total}{" "}
//                         available
//                       </span>
//                       <span>{Math.round(percentageSold)}% sold</span>
//                     </div>
//                     <ProgressBar $percentage={percentageSold} />
//                   </div>

//                   {/* Price and Purchase Button */}
//                   <PriceSection>
//                     <CurrentPrice>€{pass.price}</CurrentPrice>
//                     {pass.originalPrice && pass.originalPrice > pass.price && (
//                       <OriginalPrice>€{pass.originalPrice}</OriginalPrice>
//                     )}
//                   </PriceSection>

//                   <PurchaseButton
//                     $isSoldOut={isSoldOut}
//                     onClick={() => handlePurchaseClick(pass)}
//                     disabled={isSoldOut || purchasing === pass.id}
//                   >
//                     {purchasing === pass.id
//                       ? "Processing..."
//                       : isSoldOut
//                       ? "Sold Out"
//                       : `Buy Now - €${pass.price}`}
//                   </PurchaseButton>
//                 </PassCard>
//               );
//             })}
//           </PassGrid>
//         )}

//         {/* How It Works Section */}
//         <HowItWorksSection>
//           <h3
//             style={{
//               textAlign: "center",
//               marginBottom: "3rem",
//               color: "#f8fafc",
//               fontSize: "2rem",
//               fontWeight: "700",
//             }}
//           >
//             How VIP Passes Work
//           </h3>
//           <StepGrid>
//             {[
//               {
//                 step: "1",
//                 icon: "📍",
//                 title: "Find Nearby Bars",
//                 description:
//                   "Enable location to see VIP passes at bars closest to you with real-time distance calculations",
//               },
//               {
//                 step: "2",
//                 icon: "🛒",
//                 title: "Buy Pass",
//                 description:
//                   "Purchase VIP pass in app for skip-the-line access and exclusive benefits",
//               },
//               {
//                 step: "3",
//                 icon: "📱",
//                 title: "Get QR Code",
//                 description:
//                   "Receive unique QR code instantly in your VIP wallet within the app",
//               },
//               {
//                 step: "4",
//                 icon: "🎯",
//                 title: "Show & Enter",
//                 description:
//                   "Present QR code at entrance to bypass queues and walk straight in",
//               },
//             ].map((step, index) => (
//               <div key={index} style={{ padding: "1.5rem" }}>
//                 <div
//                   style={{
//                     fontSize: "3rem",
//                     marginBottom: "1rem",
//                     background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
//                     backgroundClip: "text",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                   }}
//                 >
//                   {step.icon}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "2rem",
//                     fontWeight: "700",
//                     color: "#8b5cf6",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   {step.step}
//                 </div>
//                 <h4
//                   style={{
//                     color: "#f8fafc",
//                     marginBottom: "1rem",
//                     fontSize: "1.2rem",
//                   }}
//                 >
//                   {step.title}
//                 </h4>
//                 <p
//                   style={{
//                     color: "#94a3b8",
//                     fontSize: "0.95rem",
//                     lineHeight: "1.5",
//                   }}
//                 >
//                   {step.description}
//                 </p>
//               </div>
//             ))}
//           </StepGrid>
//         </HowItWorksSection>

//         <style jsx global>{`
//           @keyframes gradient {
//             0% {
//               background-position: 0% 50%;
//             }
//             50% {
//               background-position: 100% 50%;
//             }
//             100% {
//               background-position: 0% 50%;
//             }
//           }
//         `}</style>
//       </MarketplaceContainer>

//       {/* Login Modal */}
//       {showLoginModal && selectedPass && (
//         <ModalOverlay onClick={closeModal}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <CloseButton onClick={closeModal}>×</CloseButton>

//             <ModalHeader>
//               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
//               <ModalTitle>Sign In to Continue</ModalTitle>
//               <ModalDescription>
//                 Create an account or sign in to purchase VIP passes and unlock
//                 exclusive benefits
//               </ModalDescription>
//             </ModalHeader>

//             <ModalBenefits>
//               <h4
//                 style={{
//                   color: "#f8fafc",
//                   marginBottom: "1rem",
//                   fontSize: "1.1rem",
//                 }}
//               >
//                 Why Sign Up?
//               </h4>
//               <BenefitItem>
//                 <BenefitIcon>🎫</BenefitIcon>
//                 <span>Purchase VIP passes for skip-the-line access</span>
//               </BenefitItem>
//               <BenefitItem>
//                 <BenefitIcon>💎</BenefitIcon>
//                 <span>Access exclusive deals and promotions</span>
//               </BenefitItem>
//               <BenefitItem>
//                 <BenefitIcon>📱</BenefitIcon>
//                 <span>Manage all your passes in one place</span>
//               </BenefitItem>
//               <BenefitItem>
//                 <BenefitIcon>⭐</BenefitIcon>
//                 <span>Earn rewards and special member benefits</span>
//               </BenefitItem>
//             </ModalBenefits>

//             <div
//               style={{
//                 background: "rgba(139, 92, 246, 0.1)",
//                 borderRadius: "12px",
//                 padding: "1rem",
//                 marginBottom: "1.5rem",
//                 border: "1px solid rgba(139, 92, 246, 0.3)",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.75rem",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 <span style={{ fontSize: "1.2rem" }}>
//                   {getPassTypeIcon(selectedPass.type)}
//                 </span>
//                 <h5 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
//                   {selectedPass.name}
//                 </h5>
//               </div>
//               <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
//                 {selectedPass.bar.name} • €{selectedPass.price}
//               </p>
//             </div>

//             <ModalActions>
//               <SecondaryButton onClick={closeModal}>
//                 Maybe Later
//               </SecondaryButton>
//               <PrimaryButton onClick={handleLogin}>
//                 Sign In to Purchase
//               </PrimaryButton>
//             </ModalActions>

//             <div style={{ textAlign: "center", marginTop: "1rem" }}>
//               <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
//                 Don&apos;t have an account?
//               </p>
//               <button
//                 onClick={handleSignUp}
//                 style={{
//                   background: "none",
//                   border: "1px solid rgba(139, 92, 246, 0.3)",
//                   color: "#8b5cf6",
//                   padding: "0.75rem 1.5rem",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                   width: "100%",
//                   transition: "all 0.3s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
//                   e.currentTarget.style.borderColor = "#8b5cf6";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "none";
//                   e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
//                 }}
//               >
//                 Create New Account
//               </button>
//             </div>
//           </ModalContent>
//         </ModalOverlay>
//       )}
//     </>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const MarketplaceContainer = styled.div`
  padding: 1rem;
  background: #0f172a;
  min-height: 100vh;
  color: #e2e8f0;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.8),
    rgba(15, 23, 42, 0.9)
  );
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const PassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PassCard = styled.div<{ $isSoldOut: boolean; $isNearby?: boolean }>`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid
    ${(props) =>
      props.$isSoldOut
        ? "rgba(239, 68, 68, 0.3)"
        : props.$isNearby
        ? "rgba(16, 185, 129, 0.5)"
        : "rgba(139, 92, 246, 0.3)"};
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
        : "#8b5cf6"};
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
`;

const OriginalPrice = styled.div`
  color: #94a3b8;
  text-decoration: line-through;
  font-size: 1.1rem;
  font-weight: 600;
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
      : "#8b5cf6"};
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
      ? "#8b5cf6"
      : props.$type === "success"
      ? "#10b981"
      : props.$type === "warning"
      ? "#f59e0b"
      : "#0ea5e9"};
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
`;

const BarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 1rem 0;
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
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.$isSoldOut ? "none" : "0 8px 20px rgba(139, 92, 246, 0.4)"};
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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CityFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CityButton = styled.button<{ $isActive: boolean }>`
  background: ${(props) =>
    props.$isActive
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(30, 41, 59, 0.8)"};
  border: 1px solid
    ${(props) => (props.$isActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
  color: ${(props) => (props.$isActive ? "white" : "#94a3b8")};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: white;
  }
`;

const SortFilter = styled.select`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const HowItWorksSection = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-top: 4rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  text-align: center;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  color: #f8fafc;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModalDescription = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ModalBenefits = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #e2e8f0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BenefitIcon = styled.div`
  color: #10b981;
  font-size: 1.2rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #94a3b8;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: white;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }
`;

// NEW: Success and Error Modal Components
const SuccessModalOverlay = styled(ModalOverlay)``;
const SuccessModalContent = styled(ModalContent)``;

const SuccessIcon = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ErrorModalOverlay = styled(ModalOverlay)``;
const ErrorModalContent = styled(ModalContent)``;

const ErrorIcon = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #ef4444;
`;

const QRCodeDisplay = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 1.5rem 0;
`;

const QRCodeText = styled.div`
  font-family: monospace;
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #475569;
  word-break: break-all;
`;

// NEW: Payment Modal Components
const PaymentModalOverlay = styled(ModalOverlay)``;
const PaymentModalContent = styled(ModalContent)`
  max-width: 600px;
`;

const PaymentForm = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaymentInput = styled.input`
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const PaymentRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PaymentLabel = styled.label`
  display: block;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
`;

const FakePaymentButton = styled(PrimaryButton)`
  background: linear-gradient(45deg, #10b981, #0ea5e9);
  width: 100%;
  margin-top: 1rem;
`;

interface ValidHours {
  start: string;
  end: string;
}

interface BarLocation {
  latitude: number;
  longitude: number;
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

interface PurchaseResult {
  success: boolean;
  pass: {
    id: string;
    qrCode: string;
    expiresAt: string;
  };
  error?: string;
}
type SortOption = "distance" | "price" | "availability";

// Helper function to create placeholder SVG images
const getPlaceholderImage = (barName: string): string => {
  const initial = barName.charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export default function VIPMarketplace() {
  const { data: session } = useSession();
  const router = useRouter();
  const [vipPasses, setVipPasses] = useState<VIPPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("helsinki");
  const [sortBy, setSortBy] = useState<SortOption>("distance");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // MODAL STATES
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<VIPPass | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const cities = [
    {
      name: "Helsinki",
      value: "helsinki",
      center: { lat: 60.1699, lng: 24.9384 },
    },
    {
      name: "Tampere",
      value: "tampere",
      center: { lat: 61.4978, lng: 23.761 },
    },
    { name: "Turku", value: "turku", center: { lat: 60.4518, lng: 22.2666 } },
    { name: "Espoo", value: "espoo", center: { lat: 60.2055, lng: 24.6559 } },
  ];

  // Get user's location
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

        // Fallback to city center if location access is denied
        const city = cities.find((c) => c.value === selectedCity);
        if (city) {
          setUserLocation({
            latitude: city.center.lat,
            longitude: city.center.lng,
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
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

      // Calculate distances if user location is available
      let passesWithDistance = data.passes;
      if (userLocation) {
        passesWithDistance = data.passes.map((pass: VIPPass) => ({
          ...pass,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pass.bar.latitude,
            pass.bar.longitude
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

  // Sort passes based on selected criteria
  const getSortedPasses = () => {
    const sorted = [...vipPasses];

    switch (sortBy) {
      case "distance":
        return sorted.sort(
          (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
        );
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "availability":
        return sorted.sort(
          (a, b) => b.capacity.available - a.capacity.available
        );
      default:
        return sorted;
    }
  };

  const handlePurchaseClick = (pass: VIPPass) => {
    if (!session) {
      setSelectedPass(pass);
      setShowLoginModal(true);
      return;
    }

    // Show payment modal instead of directly purchasing
    setSelectedPass(pass);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPass || !session) return;

    setPurchasing(selectedPass.id);
    setShowPaymentModal(false);

    try {
      const response = await fetch("/api/vip/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vipPassId: selectedPass.id }),
      });

      const result = await response.json();

      if (result.success) {
        setPurchaseResult(result);
        setShowSuccessModal(true);
        fetchVIPPasses(); // Refresh available passes to update sold count
      } else {
        setErrorMessage(result.error || "Failed to purchase VIP pass");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setErrorMessage("Failed to purchase VIP pass");
      setShowErrorModal(true);
    } finally {
      setPurchasing(null);
      setSelectedPass(null);
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  const handleViewWallet = () => {
    setShowSuccessModal(false);
    router.push("/vip/wallet");
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowPaymentModal(false);
    setSelectedPass(null);
    setPurchaseResult(null);
    setErrorMessage("");
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

  const formatValidDays = (days: string[]) => {
    return days
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(", ");
  };

  const formatValidHours = (validHours?: ValidHours) => {
    if (!validHours) return "";
    return `${validHours.start} - ${validHours.end}`;
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "Unknown";
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const isNearby = (distance?: number) => {
    return distance !== undefined && distance < 2; // Within 2km
  };

  const sortedPasses = getSortedPasses();

  if (loading) {
    return (
      <MarketplaceContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            gap: "1rem",
          }}
        >
          <LoadingSpinner />
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
            Loading VIP passes for {selectedCity}...
          </p>
        </div>
      </MarketplaceContainer>
    );
  }

  return (
    <>
      <MarketplaceContainer>
        {/* Header */}
        <HeaderSection>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⭐</div>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1rem",
              background: "linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "300% 300%",
              animation: "gradient 3s ease infinite",
            }}
          >
            VIP Marketplace
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Discover VIP passes at bars near you. Skip the line and enjoy
            exclusive access to Helsinki&apos;s hottest venues.
          </p>
        </HeaderSection>

        {/* Filters and Location */}
        <FilterSection>
          <CityFilter>
            {cities.map((city) => (
              <CityButton
                key={city.value}
                $isActive={selectedCity === city.value}
                onClick={() => setSelectedCity(city.value)}
              >
                {city.name}
              </CityButton>
            ))}
          </CityFilter>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <SortFilter
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="distance">Sort by: Nearest</option>
              <option value="price">Sort by: Price</option>
              <option value="availability">Sort by: Availability</option>
            </SortFilter>

            <LocationStatus>
              {locationLoading ? (
                <>
                  <LoadingSpinner style={{ width: "16px", height: "16px" }} />
                  <span>Getting your location...</span>
                </>
              ) : locationError ? (
                <>
                  <span>📍</span>
                  <span>Using {selectedCity} center</span>
                  <button
                    onClick={getUserLocation}
                    style={{
                      background: "none",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      color: "#8b5cf6",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Retry
                  </button>
                </>
              ) : userLocation ? (
                <>
                  <span style={{ color: "#10b981" }}>📍</span>
                  <span>Showing bars near you</span>
                </>
              ) : (
                <>
                  <span>📍</span>
                  <span>Enable location for nearby bars</span>
                </>
              )}
            </LocationStatus>
          </div>
        </FilterSection>

        {/* VIP Passes Grid */}
        {sortedPasses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#64748b",
              background: "rgba(30, 41, 59, 0.5)",
              borderRadius: "16px",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎪</div>
            <h3
              style={{
                color: "#f8fafc",
                marginBottom: "0.5rem",
                fontSize: "1.5rem",
              }}
            >
              No VIP passes available in{" "}
              {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
            </h3>
            <p style={{ fontSize: "1.1rem" }}>
              Check back later for new exclusive passes
            </p>
          </div>
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

                  {pass.distance && (
                    <DistanceBadge $distance={pass.distance}>
                      <span>📍</span>
                      {formatDistance(pass.distance)}
                    </DistanceBadge>
                  )}

                  {/* Bar Information */}
                  <BarInfo>
                    <BarImage
                      src={pass.bar.image || getPlaceholderImage(pass.bar.name)}
                      alt={pass.bar.name}
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(
                          pass.bar.name
                        );
                      }}
                    />
                    <BarDetails>
                      <h3
                        style={{
                          color: "#f8fafc",
                          margin: "0 0 0.25rem 0",
                          fontSize: "1.1rem",
                          fontWeight: "700",
                        }}
                      >
                        {pass.bar.name}
                      </h3>
                      <p
                        style={{
                          color: "#0ea5e9",
                          margin: "0 0 0.25rem 0",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        {pass.bar.type.replace("_", " ")} • {pass.bar.district}
                      </p>
                      <p
                        style={{
                          color: "#94a3b8",
                          margin: 0,
                          fontSize: "0.8rem",
                        }}
                      >
                        {formatValidDays(pass.validity.validDays)}
                        {pass.validity.validHours && (
                          <>
                            <br />
                            {formatValidHours(pass.validity.validHours)}
                          </>
                        )}
                      </p>
                    </BarDetails>
                  </BarInfo>

                  {/* Pass Name and Type */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>
                        {getPassTypeIcon(pass.type)}
                      </span>
                      <h4
                        style={{
                          color: "#f8fafc",
                          margin: 0,
                          fontSize: "1.3rem",
                          fontWeight: "700",
                        }}
                      >
                        {pass.name}
                      </h4>
                    </div>
                    <p
                      style={{
                        color: "#94a3b8",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      {pass.description}
                    </p>
                  </div>

                  {/* Feature Badges */}
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

                  {/* Benefits */}
                  <div style={{ margin: "1.5rem 0" }}>
                    <h5
                      style={{
                        color: "#f8fafc",
                        margin: "0 0 0.75rem 0",
                        fontSize: "1rem",
                      }}
                    >
                      What&apos;s Included:
                    </h5>
                    {pass.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        style={{
                          color: "#94a3b8",
                          marginBottom: "0.5rem",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          fontSize: "0.9rem",
                          lineHeight: "1.4",
                        }}
                      >
                        <span style={{ color: "#10b981", flexShrink: 0 }}>
                          ✓
                        </span>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ margin: "1.5rem 0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                        color: "#94a3b8",
                      }}
                    >
                      <span>
                        {pass.capacity.available} of {pass.capacity.total}{" "}
                        available
                      </span>
                      <span>{Math.round(percentageSold)}% sold</span>
                    </div>
                    <ProgressBar $percentage={percentageSold} />
                  </div>

                  {/* Price and Purchase Button */}
                  <PriceSection>
                    <CurrentPrice>€{pass.price}</CurrentPrice>
                    {pass.originalPrice && pass.originalPrice > pass.price && (
                      <OriginalPrice>€{pass.originalPrice}</OriginalPrice>
                    )}
                  </PriceSection>

                  <PurchaseButton
                    $isSoldOut={isSoldOut}
                    onClick={() => handlePurchaseClick(pass)}
                    disabled={isSoldOut || purchasing === pass.id}
                  >
                    {purchasing === pass.id
                      ? "Processing..."
                      : isSoldOut
                      ? "Sold Out"
                      : `Buy Now - €${pass.price}`}
                  </PurchaseButton>
                </PassCard>
              );
            })}
          </PassGrid>
        )}

        {/* How It Works Section */}
        <HowItWorksSection>
          <h3
            style={{
              textAlign: "center",
              marginBottom: "3rem",
              color: "#f8fafc",
              fontSize: "2rem",
              fontWeight: "700",
            }}
          >
            How VIP Passes Work
          </h3>
          <StepGrid>
            {[
              {
                step: "1",
                icon: "📍",
                title: "Find Nearby Bars",
                description:
                  "Enable location to see VIP passes at bars closest to you with real-time distance calculations",
              },
              {
                step: "2",
                icon: "🛒",
                title: "Buy Pass",
                description:
                  "Purchase VIP pass in app for skip-the-line access and exclusive benefits",
              },
              {
                step: "3",
                icon: "📱",
                title: "Get QR Code",
                description:
                  "Receive unique QR code instantly in your VIP wallet within the app",
              },
              {
                step: "4",
                icon: "🎯",
                title: "Show & Enter",
                description:
                  "Present QR code at entrance to bypass queues and walk straight in",
              },
            ].map((step, index) => (
              <div key={index} style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#8b5cf6",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.step}
                </div>
                <h4
                  style={{
                    color: "#f8fafc",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </StepGrid>
        </HowItWorksSection>

        <style jsx global>{`
          @keyframes gradient {
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
        `}</style>
      </MarketplaceContainer>

      {/* Login Modal */}
      {showLoginModal && selectedPass && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>

            <ModalHeader>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
              <ModalTitle>Sign In to Continue</ModalTitle>
              <ModalDescription>
                Create an account or sign in to purchase VIP passes and unlock
                exclusive benefits
              </ModalDescription>
            </ModalHeader>

            <ModalBenefits>
              <h4
                style={{
                  color: "#f8fafc",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                Why Sign Up?
              </h4>
              <BenefitItem>
                <BenefitIcon>🎫</BenefitIcon>
                <span>Purchase VIP passes for skip-the-line access</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>💎</BenefitIcon>
                <span>Access exclusive deals and promotions</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>📱</BenefitIcon>
                <span>Manage all your passes in one place</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>⭐</BenefitIcon>
                <span>Earn rewards and special member benefits</span>
              </BenefitItem>
            </ModalBenefits>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>
                  {getPassTypeIcon(selectedPass.type)}
                </span>
                <h5 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                  {selectedPass.name}
                </h5>
              </div>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
                {selectedPass.bar.name} • €{selectedPass.price}
              </p>
            </div>

            <ModalActions>
              <SecondaryButton onClick={closeModal}>
                Maybe Later
              </SecondaryButton>
              <PrimaryButton onClick={handleLogin}>
                Sign In to Purchase
              </PrimaryButton>
            </ModalActions>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
                Don&apos;t have an account?
              </p>
              <button
                onClick={handleSignUp}
                style={{
                  background: "none",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  color: "#8b5cf6",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  width: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                  e.currentTarget.style.borderColor = "#8b5cf6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                }}
              >
                Create New Account
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPass && (
        <PaymentModalOverlay onClick={closeModal}>
          <PaymentModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>

            <ModalHeader>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💳</div>
              <ModalTitle>Complete Your Purchase</ModalTitle>
              <ModalDescription>
                Enter your payment details to purchase this VIP pass
              </ModalDescription>
            </ModalHeader>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>
                  {getPassTypeIcon(selectedPass.type)}
                </span>
                <h5 style={{ color: "#f8fafc", margin: 0, fontSize: "1rem" }}>
                  {selectedPass.name}
                </h5>
              </div>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
                {selectedPass.bar.name} • €{selectedPass.price}
              </p>
            </div>

            <PaymentForm>
              <div>
                <PaymentLabel>Card Number</PaymentLabel>
                <PaymentInput
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>

              <PaymentRow>
                <div style={{ flex: 1 }}>
                  <PaymentLabel>Expiry Date</PaymentLabel>
                  <PaymentInput
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/25"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <PaymentLabel>CVC</PaymentLabel>
                  <PaymentInput
                    type="text"
                    placeholder="123"
                    defaultValue="123"
                  />
                </div>
              </PaymentRow>

              <div>
                <PaymentLabel>Cardholder Name</PaymentLabel>
                <PaymentInput
                  type="text"
                  placeholder="John Doe"
                  defaultValue="John Doe"
                />
              </div>
            </PaymentForm>

            <ModalActions>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <FakePaymentButton onClick={handlePayment}>
                Pay €{selectedPass.price}
              </FakePaymentButton>
            </ModalActions>

            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(16, 185, 129, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "#10b981",
                fontSize: "0.9rem",
              }}
            >
              💳 This is a demo payment. No real money will be charged.
            </div>
          </PaymentModalContent>
        </PaymentModalOverlay>
      )}

      {/* Success Modal */}
      {showSuccessModal && purchaseResult && (
        <SuccessModalOverlay onClick={closeModal}>
          <SuccessModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>

            <ModalHeader>
              <SuccessIcon>🎉</SuccessIcon>
              <ModalTitle>Purchase Successful!</ModalTitle>
              <ModalDescription>
                Your VIP pass has been added to your wallet
              </ModalDescription>
            </ModalHeader>

            <QRCodeDisplay>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "2rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#64748b",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  📱
                </div>
                <div>QR Code Generated</div>
              </div>
              <QRCodeText>{purchaseResult.pass.qrCode}</QRCodeText>
            </QRCodeDisplay>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                color: "#10b981",
              }}
            >
              <strong>Expires:</strong>{" "}
              {new Date(purchaseResult.pass.expiresAt).toLocaleDateString()}
            </div>

            <ModalActions>
              <SecondaryButton onClick={closeModal}>
                Continue Browsing
              </SecondaryButton>
              <PrimaryButton onClick={handleViewWallet}>
                View in Wallet
              </PrimaryButton>
            </ModalActions>
          </SuccessModalContent>
        </SuccessModalOverlay>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModalOverlay onClick={closeModal}>
          <ErrorModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>×</CloseButton>

            <ModalHeader>
              <ErrorIcon>❌</ErrorIcon>
              <ModalTitle>Purchase Failed</ModalTitle>
              <ModalDescription>{errorMessage}</ModalDescription>
            </ModalHeader>

            <ModalActions>
              <PrimaryButton onClick={closeModal}>Try Again</PrimaryButton>
            </ModalActions>
          </ErrorModalContent>
        </ErrorModalOverlay>
      )}
    </>
  );
}
