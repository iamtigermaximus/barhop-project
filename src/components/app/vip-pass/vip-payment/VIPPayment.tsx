"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

const PaymentContainer = styled.div`
  padding: 2rem 1rem;
  min-height: 100vh;
  color: #e2e8f0;
  max-width: 600px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    transform: translateX(-4px);
  }
`;

const PaymentCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const PassSummary = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const PaymentForm = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaymentInput = styled.input`
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const PaymentRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PaymentLabel = styled.label`
  display: block;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
`;

const PayButton = styled.button`
  background: linear-gradient(45deg, #10b981, #0ea5e9);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DemoNotice = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-size: 0.9rem;
`;

interface VIPPass {
  id: string;
  barId: string;
  bar: {
    name: string;
    type: string;
    district: string;
  };
  name: string;
  description: string;
  price: number;
  benefits: string[];
}

export default function VIPPayment() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pass, setPass] = useState<VIPPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const passId = searchParams.get("passId");

  useEffect(() => {
    if (!session) {
      // Redirect to your existing login page
      router.push(
        `/app/auth/login?callbackUrl=${encodeURIComponent(
          `/app/vip/payment?passId=${passId}`
        )}`
      );
      return;
    }

    if (passId) {
      fetchPassDetails();
    } else {
      router.push("/app/vip-pass");
    }
  }, [session, passId, router]);

  const fetchPassDetails = async () => {
    try {
      const response = await fetch(`/api/vip/passes/${passId}`);
      if (response.ok) {
        const passData = await response.json();
        setPass(passData);
      } else {
        throw new Error("Failed to fetch pass details");
      }
    } catch (error) {
      console.error("Error fetching pass details:", error);
      router.push("/app/vip-pass");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handlePayment = async () => {
    if (!pass) return;

    setProcessing(true);
    try {
      const response = await fetch("/api/vip/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vipPassId: pass.id }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(
          `/app/vip-pass/vip-payment-success?purchaseId=${result.purchase.id}`
        );
      } else {
        router.push(
          `/app/vip-pass/vip-payment-error?message=${encodeURIComponent(
            result.error || "Payment failed"
          )}`
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      router.push(
        `/app/vip-pass/vip-payment-error?message=${encodeURIComponent(
          "Payment processing failed"
        )}`
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <PaymentContainer>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(139, 92, 246, 0.3)",
              borderTopColor: "#8b5cf6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#94a3b8" }}>Loading payment details...</p>
        </div>
      </PaymentContainer>
    );
  }

  if (!pass) {
    return (
      <PaymentContainer>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444" }}>Pass not found</p>
          <BackButton onClick={handleBack}>← Back to Marketplace</BackButton>
        </div>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <BackButton onClick={handleBack}>← Back to Marketplace</BackButton>

      <PaymentCard>
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          💳
        </div>
        <Title>Complete Your Purchase</Title>
        <Subtitle>
          Enter your payment details to purchase this VIP pass
        </Subtitle>

        <PassSummary>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🎪</span>
            <div>
              <h3 style={{ color: "#f8fafc", margin: 0, fontSize: "1.1rem" }}>
                {pass.name}
              </h3>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
                {pass.bar.name}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Total Amount:</span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              €{pass.price}
            </span>
          </div>
        </PassSummary>

        <PaymentForm>
          <div>
            <PaymentLabel>Card Number</PaymentLabel>
            <PaymentInput
              type="text"
              placeholder="4242 4242 4242 4242"
              defaultValue="4242 4242 4242 4242"
            />
          </div>

          <PaymentRow>
            <div style={{ flex: 1 }}>
              <PaymentLabel>Expiry Date</PaymentLabel>
              <PaymentInput
                type="text"
                placeholder="MM/YY"
                defaultValue="12/25"
              />
            </div>
            <div style={{ flex: 1 }}>
              <PaymentLabel>CVC</PaymentLabel>
              <PaymentInput type="text" placeholder="123" defaultValue="123" />
            </div>
          </PaymentRow>

          <div>
            <PaymentLabel>Cardholder Name</PaymentLabel>
            <PaymentInput
              type="text"
              placeholder="John Doe"
              defaultValue="John Doe"
            />
          </div>
        </PaymentForm>

        <PayButton onClick={handlePayment} disabled={processing}>
          {processing ? "Processing..." : `Pay €${pass.price}`}
        </PayButton>

        <DemoNotice>
          💳 This is a demo payment. No real money will be charged.
        </DemoNotice>
      </PaymentCard>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </PaymentContainer>
  );
}
