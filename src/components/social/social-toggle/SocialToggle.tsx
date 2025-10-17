"use client";
import styled from "styled-components";

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  background: ${(props) =>
    props.$isActive
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(30, 41, 59, 0.8)"};
  border: 1px solid
    ${(props) => (props.$isActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusIndicator = styled.div<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "#10b981" : "#6b7280")};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => (props.$isActive ? "#10b981" : "#6b7280")};
    display: inline-block;
  }
`;

interface SocialToggleProps {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  isLoading?: boolean;
}

export default function SocialToggle({
  isActive,
  onToggle,
  isLoading = false,
}: SocialToggleProps) {
  return (
    <ToggleWrapper>
      <ToggleButton
        $isActive={isActive}
        onClick={() => onToggle(!isActive)}
        disabled={isLoading}
      >
        {isLoading
          ? "⏳"
          : isActive
          ? "🎉 You're Social!"
          : "🔘 I'm Free Tonight"}
      </ToggleButton>
      <StatusIndicator $isActive={isActive}>
        {isActive ? "Visible to others nearby" : "Toggle to start socializing"}
      </StatusIndicator>
    </ToggleWrapper>
  );
}
