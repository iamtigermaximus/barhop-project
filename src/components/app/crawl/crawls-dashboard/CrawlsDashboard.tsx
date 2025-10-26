"use client";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { HopprLoader } from "@/components/app/common/Loader/HopprLoader";

const Page = styled.div`
  padding: 2rem 1rem 10rem;
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  min-height: calc(100vh - 70px);
  width: 100%;
  box-sizing: border-box;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem 0.5rem 10rem;
    min-height: calc(100dvh - 70px);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.75rem 0.25rem 10rem;
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

const Title = styled.h1`
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
  line-height: 1.2;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
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

const Description = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  padding: 0 1rem;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.75rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  justify-content: center;
  background-color: transparent !important;
  flex-wrap: wrap;
  padding: 0 1rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${(props) =>
    props.$active ? "linear-gradient(45deg, #8b5cf6, #3b82f6)" : "transparent"};
  border: 1px solid
    ${(props) =>
      props.$active ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)"};
  color: ${(props) => (props.$active ? "white" : "#e2e8f0")};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 0.7rem 1.25rem;
    font-size: 0.95rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: 120px;
    text-align: center;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 100px;
    border-radius: 6px;
  }

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(45deg, #8b5cf6, #3b82f6)"
        : "rgba(139, 92, 246, 0.1)"};
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }

  /* Disable hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const CreateCrawlCard = styled(Link)`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 2.5rem 1.5rem;
    min-height: 180px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: 160px;
    border-radius: 12px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
    min-height: 140px;
    border-radius: 10px;
  }

  &:hover {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(30, 41, 59, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
  }

  /* Reduce hover effect on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const CreateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const CreateText = styled.div`
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CreateSubtext = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const CrawlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  padding: 0 1rem;
  background-color: transparent !important;

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
    margin-top: 1.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0 0.25rem;
    gap: 0.75rem;
  }
`;

const CrawlCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.75rem;
    border-radius: 14px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 10px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  /* Reduce hover effect on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CrawlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const CrawlName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 0.5rem;
  flex: 1;
  line-height: 1.3;
  word-wrap: break-word;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 1rem;
    width: 100%;
  }
`;

const CrawlStatus = styled.span<{
  $status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}>`
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
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    align-self: flex-start;
  }
`;

const CrawlMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const MetaValue = styled.span`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const BarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  /* Mobile */
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const BarCount = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  /* Mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ViewButton = styled(Link)`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 38px;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const JoinButton = styled.button<{
  $requiresAuth?: boolean;
  $isLeaving?: boolean;
}>`
  background: ${(props) =>
    props.$isLeaving
      ? "linear-gradient(45deg, #f59e0b, #d97706)"
      : props.$requiresAuth
      ? "linear-gradient(45deg, #6b7280, #4b5563)"
      : "linear-gradient(45deg, #10b981, #059669)"};
  border: 1px solid
    ${(props) =>
      props.$isLeaving
        ? "rgba(245, 158, 11, 0.3)"
        : props.$requiresAuth
        ? "rgba(107, 114, 128, 0.3)"
        : "rgba(16, 185, 129, 0.3)"};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  flex: 1;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  min-height: 44px;
  border: none;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    min-height: 40px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 38px;
  }

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$isLeaving
        ? "linear-gradient(45deg, #d97706, #b45309)"
        : props.$requiresAuth
        ? "linear-gradient(45deg, #7c3aed, #2563eb)" // Hover effect for auth buttons
        : "linear-gradient(45deg, #059669, #047857)"};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
    box-shadow: ${(props) =>
      props.$isLeaving
        ? "0 4px 12px rgba(245, 158, 11, 0.3)"
        : props.$requiresAuth
        ? "0 4px 12px rgba(139, 92, 246, 0.3)" // Shadow for auth buttons
        : "0 4px 12px rgba(16, 185, 129, 0.3)"};
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  border: 1px solid #374151;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;

  &:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1f2937;
  }

  /* Hide tooltips on mobile */
  @media (max-width: 768px) {
    display: none;
  }
