// "use client";
// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   MagnifyingGlass,
//   Calendar,
//   MapPin,
//   Users,
//   Crown,
// } from "phosphor-react";
// import BarCard from "../common/bar-card/BarCard";
// import CityChip from "../common/city-chip/CityChip";
// import PromotionCard from "../common/promotion-card/PromotionCard";
// import { useSession } from "next-auth/react";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// // ============================================
// // STYLED COMPONENTS
// // ============================================

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

// const Header = styled.header`
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   margin-bottom: 32px;

//   @media (min-width: 768px) {
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//   }
// `;

// const TitleGroup = styled.div``;

// const Title = styled.h1`
//   font-family: ${({ theme }) => theme.fonts.dm};
//   font-size: 28px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};

//   @media (min-width: 768px) {
//     font-size: 40px;
//   }
// `;

// const Subtitle = styled.p`
//   color: ${({ theme }) => theme.colors.primaryAccent};
//   font-size: 12px;
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const SearchBar = styled.div`
//   display: flex;
//   align-items: center;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 12px;
//   padding: 12px 16px;
//   gap: 8px;
//   width: 100%;
//   transition: border-color 0.2s;

//   @media (min-width: 768px) {
//     max-width: 320px;
//   }

//   &:focus-within {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//   }
// `;

// const SearchInput = styled.input`
//   background: transparent;
//   border: none;
//   outline: none;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-family: ${({ theme }) => theme.fonts.dm};
//   font-size: 14px;
//   flex: 1;

//   &::placeholder {
//     color: ${({ theme }) => theme.colors.textMuted};
//   }
// `;

// const SectionTitle = styled.h2`
//   font-family: ${({ theme }) => theme.fonts.dm};
//   font-size: 20px;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin-bottom: 16px;

//   @media (min-width: 768px) {
//     font-size: 24px;
//     margin-bottom: 20px;
//   }
// `;

// const Section = styled.section`
//   margin-bottom: 40px;
// `;

// const CityRow = styled.div`
//   display: flex;
//   gap: 10px;
//   overflow-x: auto;
//   padding-bottom: 8px;
//   -webkit-overflow-scrolling: touch;

//   &::-webkit-scrollbar {
//     display: none;
//   }

//   @media (min-width: 768px) {
//     flex-wrap: wrap;
//     overflow-x: visible;
//   }
// `;

// const BarGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 16px;

//   @media (min-width: 480px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (min-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(3, 1fr);
//   }

//   @media (min-width: 1280px) {
//     grid-template-columns: repeat(4, 1fr);
//   }
// `;

// const BarsRow = styled.div`
//   display: flex;
//   gap: 16px;
//   overflow-x: auto;
//   padding-bottom: 8px;
//   -webkit-overflow-scrolling: touch;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;

// const CrawlGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 16px;

//   @media (min-width: 600px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
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
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   padding: 1rem 0.5rem;
//   text-decoration: none;
//   text-align: center;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   transition: all 0.3s ease;
//   min-height: 70px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;

//   &:hover {
//     border-color: ${({ theme }) => theme.colors.primaryAccent};
//     transform: translateY(-2px);
//     background: ${({ theme }) => theme.colors.tertiaryBackground};
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
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-size: 0.7rem;
//   font-weight: 600;
//   line-height: 1.2;
//   font-family: ${({ theme }) => theme.fonts.dm};

//   @media (min-width: 768px) {
//     font-size: 0.8rem;
//   }
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 2rem;
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

// // ============================================
// // ENHANCED CRAWL CARD
// // ============================================

// const EnhancedCrawlCardWrapper = styled(Link)`
//   display: block;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 20px;
//   overflow: hidden;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   text-decoration: none;
//   position: relative;
//   height: 100%;

//   &::before {
//     content: "";
//     position: absolute;
//     top: -2px;
//     left: -2px;
//     right: -2px;
//     bottom: -2px;
//     background: linear-gradient(
//       45deg,
//       #ff6b6b,
//       #f06595,
//       #cc5de8,
//       #5f3dc4,
//       #3b82f6,
//       #0ea5e9
//     );
//     background-size: 400% 400%;
//     border-radius: 22px;
//     opacity: 0;
//     transition: opacity 0.3s ease;
//     z-index: -1;
//   }

//   &:hover::before {
//     opacity: 1;
//   }

//   &:hover {
//     transform: translateY(-6px);
//     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
//   }
// `;

// const CrawlCardContent = styled.div`
//   padding: 1.25rem;
//   position: relative;
//   z-index: 1;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 20px;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
// `;

// const CrawlCardHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   margin-bottom: 1rem;
//   gap: 1rem;
//   flex-wrap: wrap;
// `;

// const CrawlCardName = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin: 0;
//   font-family: ${({ theme }) => theme.fonts.dm};
//   line-height: 1.3;
//   flex: 1;
// `;

// const CrawlCardStatus = styled.span<{ $status: string }>`
//   background: ${(props) => {
//     switch (props.$status) {
//       case "PLANNING":
//         return "linear-gradient(135deg, #f59e0b, #d97706)";
//       case "UPCOMING":
//         return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
//       case "ACTIVE":
//         return "linear-gradient(135deg, #10b981, #059669)";
//       default:
//         return "linear-gradient(135deg, #6b7280, #4b5563)";
//     }
//   }};
//   color: white;
//   padding: 4px 12px;
//   border-radius: 20px;
//   font-size: 0.7rem;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.mono};
//   white-space: nowrap;
// `;

// const CrawlCardMeta = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
//   margin-bottom: 1rem;
// `;

// const MetaRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   color: ${({ theme }) => theme.colors.textMuted};
//   font-size: 0.8rem;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const MetaIcon = styled.span`
//   font-size: 1rem;
//   width: 20px;
//   display: inline-flex;
//   align-items: center;
// `;

// const ParticipantsRow = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-top: 0.5rem;
//   padding-top: 0.75rem;
//   border-top: 1px solid ${({ theme }) => theme.colors.border};
// `;

// const ParticipantsCount = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   color: ${({ theme }) => theme.colors.secondaryAccent};
//   font-size: 0.85rem;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const ProgressBar = styled.div<{ $percentage: number }>`
//   width: 100px;
//   height: 4px;
//   background: ${({ theme }) => theme.colors.tertiaryBackground};
//   border-radius: 2px;
//   overflow: hidden;

