// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import styled from "styled-components";

// const SuccessContainer = styled.div`
//   padding: 2rem 1rem;
//   min-height: 100vh;
//   color: #e2e8f0;
//   max-width: 500px;
//   margin: 0 auto;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// `;

// const SuccessCard = styled.div`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(16, 185, 129, 0.3);
//   border-radius: 20px;
//   padding: 2.5rem;
//   text-align: center;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: 800;
//   margin-bottom: 0.5rem;
//   background: linear-gradient(-45deg, #10b981, #0ea5e9);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Subtitle = styled.p`
//   color: #94a3b8;
//   font-size: 1.1rem;
//   margin-bottom: 2rem;
// `;

// const QRCodeSection = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 12px;
//   text-align: center;
//   margin: 1.5rem 0;
// `;

// const QRCodeText = styled.div`
//   font-family: monospace;
//   background: #f1f5f9;
//   padding: 0.75rem;
//   border-radius: 8px;
//   margin-top: 1rem;
//   font-size: 0.9rem;
//   color: #475569;
//   word-break: break-all;
// `;

// const ExpiryInfo = styled.div`
//   background: rgba(16, 185, 129, 0.1);
//   border-radius: 8px;
//   padding: 1rem;
//   margin-bottom: 1.5rem;
//   border: 1px solid rgba(16, 185, 129, 0.2);
//   color: #10b981;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 2rem;
// `;

// const PrimaryButton = styled.button`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   border: none;
//   color: white;
//   padding: 1rem 2rem;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 1.1rem;
//   cursor: pointer;
//   flex: 1;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
//   }
// `;

// const SecondaryButton = styled.button`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: #94a3b8;
//   padding: 1rem 2rem;
//   border-radius: 12px;
//   font-weight: 600;
//   font-size: 1.1rem;
//   cursor: pointer;
//   flex: 1;
//   transition: all 0.3s ease;

//   &:hover {
//     border-color: #8b5cf6;
//     color: white;
//   }
// `;

// interface PurchaseResult {
//   success: boolean;
//   purchase: {
//     id: string;
//     pass: {
//       name: string;
//       bar: {
//         name: string;
//       };
//     };
//     qrCode: string;
//     expiresAt: string;
//   };
// }

// export default function VIPPaymentSuccess() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [purchase, setPurchase] = useState<PurchaseResult["purchase"] | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);

//   const purchaseId = searchParams.get("purchaseId");

//   useEffect(() => {
//     if (purchaseId) {
//       fetchPurchaseDetails();
//     } else {
//       router.push("/app/vip-pass");
//     }
//   }, [purchaseId, router]);

//   const fetchPurchaseDetails = async () => {
//     try {
//       const response = await fetch(`/api/vip/purchase/${purchaseId}`);
//       if (response.ok) {
//         const purchaseData = await response.json();
//         setPurchase(purchaseData.purchase);
//       } else {
//         throw new Error("Failed to fetch purchase details");
//       }
//     } catch (error) {
//       console.error("Error fetching purchase details:", error);
//       router.push("/app/vip-pass");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewWallet = () => {
//     router.push("/app/vip-pass/vip-wallet");
//   };

//   const handleContinueShopping = () => {
//     router.push("/app/vip-pass");
//   };

//   if (loading) {
//     return (
//       <SuccessContainer>
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               width: "50px",
//               height: "50px",
//               border: "3px solid rgba(139, 92, 246, 0.3)",
//               borderTopColor: "#8b5cf6",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//               margin: "0 auto 1rem",
//             }}
//           />
//           <p style={{ color: "#94a3b8" }}>Loading your purchase...</p>
//         </div>
//       </SuccessContainer>
//     );
//   }

//   if (!purchase) {
//     return (
//       <SuccessContainer>
//         <div style={{ textAlign: "center" }}>
//           <p style={{ color: "#ef4444" }}>Purchase not found</p>
//           <SecondaryButton onClick={handleContinueShopping}>
//             Back to Marketplace
//           </SecondaryButton>
//         </div>
//       </SuccessContainer>
//     );
//   }

//   return (
//     <SuccessContainer>
//       <SuccessCard>
//         <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
//         <Title>Purchase Successful!</Title>
//         <Subtitle>Your VIP pass has been added to your wallet</Subtitle>

//         <div
//           style={{
//             background: "rgba(139, 92, 246, 0.1)",
//             borderRadius: "12px",
//             padding: "1rem",
//             marginBottom: "1.5rem",
//             border: "1px solid rgba(139, 92, 246, 0.3)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "0.5rem",
//             }}
//           >
//             <span style={{ fontSize: "1.2rem" }}>🎪</span>
//             <div>
//               <h3 style={{ color: "#f8fafc", margin: 0, fontSize: "1.1rem" }}>
//                 {purchase.pass.name}
//               </h3>
//               <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.9rem" }}>
//                 {purchase.pass.bar.name}
//               </p>
//             </div>
//           </div>
//         </div>

//         <QRCodeSection>
//           <div
//             style={{
//               background: "#f1f5f9",
//               padding: "2rem",
//               borderRadius: "8px",
//               textAlign: "center",
//               color: "#64748b",
//               marginBottom: "1rem",
//             }}
//           >
//             <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📱</div>
//             <div>QR Code Generated</div>
//           </div>
//           <QRCodeText>{purchase.qrCode}</QRCodeText>
//         </QRCodeSection>

