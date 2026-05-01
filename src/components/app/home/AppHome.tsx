// // "use client";
// // import { useEffect, useState, useRef } from "react";
// // import styled, { keyframes } from "styled-components";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";

// // //  ANIMATIONS
// // const autoScroll = keyframes`
// //   0% {
// //     transform: translateX(0);
// //   }
// //   100% {
// //     transform: translateX(-50%);
// //   }
// // `;

// // // --- Promo Slider Wrapper (Keep both old and new for compatibility) ---
// // const PromoSliderWrapper = styled.div`
// //   position: relative;
// //   margin: 0 -0.5rem;
// //   overflow: hidden;
// //   mask: linear-gradient(90deg, transparent, white 5%, white 95%, transparent);
// //   @media (min-width: 768px) {
// //     margin: 0 -1rem;
// //   }
// //   @media (min-width: 1024px) {
// //     margin: 0 -1.5rem;
// //   }
// // `;

// // const PromoSlider = styled.div<{ $duration: number }>`
// //   display: flex;
// //   gap: 1rem;
// //   padding: 0.5rem;
// //   width: max-content;
// //   animation: ${autoScroll} ${(props) => props.$duration}ms linear infinite;
// //   &:hover {
// //     animation-play-state: paused;
// //   }
// //   @media (min-width: 768px) {
// //     gap: 1.5rem;
// //     padding: 1rem;
// //   }
// //   @media (min-width: 1024px) {
// //     gap: 2rem;
// //     padding: 1.5rem;
// //   }
// // `;

// // // --- NEW: Slider Track & Slides ---
// // const PromoSliderTrack = styled.div<{ $currentIndex: number }>`
// //   display: flex;
// //   transition: transform 0.5s ease-out;
// //   transform: translateX(-${(props) => props.$currentIndex * 100}%);
// // `;

// // const PromoSlide = styled.div`
// //   flex: 0 0 100%;
// //   padding: 0 0.5rem;

// //   @media (min-width: 640px) {
// //     flex: 0 0 50%;
// //   }

// //   /* @media (min-width: 1024px) {
// //     flex: 0 0 33.333%;
// //   }

// //   @media (min-width: 1280px) {
// //     flex: 0 0 25%;
// //   } */
// // `;

// // // --- Navigation Buttons ---
// // const NavButton = styled.button<{ $direction: "left" | "right" }>`
// //   position: absolute;
// //   top: 50%;
// //   ${(props) =>
// //     props.$direction === "left" ? "left: 0.5rem" : "right: 0.5rem"};
// //   transform: translateY(-50%);
// //   width: 36px;
// //   height: 36px;
// //   border-radius: 50%;
// //   background: rgba(0, 0, 0, 0.6);
// //   backdrop-filter: blur(4px);
// //   border: 1px solid rgba(255, 255, 255, 0.2);
// //   color: white;
// //   cursor: pointer;
// //   z-index: 10;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-size: 1.5rem;
// //   transition: all 0.2s ease;

// //   &:hover {
// //     background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
// //     transform: translateY(-50%) scale(1.1);
// //   }

// //   @media (min-width: 768px) {
// //     width: 44px;
// //     height: 44px;
// //     font-size: 1.8rem;
// //   }
// // `;

// // // --- Dots Indicator ---
// // const DotsContainer = styled.div`
// //   display: flex;
// //   justify-content: center;
// //   gap: 0.5rem;
// //   margin-top: 1rem;
// // `;

// // const Dot = styled.button<{ $active: boolean }>`
// //   width: ${(props) => (props.$active ? "24px" : "8px")};
// //   height: 8px;
// //   border-radius: 4px;
// //   background: ${(props) =>
// //     props.$active ? "#8b5cf6" : "rgba(255, 255, 255, 0.3)"};
// //   border: none;
// //   cursor: pointer;
// //   transition: all 0.3s ease;
// //   padding: 0;
// // `;

// // // --- Promo Card (Unchanged) ---
// // const PromoCard = styled.div`
// //   flex: 0 0 280px;
// //   background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
// //   border-radius: 16px;
// //   padding: 1.25rem;
// //   color: white;
// //   position: relative;
// //   overflow: hidden;
// //   min-height: 130px;
// //   cursor: pointer;
// //   transition: transform 0.3s ease;
// //   &:hover {
// //     transform: translateY(-4px);
// //   }
// //   &::before {
// //     content: "";
// //     position: absolute;
// //     top: -50%;
// //     right: -50%;
// //     width: 100%;
// //     height: 100%;
// //     background: radial-gradient(
// //       circle,
// //       rgba(255, 255, 255, 0.1) 0%,
// //       transparent 70%
// //     );
// //   }
// //   @media (min-width: 640px) {
// //     flex: 0 0 320px;
// //     min-height: 150px;
// //     padding: 1.5rem;
// //   }
// //   @media (min-width: 768px) {
// //     flex: 0 0 380px;
// //     min-height: 170px;
// //     padding: 1.75rem;
// //   }
// //   @media (min-width: 1024px) {
// //     flex: 0 0 420px;
// //     min-height: 190px;
// //     padding: 2rem;
// //   }
// // `;

// // const PromoTitle = styled.h3`
// //   font-size: 1rem;
// //   font-weight: 700;
// //   margin: 0 0 0.5rem 0;
// //   position: relative;
// //   z-index: 2;
// //   @media (min-width: 768px) {
// //     font-size: 1.25rem;
// //     margin-bottom: 0.75rem;
// //   }
// //   @media (min-width: 1024px) {
// //     font-size: 1.5rem;
// //     margin-bottom: 1rem;
// //   }
// // `;

// // const PromoDescription = styled.p`
// //   font-size: 0.8rem;
// //   opacity: 0.9;
// //   margin: 0;
// //   position: relative;
// //   z-index: 2;
// //   line-height: 1.4;
// //   @media (min-width: 768px) {
// //     font-size: 0.9rem;
// //   }
// //   @media (min-width: 1024px) {
// //     font-size: 1rem;
// //   }
// // `;

// // const ResponsiveContainer = styled.div`
// //   padding: 1rem 1rem 5rem;
// //   min-height: 100vh;
// //   background: linear-gradient(
// //     -45deg,
// //     rgb(9, 9, 11),
// //     rgb(24, 20, 31),
// //     rgb(9, 9, 11),
// //     rgb(21, 17, 23)
// //   );
// //   background-size: 400% 400%;
// //   animation: gradientShift 12s ease infinite;
// //   @media (min-width: 640px) {
// //     padding: 1.5rem 1.5rem 6rem;
// //   }
// //   @media (min-width: 768px) {
// //     padding: 2rem 2rem 7rem;
// //   }
// //   @media (min-width: 1024px) {
// //     padding: 2rem 3rem 8rem;
// //     max-width: 1600px;
// //     margin: 0 auto;
// //   }
// //   @keyframes gradientShift {
// //     0% {
// //       background-position: 0% 50%;
// //     }
// //     50% {
// //       background-position: 100% 50%;
// //     }
// //     100% {
// //       background-position: 0% 50%;
// //     }
// //   }
// // `;

// // const Section = styled.section`
// //   margin-bottom: 2rem;
// //   &:last-child {
// //     margin-bottom: 0;
// //   }
// //   @media (min-width: 768px) {
// //     margin-bottom: 2.5rem;
// //   }
// //   @media (min-width: 1024px) {
// //     margin-bottom: 3rem;
// //   }
// // `;

// // const SectionHeader = styled.div`
// //   display: flex;
// //   justify-content: space-between;
// //   align-items: center;
// //   margin-bottom: 1rem;
// //   padding: 0 0.25rem;
// //   @media (min-width: 768px) {
// //     margin-bottom: 1.25rem;
// //     padding: 0;
// //   }
// //   @media (min-width: 1024px) {
// //     margin-bottom: 1.5rem;
// //   }
// // `;

// // const SectionTitle = styled.h2`
// //   color: #f8fafc;
// //   font-size: 1.25rem;
// //   font-weight: 700;
// //   margin: 0;
// //   @media (min-width: 768px) {
// //     font-size: 1.5rem;
// //   }
// //   @media (min-width: 1024px) {
// //     font-size: 1.75rem;
// //   }
// // `;

// // const ViewAllButton = styled(Link)`
// //   color: #0ea5e9;
// //   font-size: 0.8rem;
// //   font-weight: 600;
// //   text-decoration: none;
// //   transition: color 0.2s ease;
// //   &:hover {
// //     color: #38bdf8;
// //     text-decoration: underline;
// //   }
// //   @media (min-width: 768px) {
// //     font-size: 0.9rem;
// //   }
// //   @media (min-width: 1024px) {
// //     font-size: 1rem;
// //   }
// // `;

// // const BarsContainer = styled.div`
// //   @media (max-width: 1023px) {
// //     display: flex;
// //     gap: 1rem;
// //     overflow-x: auto;
// //     padding: 0.5rem 0.25rem;
// //     scrollbar-width: thin;
// //     &::-webkit-scrollbar {
// //       height: 6px;
// //     }
// //     &::-webkit-scrollbar-track {
// //       background: rgba(30, 41, 59, 0.5);
// //       border-radius: 3px;
// //     }
// //     &::-webkit-scrollbar-thumb {
// //       background: rgba(139, 92, 246, 0.5);
// //       border-radius: 3px;
// //     }
// //   }
// //   @media (min-width: 1024px) {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
// //     gap: 1.5rem;
// //   }
// // `;

// // const BarCard = styled(Link)`
// //   background: rgba(30, 41, 59, 0.8);
// //   backdrop-filter: blur(10px);
// //   border-radius: 12px;
// //   padding: 0.875rem;
// //   text-decoration: none;
// //   border: 1px solid rgba(255, 255, 255, 0.1);
// //   transition: all 0.3s ease;
// //   min-height: 170px;
// //   overflow: hidden;
// //   &:hover {
// //     border-color: rgba(139, 92, 246, 0.4);
// //     transform: translateY(-4px);
// //     background: rgba(30, 41, 59, 0.95);
// //   }
// //   @media (max-width: 1023px) {
// //     flex: 0 0 160px;
// //     min-height: 180px;
// //   }
// //   @media (min-width: 1024px) {
// //     min-height: 240px;
// //     padding: 1rem;
// //   }
// // `;