//   &::after {
//     content: "";
//     display: block;
//     height: 100%;
//     width: ${(props) => props.$percentage}%;
//     background: linear-gradient(90deg, #10b981, #0ea5e9);
//     border-radius: 2px;
//     transition: width 0.3s ease;
//   }
// `;

// const BarsPreview = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   margin-top: 0.5rem;
//   font-size: 0.7rem;
//   color: ${({ theme }) => theme.colors.textMuted};
// `;

// const CardButton = styled.div`
//   margin-top: auto;
//   padding-top: 1rem;
//   text-align: center;
//   color: ${({ theme }) => theme.colors.primaryAccent};
//   font-size: 0.8rem;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.dm};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5rem;

//   &::after {
//     content: "→";
//     transition: transform 0.3s ease;
//   }

//   ${EnhancedCrawlCardWrapper}:hover &::after {
//     transform: translateX(4px);
//   }
// `;

// // ============================================
// // ENHANCED VIP CARD
// // ============================================

// const EnhancedVIPCardWrapper = styled.div`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 20px;
//   overflow: hidden;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   position: relative;
//   height: 100%;

//   &::before {
//     content: "";
//     position: absolute;
//     top: -2px;
//     left: -2px;
//     right: -2px;
//     bottom: -2px;
//     background: linear-gradient(
//       45deg,
//       #ff6b6b,
//       #f06595,
//       #cc5de8,
//       #5f3dc4,
//       #3b82f6,
//       #0ea5e9
//     );
//     background-size: 400% 400%;
//     border-radius: 22px;
//     opacity: 0;
//     transition: opacity 0.3s ease;
//     z-index: -1;
//   }

//   &:hover::before {
//     opacity: 1;
//   }

//   &:hover {
//     transform: translateY(-6px);
//     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
//   }
// `;

// const VIPCardContent = styled.div`
//   padding: 1.25rem;
//   position: relative;
//   z-index: 1;
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border-radius: 20px;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
// `;

// const VIPCardHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   margin-bottom: 1rem;
//   gap: 1rem;
// `;

// const VIPCardName = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin: 0;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const VIPCardBarName = styled.div`
//   font-size: 0.8rem;
//   color: ${({ theme }) => theme.colors.secondaryAccent};
//   margin-top: 0.25rem;
//   font-family: ${({ theme }) => theme.fonts.mono};
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
// `;

// const VIPCardPrice = styled.div`
//   font-size: 1.5rem;
//   font-weight: 800;
//   color: ${({ theme }) => theme.colors.secondaryAccent};
//   font-family: ${({ theme }) => theme.fonts.mono};
//   margin: 1rem 0;

//   &::before {
//     content: "€";
//     font-size: 1rem;
//   }
// `;

// const VIPBenefitsPreview = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   margin: 0.75rem 0;
// `;

// const VIPBenefitChip = styled.span`
//   background: rgba(139, 92, 246, 0.15);
//   color: ${({ theme }) => theme.colors.primaryAccent};
//   padding: 4px 8px;
//   border-radius: 12px;
//   font-size: 0.65rem;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.mono};
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// const CrownIcon = styled(Crown)`
//   color: #f59e0b;
// `;

// // Add these styled components for VIP passes (matching Marketplace style)
// const PassCard = styled.div<{ $isSoldOut: boolean; $isNearby?: boolean }>`
//   background: ${({ theme }) => theme.colors.secondaryBackground};
//   border: 1px solid
//     ${(props) =>
//       props.$isSoldOut
//         ? "rgba(239, 68, 68, 0.3)"
//         : props.$isNearby
//           ? "rgba(16, 185, 129, 0.5)"
//           : props.theme.colors.border};
//   border-radius: 16px;
//   padding: 1.5rem;
//   cursor: ${(props) => (props.$isSoldOut ? "not-allowed" : "pointer")};
//   transition: all 0.3s ease;
//   position: relative;
//   opacity: ${(props) => (props.$isSoldOut ? 0.7 : 1)};
//   height: 100%;
//   display: flex;
//   flex-direction: column;

//   &:hover {
//     border-color: ${(props) =>
//       props.$isSoldOut
//         ? "rgba(239, 68, 68, 0.5)"
//         : props.$isNearby
//           ? "rgba(16, 185, 129, 0.8)"
//           : props.theme.colors.primaryAccent};
//     transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-4px)")};
//     box-shadow: ${(props) =>
//       props.$isSoldOut
//         ? "none"
//         : props.$isNearby
//           ? "0 12px 30px rgba(16, 185, 129, 0.4)"
//           : "0 12px 30px rgba(139, 92, 246, 0.3)"};
//   }
// `;

// const PriceSection = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 1rem;
//   margin-top: auto;
// `;

// const CurrentPrice = styled.div`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 1.4rem;
//   display: inline-block;
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const OriginalPrice = styled.div`
//   color: ${({ theme }) => theme.colors.textMuted};
//   text-decoration: line-through;
//   font-size: 1.1rem;
//   font-weight: 600;
//   font-family: ${({ theme }) => theme.fonts.dm};
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
//         ? "rgba(16, 185, 129, 0.2)"
//         : props.$type === "warning"
//           ? "rgba(245, 158, 11, 0.2)"
//           : "rgba(14, 165, 233, 0.2)"};
//   color: ${(props) =>
//     props.$type === "primary"
//       ? props.theme.colors.primaryAccent
//       : props.$type === "success"
//         ? "#10b981"
//         : props.$type === "warning"
//           ? "#f59e0b"
//           : props.theme.colors.secondaryAccent};
//   padding: 0.4rem 0.8rem;
//   border-radius: 8px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$type === "primary"
//       ? "rgba(139, 92, 246, 0.3)"
//       : props.$type === "success"
//         ? "rgba(16, 185, 129, 0.3)"
//         : props.$type === "warning"
//           ? "rgba(245, 158, 11, 0.3)"
//           : "rgba(14, 165, 233, 0.3)"};
//   font-family: ${({ theme }) => theme.fonts.mono};
// `;

// const BarInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 1rem;
//   padding: 1rem;
//   background: ${({ theme }) => theme.colors.tertiaryBackground};
//   border-radius: 12px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
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

// const BarName = styled.h3`
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin: 0 0 0.25rem 0;
//   font-size: 1.1rem;
//   font-weight: 700;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const BarType = styled.p`
//   color: ${({ theme }) => theme.colors.secondaryAccent};
//   margin: 0 0 0.25rem 0;
//   font-weight: 600;
//   font-size: 0.9rem;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const BarLocation = styled.p`
//   color: ${({ theme }) => theme.colors.textMuted};
//   margin: 0;
//   font-size: 0.8rem;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const PassHeader = styled.div`
//   margin-bottom: 1rem;
// `;

