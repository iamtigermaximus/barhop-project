"use client";
import styled from "styled-components";
import { getVibeColor } from "./Social";

export const SocialContainer = styled.div`
  padding: 1rem 1rem 10rem;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  height: 100%;
  animation: gradientShift 8s ease infinite;

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
  }
`;

export const SocialHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  background-color: transparent !important;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.p`
  color: #e2e8f0;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

// Header Actions
export const HeaderActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const EditProfileButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
  padding: 0.25rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
    background: rgba(139, 92, 246, 0.2);
  }

  /* Make span (icon) same size as text */
  span {
    font-size: 1em; /* Same as parent font-size */
  }

  /* Tablet */
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 1rem; /* Smaller text */
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem; /* Even smaller text */
  }

  /* Small mobile */
  @media (max-width: 360px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem; /* Smallest text */
  }
`;

// How it works section - Only show when needed
export const HowItWorks = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 1.5rem;
  margin: 1.5rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

export const HowItWorksTitle = styled.h2`
  color: #f8fafc;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

export const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const Step = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const StepIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

export const StepTitle = styled.h3`
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

export const StepDescription = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
`;

// View Toggle
export const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 0.5rem;
  background-color: transparent !important;
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(30, 41, 59, 0.8)"};
  border: 1px solid
    ${(props) => (props.$active ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
  color: ${(props) => (props.$active ? "white" : "#94a3b8")};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

// City Detection Component
export const CityDetection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* margin: 1rem 0;
  padding: 1rem; */
  /* background: rgba(30, 41, 59, 0.5); */
  background-color: transparent !important;

  border-radius: 12px;
  /* border: 1px solid rgba(139, 92, 246, 0.2); */
`;

export const CityBadge = styled.div`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DetectingCity = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Map Container
export const MapContainer = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? "block" : "none")};
  margin: 1.5rem 0;
  height: 400px;
`;

// Grindr-style Users Grid
export const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;
  background-color: transparent !important;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }

  /* Mobile - 4 cards per row */
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  /* Small mobile - keep 4 per row but adjust gap */
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.375rem;
  }

  /* Extra small mobile */
  @media (max-width: 360px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25rem;
  }
`;

export const UserCard = styled.div`
  background: rgba(30, 41, 59, 0.9);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.2);

  &:hover {
    transform: translateY(-2px);
    border-color: #8b5cf6;
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    border-radius: 10px;

    &:hover {
      transform: translateY(-1px); /* Smaller hover effect on mobile */
    }
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

export const UserImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);

  /* Tablet */
  @media (max-width: 1024px) {
    height: 180px;
  }

  /* Mobile - smaller height */
  @media (max-width: 768px) {
    height: 120px;
  }

  /* Small mobile - even smaller */
  @media (max-width: 480px) {
    height: 100px;
  }

  /* Extra small mobile */
  @media (max-width: 360px) {
    height: 80px;
  }
`;

export const UserImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: 600;

  /* Mobile adjustments */
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const UserStatusBadge = styled.div<{ $status: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$status === "ONLINE"
      ? "#10b981"
      : props.$status === "SOCIAL_MODE"
      ? "#8b5cf6"
      : props.$status === "IN_MEETUP"
      ? "#f59e0b"
      : "#6b7280"};
  border: 2px solid rgba(15, 23, 42, 0.9);

  /* Mobile - smaller badge */
  @media (max-width: 768px) {
    top: 6px;
    right: 6px;
    width: 6px;
    height: 6px;
    border: 1.5px solid rgba(15, 23, 42, 0.9);
  }

  @media (max-width: 480px) {
    top: 4px;
    right: 4px;
    width: 5px;
    height: 5px;
    border: 1px solid rgba(15, 23, 42, 0.9);
  }
`;

export const UserVibeBadge = styled.div<{ $vibe: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${(props) => getVibeColor(props.$vibe)};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  /* Mobile - smaller badge */
  @media (max-width: 768px) {
    top: 6px;
    left: 6px;
    padding: 1px 4px;
    border-radius: 6px;
    font-size: 0.5rem;
  }

  @media (max-width: 480px) {
    top: 4px;
    left: 4px;
    padding: 1px 3px;
    border-radius: 4px;
    font-size: 0.45rem;
  }
`;

export const UserInfo = styled.div`
  padding: 0.75rem;

  /* Mobile - smaller padding */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem;
  }
