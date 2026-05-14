// "use client";
// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import { useRouter, useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   Calendar,
//   MapPin,
//   Clock,
//   Tag,
//   Buildings,
// } from "phosphor-react";

// const PageWrapper = styled.div`
//   min-height: 100vh;
//   background: ${({ theme }) => theme.colors.primaryBackground};
//   padding: 16px;
//   padding-bottom: 80px;

//   @media (min-width: 768px) {
//     padding-left: 256px;
//     padding-right: 32px;
//     padding-bottom: 32px;
//   }
// `;

// const Container = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   width: 100%;
// `;

// const Header = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
//   margin-bottom: 24px;
// `;

// const BackButton = styled.button`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 12px;
//   padding: 8px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: ${({ theme }) => theme.colors.textPrimary};

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//   }
// `;

// const PromotionImage = styled.img`
//   width: 100%;
//   height: 250px;
//   object-fit: cover;
//   border-radius: 16px;
//   margin-bottom: 24px;
// `;

// const PromotionTitle = styled.h1`
//   font-size: 28px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 12px;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const PromotionType = styled.div<{ $type: string }>`
//   display: inline-block;
//   background: ${(props) => {
//     switch (props.$type) {
//       case "HAPPY_HOUR":
//         return "linear-gradient(135deg, #f59e0b, #d97706)";
//       case "DRINK_SPECIAL":
//         return "linear-gradient(135deg, #10b981, #059669)";
//       case "VIP_OFFER":
//         return "linear-gradient(135deg, #0ea5e9, #0284c7)";
//       default:
//         return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
//     }
//   }};
//   color: white;
//   padding: 6px 12px;
//   border-radius: 20px;
//   font-size: 12px;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 16px;
// `;

// const InfoSection = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 16px;
//   padding: 20px;
//   margin-bottom: 24px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const InfoRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   padding: 12px 0;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};

//   &:last-child {
//     border-bottom: none;
//   }
// `;

// const InfoIcon = styled.div`
//   width: 40px;
//   color: ${({ theme }) => theme.colors.primaryAccent};
// `;

// const InfoContent = styled.div`
//   flex: 1;
// `;

// const InfoLabel = styled.div`
//   font-size: 12px;
//   color: ${({ theme }) => theme.colors.textMuted};
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin-bottom: 4px;
// `;

// const InfoValue = styled.div`
//   font-size: 16px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const Description = styled.p`
//   font-size: 16px;
//   line-height: 1.6;
//   color: ${({ theme }) => theme.colors.textSecondary};
//   margin-bottom: 24px;
// `;

// const DiscountBadge = styled.div`
//   background: linear-gradient(135deg, #ff6b6b, #ee5a24);
//   color: white;
//   padding: 16px;
//   border-radius: 16px;
//   text-align: center;
//   margin-bottom: 24px;

//   span {
//     font-size: 36px;
//     font-weight: 800;
//     display: block;
//     font-family: ${({ theme }) => theme.fonts.mono};
//   }
// `;

// const CTASection = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-top: 24px;
// `;

// const CTAButton = styled.button`
//   flex: 1;
//   background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
//   border: none;
//   padding: 16px;
//   border-radius: 12px;
//   color: white;
//   font-weight: 700;
//   font-size: 16px;
//   cursor: pointer;
//   transition: all 0.3s;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   &:hover {
//     transform: translateY(-2px);
//     filter: brightness(1.05);
//   }
// `;

// const SecondaryButton = styled.button`
//   flex: 1;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   padding: 16px;
//   border-radius: 12px;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//   }
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   background: rgba(239, 68, 68, 0.1);
//   border-radius: 12px;
//   margin: 1rem;

//   button {
//     margin-top: 1rem;
//     padding: 0.5rem 1rem;
//     background: ${({ theme }) => theme.colors.primaryAccent};
//     border: none;
//     border-radius: 8px;
//     color: white;
//     cursor: pointer;
//   }
// `;

// interface BarPromotion {
//   id: string;
//   title: string;
//   description: string;
//   type: string;
//   discount: number | null;
//   barId: string;
//   bar?: { id: string; name: string; district?: string; city?: string };
//   startDate: string;
//   endDate: string;
//   imageUrl?: string | null;
//   accentColor?: string | null;
//   callToAction?: string | null;
// }