// const PassHeaderRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   margin-bottom: 0.5rem;
// `;

// const PassIcon = styled.span`
//   font-size: 1.2rem;
// `;

// const PassName = styled.h4`
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin: 0;
//   font-size: 1.3rem;
//   font-weight: 700;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const PassDescription = styled.p`
//   color: ${({ theme }) => theme.colors.textMuted};
//   margin: 0;
//   line-height: 1.5;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const BenefitsTitle = styled.h5`
//   color: ${({ theme }) => theme.colors.textPrimary};
//   margin: 0 0 0.75rem 0;
//   font-size: 1rem;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const BenefitItem = styled.div`
//   color: ${({ theme }) => theme.colors.textMuted};
//   margin-bottom: 0.5rem;
//   display: flex;
//   align-items: flex-start;
//   gap: 0.75rem;
//   font-size: 0.9rem;
//   line-height: 1.4;
//   font-family: ${({ theme }) => theme.fonts.dm};
// `;

// const BenefitCheck = styled.span`
//   color: #10b981;
//   flex-shrink: 0;
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
//   font-family: ${({ theme }) => theme.fonts.dm};
//   margin-top: auto;

//   &:hover {
//     transform: ${(props) => (props.$isSoldOut ? "none" : "translateY(-2px)")};
//     box-shadow: ${(props) =>
//       props.$isSoldOut ? "none" : "0 8px 20px rgba(139, 92, 246, 0.4)"};
//   }
// `;

// // Helper function for pass type icon
// const getPassTypeIcon = (type: string) => {
//   switch (type) {
//     case "SKIP_LINE":
//       return "🚀";
//     case "PREMIUM_ENTRY":
//       return "⭐";
//     case "COVER_INCLUDED":
//       return "🎫";
//     default:
//       return "🎪";
//   }
// };

// // Helper function for bar image
// const getBarImageForPass = (barName: string): string => {
//   const initial = barName.charAt(0).toUpperCase();
//   return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238b5cf6'/%3E%3Cstop offset='100%25' stop-color='%230ea5e9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
// };

// // ============================================
// // TYPES
// // ============================================

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
//   description: string | null;
//   type: string;
//   priceCents?: number;
//   price?: number;
//   originalPriceCents?: number | null;
//   originalPrice?: number | null;
//   benefits: string[];
//   skipLinePriority: boolean;
//   coverFeeIncluded: boolean;
//   coverFeeAmount: number;
//   barId: string;
//   bar?: {
//     id: string;
//     name: string;
//     district?: string;
//     city?: string;
//   };
//   validityStart?: string;
//   validityEnd?: string;
//   validDays?: string[];
//   totalQuantity?: number;
//   soldCount?: number;
//   maxPerUser?: number;
//   isActive?: boolean;
//   distance?: number;
// }

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
//   accentColor?: string | null;
//   callToAction?: string | null;
//   isActive?: boolean;
//   isApproved?: boolean;
// }

// interface Crawl {
//   id: string;
//   name: string;
//   date: string;
//   startTime: string;
//   maxParticipants: number;
//   currentParticipants: number;
//   city?: { name: string };
//   crawlBars?: Array<{ bar: { name: string } }>;
//   status: string;
// }

// // ============================================
// // HELPER FUNCTIONS
// // ============================================

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

// interface FakeBar {
//   id: string;
//   name: string;
//   type: string;
//   district: string;
//   cityName: string;
//   distance: number;
//   coverImage: null;
//   imageUrl: null;
//   logoUrl: null;
//   vipEnabled: boolean;
//   address: string;
//   latitude: null;
//   longitude: null;
// }

// const FAKE_TRENDING_BARS: FakeBar[] = [
//   {
//     id: "trending1",
//     name: "The Rooftop Lounge",
//     type: "LOUNGE",
//     district: "Downtown",
//     cityName: "New York",
//     distance: 0.3,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: true,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
//   {
//     id: "trending2",
//     name: "Neon Nightclub",
//     type: "CLUB",
//     district: "Arts District",
//     cityName: "Los Angeles",
//     distance: 0.5,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: true,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
//   {
//     id: "trending3",
//     name: "Craft Beer Hall",
//     type: "PUB",
//     district: "River North",
//     cityName: "Chicago",
//     distance: 0.2,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: false,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
//   {
//     id: "trending4",
//     name: "Secret Speakeasy",
//     type: "COCKTAIL_BAR",
//     district: "South Beach",
//     cityName: "Miami",
//     distance: 0.8,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: true,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
//   {
//     id: "trending5",
//     name: "Live Jazz Club",
//     type: "LIVE_MUSIC",
//     district: "Downtown",
//     cityName: "Austin",
//     distance: 0.4,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: false,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
//   {
//     id: "trending6",
//     name: "Sports Grill & Bar",
//     type: "SPORTS_BAR",
//     district: "Capitol Hill",
//     cityName: "Seattle",
//     distance: 0.6,
//     coverImage: null,
//     imageUrl: null,
//     logoUrl: null,
//     vipEnabled: false,
//     address: "",
//     latitude: null,
//     longitude: null,
//   },
// ];

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

// const formatDate = (dateString: string): string => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// };

// const formatPrice = (cents?: number): string => {
//   if (cents === undefined || cents === null) return "€0.00";
//   return `€${(cents / 100).toFixed(2)}`;
// };

// const mapBarToCardFormat = (bar: Bar, distance?: number) => {
//   const getGenresFromType = (type: string): string[] => {
//     const genreMap: { [key: string]: string[] } = {
//       PUB: ["Pub", "Beer"],
//       CLUB: ["Club", "Dance"],
//       LOUNGE: ["Lounge", "Cocktails"],
//       COCKTAIL_BAR: ["Cocktails", "Mixology"],
//       RESTAURANT_BAR: ["Dining", "Wine"],
//       SPORTS_BAR: ["Sports", "Beer"],
//       KARAOKE: ["Karaoke", "Entertainment"],
//       LIVE_MUSIC: ["Live Music", "Concerts"],
//     };
//     return genreMap[type] || ["Bar", "Drinks"];
//   };

