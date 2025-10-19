"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HopprLoader } from "@/components/ui/Loader/HopprLoader";

export const Page = styled.div`
  padding: 2rem 1rem;
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

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    min-height: calc(100dvh - 70px);
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.25rem;
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
  padding: 0 1rem;

  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }

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

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

export const PlannerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  background-color: transparent !important;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FormSection = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    order: 1;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

export const PreviewSection = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  position: sticky;
  top: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    position: static;
    order: 2;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

export const MobileButtonContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    order: 3;
    position: sticky;
    bottom: 1rem;
    margin-top: 1rem;
    z-index: 100;
  }
`;

export const DesktopButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #f8fafc;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const Required = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

export const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: 48px;

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
    font-size: 16px;
    min-height: 44px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    min-height: 42px;
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Select = styled.select`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 48px;

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
    font-size: 16px;
    min-height: 44px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    min-height: 42px;
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  option {
    background: #1e293b;
    color: #f8fafc;
  }
`;

export const TextArea = styled.textarea`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  @media (max-width: 768px) {
    padding: 0.7rem 0.9rem;
    font-size: 16px;
    min-height: 90px;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    min-height: 80px;
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-height: 44px;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.4rem;
    gap: 0.6rem;
    min-height: 40px;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.1);
  }

  input[type="checkbox"] {
    accent-color: #8b5cf6;
    width: 1.125rem;
    height: 1.125rem;

    @media (max-width: 480px) {
      width: 1rem;
      height: 1rem;
    }
  }
`;

