// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import {
//   ActionButton,
//   Address,
//   BackButton,
//   BarMeta,
//   BarName,
//   Container,
//   ContentGrid,
//   Description,
//   ErrorState,
//   Feature,
//   FeaturesGrid,
//   FeatureText,
//   Header,
//   LoadingState,
//   MainContent,
//   SecondaryButton,
//   Sidebar,
//   Tag,
//   VipPrice,
//   VipTag,
// } from "./BarDetails.styles";

// interface Bar {
//   id: string;
//   name: string;
//   description: string | null;
//   address: string;
//   district: string;
//   type: string;
//   vipEnabled: boolean;
//   vipPrice: number | null;
//   city: {
//     id: string;
//     name: string;
//     country: string;
//   };
//   // Add fields that exist in your schema
//   phone?: string | null;
//   website?: string | null;
//   imageUrl?: string | null;
//   latitude?: number;
//   longitude?: number;
// }

// export default function BarDetails() {
//   const params = useParams();
//   const [bar, setBar] = useState<Bar | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAction, setSelectedAction] = useState<
//     "vip" | "plan" | "group"
//   >();

//   useEffect(() => {
//     const fetchBar = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/bars/${params.id}`);

//         if (!response.ok) {
//           if (response.status === 404) {
//             setError("Bar not found");
//           } else {
//             setError("Failed to fetch bar details");
//           }
//           return;
//         }