//   const getPriceRange = (type: string): string => {
//     const priceMap: { [key: string]: string } = {
//       PUB: "$$",
//       CLUB: "$$$",
//       LOUNGE: "$$$",
//       COCKTAIL_BAR: "$$$",
//       RESTAURANT_BAR: "$$",
//       SPORTS_BAR: "$$",
//       KARAOKE: "$$",
//       LIVE_MUSIC: "$$",
//     };
//     return priceMap[type] || "$$";
//   };

//   const getRating = (): string => {
//     const ratings = ["4.2", "4.5", "4.3", "4.7", "4.0", "4.4"];
//     return ratings[Math.floor(Math.random() * ratings.length)];
//   };

//   const getImageUrl = (): string => {
//     return (
//       bar.coverImage ||
//       bar.imageUrl ||
//       bar.logoUrl ||
//       getPlaceholderImage(bar.type)
//     );
//   };

//   return {
//     id: bar.id,
//     name: bar.name,
//     rating: getRating(),
//     priceRange: getPriceRange(bar.type),
//     genres: getGenresFromType(bar.type),
//     images: [getImageUrl()],
//     distance: distance ? formatDistance(distance) : undefined,
//   };
// };

// // ============================================
// // PRICE HELPER FUNCTIONS
// // ============================================

// const getPriceInEuros = (pass: VIPPassEnhanced): number => {
//   if (pass.priceCents !== undefined && pass.priceCents !== null) {
//     return pass.priceCents / 100;
//   }
//   if (pass.price !== undefined && pass.price !== null) {
//     const price = pass.price;
//     return price > 100 ? price / 100 : price;
//   }
//   return 0;
// };

// const getOriginalPriceInEuros = (pass: VIPPassEnhanced): number | null => {
//   if (
//     pass.originalPriceCents !== undefined &&
//     pass.originalPriceCents !== null
//   ) {
//     return pass.originalPriceCents / 100;
//   }
//   if (pass.originalPrice !== undefined && pass.originalPrice !== null) {
//     const price = pass.originalPrice;
//     return price > 100 ? price / 100 : price;
//   }
//   return null;
// };

// // ============================================
// // ENHANCED COMPONENT FUNCTIONS
// // ============================================

// function EnhancedCrawlCardComponent({ crawl }: { crawl: Crawl }) {
//   const formatDateTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     });
//   };

//   const getStatusText = (status: string): string => {
//     switch (status) {
//       case "PLANNING":
//         return "Joinable";
//       case "UPCOMING":
//         return "Upcoming";
//       case "ACTIVE":
//         return "Active Now";
//       default:
//         return status.toLowerCase();
//     }
//   };

//   const percentage = Math.round(
//     (crawl.currentParticipants / crawl.maxParticipants) * 100,
//   );
//   const barCount = crawl.crawlBars?.length || 0;

//   return (
//     <EnhancedCrawlCardWrapper href={`/app/crawls/${crawl.id}`}>
//       <CrawlCardContent>
//         <CrawlCardHeader>
//           <CrawlCardName>{crawl.name}</CrawlCardName>
//           <CrawlCardStatus $status={crawl.status}>
//             {getStatusText(crawl.status)}
//           </CrawlCardStatus>
//         </CrawlCardHeader>

//         <CrawlCardMeta>
//           <MetaRow>
//             <MetaIcon>📅</MetaIcon>
//             <span>{formatDateTime(crawl.date)}</span>
//           </MetaRow>
//           <MetaRow>
//             <MetaIcon>📍</MetaIcon>
//             <span>{crawl.city?.name || "Helsinki"}</span>
//           </MetaRow>
//         </CrawlCardMeta>

//         <ParticipantsRow>
//           <ParticipantsCount>
//             <Users size={14} weight="bold" />
//             {crawl.currentParticipants}/{crawl.maxParticipants}
//           </ParticipantsCount>
//           <ProgressBar $percentage={percentage} />
//         </ParticipantsRow>

//         {barCount > 0 && (
//           <BarsPreview>
//             <span>🍻</span>
//             <span>
//               {barCount} bar{barCount !== 1 ? "s" : ""}
//             </span>
//           </BarsPreview>
//         )}

//         <CardButton>View Details</CardButton>
//       </CrawlCardContent>
//     </EnhancedCrawlCardWrapper>
//   );
// }

// function EnhancedVIPCardComponent({
//   pass,
//   router,
// }: {
//   pass: VIPPassEnhanced;
//   router: AppRouterInstance;
// }) {
//   const getBenefitIcon = (benefit: string): string => {
//     if (benefit.toLowerCase().includes("skip")) return "🚀";
//     if (benefit.toLowerCase().includes("cover")) return "🎫";
//     if (benefit.toLowerCase().includes("drink")) return "🍹";
//     return "✨";
//   };

//   return (
//     <EnhancedVIPCardWrapper
//       onClick={() => router.push(`/app/vip-pass/${pass.id}`)}
//     >
//       <VIPCardContent>
//         <VIPCardHeader>
//           <div>
//             <VIPCardName>{pass.name}</VIPCardName>
//             <VIPCardBarName>
//               <span>📍</span> {pass.bar?.name || "Premium Venue"}
//             </VIPCardBarName>
//           </div>
//           <CrownIcon size={24} weight="fill" />
//         </VIPCardHeader>

//         <VIPCardPrice>{formatPrice(pass.priceCents)}</VIPCardPrice>

//         {pass.benefits && pass.benefits.length > 0 && (
//           <VIPBenefitsPreview>
//             {pass.benefits.slice(0, 3).map((benefit: string, i: number) => (
//               <VIPBenefitChip key={i}>
//                 {getBenefitIcon(benefit)}{" "}
//                 {benefit.length > 30
//                   ? benefit.substring(0, 30) + "..."
//                   : benefit}
//               </VIPBenefitChip>
//             ))}
//           </VIPBenefitsPreview>
//         )}

//         <CardButton>View Pass</CardButton>
//       </VIPCardContent>
//     </EnhancedVIPCardWrapper>
//   );
// }

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const AppHome = () => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [bars, setBars] = useState<Bar[]>([]);
//   const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
//   const [crawls, setCrawls] = useState<Crawl[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [locationLoaded, setLocationLoaded] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [activePromotions, setActivePromotions] = useState<BarPromotion[]>([]);
//   const [upcomingPromotions, setUpcomingPromotions] = useState<BarPromotion[]>(
//     [],
//   );

//   const getCurrentDate = (): string => {
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//     };
//     return new Date().toLocaleDateString("en-US", options);
//   };

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

