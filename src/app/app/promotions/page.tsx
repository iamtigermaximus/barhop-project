// "use client";
// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ArrowLeft, Calendar, MapPin, Crown, Star } from "phosphor-react";
// import { useSession } from "next-auth/react";

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
//   max-width: 1200px;
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

// const Title = styled.h1`
//   font-family: ${({ theme }) => theme.fonts.dm};
//   font-size: 28px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   flex: 1;
// `;

// const Tabs = styled.div`
//   display: flex;
//   gap: 12px;
//   margin-bottom: 24px;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const Tab = styled.button<{ $active: boolean }>`
//   background: none;
//   border: none;
//   padding: 12px 0;
//   font-size: 16px;
//   font-weight: ${(props) => (props.$active ? "bold" : "normal")};
//   color: ${(props) =>
//     props.$active
//       ? props.theme.colors.primaryAccent
//       : props.theme.colors.textMuted};
//   cursor: pointer;
//   position: relative;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   &::after {
//     content: "";
//     position: absolute;
//     bottom: -1px;
//     left: 0;
//     right: 0;
//     height: 2px;
//     background: ${(props) =>
//       props.$active ? props.theme.colors.primaryAccent : "transparent"};
//   }
// `;

// const PromotionsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 16px;

//   @media (min-width: 480px) {
//     grid-template-columns: repeat(3, 1fr);
//   }

//   @media (min-width: 768px) {
//     grid-template-columns: repeat(4, 1fr);
//   }

//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(5, 1fr);
//   }
// `;

// const PromotionCard = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 12px;
//   overflow: hidden;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   transition: all 0.2s;
//   cursor: pointer;

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//     transform: translateY(-4px);
//   }
// `;

// const PromotionImage = styled.img`
//   width: 100%;
//   height: 140px;
//   object-fit: cover;
// `;

// const PromotionContent = styled.div`
//   padding: 12px;
// `;

// const PromotionTitle = styled.h3`
//   font-size: 14px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 4px;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const PromotionBar = styled.div`
//   font-size: 11px;
//   color: ${({ theme }) => theme.colors.textMuted};
//   margin-bottom: 8px;
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// const PromotionDiscount = styled.div`
//   font-size: 13px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.secondaryAccent};
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;

// const EmptyState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textMuted};
// `;

// interface BarPromotion {
//   id: string;
//   title: string;
//   description: string;
//   type: string;
//   discount: number | null;
//   barId: string;
//   bar?: { id: string; name: string; district?: string };
//   startDate: string;
//   endDate: string;
//   imageUrl?: string | null;
// }

// export default function PromotionsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [promotions, setPromotions] = useState<BarPromotion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"active" | "upcoming">(
//     searchParams.get("upcoming") === "true" ? "upcoming" : "active",
//   );

//   useEffect(() => {
//     fetchPromotions();
//   }, [activeTab]);

//   const fetchPromotions = async () => {
//     try {
//       setLoading(true);
//       const url =
//         activeTab === "active"
//           ? "/api/promotions?isActive=true&isApproved=true&limit=50"
//           : "/api/promotions?isApproved=true&limit=50&includeUpcoming=true";
//       const res = await fetch(url);
//       if (res.ok) {
//         const data = await res.json();
//         let promosArray = data.promotions || data.data || [];
//         if (!Array.isArray(promosArray)) promosArray = [];

//         const now = new Date();
//         if (activeTab === "active") {
//           promosArray = promosArray.filter((promo: BarPromotion) => {
//             const startDate = new Date(promo.startDate);
//             const endDate = new Date(promo.endDate);
//             return startDate <= now && endDate >= now;
//           });
//         } else {
//           promosArray = promosArray.filter((promo: BarPromotion) => {
//             const startDate = new Date(promo.startDate);
//             return startDate > now;
//           });
//         }

//         setPromotions(promosArray);
//       }
//     } catch (error) {
//       console.error("Error fetching promotions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPlaceholderImage = (): string => {
//     return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
//   };

//   if (loading) {
//     return (
//       <PageWrapper>
//         <Container>
//           <LoadingState>Loading promotions...</LoadingState>
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
//           <Title>Promotions</Title>
//         </Header>