`;

const JoinButtonWrapper = styled.div`
  position: relative;
  flex: 1;

  &:hover ${Tooltip} {
    opacity: 1;
  }

  /* Full width on mobile */
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  grid-column: 1 / -1;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;

    /* Mobile */
    @media (max-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    /* Small mobile */
    @media (max-width: 480px) {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  width: 100%;
  grid-column: 1 / -1;
  background-color: transparent !important;

  /* Mobile */
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const PastEventIndicator = styled.span`
  font-size: 0.7rem;
  color: #94a3b8;
  margin-left: 0.5rem;
  font-style: italic;
  display: block;
  margin-top: 0.25rem;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.65rem;
    margin-left: 0;
    margin-top: 0.2rem;
  }
`;

const PastCrawlCard = styled(CrawlCard)`
  opacity: 0.7;
  border-color: rgba(107, 114, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(107, 114, 128, 0.2);
    border-color: rgba(107, 114, 128, 0.5);
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

// New styled components for notifications
const NotificationContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;

  /* Mobile */
  @media (max-width: 768px) {
    right: 1rem;
    left: 1rem;
    top: 80px;
  }
`;

const Notification = styled.div<{
  $type: "success" | "error" | "info" | "warning";
}>`
  background: ${(props) =>
    props.$type === "success"
      ? "linear-gradient(45deg, #10b981, #059669)"
      : props.$type === "error"
      ? "linear-gradient(45deg, #ef4444, #dc2626)"
      : props.$type === "warning"
      ? "linear-gradient(45deg, #f59e0b, #d97706)"
      : "linear-gradient(45deg, #8b5cf6, #3b82f6)"};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NotificationIcon = styled.div`
  font-size: 1.25rem;
`;

const NotificationMessage = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const UndoButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CreateCrawlCardMobileHidden = styled(CreateCrawlCard)`
  /* Show on desktop, hide on mobile */
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

interface CrawlUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string | null;
  maxParticipants: number;
  isPublic: boolean;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: CrawlUser;
  participants: Array<{
    userId: string;
  }>;
  crawlBars: Array<{
    bar: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    participants: number;
  };
}

type CrawlTab = "discover" | "my-crawls" | "past-events" | "my-past-events";

interface NotificationData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  crawlId?: string;
  crawlName?: string;
  undoAction?: () => void;
}

