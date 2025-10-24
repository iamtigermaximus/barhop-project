"use client";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

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

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
  padding: 1rem 1rem 10rem;
  position: relative;
  overflow: hidden;

  /* Mobile First Approach */
  @media (max-width: 480px) {
    padding: 1rem 1rem 10rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1rem 1rem 10rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 1rem 1rem 10rem;
  }

  @media (min-width: 1025px) {
    padding: 1rem 1rem 10rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(139, 92, 246, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(14, 165, 233, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(236, 72, 153, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;

    /* Adjust gradients for mobile */
    @media (max-width: 768px) {
      background: radial-gradient(
          circle at 10% 90%,
          rgba(139, 92, 246, 0.15) 0%,
          transparent 60%
        ),
        radial-gradient(
          circle at 90% 10%,
          rgba(14, 165, 233, 0.15) 0%,
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
  max-width: min(480px, 95vw);
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 2rem 1.5rem;
    max-width: 100%;
    margin: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: min(440px, 90vw);
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
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  line-height: 1.6;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 1.1rem;
  }
`;

export const StyledLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;

  &:hover {
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.1);

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: linear-gradient(90deg, #a78bfa, #c4b5fd);
      border-radius: 1px;
    }
  }

  @media (max-width: 480px) {
    padding: 0.2rem 0.4rem;
    font-size: 0.95rem;
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
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    width: 22px;
    height: 22px;
    margin-right: 14px;
  }
`;

export const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 2.5rem 0;

  /* Mobile */
  @media (max-width: 480px) {
    margin: 2rem 0;
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
  padding: 0 1.5rem;
  color: #94a3b8;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0 1rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.9rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${slideIn} 0.5s ease-out;
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

    /* Mobile */
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }

    /* Tablet & Desktop */
    @media (min-width: 481px) {
      font-size: 1.2rem;
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

  &:valid {
    border-color: rgba(34, 197, 94, 0.4);
  }

  /* Disable zoom on iOS for inputs */
  @media (max-width: 480px) {
    font-size: 16px; /* Prevents zoom on iOS */
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
  animation: ${gradientShift} 6s ease infinite;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(139, 92, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover {
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

  &:hover::before {
    left: 100%;
  }
`;

export const ErrorMessage = styled.div`
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
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

export const FormRow = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns ? `repeat(${props.$columns}, 1fr)` : "1fr 1fr"};
  gap: 1rem;

  /* Mobile - always single column */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Tablet - adjust gap */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 1rem;
  }

  /* Small tablets in portrait - sometimes single column is better */
  @media (min-width: 481px) and (max-width: 600px) and (orientation: portrait) {
    grid-template-columns: 1fr;
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
  }
`;