//   useEffect(() => {
//     if (locationLoaded) {
//       fetchHomeData();
//     }
//   }, [locationLoaded]);

//   const fetchHomeData = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       setError(null);

//       let barsUrl = "/api/bars?limit=20&isActive=true";
//       if (userLocation) {
//         barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;
//       }

//       const promotionsUrl =
//         "/api/promotions?isActive=true&isApproved=true&limit=20&includeUpcoming=true";

//       const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
//         fetch(barsUrl),
//         fetch("/api/vip/passes?limit=6&isActive=true"),
//         fetch(promotionsUrl),
//         fetch("/api/crawls?limit=6&status=UPCOMING"),
//       ]);

//       if (barsRes.ok) {
//         const barsData = await barsRes.json();
//         let barsArray: Bar[] = barsData.data || barsData.bars || barsData;
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

//         if (userLocation) {
//           barsWithDistance.sort(
//             (a: Bar, b: Bar) => (a.distance || 999) - (b.distance || 999),
//           );
//         }

//         setBars(barsWithDistance);
//       }

//       if (vipRes.ok) {
//         const vipData = await vipRes.json();
//         let vipArray: VIPPassEnhanced[] =
//           vipData.passes || vipData.data || vipData;
//         if (!Array.isArray(vipArray)) vipArray = [];
//         setVipPasses(vipArray);
//       }

//       if (promotionsRes.ok) {
//         const data = await promotionsRes.json();
//         let promosArray: BarPromotion[] = data.promotions || data.data || [];
//         if (!Array.isArray(promosArray)) promosArray = [];

//         const now = new Date();
//         const active: BarPromotion[] = [];
//         const upcoming: BarPromotion[] = [];

//         promosArray.forEach((promo) => {
//           const startDate = new Date(promo.startDate);
//           const endDate = new Date(promo.endDate);

//           if (startDate <= now && endDate >= now) {
//             active.push(promo);
//           } else if (startDate > now) {
//             upcoming.push(promo);
//           }
//         });

//         active.sort(
//           (a, b) =>
//             new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
//         );
//         upcoming.sort(
//           (a, b) =>
//             new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
//         );

//         setActivePromotions(active);
//         setUpcomingPromotions(upcoming);
//       }

//       if (crawlsRes.ok) {
//         const crawlsData = await crawlsRes.json();
//         let crawlsArray: Crawl[] =
//           crawlsData.crawls || crawlsData.data || crawlsData;
//         if (!Array.isArray(crawlsArray)) crawlsArray = [];
//         setCrawls(crawlsArray);
//       }
//     } catch (error) {
//       console.error("Error fetching home data:", error);
//       setError("Failed to load data. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === "Enter" && searchQuery.trim()) {
//       router.push(`/app/bars?search=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   if (loading) {
//     return (
//       <PageWrapper>
//         <Container>
//           <LoadingState>
//             <div>Getting your location and loading amazing venues...</div>
//           </LoadingState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   if (error) {
//     return (
//       <PageWrapper>
//         <Container>
//           <ErrorState>
//             {error}
//             <button onClick={() => fetchHomeData()}>Try Again</button>
//           </ErrorState>
//         </Container>
//       </PageWrapper>
//     );
//   }

//   const trendingBars =
//     bars.slice(0, 6).length >= 4 ? bars.slice(0, 6) : FAKE_TRENDING_BARS;
//   const nearYouBars = bars.slice(10, 14);

//   return (
//     <PageWrapper>
//       <Container>
//         <Header>
//           <TitleGroup>
//             <Subtitle>{getCurrentDate()}</Subtitle>
//             <Title>Find your scene.</Title>
//           </TitleGroup>
//           <SearchBar>
//             <MagnifyingGlass size={20} color="#5C5C63" />
//             <SearchInput
//               placeholder="Search bars, venues..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleSearch}
//             />
//           </SearchBar>
//         </Header>

//         <Section>
//           <SectionTitle>Trending This Week</SectionTitle>
//           <BarsRow>
//             {trendingBars.map((bar) => {
//               const mappedBar = mapBarToCardFormat(
//                 bar as Bar,
//                 (bar as FakeBar).distance,
//               );
//               return <BarCard key={bar.id} bar={mappedBar} variant="compact" />;
//             })}
//           </BarsRow>
//         </Section>

//         {vipPasses.length > 0 && (
//           <Section>
//             <SectionTitle>
//               <CrownIcon
//                 size={20}
//                 weight="fill"
//                 style={{ display: "inline", marginRight: "8px" }}
//               />
//               VIP Passes
//             </SectionTitle>
//             <BarGrid>
//               {vipPasses.slice(0, 4).map((pass) => {
//                 const priceInEuros = getPriceInEuros(pass);
//                 const originalPriceInEuros = getOriginalPriceInEuros(pass);
//                 const isSoldOut = false;
//                 const isNearby = pass.distance ? pass.distance < 2 : false;

//                 return (
//                   <PassCard
//                     key={pass.id}
//                     $isSoldOut={isSoldOut}
//                     $isNearby={isNearby}
//                     onClick={() => router.push(`/app/vip-pass/${pass.id}`)}
//                   >
//                     <BarInfo>
//                       <BarImage
//                         src={getBarImageForPass(pass.bar?.name || "Bar")}
//                         alt={pass.bar?.name || "Bar"}
//                       />
//                       <BarDetails>
//                         <BarName>{pass.bar?.name || "Premium Venue"}</BarName>
//                         <BarType>{pass.bar?.district || "City Center"}</BarType>
//                         <BarLocation>Helsinki</BarLocation>
//                       </BarDetails>
//                     </BarInfo>

//                     <PassHeader>
//                       <PassHeaderRow>
//                         <PassIcon>{getPassTypeIcon(pass.type)}</PassIcon>
//                         <PassName>{pass.name}</PassName>
//                       </PassHeaderRow>
//                       <PassDescription>
//                         {pass.description ||
//                           "Exclusive VIP access with premium benefits"}
//                       </PassDescription>
//                     </PassHeader>

//                     <FeatureBadges>
//                       {pass.benefits && pass.benefits.length > 0 && (
//                         <FeatureBadge $type="primary">
//                           ⭐ VIP Access
//                         </FeatureBadge>
//                       )}
//                       <FeatureBadge $type="info">✅ Skip Line</FeatureBadge>
//                       <FeatureBadge $type="warning">
//                         {pass.maxPerUser === 1
//                           ? "1 per person"
//                           : `${pass.maxPerUser || 1} max`}
//                       </FeatureBadge>
//                     </FeatureBadges>

