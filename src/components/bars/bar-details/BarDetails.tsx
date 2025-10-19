"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ActionButton,
  Address,
  BackButton,
  BarMeta,
  BarName,
  Container,
  ContentGrid,
  Description,
  ErrorState,
  Feature,
  FeaturesGrid,
  FeatureText,
  Header,
  LoadingState,
  MainContent,
  SecondaryButton,
  Sidebar,
  Tag,
  VipPrice,
  VipTag,
} from "./BarDetails.styles";

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