// export default function PromotionDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const [promotion, setPromotion] = useState<BarPromotion | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (params.id) {
//       fetchPromotionDetails();
//     }
//   }, [params.id]);

//   const fetchPromotionDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Fetching promotion with ID:", params.id);

//       // Try multiple approaches to get the promotion
//       let foundPromotion = null;

//       // Approach 1: Direct endpoint
//       try {
//         const res = await fetch(`/api/promotions/${params.id}`);
//         console.log("Direct endpoint response status:", res.status);

//         if (res.ok) {
//           const data = await res.json();
//           console.log("Direct endpoint data:", data);
//           foundPromotion = data.data || data;
//         }
//       } catch (err) {
//         console.log("Direct endpoint failed:", err);
//       }

//       // Approach 2: Search through all promotions if direct failed
//       if (!foundPromotion) {
//         try {
//           const res = await fetch("/api/promotions?limit=100&isApproved=true");
//           if (res.ok) {
//             const data = await res.json();
//             const promotions = data.promotions || data.data || data;
//             console.log("All promotions count:", promotions?.length);

//             if (Array.isArray(promotions)) {
//               foundPromotion = promotions.find(
//                 (p: BarPromotion) => p.id === params.id,
//               );
//               console.log("Found promotion in list:", foundPromotion?.id);
//             }
//           }
//         } catch (err) {
//           console.log("Search all promotions failed:", err);
//         }
//       }

//       if (foundPromotion) {
//         setPromotion(foundPromotion);
//       } else {
//         setError("Promotion not found");
//       }
//     } catch (error) {
//       console.error("Error fetching promotion details:", error);
//       setError("Failed to load promotion details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTypeIcon = (type: string): string => {
//     switch (type) {
//       case "HAPPY_HOUR":
//         return "🍻";
//       case "DRINK_SPECIAL":
//         return "🍹";
//       case "FOOD_SPECIAL":
//         return "🍽️";
//       case "LADIES_NIGHT":
//         return "👩‍🎤";
//       case "VIP_OFFER":
//         return "👑";
//       default:
//         return "🎉";
//     }
//   };

