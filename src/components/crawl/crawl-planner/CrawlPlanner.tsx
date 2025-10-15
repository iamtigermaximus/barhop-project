"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HopprLoader } from "@/components/ui/Loader/HopprLoader";

const Page = styled.div`
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

const PlannerContainer = styled.div`
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

const FormSection = styled.div`
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

const PreviewSection = styled.div`
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

const MobileButtonContainer = styled.div`
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

const DesktopButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
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

const FormGrid = styled.div`
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
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

const Required = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const Input = styled.input`
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

const Select = styled.select`
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

const TextArea = styled.textarea`
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

const CheckboxGroup = styled.div`
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

const CheckboxLabel = styled.label`
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

const CreateCrawlButton = styled.button<{ $loading: boolean }>`
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

const UpdateCrawlButton = styled(CreateCrawlButton)`
  background: linear-gradient(45deg, #f59e0b, #d97706, #b45309);
`;

const CancelButton = styled.button`
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

const SignUpButton = styled(Link)`
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

const PreviewContent = styled.div`
  color: #e2e8f0;
  line-height: 1.6;
`;

const PreviewItem = styled.div`
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

const PreviewLabel = styled.span`
  font-weight: 600;
  color: #cbd5e1;
  min-width: 100px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    min-width: 80px;
  }
`;

const PreviewValue = styled.span`
  color: #f8fafc;
  flex: 1;
  text-align: right;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const BarTypesPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BarTypeTag = styled.span`
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

const TipsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
`;

const Tip = styled.div`
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

const SuccessOverlay = styled.div`
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

const SuccessCard = styled.div`
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

const SuccessIcon = styled.div`
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

const SuccessTitle = styled.h2`
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

const SuccessMessage = styled.p`
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

const ActionButtons = styled.div`
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

const ViewCrawlButton = styled(Link)`
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

const ShareButton = styled.button`
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

const NewCrawlButton = styled.button`
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

interface CrawlFormData {
  name: string;
  description: string;
  cityId: string;
  date: string;
  time: string;
  maxParticipants: string;
  barTypes: string[];
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
    bar: {
      name: string;
      type: string;
    };
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

export default function CrawlPlanner({ editCrawlId }: CrawlPlannerProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Use the prop instead of useSearchParams
  const currentEditId = editCrawlId;

  const [formData, setFormData] = useState<CrawlFormData>({
    name: "",
    description: "",
    cityId: "",
    date: "",
    time: "20:00",
    maxParticipants: "10",
    barTypes: [],
  });

  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCrawl, setIsLoadingCrawl] = useState(false);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalCrawl, setOriginalCrawl] = useState<Crawl | null>(null);

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
          });
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("Please sign in to create a crawl");
      return;
    }

    if (!isFormValid) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Combine date and time into a single DateTime
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const url = isEditMode ? `/api/crawls/${currentEditId}` : "/api/crawls";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          cityId: formData.cityId,
          date: dateTime.toISOString(),
          startTime: dateTime.toISOString(),
          maxParticipants: parseInt(formData.maxParticipants),
          barTypes: formData.barTypes,
        }),
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
    });
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

  const isFormValid =
    formData.name && formData.cityId && formData.date && formData.time;

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
              <PreviewValue>
                {cities.find((c) => c.id === formData.cityId)?.name ||
                  "Not set"}
              </PreviewValue>
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
              {crawlResult.crawlBars.map((crawlBar) => (
                <div key={crawlBar.orderIndex}>
                  {crawlBar.orderIndex}. {crawlBar.bar.name} (
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
}
