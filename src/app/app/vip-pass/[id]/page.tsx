"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Crown,
  Star,
  Ticket,
  Users,
  Clock,
  CheckCircle,
} from "phosphor-react";
import { useSession } from "next-auth/react";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};
  padding: 16px;
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding-left: 256px;
    padding-right: 32px;
    padding-bottom: 32px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const PassImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const PassTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassType = styled.div<{ $type: string }>`
  display: inline-block;
  background: ${(props) => {
    switch (props.$type) {
      case "SKIP_LINE":
        return "linear-gradient(135deg, #f59e0b, #d97706)";
      case "PREMIUM_ENTRY":
        return "linear-gradient(135deg, #10b981, #059669)";
      case "COVER_INCLUDED":
        return "linear-gradient(135deg, #0ea5e9, #0284c7)";
      default:
        return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const PriceSection = styled.div`
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
`;

const CurrentPrice = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: white;
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 24px;
    margin-right: 4px;
  }
`;

const OriginalPrice = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  color: ${({ theme }) => theme.colors.primaryAccent};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.mono};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const BenefitsSection = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BenefitsTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  font-family: ${({ theme }) => theme.fonts.dm};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const BenefitIcon = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const BenefitText = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const FeatureBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
`;

const FeatureBadge = styled.div<{
  $type: "primary" | "success" | "warning" | "info";
}>`
  background: ${(props) =>
    props.$type === "primary"
      ? "rgba(139, 92, 246, 0.2)"
      : props.$type === "success"
        ? "rgba(16, 185, 129, 0.2)"
        : props.$type === "warning"
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(14, 165, 233, 0.2)"};
  color: ${(props) =>
    props.$type === "primary"
      ? props.theme.colors.primaryAccent
      : props.$type === "success"
        ? "#10b981"
        : props.$type === "warning"
          ? "#f59e0b"
          : props.theme.colors.secondaryAccent};
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const CTASection = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const PurchaseButton = styled.button`
  flex: 2;
  background: linear-gradient(135deg, #8b5cf6, #0ea5e9);
  border: none;
  padding: 16px;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 1rem;

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: ${({ theme }) => theme.colors.primaryAccent};
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }
`;

interface VIPPass {
  id: string;
  name: string;
  description: string | null;
  type: string;
  priceCents?: number;
  price?: number;
  originalPriceCents?: number | null;
  originalPrice?: number | null;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  barId: string;
  bar?: {
    id: string;
    name: string;
    district?: string;
    city?: string;
  };
  validityStart?: string;
  validityEnd?: string;
  validDays?: string[];
  totalQuantity?: number;
  soldCount?: number;
  maxPerUser?: number;
  isActive?: boolean;
}

export default function VIPPassDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [pass, setPass] = useState<VIPPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPassDetails();
    }
  }, [params.id]);

  const fetchPassDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching VIP pass with ID:", params.id);

      // Try multiple approaches to get the pass
      let foundPass = null;

      // Approach 1: Direct endpoint
      try {
        const res = await fetch(`/api/vip/passes/${params.id}`);
        console.log("Direct endpoint response status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("Direct endpoint data:", data);
          foundPass = data.data || data;
        }
      } catch (err) {
        console.log("Direct endpoint failed:", err);
      }

      // Approach 2: Search through all passes if direct failed
      if (!foundPass) {
        try {
          const res = await fetch("/api/vip/passes?limit=100&isActive=true");
          if (res.ok) {
            const data = await res.json();
            const passes = data.passes || data.data || data;
            console.log("All passes count:", passes?.length);

            if (Array.isArray(passes)) {
              foundPass = passes.find((p: VIPPass) => p.id === params.id);
              console.log("Found pass in list:", foundPass?.id);
            }
          }
        } catch (err) {
          console.log("Search all passes failed:", err);
        }
      }

      if (foundPass) {
        setPass(foundPass);
      } else {
        setError("VIP pass not found");
      }
    } catch (error) {
      console.error("Error fetching VIP pass details:", error);
      setError("Failed to load VIP pass details");
    } finally {
      setLoading(false);
    }
  };

  const getPriceInEuros = (): number => {
    if (!pass) return 0;
    if (pass.priceCents !== undefined && pass.priceCents !== null) {
      return pass.priceCents / 100;
    }
    if (pass.price !== undefined && pass.price !== null) {
      const price = pass.price;
      return price > 100 ? price / 100 : price;
    }
    return 0;
  };

  const getOriginalPriceInEuros = (): number | null => {
    if (!pass) return null;
    if (
      pass.originalPriceCents !== undefined &&
      pass.originalPriceCents !== null
    ) {
      return pass.originalPriceCents / 100;
    }
    if (pass.originalPrice !== undefined && pass.originalPrice !== null) {
      const price = pass.originalPrice;
      return price > 100 ? price / 100 : price;
    }
    return null;
  };

  const getPassTypeIcon = (type: string): string => {
    switch (type) {
      case "SKIP_LINE":
        return "🚀";
      case "PREMIUM_ENTRY":
        return "⭐";
      case "COVER_INCLUDED":
        return "🎫";
      default:
        return "👑";
    }
  };

  const getPassTypeLabel = (type: string): string => {
    switch (type) {
      case "SKIP_LINE":
        return "Skip Line Access";
      case "PREMIUM_ENTRY":
        return "Premium Entry";
      case "COVER_INCLUDED":
        return "Cover Included";
      default:
        return "VIP Access";
    }
  };

  const getBenefitIcon = (benefit: string): string => {
    if (benefit.toLowerCase().includes("skip")) return "🚀";
    if (benefit.toLowerCase().includes("cover")) return "🎫";
    if (benefit.toLowerCase().includes("drink")) return "🍹";
    if (benefit.toLowerCase().includes("vip")) return "👑";
    if (benefit.toLowerCase().includes("entry")) return "🚪";
    return "✨";
  };

  const getPlaceholderImage = (): string => {
    return "https://res.cloudinary.com/dgkjr3qbc/image/upload/v1777016865/hoppr/images/file_csspok.jpg";
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePurchase = () => {
    if (!session) {
      router.push(
        `/app/auth/login?callbackUrl=${encodeURIComponent(`/app/vip-pass/${pass?.id}`)}`,
      );
    } else {
      router.push(`/app/vip-pass/vip-payment?passId=${pass?.id}`);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>Loading VIP pass details...</LoadingState>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !pass) {
    return (
      <PageWrapper>
        <Container>
          <Header>
            <BackButton onClick={() => router.push("/app")}>
              <ArrowLeft size={20} />
            </BackButton>
          </Header>
          <ErrorState>
            <p>{error || "VIP pass not found"}</p>
            <button onClick={() => router.push("/app")}>Back to Home</button>
          </ErrorState>
        </Container>
      </PageWrapper>
    );
  }

  const priceInEuros = getPriceInEuros();
  const originalPriceInEuros = getOriginalPriceInEuros();
  const hasDiscount =
    originalPriceInEuros && originalPriceInEuros > priceInEuros;

  return (
    <PageWrapper>
      <Container>
        <Header>
          <BackButton onClick={() => router.push("/app")}>
            <ArrowLeft size={20} />
          </BackButton>
        </Header>

        <PassImage src={getPlaceholderImage()} alt={pass.name} />

        <PassType $type={pass.type}>
          {getPassTypeIcon(pass.type)} {getPassTypeLabel(pass.type)}
        </PassType>

        <PassTitle>{pass.name}</PassTitle>

        <Description>
          {pass.description ||
            "Experience the ultimate VIP treatment with exclusive benefits and priority access."}
        </Description>

        <PriceSection>
          <CurrentPrice>{priceInEuros.toFixed(2)}</CurrentPrice>
          {hasDiscount && (
            <OriginalPrice>€{originalPriceInEuros.toFixed(2)}</OriginalPrice>
          )}
        </PriceSection>

        <FeatureBadges>
          {pass.skipLinePriority && (
            <FeatureBadge $type="primary">🚀 Skip the Line</FeatureBadge>
          )}
          {pass.coverFeeIncluded && (
            <FeatureBadge $type="success">🎫 Cover Fee Included</FeatureBadge>
          )}
          {pass.maxPerUser && pass.maxPerUser > 0 && (
            <FeatureBadge $type="warning">
              👤 Max {pass.maxPerUser} per person
            </FeatureBadge>
          )}
          {pass.totalQuantity && pass.soldCount !== undefined && (
            <FeatureBadge $type="info">
              🎟️ {pass.totalQuantity - pass.soldCount} remaining
            </FeatureBadge>
          )}
        </FeatureBadges>

        <InfoSection>
          <InfoRow>
            <InfoIcon>
              <MapPin size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Venue</InfoLabel>
              <InfoValue>{pass.bar?.name || "Premium Venue"}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon>
              <MapPin size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>
                {pass.bar?.district || "City Center"},{" "}
                {pass.bar?.city || "Helsinki"}
              </InfoValue>
            </InfoContent>
          </InfoRow>

          {pass.validityStart && (
            <InfoRow>
              <InfoIcon>
                <Calendar size={24} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Valid From</InfoLabel>
                <InfoValue>{formatDate(pass.validityStart)}</InfoValue>
              </InfoContent>
            </InfoRow>
          )}

          {pass.validityEnd && (
            <InfoRow>
              <InfoIcon>
                <Clock size={24} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Valid Until</InfoLabel>
                <InfoValue>{formatDate(pass.validityEnd)}</InfoValue>
              </InfoContent>
            </InfoRow>
          )}

          {pass.validDays && pass.validDays.length > 0 && (
            <InfoRow>
              <InfoIcon>
                <Calendar size={24} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Valid Days</InfoLabel>
                <InfoValue>{pass.validDays.join(", ")}</InfoValue>
              </InfoContent>
            </InfoRow>
          )}
        </InfoSection>

        {pass.benefits && pass.benefits.length > 0 && (
          <BenefitsSection>
            <BenefitsTitle>
              <Crown size={20} weight="fill" />
              What&apos;s Included
            </BenefitsTitle>
            {pass.benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <BenefitIcon>{getBenefitIcon(benefit)}</BenefitIcon>
                <BenefitText>{benefit}</BenefitText>
                <CheckCircle size={20} color="#10b981" />
              </BenefitItem>
            ))}
          </BenefitsSection>
        )}

        <CTASection>
          <SecondaryButton
            onClick={() => router.push(`/app/bars/${pass.barId}`)}
          >
            View Venue
          </SecondaryButton>
          <PurchaseButton onClick={handlePurchase}>
            Buy Now - €{priceInEuros.toFixed(2)} →
          </PurchaseButton>
        </CTASection>
      </Container>
    </PageWrapper>
  );
}