export const CreateCrawlButton = styled.button<{ $loading: boolean }>`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.$loading ? "none" : "gradientShift 4s ease infinite"};
  width: 100%;
  position: relative;
  overflow: hidden;
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  min-height: 60px;

  @media (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.05rem;
    min-height: 56px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    min-height: 52px;
    border-radius: 8px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
    border-color: rgba(139, 92, 246, 0.6);
  }

  @media (max-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }
  }

  &:disabled {
    cursor: not-allowed;
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

export const UpdateCrawlButton = styled(CreateCrawlButton)`
  background: linear-gradient(45deg, #f59e0b, #d97706, #b45309);
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(107, 114, 128, 0.4);
  color: #e2e8f0;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 60px;

  @media (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.05rem;
    min-height: 56px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    min-height: 52px;
    border-radius: 8px;
  }

  &:hover {
    background: rgba(107, 114, 128, 0.2);
    border-color: rgba(107, 114, 128, 0.6);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

export const SignUpButton = styled(Link)`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.05rem;
    min-height: 56px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    min-height: 52px;
    border-radius: 8px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

export const PreviewContent = styled.div`
  color: #e2e8f0;
  line-height: 1.6;
`;

export const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
  border-left: 3px solid #8b5cf6;

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    margin-bottom: 0.6rem;
  }
`;

export const PreviewLabel = styled.span`
  font-weight: 600;
  color: #cbd5e1;
  min-width: 100px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    min-width: 80px;
  }
`;

export const PreviewValue = styled.span`
  color: #f8fafc;
  flex: 1;
  text-align: right;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const BarTypesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const BarTypeTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
`;

export const TipsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
`;

export const Tip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
  font-size: 0.875rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  &:before {
    content: "💡";
    font-size: 1rem;

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

export const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const SuccessCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.95),
    rgba(15, 23, 42, 0.95)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: slideUp 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 1s ease infinite;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(-45deg, #10b981, #0ea5e9, #8b5cf6);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

export const SuccessMessage = styled.p`
  color: #e2e8f0;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const ViewCrawlButton = styled(Link)`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
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
  flex: 1;

  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

export const NewCrawlButton = styled.button`
  background: transparent;
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  @media (max-width: 768px) {
    padding: 0.9rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }

  &:hover {
    background: rgba(14, 165, 233, 0.1);
    border-color: rgba(14, 165, 233, 0.6);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

// Bar Selection Styled Components - UPDATED WITH SCROLLABLE
export const BarSelectionSection = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  margin-top: 2rem;
  max-height: 600px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.6);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 500px;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    max-height: 400px;
  }
`;

export const BarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const BarCard = styled.div<{ $selected: boolean }>`
  background: ${(props) =>
    props.$selected ? "rgba(139, 92, 246, 0.2)" : "rgba(15, 23, 42, 0.6)"};
  border: 2px solid
    ${(props) =>
      props.$selected ? "rgba(139, 92, 246, 0.6)" : "rgba(139, 92, 246, 0.3)"};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

export const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export const BarName = styled.h4`
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

export const BarType = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  white-space: nowrap;
`;

export const BarDetails = styled.div`
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const BarInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SelectedBarsList = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
  max-height: 300px;
  overflow-y: auto;
`;

export const SelectedBarItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);

  &:last-child {
    border-bottom: none;
  }
`;

export const RemoveBarButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
  }
`;

export const MoveButton = styled.button`
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(139, 92, 246, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const SelectionBadge = styled.div`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Interfaces
interface Bar {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  priceLevel: number;
  vipAvailable: boolean;
  vipPrice: number;
  estimatedWaitTime: number;
  imageUrl?: string;
  description?: string;
}

interface SelectedBar {
  barId: string;
  orderIndex: number;
}

interface CrawlFormData {
  name: string;
  description: string;
  cityId: string;
  date: string;
  time: string;
  maxParticipants: string;
  barTypes: string[];
  selectedBars: SelectedBar[];
}

interface City {
  id: string;
  name: string;
}

interface CrawlResult {
  id: string;
  name: string;
  description: string;
  city: City;
  date: string;
  startTime: string;
  maxParticipants: number;
  status: string;
  crawlBars: Array<{
    bar: Bar;
    orderIndex: number;
  }>;
  shareableLink: string;
}

interface Crawl {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  maxParticipants: number;
  status: "PLANNING" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  city: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  crawlBars: Array<{
    orderIndex: number;
    bar: {
      id: string;
      name: string;
      type: string;
      address: string;
    };
  }>;
  _count: {
    participants: number;
  };
}

interface CrawlPlannerProps {
  editCrawlId?: string;
}

const CrawlPlanner = ({ editCrawlId }: CrawlPlannerProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentEditId = editCrawlId;

  const [formData, setFormData] = useState<CrawlFormData>({
    name: "",
    description: "",
    cityId: "",
    date: "",
    time: "20:00",
    maxParticipants: "10",
    barTypes: [],
    selectedBars: [],
  });

  const [cities, setCities] = useState<City[]>([]);
  const [availableBars, setAvailableBars] = useState<Bar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCrawl, setIsLoadingCrawl] = useState(false);
  const [isLoadingBars, setIsLoadingBars] = useState(false);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalCrawl, setOriginalCrawl] = useState<Crawl | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>("");

  const barTypeOptions = [
    "PUB",
    "CLUB",
    "LOUNGE",
    "COCKTAIL_BAR",
    "RESTAURANT_BAR",
    "SPORTS_BAR",
    "KARAOKE",
    "LIVE_MUSIC",
  ];

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        if (response.ok) {
          const citiesData = await response.json();
          setCities(citiesData);
        } else {
          setError("Failed to load cities");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError("Failed to load cities");
      }
    };

    fetchCities();
  }, []);

  // Fetch available bars when city or bar types change - UPDATED WITH CITY FILTERING
  useEffect(() => {
    const fetchBars = async () => {
      if (!formData.cityId) {
        setAvailableBars([]);
        return;
      }

      // If no bar types selected, don't fetch
      if (formData.barTypes.length === 0) {
        setAvailableBars([]);
        return;
      }

      setIsLoadingBars(true);
      try {
        const params = new URLSearchParams({
          cityId: formData.cityId,
          barTypes: formData.barTypes.join(","),
          limit: "50", // Increase limit since we have scroll now
        });

        const response = await fetch(`/api/bars?${params}`);
        if (response.ok) {
          const barsData = await response.json();
          setAvailableBars(barsData);

          // If we're in edit mode and have selected bars, make sure they're still available
          if (isEditMode && formData.selectedBars.length > 0) {
            const unavailableBars = formData.selectedBars.filter(
              (selectedBar) =>
                !barsData.some((bar: Bar) => bar.id === selectedBar.barId)
            );

            if (unavailableBars.length > 0) {
              setError(
                `Some previously selected bars are no longer available in ${selectedCityName}`
              );
            }
          }
        } else {
          setError("Failed to load bars");
        }
      } catch (error) {
        console.error("Error fetching bars:", error);
        setError("Failed to load bars");
      } finally {
        setIsLoadingBars(false);
      }
    };

    fetchBars();
  }, [formData.cityId, formData.barTypes, isEditMode, selectedCityName]);

  // Fetch crawl data when in edit mode
  useEffect(() => {
    const fetchCrawlForEdit = async () => {
      if (!currentEditId) return;

      setIsEditMode(true);
      setIsLoadingCrawl(true);

      try {
        const response = await fetch(`/api/crawls/${currentEditId}`);
        if (response.ok) {
          const crawlData: Crawl = await response.json();
          setOriginalCrawl(crawlData);

          // Pre-populate form with existing crawl data
          const crawlDate = new Date(crawlData.date);
          const crawlTime = new Date(crawlData.startTime);

          setFormData({
            name: crawlData.name,
            description: crawlData.description,
            cityId: crawlData.city.id,
            date: crawlDate.toISOString().split("T")[0],
            time: `${crawlTime
              .getHours()
              .toString()
              .padStart(2, "0")}:${crawlTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`,
            maxParticipants: crawlData.maxParticipants.toString(),
            barTypes: crawlData.crawlBars.map((crawlBar) => crawlBar.bar.type),
            selectedBars: crawlData.crawlBars.map((crawlBar) => ({
              barId: crawlBar.bar.id,
              orderIndex: crawlBar.orderIndex,
            })),
          });

          // Set the selected city name
          setSelectedCityName(crawlData.city.name);
        } else {
          setError("Failed to load crawl for editing");
        }
      } catch (error) {
        console.error("Error fetching crawl for edit:", error);
        setError("Failed to load crawl for editing");
      } finally {
        setIsLoadingCrawl(false);
      }
    };

    if (currentEditId) {
      fetchCrawlForEdit();
    }
  }, [currentEditId]);

  // Bar selection functions
  const handleAddBar = (bar: Bar) => {
    setFormData((prev) => ({
      ...prev,
      selectedBars: [
        ...prev.selectedBars,
        {
          barId: bar.id,
          orderIndex: prev.selectedBars.length,
        },
      ],
    }));
  };

  const handleRemoveBar = (barId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBars: prev.selectedBars
        .filter((selectedBar) => selectedBar.barId !== barId)
        .map((selectedBar, index) => ({
          ...selectedBar,
          orderIndex: index,
        })),
    }));
  };

  const handleMoveBar = (barId: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const currentIndex = prev.selectedBars.findIndex(
        (sb) => sb.barId === barId
      );
      if (currentIndex === -1) return prev;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.selectedBars.length) return prev;

      const newSelectedBars = [...prev.selectedBars];
      [newSelectedBars[currentIndex], newSelectedBars[newIndex]] = [
        newSelectedBars[newIndex],
        newSelectedBars[currentIndex],
      ];

      return {
        ...prev,
        selectedBars: newSelectedBars.map((bar, index) => ({
          ...bar,
          orderIndex: index,
        })),
      };
    });
  };

  // Check if bar is selected
  const isBarSelected = (barId: string) => {
    return formData.selectedBars.some((sb) => sb.barId === barId);
  };

  // Get selected bar order index
  const getBarOrderIndex = (barId: string) => {
    const selectedBar = formData.selectedBars.find((sb) => sb.barId === barId);
    return selectedBar ? selectedBar.orderIndex + 1 : null;
  };

  // Get bar details from available bars for display
  const getSelectedBarDetails = (selectedBar: SelectedBar) => {
    return availableBars.find((bar) => bar.id === selectedBar.barId);
  };

  // Helper function to get current city name
  const getCurrentCityName = () => {
    return (
      cities.find((city) => city.id === formData.cityId)?.name ||
      "the selected city"
    );
  };

  // UPDATED INPUT CHANGE HANDLER WITH CITY NAME TRACKING
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);

    // When city changes, update the selected city name
    if (name === "cityId") {
      const selectedCity = cities.find((city) => city.id === value);
      setSelectedCityName(selectedCity?.name || "");
      // Clear selected bars when city changes
      setFormData((prev) => ({ ...prev, selectedBars: [] }));
    }
  };

  const handleBarTypeChange = (barType: string) => {
    setFormData((prev) => ({
      ...prev,
      barTypes: prev.barTypes.includes(barType)
        ? prev.barTypes.filter((type) => type !== barType)
        : [...prev.barTypes, barType],
    }));
    setError(null);
  };

  const handleCancel = () => {
    if (originalCrawl) {
      // Redirect back to the crawl details page
      router.push(`/crawls/${originalCrawl.id}`);
    } else {
      // If no original crawl, go back to my crawls page
      router.push("/my-crawls");
    }
  };

  // UPDATED FORM VALIDATION
  const isFormValid =
    formData.name &&
    formData.cityId &&
    formData.date &&
    formData.time &&
    formData.selectedBars.length > 0;

  // UPDATED SUBMIT HANDLER WITH PROPER BAR DATA VALIDATION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("Please sign in to create a crawl");
      return;
    }

    if (
      !formData.name ||
      !formData.cityId ||
      !formData.date ||
      !formData.time
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.selectedBars.length === 0) {
      setError(
        `Please select at least one bar in ${getCurrentCityName()} for your crawl`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time into a single DateTime
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const url = isEditMode ? `/api/crawls/${currentEditId}` : "/api/crawls";
      const method = isEditMode ? "PUT" : "POST";

      // Validate that all selected bars exist in available bars
      const validSelectedBars = formData.selectedBars.filter((selectedBar) =>
        availableBars.some((bar) => bar.id === selectedBar.barId)
      );

      if (validSelectedBars.length !== formData.selectedBars.length) {
        setError(
          "Some selected bars are no longer available. Please refresh and try again."
        );
        setIsLoading(false);
        return;
      }

      const requestBody = {
        name: formData.name,
        description: formData.description,
        cityId: formData.cityId,
        date: dateTime.toISOString(),
        startTime: dateTime.toISOString(),
        maxParticipants: parseInt(formData.maxParticipants),
        barTypes: formData.barTypes,
        selectedBars: validSelectedBars.map(({ barId, orderIndex }) => ({
          barId,
          orderIndex,
        })),
      };

      console.log("Sending crawl data:", requestBody);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditMode ? "update" : "create"} crawl`
        );
      }

      const result = await response.json();
      const crawl = result.crawl;

      setCrawlResult({
        ...crawl,
        shareableLink: `${window.location.origin}/crawls/${crawl.id}`,
      });
      setShowSuccess(true);

      // Refresh the form data after successful edit
      if (isEditMode) {
        // Re-fetch the crawl data to ensure we have the latest state
        const refreshResponse = await fetch(`/api/crawls/${currentEditId}`);
        if (refreshResponse.ok) {
          const refreshedCrawl = await refreshResponse.json();
          setOriginalCrawl(refreshedCrawl);
        }
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} crawl:`,
        error
      );
      setError(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditMode ? "update" : "create"
            } crawl. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareCrawl = async () => {
    if (!crawlResult) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join my bar crawl: ${crawlResult.name}`,
          text: `Join me for an amazing night out! We'll visit multiple bars across ${crawlResult.city.name}.`,
          url: crawlResult.shareableLink,
        });
      } else {
        await navigator.clipboard.writeText(crawlResult.shareableLink);
        alert("Crawl link copied to clipboard! 📋");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if (error instanceof Error && error.name !== "AbortError") {
        alert("Failed to share crawl");
      }
    }
  };

  const handleViewCrawl = () => {
    if (crawlResult) {
      router.push(`/crawls/${crawlResult.id}`);
    }
  };

  const handleCreateNewCrawl = () => {
    setShowSuccess(false);
    setCrawlResult(null);
    setFormData({
      name: "",
      description: "",
      cityId: "",
      date: "",
      time: "20:00",
      maxParticipants: "10",
      barTypes: [],
      selectedBars: [],
    });
    setSelectedCityName("");
  };

  const handleAutoRedirect = () => {
    if (crawlResult) {
      setTimeout(() => {
        router.push(`/crawls/${crawlResult.id}`);
      }, 5000);
    }
  };

  useEffect(() => {
    if (showSuccess && crawlResult) {
      handleAutoRedirect();
    }
  }, [showSuccess, crawlResult, router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Not set";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const getButtonText = () => {
    if (isLoading) {
      return (
        <>
          <span style={{ marginRight: "0.5rem" }}>⏳</span>
          {isEditMode ? "Updating Your Crawl..." : "Planning Your Crawl..."}
        </>
      );
    }
    return isEditMode ? "Update My Crawl 🍻" : "Create My Crawl 🍻";
  };

  const getSuccessTitle = () => {
    return isEditMode ? "Crawl Updated!" : "Crawl Created!";
  };

  if (status === "loading" || isLoadingCrawl) {
    return (
      <Page>
        <Title>{isEditMode ? "Edit Crawl" : "Plan Your Bar Crawl"}</Title>
        <HopprLoader />
      </Page>
    );
  }

  const ButtonComponent = isEditMode ? UpdateCrawlButton : CreateCrawlButton;

  return (
    <Page>
      <Title>
        {isEditMode
          ? `Edit: ${originalCrawl?.name || "Crawl"}`
          : "Plan Your Bar Crawl"}
      </Title>
      <Description>
        {isEditMode
          ? "Update your crawl details and bar preferences."
          : "Create the perfect night out with our smart crawl planner. We'll optimize your route and suggest the best bars."}
      </Description>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <PlannerContainer>
        <FormSection>
          <SectionTitle>
            {isEditMode ? "Edit Crawl Details" : "Crawl Details"}
          </SectionTitle>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">
                  Crawl Name <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Helsinki Night Adventure"
                  required
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your crawl theme or special requirements..."
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="cityId">
                  City <Required>*</Required>
                </Label>
                <Select
                  id="cityId"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="date">
                  Date <Required>*</Required>
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  required
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="time">
                  Start Time <Required>*</Required>
                </Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Select
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="5">5 people</option>
                  <option value="10">10 people</option>
                  <option value="15">15 people</option>
                  <option value="20">20 people</option>
                  <option value="25">25+ people</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Bar Types (Select preferences)</Label>
                <CheckboxGroup>
                  {barTypeOptions.map((type) => (
                    <CheckboxLabel key={type}>
                      <input
                        type="checkbox"
                        checked={formData.barTypes.includes(type)}
                        onChange={() => handleBarTypeChange(type)}
                        disabled={isLoading}
                      />
                      {type.replace("_", " ")}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
            </FormGrid>

            {/* UPDATED BAR SELECTION SECTION WITH CITY FILTERING */}
            {formData.cityId && formData.barTypes.length > 0 && (
              <BarSelectionSection>
                <SectionTitle>
                  Select Bars in {selectedCityName}
                  {formData.selectedBars.length > 0 && (
                    <span
                      style={{
                        color: "#10b981",
                        fontSize: "1rem",
                        marginLeft: "0.5rem",
                        fontWeight: "normal",
                      }}
                    >
                      ({formData.selectedBars.length} selected)
                    </span>
                  )}
                </SectionTitle>

                {isLoadingBars ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <HopprLoader />
                    <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
                      Finding the best bars in {selectedCityName}...
                    </p>
                  </div>
                ) : availableBars.length > 0 ? (
                  <>
                    <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
                      Click on bars to add them to your crawl in{" "}
                      <strong>{selectedCityName}</strong>. We&apos;ll optimize
                      the route for the best experience.
                    </p>

                    <BarGrid>
                      {availableBars.map((bar) => {
                        const selected = isBarSelected(bar.id);
                        const orderIndex = getBarOrderIndex(bar.id);

                        return (
                          <BarCard
                            key={bar.id}
                            $selected={selected}
                            onClick={() =>
                              selected
                                ? handleRemoveBar(bar.id)
                                : handleAddBar(bar)
                            }
                          >
                            <BarHeader>
                              <BarName>{bar.name}</BarName>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <BarType>{bar.type.replace("_", " ")}</BarType>
                                <span
                                  style={{
                                    background: "rgba(34, 197, 94, 0.2)",
                                    color: "#4ade80",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "12px",
                                    fontSize: "0.7rem",
                                    border: "1px solid rgba(34, 197, 94, 0.3)",
                                  }}
                                >
                                  {selectedCityName}
                                </span>
                              </div>
                            </BarHeader>

                            <BarDetails>
                              <BarInfoRow>
                                <span>📍</span>
                                <span style={{ fontSize: "0.8rem" }}>
                                  {bar.address}
                                </span>
                              </BarInfoRow>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "1rem",
                                  marginTop: "0.5rem",
                                }}
                              >
                                <BarInfoRow style={{ margin: 0 }}>
                                  <span>⭐</span>
                                  <span>{bar.averageRating}/5</span>
                                </BarInfoRow>

                                <BarInfoRow style={{ margin: 0 }}>
                                  <span>💰</span>
                                  <span>{"$".repeat(bar.priceLevel)}</span>
                                </BarInfoRow>

                                <BarInfoRow style={{ margin: 0 }}>
                                  <span>⏱️</span>
                                  <span>{bar.estimatedWaitTime}min</span>
                                </BarInfoRow>
                              </div>

                              {bar.vipAvailable && (
                                <BarInfoRow
                                  style={{
                                    marginTop: "0.5rem",
                                    padding: "0.5rem",
                                    background: "rgba(245, 158, 11, 0.1)",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <span>🎫</span>
                                  <span style={{ fontSize: "0.8rem" }}>
                                    <strong>VIP Skip-the-Line</strong> - €
                                    {bar.vipPrice}
                                  </span>
                                </BarInfoRow>
                              )}
                            </BarDetails>

                            {selected && orderIndex && (
                              <SelectionBadge>{orderIndex}</SelectionBadge>
                            )}
                          </BarCard>
                        );
                      })}
                    </BarGrid>
                  </>
                ) : (
                  <EmptyState>
                    <div className="icon">🏙️</div>
                    <h4 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
                      No bars found in {selectedCityName}
                    </h4>
                    <p>
                      Try selecting different bar types or check if we have bars
                      in this city.
                    </p>
                    <div
                      style={{
                        marginTop: "1rem",
                        fontSize: "0.875rem",
                        color: "#94a3b8",
                      }}
                    >
                      <p>Available bar types in {selectedCityName}:</p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                          justifyContent: "center",
                        }}
                      >
                        {barTypeOptions.map((type) => (
                          <span
                            key={type}
                            style={{
                              background: "rgba(139, 92, 246, 0.2)",
                              color: "#e2e8f0",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              border: "1px solid rgba(139, 92, 246, 0.3)",
                            }}
                          >
                            {type.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </EmptyState>
                )}

                {/* UPDATED SELECTED BARS LIST WITH SCROLLABLE */}
                {formData.selectedBars.length > 0 && (
                  <SelectedBarsList
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <h4
                      style={{
                        color: "#f8fafc",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        position: "sticky",
                        top: 0,
                        background: "rgba(15, 23, 42, 0.4)",
                        padding: "0.5rem",
                        margin: "-0.5rem -0.5rem 1rem -0.5rem",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <span>🗺️</span>
                      Your {selectedCityName} Crawl Route
                      <span
                        style={{
                          background: "#8b5cf6",
                          color: "white",
                          borderRadius: "12px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          marginLeft: "auto",
                        }}
                      >
                        {formData.selectedBars.length}{" "}
                        {formData.selectedBars.length === 1 ? "bar" : "bars"}
                      </span>
                    </h4>

                    {formData.selectedBars
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((selectedBar, index) => {
                        const barDetails = getSelectedBarDetails(selectedBar);
                        if (!barDetails) return null;

                        return (
                          <SelectedBarItem key={selectedBar.barId}>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                <div
                                  style={{
                                    background: "#8b5cf6",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    flexShrink: 0,
                                  }}
                                >
                                  {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <BarName
                                    style={{ margin: 0, fontSize: "1rem" }}
                                  >
                                    {barDetails.name}
                                  </BarName>
                                  <div
                                    style={{
                                      fontSize: "0.8rem",
                                      color: "#94a3b8",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <span>
                                      {barDetails.type.replace("_", " ")}
                                    </span>
                                    <span>•</span>
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                      }}
                                    >
                                      <span>⭐</span>
                                      <span>{barDetails.averageRating}</span>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {barDetails.estimatedWaitTime}min
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              {index > 0 && (
                                <MoveButton
                                  onClick={() =>
                                    handleMoveBar(selectedBar.barId, "up")
                                  }
                                  title="Move up"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  ↑
                                </MoveButton>
                              )}
                              {index < formData.selectedBars.length - 1 && (
                                <MoveButton
                                  onClick={() =>
                                    handleMoveBar(selectedBar.barId, "down")
                                  }
                                  title="Move down"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  ↓
                                </MoveButton>
                              )}
                              <RemoveBarButton
                                onClick={() =>
                                  handleRemoveBar(selectedBar.barId)
                                }
                                style={{ fontSize: "0.8rem" }}
                              >
                                Remove
                              </RemoveBarButton>
                            </div>
                          </SelectedBarItem>
                        );
                      })}
                  </SelectedBarsList>
                )}
              </BarSelectionSection>
            )}

            <DesktopButtonContainer>
              {!session ? (
                <SignUpButton href="/auth/signin">
                  Sign In to Create Crawl
                </SignUpButton>
              ) : (
                <>
                  <ButtonComponent
                    type="submit"
                    $loading={isLoading}
                    disabled={!isFormValid || isLoading}
                  >
                    {getButtonText()}
                  </ButtonComponent>
                  {isEditMode && (
                    <CancelButton
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel Changes
                    </CancelButton>
                  )}
                </>
              )}
            </DesktopButtonContainer>
          </form>
        </FormSection>

        <PreviewSection>
          <SectionTitle>Crawl Preview</SectionTitle>
          <PreviewContent>
            <PreviewItem>
              <PreviewLabel>Name:</PreviewLabel>
              <PreviewValue>{formData.name || "Not set"}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Description:</PreviewLabel>
              <PreviewValue>
                {formData.description || "No description"}
              </PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>City:</PreviewLabel>
              <PreviewValue>{selectedCityName || "Not set"}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Date:</PreviewLabel>
              <PreviewValue>{formatDate(formData.date)}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Time:</PreviewLabel>
              <PreviewValue>{formatTime(formData.time)}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Max Participants:</PreviewLabel>
              <PreviewValue>{formData.maxParticipants} people</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Bar Types:</PreviewLabel>
              <PreviewValue>
                {formData.barTypes.length > 0 ? (
                  <BarTypesPreview>
                    {formData.barTypes.map((type) => (
                      <BarTypeTag key={type}>
                        {type.replace("_", " ")}
                      </BarTypeTag>
                    ))}
                  </BarTypesPreview>
                ) : (
                  "No preferences selected"
                )}
              </PreviewValue>
            </PreviewItem>

            {/* Add Selected Bars Preview */}
            <PreviewItem>
              <PreviewLabel>Selected Bars:</PreviewLabel>
              <PreviewValue>
                {formData.selectedBars.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {formData.selectedBars
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((selectedBar, index) => {
                        const barDetails = getSelectedBarDetails(selectedBar);
                        return barDetails ? (
                          <div
                            key={selectedBar.barId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            <span
                              style={{
                                background: "#8b5cf6",
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                              }}
                            >
                              {index + 1}
                            </span>
                            {barDetails.name}
                          </div>
                        ) : null;
                      })}
                  </div>
                ) : (
                  "No bars selected"
                )}
              </PreviewValue>
            </PreviewItem>
          </PreviewContent>

          <TipsSection>
            <SectionTitle>Pro Tips</SectionTitle>
            <Tip>
              Start with a cocktail bar and end with a club for the best
              experience
            </Tip>
            <Tip>Plan 1-2 hours per venue including travel time</Tip>
            <Tip>Consider VIP passes for popular venues on weekends</Tip>
            <Tip>Larger groups should book tables in advance</Tip>
          </TipsSection>
        </PreviewSection>

        <MobileButtonContainer>
          {!session ? (
            <SignUpButton href="/auth/signin">
              Sign In to Create Crawl
            </SignUpButton>
          ) : (
            <>
              <ButtonComponent
                type="submit"
                $loading={isLoading}
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
              >
                {getButtonText()}
              </ButtonComponent>
              {isEditMode && (
                <CancelButton
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel Changes
                </CancelButton>
              )}
            </>
          )}
        </MobileButtonContainer>
      </PlannerContainer>

      {showSuccess && crawlResult && (
        <SuccessOverlay>
          <SuccessCard>
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessTitle>{getSuccessTitle()}</SuccessTitle>
            <SuccessMessage>
              Your &quot;{crawlResult.name}&quot; crawl is ready!
              <br />
              We&apos;ve {isEditMode ? "updated" : "created"} your crawl in{" "}
              {crawlResult.city.name}
              <br />
              starting at {new Date(crawlResult.startTime).toLocaleDateString()}
              <br />
              <br />
              <strong>Your route includes:</strong>
              <br />
              {crawlResult.crawlBars
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((crawlBar) => (
                  <div key={crawlBar.orderIndex}>
                    {crawlBar.orderIndex + 1}. {crawlBar.bar.name} (
                    {crawlBar.bar.type.replace("_", " ")})
                  </div>
                ))}
              <br />
              <br />
              <em>Redirecting to crawl page in 5 seconds...</em>
            </SuccessMessage>

            <ActionButtons>
              <ViewCrawlButton
                href={`/crawls/${crawlResult.id}`}
                onClick={handleViewCrawl}
              >
                View Crawl Details
              </ViewCrawlButton>
              <ShareButton onClick={handleShareCrawl}>
                Share with Friends
              </ShareButton>
              <NewCrawlButton onClick={handleCreateNewCrawl}>
                {isEditMode ? "Back to My Crawls" : "Plan Another"}
              </NewCrawlButton>
            </ActionButtons>
          </SuccessCard>
        </SuccessOverlay>
      )}
    </Page>
  );
};
export default CrawlPlanner;