//         <ExpiryInfo>
//           <strong>Expires:</strong>{" "}
//           {new Date(purchase.expiresAt).toLocaleDateString()} at{" "}
//           {new Date(purchase.expiresAt).toLocaleTimeString()}
//         </ExpiryInfo>

//         <ButtonGroup>
//           <SecondaryButton onClick={handleContinueShopping}>
//             Continue Shopping
//           </SecondaryButton>
//           <PrimaryButton onClick={handleViewWallet}>
//             View in Wallet
//           </PrimaryButton>
//         </ButtonGroup>
//       </SuccessCard>

//       <style jsx>{`
//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </SuccessContainer>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";

// ============================================
// KEYFRAMES
// ============================================

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// ============================================
// STYLED COMPONENTS WITH THEME
// ============================================

const SuccessContainer = styled.div`
  padding: 2rem 1rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    margin-left: 240px;
    padding: 2rem 2rem 4rem;
    width: calc(100% - 240px);
  }

  @media (max-width: 767px) {
    padding: 1rem 1rem 6rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const SuccessCard = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #10b981, #0ea5e9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const PurchaseSummary = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const SummaryIcon = styled.span`
  font-size: 1.2rem;
`;

const SummaryInfo = styled.div``;

const SummaryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const SummaryBarName = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const QRCodeSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 1.5rem 0;
`;

const QRCodePlaceholder = styled.div`
  background: #f1f5f9;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: #64748b;
  margin-bottom: 1rem;
`;

const QRCodeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const QRCodeText = styled.div`
  font-family: monospace;
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #475569;
  word-break: break-all;
`;

const ExpiryInfo = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top-color: ${({ theme }) => theme.colors.primaryAccent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const NotFoundContainer = styled.div`
  text-align: center;
`;

const NotFoundText = styled.p`
  color: #ef4444;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// ============================================
// TYPES & INTERFACES
// ============================================

interface PurchaseResult {
  success: boolean;
  purchase: {
    id: string;
    pass: {
      name: string;
      bar: {
        name: string;
      };
    };
    qrCode: string;
    expiresAt: string;
  };
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function VIPPaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchase, setPurchase] = useState<PurchaseResult["purchase"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const purchaseId = searchParams.get("purchaseId");

  useEffect(() => {
    if (purchaseId) {
      fetchPurchaseDetails();
    } else {
      router.push("/app/vip-pass");
    }
  }, [purchaseId, router]);

  const fetchPurchaseDetails = async () => {
    try {
      const response = await fetch(`/api/vip/purchase/${purchaseId}`);
      if (response.ok) {
        const purchaseData = await response.json();
        setPurchase(purchaseData.purchase);
      } else {
        throw new Error("Failed to fetch purchase details");
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
      router.push("/app/vip-pass");
    } finally {
      setLoading(false);
    }
  };

  const handleViewWallet = () => {
    router.push("/app/vip-pass/vip-wallet");
  };

  const handleContinueShopping = () => {
    router.push("/app/vip-pass");
  };

  if (loading) {
    return (
      <SuccessContainer>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading your purchase...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </SuccessContainer>
    );
  }

  if (!purchase) {
    return (
      <SuccessContainer>
        <ContentWrapper>
          <NotFoundContainer>
            <NotFoundText>Purchase not found</NotFoundText>
            <SecondaryButton onClick={handleContinueShopping}>
              Back to Marketplace
            </SecondaryButton>
          </NotFoundContainer>
        </ContentWrapper>
      </SuccessContainer>
    );
  }

  return (
    <SuccessContainer>
      <ContentWrapper>
        <SuccessCard>
          <SuccessIcon>🎉</SuccessIcon>
          <Title>Purchase Successful!</Title>
          <Subtitle>Your VIP pass has been added to your wallet</Subtitle>

          <PurchaseSummary>
            <SummaryHeader>
              <SummaryIcon>🎪</SummaryIcon>
              <SummaryInfo>
                <SummaryTitle>{purchase.pass.name}</SummaryTitle>
                <SummaryBarName>{purchase.pass.bar.name}</SummaryBarName>
              </SummaryInfo>
            </SummaryHeader>
          </PurchaseSummary>

          <QRCodeSection>
            <QRCodePlaceholder>
              <QRCodeIcon>📱</QRCodeIcon>
              <div>QR Code Generated</div>
            </QRCodePlaceholder>
            <QRCodeText>{purchase.qrCode}</QRCodeText>
          </QRCodeSection>

          <ExpiryInfo>
            <strong>Expires:</strong>{" "}
            {new Date(purchase.expiresAt).toLocaleDateString()} at{" "}
            {new Date(purchase.expiresAt).toLocaleTimeString()}
          </ExpiryInfo>

          <ButtonGroup>
            <SecondaryButton onClick={handleContinueShopping}>
              Continue Shopping
            </SecondaryButton>
            <PrimaryButton onClick={handleViewWallet}>
              View in Wallet
            </PrimaryButton>
          </ButtonGroup>
        </SuccessCard>
      </ContentWrapper>
    </SuccessContainer>
  );
}