export default function CrawlsDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<CrawlTab>("discover");

  // Separate states for each tab to prevent conflicts
  const [discoverCrawls, setDiscoverCrawls] = useState<Crawl[]>([]);
  const [myUpcomingCrawls, setMyUpcomingCrawls] = useState<Crawl[]>([]);
  const [pastPublicCrawls, setPastPublicCrawls] = useState<Crawl[]>([]);
  const [myPastCrawls, setMyPastCrawls] = useState<Crawl[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const isAuthenticated = !!session;

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { ...notification, id }]);

      // Auto remove after 5 seconds (except for notifications with undo)
      if (!notification.undoAction) {
        setTimeout(() => {
          removeNotification(id);
        }, 5000);
      }
    },
    []
  );

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Fetch data for ALL tabs when component mounts or auth changes
  const fetchAllTabData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch data for all tabs in parallel
      const promises = [];

      // Always fetch discover crawls
      promises.push(
        fetch("/api/crawls?public=true")
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setDiscoverCrawls(data))
          .catch(() => setDiscoverCrawls([]))
      );

      if (isAuthenticated) {
        // Fetch user's upcoming crawls
        promises.push(
          fetch("/api/crawls/my-crawls")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              const upcomingCrawls = data.filter(
                (crawl: Crawl) => !isCrawlPast(crawl)
              );
              setMyUpcomingCrawls(upcomingCrawls);
            })
            .catch(() => setMyUpcomingCrawls([]))
        );

        // Fetch past public events
        promises.push(
          fetch("/api/crawls/past-events?public=true")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setPastPublicCrawls(data))
            .catch(() => setPastPublicCrawls([]))
        );

        // Fetch user's past events
        promises.push(
          fetch("/api/crawls/past-events")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setMyPastCrawls(data))
            .catch(() => setMyPastCrawls([]))
        );
      } else {
        // If not authenticated, clear user-specific data
        setMyUpcomingCrawls([]);
        setPastPublicCrawls([]);
        setMyPastCrawls([]);
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching crawls:", error);
      // Reset all states on error
      setDiscoverCrawls([]);
      setMyUpcomingCrawls([]);
      setPastPublicCrawls([]);
      setMyPastCrawls([]);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [isAuthenticated]);

  // Also keep the individual tab fetch for when switching tabs (to refresh data)
  const fetchActiveTabData = useCallback(async () => {
    if (isInitialLoad) return; // Don't fetch if we're in initial load

    try {
      setIsLoading(true);

      if (activeTab === "discover") {
        const response = await fetch("/api/crawls?public=true");
        if (response.ok) {
          const data = await response.json();
          setDiscoverCrawls(data);
        }
      } else if (activeTab === "my-crawls" && isAuthenticated) {
        const response = await fetch("/api/crawls/my-crawls");
        if (response.ok) {
          const data = await response.json();
          const upcomingCrawls = data.filter(
            (crawl: Crawl) => !isCrawlPast(crawl)
          );
          setMyUpcomingCrawls(upcomingCrawls);
        }
      } else if (activeTab === "past-events" && isAuthenticated) {
        const response = await fetch("/api/crawls/past-events?public=true");
        if (response.ok) {
          const data = await response.json();
          setPastPublicCrawls(data);
        }
      } else if (activeTab === "my-past-events" && isAuthenticated) {
        const response = await fetch("/api/crawls/past-events");
        if (response.ok) {
          const data = await response.json();
          setMyPastCrawls(data);
        }
      }
    } catch (error) {
      console.error("Error fetching active tab data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, isAuthenticated, isInitialLoad]);

  // Fetch all data when component mounts or auth changes
  useEffect(() => {
    fetchAllTabData();
  }, [fetchAllTabData]);

  // Refresh only active tab data when tab changes (after initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      fetchActiveTabData();
    }
  }, [activeTab, fetchActiveTabData, isInitialLoad]);

  const handleJoinCrawl = async (crawlId: string, crawlName: string) => {
    // This function should only be called for authenticated users
    if (!isAuthenticated) return;

    setIsJoining(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}/join`, {
        method: "POST",
      });

      if (response.ok) {
        // Store the previous state for undo
        const previousDiscoverCrawls = [...discoverCrawls];
        const previousMyCrawls = [...myUpcomingCrawls];

        // Refresh all data after joining
        await fetchAllTabData();

        // Show success notification with undo option
        addNotification({
          type: "success",
          message: `You've joined "${crawlName}"!`,
          crawlId,
          crawlName,
          undoAction: async () => {
            try {
              const leaveResponse = await fetch(
                `/api/crawls/${crawlId}/leave`,
                {
                  method: "POST",
                }
              );

              if (leaveResponse.ok) {
                await fetchAllTabData();
                addNotification({
                  type: "info",
                  message: `You've left "${crawlName}"`,
                });
              } else {
                addNotification({
                  type: "error",
                  message: "Failed to leave crawl",
                });
              }
            } catch (error) {
              console.error("Error leaving crawl:", error);
              addNotification({
                type: "error",
                message: "Failed to leave crawl",
              });
            }
          },
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          message:
            errorData.message || "Failed to join crawl. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error joining crawl:", error);
      addNotification({
        type: "error",
        message: "Failed to join crawl. Please try again.",
      });
    } finally {
      setIsJoining(null);
    }
  };

  const handleLeaveCrawl = async (crawlId: string, crawlName: string) => {
    if (!isAuthenticated) return;

    setIsLeaving(crawlId);

    try {
      const response = await fetch(`/api/crawls/${crawlId}/leave`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchAllTabData();
        addNotification({
          type: "info",
          message: `You've left "${crawlName}"`,
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          message: errorData.message || "Failed to leave crawl",
        });
      }
    } catch (error) {
      console.error("Error leaving crawl:", error);
      addNotification({
        type: "error",
        message: "Failed to leave crawl",
      });
    } finally {
      setIsLeaving(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isUserInCrawl = (crawl: Crawl) => {
    if (!session?.user?.id) return false;
    return crawl.participants.some((p) => p.userId === session.user.id);
  };

  const isUserCreator = (crawl: Crawl) => {
    if (!session?.user?.id) return false;
    return crawl.creator.id === session.user.id;
  };

  const isCrawlFull = (crawl: Crawl) => {
    return crawl._count.participants >= crawl.maxParticipants;
  };

  const isCrawlPast = (crawl: Crawl) => {
    const crawlDate = new Date(crawl.date);
    const now = new Date();

    // If the crawl date is in a previous year, it's definitely past
    if (crawlDate.getFullYear() < now.getFullYear()) {
      return true;
    }

    // If it's the same year but the date has passed, it's past
    if (crawlDate.getFullYear() === now.getFullYear() && crawlDate < now) {
      return true;
    }

    // Also check status
    return crawl.status === "COMPLETED" || crawl.status === "CANCELLED";
  };

  const canJoinCrawl = (crawl: Crawl) => {
    return (
      isAuthenticated &&
      !isUserInCrawl(crawl) &&
      !isCrawlFull(crawl) &&
      !isCrawlPast(crawl) &&
      (crawl.status === "PLANNING" || crawl.status === "UPCOMING")
    );
  };

  const canLeaveCrawl = (crawl: Crawl) => {
    return (
      isAuthenticated &&
      isUserInCrawl(crawl) &&
      !isUserCreator(crawl) &&
      !isCrawlPast(crawl)
    );
  };

  // Calculate tab counts from the correct state variables
  const tabCounts = {
    discover: discoverCrawls.length,
    "my-crawls": myUpcomingCrawls.length,
    "past-events": pastPublicCrawls.length,
    "my-past-events": myPastCrawls.length,
  };

  // Determine which crawls to display based on active tab
  const displayCrawls =
    activeTab === "discover"
      ? discoverCrawls
      : activeTab === "my-crawls"
      ? myUpcomingCrawls
      : activeTab === "past-events"
      ? pastPublicCrawls
      : myPastCrawls;

  const isPastTab =
    activeTab === "past-events" || activeTab === "my-past-events";

  if (status === "loading") {
    return (
      <Page>
        <Title>Bar Crawls</Title>
        <Description>Discover amazing bar crawls in your city</Description>
        <CrawlsGrid>
          <LoadingContainer>
            <HopprLoader />
          </LoadingContainer>
        </CrawlsGrid>
      </Page>
    );
  }

  return (
    <Page>
      {/* Notifications */}
      <NotificationContainer>
        {notifications.map((notification) => (
          <Notification key={notification.id} $type={notification.type}>
            <NotificationContent>
              <NotificationIcon>
                {notification.type === "success" && "🎉"}
                {notification.type === "error" && "❌"}
                {notification.type === "info" && "ℹ️"}
                {notification.type === "warning" && "⚠️"}
              </NotificationIcon>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContent>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              {notification.undoAction && (
                <UndoButton onClick={notification.undoAction}>Undo</UndoButton>
              )}
              <CloseButton onClick={() => removeNotification(notification.id)}>
                ×
              </CloseButton>
            </div>
          </Notification>
        ))}
      </NotificationContainer>

      <Title>Bar Crawls</Title>
      <Description>
        {isAuthenticated
          ? "Discover amazing bar crawls or create your own adventure!"
          : "Discover amazing bar crawls in your city. Sign up to join or create your own!"}
      </Description>

      <TabContainer>
        <Tab
          $active={activeTab === "discover"}
          onClick={() => setActiveTab("discover")}
        >
          Discover ({tabCounts.discover})
        </Tab>

        {isAuthenticated && (
          <>
            <Tab
              $active={activeTab === "my-crawls"}
              onClick={() => setActiveTab("my-crawls")}
            >
              My Crawls ({tabCounts["my-crawls"]})
            </Tab>
            {/* <Tab
              $active={activeTab === "past-events"}
              onClick={() => setActiveTab("past-events")}
            >
              Past Public ({tabCounts["past-events"]})
            </Tab> */}
            <Tab
              $active={activeTab === "my-past-events"}
              onClick={() => setActiveTab("my-past-events")}
            >
              My Past ({tabCounts["my-past-events"]})
            </Tab>
          </>
        )}
      </TabContainer>

      <CrawlsGrid>
        {/* Show loading state OR content, not both */}
        {isLoading ? (
          <LoadingContainer>
            <HopprLoader />
          </LoadingContainer>
        ) : (
          <>
            {/* Create Crawl Card - Only show for non-past tabs */}
            {!isPastTab &&
              (isAuthenticated ? (
                <CreateCrawlCardMobileHidden href="/app/crawl-planner">
                  <CreateIcon>🎯</CreateIcon>
                  <CreateText>Create New Crawl</CreateText>
                  <CreateSubtext>Plan your own bar adventure</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ) : (
                <CreateCrawlCardMobileHidden href="/app/auth/signup">
                  <CreateIcon>🔐</CreateIcon>
                  <CreateText>Sign Up to Create Crawls</CreateText>
                  <CreateSubtext>Join to start planning crawls</CreateSubtext>
                </CreateCrawlCardMobileHidden>
              ))}

            {/* Display crawls */}
            {displayCrawls.map((crawl) => {
              const userInCrawl = isUserInCrawl(crawl);
              const userIsCreator = isUserCreator(crawl);
              const crawlFull = isCrawlFull(crawl);
              const canJoin = canJoinCrawl(crawl);
              const canLeave = canLeaveCrawl(crawl);
              const isPastCrawl = isCrawlPast(crawl);
              const CardComponent = isPastCrawl ? PastCrawlCard : CrawlCard;

              return (
                <CardComponent key={crawl.id}>
                  <CrawlHeader>
                    <CrawlName>
                      {crawl.name}
                      {isPastCrawl && (
                        <PastEventIndicator>(Past Event)</PastEventIndicator>
                      )}
                    </CrawlName>
                    <CrawlStatus $status={crawl.status}>
                      {isPastCrawl
                        ? "Past"
                        : crawl.status === "PLANNING"
                        ? "Joinable"
                        : crawl.status.toLowerCase()}
                    </CrawlStatus>
                  </CrawlHeader>

                  <CrawlMeta>
                    <MetaItem>
                      <MetaLabel>Date & Time</MetaLabel>
                      <MetaValue>{formatDate(crawl.date)}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>City</MetaLabel>
                      <MetaValue>{crawl.city.name}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Participants</MetaLabel>
                      <MetaValue>
                        {crawl._count.participants}/{crawl.maxParticipants}
                      </MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Bars</MetaLabel>
                      <MetaValue>{crawl.crawlBars.length} stops</MetaValue>
                    </MetaItem>
                  </CrawlMeta>

                  <BarPreview>
                    <BarCount>
                      {Math.floor(
                        (crawl._count.participants / crawl.maxParticipants) *
                          100
                      )}
                      % full • {crawl.isPublic ? "Public" : "Private"}
                      {userIsCreator && " • Your Crawl"}
                      {isPastCrawl && " • Past Event"}
                    </BarCount>
                  </BarPreview>

                  <ActionButtons>
                    <ViewButton href={`/app/crawls/${crawl.id}`}>
                      {isPastCrawl ? "View Details" : "View Details"}
                    </ViewButton>

                    {!isPastCrawl && (
                      <JoinButtonWrapper>
                        <JoinButton
                          onClick={() => {
                            if (!isAuthenticated) {
                              // Redirect to signup with crawl info
                              window.location.href = `/app/auth/signup?redirect=/app/crawls-dashboard&crawl=${crawl.id}`;
                              return;
                            }

                            // For authenticated users, handle join/leave
                            if (userInCrawl && canLeave) {
                              handleLeaveCrawl(crawl.id, crawl.name);
                            } else {
                              handleJoinCrawl(crawl.id, crawl.name);
                            }
                          }}
                          $requiresAuth={!isAuthenticated}
                          $isLeaving={userInCrawl && canLeave}
                          disabled={
                            (isAuthenticated && !canJoin && !canLeave) ||
                            isJoining === crawl.id ||
                            isLeaving === crawl.id
                          }
                        >
                          {isJoining === crawl.id
                            ? "Joining..."
                            : isLeaving === crawl.id
                            ? "Leaving..."
                            : userInCrawl && userIsCreator
                            ? "Your Crawl"
                            : userInCrawl && canLeave
                            ? "Leave Crawl"
                            : crawlFull
                            ? "Full"
                            : !isAuthenticated
                            ? "Login to Join"
                            : !canJoin
                            ? "Cannot Join"
                            : "Join Crawl"}
                        </JoinButton>

                        {/* Update tooltips */}
                        {crawlFull && <Tooltip>This crawl is full</Tooltip>}
                        {!isAuthenticated && !crawlFull && (
                          <Tooltip>
                            Click to sign up and join this crawl
                          </Tooltip>
                        )}
                        {isAuthenticated && userInCrawl && userIsCreator && (
                          <Tooltip>You created this crawl</Tooltip>
                        )}
                        {isAuthenticated && userInCrawl && canLeave && (
                          <Tooltip>Click to leave this crawl</Tooltip>
                        )}
                        {isAuthenticated &&
                          !userInCrawl &&
                          !crawlFull &&
                          !canJoin && (
                            <Tooltip>This crawl is no longer joinable</Tooltip>
                          )}
                      </JoinButtonWrapper>
                    )}

                    {isPastCrawl && (
                      <ViewButton
                        href={`/app/crawls/${crawl.id}`}
                        style={{ flex: 1 }}
                      >
                        View Memories
                      </ViewButton>
                    )}
                  </ActionButtons>
                </CardComponent>
              );
            })}

            {/* Empty State */}
            {displayCrawls.length === 0 && (
              <EmptyState>
                <div className="icon">
                  {activeTab === "discover"
                    ? "🔍"
                    : activeTab === "my-crawls"
                    ? "📅"
                    : activeTab === "past-events"
                    ? "🏁"
                    : "📖"}
                </div>
                <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
                  {activeTab === "discover" && "No upcoming crawls available"}
                  {activeTab === "my-crawls" && "No upcoming crawls"}
                  {activeTab === "past-events" && "No past events found"}
                  {activeTab === "my-past-events" && "No past events joined"}
                </h3>
                <p>
                  {activeTab === "discover" &&
                    "Check back later for new crawl opportunities!"}
                  {activeTab === "my-crawls" &&
                    "Join a crawl from the Discover tab to get started!"}
                  {activeTab === "past-events" &&
                    "Past public events will appear here"}
                  {activeTab === "my-past-events" &&
                    "Your past crawl history will appear here"}
                </p>
                {!isPastTab && (
                  <CreateCrawlCard
                    href={
                      isAuthenticated
                        ? "/app/crawl-planner"
                        : "/app/auth/signup"
                    }
                    style={{
                      marginTop: "1rem",
                      minHeight: "auto",
                      padding: "1.5rem",
                    }}
                  >
                    <CreateText>
                      {isAuthenticated
                        ? "Create Your First Crawl"
                        : "Be the first to create one!"}
                    </CreateText>
                  </CreateCrawlCard>
                )}
              </EmptyState>
            )}
          </>
        )}
      </CrawlsGrid>
    </Page>
  );
}
