// components/ui/HopprLoader.tsx
import styled, { keyframes } from "styled-components";

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const loading = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  background: transparent;
  min-height: 200px;
  background-color: transparent !important;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  background-color: transparent !important;
`;

const LogoIcon = styled.div`
  font-size: 2.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(139, 92, 246, 0.3));
  background-color: transparent !important;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LogoText = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 3s ease infinite;

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LoadingLineContainer = styled.div`
  width: 200px;
  height: 3px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  /* Mobile */
  @media (max-width: 768px) {
    width: 180px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    width: 160px;
  }
`;

const LoadingLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  border-radius: 2px;
  animation: ${gradientShift} 2s ease infinite,
    ${loading} 1.5s ease-in-out infinite;
`;

interface HopprLoaderProps {
  size?: "sm" | "md" | "lg";
}

export function HopprLoader({ size = "md" }: HopprLoaderProps) {
  const sizeConfig = {
    sm: {
      iconSize: "2rem",
      textSize: "2rem",
      lineWidth: "150px",
    },
    md: {
      iconSize: "2.5rem",
      textSize: "2.5rem",
      lineWidth: "200px",
    },
    lg: {
      iconSize: "3rem",
      textSize: "3rem",
      lineWidth: "250px",
    },
  };

  const config = sizeConfig[size];

  return (
    <LoaderContainer>
      <LogoContainer>
        <LogoIcon style={{ fontSize: config.iconSize }}>🍻</LogoIcon>
        <LogoText style={{ fontSize: config.textSize }}>Hoppr</LogoText>
      </LogoContainer>

      <LoadingLineContainer style={{ width: config.lineWidth }}>
        <LoadingLine />
      </LoadingLineContainer>
    </LoaderContainer>
  );
}

// Compact version for smaller spaces
export function HopprLoaderCompact() {
  return (
    <LoaderContainer style={{ padding: "2rem 1rem", minHeight: "150px" }}>
      <LogoContainer style={{ marginBottom: "1.5rem" }}>
        <LogoIcon style={{ fontSize: "2rem" }}>🍻</LogoIcon>
        <LogoText style={{ fontSize: "2rem" }}>Hoppr</LogoText>
      </LogoContainer>

      <LoadingLineContainer style={{ width: "150px", height: "2px" }}>
        <LoadingLine />
      </LoadingLineContainer>
    </LoaderContainer>
  );
}
