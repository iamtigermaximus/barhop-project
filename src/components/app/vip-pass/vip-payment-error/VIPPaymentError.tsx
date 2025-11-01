"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

const ErrorContainer = styled.div`
  padding: 2rem 1rem;
  min-height: 100vh;
  color: #e2e8f0;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ErrorCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #ef4444, #dc2626);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #94a3b8;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    color: white;
  }
`;

export default function VIPPaymentError() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message") || "An unexpected error occurred";
  const passId = searchParams.get("passId");

  const handleTryAgain = () => {
    if (passId) {
      router.push(`/app/vip-pass/vip-payment?passId=${passId}`);
    } else {
      router.push("/app/vip-pass");
    }
  };

  const handleBackToMarketplace = () => {
    router.push("/app/vip-pass");
  };

  return (
    <ErrorContainer>
      <ErrorCard>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
        <Title>Purchase Failed</Title>
        <Subtitle>
          We encountered an issue while processing your payment
        </Subtitle>

        <ErrorMessage>{message}</ErrorMessage>

        <ButtonGroup>
          <SecondaryButton onClick={handleBackToMarketplace}>
            Back to Marketplace
          </SecondaryButton>
          <PrimaryButton onClick={handleTryAgain}>Try Again</PrimaryButton>
        </ButtonGroup>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            If the problem persists, please contact support.
          </p>
        </div>
      </ErrorCard>
    </ErrorContainer>
  );
}
