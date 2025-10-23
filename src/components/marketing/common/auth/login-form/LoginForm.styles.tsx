"use client";

import Link from "next/link";
import styled, { keyframes, css } from "styled-components";

export const gradientShift = keyframes`
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

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

// Responsive container with breakpoints
export const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #0f172a, #1e1b4b, #0f172a, #1e1b4b);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 1rem;
  position: relative;
  overflow-x: hidden;

  /* Mobile First Approach */
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 1.5rem;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 2rem;
  }

  @media (min-width: 1025px) {
    padding: 3rem;
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
        rgba(14, 165, 233, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(139, 92, 246, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba(236, 72, 153, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;

    /* Adjust gradients for mobile */
    @media (max-width: 768px) {
      background: radial-gradient(
          circle at 20% 85%,
          rgba(14, 165, 233, 0.15) 0%,
          transparent 60%
        ),
        radial-gradient(
          circle at 85% 15%,
          rgba(139, 92, 246, 0.15) 0%,
          transparent 60%
        );
    }
  }
`;

export const GlassCard = styled.div`
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 24px;
  width: 100%;
  max-width: min(420px, 95vw);
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 2rem 1.25rem;
    max-width: 100%;
    margin: 0.5rem;
    backdrop-filter: blur(20px);
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: min(400px, 90vw);
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 3rem 2.5rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.15),
      transparent
    );
    transition: left 0.8s ease;
  }

  &:hover::before {
    left: 100%;

    @media (max-width: 768px) {
      /* Reduce animation on mobile for performance */
      left: 100%;
    }
  }
`;

export const Title = styled.h2`
  font-weight: 700;
  text-align: center;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 8s ease infinite;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  line-height: 1.2;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 2rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 2.25rem;
  }
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.75rem;
    line-height: 1.5;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 1.05rem;
  }
`;

export const StyledLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  white-space: nowrap;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.15rem 0.3rem;
  }

  &:hover {
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.1);

    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0.4rem;
      right: 0.4rem;
      height: 2px;
      background: linear-gradient(90deg, #a78bfa, #c4b5fd);
      border-radius: 1px;
    }
  }
`;

export const GoogleButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.4s ease;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.125rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover {
      transform: none;
      box-shadow: none;
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);

  /* Mobile */
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
`;

export const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 2rem 0;

  /* Mobile */
  @media (max-width: 480px) {
    margin: 1.75rem 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.4),
      transparent
    );
    transform: translateY(-50%);
  }
`;

export const DividerText = styled.span`
  background: rgba(30, 41, 59, 0.85);
  padding: 0 1.25rem;
  color: #94a3b8;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 0.75rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.85rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Label = styled.label`
  color: #e2e8f0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    gap: 0.4rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.95rem;
  }

  &::before {
    content: "•";
    color: #8b5cf6;
    font-weight: 700;

    /* Mobile */
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }

    /* Tablet & Desktop */
    @media (min-width: 481px) {
      font-size: 1rem;
    }
  }
`;

export const Input = styled.input`
  background: rgba(15, 23, 42, 0.7);
  border: 1.5px solid rgba(71, 85, 105, 0.4);
  border-radius: 14px;
  color: #f8fafc;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 100%;
  box-sizing: border-box;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.125rem 1.5rem;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15),
      inset 0 0 0 1px rgba(139, 92, 246, 0.1);
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }

  /* Disable zoom on iOS for inputs */
  @media (max-width: 480px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;

    &:focus {
      transform: none;
    }
  }
`;

export const SubmitButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9, #ec4899);
  background-size: 300% 300%;
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  letter-spacing: 0.025em;
  transition: all 0.4s ease;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};

  /* Fix the animation syntax */
  ${(props) =>
    props.$loading
      ? css`
          animation: ${pulse} 2s ease-in-out infinite;
        `
      : css`
          animation: ${gradientShift} 6s ease infinite;
        `}

  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.05rem;
    border-radius: 12px;
    margin-top: 0.25rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.25rem 1.5rem;
    font-size: 1.1rem;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(139, 92, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

export const ErrorMessage = styled.div<{ $type: "error" | "success" }>`
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  background: ${(props) =>
    props.$type === "success"
      ? "rgba(34, 197, 94, 0.1)"
      : "rgba(239, 68, 68, 0.1)"};
  border: 1.5px solid
    ${(props) =>
      props.$type === "success"
        ? "rgba(34, 197, 94, 0.3)"
        : "rgba(239, 68, 68, 0.3)"};
  color: ${(props) => (props.$type === "success" ? "#4ade80" : "#f87171")};
  animation: ${fadeIn} 0.4s ease-out;
  text-align: center;
  line-height: 1.5;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.95rem;
  }
`;

// Additional mobile-specific optimizations
export const MobileOptimized = styled.div`
  @media (max-width: 480px) {
    /* Ensure tap targets are at least 44px for accessibility */
    button,
    a {
      min-height: 44px;
      min-width: 44px;
    }

    /* Prevent horizontal scrolling */
    max-width: 100vw;
    overflow-x: hidden;

    /* Improve performance on mobile */
    * {
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* Reduce animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const ForgotPasswordLink = styled(Link)`
  color: #94a3b8;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  transition: color 0.3s ease;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }

  &:hover {
    color: #a78bfa;
  }
`;