//         <Tabs>
//           <Tab
//             $active={activeTab === "active"}
//             onClick={() => setActiveTab("active")}
//           >
//             Active
//           </Tab>
//           <Tab
//             $active={activeTab === "upcoming"}
//             onClick={() => setActiveTab("upcoming")}
//           >
//             Upcoming
//           </Tab>
//         </Tabs>

//         {promotions.length === 0 ? (
//           <EmptyState>No {activeTab} promotions found</EmptyState>
//         ) : (
//           <PromotionsGrid>
//             {promotions.map((promo) => (
//               <PromotionCard
//                 key={promo.id}
//                 onClick={() => router.push(`/app/promotions/${promo.id}`)}
//               >
//                 <PromotionImage
//                   src={promo.imageUrl || getPlaceholderImage()}
//                   alt={promo.title}
//                 />
//                 <PromotionContent>
//                   <PromotionTitle>{promo.title}</PromotionTitle>
//                   <PromotionBar>
//                     <MapPin size={12} /> {promo.bar?.name || "Venue"}
//                   </PromotionBar>
//                   {promo.discount && promo.discount > 0 ? (
//                     <PromotionDiscount>{promo.discount}% OFF</PromotionDiscount>
//                   ) : (
//                     <PromotionDiscount>Special Offer</PromotionDiscount>
//                   )}
//                 </PromotionContent>
//               </PromotionCard>
//             ))}
//           </PromotionsGrid>
//         )}
//       </Container>
//     </PageWrapper>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "phosphor-react";

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
  max-width: 1200px;
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

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primaryAccent
      : props.theme.colors.textMuted};
  cursor: pointer;
  position: relative;
  font-family: ${({ theme }) => theme.fonts.dm};

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) =>
      props.$active ? props.theme.colors.primaryAccent : "transparent"};
  }
`;

const PromotionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const PromotionCard = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-4px);
  }
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const PromotionContent = styled.div`
  padding: 12px;
`;

const PromotionTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
  font-family: ${({ theme }) => theme.fonts.dm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PromotionBar = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PromotionDiscount = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface BarPromotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: { id: string; name: string; district?: string };
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
}

export default function PromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<BarPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming">("active");

  useEffect(() => {
    fetchPromotions();
  }, [activeTab]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const url = `/api/promotions?limit=50&isApproved=true&includeUpcoming=true`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let promosArray = data.promotions || data.data || data;
        if (!Array.isArray(promosArray)) promosArray = [];

        const now = new Date();
        const filteredPromotions = promosArray.filter((promo: BarPromotion) => {
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);

          if (activeTab === "active") {
            return startDate <= now && endDate >= now;
          } else {
            return startDate > now;
          }
        });

        setPromotions(filteredPromotions);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderImage = (): string => {
    return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>Loading promotions...</LoadingState>
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
          <Title>Promotions</Title>
        </Header>

        <Tabs>
          <Tab
            $active={activeTab === "active"}
            onClick={() => setActiveTab("active")}
          >
            Active
          </Tab>
          <Tab
            $active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </Tab>
        </Tabs>

        {promotions.length === 0 ? (
          <EmptyState>No {activeTab} promotions found</EmptyState>
        ) : (
          <PromotionsGrid>
            {promotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                onClick={() => router.push(`/app/promotions/${promo.id}`)}
              >
                <PromotionImage
                  src={promo.imageUrl || getPlaceholderImage()}
                  alt={promo.title}
                />
                <PromotionContent>
                  <PromotionTitle>{promo.title}</PromotionTitle>
                  <PromotionBar>
                    <MapPin size={12} /> {promo.bar?.name || "Venue"}
                  </PromotionBar>
                  {promo.discount && promo.discount > 0 ? (
                    <PromotionDiscount>{promo.discount}% OFF</PromotionDiscount>
                  ) : (
                    <PromotionDiscount>Special Offer</PromotionDiscount>
                  )}
                </PromotionContent>
              </PromotionCard>
            ))}
          </PromotionsGrid>
        )}
      </Container>
    </PageWrapper>
  );
}