//   const getTypeLabel = (type: string): string => {
//     return type
//       .replace(/_/g, " ")
//       .toLowerCase()
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getPlaceholderImage = (): string => {
//     return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
//   };

//   if (loading) {
//     return (
//       <PageWrapper>
//         <Container>
//           <LoadingState>Loading promotion details...</LoadingState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   if (error || !promotion) {
//     return (
//       <PageWrapper>
//         <Container>
//           <Header>
//             <BackButton onClick={() => router.push("/app")}>
//               <ArrowLeft size={20} />
//             </BackButton>
//           </Header>
//           <ErrorState>
//             <p>{error || "Promotion not found"}</p>
//             <button onClick={() => router.push("/app")}>Back to Home</button>
//           </ErrorState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   return (
//     <PageWrapper>
//       <Container>
//         <Header>
//           <BackButton onClick={() => router.push("/app")}>
//             <ArrowLeft size={20} />
//           </BackButton>
//         </Header>

//         <PromotionImage
//           src={promotion.imageUrl || getPlaceholderImage()}
//           alt={promotion.title}
//         />

//         <PromotionType $type={promotion.type}>
//           {getTypeIcon(promotion.type)} {getTypeLabel(promotion.type)}
//         </PromotionType>

//         <PromotionTitle>{promotion.title}</PromotionTitle>

//         <Description>
//           {promotion.description || "No description available"}
//         </Description>

//         {promotion.discount && promotion.discount > 0 && (
//           <DiscountBadge>
//             🎉 Special Offer 🎉
//             <span>{promotion.discount}% OFF</span>
//           </DiscountBadge>
//         )}

//         <InfoSection>
//           <InfoRow>
//             <InfoIcon>
//               <Buildings size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Venue</InfoLabel>
//               <InfoValue>{promotion.bar?.name || "Venue"}</InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <MapPin size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Location</InfoLabel>
//               <InfoValue>
//                 {promotion.bar?.district || "City Center"},{" "}
//                 {promotion.bar?.city || "Helsinki"}
//               </InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <Calendar size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Valid From</InfoLabel>
//               <InfoValue>{formatDate(promotion.startDate)}</InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <Clock size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Valid Until</InfoLabel>
//               <InfoValue>{formatDate(promotion.endDate)}</InfoValue>
//             </InfoContent>
//           </InfoRow>

//           <InfoRow>
//             <InfoIcon>
//               <Tag size={24} />
//             </InfoIcon>
//             <InfoContent>
//               <InfoLabel>Promotion Type</InfoLabel>
//               <InfoValue>{getTypeLabel(promotion.type)}</InfoValue>
//             </InfoContent>
//           </InfoRow>
//         </InfoSection>

//         <CTASection>
//           <SecondaryButton
//             onClick={() => router.push(`/app/bars/${promotion.barId}`)}
//           >
//             View Venue
//           </SecondaryButton>
//           <CTAButton>{promotion.callToAction || "Get Offer"} →</CTAButton>
//         </CTASection>
//       </Container>
//     </PageWrapper>
//   );
// }
"use client";
import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Buildings,
} from "phosphor-react";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};
  padding: 16px;
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding-left: 256px;
    padding-right: 32px;
    padding-bottom: 32px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const PromotionTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PromotionType = styled.div<{ $type: string }>`
  display: inline-block;
  background: ${(props) => {
    switch (props.$type) {
      case "HAPPY_HOUR":
        return "linear-gradient(135deg, #f59e0b, #d97706)";
      case "DRINK_SPECIAL":
        return "linear-gradient(135deg, #10b981, #059669)";
      case "FOOD_SPECIAL":
        return "linear-gradient(135deg, #ec4899, #be185d)";
      case "LADIES_NIGHT":
        return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
      case "VIP_OFFER":
        return "linear-gradient(135deg, #0ea5e9, #0284c7)";
      default:
        return "linear-gradient(135deg, #6b7280, #4b5563)";
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  color: ${({ theme }) => theme.colors.primaryAccent};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const DiscountBadge = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 16px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 24px;

  span {
    font-size: 36px;
    font-weight: 800;
    display: block;
    font-family: ${({ theme }) => theme.fonts.mono};
  }
`;

const CTASection = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const CTAButton = styled.button`
  flex: 2;
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  border: none;
  padding: 16px;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 1rem;

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: ${({ theme }) => theme.colors.primaryAccent};
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }
`;

interface BarPromotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: { id: string; name: string; district?: string; city?: string };
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  accentColor?: string | null;
  callToAction?: string | null;
}