// // const BarImageContainer = styled.div`
// //   width: 100%;
// //   height: 80px;
// //   border-radius: 8px;
// //   margin-bottom: 0.75rem;
// //   overflow: hidden;
// //   position: relative;
// //   background: #1e293b;
// //   @media (min-width: 768px) {
// //     height: 100px;
// //   }
// //   @media (min-width: 1024px) {
// //     height: 140px;
// //   }
// // `;

// // const StyledImage = styled(Image)`
// //   object-fit: cover;
// // `;

// // const BarName = styled.h3`
// //   color: #f8fafc;
// //   font-size: 0.85rem;
// //   font-weight: 600;
// //   margin: 0 0 0.25rem 0;
// //   line-height: 1.3;
// //   display: -webkit-box;
// //   -webkit-line-clamp: 2;
// //   -webkit-box-orient: vertical;
// //   overflow: hidden;
// //   @media (min-width: 768px) {
// //     font-size: 0.95rem;
// //   }
// // `;

// // const BarLocation = styled.p`
// //   color: #94a3b8;
// //   font-size: 0.7rem;
// //   margin: 0;
// //   display: -webkit-box;
// //   -webkit-line-clamp: 2;
// //   -webkit-box-orient: vertical;
// //   overflow: hidden;
// //   @media (min-width: 768px) {
// //     font-size: 0.75rem;
// //   }
// // `;

// // const DistanceBadge = styled.span`
// //   background: rgba(14, 165, 233, 0.2);
// //   color: #0ea5e9;
// //   padding: 0.2rem 0.5rem;
// //   border-radius: 12px;
// //   font-size: 0.65rem;
// //   font-weight: 600;
// //   display: inline-block;
// //   margin-top: 0.25rem;
// // `;

// // const VIPContainer = styled.div`
// //   @media (max-width: 1023px) {
// //     display: flex;
// //     gap: 1rem;
// //     overflow-x: auto;
// //     padding: 0.5rem 0.25rem;
// //   }
// //   @media (min-width: 1024px) {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
// //     gap: 1.5rem;
// //   }
// // `;

// // const VIPCard = styled(Link)`
// //   background: linear-gradient(
// //     135deg,
// //     rgba(139, 92, 246, 0.15),
// //     rgba(14, 165, 233, 0.15)
// //   );
// //   backdrop-filter: blur(10px);
// //   border: 1px solid rgba(139, 92, 246, 0.3);
// //   border-radius: 12px;
// //   padding: 0.875rem;
// //   text-decoration: none;
// //   transition: all 0.3s ease;
// //   min-height: 110px;
// //   &:hover {
// //     border-color: rgba(139, 92, 246, 0.6);
// //     transform: translateY(-4px);
// //   }
// //   @media (max-width: 1023px) {
// //     flex: 0 0 180px;
// //     min-height: 120px;
// //   }
// // `;

// // const VIPTitle = styled.h3`
// //   color: #f8fafc;
// //   font-size: 0.85rem;
// //   font-weight: 700;
// //   margin: 0 0 0.5rem 0;
// //   display: -webkit-box;
// //   -webkit-line-clamp: 2;
// //   -webkit-box-orient: vertical;
// //   overflow: hidden;
// // `;

// // const VIPPrice = styled.div`
// //   color: #0ea5e9;
// //   font-size: 0.9rem;
// //   font-weight: 700;
// // `;

// // const PromotionsContainer = styled.div`
// //   @media (max-width: 1023px) {
// //     display: flex;
// //     gap: 1rem;
// //     overflow-x: auto;
// //     padding: 0.5rem 0.25rem;
// //   }
// //   @media (min-width: 1024px) {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
// //     gap: 1.5rem;
// //   }
// // `;

// // const PromotionCard = styled.div`
// //   background: rgba(30, 41, 59, 0.8);
// //   backdrop-filter: blur(10px);
// //   border-radius: 12px;
// //   padding: 0.875rem;
// //   border: 1px solid rgba(34, 197, 94, 0.3);
// //   cursor: pointer;
// //   transition: all 0.3s ease;
// //   min-height: 130px;
// //   position: relative;
// //   &:hover {
// //     transform: translateY(-4px);
// //     border-color: rgba(34, 197, 94, 0.5);
// //   }
// //   &::before {
// //     content: "";
// //     position: absolute;
// //     top: 0;
// //     left: 0;
// //     right: 0;
// //     height: 3px;
// //     background: linear-gradient(90deg, #22c55e, #16a34a);
// //     border-radius: 12px 12px 0 0;
// //   }
// //   @media (max-width: 1023px) {
// //     flex: 0 0 180px;
// //     min-height: 140px;
// //   }
// // `;

// // const PromotionTitle = styled.h3`
// //   color: #f8fafc;
// //   font-size: 0.85rem;
// //   font-weight: 600;
// //   margin: 0 0 0.5rem 0;
// //   display: -webkit-box;
// //   -webkit-line-clamp: 2;
// //   -webkit-box-orient: vertical;
// //   overflow: hidden;
// // `;

// // const PromotionDescription = styled.p`
// //   color: #94a3b8;
// //   font-size: 0.7rem;
// //   margin: 0 0 0.5rem 0;
// //   display: -webkit-box;
// //   -webkit-line-clamp: 2;
// //   -webkit-box-orient: vertical;
// //   overflow: hidden;
// // `;

// // const CrawlsContainer = styled.div`
// //   @media (max-width: 1023px) {
// //     display: flex;
// //     gap: 1rem;
// //     overflow-x: auto;
// //     padding: 0.5rem 0.25rem;
// //   }
// //   @media (min-width: 1024px) {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
// //     gap: 1.5rem;
// //   }
// // `;

// // const CrawlCard = styled(Link)`
// //   background: linear-gradient(
// //     135deg,
// //     rgba(236, 72, 153, 0.15),
// //     rgba(168, 85, 247, 0.15)
// //   );
// //   backdrop-filter: blur(10px);
// //   border: 1px solid rgba(236, 72, 153, 0.3);
// //   border-radius: 12px;
// //   padding: 1rem;
// //   text-decoration: none;
// //   transition: all 0.3s ease;
// //   min-height: 120px;
// //   &:hover {
// //     border-color: rgba(236, 72, 153, 0.6);
// //     transform: translateY(-4px);
// //   }
// //   @media (max-width: 1023px) {
// //     flex: 0 0 220px;
// //   }
// // `;

// // const CrawlTitle = styled.h3`
// //   color: #f8fafc;
// //   font-size: 0.9rem;
// //   font-weight: 700;
// //   margin: 0 0 0.5rem 0;
// // `;

// // const CrawlDate = styled.div`
// //   color: #ec4899;
// //   font-size: 0.75rem;
// //   font-weight: 600;
// //   margin-bottom: 0.5rem;
// // `;

// // const CrawlParticipants = styled.div`
// //   color: #94a3b8;
// //   font-size: 0.7rem;
// // `;

// // const CategoryGrid = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(2, 1fr);
// //   gap: 0.75rem;
// //   @media (min-width: 480px) {
// //     grid-template-columns: repeat(3, 1fr);
// //   }
// //   @media (min-width: 640px) {
// //     grid-template-columns: repeat(4, 1fr);
// //     gap: 1rem;
// //   }
// //   @media (min-width: 768px) {
// //     grid-template-columns: repeat(5, 1fr);
// //   }
// //   @media (min-width: 1024px) {
// //     grid-template-columns: repeat(6, 1fr);
// //     gap: 1.25rem;
// //   }
// //   @media (min-width: 1280px) {
// //     grid-template-columns: repeat(8, 1fr);
// //     gap: 1.5rem;
// //   }
// // `;

// // const CategoryCard = styled(Link)`
// //   background: rgba(30, 41, 59, 0.8);
// //   backdrop-filter: blur(10px);
// //   border-radius: 12px;
// //   padding: 1rem 0.5rem;
// //   text-decoration: none;
// //   text-align: center;
// //   border: 1px solid rgba(255, 255, 255, 0.1);
// //   transition: all 0.3s ease;
// //   min-height: 70px;
// //   display: flex;
// //   flex-direction: column;
// //   align-items: center;
// //   justify-content: center;
// //   &:hover {
// //     border-color: rgba(139, 92, 246, 0.4);
// //     transform: translateY(-2px);
// //     background: rgba(30, 41, 59, 0.95);
// //   }
// //   @media (min-width: 768px) {
// //     padding: 1.25rem 0.5rem;
// //     min-height: 90px;
// //   }
// // `;

// // const CategoryIcon = styled.div`
// //   font-size: 1.25rem;
// //   margin-bottom: 0.35rem;
// //   @media (min-width: 768px) {
// //     font-size: 1.75rem;
// //     margin-bottom: 0.5rem;
// //   }
// // `;

// // const CategoryName = styled.div`
// //   color: #f8fafc;
// //   font-size: 0.7rem;
// //   font-weight: 600;
// //   line-height: 1.2;
// //   @media (min-width: 768px) {
// //     font-size: 0.8rem;
// //   }
// // `;

// // const LoadingState = styled.div`
// //   text-align: center;
// //   padding: 3rem;
// //   color: #94a3b8;
// // `;

// // const ErrorState = styled.div`
// //   text-align: center;
// //   padding: 2rem;
// //   color: #ef4444;
// //   background: rgba(239, 68, 68, 0.1);
// //   border-radius: 12px;
// //   margin: 1rem;
// // `;

// // // ============================================
// // // 3. INTERFACES (UNCHANGED)
// // // ============================================
// // interface Bar {
// //   id: string;
// //   name: string;
// //   district: string | null;
// //   type: string;
// //   cityName: string | null;
// //   imageUrl: string | null;
// //   coverImage: string | null;
// //   logoUrl: string | null;
// //   vipEnabled: boolean;
// //   address: string;
// //   latitude: number | null;
// //   longitude: number | null;
// //   distance?: number;
// // }

// // interface VIPPassEnhanced {
// //   id: string;
// //   name: string;
// //   priceCents: number;
// //   barId: string;
// //   bar?: { id: string; name: string };
// //   benefits: string[];
// // }

