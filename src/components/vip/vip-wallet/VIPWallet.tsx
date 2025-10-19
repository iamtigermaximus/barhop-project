"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import QRCode from "react-qr-code";

// TypeScript interfaces
interface Bar {
  id: string;
  name: string;
  district: string;
  type: string;
  imageUrl?: string;
}

interface VIPPass {
  id: string;
  name: string;
  type: string;
  bar: Bar;
}

interface UserVIPPass {
  id: string;
  qrCode: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
  purchasedAt: string;
  expiresAt: string;
  scannedAt?: string;
  purchasePriceCents: number;
  vipPass: VIPPass;
}

const WalletContainer = styled.div`
  padding: 1rem;
  background: #0f172a;
  min-height: 100vh;
  color: #e2e8f0;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Filter Section
const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 0 0.5rem;
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  background: ${(props) =>
    props.$isActive
      ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
      : "rgba(30, 41, 59, 0.8)"};
  border: 1px solid
    ${(props) => (props.$isActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
  color: ${(props) => (props.$isActive ? "white" : "#94a3b8")};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 70px;

  &:hover {
    border-color: #8b5cf6;
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
    min-width: 60px;
  }
`;

const PassCard = styled.div<{ $status: string }>`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid
    ${(props) =>
      props.$status === "ACTIVE"
        ? "rgba(16, 185, 129, 0.3)"
        : props.$status === "USED"
        ? "rgba(107, 114, 128, 0.3)"
        : "rgba(245, 158, 11, 0.3)"};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.$status === "ACTIVE" ? "pointer" : "default")};

  &:hover {
    border-color: ${(props) =>
      props.$status === "ACTIVE"
        ? "rgba(16, 185, 129, 0.6)"
        : props.$status === "USED"
        ? "rgba(107, 114, 128, 0.6)"
        : "rgba(245, 158, 11, 0.6)"};
    transform: ${(props) =>
      props.$status === "ACTIVE" ? "translateY(-2px)" : "none"};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  background: ${(props) =>
    props.$status === "ACTIVE"
      ? "rgba(16, 185, 129, 0.2)"
      : props.$status === "USED"
      ? "rgba(107, 114, 128, 0.2)"
      : "rgba(245, 158, 11, 0.2)"};
  color: ${(props) =>
    props.$status === "ACTIVE"
      ? "#10b981"
      : props.$status === "USED"
      ? "#94a3b8"
      : "#f59e0b"};
  padding: 0.3rem 0.7rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.75rem;
  border: 1px solid;
  border-color: ${(props) =>
    props.$status === "ACTIVE"
      ? "rgba(16, 185, 129, 0.3)"
      : props.$status === "USED"
      ? "rgba(107, 114, 128, 0.3)"
      : "rgba(245, 158, 11, 0.3)"};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const BrowseButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PassesCount = styled.div`
  color: #94a3b8;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  padding: 0 0.5rem;
`;

// Modal Components for QR Code Display
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: center;

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 480px) {
    padding: 1rem;
    margin: 1rem 0;
  }
`;

const PassInfo = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const PassName = styled.h3`
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const BarInfo = styled.p`
  color: #0ea5e9;
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ScanInstruction = styled.p`
  color: #10b981;
  font-size: 0.9rem;
  margin: 1rem 0 0 0;
  font-weight: 600;
`;

type FilterType = "ALL" | "ACTIVE" | "USED" | "EXPIRED";

