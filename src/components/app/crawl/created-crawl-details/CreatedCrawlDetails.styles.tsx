"use client";
import styled from "styled-components";
import Link from "next/link";

export const Page = styled.div`
  padding: 2rem 1rem 10rem;
  margin: 0 auto;
  /* background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  ); */
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  /* min-height: calc(100vh - 70px); */
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem 10rem;
  }

  /* @media (max-width: 480px) {
    padding: 1rem 0.5rem 10rem;
  } */

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
`;

export const CrawlContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const CrawlHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const CrawlName = styled.h2`
  font-size: 2rem;
  color: #f8fafc;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CrawlDescription = styled.p`
  color: #e2e8f0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const DetailCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #8b5cf6;
`;

export const DetailLabel = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const DetailValue = styled.div`
  color: #f8fafc;
  font-size: 1.125rem;
  font-weight: 600;
`;

export const BarsSection = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
  padding-bottom: 0.5rem;
`;

// Enhanced Route Components
export const RouteMap = styled.div`
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

export const RouteStep = styled.div<{ $isLast: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }
`;

export const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

export const StepContent = styled.div`
  flex: 1;
`;

export const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const BarName = styled.div`
  color: #f8fafc;
  font-weight: 600;
  font-size: 1.1rem;
  flex: 1;
  min-width: 200px;
`;

// Fix: Provide default value for $walkable
export const DistanceBadge = styled.span<{ $walkable?: boolean }>`
  background: ${(props) =>
    props.$walkable
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #f59e0b, #d97706)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const BarDetails = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

// Fix: Provide default value for $walkable
export const TravelInfo = styled.div<{ $walkable?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 6px;
  border-left: 3px solid ${(props) => (props.$walkable ? "#10b981" : "#f59e0b")};
`;

export const RideShareButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

export const RideShareButton = styled.a`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const UberButton = styled(RideShareButton)`
  background: #000;
  color: white;
`;

export const LyftButton = styled(RideShareButton)`
  background: #ff00bf;
  color: white;
`;

export const TimeEstimate = styled.div`
  color: #8b5cf6;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

export const RouteSummary = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SummaryItem = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

export const SummaryValue = styled.div`
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const SummaryLabel = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
`;

// Fix: Provide default value for $isGood
export const WeatherAlert = styled.div<{ $isGood?: boolean }>`
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  background: ${(props) =>
    props.$isGood ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$isGood ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"};
  color: ${(props) => (props.$isGood ? "#10b981" : "#f59e0b")};
`;

export const ParticipantsSection = styled.div`
  margin-bottom: 2rem;
`;

export const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Participant = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const JoinButton = styled.button<{ $joined: boolean }>`
  background: ${(props) =>
    props.$joined
      ? "linear-gradient(45deg, #10b981, #059669)"
      : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const ShareButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
  }
`;

export const BackButton = styled(Link)`
  background: transparent;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: rgba(100, 116, 139, 0.6);
    transform: translateY(-2px);
  }
`;

export const DeleteButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const EditButton = styled(Link)`
  background: linear-gradient(45deg, #f59e0b, #d97706);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  background: ${(props) =>
    props.$status === "PLANNING"
      ? "linear-gradient(45deg, #0ea5e9, #3b82f6)"
      : props.$status === "UPCOMING"
      ? "linear-gradient(45deg, #8b5cf6, #a855f7)"
      : props.$status === "ACTIVE"
      ? "linear-gradient(45deg, #10b981, #059669)"
      : props.$status === "COMPLETED"
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

export const ModalTitle = styled.h3`
  color: #f8fafc;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const ModalMessage = styled.p`
  color: #e2e8f0;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const ConfirmButton = styled.button`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    border-color: rgba(100, 116, 139, 0.6);
    transform: translateY(-2px);
  }
`;