// // interface BarPromotion {
// //   id: string;
// //   title: string;
// //   description: string;
// //   type: string;
// //   discount: number | null;
// //   barId: string;
// //   bar?: { id: string; name: string };
// //   endDate: string;
// // }

// // interface Crawl {
// //   id: string;
// //   name: string;
// //   date: string;
// //   startTime: string;
// //   maxParticipants: number;
// //   currentParticipants: number;
// //   city?: { name: string };
// // }

// // const categoryIcons: { [key: string]: string } = {
// //   PUB: "🍺",
// //   CLUB: "🎵",
// //   LOUNGE: "🍸",
// //   COCKTAIL_BAR: "🥃",
// //   RESTAURANT_BAR: "🍽️",
// //   SPORTS_BAR: "🏈",
// //   KARAOKE: "🎤",
// //   LIVE_MUSIC: "🎸",
// // };

// // const getPlaceholderImage = (barType: string): string => {
// //   const placeholders: { [key: string]: string } = {
// //     PUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017446/hoppr/images/pubimage_qrgtvj.jpg",
// //     CLUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg",
// //     LOUNGE:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017475/hoppr/images/loungebar_vsckbj.jpg",
// //     COCKTAIL_BAR:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017569/hoppr/images/cocktailbar_d2egc9.jpg",
// //     RESTAURANT_BAR:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017593/hoppr/images/restobar_mvqdhu.jpg",
// //     SPORTS_BAR:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017615/hoppr/images/sportsbar_sdws1w.jpg",
// //     KARAOKE:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017637/hoppr/images/karaokebar_tbrp5g.jpg",
// //     LIVE_MUSIC:
// //       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017658/hoppr/images/livemusicbar_qzvxq7.jpg",
// //   };
// //   return (
// //     placeholders[barType] ||
// //     "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg"
// //   );
// // };

// // const promotionalData = [
// //   {
// //     id: 1,
// //     title: "Weekend Special",
// //     description: "50% off all VIP passes this weekend",
// //     link: "/app/vip-pass",
// //   },
// //   {
// //     id: 2,
// //     title: "New Bars Added",
// //     description: "Discover new partner venues in your area",
// //     link: "/app/bars",
// //   },
// //   {
// //     id: 3,
// //     title: "Happy Hour Extended",
// //     description: "Enjoy extended happy hours all week long",
// //     link: "/app/promotions",
// //   },
// //   {
// //     id: 4,
// //     title: "VIP Membership",
// //     description: "Become a VIP member for exclusive benefits",
// //     link: "/app/vip-pass",
// //   },
// //   {
// //     id: 5,
// //     title: "Bar Crawls",
// //     description: "Join our biggest bar hopping events",
// //     link: "/app/crawls",
// //   },
// //   {
// //     id: 6,
// //     title: "Student Night",
// //     description: "Special discounts for students every Wednesday",
// //     link: "/app/promotions",
// //   },
// // ];

// // const calculateDistance = (
// //   lat1: number,
// //   lon1: number,
// //   lat2: number,
// //   lon2: number,
// // ): number => {
// //   const R = 6371;
// //   const dLat = ((lat2 - lat1) * Math.PI) / 180;
// //   const dLon = ((lon2 - lon1) * Math.PI) / 180;
// //   const a =
// //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //     Math.cos((lat1 * Math.PI) / 180) *
// //       Math.cos((lat2 * Math.PI) / 180) *
// //       Math.sin(dLon / 2) *
// //       Math.sin(dLon / 2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   return R * c;
// // };

// // const formatDistance = (distance: number): string => {
// //   if (distance < 1) return `${Math.round(distance * 1000)}m`;
// //   return `${distance.toFixed(1)}km`;
// // };

// // // ============================================
// // // 5. MAIN COMPONENT
// // // ============================================
// // const AppHome = () => {
// //   const router = useRouter();
// //   const [bars, setBars] = useState<Bar[]>([]);
// //   const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
// //   const [promotions, setPromotions] = useState<BarPromotion[]>([]);
// //   const [crawls, setCrawls] = useState<Crawl[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [userLocation, setUserLocation] = useState<{
// //     latitude: number;
// //     longitude: number;
// //   } | null>(null);
// //   const [locationLoaded, setLocationLoaded] = useState(false);

// //   // NEW: Slider state
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [slidesPerView, setSlidesPerView] = useState(1);

// //   const duplicatedPromos = [...promotionalData, ...promotionalData];

// //   // Update slides per view on resize
// //   useEffect(() => {
// //     const updateSlidesPerView = () => {
// //       const width = window.innerWidth;
// //       if (width >= 1280) setSlidesPerView(4);
// //       else if (width >= 1024) setSlidesPerView(3);
// //       else if (width >= 640) setSlidesPerView(2);
// //       else setSlidesPerView(1);
// //     };

// //     updateSlidesPerView();
// //     window.addEventListener("resize", updateSlidesPerView);
// //     return () => window.removeEventListener("resize", updateSlidesPerView);
// //   }, []);

// //   const totalSlides = Math.ceil(duplicatedPromos.length / slidesPerView);
// //   const maxIndex = Math.max(0, totalSlides - 1);

// //   const nextSlide = () => {
// //     setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
// //   };

// //   const prevSlide = () => {
// //     setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
// //   };

// //   // Auto-slide on desktop
// //   useEffect(() => {
// //     if (slidesPerView > 1) {
// //       const interval = setInterval(nextSlide, 5000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [slidesPerView, currentIndex]);

// //   // Get user location
// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           console.log(
// //             "📍 Location obtained:",
// //             position.coords.latitude,
// //             position.coords.longitude,
// //           );
// //           setUserLocation({
// //             latitude: position.coords.latitude,
// //             longitude: position.coords.longitude,
// //           });
// //           setLocationLoaded(true);
// //         },
// //         (error) => {
// //           console.log("📍 Location denied or error:", error.message);
// //           setLocationLoaded(true);
// //           setUserLocation(null);
// //         },
// //       );
// //     } else {
// //       console.log("📍 Geolocation not supported");
// //       setLocationLoaded(true);
// //       setUserLocation(null);
// //     }
// //   }, []);

// //   // Fetch data
// //   useEffect(() => {
// //     if (locationLoaded) {
// //       fetchHomeData();
// //     }
// //   }, [locationLoaded]);

// //   const fetchHomeData = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       let barsUrl = "/api/bars?limit=12&isActive=true";
// //       if (userLocation) {
// //         barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;
// //         console.log("📍 Fetching bars with location:", userLocation);
// //       } else {
// //         console.log("📍 Fetching bars without location");
// //       }

// //       console.log("📡 Fetching URL:", barsUrl);

// //       const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
// //         fetch(barsUrl),
// //         fetch("/api/vip/passes?limit=6&isActive=true"),
// //         fetch("/api/promotions?limit=6&isActive=true&isApproved=true"),
// //         fetch("/api/crawls?limit=3&status=UPCOMING"),
// //       ]);

// //       if (barsRes.ok) {
// //         const barsData = await barsRes.json();
// //         console.log("📦 Bars API response received");

// //         let barsArray = barsData;
// //         if (barsData.data) barsArray = barsData.data;
// //         if (barsData.bars) barsArray = barsData.bars;
// //         if (!Array.isArray(barsArray)) barsArray = [];

// //         console.log(`📊 Found ${barsArray.length} bars`);

// //         const barsWithDistance = barsArray.map((bar: Bar) => {
// //           let distance = bar.distance;
// //           if (!distance && userLocation && bar.latitude && bar.longitude) {
// //             distance = calculateDistance(
// //               userLocation.latitude,
// //               userLocation.longitude,
// //               bar.latitude,
// //               bar.longitude,
// //             );
// //           }
// //           return { ...bar, distance };
// //         });

// //         if (userLocation) {
// //           barsWithDistance.sort((a: Bar, b: Bar) => {
// //             if (a.distance === undefined && b.distance === undefined) return 0;
// //             if (a.distance === undefined) return 1;
// //             if (b.distance === undefined) return -1;
// //             return a.distance - b.distance;
// //           });
// //         }

// //         setBars(barsWithDistance.slice(0, 8));
// //         console.log(`✅ Loaded ${barsWithDistance.length} bars for homepage`);
// //       } else {
// //         console.error("Bars API failed:", barsRes.status);
// //       }

// //       if (vipRes.ok) {
// //         const vipData = await vipRes.json();
// //         let vipArray = vipData;
// //         if (vipData.passes) vipArray = vipData.passes;
// //         if (vipData.data) vipArray = vipData.data;
// //         if (!Array.isArray(vipArray)) vipArray = [];
// //         setVipPasses(vipArray.slice(0, 6));
// //         console.log(`✅ Loaded ${vipArray.length} VIP passes`);
// //       }

// //       if (promotionsRes.ok) {
// //         const promotionsData = await promotionsRes.json();
// //         let promosArray = promotionsData;
// //         if (promotionsData.promotions) promosArray = promotionsData.promotions;
// //         if (promotionsData.data) promosArray = promotionsData.data;
// //         if (!Array.isArray(promosArray)) promosArray = [];
// //         setPromotions(promosArray.slice(0, 6));
// //         console.log(`✅ Loaded ${promosArray.length} promotions`);
// //       }

// //       if (crawlsRes.ok) {
// //         const crawlsData = await crawlsRes.json();
// //         let crawlsArray = crawlsData;
// //         if (crawlsData.crawls) crawlsArray = crawlsData.crawls;
// //         if (crawlsData.data) crawlsArray = crawlsData.data;
// //         if (!Array.isArray(crawlsArray)) crawlsArray = [];
// //         setCrawls(crawlsArray.slice(0, 3));
// //         console.log(`✅ Loaded ${crawlsArray.length} crawls`);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching home data:", error);
// //       setError("Failed to load data. Please refresh the page.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handlePromoClick = (promo: (typeof promotionalData)[0]) => {
// //     router.push(promo.link);
// //   };

// //   const handlePromotionClick = (promotion: BarPromotion) => {
// //     router.push(`/app/bars/${promotion.barId}`);
// //   };

