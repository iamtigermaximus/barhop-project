// barhop/src/components/app/common/promotion-card/PromotionCard.tsx

"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";

const gradientShift = `
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      #ff6b6b,
      #f06595,
      #cc5de8,
      #5f3dc4,
      #3b82f6,
      #0ea5e9
    );
    background-size: 400% 400%;
    border-radius: 22px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 800;
  font-family: ${({ theme }) => theme.fonts.mono};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 2;

  &::before {
    content: "⚡";
    margin-right: 4px;
  }
`;

const TypeTag = styled.div<{ $type: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${(props) => {
    switch (props.$type) {
      case "HAPPY_HOUR":
        return "linear-gradient(135deg, #f59e0b, #d97706)";
      case "DRINK_SPECIAL":
        return "linear-gradient(135deg, #10b981, #059669)";
      case "FOOD_SPECIAL":
        return "linear-gradient(135deg, #ec4899, #be185d)";
      case "LADIES_NIGHT":
        return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
      case "VIP_OFFER":
        return "linear-gradient(135deg, #0ea5e9, #0284c7)";
      case "THEME_NIGHT":
        return "linear-gradient(135deg, #f97316, #ea580c)";
      case "COVER_DISCOUNT":
        return "linear-gradient(135deg, #14b8a6, #0d9488)";
      case "STUDENT_DISCOUNT":
        return "linear-gradient(135deg, #06b6d4, #0891b2)";
      default:
        return "linear-gradient(135deg, #6b7280, #4b5563)";
    }
  }};
  color: white;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mono};
  backdrop-filter: blur(4px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Content = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BenefitsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const BenefitChip = styled.span`
  background: rgba(139, 92, 246, 0.15);
  color: ${({ theme }) => theme.colors.primaryAccent};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 1rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  margin-left: 0.5rem;
`;

const BarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.75rem;
`;

const ValidityBadge = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const CTAButton = styled.button<{ $accentColor?: string }>`
  width: 100%;
  padding: 0.875rem;
  background: ${({ $accentColor }) =>
    $accentColor || "linear-gradient(135deg, #8b5cf6, #0ea5e9)"};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.dm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  imageUrl: string | null;
  accentColor: string | null;
  callToAction: string | null;
  barId: string;
  bar?: {
    id: string;
    name: string;
    district?: string;
  };
  startDate: string;
  endDate: string;
}

interface PromotionCardProps {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const router = useRouter();
  const isUpcoming = new Date(promotion.startDate) > new Date();
  const isActive =
    new Date(promotion.startDate) <= new Date() &&
    new Date(promotion.endDate) >= new Date();

  // Guard clause
  if (!promotion || !promotion.id) {
    return null;
  }

  const promotionType = promotion.type || "DRINK_SPECIAL";

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "HAPPY_HOUR":
        return "🍻";
      case "DRINK_SPECIAL":
        return "🍹";
      case "FOOD_SPECIAL":
        return "🍽️";
      case "LADIES_NIGHT":
        return "👩‍🎤";
      case "THEME_NIGHT":
        return "🎭";
      case "VIP_OFFER":
        return "👑";
      case "COVER_DISCOUNT":
        return "🎫";
      case "STUDENT_DISCOUNT":
        return "🎓";
      default:
        return "🎉";
    }
  };

  const getTypeLabel = (type: string): string => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleClick = (): void => {
    router.push(`/app/bars/${promotion.barId}?promotion=${promotion.id}`);
  };

  const getExpiryText = (endDate: string): string => {
    try {
      const today = new Date();
      const end = new Date(endDate);
      const diffDays = Math.ceil(
        (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 0) return "Ended";
      if (diffDays === 0) return "Ends today! ⚡";
      if (diffDays === 1) return "Ends tomorrow 🔥";
      if (diffDays <= 3) return `${diffDays} days left 🏃`;
      return `${diffDays} days left`;
    } catch {
      return "Limited time";
    }
  };

  const getBenefitIcons = (type: string): { icon: string; text: string }[] => {
    const benefits = [];
    if (type === "HAPPY_HOUR")
      benefits.push({ icon: "⏰", text: "Limited Time" });
    if (type === "VIP_OFFER") benefits.push({ icon: "🚀", text: "Skip Line" });
    if (type === "COVER_DISCOUNT")
      benefits.push({ icon: "🎫", text: "Cover Included" });
    if (type === "FOOD_SPECIAL")
      benefits.push({ icon: "🍽️", text: "Food Deal" });
    if (type === "DRINK_SPECIAL")
      benefits.push({ icon: "🍹", text: "Drink Deal" });
    benefits.push({ icon: "⭐", text: getTypeLabel(type) });
    return benefits.slice(0, 3);
  };

  const benefits = getBenefitIcons(promotionType);
  const barName = promotion.bar?.name || "Venue";
  const barDistrict = promotion.bar?.district || "City Center";
  const title = promotion.title || "Special Offer";
  const description =
    promotion.description || "Check out this great offer at the venue!";

  return (
    <Card
      onClick={handleClick}
      //   $accentColor={promotion.accentColor || undefined}
    >
      {isUpcoming && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "#f59e0b",
            color: "white",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.7rem",
            fontWeight: "600",
            zIndex: 2,
            fontFamily: "monospace",
          }}
        >
          🔜 Coming Soon
        </div>
      )}
      <ImageContainer>
        {promotion.imageUrl ? (
          <img src={promotion.imageUrl} alt={title} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              background:
                promotion.accentColor ||
                "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            {getTypeIcon(promotionType)}
          </div>
        )}
        {promotion.discount && promotion.discount > 0 && (
          <DiscountBadge>{promotion.discount}% OFF</DiscountBadge>
        )}
        <TypeTag $type={promotionType}>
          {getTypeIcon(promotionType)} {getTypeLabel(promotionType)}
        </TypeTag>
      </ImageContainer>

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>

        <BenefitsRow>
          {benefits.map((benefit, i) => (
            <BenefitChip key={i}>
              {benefit.icon} {benefit.text}
            </BenefitChip>
          ))}
        </BenefitsRow>

        <BarInfo>
          <span>📍</span> {barName} • {barDistrict}
        </BarInfo>

        <PriceRow>
          <div>
            {promotion.discount && promotion.discount > 0 ? (
              <>
                <Price>
                  {Math.round(30 - (30 * promotion.discount) / 100)}
                </Price>
                <OriginalPrice>€30</OriginalPrice>
              </>
            ) : (
              <Price>Special Offer</Price>
            )}
          </div>
          <ValidityBadge>⏱️ {getExpiryText(promotion.endDate)}</ValidityBadge>
        </PriceRow>

        <CTAButton $accentColor={promotion.accentColor || undefined}>
          {promotion.callToAction || "View Offer"} →
        </CTAButton>
      </Content>
    </Card>
  );
}