//         const barData = await response.json();
//         setBar(barData);
//       } catch (err) {
//         setError("Error fetching bar details");
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (params.id) {
//       fetchBar();
//     }
//   }, [params.id]);

//   // Add handler functions to use the state
//   const handleVipClick = () => {
//     setSelectedAction("vip");
//     // Add your VIP logic here
//     console.log("VIP selected");
//   };

//   const handlePlanClick = () => {
//     setSelectedAction("plan");
//     // Add your plan logic here
//     console.log("Plan visit selected");
//   };

//   const handleGroupClick = () => {
//     setSelectedAction("group");
//     // Add your group logic here
//     console.log("Create group selected");
//   };

//   const getBarFeatures = () => {
//     if (!bar) return [];

//     const features = [];

//     if (bar.vipEnabled) {
//       features.push({ icon: "⭐", text: "VIP Skip-the-Line" });
//     }

//     if (bar.type === "CLUB") {
//       features.push({ icon: "💃", text: "Dance Floor" });
//       features.push({ icon: "🎵", text: "Live DJ" });
//     }

//     if (bar.type === "LOUNGE" || bar.type === "COCKTAIL_BAR") {
//       features.push({ icon: "🍸", text: "Craft Cocktails" });
//     }

//     if (bar.type === "SPORTS_BAR") {
//       features.push({ icon: "📺", text: "Sports Screens" });
//     }

//     if (bar.type === "LIVE_MUSIC") {
//       features.push({ icon: "🎤", text: "Live Music" });
//     }

//     return features;
//   };

//   if (loading) {
//     return (
//       <Container>
//         <LoadingState>Loading bar details...</LoadingState>
//       </Container>
//     );
//   }

//   if (error || !bar) {
//     return (
//       <Container>
//         <ErrorState>{error || "Bar not found"}</ErrorState>
//       </Container>
//     );
//   }

//   const features = getBarFeatures();

//   return (
//     <Container>
//       <BackButton href="/bars">← Back to All Bars</BackButton>

//       <Header>
//         <BarName>{bar.name}</BarName>
//         <BarMeta>
//           <Tag>{bar.city.name}</Tag>
//           <Tag>{bar.district}</Tag>
//           <Tag>{bar.type.replace("_", " ")}</Tag>
//           {bar.vipEnabled && <VipTag>VIP Available</VipTag>}
//         </BarMeta>
//         <Address>{bar.address}</Address>
//       </Header>

//       <ContentGrid>
//         <MainContent>
//           <Description>
//             {bar.description ||
//               "Experience great nightlife at this popular venue."}
//           </Description>

//           {features.length > 0 && (
//             <>
//               <h2
//                 style={{
//                   color: "#f8fafc",
//                   fontSize: "1.5rem",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 Features
//               </h2>
//               <FeaturesGrid>
//                 {features.map((feature, index) => (
//                   <Feature key={index}>
//                     <span>{feature.icon}</span>
//                     <FeatureText>{feature.text}</FeatureText>
//                   </Feature>
//                 ))}
//               </FeaturesGrid>
//             </>
//           )}
//         </MainContent>

//         <Sidebar>
//           {bar.vipEnabled && bar.vipPrice && (
//             <>
//               <VipPrice>VIP: €{bar.vipPrice}</VipPrice>
//               <ActionButton onClick={handleVipClick}>Buy VIP Pass</ActionButton>
//             </>
//           )}

//           <ActionButton onClick={handlePlanClick}>Plan Visit</ActionButton>

//           <SecondaryButton onClick={handleGroupClick}>
//             Create Group
//           </SecondaryButton>

//           {/* Quick Info */}
//           <div
//             style={{
//               marginTop: "2rem",
//               paddingTop: "2rem",
//               borderTop: "1px solid #334155",
//             }}
//           >
//             <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
//               Quick Info
//             </h3>
//             <div style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>
//               <p>
//                 📍 {bar.district}, {bar.city.name}
//               </p>
//               <p>🏷️ {bar.type.replace("_", " ")}</p>
//               {bar.vipEnabled && <p>⭐ Skip-the-line available</p>}
//             </div>
//           </div>
//         </Sidebar>
//       </ContentGrid>
//     </Container>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";

// Types
interface City {
  id: string;
  name: string;
  country: string;
}

interface SocialActivity {
  activeUsersCount: number;
  socialMeetupsCount: number;
  isHotspot: boolean;
  heatLevel: number;
}

interface OperatingHours {
  [key: string]: { open: string; close: string };
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  type:
    | "HAPPY_HOUR"
    | "LADIES_NIGHT"
    | "LIVE_MUSIC"
    | "THEME_NIGHT"
    | "DRINK_SPECIAL";
  startTime: string;
  endTime: string;
  discount?: string;
  days: string[];
  isActive: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Rating {
  average: number;
  count: number;
  recentReviews: Review[];
}

interface Transport {
  metroStations?: string[];
  busStops?: string[];
  parking: boolean;
  bikeParking: boolean;
  notes?: string;
}

interface ValidHours {
  start: string;
  end: string;
}

interface VIPPassEnhanced {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  soldCount: number;
  totalQuantity: number;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  validityStart: Date;
  validityEnd: Date;
  validDays: string[];
  validHours: ValidHours;
  isActive: boolean;
}

interface EnhancedBar {
  id: string;
  name: string;
  description: string | null;
  district: string;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  address: string;
  city: City;
  phone?: string | null;
  website?: string | null;
  imageUrl?: string | null;
  latitude: number;
  longitude: number;
  priceLevel?: number;
  features?: string[];
  socialActivity?: SocialActivity;
  operatingHours?: OperatingHours;
  currentPromotions?: Promotion[];
  rating?: Rating;
  transport?: Transport;
  vipPassesEnhanced?: VIPPassEnhanced[];
  distance?: number;
  isOpen?: boolean;
  crowdLevel?: "quiet" | "moderate" | "busy" | "very-busy";
  estimatedWait?: number;
  nextOpening?: string;
  currentHappyHour?: boolean;
}

// Styled Components (keep all your existing styled components exactly as they were)
const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  /* background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  ); */
  min-height: 100vh;
  animation: gradientShift 8s ease infinite;

  @media (min-width: 768px) {
    padding: 3rem 10rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem 10rem;
  }
  /* @keyframes gradientShift {
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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(14, 165, 233, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  } */
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;

  &:hover {
    color: #f8fafc;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
  background-color: transparent !important;
`;

const BarName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const BarMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  background-color: transparent !important;
`;

const Tag = styled.span`
  background: #334155;
  color: #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const VipTag = styled(Tag)`
  background: #0284c7;
  color: white;
`;

const Address = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  background-color: transparent !important;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  background-color: transparent !important;
`;

const Description = styled.p`
  color: #e2e8f0;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeatureText = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const Sidebar = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #334155;
  height: fit-content;

  .quick-info {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #334155;

    h3 {
      color: #f8fafc;
      margin-bottom: 1rem;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #e2e8f0;
      font-size: 0.875rem;

      a {
        color: #0ea5e9;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const ActionButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: gradientShift 4s ease infinite;

  &:hover {
    background: #0369a1;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #475569;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  background: transparent;
  color: #f8fafc;
  border: 2px solid #475569;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5e9;
    transform: translateY(-2px);
  }
`;

const VipPrice = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #e2e8f0;
  font-size: 1.125rem;
  background-color: transparent !important;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ef4444;
  font-size: 1.125rem;
`;

const StatusBadge = styled.span<{ $isOpen: boolean }>`
  background: ${(props) =>
    props.$isOpen ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.$isOpen ? "#22c55e" : "#ef4444")};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid
    ${(props) =>
      props.$isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"};
`;

const CrowdIndicator = styled.span<{ $level: string }>`
  background: ${(props) =>
    props.$level === "quiet"
      ? "rgba(34, 197, 94, 0.2)"
      : props.$level === "moderate"
      ? "rgba(234, 179, 8, 0.2)"
      : props.$level === "busy"
      ? "rgba(249, 115, 22, 0.2)"
      : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) =>
    props.$level === "quiet"
      ? "#22c55e"
      : props.$level === "moderate"
      ? "#eab308"
      : props.$level === "busy"
      ? "#f97316"
      : "#ef4444"};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid
    ${(props) =>
      props.$level === "quiet"
        ? "rgba(34, 197, 94, 0.3)"
        : props.$level === "moderate"
        ? "rgba(234, 179, 8, 0.3)"
        : props.$level === "busy"
        ? "rgba(249, 115, 22, 0.3)"
        : "rgba(239, 68, 68, 0.3)"};
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #334155;
  flex-wrap: wrap;
  background-color: transparent !important;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.$isActive ? "#0ea5e9" : "#94a3b8")};
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$isActive ? "#0ea5e9" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    color: #f8fafc;
  }