// //   const getBarImage = (bar: Bar): string => {
// //     if (bar.coverImage || bar.imageUrl || bar.logoUrl) {
// //       return bar.coverImage || bar.imageUrl || bar.logoUrl || "";
// //     }
// //     return getPlaceholderImage(bar.type);
// //   };

// //   const formatPrice = (cents: number): string => {
// //     return `€${(cents / 100).toFixed(2)}`;
// //   };

// //   const formatDate = (dateString: string): string => {
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   if (loading) {
// //     return (
// //       <ResponsiveContainer>
// //         <LoadingState>
// //           <div>Getting your location and loading amazing venues...</div>
// //         </LoadingState>
// //       </ResponsiveContainer>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <ResponsiveContainer>
// //         <ErrorState>
// //           {error}
// //           <button
// //             onClick={() => fetchHomeData()}
// //             style={{
// //               marginTop: "1rem",
// //               padding: "0.5rem 1rem",
// //               background: "#8b5cf6",
// //               border: "none",
// //               borderRadius: "8px",
// //               color: "white",
// //               cursor: "pointer",
// //             }}
// //           >
// //             Try Again
// //           </button>
// //         </ErrorState>
// //       </ResponsiveContainer>
// //     );
// //   }

// //   return (
// //     <ResponsiveContainer>
// //       {/* PROMOTIONAL SLIDER */}
// //       <Section>
// //         <PromoSliderWrapper>
// //           <PromoSliderTrack $currentIndex={currentIndex}>
// //             {Array.from({ length: totalSlides }).map((_, slideIndex) => (
// //               <PromoSlide key={slideIndex}>
// //                 <div
// //                   style={{
// //                     display: "flex",
// //                     flexDirection: "column",
// //                     gap: "1rem",
// //                     height: "100%",
// //                   }}
// //                 >
// //                   {duplicatedPromos
// //                     .slice(
// //                       slideIndex * slidesPerView,
// //                       slideIndex * slidesPerView + slidesPerView,
// //                     )
// //                     .map((promo, promoIndex) => (
// //                       <PromoCard
// //                         key={`${promo.id}-${slideIndex}-${promoIndex}`}
// //                         onClick={() => handlePromoClick(promo)}
// //                       >
// //                         <PromoTitle>{promo.title}</PromoTitle>
// //                         <PromoDescription>{promo.description}</PromoDescription>
// //                       </PromoCard>
// //                     ))}
// //                 </div>
// //               </PromoSlide>
// //             ))}
// //           </PromoSliderTrack>

// //           {totalSlides > 1 && (
// //             <>
// //               <NavButton $direction="left" onClick={prevSlide}>
// //                 ‹
// //               </NavButton>
// //               <NavButton $direction="right" onClick={nextSlide}>
// //                 ›
// //               </NavButton>
// //             </>
// //           )}

// //           <DotsContainer>
// //             {Array.from({ length: totalSlides }).map((_, idx) => (
// //               <Dot
// //                 key={idx}
// //                 $active={idx === currentIndex}
// //                 onClick={() => setCurrentIndex(idx)}
// //               />
// //             ))}
// //           </DotsContainer>
// //         </PromoSliderWrapper>
// //       </Section>

// //       {/* BARS NEAR YOU */}
// //       <Section>
// //         <SectionHeader>
// //           <SectionTitle>Bars Near You</SectionTitle>
// //           <ViewAllButton href="/app/bars">View All →</ViewAllButton>
// //         </SectionHeader>
// //         <BarsContainer>
// //           {bars.length > 0 ? (
// //             bars.map((bar) => (
// //               <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
// //                 <BarImageContainer>
// //                   <StyledImage
// //                     src={getBarImage(bar)}
// //                     alt={bar.name}
// //                     fill
// //                     sizes="(max-width: 768px) 160px, (max-width: 1024px) 240px, 280px"
// //                   />
// //                 </BarImageContainer>
// //                 <BarName>{bar.name}</BarName>
// //                 <BarLocation>
// //                   {bar.district || "Central"} • {bar.cityName || "Helsinki"}
// //                 </BarLocation>
// //                 {bar.distance !== undefined && bar.distance !== null && (
// //                   <DistanceBadge>
// //                     📍 {formatDistance(bar.distance)}
// //                   </DistanceBadge>
// //                 )}
// //               </BarCard>
// //             ))
// //           ) : (
// //             <div
// //               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
// //             >
// //               No bars available at the moment.
// //             </div>
// //           )}
// //         </BarsContainer>
// //       </Section>

// //       {/* VIP PASSES */}
// //       <Section>
// //         <SectionHeader>
// //           <SectionTitle>VIP Passes</SectionTitle>
// //           <ViewAllButton href="/app/vip-pass">View All →</ViewAllButton>
// //         </SectionHeader>
// //         <VIPContainer>
// //           {vipPasses.length > 0 ? (
// //             vipPasses.map((pass) => (
// //               <VIPCard key={pass.id} href={`/app/vip-pass/${pass.id}`}>
// //                 <VIPTitle>{pass.name}</VIPTitle>
// //                 <div
// //                   style={{
// //                     fontSize: "0.7rem",
// //                     color: "#94a3b8",
// //                     marginBottom: "0.5rem",
// //                   }}
// //                 >
// //                   {pass.bar?.name || "Premium Venue"}
// //                 </div>
// //                 <VIPPrice>{formatPrice(pass.priceCents)}</VIPPrice>
// //                 {pass.benefits && pass.benefits.length > 0 && (
// //                   <div
// //                     style={{
// //                       fontSize: "0.65rem",
// //                       color: "#8b5cf6",
// //                       marginTop: "0.5rem",
// //                     }}
// //                   >
// //                     ✨{" "}
// //                     {pass.benefits[0].length > 40
// //                       ? pass.benefits[0].substring(0, 40) + "..."
// //                       : pass.benefits[0]}
// //                   </div>
// //                 )}
// //               </VIPCard>
// //             ))
// //           ) : (
// //             <div
// //               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
// //             >
// //               No VIP passes available.
// //             </div>
// //           )}
// //         </VIPContainer>
// //       </Section>

// //       {/* CURRENT PROMOTIONS */}
// //       <Section>
// //         <SectionHeader>
// //           <SectionTitle>Current Promotions</SectionTitle>
// //           <ViewAllButton href="/app/promotions">View All →</ViewAllButton>
// //         </SectionHeader>
// //         <PromotionsContainer>
// //           {promotions.length > 0 ? (
// //             promotions.map((promo) => (
// //               <PromotionCard
// //                 key={promo.id}
// //                 onClick={() => handlePromotionClick(promo)}
// //               >
// //                 <PromotionTitle>{promo.title}</PromotionTitle>
// //                 <PromotionDescription>
// //                   {promo.description.length > 80
// //                     ? promo.description.substring(0, 80) + "..."
// //                     : promo.description}
// //                 </PromotionDescription>
// //                 {promo.discount && (
// //                   <div
// //                     style={{
// //                       fontSize: "0.7rem",
// //                       color: "#22c55e",
// //                       marginBottom: "0.5rem",
// //                       fontWeight: 600,
// //                     }}
// //                   >
// //                     {promo.discount}% OFF
// //                   </div>
// //                 )}
// //                 <div style={{ fontSize: "0.65rem", color: "#64748b" }}>
// //                   at {promo.bar?.name || "Venue"}
// //                 </div>
// //                 {promo.endDate && (
// //                   <div
// //                     style={{
// //                       fontSize: "0.6rem",
// //                       color: "#64748b",
// //                       marginTop: "0.25rem",
// //                     }}
// //                   >
// //                     Ends {formatDate(promo.endDate)}
// //                   </div>
// //                 )}
// //               </PromotionCard>
// //             ))
// //           ) : (
// //             <div
// //               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
// //             >
// //               No active promotions.
// //             </div>
// //           )}
// //         </PromotionsContainer>
// //       </Section>

// //       {/* EVENTS */}
// //       {crawls.length > 0 && (
// //         <Section>
// //           <SectionHeader>
// //             <SectionTitle>Events</SectionTitle>
// //             <ViewAllButton href="/app/crawls">View All →</ViewAllButton>
// //           </SectionHeader>
// //           <CrawlsContainer>
// //             {crawls.map((crawl) => (
// //               <CrawlCard key={crawl.id} href={`/app/crawls/${crawl.id}`}>
// //                 <CrawlTitle>{crawl.name}</CrawlTitle>
// //                 <CrawlDate>
// //                   {formatDate(crawl.date)} • {crawl.startTime.substring(0, 5)}
// //                 </CrawlDate>
// //                 <CrawlParticipants>
// //                   👥 {crawl.currentParticipants || 0}/{crawl.maxParticipants}{" "}
// //                   participants
// //                 </CrawlParticipants>
// //               </CrawlCard>
// //             ))}
// //           </CrawlsContainer>
// //         </Section>
// //       )}

// //       {/* BROWSE CATEGORIES */}
// //       <Section>
// //         <SectionHeader>
// //           <SectionTitle>Browse Categories</SectionTitle>
// //         </SectionHeader>
// //         <CategoryGrid>
// //           {Object.entries(categoryIcons).map(([category, icon]) => (
// //             <CategoryCard
// //               key={category}
// //               href={`/app/bars?type=${category.toLowerCase()}`}
// //             >
// //               <CategoryIcon>{icon}</CategoryIcon>
// //               <CategoryName>{category.replace(/_/g, " ")}</CategoryName>
// //             </CategoryCard>
// //           ))}
// //         </CategoryGrid>
// //       </Section>
// //     </ResponsiveContainer>
// //   );
// // };

// // export default AppHome;
// "use client";
// import { useEffect, useState } from "react";
// import styled, { keyframes } from "styled-components";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // Continuous scroll animation
// const scroll = keyframes`
//   0% {
//     transform: translateX(0);
//   }
//   100% {
//     transform: translateX(-50%);
//   }
// `;

// // Promo Slider Wrapper
// const PromoSliderWrapper = styled.div`
//   position: relative;
//   margin: 0 -0.5rem;
//   overflow: hidden;
//   mask: linear-gradient(90deg, transparent, white 5%, white 95%, transparent);
//   @media (min-width: 768px) {
//     margin: 0 -1rem;
//   }
//   @media (min-width: 1024px) {
//     margin: 0 -1.5rem;
//   }
// `;

// // Continuous scrolling track
// const PromoSliderTrack = styled.div<{ $duration: number }>`
//   display: flex;
//   gap: 1rem;
//   padding: 0.5rem;
//   width: max-content;
//   animation: ${scroll} ${(props) => props.$duration}ms linear infinite;

//   &:hover {
//     animation-play-state: paused;
//   }

//   @media (min-width: 768px) {
//     gap: 1.5rem;
//     padding: 1rem;
//   }
//   @media (min-width: 1024px) {
//     gap: 2rem;
//     padding: 1.5rem;
//   }
// `;

// // Promo Card - SAME SIZE ON ALL SCREENS
// const PromoCard = styled.div`
//   width: 320px;
//   height: 400px;
//   background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
//   border-radius: 20px;
//   padding: 1.5rem;
//   color: white;
//   position: relative;
//   overflow: hidden;
//   min-height: 160px;
//   cursor: pointer;
//   transition: transform 0.3s ease;
//   flex-shrink: 0;

//   &:hover {
//     transform: translateY(-4px);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: -50%;
//     right: -50%;
//     width: 100%;
//     height: 100%;
//     background: radial-gradient(
//       circle,
//       rgba(255, 255, 255, 0.1) 0%,
//       transparent 70%
//     );
//   }
// `;

// const PromoTitle = styled.h3`
//   font-size: 1.1rem;
//   font-weight: 700;
//   margin: 0 0 0.75rem 0;
//   position: relative;
//   z-index: 2;
// `;

// const PromoDescription = styled.p`
//   font-size: 0.85rem;
//   opacity: 0.9;
//   margin: 0;
//   position: relative;
//   z-index: 2;
//   line-height: 1.4;
// `;

// // Rest of your styled components (keep exactly as you have them)
// const ResponsiveContainer = styled.div`
//   padding: 1rem 1rem 5rem;
//   min-height: 100vh;
//   background: linear-gradient(
//     -45deg,
//     rgb(9, 9, 11),
//     rgb(24, 20, 31),
//     rgb(9, 9, 11),
//     rgb(21, 17, 23)
//   );
//   background-size: 400% 400%;
//   animation: gradientShift 12s ease infinite;
//   @media (min-width: 640px) {
//     padding: 1.5rem 1.5rem 6rem;
//   }
//   @media (min-width: 768px) {
//     padding: 2rem 2rem 7rem;
//   }
//   @media (min-width: 1024px) {
//     padding: 2rem 3rem 8rem;
//     max-width: 1600px;
//     margin: 0 auto;
//   }
//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const Section = styled.section`
//   margin-bottom: 2rem;
//   &:last-child {
//     margin-bottom: 0;
//   }
//   @media (min-width: 768px) {
//     margin-bottom: 2.5rem;
//   }
//   @media (min-width: 1024px) {
//     margin-bottom: 3rem;
//   }
// `;

// const SectionHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
//   padding: 0 0.25rem;
//   @media (min-width: 768px) {
//     margin-bottom: 1.25rem;
//     padding: 0;
//   }
//   @media (min-width: 1024px) {
//     margin-bottom: 1.5rem;
//   }
// `;

// const SectionTitle = styled.h2`
//   color: #f8fafc;
//   font-size: 1.25rem;
//   font-weight: 700;
//   margin: 0;
//   @media (min-width: 768px) {
//     font-size: 1.5rem;
//   }
//   @media (min-width: 1024px) {
//     font-size: 1.75rem;
//   }
// `;

// const ViewAllButton = styled(Link)`
//   color: #0ea5e9;
//   font-size: 0.8rem;
//   font-weight: 600;
//   text-decoration: none;
//   transition: color 0.2s ease;
//   &:hover {
//     color: #38bdf8;
//     text-decoration: underline;
//   }
//   @media (min-width: 768px) {
//     font-size: 0.9rem;
//   }
//   @media (min-width: 1024px) {
//     font-size: 1rem;
//   }
// `;

// const BarsContainer = styled.div`
//   @media (max-width: 1023px) {
//     display: flex;
//     gap: 1rem;
//     overflow-x: auto;
//     padding: 0.5rem 0.25rem;
//     scrollbar-width: thin;
//     &::-webkit-scrollbar {
//       height: 6px;
//     }
//     &::-webkit-scrollbar-track {
//       background: rgba(30, 41, 59, 0.5);
//       border-radius: 3px;
//     }
//     &::-webkit-scrollbar-thumb {
//       background: rgba(139, 92, 246, 0.5);
//       border-radius: 3px;
//     }
//   }
//   @media (min-width: 1024px) {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//     gap: 1.5rem;
//   }
// `;

// const BarCard = styled(Link)`
//   background: rgba(30, 41, 59, 0.8);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 0.875rem;
//   text-decoration: none;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   transition: all 0.3s ease;
//   min-height: 170px;
//   overflow: hidden;
//   &:hover {
//     border-color: rgba(139, 92, 246, 0.4);
//     transform: translateY(-4px);
//     background: rgba(30, 41, 59, 0.95);
//   }
//   @media (max-width: 1023px) {
//     flex: 0 0 160px;
//     min-height: 180px;
//   }
//   @media (min-width: 1024px) {
//     min-height: 240px;
//     padding: 1rem;
//   }
// `;

// const BarImageContainer = styled.div`
//   width: 100%;
//   height: 80px;
//   border-radius: 8px;
//   margin-bottom: 0.75rem;
//   overflow: hidden;
//   position: relative;
//   background: #1e293b;
//   @media (min-width: 768px) {
//     height: 100px;
//   }
//   @media (min-width: 1024px) {
//     height: 140px;
//   }
// `;

// const StyledImage = styled(Image)`
//   object-fit: cover;
// `;

// const BarName = styled.h3`
//   color: #f8fafc;
//   font-size: 0.85rem;
//   font-weight: 600;
//   margin: 0 0 0.25rem 0;
//   line-height: 1.3;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   @media (min-width: 768px) {
//     font-size: 0.95rem;
//   }
// `;

// const BarLocation = styled.p`
//   color: #94a3b8;
//   font-size: 0.7rem;
//   margin: 0;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   @media (min-width: 768px) {
//     font-size: 0.75rem;
//   }
// `;

// const DistanceBadge = styled.span`
//   background: rgba(14, 165, 233, 0.2);
//   color: #0ea5e9;
//   padding: 0.2rem 0.5rem;
//   border-radius: 12px;
//   font-size: 0.65rem;
//   font-weight: 600;
//   display: inline-block;
//   margin-top: 0.25rem;
// `;

// const VIPContainer = styled.div`
//   @media (max-width: 1023px) {
//     display: flex;
//     gap: 1rem;
//     overflow-x: auto;
//     padding: 0.5rem 0.25rem;
//   }
//   @media (min-width: 1024px) {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
//     gap: 1.5rem;
//   }
// `;

// const VIPCard = styled(Link)`
//   background: rgba(30, 41, 59, 0.8);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 0.875rem;
//   text-decoration: none;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   transition: all 0.3s ease;
//   min-height: 170px;
//   overflow: hidden;
//   &:hover {
//     border-color: rgba(139, 92, 246, 0.4);
//     transform: translateY(-4px);
//     background: rgba(30, 41, 59, 0.95);
//   }
//   @media (max-width: 1023px) {
//     flex: 0 0 160px;
//     min-height: 180px;
//   }
//   @media (min-width: 1024px) {
//     min-height: 240px;
//     padding: 1rem;
//   }
// `;

// const VIPTitle = styled.h3`
//   color: #f8fafc;
//   font-size: 0.85rem;
//   font-weight: 700;
//   margin: 0 0 0.5rem 0;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// const VIPPrice = styled.div`
//   color: #0ea5e9;
//   font-size: 0.9rem;
//   font-weight: 700;
// `;

// const PromotionsContainer = styled.div`
//   @media (max-width: 1023px) {
//     display: flex;
//     gap: 1rem;
//     overflow-x: auto;
//     padding: 0.5rem 0.25rem;
//   }
//   @media (min-width: 1024px) {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
//     gap: 1.5rem;
//   }
// `;

// const PromotionCard = styled.div`
//   background: rgba(30, 41, 59, 0.8);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 0.875rem;
//   text-decoration: none;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   transition: all 0.3s ease;
//   min-height: 170px;
//   overflow: hidden;
//   &:hover {
//     border-color: rgba(139, 92, 246, 0.4);
//     transform: translateY(-4px);
//     background: rgba(30, 41, 59, 0.95);
//   }
//   @media (max-width: 1023px) {
//     flex: 0 0 160px;
//     min-height: 180px;
//   }
//   @media (min-width: 1024px) {
//     min-height: 240px;
//     padding: 1rem;
//   }
// `;

// const PromotionTitle = styled.h3`
//   color: #f8fafc;
//   font-size: 0.85rem;
//   font-weight: 600;
//   margin: 0 0 0.5rem 0;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// const PromotionDescription = styled.p`
//   color: #94a3b8;
//   font-size: 0.7rem;
//   margin: 0 0 0.5rem 0;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// const CrawlsContainer = styled.div`
//   @media (max-width: 1023px) {
//     display: flex;
//     gap: 1rem;
//     overflow-x: auto;
//     padding: 0.5rem 0.25rem;
//   }
//   @media (min-width: 1024px) {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//     gap: 1.5rem;
//   }
// `;

// const CrawlCard = styled(Link)`
//   background: rgba(30, 41, 59, 0.8);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 0.875rem;
//   text-decoration: none;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   transition: all 0.3s ease;
//   min-height: 170px;
//   overflow: hidden;
//   &:hover {
//     border-color: rgba(139, 92, 246, 0.4);
//     transform: translateY(-4px);
//     background: rgba(30, 41, 59, 0.95);
//   }
//   @media (max-width: 1023px) {
//     flex: 0 0 160px;
//     min-height: 180px;
//   }
//   @media (min-width: 1024px) {
//     min-height: 240px;
//     padding: 1rem;
//   }
// `;

// const CrawlTitle = styled.h3`
//   color: #f8fafc;
//   font-size: 0.9rem;
//   font-weight: 700;
//   margin: 0 0 0.5rem 0;
// `;

// const CrawlDate = styled.div`
//   color: #ec4899;
//   font-size: 0.75rem;
//   font-weight: 600;
//   margin-bottom: 0.5rem;
// `;

// const CrawlParticipants = styled.div`
//   color: #94a3b8;
//   font-size: 0.7rem;
// `;

// const CategoryGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 0.75rem;
//   @media (min-width: 480px) {
//     grid-template-columns: repeat(3, 1fr);
//   }
//   @media (min-width: 640px) {
//     grid-template-columns: repeat(4, 1fr);
//     gap: 1rem;
//   }
//   @media (min-width: 768px) {
//     grid-template-columns: repeat(5, 1fr);
//   }
//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(6, 1fr);
//     gap: 1.25rem;
//   }
//   @media (min-width: 1280px) {
//     grid-template-columns: repeat(8, 1fr);
//     gap: 1.5rem;
//   }
// `;

// const CategoryCard = styled(Link)`
//   background: rgba(30, 41, 59, 0.8);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 1rem 0.5rem;
//   text-decoration: none;
//   text-align: center;
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   transition: all 0.3s ease;
//   min-height: 70px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   &:hover {
//     border-color: rgba(139, 92, 246, 0.4);
//     transform: translateY(-2px);
//     background: rgba(30, 41, 59, 0.95);
//   }
//   @media (min-width: 768px) {
//     padding: 1.25rem 0.5rem;
//     min-height: 90px;
//   }
// `;

// const CategoryIcon = styled.div`
//   font-size: 1.25rem;
//   margin-bottom: 0.35rem;
//   @media (min-width: 768px) {
//     font-size: 1.75rem;
//     margin-bottom: 0.5rem;
//   }
// `;

// const CategoryName = styled.div`
//   color: #f8fafc;
//   font-size: 0.7rem;
//   font-weight: 600;
//   line-height: 1.2;
//   @media (min-width: 768px) {
//     font-size: 0.8rem;
//   }
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: #94a3b8;
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #ef4444;
//   background: rgba(239, 68, 68, 0.1);
//   border-radius: 12px;
//   margin: 1rem;
// `;

// // Interfaces
// interface Bar {
//   id: string;
//   name: string;
//   district: string | null;
//   type: string;
//   cityName: string | null;
//   imageUrl: string | null;
//   coverImage: string | null;
//   logoUrl: string | null;
//   vipEnabled: boolean;
//   address: string;
//   latitude: number | null;
//   longitude: number | null;
//   distance?: number;
// }

// interface VIPPassEnhanced {
//   id: string;
//   name: string;
//   priceCents: number;
//   barId: string;
//   bar?: { id: string; name: string };
//   benefits: string[];
// }

// interface BarPromotion {
//   id: string;
//   title: string;
//   description: string;
//   type: string;
//   discount: number | null;
//   barId: string;
//   bar?: { id: string; name: string };
//   endDate: string;
// }

// interface Crawl {
//   id: string;
//   name: string;
//   date: string;
//   startTime: string;
//   maxParticipants: number;
//   currentParticipants: number;
//   city?: { name: string };
// }

// const categoryIcons: { [key: string]: string } = {
//   PUB: "🍺",
//   CLUB: "🎵",
//   LOUNGE: "🍸",
//   COCKTAIL_BAR: "🥃",
//   RESTAURANT_BAR: "🍽️",
//   SPORTS_BAR: "🏈",
//   KARAOKE: "🎤",
//   LIVE_MUSIC: "🎸",
// };

// const getPlaceholderImage = (barType: string): string => {
//   const placeholders: { [key: string]: string } = {
//     PUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017446/hoppr/images/pubimage_qrgtvj.jpg",
//     CLUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg",
//     LOUNGE:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017475/hoppr/images/loungebar_vsckbj.jpg",
//     COCKTAIL_BAR:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017569/hoppr/images/cocktailbar_d2egc9.jpg",
//     RESTAURANT_BAR:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017593/hoppr/images/restobar_mvqdhu.jpg",
//     SPORTS_BAR:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017615/hoppr/images/sportsbar_sdws1w.jpg",
//     KARAOKE:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017637/hoppr/images/karaokebar_tbrp5g.jpg",
//     LIVE_MUSIC:
//       "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017658/hoppr/images/livemusicbar_qzvxq7.jpg",
//   };
//   return (
//     placeholders[barType] ||
//     "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg"
//   );
// };

// const promotionalData = [
//   {
//     id: 1,
//     title: "Weekend Special",
//     description: "50% off all VIP passes this weekend",
//     link: "/app/vip-pass",
//   },
//   {
//     id: 2,
//     title: "New Bars Added",
//     description: "Discover new partner venues in your area",
//     link: "/app/bars",
//   },
//   {
//     id: 3,
//     title: "Happy Hour Extended",
//     description: "Enjoy extended happy hours all week long",
//     link: "/app/promotions",
//   },
//   {
//     id: 4,
//     title: "VIP Membership",
//     description: "Become a VIP member for exclusive benefits",
//     link: "/app/vip-pass",
//   },
//   {
//     id: 5,
//     title: "Bar Crawls",
//     description: "Join our biggest bar hopping events",
//     link: "/app/crawls",
//   },
//   {
//     id: 6,
//     title: "Student Night",
//     description: "Special discounts for students every Wednesday",
//     link: "/app/promotions",
//   },
// ];

// const calculateDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number,
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

// const formatDistance = (distance: number): string => {
//   if (distance < 1) return `${Math.round(distance * 1000)}m`;
//   return `${distance.toFixed(1)}km`;
// };

// // MAIN COMPONENT
// const AppHome = () => {
//   const router = useRouter();
//   const [bars, setBars] = useState<Bar[]>([]);
//   const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
//   const [promotions, setPromotions] = useState<BarPromotion[]>([]);
//   const [crawls, setCrawls] = useState<Crawl[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationLoaded, setLocationLoaded] = useState(false);

//   const duplicatedPromos = [...promotionalData, ...promotionalData];

//   // Get user location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           setLocationLoaded(true);
//         },
//         () => {
//           setLocationLoaded(true);
//           setUserLocation(null);
//         },
//       );
//     } else {
//       setLocationLoaded(true);
//       setUserLocation(null);
//     }
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     if (locationLoaded) fetchHomeData();
//   }, [locationLoaded]);

//   const fetchHomeData = async () => {
//     try {
//       setLoading(true);
//       let barsUrl = "/api/bars?limit=12&isActive=true";
//       if (userLocation)
//         barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;

//       const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
//         fetch(barsUrl),
//         fetch("/api/vip/passes?limit=6&isActive=true"),
//         fetch("/api/promotions?limit=6&isActive=true&isApproved=true"),
//         fetch("/api/crawls?limit=3&status=UPCOMING"),
//       ]);

//       if (barsRes.ok) {
//         let barsArray = await barsRes.json();
//         barsArray = barsArray.data || barsArray.bars || barsArray;
//         if (!Array.isArray(barsArray)) barsArray = [];
//         const barsWithDistance = barsArray.map((bar: Bar) => {
//           let distance = bar.distance;
//           if (!distance && userLocation && bar.latitude && bar.longitude) {
//             distance = calculateDistance(
//               userLocation.latitude,
//               userLocation.longitude,
//               bar.latitude,
//               bar.longitude,
//             );
//           }
//           return { ...bar, distance };
//         });
//         if (userLocation)
//           barsWithDistance.sort(
//             (a: Bar, b: Bar) => (a.distance || 999) - (b.distance || 999),
//           );
//         setBars(barsWithDistance.slice(0, 8));
//       }
//       if (vipRes.ok) {
//         let vipArray = await vipRes.json();
//         vipArray = vipArray.passes || vipArray.data || vipArray;
//         if (!Array.isArray(vipArray)) vipArray = [];
//         setVipPasses(vipArray.slice(0, 6));
//       }
//       if (promotionsRes.ok) {
//         let promosArray = await promotionsRes.json();
//         promosArray = promosArray.promotions || promosArray.data || promosArray;
//         if (!Array.isArray(promosArray)) promosArray = [];
//         setPromotions(promosArray.slice(0, 6));
//       }
//       if (crawlsRes.ok) {
//         let crawlsArray = await crawlsRes.json();
//         crawlsArray = crawlsArray.crawls || crawlsArray.data || crawlsArray;
//         if (!Array.isArray(crawlsArray)) crawlsArray = [];
//         setCrawls(crawlsArray.slice(0, 3));
//       }
//     } catch (error) {
//       setError("Failed to load data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePromoClick = (promo: (typeof promotionalData)[0]) =>
//     router.push(promo.link);
//   const handlePromotionClick = (promotion: BarPromotion) =>
//     router.push(`/app/bars/${promotion.barId}`);
//   const getBarImage = (bar: Bar): string =>
//     bar.coverImage ||
//     bar.imageUrl ||
//     bar.logoUrl ||
//     getPlaceholderImage(bar.type);
//   const formatPrice = (cents: number): string => `€${(cents / 100).toFixed(2)}`;
//   const formatDate = (dateString: string): string =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });

//   if (loading)
//     return (
//       <ResponsiveContainer>
//         <LoadingState>
//           Getting your location and loading amazing venues...
//         </LoadingState>
//       </ResponsiveContainer>
//     );
//   if (error)
//     return (
//       <ResponsiveContainer>
//         <ErrorState>
//           {error}
//           <button onClick={() => fetchHomeData()}>Try Again</button>
//         </ErrorState>
//       </ResponsiveContainer>
//     );

//   return (
//     <ResponsiveContainer>
//       {/* CONTINUOUS SLIDING PROMO BANNER - FIXED CARD SIZE */}
//       <Section>
//         <PromoSliderWrapper>
//           <PromoSliderTrack $duration={30000}>
//             {duplicatedPromos.map((promo, index) => (
//               <PromoCard key={index} onClick={() => handlePromoClick(promo)}>
//                 <PromoTitle>{promo.title}</PromoTitle>
//                 <PromoDescription>{promo.description}</PromoDescription>
//               </PromoCard>
//             ))}
//           </PromoSliderTrack>
//         </PromoSliderWrapper>
//       </Section>

//       {/* BARS NEAR YOU */}
//       <Section>
//         <SectionHeader>
//           <SectionTitle>Bars Near You</SectionTitle>
//           <ViewAllButton href="/app/bars">View All →</ViewAllButton>
//         </SectionHeader>
//         <BarsContainer>
//           {bars.length > 0 ? (
//             bars.map((bar) => (
//               <BarCard key={bar.id} href={`/app/bars/${bar.id}`}>
//                 <BarImageContainer>
//                   <StyledImage
//                     src={getBarImage(bar)}
//                     alt={bar.name}
//                     fill
//                     sizes="(max-width: 768px) 160px, (max-width: 1024px) 240px, 280px"
//                   />
//                 </BarImageContainer>
//                 <BarName>{bar.name}</BarName>
//                 <BarLocation>
//                   {bar.district || "Central"} • {bar.cityName || "Helsinki"}
//                 </BarLocation>
//                 {bar.distance !== undefined && (
//                   <DistanceBadge>
//                     📍 {formatDistance(bar.distance)}
//                   </DistanceBadge>
//                 )}
//               </BarCard>
//             ))
//           ) : (
//             <div
//               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
//             >
//               No bars available.
//             </div>
//           )}
//         </BarsContainer>
//       </Section>

//       {/* VIP PASSES */}
//       <Section>
//         <SectionHeader>
//           <SectionTitle>VIP Passes</SectionTitle>
//           <ViewAllButton href="/app/vip-pass">View All →</ViewAllButton>
//         </SectionHeader>
//         <VIPContainer>
//           {vipPasses.length > 0 ? (
//             vipPasses.map((pass) => (
//               <VIPCard key={pass.id} href={`/app/vip-pass/${pass.id}`}>
//                 <VIPTitle>{pass.name}</VIPTitle>
//                 <div
//                   style={{
//                     fontSize: "0.7rem",
//                     color: "#94a3b8",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   {pass.bar?.name || "Premium Venue"}
//                 </div>
//                 <VIPPrice>{formatPrice(pass.priceCents)}</VIPPrice>
//                 {pass.benefits?.length > 0 && (
//                   <div
//                     style={{
//                       fontSize: "0.65rem",
//                       color: "#8b5cf6",
//                       marginTop: "0.5rem",
//                     }}
//                   >
//                     ✨ {pass.benefits[0]}
//                   </div>
//                 )}
//               </VIPCard>
//             ))
//           ) : (
//             <div
//               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
//             >
//               No VIP passes available.
//             </div>
//           )}
//         </VIPContainer>
//       </Section>

//       {/* CURRENT PROMOTIONS */}
//       <Section>
//         <SectionHeader>
//           <SectionTitle>Current Promotions</SectionTitle>
//           <ViewAllButton href="/app/promotions">View All →</ViewAllButton>
//         </SectionHeader>
//         <PromotionsContainer>
//           {promotions.length > 0 ? (
//             promotions.map((promo) => (
//               <PromotionCard
//                 key={promo.id}
//                 onClick={() => handlePromotionClick(promo)}
//               >
//                 <PromotionTitle>{promo.title}</PromotionTitle>
//                 <PromotionDescription>{promo.description}</PromotionDescription>
//                 {promo.discount && (
//                   <div
//                     style={{
//                       fontSize: "0.7rem",
//                       color: "#22c55e",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {promo.discount}% OFF
//                   </div>
//                 )}
//                 <div style={{ fontSize: "0.65rem", color: "#64748b" }}>
//                   at {promo.bar?.name || "Venue"}
//                 </div>
//                 {promo.endDate && (
//                   <div style={{ fontSize: "0.6rem", color: "#64748b" }}>
//                     Ends {formatDate(promo.endDate)}
//                   </div>
//                 )}
//               </PromotionCard>
//             ))
//           ) : (
//             <div
//               style={{ color: "#94a3b8", padding: "2rem", textAlign: "center" }}
//             >
//               No active promotions.
//             </div>
//           )}
//         </PromotionsContainer>
//       </Section>

//       {/* EVENTS */}
//       {crawls.length > 0 && (
//         <Section>
//           <SectionHeader>
//             <SectionTitle>Events</SectionTitle>
//             <ViewAllButton href="/app/crawls">View All →</ViewAllButton>
//           </SectionHeader>
//           <CrawlsContainer>
//             {crawls.map((crawl) => (
//               <CrawlCard key={crawl.id} href={`/app/crawls/${crawl.id}`}>
//                 <CrawlTitle>{crawl.name}</CrawlTitle>
//                 <CrawlDate>
//                   {formatDate(crawl.date)} • {crawl.startTime.substring(0, 5)}
//                 </CrawlDate>
//                 <CrawlParticipants>
//                   👥 {crawl.currentParticipants || 0}/{crawl.maxParticipants}{" "}
//                   participants
//                 </CrawlParticipants>
//               </CrawlCard>
//             ))}
//           </CrawlsContainer>
//         </Section>
//       )}

//       {/* BROWSE CATEGORIES */}
//       <Section>
//         <SectionHeader>
//           <SectionTitle>Browse Categories</SectionTitle>
//         </SectionHeader>
//         <CategoryGrid>
//           {Object.entries(categoryIcons).map(([category, icon]) => (
//             <CategoryCard
//               key={category}
//               href={`/app/bars?type=${category.toLowerCase()}`}
//             >
//               <CategoryIcon>{icon}</CategoryIcon>
//               <CategoryName>{category.replace(/_/g, " ")}</CategoryName>
//             </CategoryCard>
//           ))}
//         </CategoryGrid>
//       </Section>
//     </ResponsiveContainer>
//   );
// };

// export default AppHome;
"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import BarCard from "../common/bar-card/BarCard";
import CrawlCard from "../common/crawl-card/CrawlCard";
import CityChip from "../common/city-chip/CityChip";

// Styled components with correct theme keys
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

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TitleGroup = styled.div``;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 768px) {
    font-size: 40px;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  gap: 8px;
  width: 100%;
  transition: border-color 0.2s;

  @media (min-width: 768px) {
    max-width: 320px;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 14px;
  flex: 1;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;

  @media (min-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const CityRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const BarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const BarsRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CrawlGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.25rem;
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(8, 1fr);
    gap: 1.5rem;
  }
`;

const CategoryCard = styled(Link)`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  text-decoration: none;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.tertiaryBackground};
  }

  @media (min-width: 768px) {
    padding: 1.25rem 0.5rem;
    min-height: 90px;
  }
