"use client";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Container = styled.div`
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #0f172a;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;

  &:hover {
    color: #f8fafc;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const BarName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const BarMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: #334155;
  color: #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const VipTag = styled(Tag)`
  background: #0284c7;
  color: white;
`;

const Address = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div``;

const Description = styled.p`
  color: #e2e8f0;
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const FeatureText = styled.span`
  color: #e2e8f0;
  font-weight: 500;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const Sidebar = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #334155;
  height: fit-content;
`;

const ActionButton = styled.button`
  width: 100%;
  background: #0284c7;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0369a1;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #475569;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  background: transparent;
  color: #f8fafc;
  border: 2px solid #475569;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5e9;
    transform: translateY(-2px);
  }
`;

const VipPrice = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #e2e8f0;
  font-size: 1.125rem;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ef4444;
  font-size: 1.125rem;
`;

interface Bar {
  id: string;
  name: string;
  description: string | null;
  address: string;
  district: string;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  city: {
    id: string;
    name: string;
    country: string;
  };
  // Add fields that exist in your schema
  phone?: string | null;
  website?: string | null;
  imageUrl?: string | null;
  latitude?: number;
  longitude?: number;
}

export default function BarDetails() {
  const params = useParams();
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "vip" | "plan" | "group"
  >();

  useEffect(() => {
    const fetchBar = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bars/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Bar not found");
          } else {
            setError("Failed to fetch bar details");
          }
          return;
        }

        const barData = await response.json();
        setBar(barData);
      } catch (err) {
        setError("Error fetching bar details");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBar();
    }
  }, [params.id]);

  // Add handler functions to use the state
  const handleVipClick = () => {
    setSelectedAction("vip");
    // Add your VIP logic here
    console.log("VIP selected");
  };

  const handlePlanClick = () => {
    setSelectedAction("plan");
    // Add your plan logic here
    console.log("Plan visit selected");
  };

  const handleGroupClick = () => {
    setSelectedAction("group");
    // Add your group logic here
    console.log("Create group selected");
  };

  const getBarFeatures = () => {
    if (!bar) return [];

    const features = [];

    if (bar.vipEnabled) {
      features.push({ icon: "⭐", text: "VIP Skip-the-Line" });
    }

    if (bar.type === "CLUB") {
      features.push({ icon: "💃", text: "Dance Floor" });
      features.push({ icon: "🎵", text: "Live DJ" });
    }

    if (bar.type === "LOUNGE" || bar.type === "COCKTAIL_BAR") {
      features.push({ icon: "🍸", text: "Craft Cocktails" });
    }

    if (bar.type === "SPORTS_BAR") {
      features.push({ icon: "📺", text: "Sports Screens" });
    }

    if (bar.type === "LIVE_MUSIC") {
      features.push({ icon: "🎤", text: "Live Music" });
    }

    return features;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading bar details...</LoadingState>
      </Container>
    );
  }

  if (error || !bar) {
    return (
      <Container>
        <ErrorState>{error || "Bar not found"}</ErrorState>
      </Container>
    );
  }

  const features = getBarFeatures();

  return (
    <Container>
      <BackButton href="/bars">← Back to All Bars</BackButton>

      <Header>
        <BarName>{bar.name}</BarName>
        <BarMeta>
          <Tag>{bar.city.name}</Tag>
          <Tag>{bar.district}</Tag>
          <Tag>{bar.type.replace("_", " ")}</Tag>
          {bar.vipEnabled && <VipTag>VIP Available</VipTag>}
        </BarMeta>
        <Address>{bar.address}</Address>
      </Header>

      <ContentGrid>
        <MainContent>
          <Description>
            {bar.description ||
              "Experience great nightlife at this popular venue."}
          </Description>

          {features.length > 0 && (
            <>
              <h2
                style={{
                  color: "#f8fafc",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                Features
              </h2>
              <FeaturesGrid>
                {features.map((feature, index) => (
                  <Feature key={index}>
                    <span>{feature.icon}</span>
                    <FeatureText>{feature.text}</FeatureText>
                  </Feature>
                ))}
              </FeaturesGrid>
            </>
          )}
        </MainContent>

        <Sidebar>
          {bar.vipEnabled && bar.vipPrice && (
            <>
              <VipPrice>VIP: €{bar.vipPrice}</VipPrice>
              <ActionButton onClick={handleVipClick}>Buy VIP Pass</ActionButton>
            </>
          )}

          <ActionButton onClick={handlePlanClick}>Plan Visit</ActionButton>

          <SecondaryButton onClick={handleGroupClick}>
            Create Group
          </SecondaryButton>

          {/* Quick Info */}
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid #334155",
            }}
          >
            <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
              Quick Info
            </h3>
            <div style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>
              <p>
                📍 {bar.district}, {bar.city.name}
              </p>
              <p>🏷️ {bar.type.replace("_", " ")}</p>
              {bar.vipEnabled && <p>⭐ Skip-the-line available</p>}
            </div>
          </div>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
}