export default function VIPWallet() {
  const { data: session } = useSession();
  const router = useRouter();
  const [passes, setPasses] = useState<UserVIPPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ACTIVE"); // Default to active passes
  const [selectedPass, setSelectedPass] = useState<UserVIPPass | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserPasses();
    }
  }, [session]);

  const fetchUserPasses = async () => {
    try {
      const response = await fetch("/api/user/vip-passes");
      if (!response.ok) throw new Error("Failed to fetch passes");

      const data = await response.json();
      setPasses(data.passes || []);
    } catch (error) {
      console.error("Error fetching VIP passes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter passes based on selected filter
  const filteredPasses = passes.filter((pass) => {
    if (filter === "ALL") return true;
    return pass.status === filter;
  });

  // Get counts for each filter type
  const getPassCount = (status: FilterType) => {
    if (status === "ALL") return passes.length;
    return passes.filter((pass) => pass.status === status).length;
  };

  const handlePassClick = (pass: UserVIPPass) => {
    if (pass.status === "ACTIVE") {
      setSelectedPass(pass);
      setShowQRModal(true);
    }
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedPass(null);
  };

  const filters: { key: FilterType; label: string; shortLabel: string }[] = [
    { key: "ALL", label: "All", shortLabel: "All" },
    { key: "ACTIVE", label: "Active", shortLabel: "Active" },
    { key: "USED", label: "Used", shortLabel: "Used" },
    { key: "EXPIRED", label: "Expired", shortLabel: "Expired" },
  ];

  if (!session) {
    return (
      <WalletContainer>
        <EmptyState>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h2
            style={{
              color: "#f8fafc",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          >
            Sign In Required
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Please sign in to view your VIP passes
          </p>
          <BrowseButton onClick={() => router.push("/auth/login")}>
            Sign In
          </BrowseButton>
        </EmptyState>
      </WalletContainer>
    );
  }

  if (loading) {
    return (
      <WalletContainer>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <LoadingSpinner />
          <p style={{ color: "#94a3b8" }}>Loading your VIP passes...</p>
        </div>
      </WalletContainer>
    );
  }

  return (
    <WalletContainer>
      <Header>
        <Title>VIP Wallet</Title>
        <Subtitle>Your purchased VIP passes</Subtitle>
      </Header>

      {passes.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎫</div>
          <h3
            style={{
              color: "#f8fafc",
              marginBottom: "1rem",
              fontSize: "1.3rem",
            }}
          >
            No VIP Passes Yet
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            Purchase your first VIP pass from the marketplace to get started!
          </p>
          <BrowseButton onClick={() => router.push("/marketplace")}>
            Browse Marketplace
          </BrowseButton>
        </EmptyState>
      ) : (
        <>
          {/* Filter Section */}
          <FilterSection>
            {filters.map(({ key, shortLabel }) => (
              <FilterButton
                key={key}
                $isActive={filter === key}
                onClick={() => setFilter(key)}
              >
                {shortLabel} ({getPassCount(key)})
              </FilterButton>
            ))}
          </FilterSection>

          {/* Passes Count */}
          <PassesCount>
            Showing {filteredPasses.length} of {passes.length} pass
            {passes.length !== 1 ? "es" : ""}
            {filter !== "ALL" && ` (${filter.toLowerCase()})`}
          </PassesCount>

          {/* Passes List */}
          {filteredPasses.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {filter === "ACTIVE" && "✅"}
                {filter === "USED" && "🎫"}
                {filter === "EXPIRED" && "⏰"}
                {filter === "ALL" && "📭"}
              </div>
              <h3
                style={{
                  color: "#f8fafc",
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                }}
              >
                No {filter.toLowerCase()} passes
              </h3>
              <p style={{ color: "#94a3b8" }}>
                {filter === "ACTIVE" &&
                  "You don't have any active passes. Purchase a new pass to get started!"}
                {filter === "USED" && "You haven't used any passes yet."}
                {filter === "EXPIRED" && "No expired passes found."}
                {filter === "ALL" && "No passes found."}
              </p>
              {filter !== "ALL" && (
                <BrowseButton onClick={() => setFilter("ALL")}>
                  View All Passes
                </BrowseButton>
              )}
            </EmptyState>
          ) : (
            <div>
              {filteredPasses.map((pass) => (
                <PassCard
                  key={pass.id}
                  $status={pass.status}
                  onClick={() => handlePassClick(pass)}
                >
                  <StatusBadge $status={pass.status}>
                    {pass.status === "ACTIVE"
                      ? "Active"
                      : pass.status === "USED"
                      ? "Used"
                      : "Expired"}
                  </StatusBadge>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Small QR Code Preview */}
                    <div
                      style={{
                        background: "white",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <QRCode
                        value={pass.qrCode}
                        size={60}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {" "}
                      {/* minWidth: 0 for text truncation */}
                      <h3
                        style={{
                          margin: "0 0 0.25rem 0",
                          color: "#f8fafc",
                          fontSize: "1rem",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pass.vipPass.name}
                      </h3>
                      <p
                        style={{
                          color: "#0ea5e9",
                          margin: "0 0 0.25rem 0",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pass.vipPass.bar.name} • {pass.vipPass.bar.district}
                      </p>
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                          lineHeight: "1.4",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.25rem",
                        }}
                      >
                        <div>
                          <strong>Type:</strong>{" "}
                          {pass.vipPass.type.replace("_", " ")}
                        </div>
                        <div>
                          <strong>Purchased:</strong>{" "}
                          {new Date(pass.purchasedAt).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Expires:</strong>{" "}
                          {new Date(pass.expiresAt).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Price:</strong> €
                          {(pass.purchasePriceCents / 100).toFixed(2)}
                        </div>
                        {pass.scannedAt && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <strong>Used:</strong>{" "}
                            {new Date(pass.scannedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {pass.status === "ACTIVE" && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem",
                        background: "rgba(16, 185, 129, 0.1)",
                        borderRadius: "6px",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        color: "#10b981",
                        fontSize: "0.8rem",
                      }}
                    >
                      <strong>Tap to show QR code</strong> - Show at{" "}
                      {pass.vipPass.bar.name}
                    </div>
                  )}
                </PassCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedPass && (
        <ModalOverlay onClick={closeQRModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeQRModal}>×</CloseButton>

            <PassInfo>
              <PassName>{selectedPass.vipPass.name}</PassName>
              <BarInfo>
                {selectedPass.vipPass.bar.name} •{" "}
                {selectedPass.vipPass.bar.district}
              </BarInfo>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <span>
                  <strong>Type:</strong>{" "}
                  {selectedPass.vipPass.type.replace("_", " ")}
                </span>
                <span>
                  <strong>Purchased:</strong>{" "}
                  {new Date(selectedPass.purchasedAt).toLocaleDateString()}
                </span>
              </div>
            </PassInfo>

            <QRCodeContainer>
              <QRCode
                value={selectedPass.qrCode}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </QRCodeContainer>

            <ScanInstruction>
              Show this QR code at the entrance for VIP access
            </ScanInstruction>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                marginTop: "1rem",
              }}
            >
              Expires: {new Date(selectedPass.expiresAt).toLocaleDateString()}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </WalletContainer>
  );
}