//                     {pass.benefits && pass.benefits.length > 0 && (
//                       <div style={{ margin: "1.5rem 0" }}>
//                         <BenefitsTitle>What&apos;s Included:</BenefitsTitle>
//                         {pass.benefits.slice(0, 3).map((benefit, index) => (
//                           <BenefitItem key={index}>
//                             <BenefitCheck>✓</BenefitCheck>
//                             {benefit}
//                           </BenefitItem>
//                         ))}
//                       </div>
//                     )}

//                     <PriceSection>
//                       <CurrentPrice>
//                         €
//                         {isNaN(priceInEuros) ? "0.00" : priceInEuros.toFixed(2)}
//                       </CurrentPrice>
//                       {originalPriceInEuros &&
//                         originalPriceInEuros > priceInEuros && (
//                           <OriginalPrice>
//                             €{originalPriceInEuros.toFixed(2)}
//                           </OriginalPrice>
//                         )}
//                     </PriceSection>

//                     <PurchaseButton
//                       $isSoldOut={isSoldOut}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (!session) {
//                           router.push(
//                             `/app/auth/login?callbackUrl=${encodeURIComponent(
//                               `/app/vip/payment?passId=${pass.id}`,
//                             )}`,
//                           );
//                         } else {
//                           router.push(
//                             `/app/vip-pass/vip-payment?passId=${pass.id}`,
//                           );
//                         }
//                       }}
//                       disabled={isSoldOut}
//                     >
//                       {isSoldOut
//                         ? "Sold Out"
//                         : `Buy Now - €${isNaN(priceInEuros) ? "0.00" : priceInEuros.toFixed(2)}`}
//                     </PurchaseButton>
//                   </PassCard>
//                 );
//               })}
//             </BarGrid>
//           </Section>
//         )}

//         {activePromotions.length > 0 && (
//           <Section>
//             <SectionTitle>🔥 Active Promotions</SectionTitle>
//             <BarGrid>
//               {activePromotions.slice(0, 4).map((promo) => (
//                 <PromotionCard
//                   key={promo.id}
//                   promotion={{
//                     id: promo.id,
//                     title: promo.title,
//                     description: promo.description,
//                     type: promo.type,
//                     discount: promo.discount,
//                     imageUrl: promo.imageUrl ?? null,
//                     accentColor: promo.accentColor ?? null,
//                     callToAction: promo.callToAction ?? null,
//                     barId: promo.barId,
//                     bar: promo.bar,
//                     startDate: promo.startDate,
//                     endDate: promo.endDate,
//                   }}
//                 />
//               ))}
//             </BarGrid>
//           </Section>
//         )}

//         {upcomingPromotions.length > 0 && (
//           <Section>
//             <SectionTitle>📅 Upcoming Promotions</SectionTitle>
//             <BarGrid>
//               {upcomingPromotions.slice(0, 4).map((promo) => (
//                 <PromotionCard
//                   key={promo.id}
//                   promotion={{
//                     id: promo.id,
//                     title: promo.title,
//                     description: promo.description,
//                     type: promo.type,
//                     discount: promo.discount,
//                     imageUrl: promo.imageUrl ?? null,
//                     accentColor: promo.accentColor ?? null,
//                     callToAction: promo.callToAction ?? null,
//                     barId: promo.barId,
//                     bar: promo.bar,
//                     startDate: promo.startDate,
//                     endDate: promo.endDate,
//                   }}
//                 />
//               ))}
//             </BarGrid>
//           </Section>
//         )}

//         {crawls.length > 0 && (
//           <Section>
//             <SectionTitle>
//               <Calendar
//                 size={20}
//                 style={{ display: "inline", marginRight: "8px" }}
//               />
//               Active Events
//             </SectionTitle>
//             <CrawlGrid>
//               {crawls.slice(0, 4).map((crawl) => (
//                 <EnhancedCrawlCardComponent key={crawl.id} crawl={crawl} />
//               ))}
//             </CrawlGrid>
//           </Section>
//         )}

//         {nearYouBars.length > 0 && (
//           <Section>
//             <SectionTitle>Near You</SectionTitle>
//             <BarGrid>
//               {nearYouBars.map((bar) => {
//                 const mappedBar = mapBarToCardFormat(bar, bar.distance);
//                 return <BarCard key={bar.id} bar={mappedBar} variant="full" />;
//               })}
//             </BarGrid>
//           </Section>
//         )}

//         <Section>
//           <SectionTitle>Browse Categories</SectionTitle>
//           <CategoryGrid>
//             {Object.entries(categoryIcons).map(([category, icon]) => (
//               <CategoryCard
//                 key={category}
//                 href={`/app/bars?type=${category.toLowerCase()}`}
//               >
//                 <CategoryIcon>{icon}</CategoryIcon>
//                 <CategoryName>{category.replace(/_/g, " ")}</CategoryName>
//               </CategoryCard>
//             ))}
//           </CategoryGrid>
//         </Section>
//       </Container>
//     </PageWrapper>
//   );
// };

// export default AppHome;
"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  Calendar,
  MapPin,
  Users,
  Crown,
  Star,
  ArrowRight,
} from "phosphor-react";
import BarCard from "../common/bar-card/BarCard";
import { useSession } from "next-auth/react";

// ============================================
// STYLED COMPONENTS
// ============================================

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.dm};
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.3s;

  &:hover {
    gap: 8px;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

// Horizontal scroll container for all cards
const HorizontalScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    width: 160px;
    scroll-snap-align: start;

    @media (min-width: 768px) {
      width: 192px;
    }
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

const CrownIcon = styled(Crown)`
  color: #f59e0b;
`;

// ============================================
// CARD COMPONENTS
// ============================================

// VIP Pass Card
const VIPCard = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  width: 160px;
  flex-shrink: 0;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 192px;
  }

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const VIPImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const VIPImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VIPBadge = styled.div`
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
  font-size: 10px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const VIPContent = styled.div`
  padding: 8px;
`;

const VIPName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const VIPBarName = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const VIPPrice = styled.span`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-size: 14px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 10px;
  }
`;

// Promotion Card
const PromotionCardWrapper = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  width: 160px;
  flex-shrink: 0;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 192px;
  }

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const PromotionImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const PromotionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PromotionDiscount = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PromotionType = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PromotionContent = styled.div`
  padding: 8px;