export default function PromotionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [promotion, setPromotion] = useState<BarPromotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const promotionId = params.id as string;
      console.log("Fetching promotion with ID:", promotionId);

      let foundPromotion = null;

      // Approach 1: Try direct endpoint
      try {
        const res = await fetch(`/api/promotions/${promotionId}`);
        console.log("Direct endpoint status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("Direct endpoint data:", data);
          foundPromotion = data.data || data;
        }
      } catch (err) {
        console.log("Direct endpoint failed:", err);
      }

      // Approach 2: Search through active promotions
      if (!foundPromotion) {
        try {
          const res = await fetch(
            "/api/promotions?limit=200&isActive=true&isApproved=true",
          );
          if (res.ok) {
            const data = await res.json();
            const promotions = data.promotions || data.data || data;

            if (Array.isArray(promotions)) {
              foundPromotion = promotions.find(
                (p: BarPromotion) => String(p.id) === String(promotionId),
              );
              console.log("Found in active promotions:", foundPromotion?.id);
            }
          }
        } catch (err) {
          console.log("Active promotions fetch failed:", err);
        }
      }

      // Approach 3: Search through upcoming promotions (includeUpcoming=true)
      if (!foundPromotion) {
        try {
          const res = await fetch(
            "/api/promotions?limit=200&includeUpcoming=true&isApproved=true",
          );
          if (res.ok) {
            const data = await res.json();
            const promotions = data.promotions || data.data || data;

            if (Array.isArray(promotions)) {
              console.log("Upcoming promotions count:", promotions.length);
              foundPromotion = promotions.find(
                (p: BarPromotion) => String(p.id) === String(promotionId),
              );
              console.log("Found in upcoming promotions:", foundPromotion?.id);
            }
          }
        } catch (err) {
          console.log("Upcoming promotions fetch failed:", err);
        }
      }

      // Approach 4: Search through all promotions without filters
      if (!foundPromotion) {
        try {
          const res = await fetch("/api/promotions?limit=500");
          if (res.ok) {
            const data = await res.json();
            const promotions = data.promotions || data.data || data;

            if (Array.isArray(promotions)) {
              foundPromotion = promotions.find(
                (p: BarPromotion) => String(p.id) === String(promotionId),
              );
              console.log("Found in all promotions:", foundPromotion?.id);
            }
          }
        } catch (err) {
          console.log("All promotions fetch failed:", err);
        }
      }

      if (foundPromotion) {
        setPromotion(foundPromotion);
      } else {
        console.error("Promotion not found for ID:", promotionId);
        setError("Promotion not found");
      }
    } catch (error) {
      console.error("Error fetching promotion details:", error);
      setError("Failed to load promotion details");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchPromotionDetails();
    }
  }, [params.id, fetchPromotionDetails]);

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "HAPPY_HOUR":
        return "🍻";
      case "DRINK_SPECIAL":
        return "🍹";
      case "FOOD_SPECIAL":
        return "🍽️";
      case "LADIES_NIGHT":
        return "👩‍🎤";
      case "VIP_OFFER":
        return "👑";
      default:
        return "🎉";
    }
  };

  const getTypeLabel = (type: string): string => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlaceholderImage = (): string => {
    return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>Loading promotion details...</LoadingState>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !promotion) {
    return (
      <PageWrapper>
        <Container>
          <Header>
            <BackButton onClick={() => router.push("/app")}>
              <ArrowLeft size={20} />
            </BackButton>
          </Header>
          <ErrorState>
            <p>{error || "Promotion not found"}</p>
            <p style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
              Promotion ID: {params.id}
            </p>
            <button onClick={() => router.push("/app")}>Back to Home</button>
          </ErrorState>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <BackButton onClick={() => router.push("/app")}>
            <ArrowLeft size={20} />
          </BackButton>
        </Header>

        <PromotionImage
          src={promotion.imageUrl || getPlaceholderImage()}
          alt={promotion.title}
        />

        <PromotionType $type={promotion.type}>
          {getTypeIcon(promotion.type)} {getTypeLabel(promotion.type)}
        </PromotionType>

        <PromotionTitle>{promotion.title}</PromotionTitle>

        <Description>
          {promotion.description || "Check out this amazing offer!"}
        </Description>

        {promotion.discount && promotion.discount > 0 && (
          <DiscountBadge>
            🎉 Special Offer 🎉
            <span>{promotion.discount}% OFF</span>
          </DiscountBadge>
        )}

        <InfoSection>
          <InfoRow>
            <InfoIcon>
              <Buildings size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Venue</InfoLabel>
              <InfoValue>{promotion.bar?.name || "Venue"}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <MapPin size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>
                {promotion.bar?.district || "City Center"},{" "}
                {promotion.bar?.city || "Helsinki"}
              </InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <Calendar size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Valid From</InfoLabel>
              <InfoValue>{formatDate(promotion.startDate)}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <Clock size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Valid Until</InfoLabel>
              <InfoValue>{formatDate(promotion.endDate)}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <Tag size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Promotion Type</InfoLabel>
              <InfoValue>{getTypeLabel(promotion.type)}</InfoValue>
            </InfoContent>
          </InfoRow>
        </InfoSection>

        <CTASection>
          <SecondaryButton
            onClick={() => router.push(`/app/bars/${promotion.barId}`)}
          >
            View Venue
          </SecondaryButton>
          <CTAButton>{promotion.callToAction || "Get Offer"} →</CTAButton>
        </CTASection>
      </Container>
    </PageWrapper>
  );
}
