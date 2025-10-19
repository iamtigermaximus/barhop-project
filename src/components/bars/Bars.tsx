"use client";
import { useEffect, useState } from "react";
import { HopprLoader } from "../ui/Loader/HopprLoader";
import {
  Address,
  BarCard,
  BarDescription,
  BarDetails,
  BarName,
  BarsGrid,
  Description,
  DetailTag,
  ErrorState,
  Page,
  Title,
  VIPBadge,
} from "./Bars.styles";

interface Bar {
  id: string;
  name: string;
  description: string | null;
  district: string;
  type: string;
  vipEnabled: boolean;
  vipPrice: number | null;
  address: string;
  city: {
    name: string;
  };
}

export default function Bars() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBars() {
      try {
        setLoading(true);
        const response = await fetch("/api/bars");

        if (!response.ok) {
          throw new Error("Failed to fetch bars");
        }

        const data = await response.json();
        setBars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBars();
  }, []);

  // Add inline style to body to ensure gradient background
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(-45deg, rgb(9, 9, 11), rgb(15, 23, 42), rgb(9, 9, 11), rgb(15, 23, 42))";
    document.body.style.backgroundSize = "400% 400%";
    document.body.style.animation = "gradientShift 12s ease infinite";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.animation = "";
    };
  }, []);

  if (loading) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        {/* <LoadingState>Loading bars...</LoadingState> */}
        <HopprLoader />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Title>Explore All Bars</Title>
        <ErrorState>Error: {error}</ErrorState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Explore All Bars</Title>
      <Description>Discover {bars.length} bars across Finland</Description>

      <BarsGrid>
        {bars.map((bar) => (
          <BarCard key={bar.id} href={`/bars/${bar.id}`}>
            <BarName>{bar.name}</BarName>
            <BarDescription>
              {bar.description || "A great place to enjoy nightlife"}
            </BarDescription>
            <BarDetails>
              <DetailTag>{bar.city.name}</DetailTag>
              <DetailTag>{bar.district}</DetailTag>
              <DetailTag>{bar.type.replace(/_/g, " ")}</DetailTag>
              {bar.vipEnabled && bar.vipPrice && (
                <VIPBadge>VIP: €{bar.vipPrice}</VIPBadge>
              )}
            </BarDetails>
            <Address>{bar.address}</Address>
          </BarCard>
        ))}
      </BarsGrid>
    </Page>
  );
}