`;

const CategoryIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.35rem;
  @media (min-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
`;

const CategoryName = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.2;
  font-family: ${({ theme }) => theme.fonts.dm};
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
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

// VIP Card styled component
const VIPCardWrapper = styled.div`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.15),
    rgba(14, 165, 233, 0.15)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1rem;
  min-width: 200px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-4px);
  }
`;

const VIPName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const VIPBarName = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const VIPPrice = styled.div`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-size: 0.9rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const VIPBenefit = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.primaryAccent};
  margin-top: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// Promotion Card styled component
const PromotionCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.875rem;
  border: 1px solid rgba(34, 197, 94, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(34, 197, 94, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    border-radius: 12px 12px 0 0;
  }
`;

const PromotionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PromotionDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.7rem;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PromotionDiscount = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PromotionBarName = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PromotionEndDate = styled.div`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

// Interfaces
interface Bar {
  id: string;
  name: string;
  district: string | null;
  type: string;
  cityName: string | null;
  imageUrl: string | null;
  coverImage: string | null;
  logoUrl: string | null;
  vipEnabled: boolean;
  address: string;
  latitude: number | null;
  longitude: number | null;
  distance?: number;
}

interface VIPPassEnhanced {
  id: string;
  name: string;
  priceCents: number;
  barId: string;
  bar?: { id: string; name: string };
  benefits: string[];
}

interface BarPromotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  barId: string;
  bar?: { id: string; name: string };
  endDate: string;
}

interface Crawl {
  id: string;
  name: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  city?: { name: string };
  distance?: number;
}

const categoryIcons: { [key: string]: string } = {
  PUB: "🍺",
  CLUB: "🎵",
  LOUNGE: "🍸",
  COCKTAIL_BAR: "🥃",
  RESTAURANT_BAR: "🍽️",
  SPORTS_BAR: "🏈",
  KARAOKE: "🎤",
  LIVE_MUSIC: "🎸",
};

const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "Austin",
  "Seattle",
  "Denver",
];

// Fake trending data for when API doesn't have enough bars
const FAKE_TRENDING_BARS = [
  {
    id: "trending1",
    name: "The Rooftop Lounge",
    type: "LOUNGE",
    district: "Downtown",
    cityName: "New York",
    distance: 0.3,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: true,
    address: "",
    latitude: null,
    longitude: null,
  },
  {
    id: "trending2",
    name: "Neon Nightclub",
    type: "CLUB",
    district: "Arts District",
    cityName: "Los Angeles",
    distance: 0.5,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: true,
    address: "",
    latitude: null,
    longitude: null,
  },
  {
    id: "trending3",
    name: "Craft Beer Hall",
    type: "PUB",
    district: "River North",
    cityName: "Chicago",
    distance: 0.2,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: false,
    address: "",
    latitude: null,
    longitude: null,
  },
  {
    id: "trending4",
    name: "Secret Speakeasy",
    type: "COCKTAIL_BAR",
    district: "South Beach",
    cityName: "Miami",
    distance: 0.8,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: true,
    address: "",
    latitude: null,
    longitude: null,
  },
  {
    id: "trending5",
    name: "Live Jazz Club",
    type: "LIVE_MUSIC",
    district: "Downtown",
    cityName: "Austin",
    distance: 0.4,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: false,
    address: "",
    latitude: null,
    longitude: null,
  },
  {
    id: "trending6",
    name: "Sports Grill & Bar",
    type: "SPORTS_BAR",
    district: "Capitol Hill",
    cityName: "Seattle",
    distance: 0.6,
    coverImage: null,
    imageUrl: null,
    logoUrl: null,
    vipEnabled: false,
    address: "",
    latitude: null,
    longitude: null,
  },
];

const getPlaceholderImage = (barType: string): string => {
  const placeholders: { [key: string]: string } = {
    PUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017446/hoppr/images/pubimage_qrgtvj.jpg",
    CLUB: "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg",
    LOUNGE:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017475/hoppr/images/loungebar_vsckbj.jpg",
    COCKTAIL_BAR:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017569/hoppr/images/cocktailbar_d2egc9.jpg",
    RESTAURANT_BAR:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017593/hoppr/images/restobar_mvqdhu.jpg",
    SPORTS_BAR:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017615/hoppr/images/sportsbar_sdws1w.jpg",
    KARAOKE:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017637/hoppr/images/karaokebar_tbrp5g.jpg",
    LIVE_MUSIC:
      "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017658/hoppr/images/livemusicbar_qzvxq7.jpg",
  };
  return (
    placeholders[barType] ||
    "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg"
  );
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

const formatDistance = (distance: number): string => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (cents: number): string => `€${(cents / 100).toFixed(2)}`;

// Helper function to map API bar to BarCard expected format
const mapBarToCardFormat = (bar: Bar, distance?: number) => {
  const getGenresFromType = (type: string): string[] => {
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
    return genreMap[type] || ["Bar", "Drinks"];
  };

  const getPriceRange = (type: string): string => {
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
    return priceMap[type] || "$$";
  };

  const getRating = (): string => {
    const ratings = ["4.2", "4.5", "4.3", "4.7", "4.0", "4.4"];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  const getImageUrl = (): string => {
    return (
      bar.coverImage ||
      bar.imageUrl ||
      bar.logoUrl ||
      getPlaceholderImage(bar.type)
    );
  };

  return {
    id: bar.id,
    name: bar.name,
    rating: getRating(),
    priceRange: getPriceRange(bar.type),
    genres: getGenresFromType(bar.type),
    images: [getImageUrl()],
    distance: distance ? formatDistance(distance) : undefined,
  };
};

// Helper to map API crawl to CrawlCard expected format
const mapCrawlToCardFormat = (crawl: Crawl) => {
  const startTime = crawl.startTime || new Date(crawl.date).toISOString();
  const mockBarIds = ["1", "2", "3"];
  const mockAttendees = ["1", "2", "3", "4", "5"];

  return {
    id: crawl.id,
    name: crawl.name,
    startTime: startTime,
    bars: mockBarIds,
    attendees: mockAttendees,
    distance: crawl.distance ? formatDistance(crawl.distance) : undefined,
  };
};

const AppHome = () => {
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>([]);
  const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
  const [promotions, setPromotions] = useState<BarPromotion[]>([]);
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

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
        () => {
          setLocationLoaded(true);
          setUserLocation(null);
        },
      );
    } else {
      setLocationLoaded(true);
      setUserLocation(null);
    }
  }, []);

  useEffect(() => {
    if (locationLoaded) fetchHomeData();
  }, [locationLoaded]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      let barsUrl = "/api/bars?limit=20&isActive=true";
      if (userLocation) {
        barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;
      }

      const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
        fetch(barsUrl),
        fetch("/api/vip/passes?limit=6&isActive=true"),
        fetch("/api/promotions?limit=6&isActive=true&isApproved=true"),
        fetch("/api/crawls?limit=6&status=UPCOMING"),
      ]);

      if (barsRes.ok) {
        let barsArray = await barsRes.json();
        barsArray = barsArray.data || barsArray.bars || barsArray;
        if (!Array.isArray(barsArray)) barsArray = [];

        const barsWithDistance = barsArray.map((bar: Bar) => {
          let distance = bar.distance;
          if (!distance && userLocation && bar.latitude && bar.longitude) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              bar.latitude,
              bar.longitude,
            );
          }
          return { ...bar, distance };
        });

        if (userLocation) {
          barsWithDistance.sort(
            (a: Bar, b: Bar) => (a.distance || 999) - (b.distance || 999),
          );
        }

        setBars(barsWithDistance);
      }

      if (vipRes.ok) {
        let vipArray = await vipRes.json();
        vipArray = vipArray.passes || vipArray.data || vipArray;
        if (!Array.isArray(vipArray)) vipArray = [];
        setVipPasses(vipArray);
      }

      if (promotionsRes.ok) {
        let promosArray = await promotionsRes.json();
        promosArray = promosArray.promotions || promosArray.data || promosArray;
        if (!Array.isArray(promosArray)) promosArray = [];
        setPromotions(promosArray);
      }

      if (crawlsRes.ok) {
        let crawlsArray = await crawlsRes.json();
        crawlsArray = crawlsArray.crawls || crawlsArray.data || crawlsArray;
        if (!Array.isArray(crawlsArray)) crawlsArray = [];
        setCrawls(crawlsArray);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/app/bars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePromotionClick = (promotion: BarPromotion) => {
    router.push(`/app/bars/${promotion.barId}`);
  };

  const handleVIPClick = (pass: VIPPassEnhanced) => {
    router.push(`/app/vip-pass/${pass.id}`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>
            <div>Getting your location and loading amazing venues...</div>
          </LoadingState>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container>
          <ErrorState>
            {error}
            <button onClick={() => fetchHomeData()}>Try Again</button>
          </ErrorState>
        </Container>
      </PageWrapper>
    );
  }

  // Get bars for different sections
  const trendingBars =
    bars.slice(0, 6).length >= 4 ? bars.slice(0, 6) : FAKE_TRENDING_BARS;
  const promotedBars = bars.slice(6, 10);
  const nearYouBars = bars.slice(10, 14);

  return (
    <PageWrapper>
      <Container>
        <Header>
          <TitleGroup>
            <Subtitle>{getCurrentDate()}</Subtitle>
            <Title>Find your scene.</Title>
          </TitleGroup>
          <SearchBar>
            <MagnifyingGlass size={20} color="#5C5C63" />
            <SearchInput
              placeholder="Search bars, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </SearchBar>
        </Header>

        {/* Popular Cities Section */}
        <Section>
          <SectionTitle>Popular Cities</SectionTitle>
          <CityRow>
            {CITIES.map((city) => (
              <CityChip
                key={city}
                city={city}
                active={city === "New York"}
                onClick={() =>
                  router.push(`/app/bars?city=${encodeURIComponent(city)}`)
                }
              />
            ))}
          </CityRow>
        </Section>

        {/* Trending This Week Section - With fake data fallback */}
        <Section>
          <SectionTitle>Trending This Week</SectionTitle>
          <BarsRow>
            {trendingBars.map((bar) => {
              const mappedBar = mapBarToCardFormat(bar, bar.distance);
              return <BarCard key={bar.id} bar={mappedBar} variant="compact" />;
            })}
          </BarsRow>
        </Section>

        {/* VIP Passes Section */}
        {vipPasses.length > 0 && (
          <Section>
            <SectionTitle>VIP Passes</SectionTitle>
            <BarsRow>
              {vipPasses.slice(0, 6).map((pass) => (
                <VIPCardWrapper
                  key={pass.id}
                  onClick={() => handleVIPClick(pass)}
                >
                  <div>
                    <VIPName>{pass.name}</VIPName>
                    <VIPBarName>{pass.bar?.name || "Premium Venue"}</VIPBarName>
                  </div>
                  <div>
                    <VIPPrice>{formatPrice(pass.priceCents)}</VIPPrice>
                    {pass.benefits?.[0] && (
                      <VIPBenefit>
                        ✨ {pass.benefits[0].substring(0, 40)}...
                      </VIPBenefit>
                    )}
                  </div>
                </VIPCardWrapper>
              ))}
            </BarsRow>
          </Section>
        )}

        {/* Promoted Near You Section */}
        {promotedBars.length > 0 && (
          <Section>
            <SectionTitle>Promoted Near You</SectionTitle>
            <BarGrid>
              {promotedBars.map((bar) => {
                const mappedBar = mapBarToCardFormat(bar, bar.distance);
                return <BarCard key={bar.id} bar={mappedBar} variant="full" />;
              })}
            </BarGrid>
          </Section>
        )}

        {/* Active Crawls Section */}
        {crawls.length > 0 && (
          <Section>
            <SectionTitle>Active Crawls</SectionTitle>
            <CrawlGrid>
              {crawls.slice(0, 4).map((crawl) => {
                const mappedCrawl = mapCrawlToCardFormat(crawl);
                return <CrawlCard key={crawl.id} crawl={mappedCrawl} />;
              })}
            </CrawlGrid>
          </Section>
        )}

        {/* Current Promotions Section */}
        {promotions.length > 0 && (
          <Section>
            <SectionTitle>Current Promotions</SectionTitle>
            <BarGrid>
              {promotions.slice(0, 4).map((promo) => (
                <PromotionCardWrapper
                  key={promo.id}
                  onClick={() => handlePromotionClick(promo)}
                >
                  <PromotionTitle>{promo.title}</PromotionTitle>
                  <PromotionDescription>
                    {promo.description.length > 80
                      ? promo.description.substring(0, 80) + "..."
                      : promo.description}
                  </PromotionDescription>
                  {promo.discount && (
                    <PromotionDiscount>{promo.discount}% OFF</PromotionDiscount>
                  )}
                  <PromotionBarName>
                    at {promo.bar?.name || "Venue"}
                  </PromotionBarName>
                  {promo.endDate && (
                    <PromotionEndDate>
                      Ends {formatDate(promo.endDate)}
                    </PromotionEndDate>
                  )}
                </PromotionCardWrapper>
              ))}
            </BarGrid>
          </Section>
        )}

        {/* Near You Section */}
        {nearYouBars.length > 0 && (
          <Section>
            <SectionTitle>Near You</SectionTitle>
            <BarGrid>
              {nearYouBars.map((bar) => {
                const mappedBar = mapBarToCardFormat(bar, bar.distance);
                return <BarCard key={bar.id} bar={mappedBar} variant="full" />;
              })}
            </BarGrid>
          </Section>
        )}

        {/* Browse Categories Section */}
        <Section>
          <SectionTitle>Browse Categories</SectionTitle>
          <CategoryGrid>
            {Object.entries(categoryIcons).map(([category, icon]) => (
              <CategoryCard
                key={category}
                href={`/app/bars?type=${category.toLowerCase()}`}
              >
                <CategoryIcon>{icon}</CategoryIcon>
                <CategoryName>{category.replace(/_/g, " ")}</CategoryName>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default AppHome;