`;

const SocialActivityPanel = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }
`;

const OperatingHoursTable = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .hours-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #334155;

    &:last-child {
      border-bottom: none;
    }

    .day {
      color: #e2e8f0;
      font-weight: 500;
    }

    .hours {
      color: #22c55e;
      font-weight: 600;

      &.closed {
        color: #ef4444;
      }
    }
  }
`;

const PromotionCard = styled.div<{ $type: string }>`
  background: ${(props) =>
    props.$type === "HAPPY_HOUR"
      ? "rgba(234, 179, 8, 0.1)"
      : props.$type === "LADIES_NIGHT"
      ? "rgba(236, 72, 153, 0.1)"
      : props.$type === "LIVE_MUSIC"
      ? "rgba(139, 92, 246, 0.1)"
      : props.$type === "THEME_NIGHT"
      ? "rgba(249, 115, 22, 0.1)"
      : "rgba(16, 185, 129, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$type === "HAPPY_HOUR"
        ? "rgba(234, 179, 8, 0.2)"
        : props.$type === "LADIES_NIGHT"
        ? "rgba(236, 72, 153, 0.2)"
        : props.$type === "LIVE_MUSIC"
        ? "rgba(139, 92, 246, 0.2)"
        : props.$type === "THEME_NIGHT"
        ? "rgba(249, 115, 22, 0.2)"
        : "rgba(16, 185, 129, 0.2)"};
  border-radius: 8px;
  padding: 1.5rem;

  .promo-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;

    .promo-icon {
      font-size: 1.5rem;
    }

    .promo-title {
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .promo-description {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
    }
  }

  .promo-details {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    .promo-time,
    .promo-days,
    .promo-discount {
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .promo-discount {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }
  }
`;

const TransportDetails = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .transport-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .transport-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;

    .transport-icon {
      font-size: 1.5rem;
    }

    .transport-title {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .transport-info {
      color: #e2e8f0;
      font-size: 0.9rem;
    }
  }

  .transport-notes {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 6px;
    color: #3b82f6;
    font-size: 0.9rem;
  }
`;

const RatingSection = styled.div`
  .rating-overview {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: transparent !important;
    border-radius: 12px;
    border: 1px solid #334155;

    .rating-score {
      text-align: center;

      .rating-number {
        font-size: 3rem;
        font-weight: 700;
        color: #f8fafc;
      }

      .rating-stars {
        font-size: 1.2rem;
        margin: 0.5rem 0;
      }

      .rating-count {
        color: #94a3b8;
        font-size: 0.9rem;
      }
    }
  }

  .reviews-list {
    h3 {
      color: #f8fafc;
      margin-bottom: 1rem;
    }
  }
`;

const ReviewCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #334155;

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .reviewer-info {
      .reviewer-name {
        color: #f8fafc;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .review-date {
        color: #94a3b8;
        font-size: 0.8rem;
      }
    }

    .review-rating {
      color: #fbbf24;
    }
  }

  .review-comment {
    color: #e2e8f0;
    line-height: 1.5;
  }