`;

const PromotionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const PromotionBar = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PromotionPrice = styled.span`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-size: 14px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 10px;
  }
`;

// Event Card
const EventCardWrapper = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  width: 160px;
  flex-shrink: 0;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 192px;
  }

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  height: 128px;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventStatus = styled.div<{ $status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${(props) => {
    switch (props.$status) {
      case "ACTIVE":
        return "rgba(16, 185, 129, 0.9)";
      case "UPCOMING":
        return "rgba(139, 92, 246, 0.9)";
      default:
        return "rgba(245, 158, 11, 0.9)";
    }
  }};
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: bold;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const EventContent = styled.div`
  padding: 8px;
`;

const EventName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 13px;
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.dm};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const EventDate = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EventParticipants = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProgressBar = styled.div<{ $percentage: number }>`
  width: 60px;
  height: 3px;
  background: ${({ theme }) => theme.colors.tertiaryBackground};
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.$percentage}%;
    background: linear-gradient(90deg, #10b981, #0ea5e9);
    border-radius: 2px;
  }
`;

// ============================================
// TYPES
// ============================================

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
  description: string | null;
  type: string;
  priceCents?: number;
  price?: number;
  originalPriceCents?: number | null;
  originalPrice?: number | null;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  barId: string;
  bar?: {
    id: string;
    name: string;
    district?: string;
    city?: string;
  };
  validityStart?: string;
  validityEnd?: string;
  validDays?: string[];
  totalQuantity?: number;
  soldCount?: number;
  maxPerUser?: number;
  isActive?: boolean;
  distance?: number;
}

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
  accentColor?: string | null;
  callToAction?: string | null;
  isActive?: boolean;
  isApproved?: boolean;
}

interface Crawl {
  id: string;
  name: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  city?: { name: string };
  crawlBars?: Array<{ bar: { name: string } }>;
  status: string;
}

// ============================================
// IMAGE HELPER FUNCTIONS
// ============================================

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

const getVIPImage = (): string => {
  return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
};

const getEventImage = (): string => {
  return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777017539/hoppr/images/barimage_arkklb.jpg";
};

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

// ============================================
// HELPER FUNCTIONS
// ============================================

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

const getPriceInEuros = (pass: VIPPassEnhanced): number => {
  if (pass.priceCents !== undefined && pass.priceCents !== null) {
    return pass.priceCents / 100;
  }
  if (pass.price !== undefined && pass.price !== null) {
    const price = pass.price;
    return price > 100 ? price / 100 : price;
  }
  return 0;
};

// ============================================
// PROMOTION CARD COMPONENT
// ============================================

function PromotionCardComponent({ promotion }: { promotion: BarPromotion }) {
  const router = useRouter();

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

  const promoImage = promotion.imageUrl || getPlaceholderImage("CLUB");

  return (
    <PromotionCardWrapper
      onClick={() => router.push(`/app/promotions/${promotion.id}`)}
    >
      <PromotionImageWrapper>
        <PromotionImage src={promoImage} alt={promotion.title} />
        {promotion.discount && promotion.discount > 0 && (
          <PromotionDiscount>{promotion.discount}% OFF</PromotionDiscount>
        )}
        <PromotionType>
          {getTypeIcon(promotion.type)} {getTypeLabel(promotion.type)}
        </PromotionType>
      </PromotionImageWrapper>
      <PromotionContent>
        <PromotionTitle>{promotion.title}</PromotionTitle>
        <PromotionBar>
          <MapPin size={10} /> {promotion.bar?.name || "Venue"}
        </PromotionBar>
        <PromotionPrice>
          {promotion.discount && promotion.discount > 0
            ? Math.round(30 - (30 * promotion.discount) / 100)
            : "Special"}
        </PromotionPrice>
      </PromotionContent>
    </PromotionCardWrapper>
  );
}

// ============================================
// EVENT CARD COMPONENT
// ============================================

function EventCardComponent({ event }: { event: Crawl }) {
  const router = useRouter();
  const percentage = Math.round(
    (event.currentParticipants / event.maxParticipants) * 100,
  );
  const getStatusText = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Live";
      case "UPCOMING":
        return "Soon";
      default:
        return "Join";
    }
  };

  return (
    <EventCardWrapper onClick={() => router.push(`/app/crawls/${event.id}`)}>
      <EventImageWrapper>
        <EventImage src={getEventImage()} alt={event.name} />
        <EventStatus $status={event.status}>
          {getStatusText(event.status)}
        </EventStatus>
      </EventImageWrapper>
      <EventContent>
        <EventName>{event.name}</EventName>
        <EventDate>
          <Calendar size={10} /> {new Date(event.date).toLocaleDateString()}
        </EventDate>
        <EventParticipants>
          <span>
            👥 {event.currentParticipants}/{event.maxParticipants}
          </span>
          <ProgressBar $percentage={percentage} />
        </EventParticipants>
      </EventContent>
    </EventCardWrapper>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

const AppHome = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [bars, setBars] = useState<Bar[]>([]);
  const [vipPasses, setVipPasses] = useState<VIPPassEnhanced[]>([]);
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoaded, setLocationLoaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePromotions, setActivePromotions] = useState<BarPromotion[]>([]);
  const [upcomingPromotions, setUpcomingPromotions] = useState<BarPromotion[]>(
    [],
  );

  const getCurrentDate = (): string => {
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
    if (locationLoaded) {
      fetchHomeData();
    }
  }, [locationLoaded]);

  const fetchHomeData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let barsUrl = "/api/bars?limit=30&isActive=true";
      if (userLocation) {
        barsUrl += `&userLat=${userLocation.latitude}&userLng=${userLocation.longitude}&sortBy=distance`;
      }

      const promotionsUrl =
        "/api/promotions?isActive=true&isApproved=true&limit=30&includeUpcoming=true";

      const [barsRes, vipRes, promotionsRes, crawlsRes] = await Promise.all([
        fetch(barsUrl),
        fetch("/api/vip/passes?limit=30&isActive=true"),
        fetch(promotionsUrl),
        fetch("/api/crawls?limit=30&status=UPCOMING"),
      ]);

      if (barsRes.ok) {
        const barsData = await barsRes.json();
        let barsArray: Bar[] = barsData.data || barsData.bars || barsData;
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
        const vipData = await vipRes.json();
        let vipArray: VIPPassEnhanced[] =
          vipData.passes || vipData.data || vipData;
        if (!Array.isArray(vipArray)) vipArray = [];
        setVipPasses(vipArray);
      }

      if (promotionsRes.ok) {
        const data = await promotionsRes.json();
        let promosArray: BarPromotion[] = data.promotions || data.data || [];
        if (!Array.isArray(promosArray)) promosArray = [];

        const now = new Date();
        const active: BarPromotion[] = [];
        const upcoming: BarPromotion[] = [];

        promosArray.forEach((promo) => {
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);

          if (startDate <= now && endDate >= now) {
            active.push(promo);
          } else if (startDate > now) {
            upcoming.push(promo);
          }
        });

        active.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
        );
        upcoming.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );

        setActivePromotions(active);
        setUpcomingPromotions(upcoming);
      }

      if (crawlsRes.ok) {
        const crawlsData = await crawlsRes.json();
        let crawlsArray: Crawl[] =
          crawlsData.crawls || crawlsData.data || crawlsData;
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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/app/bars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatBarForCard = (bar: Bar) => {
    const getRating = () => {
      const ratings = ["4.2", "4.5", "4.3", "4.7", "4.0", "4.4"];
      return ratings[Math.floor(Math.random() * ratings.length)];
    };

    const getPriceRange = () => {
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

    const getImageUrl = () => {
      if (bar.coverImage) return bar.coverImage;
      if (bar.imageUrl) return bar.imageUrl;
      if (bar.logoUrl) return bar.logoUrl;
      return getPlaceholderImage(bar.type);
    };

    const getDistance = () => {
      if (bar.distance) return formatDistance(bar.distance);
      if (bar.district) return bar.district;
      return undefined;
    };

    return {
      id: bar.id,
      name: bar.name,
      rating: getRating(),
      priceRange: getPriceRange(),
      genres: getGenres(),
      images: [getImageUrl()],
      distance: getDistance(),
    };
  };

  const allBars = bars.slice(0, 30);
  const nearYouBars = bars.slice(0, 30);

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

  return (
    <PageWrapper>
      <Container>
        <Header>
          <TitleGroup>
            <Subtitle>{getCurrentDate()}</Subtitle>
            <Title>Find your scene.</Title>
          </TitleGroup>
          {/* <SearchBar>
            <MagnifyingGlass size={20} color="#5C5C63" />
            <SearchInput
              placeholder="Search bars, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </SearchBar> */}
        </Header>

        {/* Trending Bars */}
        <Section>
          <SectionHeader>
            <SectionTitle>Trending This Week</SectionTitle>
            <ViewAllLink href="/app/bars">
              View all <ArrowRight size={14} />
            </ViewAllLink>
          </SectionHeader>
          <HorizontalScroll>
            {allBars.map((bar) => (
              <BarCard
                key={bar.id}
                bar={formatBarForCard(bar)}
                variant="compact"
              />
            ))}
          </HorizontalScroll>
        </Section>

        {/* Active Promotions */}
        {activePromotions.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>🔥 Active Promotions</SectionTitle>
              {/* Active Promotions - goes to Discover */}
              <ViewAllLink href="/app/discover#promotions">
                View all <ArrowRight size={14} />
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {activePromotions.map((promo) => (
                <PromotionCardComponent key={promo.id} promotion={promo} />
              ))}
            </HorizontalScroll>
          </Section>
        )}

        {/* Upcoming Promotions */}
        {upcomingPromotions.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>📅 Upcoming Promotions</SectionTitle>
              <ViewAllLink href="/app/promotions?upcoming=true">
                View all <ArrowRight size={14} />
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {upcomingPromotions.map((promo) => (
                <PromotionCardComponent key={promo.id} promotion={promo} />
              ))}
            </HorizontalScroll>
          </Section>
        )}

        {/* Events */}
        {crawls.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Calendar
                  size={20}
                  style={{ display: "inline", marginRight: "8px" }}
                />
                Active Events
              </SectionTitle>
              {/* Events - goes to Discover */}
              <ViewAllLink href="/app/crawls-dashboard">
                View all <ArrowRight size={14} />
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {crawls.map((event) => (
                <EventCardComponent key={event.id} event={event} />
              ))}
            </HorizontalScroll>
          </Section>
        )}

        {/* VIP Passes */}
        {vipPasses.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <CrownIcon
                  size={20}
                  weight="fill"
                  style={{ display: "inline", marginRight: "8px" }}
                />
                VIP Passes
              </SectionTitle>
              {/* VIP Passes - goes to Discover */}
              <ViewAllLink href="/app/vip-pass">
                View all <ArrowRight size={14} />
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {vipPasses.map((pass) => {
                const priceInEuros = getPriceInEuros(pass);
                const passImage = pass.bar?.name
                  ? getPlaceholderImage(pass.type || "CLUB")
                  : getVIPImage();

                return (
                  <VIPCard
                    key={pass.id}
                    onClick={() => router.push(`/app/vip-pass/${pass.id}`)}
                  >
                    <VIPImageWrapper>
                      <VIPImage src={passImage} alt={pass.name} />
                      <VIPBadge>
                        <Star size={10} weight="fill" color="#FF6B35" />
                        <span>VIP</span>
                      </VIPBadge>
                    </VIPImageWrapper>
                    <VIPContent>
                      <VIPName>{pass.name}</VIPName>
                      <VIPBarName>
                        <MapPin size={10} /> {pass.bar?.name || "Premium Venue"}
                      </VIPBarName>
                      <VIPPrice>{priceInEuros.toFixed(2)}</VIPPrice>
                    </VIPContent>
                  </VIPCard>
                );
              })}
            </HorizontalScroll>
          </Section>
        )}

        {/* Near You Bars */}
        {nearYouBars.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>Near You</SectionTitle>
              <ViewAllLink href="/app/bars?nearby=true">
                View all <ArrowRight size={14} />
              </ViewAllLink>
            </SectionHeader>
            <HorizontalScroll>
              {nearYouBars.map((bar) => (
                <BarCard
                  key={bar.id}
                  bar={formatBarForCard(bar)}
                  variant="compact"
                />
              ))}
            </HorizontalScroll>
          </Section>
        )}

        {/* Categories */}
        <Section>
          <SectionHeader>
            <SectionTitle>Browse Categories</SectionTitle>
            <ViewAllLink href="/app/categories">
              View all <ArrowRight size={14} />
            </ViewAllLink>
          </SectionHeader>
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
