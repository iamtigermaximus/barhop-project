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

export const Description = styled.p`
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

export const TabContainer = styled.div`
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

export const Tab = styled.button<{ $active: boolean }>`
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

export const CreateCrawlCard = styled(Link)`
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

export const CreateIcon = styled.div`
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

export const CreateText = styled.div`
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

export const CreateSubtext = styled.div`
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

export const CrawlsGrid = styled.div`
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

export const CrawlCard = styled.div`
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

export const CrawlHeader = styled.div`
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

export const CrawlName = styled.h3`
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

export const CrawlStatus = styled.span<{
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

export const CrawlMeta = styled.div`
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

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const MetaLabel = styled.span`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const MetaValue = styled.span`
  color: #f8fafc;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const BarPreview = styled.div`
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

export const BarCount = styled.span`
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

export const ActionButtons = styled.div`
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

export const ViewButton = styled(Link)`
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

export const JoinButton = styled.button<{
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
  cursor: ${(props) => (props.$requiresAuth ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  flex: 1;
  opacity: ${(props) => (props.$requiresAuth ? 0.6 : 1)};
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
        ? "linear-gradient(45deg, #6b7280, #4b5563)"
        : "linear-gradient(45deg, #059669, #047857)"};
    transform: ${(props) =>
      props.$requiresAuth ? "none" : "translateY(-1px)"};
    box-shadow: ${(props) =>
      props.$isLeaving
        ? "0 4px 12px rgba(245, 158, 11, 0.3)"
        : props.$requiresAuth
        ? "none"
        : "0 4px 12px rgba(16, 185, 129, 0.3)"};
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

export const DeleteButton = styled.button<{ $isDeleting?: boolean }>`
  background: ${(props) =>
    props.$isDeleting
      ? "linear-gradient(45deg, #dc2626, #b91c1c)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-height: 44px;
  border: none;
  opacity: ${(props) => (props.$isDeleting ? 0.7 : 1)};

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
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Reduce hover on mobile */
  @media (max-width: 768px) {
    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

export const Tooltip = styled.div`
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

export const JoinButtonWrapper = styled.div`
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

export const DeleteButtonWrapper = styled.div`
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

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  grid-column: 1 / -1;
  background-color: transparent !important;

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

export const LoadingContainer = styled.div`
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

export const PastEventIndicator = styled.span`
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

export const PastCrawlCard = styled(CrawlCard)`
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

export const NotificationContainer = styled.div`
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

export const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const NotificationIcon = styled.div`
  font-size: 1.25rem;
`;

export const NotificationMessage = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const UndoButton = styled.button`
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

export const CloseButton = styled.button`
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

// Confirmation Modal
export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

export const ModalTitle = styled.h3`
  color: #f8fafc;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const ModalMessage = styled.p`
  color: #e2e8f0;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  background: rgba(107, 114, 128, 0.3);
  border: 1px solid rgba(107, 114, 128, 0.4);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(107, 114, 128, 0.4);
  }
`;

export const ConfirmDeleteButton = styled.button<{ $isDeleting?: boolean }>`
  background: ${(props) =>
    props.$isDeleting
      ? "linear-gradient(45deg, #dc2626, #b91c1c)"
      : "linear-gradient(45deg, #ef4444, #dc2626)"};
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$isDeleting ? 0.7 : 1)};

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