`;

const VipPassesSection = styled.div`
  .vip-passes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .vip-pass-card {
    background: rgba(30, 41, 59, 0.5);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #334155;
    transition: all 0.3s ease;

    &:hover {
      border-color: #8b5cf6;
      transform: translateY(-2px);
    }

    .vip-pass-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;

      .vip-pass-name {
        color: #f8fafc;
        margin: 0;
        font-size: 1.2rem;
      }

      .vip-pass-price {
        text-align: right;

        .current-price {
          color: #f8fafc;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .original-price {
          color: #94a3b8;
          text-decoration: line-through;
          font-size: 1rem;
          margin-left: 0.5rem;
        }
      }
    }

    .vip-pass-description {
      color: #94a3b8;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .vip-pass-benefits {
      margin-bottom: 1rem;

      .benefit-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #e2e8f0;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
    }

    .vip-pass-details {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1.5rem;

      .detail-item {
        color: #94a3b8;
        font-size: 0.8rem;

        strong {
          color: #e2e8f0;
        }
      }
    }

    .buy-vip-button {
      width: 100%;
      background: linear-gradient(45deg, #8b5cf6, #a855f7);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }
    }
  }
`;

const ImageGallery = styled.div`
  h2 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }
`;

const MapSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #334155;

  h3 {
    color: #f8fafc;
    margin-bottom: 1rem;
  }

  .map-placeholder {
    border-radius: 8px;
    overflow: hidden;
  }
`;

