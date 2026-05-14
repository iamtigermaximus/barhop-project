"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";

const PromotionCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
`;

const PromotionImage = styled.div<{
  $imageUrl?: string | null;
  $accentColor?: string | null;
}>`
  height: 140px;
  background: ${(props) =>
    props.$imageUrl
      ? `url(${props.$imageUrl})`
      : `linear-gradient(135deg, ${props.$accentColor || "#8b5cf6"}, ${props.$accentColor || "#0ea5e9"})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mono};
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
      case "VIP_OFFER":
        return "linear-gradient(135deg, #0ea5e9, #0284c7)";
      default:
        return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    }
  }};
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.mono};
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Content = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.25rem 0;
  font-family: ${({ theme }) => theme.fonts.dm};
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BarInfo = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondaryAccent};
  font-family: ${({ theme }) => theme.fonts.mono};

  &::before {
    content: "€";
    font-size: 0.9rem;
  }

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  margin-left: 0.5rem;
`;

const ValidityBadge = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const CardButton = styled.div`
  margin-top: auto;
  padding-top: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primaryAccent};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.dm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::after {
    content: "→";
    transition: transform 0.3s ease;
  }

  ${PromotionCardWrapper}:hover &::after {
    transform: translateX(4px);
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

export default function PromotionCard({ promotion }: { promotion: Promotion }) {
  const router = useRouter();

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
      case "VIP_OFFER":
        return "👑";
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

  const getExpiryText = (endDate: string): string => {
    try {
      const today = new Date();
      const end = new Date(endDate);
      const diffDays = Math.ceil(
        (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 0) return "Ended";
      if (diffDays === 0) return "Ends today";
      if (diffDays === 1) return "Ends tomorrow";
      return `${diffDays}d left`;
    } catch {
      return "Limited time";
    }
  };

  const handleClick = () => {
    router.push(`/app/promotions/${promotion.id}`);
  };

  return (
    <PromotionCardWrapper onClick={handleClick}>
      <PromotionImage
        $imageUrl={promotion.imageUrl}
        $accentColor={promotion.accentColor}
      >
        {promotion.discount && promotion.discount > 0 && (
          <DiscountBadge>{promotion.discount}% OFF</DiscountBadge>
        )}
        <TypeTag $type={promotion.type}>
          {getTypeIcon(promotion.type)} {getTypeLabel(promotion.type)}
        </TypeTag>
      </PromotionImage>

      <Content>
        <Title>{promotion.title}</Title>
        <BarInfo>
          <span>📍</span> {promotion.bar?.name || "Venue"} •{" "}
          {promotion.bar?.district || "City Center"}
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

        <CardButton>View Offer</CardButton>
      </Content>
    </PromotionCardWrapper>
  );
}