`;

export const UserName = styled.h3`
  color: #f8fafc;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Mobile - smaller font */
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

export const UserAge = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;

  /* Mobile - smaller font */
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DistanceBadge = styled.div`
  color: #10b981;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  /* Mobile - smaller font */
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

export const LocationInfo = styled.div`
  color: #94a3b8;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Mobile - smaller font */
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;
export const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  /* Mobile - smaller gap */
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 0.375rem;
  }

  @media (max-width: 480px) {
    gap: 0.125rem;
    margin-top: 0.25rem;
  }
`;

export const ActionButton = styled.button<{
  $variant: "primary" | "secondary";
}>`
  flex: 1;
  background: ${(props) =>
    props.$variant === "primary"
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(139, 92, 246, 0.1)"};
  border: ${(props) =>
    props.$variant === "primary"
      ? "none"
      : "1px solid rgba(139, 92, 246, 0.3)"};
  border-radius: 6px;
  padding: 0.5rem;
  color: ${(props) => (props.$variant === "primary" ? "white" : "#8b5cf6")};
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  /* Mobile - smaller padding and font */
  @media (max-width: 768px) {
    padding: 0.375rem;
    font-size: 0.65rem;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 0.25rem;
    font-size: 0.6rem;
    border-radius: 3px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.$variant === "primary"
        ? "0 4px 12px rgba(139, 92, 246, 0.4)"
        : "0 2px 8px rgba(139, 92, 246, 0.2)"};
  }

  /* Reduce hover effect on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-0.5px);
    }
  }
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  margin: 1rem 0;
`;

export const SuccessState = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #10b981;
  margin: 1rem 0;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
  margin: 1.5rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent !important;

  @media (min-width: 768px) {
    gap: 1rem;
  }

  @media (min-width: 480px) {
    gap: 1rem;
  }
`;

export const StatCard = styled.div`
  min-width: 100px;
  padding: 0.5rem;
  background: rgba(30, 41, 59, 0.8);
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;

  @media (min-width: 768px) {
  }

  @media (min-width: 480px) {
  }
`;

export const StatNumber = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-bottom: 0.25rem;
  font-size: 1rem;

  @media (min-width: 768px) {
  }

  @media (min-width: 480px) {
  }
`;

export const StatLabel = styled.div`
  font-size: 0.6rem;
  color: #94a3b8;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 0.7rem;
  }

  @media (min-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const EmptyUsersState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

// Hop In Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  color: #e2e8f0;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ModalUserImage = styled.div<{ $imageUrl?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: 600;
`;

export const ModalUserInfo = styled.div`
  flex: 1;
`;

export const ModalUserName = styled.h3`
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
`;

export const ModalUserVibe = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const ModalSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const ModalSectionTitle = styled.h4`
  color: #f8fafc;
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
`;

export const ModalBio = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
`;

export const ModalInterests = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ModalInterestTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ModalButton = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  background: ${(props) =>
    props.$variant === "primary"
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(139, 92, 246, 0.1)"};
  border: ${(props) =>
    props.$variant === "primary"
      ? "none"
      : "1px solid rgba(139, 92, 246, 0.3)"};
  border-radius: 8px;
  padding: 1rem;
  color: ${(props) => (props.$variant === "primary" ? "white" : "#8b5cf6")};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$variant === "primary"
        ? "0 8px 25px rgba(139, 92, 246, 0.4)"
        : "0 4px 15px rgba(139, 92, 246, 0.2)"};
  }
`;

// Debug Components (commented but not removed)
/*
export const DebugSection = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 0.75rem;
  color: #94a3b8;
`;

export const DebugButton = styled.button`
  background: #f59e0b;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  margin: 0.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: #d97706;
  }
`;

const DebugButtonGreen = styled(DebugButton)`
  background: #10b981;

  &:hover {
    background: #059669;
  }
`;
*/
// Add this to your Social.styles.ts file
export const DesktopNotificationBell = styled(EditProfileButton)`
  @media (max-width: 768px) {
    display: none !important;
  }
`;