// Main Component
export default function BarDetails() {
  const params = useParams();
  const router = useRouter();
  const [bar, setBar] = useState<EnhancedBar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "vip" | "plan" | "group"
  >();
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "photos" | "vip"
  >("overview");

  useEffect(() => {
    const fetchBar = async () => {
      try {
        setLoading(true);

        if (!params.id) {
          throw new Error("Bar ID is required");
        }

        const response = await fetch(`/api/bars/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Bar not found");
          }
          throw new Error(`Failed to fetch bar: ${response.status}`);
        }

        const barData: EnhancedBar = await response.json();

        // Enhance bar with calculated fields
        const enhancedBar = {
          ...barData,
          isOpen: calculateIsOpen(barData.operatingHours),
          crowdLevel: calculateCrowdLevel(barData.socialActivity),
          estimatedWait: calculateEstimatedWait(barData.socialActivity),
          currentHappyHour: calculateCurrentHappyHour(
            barData.currentPromotions
          ),
        };

        setBar(enhancedBar);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching bar details"
        );
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBar();
  }, [params.id]);

  // Helper functions for calculated fields
  const calculateIsOpen = (operatingHours?: OperatingHours): boolean => {
    if (!operatingHours) return false;

    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    const todaysHours = operatingHours[today];

    if (!todaysHours || todaysHours.open === "Closed") return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Handle closing times after midnight
    if (todaysHours.close < todaysHours.open) {
      return currentTime >= todaysHours.open;
    } else {
      return (
        currentTime >= todaysHours.open && currentTime <= todaysHours.close
      );
    }
  };

  const calculateCrowdLevel = (
    socialActivity?: SocialActivity
  ): "quiet" | "moderate" | "busy" | "very-busy" => {
    if (!socialActivity) return "quiet";

    if (socialActivity.activeUsersCount >= 20) return "very-busy";
    if (socialActivity.activeUsersCount >= 10) return "busy";
    if (socialActivity.activeUsersCount >= 5) return "moderate";
    return "quiet";
  };

  const calculateEstimatedWait = (socialActivity?: SocialActivity): number => {
    if (!socialActivity) return 0;

    if (socialActivity.activeUsersCount >= 20) return 30;
    if (socialActivity.activeUsersCount >= 10) return 15;
    if (socialActivity.activeUsersCount >= 5) return 5;
    return 0;
  };

  const calculateCurrentHappyHour = (promotions?: Promotion[]): boolean => {
    if (!promotions) return false;

    const now = new Date();
    const currentDay = now.toLocaleString("en-us", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5);

    return promotions.some(
      (promo) =>
        promo.type === "HAPPY_HOUR" &&
        promo.isActive &&
        promo.days.includes(currentDay) &&
        currentTime >= promo.startTime &&
        currentTime <= promo.endTime
    );
  };

  const handleVipClick = () => {
    setSelectedAction("vip");
    setActiveTab("vip");
  };

  const handlePlanClick = () => {
    setSelectedAction("plan");
    router.push(`/plan-visit?bar=${bar?.id}`);
  };

  // const handleGroupClick = () => {
  //   setSelectedAction("group");
  //   router.push(`/groups/create?bar=${bar?.id}`);
  // };

  const getTodayHours = (): { open: string; close: string } | undefined => {
    if (!bar?.operatingHours) return undefined;
    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    return bar.operatingHours[today];
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div style={{ textAlign: "center" }}>
            {/* <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎪</div> */}
            <p>Loading bar details...</p>
          </div>
        </LoadingState>
      </Container>
    );
  }

  if (error || !bar) {
    return (
      <Container>
        <ErrorState>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <p>{error || "Bar not found"}</p>
            <BackButton href="/bars">← Back to All Bars</BackButton>
          </div>
        </ErrorState>
      </Container>
    );
  }

  const todayHours = getTodayHours();
  const isOpen = calculateIsOpen(bar.operatingHours);

  return (
    <Container>
      <BackButton href="/bars">← Back to All Bars</BackButton>

      <Header>
        <BarName>{bar.name}</BarName>
        <BarMeta>
          <Tag>{bar.city.name}</Tag>
          <Tag>{bar.district}</Tag>
          <Tag>{bar.type.replace("_", " ")}</Tag>
          {bar.vipEnabled && <VipTag>VIP Available</VipTag>}
          {bar.socialActivity?.isHotspot && (
            <Tag
              style={{
                background: "rgba(249, 115, 22, 0.2)",
                color: "#f97316",
                border: "1px solid rgba(249, 115, 22, 0.3)",
              }}
            >
              🔥 Hotspot
            </Tag>
          )}
        </BarMeta>
        <Address>{bar.address}</Address>

        {/* Quick Status Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <StatusBadge $isOpen={isOpen}>
            {isOpen ? "🟢 Open Now" : "🔴 Closed"}
          </StatusBadge>
          {isOpen && todayHours && (
            <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Today: {todayHours.open} - {todayHours.close}
            </span>
          )}
          {bar.crowdLevel && (
            <CrowdIndicator $level={bar.crowdLevel}>
              {bar.crowdLevel === "quiet" && "😴 Quiet"}
              {bar.crowdLevel === "moderate" && "😊 Moderate"}
              {bar.crowdLevel === "busy" && "🔥 Busy"}
              {bar.crowdLevel === "very-busy" && "💥 Very Busy"}
            </CrowdIndicator>
          )}
          {bar.estimatedWait && (
            <span
              style={{
                background: "rgba(59, 130, 246, 0.2)",
                color: "#3b82f6",
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              ⏱️ {bar.estimatedWait} min wait
            </span>
          )}
        </div>
      </Header>

      {/* Navigation Tabs */}
      <TabNavigation>
        <Tab
          $isActive={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Tab>
        <Tab
          $isActive={activeTab === "reviews"}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({bar.rating?.count || 0})
        </Tab>
        <Tab
          $isActive={activeTab === "vip"}
          onClick={() => setActiveTab("vip")}
        >
          VIP Passes ({bar.vipPassesEnhanced?.length || 0})
        </Tab>
        <Tab
          $isActive={activeTab === "photos"}
          onClick={() => setActiveTab("photos")}
        >
          Photos
        </Tab>
      </TabNavigation>

      <ContentGrid>
        <MainContent>
          {activeTab === "overview" && (
            <>
              <Description>{bar.description}</Description>

              {/* Social Activity */}
              {bar.socialActivity && (
                <SocialActivityPanel>
                  <h3>Live Activity</h3>
                  <div
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>👥</span>
                      <div>
                        <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                          {bar.socialActivity.activeUsersCount}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          People here
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>🎯</span>
                      <div>
                        <div style={{ fontWeight: "600", color: "#f8fafc" }}>
                          {bar.socialActivity.socialMeetupsCount}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          Active meetups
                        </div>
                      </div>
                    </div>
                  </div>
                </SocialActivityPanel>
              )}

              {/* Features */}
              {bar.features && bar.features.length > 0 && (
                <>
                  <h2
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    Features & Amenities
                  </h2>
                  <FeaturesGrid>
                    {bar.features.map((feature, index) => (
                      <Feature key={index}>
                        <span>✅</span>
                        <FeatureText>{feature}</FeatureText>
                      </Feature>
                    ))}
                  </FeaturesGrid>
                </>
              )}

              {/* Operating Hours */}
              {bar.operatingHours && (
                <OperatingHoursTable>
                  <h3>Operating Hours</h3>
                  {Object.entries(bar.operatingHours).map(([day, hours]) => (
                    <div key={day} className="hours-row">
                      <span className="day">{day}</span>
                      <span
                        className={`hours ${
                          hours.open === "Closed" ? "closed" : ""
                        }`}
                      >
                        {hours.open === "Closed"
                          ? "Closed"
                          : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </OperatingHoursTable>
              )}

              {/* Current Promotions */}
              {bar.currentPromotions && bar.currentPromotions.length > 0 && (
                <>
                  <h2
                    style={{
                      color: "#f8fafc",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    Current Promotions
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {bar.currentPromotions.map((promo) => (
                      <PromotionCard key={promo.id} $type={promo.type}>
                        <div className="promo-header">
                          <span className="promo-icon">
                            {promo.type === "HAPPY_HOUR" && "🎉"}
                            {promo.type === "LADIES_NIGHT" && "👩‍🎤"}
                            {promo.type === "LIVE_MUSIC" && "🎵"}
                            {promo.type === "THEME_NIGHT" && "🎭"}
                            {promo.type === "DRINK_SPECIAL" && "🍹"}
                          </span>
                          <div>
                            <h4 className="promo-title">{promo.title}</h4>
                            <p className="promo-description">
                              {promo.description}
                            </p>
                          </div>
                        </div>
                        <div className="promo-details">
                          <span className="promo-time">
                            {promo.startTime} - {promo.endTime}
                          </span>
                          <span className="promo-days">
                            {promo.days.join(", ")}
                          </span>
                          {promo.discount && (
                            <span className="promo-discount">
                              {promo.discount}
                            </span>
                          )}
                        </div>
                      </PromotionCard>
                    ))}
                  </div>
                </>
              )}

              {/* Transport Information */}
              {bar.transport && (
                <TransportDetails>
                  <h3>Getting Here</h3>
                  <div className="transport-grid">
                    {bar.transport.metroStations &&
                      bar.transport.metroStations.length > 0 && (
                        <div className="transport-item">
                          <span className="transport-icon">🚇</span>
                          <div>
                            <div className="transport-title">Metro</div>
                            <div className="transport-info">
                              {bar.transport.metroStations.join(", ")}
                            </div>
                          </div>
                        </div>
                      )}
                    {bar.transport.busStops &&
                      bar.transport.busStops.length > 0 && (
                        <div className="transport-item">
                          <span className="transport-icon">🚌</span>
                          <div>
                            <div className="transport-title">Bus</div>
                            <div className="transport-info">
                              {bar.transport.busStops.join(", ")}
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="transport-item">
                      <span className="transport-icon">🅿️</span>
                      <div>
                        <div className="transport-title">Parking</div>
                        <div className="transport-info">
                          {bar.transport.parking
                            ? "Available"
                            : "Limited/Street parking"}
                        </div>
                      </div>
                    </div>
                    <div className="transport-item">
                      <span className="transport-icon">🚲</span>
                      <div>
                        <div className="transport-title">Bike Parking</div>
                        <div className="transport-info">
                          {bar.transport.bikeParking
                            ? "Available"
                            : "Not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {bar.transport.notes && (
                    <div className="transport-notes">
                      <strong>Note:</strong> {bar.transport.notes}
                    </div>
                  )}
                </TransportDetails>
              )}
            </>
          )}

          {activeTab === "reviews" && bar.rating && (
            <RatingSection>
              <div className="rating-overview">
                <div className="rating-score">
                  <div className="rating-number">
                    {bar.rating.average.toFixed(1)}
                  </div>
                  <div className="rating-stars">{"⭐".repeat(5)}</div>
                  <div className="rating-count">{bar.rating.count} reviews</div>
                </div>
              </div>
              <div className="reviews-list">
                <h3>Recent Reviews</h3>
                {bar.rating.recentReviews.map((review) => (
                  <ReviewCard key={review.id}>
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-name">{review.userName}</div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="review-rating">
                        {"⭐".repeat(review.rating)}
                      </div>
                    </div>
                    <div className="review-comment">{review.comment}</div>
                  </ReviewCard>
                ))}
              </div>
            </RatingSection>
          )}

          {activeTab === "vip" &&
            bar.vipPassesEnhanced &&
            bar.vipPassesEnhanced.length > 0 && (
              <VipPassesSection>
                <h2>VIP Passes</h2>
                <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
                  Skip the line and enjoy exclusive benefits with our VIP passes
                </p>
                <div className="vip-passes-grid">
                  {bar.vipPassesEnhanced.map((pass) => (
                    <div key={pass.id} className="vip-pass-card">
                      <div className="vip-pass-header">
                        <h3 className="vip-pass-name">{pass.name}</h3>
                        <div className="vip-pass-price">
                          <span className="current-price">
                            €{(pass.priceCents / 100).toFixed(2)}
                          </span>
                          {pass.originalPriceCents &&
                            pass.originalPriceCents > pass.priceCents && (
                              <span className="original-price">
                                €{(pass.originalPriceCents / 100).toFixed(2)}
                              </span>
                            )}
                        </div>
                      </div>
                      <p className="vip-pass-description">{pass.description}</p>
                      <div className="vip-pass-benefits">
                        {pass.benefits.map((benefit, index) => (
                          <div key={index} className="benefit-item">
                            <span>✅</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                      <div className="vip-pass-details">
                        <div className="detail-item">
                          <strong>Valid:</strong> {pass.validDays.join(", ")}
                        </div>
                        <div className="detail-item">
                          <strong>Hours:</strong> {pass.validHours.start} -{" "}
                          {pass.validHours.end}
                        </div>
                        <div className="detail-item">
                          <strong>Availability:</strong> {pass.soldCount}/
                          {pass.totalQuantity} sold
                        </div>
                      </div>
                      <button
                        className="buy-vip-button"
                        onClick={() =>
                          router.push(`/marketplace?pass=${pass.id}`)
                        }
                      >
                        Buy Now - €{(pass.priceCents / 100).toFixed(2)}
                      </button>
                    </div>
                  ))}
                </div>
              </VipPassesSection>
            )}

          {activeTab === "photos" && (
            <ImageGallery>
              <h2>Photos</h2>
              <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
                Coming soon - Photo gallery feature
              </p>
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "12px",
                  padding: "3rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  border: "2px dashed #334155",
                }}
              >
                🏗️ Photo Gallery Coming Soon
              </div>
            </ImageGallery>
          )}
        </MainContent>

        <Sidebar>
          {bar.vipEnabled && bar.vipPrice && (
            <>
              <VipPrice>VIP from €{bar.vipPrice}</VipPrice>
              <ActionButton onClick={handleVipClick}>
                View VIP Passes
              </ActionButton>
            </>
          )}

          {/* <ActionButton onClick={handlePlanClick}>Plan Visit</ActionButton>

          <SecondaryButton onClick={handleGroupClick}>
            Create Group
          </SecondaryButton> */}

          {/* Quick Info */}
          <div className="quick-info">
            <h3>Quick Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>📍 District:</strong>
                <span>
                  {bar.district}, {bar.city.name}
                </span>
              </div>
              <div className="info-item">
                <strong>🏷️ Type:</strong>
                <span>{bar.type.replace("_", " ")}</span>
              </div>
              {bar.priceLevel && (
                <div className="info-item">
                  <strong>💰 Price Level:</strong>
                  <span>{"€".repeat(bar.priceLevel)}</span>
                </div>
              )}
              {bar.phone && (
                <div className="info-item">
                  <strong>📞 Phone:</strong>
                  <span>{bar.phone}</span>
                </div>
              )}
              {bar.website && (
                <div className="info-item">
                  <strong>🌐 Website:</strong>
                  <a
                    href={bar.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <MapSection>
            <h3>Location</h3>
            <div className="map-placeholder">
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "8px",
                  padding: "2rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  border: "1px solid #334155",
                }}
              >
                🗺️ Interactive Map
                <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  {bar.address}
                </div>
              </div>
            </div>
          </MapSection>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
}
