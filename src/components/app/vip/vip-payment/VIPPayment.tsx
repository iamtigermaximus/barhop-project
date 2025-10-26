"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

const PaymentContainer = styled.div`
  padding: 1rem;
  background: #0f172a;
  min-height: 100vh;
  color: #e2e8f0;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const PassSummary = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.25rem;
  }
`;

const PassHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const PassIcon = styled.div`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const PassDetails = styled.div`
  flex: 1;
`;

const PassName = styled.h3`
  color: #f8fafc;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BarName = styled.p`
  color: #0ea5e9;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const PassDescription = styled.p`
  color: #94a3b8;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceLabel = styled.span`
  color: #94a3b8;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const PriceAmount = styled.span`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.35rem 0.75rem;
  }
`;

const PaymentForm = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
`;

const SectionTitle = styled.h4`
  color: #f8fafc;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const Label = styled.label`
  display: block;
  color: #94a3b8;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    background: rgba(15, 23, 42, 0.8);
  }

  &::placeholder {
    color: #64748b;
  }

  @media (max-width: 768px) {
    padding: 0.65rem;
    font-size: 0.85rem;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const InputGroupHalf = styled.div`
  flex: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }
`;

const Button = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
  `
      : `
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #94a3b8;
    
    &:hover {
      border-color: #8b5cf6;
      color: white;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.85rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const DemoNotice = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  color: #10b981;
  font-size: 0.8rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 0.65rem;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  color: #ef4444;
  font-size: 0.8rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 0.65rem;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const BenefitsList = styled.div`
  margin: 1rem 0;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #94a3b8;
  font-size: 0.8rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface VIPPass {
  id: string;
  barId: string;
  bar: {
    id: string;
    name: string;
    type: string;
    district: string;
  };
  name: string;
  description: string;
  type: string;
  price: number;
  originalPrice?: number;
  benefits: string[];
  skipLinePriority: boolean;
  coverFeeIncluded: boolean;
  coverFeeAmount: number;
  validity: {
    start: string;
    end: string;
    validDays: string[];
    validHours?: { start: string; end: string };
  };
  capacity: {
    total: number;
    sold: number;
    available: number;
  };
  maxPerUser: number;
}

export default function VIPPayment() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const passId = searchParams.get("passId");

  const [pass, setPass] = useState<VIPPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiryDate, setExpiryDate] = useState("12/25");
  const [cvc, setCvc] = useState("123");
  const [cardholderName, setCardholderName] = useState("John Doe");

  useEffect(() => {
    if (!session) {
      router.push("/app/auth/login");
      return;
    }

    if (!passId) {
      setError("No pass selected");
      setLoading(false);
      return;
    }

    fetchPassDetails();
  }, [session, passId, router]);

  const fetchPassDetails = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching pass with ID:", passId);

      const response = await fetch(`/api/vip/passes/${passId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Pass data received:", data);

      if (!data.pass) {
        throw new Error("No pass data received");
      }

      setPass(data.pass);
    } catch (err) {
      console.error("Error fetching pass:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load pass details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!pass) return;

    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/vip/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vipPassId: pass.id }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to success page with purchase result
        router.push(
          `/app/vip/payment-success?purchaseId=${result.purchase.id}`
        );
      } else {
        setError(result.error || "Payment failed");
      }
    } catch (err) {
      setError("Payment processing failed");
      console.error("Payment error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getPassTypeIcon = (type: string) => {
    switch (type) {
      case "SKIP_LINE":
        return "🚀";
      case "PREMIUM_ENTRY":
        return "⭐";
      case "COVER_INCLUDED":
        return "🎫";
      default:
        return "🎪";
    }
  };

  // Add retry function
  const handleRetry = () => {
    fetchPassDetails();
  };

  if (loading) {
    return (
      <PaymentContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LoadingSpinner style={{ width: "32px", height: "32px" }} />
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Loading pass details...
          </p>
        </div>
      </PaymentContainer>
    );
  }

  if (error && !pass) {
    return (
      <PaymentContainer>
        <Header>
          <Title>Error Loading Pass</Title>
          <Subtitle>{error}</Subtitle>
        </Header>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={handleRetry}
            style={{
              background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/app/vip")}
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#94a3b8",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </PaymentContainer>
    );
  }

  if (!pass) {
    return (
      <PaymentContainer>
        <Header>
          <Title>Pass Not Found</Title>
          <Subtitle>The selected pass could not be found.</Subtitle>
        </Header>
        <ActionButtons>
          <Button $variant="secondary" onClick={() => router.push("/app/vip")}>
            Back to Marketplace
          </Button>
        </ActionButtons>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <Header>
        <Title>Complete Payment</Title>
        <Subtitle>
          Enter your payment details to purchase this VIP pass
        </Subtitle>
      </Header>

      <DemoNotice>
        💳 This is a demo payment. No real money will be charged.
      </DemoNotice>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <PassSummary>
        <PassHeader>
          <PassIcon>{getPassTypeIcon(pass.type)}</PassIcon>
          <PassDetails>
            <PassName>{pass.name}</PassName>
            <BarName>{pass.bar.name}</BarName>
            <PassDescription>{pass.description}</PassDescription>
          </PassDetails>
        </PassHeader>

        <BenefitsList>
          {pass.benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <span style={{ color: "#10b981" }}>✓</span>
              {benefit}
            </BenefitItem>
          ))}
        </BenefitsList>

        <PriceSection>
          <PriceLabel>Total Amount</PriceLabel>
          <PriceAmount>€{pass.price}</PriceAmount>
        </PriceSection>
      </PassSummary>

      <PaymentForm>
        <FormSection>
          <SectionTitle>Card Information</SectionTitle>

          <InputGroup>
            <Label>Card Number</Label>
            <Input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </InputGroup>

          <InputRow>
            <InputGroupHalf>
              <Label>Expiry Date</Label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </InputGroupHalf>
            <InputGroupHalf>
              <Label>CVC</Label>
              <Input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </InputGroupHalf>
          </InputRow>

          <InputGroup>
            <Label>Cardholder Name</Label>
            <Input
              type="text"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          </InputGroup>
        </FormSection>

        <ActionButtons>
          <Button
            $variant="secondary"
            onClick={handleCancel}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            $variant="primary"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <LoadingSpinner />
                Processing...
              </>
            ) : (
              `Pay €${pass.price}`
            )}
          </Button>
        </ActionButtons>
      </PaymentForm>
    </PaymentContainer>
  );
}
