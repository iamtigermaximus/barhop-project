// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import styled from "styled-components";
// import QRCode from "react-qr-code";

// // TypeScript interfaces
// interface Bar {
//   id: string;
//   name: string;
//   district: string;
//   type: string;
//   imageUrl?: string;
// }

// interface VIPPass {
//   id: string;
//   name: string;
//   type: string;
//   bar: Bar;
// }

// interface UserVIPPass {
//   id: string;
//   qrCode: string;
//   status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
//   purchasedAt: string;
//   expiresAt: string;
//   scannedAt?: string;
//   purchasePriceCents: number;
//   vipPass: VIPPass;
// }

// const WalletContainer = styled.div`
//   padding: 1rem 1rem 10rem;
//   background-color: transparent !important;
//   width: 100%;
//   height: 100%;
//   color: #e2e8f0;

//   @media (max-width: 768px) {
//     padding: 0.5rem;
//     padding: 1rem 1rem 10rem;
//   }

//   @media (max-width: 480px) {
//     padding: 0.5rem;
//     padding: 1rem 1rem 10rem;
//   }
// `;

// const Header = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
//   padding: 0 1rem;
//   background-color: transparent !important;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: 800;
//   margin-bottom: 0.5rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;

//   @media (max-width: 768px) {
//     font-size: 1.75rem;
//   }
// `;

// const Subtitle = styled.p`
//   color: #94a3b8;
//   font-size: 1.1rem;

//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;

// // NEW: Grid layout for passes
// const PassesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
//   gap: 1.5rem;
//   padding: 0 0.5rem;

//   /* 2 columns on medium screens */
//   @media (min-width: 768px) and (max-width: 1023px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   /* 3 columns on large screens */
//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(3, 1fr);
//   }

//   /* Single column on mobile */
//   @media (max-width: 767px) {
//     grid-template-columns: 1fr;
//     gap: 1rem;
//   }
// `;

// // UPDATED: PassCard for grid layout
// const PassCard = styled.div<{ $status: string }>`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid
//     ${(props) =>
//       props.$status === "ACTIVE"
//         ? "rgba(16, 185, 129, 0.3)"
//         : props.$status === "USED"
//         ? "rgba(107, 114, 128, 0.3)"
//         : "rgba(245, 158, 11, 0.3)"};
//   border-radius: 12px;
//   padding: 1.25rem;
//   transition: all 0.3s ease;
//   cursor: ${(props) => (props.$status === "ACTIVE" ? "pointer" : "default")};
//   height: fit-content;

//   &:hover {
//     border-color: ${(props) =>
//       props.$status === "ACTIVE"
//         ? "rgba(16, 185, 129, 0.6)"
//         : props.$status === "USED"
//         ? "rgba(107, 114, 128, 0.6)"
//         : "rgba(245, 158, 11, 0.6)"};
//     transform: ${(props) =>
//       props.$status === "ACTIVE" ? "translateY(-4px)" : "none"};
//     box-shadow: ${(props) =>
//       props.$status === "ACTIVE"
//         ? "0 8px 25px rgba(16, 185, 129, 0.2)"
//         : "0 4px 12px rgba(0, 0, 0, 0.1)"};
//   }

//   @media (max-width: 768px) {
//     padding: 1rem;
//   }
// `;

// // Filter Section
// const FilterSection = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 0.5rem;
//   margin-bottom: 1.5rem;
//   flex-wrap: wrap;
//   padding: 0 0.5rem;
// `;

// const FilterButton = styled.button<{ $isActive: boolean }>`
//   background: ${(props) =>
//     props.$isActive
//       ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
//       : "rgba(30, 41, 59, 0.8)"};
//   border: 1px solid
//     ${(props) => (props.$isActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
//   color: ${(props) => (props.$isActive ? "white" : "#94a3b8")};
//   padding: 0.5rem 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 0.85rem;
//   font-weight: 600;
//   transition: all 0.3s ease;
//   min-width: 80px;

//   &:hover {
//     border-color: #8b5cf6;
//     color: white;
//   }

//   @media (max-width: 480px) {
//     font-size: 0.75rem;
//     padding: 0.4rem 0.8rem;
//     min-width: 70px;
//   }
// `;

// const StatusBadge = styled.div<{ $status: string }>`
//   background: ${(props) =>
//     props.$status === "ACTIVE"
//       ? "rgba(16, 185, 129, 0.2)"
//       : props.$status === "USED"
//       ? "rgba(107, 114, 128, 0.2)"
//       : "rgba(245, 158, 11, 0.2)"};
//   color: ${(props) =>
//     props.$status === "ACTIVE"
//       ? "#10b981"
//       : props.$status === "USED"
//       ? "#94a3b8"
//       : "#f59e0b"};
//   padding: 0.4rem 0.8rem;
//   border-radius: 10px;
//   font-size: 0.75rem;
//   font-weight: 600;
//   display: inline-block;
//   margin-bottom: 1rem;
//   border: 1px solid;
//   border-color: ${(props) =>
//     props.$status === "ACTIVE"
//       ? "rgba(16, 185, 129, 0.3)"
//       : props.$status === "USED"
//       ? "rgba(107, 114, 128, 0.3)"
//       : "rgba(245, 158, 11, 0.3)"};
// `;

// const EmptyState = styled.div`
//   text-align: center;
//   padding: 3rem 1.5rem;
//   background: rgba(30, 41, 59, 0.5);
//   border-radius: 16px;
//   /* border: 1px solid rgba(139, 92, 246, 0.2); */
//   margin: 0 0.5rem;
//   grid-column: 1 / -1; /* Span full width in grid */
//   background-color: transparent !important;

//   @media (max-width: 768px) {
//     padding: 2rem 1rem;
//   }
// `;

// const BrowseButton = styled.button`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   border: none;
//   color: white;
//   padding: 0.75rem 1.5rem;
//   border-radius: 10px;
//   font-weight: 700;
//   font-size: 1rem;
//   cursor: pointer;
//   margin-top: 1rem;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
//   }

//   @media (max-width: 768px) {
//     padding: 0.65rem 1.25rem;
//     font-size: 0.9rem;
//   }
// `;

// const LoadingSpinner = styled.div`
//   width: 40px;
//   height: 40px;
//   border: 3px solid rgba(139, 92, 246, 0.3);
//   border-top: 3px solid #8b5cf6;
//   border-radius: 50%;
//   animation: spin 1s linear infinite;
//   margin: 0 auto 1rem;

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;

// const PassesCount = styled.div`
//   color: #94a3b8;
//   margin-bottom: 1.5rem;
//   text-align: center;
//   font-size: 0.9rem;
//   padding: 0 0.5rem;
// `;

// // Modal Components for QR Code Display
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.8);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
//   padding: 1rem;
// `;

// const ModalContent = styled.div`
//   background: linear-gradient(135deg, #1e293b, #0f172a);
//   border-radius: 20px;
//   padding: 2rem;
//   max-width: 400px;
//   width: 100%;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
//   position: relative;
//   text-align: center;

//   @media (max-width: 480px) {
//     padding: 1.5rem;
//     margin: 1rem;
//   }
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   background: none;
//   border: none;
//   color: #94a3b8;
//   font-size: 1.5rem;
//   cursor: pointer;
//   padding: 0.5rem;
//   border-radius: 8px;
//   transition: all 0.3s ease;

//   &:hover {
//     background: rgba(139, 92, 246, 0.1);
//     color: #8b5cf6;
//   }
// `;

// const QRCodeContainer = styled.div`
//   background: white;
//   padding: 1.5rem;
//   border-radius: 12px;
//   margin: 1.5rem 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   @media (max-width: 480px) {
//     padding: 1rem;
//     margin: 1rem 0;
//   }
// `;

// const PassInfo = styled.div`
//   background: rgba(139, 92, 246, 0.1);
//   border-radius: 10px;
//   padding: 1rem;
//   margin-bottom: 1rem;
//   border: 1px solid rgba(139, 92, 246, 0.2);
// `;

// const PassName = styled.h3`
//   color: #f8fafc;
//   margin: 0 0 0.5rem 0;
//   font-size: 1.2rem;
// `;

// const BarInfo = styled.p`
//   color: #0ea5e9;
//   margin: 0;
//   font-weight: 600;
//   font-size: 0.9rem;
// `;

// const ScanInstruction = styled.p`
//   color: #10b981;
//   font-size: 0.9rem;
//   margin: 1rem 0 0 0;
//   font-weight: 600;
// `;

// type FilterType = "ALL" | "ACTIVE" | "USED" | "EXPIRED";

// export default function VIPWallet() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [passes, setPasses] = useState<UserVIPPass[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<FilterType>("ACTIVE"); // Default to active passes
//   const [selectedPass, setSelectedPass] = useState<UserVIPPass | null>(null);
//   const [showQRModal, setShowQRModal] = useState(false);

//   useEffect(() => {
//     if (session) {
//       fetchUserPasses();
//     }
//   }, [session]);

//   const fetchUserPasses = async () => {
//     try {
//       const response = await fetch("/api/user/vip-passes");
//       if (!response.ok) throw new Error("Failed to fetch passes");

//       const data = await response.json();
//       setPasses(data.passes || []);
//     } catch (error) {
//       console.error("Error fetching VIP passes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter passes based on selected filter
//   const filteredPasses = passes.filter((pass) => {
//     if (filter === "ALL") return true;
//     return pass.status === filter;
//   });

//   // Get counts for each filter type
//   const getPassCount = (status: FilterType) => {
//     if (status === "ALL") return passes.length;
//     return passes.filter((pass) => pass.status === status).length;
//   };

//   const handlePassClick = (pass: UserVIPPass) => {
//     if (pass.status === "ACTIVE") {
//       setSelectedPass(pass);
//       setShowQRModal(true);
//     }
//   };

//   const closeQRModal = () => {
//     setShowQRModal(false);
//     setSelectedPass(null);
//   };

//   const filters: { key: FilterType; label: string; shortLabel: string }[] = [
//     { key: "ALL", label: "All", shortLabel: "All" },
//     { key: "ACTIVE", label: "Active", shortLabel: "Active" },
//     { key: "USED", label: "Used", shortLabel: "Used" },
//     { key: "EXPIRED", label: "Expired", shortLabel: "Expired" },
//   ];

//   if (!session) {
//     return (
//       <WalletContainer>
//         <EmptyState>
//           <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
//           <h2
//             style={{
//               color: "#f8fafc",
//               marginBottom: "1rem",
//               fontSize: "1.5rem",
//             }}
//           >
//             Sign In Required
//           </h2>
//           <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
//             Please sign in to view your VIP passes
//           </p>
//           <BrowseButton onClick={() => router.push("/auth/login")}>
//             Sign In
//           </BrowseButton>
//         </EmptyState>
//       </WalletContainer>
//     );
//   }

//   if (loading) {
//     return (
//       <WalletContainer>
//         <div style={{ textAlign: "center", padding: "3rem" }}>
//           <LoadingSpinner />
//           <p style={{ color: "#94a3b8" }}>Loading your VIP passes...</p>
//         </div>
//       </WalletContainer>
//     );
//   }

//   return (
//     <WalletContainer>
//       <Header>
//         <Title>VIP Wallet</Title>
//         <Subtitle>Your purchased VIP passes</Subtitle>
//       </Header>

//       {passes.length === 0 ? (
//         <EmptyState>
//           {/* <div
//             style={{
//               fontSize: "3rem",
//               marginBottom: "1rem",
//               backgroundColor: "transparent !important",
//             }}
//           >
//             🎫
//           </div> */}
//           <h3
//             style={{
//               color: "#f8fafc",
//               marginBottom: "1rem",
//               fontSize: "1.3rem",
//             }}
//           >
//             No VIP Passes Yet
//           </h3>
//           <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
//             Purchase your first VIP pass from the marketplace to get started!
//           </p>
//           <BrowseButton onClick={() => router.push("/app/vip-pass")}>
//             Browse Passes
//           </BrowseButton>
//         </EmptyState>
//       ) : (
//         <>
//           {/* Filter Section */}
//           <FilterSection>
//             {filters.map(({ key, shortLabel }) => (
//               <FilterButton
//                 key={key}
//                 $isActive={filter === key}
//                 onClick={() => setFilter(key)}
//               >
//                 {shortLabel} ({getPassCount(key)})
//               </FilterButton>
//             ))}
//           </FilterSection>

//           {/* Passes Count */}
//           <PassesCount>
//             Showing {filteredPasses.length} of {passes.length} pass
//             {passes.length !== 1 ? "es" : ""}
//             {filter !== "ALL" && ` (${filter.toLowerCase()})`}
//           </PassesCount>

//           {/* Passes Grid */}
//           {filteredPasses.length === 0 ? (
//             <EmptyState>
//               <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
//                 {filter === "ACTIVE" && "✅"}
//                 {filter === "USED" && "🎫"}
//                 {filter === "EXPIRED" && "⏰"}
//                 {filter === "ALL" && "📭"}
//               </div>
//               <h3
//                 style={{
//                   color: "#f8fafc",
//                   marginBottom: "1rem",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 No {filter.toLowerCase()} passes
//               </h3>
//               <p style={{ color: "#94a3b8" }}>
//                 {filter === "ACTIVE" &&
//                   "You don't have any active passes. Purchase a new pass to get started!"}
//                 {filter === "USED" && "You haven't used any passes yet."}
//                 {filter === "EXPIRED" && "No expired passes found."}
//                 {filter === "ALL" && "No passes found."}
//               </p>
//               {filter !== "ALL" && (
//                 <BrowseButton onClick={() => setFilter("ALL")}>
//                   View All Passes
//                 </BrowseButton>
//               )}
//             </EmptyState>
//           ) : (
//             <PassesGrid>
//               {filteredPasses.map((pass) => (
//                 <PassCard
//                   key={pass.id}
//                   $status={pass.status}
//                   onClick={() => handlePassClick(pass)}
//                 >
//                   <StatusBadge $status={pass.status}>
//                     {pass.status === "ACTIVE"
//                       ? "Active"
//                       : pass.status === "USED"
//                       ? "Used"
//                       : "Expired"}
//                   </StatusBadge>

//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "0.75rem",
//                     }}
//                   >
//                     {/* Pass Header with QR and Basic Info */}
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "0.75rem",
//                         alignItems: "flex-start",
//                       }}
//                     >
//                       {/* Small QR Code Preview */}
//                       <div
//                         style={{
//                           background: "white",
//                           padding: "0.5rem",
//                           borderRadius: "8px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         <QRCode
//                           value={pass.qrCode}
//                           size={50}
//                           style={{
//                             height: "auto",
//                             maxWidth: "100%",
//                             width: "100%",
//                           }}
//                         />
//                       </div>

//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <h3
//                           style={{
//                             margin: "0 0 0.25rem 0",
//                             color: "#f8fafc",
//                             fontSize: "1rem",
//                             fontWeight: "700",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {pass.vipPass.name}
//                         </h3>
//                         <p
//                           style={{
//                             color: "#0ea5e9",
//                             margin: "0 0 0.25rem 0",
//                             fontWeight: "600",
//                             fontSize: "0.85rem",
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           }}
//                         >
//                           {pass.vipPass.bar.name}
//                         </p>
//                         <p
//                           style={{
//                             color: "#94a3b8",
//                             margin: 0,
//                             fontSize: "0.75rem",
//                           }}
//                         >
//                           {pass.vipPass.bar.district}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Pass Details */}
//                     <div
//                       style={{
//                         color: "#94a3b8",
//                         fontSize: "0.8rem",
//                         lineHeight: "1.4",
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: "0.5rem",
//                         paddingTop: "0.5rem",
//                         borderTop: "1px solid rgba(255, 255, 255, 0.1)",
//                       }}
//                     >
//                       <div>
//                         <strong>Type:</strong>
//                       </div>
//                       <div>{pass.vipPass.type.replace("_", " ")}</div>

//                       <div>
//                         <strong>Purchased:</strong>
//                       </div>
//                       <div>
//                         {new Date(pass.purchasedAt).toLocaleDateString()}
//                       </div>

//                       <div>
//                         <strong>Expires:</strong>
//                       </div>
//                       <div>{new Date(pass.expiresAt).toLocaleDateString()}</div>

//                       <div>
//                         <strong>Price:</strong>
//                       </div>
//                       <div>€{(pass.purchasePriceCents / 100).toFixed(2)}</div>

//                       {pass.scannedAt && (
//                         <>
//                           <div>
//                             <strong>Used:</strong>
//                           </div>
//                           <div>
//                             {new Date(pass.scannedAt).toLocaleDateString()}
//                           </div>
//                         </>
//                       )}
//                     </div>

//                     {pass.status === "ACTIVE" && (
//                       <div
//                         style={{
//                           padding: "0.75rem",
//                           background: "rgba(16, 185, 129, 0.1)",
//                           borderRadius: "8px",
//                           border: "1px solid rgba(16, 185, 129, 0.2)",
//                           color: "#10b981",
//                           fontSize: "0.8rem",
//                           textAlign: "center",
//                           marginTop: "0.5rem",
//                         }}
//                       >
//                         <strong>Tap to show QR code</strong>
//                         <div
//                           style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}
//                         >
//                           Show at {pass.vipPass.bar.name}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </PassCard>
//               ))}
//             </PassesGrid>
//           )}
//         </>
//       )}

//       {/* QR Code Modal */}
//       {showQRModal && selectedPass && (
//         <ModalOverlay onClick={closeQRModal}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <CloseButton onClick={closeQRModal}>×</CloseButton>

//             <PassInfo>
//               <PassName>{selectedPass.vipPass.name}</PassName>
//               <BarInfo>
//                 {selectedPass.vipPass.bar.name} •{" "}
//                 {selectedPass.vipPass.bar.district}
//               </BarInfo>
//               <div
//                 style={{
//                   color: "#94a3b8",
//                   fontSize: "0.8rem",
//                   marginTop: "0.5rem",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   gap: "1rem",
//                 }}
//               >
//                 <span>
//                   <strong>Type:</strong>{" "}
//                   {selectedPass.vipPass.type.replace("_", " ")}
//                 </span>
//                 <span>
//                   <strong>Purchased:</strong>{" "}
//                   {new Date(selectedPass.purchasedAt).toLocaleDateString()}
//                 </span>
//               </div>
//             </PassInfo>

//             <QRCodeContainer>
//               <QRCode
//                 value={selectedPass.qrCode}
//                 size={200}
//                 style={{ height: "auto", maxWidth: "100%", width: "100%" }}
//               />
//             </QRCodeContainer>

//             <ScanInstruction>
//               Show this QR code at the entrance for VIP access
//             </ScanInstruction>

//             <div
//               style={{
//                 color: "#94a3b8",
//                 fontSize: "0.8rem",
//                 marginTop: "1rem",
//               }}
//             >
//               Expires: {new Date(selectedPass.expiresAt).toLocaleDateString()}
//             </div>
//           </ModalContent>
//         </ModalOverlay>
//       )}
//     </WalletContainer>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import QRCode from "react-qr-code";

// ============================================
// KEYFRAMES
// ============================================

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// ============================================
// TYPES & INTERFACES
// ============================================

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

type FilterType = "ALL" | "ACTIVE" | "USED" | "EXPIRED";

// ============================================
// STYLED COMPONENTS WITH THEME
// ============================================

const WalletContainer = styled.div`
  padding: 2rem 1rem 10rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primaryBackground};

  @media (min-width: 768px) {
    margin-left: 240px;
    padding: 2rem 2rem 8rem;
    width: calc(100% - 240px);
  }

  @media (max-width: 767px) {
    padding: 1rem 1rem 6rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.dm};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

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
      : props.theme.colors.secondaryBackground};
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.theme.colors.primaryAccent
        : props.theme.colors.border};
  color: ${(props) =>
    props.$isActive ? "white" : props.theme.colors.textMuted};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 80px;
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryAccent};
    color: white;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    min-width: 70px;
  }
`;

const PassesCount = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  padding: 0 0.5rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PassCard = styled.div<{ $status: string }>`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border: 1px solid
    ${(props) =>
      props.$status === "ACTIVE"
        ? "rgba(16, 185, 129, 0.3)"
        : props.$status === "USED"
          ? "rgba(107, 114, 128, 0.3)"
          : "rgba(245, 158, 11, 0.3)"};
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.$status === "ACTIVE" ? "pointer" : "default")};
  height: fit-content;

  &:hover {
    border-color: ${(props) =>
      props.$status === "ACTIVE"
        ? "rgba(16, 185, 129, 0.6)"
        : props.$status === "USED"
          ? "rgba(107, 114, 128, 0.6)"
          : "rgba(245, 158, 11, 0.6)"};
    transform: ${(props) =>
      props.$status === "ACTIVE" ? "translateY(-4px)" : "none"};
    box-shadow: ${(props) =>
      props.$status === "ACTIVE"
        ? "0 8px 25px rgba(16, 185, 129, 0.2)"
        : "none"};
  }

  @media (max-width: 768px) {
    padding: 1rem;
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
        ? props.theme.colors.textMuted
        : "#f59e0b"};
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
  border: 1px solid;
  border-color: ${(props) =>
    props.$status === "ACTIVE"
      ? "rgba(16, 185, 129, 0.3)"
      : props.$status === "USED"
        ? "rgba(107, 114, 128, 0.3)"
        : "rgba(245, 158, 11, 0.3)"};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const PassContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PassHeaderRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const QRPreview = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  flex-shrink: 0;
`;

const PassInfoWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const PassName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarName = styled.p`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarDistrict = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassDetailsGrid = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  line-height: 1.4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ActivePassNotice = styled.div`
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
  cursor: pointer;

  strong {
    font-weight: 700;
  }
`;

const NoticeSmall = styled.div`
  font-size: 0.7rem;
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 16px;
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
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
  font-family: ${({ theme }) => theme.fonts.dm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid ${({ theme }) => theme.colors.primaryAccent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBackground};
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: center;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: ${({ theme }) => theme.colors.primaryAccent};
  }
`;

const PassInfoModal = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PassNameModal = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const BarInfoModal = styled.p`
  color: ${({ theme }) => theme.colors.secondaryAccent};
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const PassMetaRow = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  strong {
    color: ${({ theme }) => theme.colors.textSecondary};
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
  }
`;

const ScanInstruction = styled.div`
  color: #10b981;
  font-size: 0.9rem;
  margin: 1rem 0 0 0;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

const ExpiryText = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  margin-top: 1rem;
  font-family: ${({ theme }) => theme.fonts.dm};
`;

// ============================================
// MAIN COMPONENT
// ============================================

export default function VIPWallet() {
  const { data: session } = useSession();
  const router = useRouter();
  const [passes, setPasses] = useState<UserVIPPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ACTIVE");
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

  const filteredPasses = passes.filter((pass) => {
    if (filter === "ALL") return true;
    return pass.status === filter;
  });

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
        <ContentWrapper>
          <EmptyState>
            <EmptyIcon>🔐</EmptyIcon>
            <EmptyTitle>Sign In Required</EmptyTitle>
            <EmptyText>Please sign in to view your VIP passes</EmptyText>
            <BrowseButton onClick={() => router.push("/auth/login")}>
              Sign In
            </BrowseButton>
          </EmptyState>
        </ContentWrapper>
      </WalletContainer>
    );
  }

  if (loading) {
    return (
      <WalletContainer>
        <ContentWrapper>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading your VIP passes...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </WalletContainer>
    );
  }

  return (
    <WalletContainer>
      <ContentWrapper>
        <Header>
          <Title>VIP Wallet</Title>
          <Subtitle>Your purchased VIP passes</Subtitle>
        </Header>

        {passes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎫</EmptyIcon>
            <EmptyTitle>No VIP Passes Yet</EmptyTitle>
            <EmptyText>
              Purchase your first VIP pass from the marketplace to get started!
            </EmptyText>
            <BrowseButton onClick={() => router.push("/app/vip-pass")}>
              Browse Passes
            </BrowseButton>
          </EmptyState>
        ) : (
          <>
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

            <PassesCount>
              Showing {filteredPasses.length} of {passes.length} pass
              {passes.length !== 1 ? "es" : ""}
              {filter !== "ALL" && ` (${filter.toLowerCase()})`}
            </PassesCount>

            {filteredPasses.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  {filter === "ACTIVE" && "✅"}
                  {filter === "USED" && "🎫"}
                  {filter === "EXPIRED" && "⏰"}
                  {filter === "ALL" && "📭"}
                </EmptyIcon>
                <EmptyTitle>No {filter.toLowerCase()} passes</EmptyTitle>
                <EmptyText>
                  {filter === "ACTIVE" &&
                    "You don't have any active passes. Purchase a new pass to get started!"}
                  {filter === "USED" && "You haven't used any passes yet."}
                  {filter === "EXPIRED" && "No expired passes found."}
                  {filter === "ALL" && "No passes found."}
                </EmptyText>
                {filter !== "ALL" && (
                  <BrowseButton onClick={() => setFilter("ALL")}>
                    View All Passes
                  </BrowseButton>
                )}
              </EmptyState>
            ) : (
              <PassesGrid>
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

                    <PassContent>
                      <PassHeaderRow>
                        <QRPreview>
                          <QRCode
                            value={pass.qrCode}
                            size={50}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                          />
                        </QRPreview>

                        <PassInfoWrapper>
                          <PassName>{pass.vipPass.name}</PassName>
                          <BarName>{pass.vipPass.bar.name}</BarName>
                          <BarDistrict>{pass.vipPass.bar.district}</BarDistrict>
                        </PassInfoWrapper>
                      </PassHeaderRow>

                      <PassDetailsGrid>
                        <DetailLabel>Type:</DetailLabel>
                        <DetailValue>
                          {pass.vipPass.type.replace("_", " ")}
                        </DetailValue>

                        <DetailLabel>Purchased:</DetailLabel>
                        <DetailValue>
                          {new Date(pass.purchasedAt).toLocaleDateString()}
                        </DetailValue>

                        <DetailLabel>Expires:</DetailLabel>
                        <DetailValue>
                          {new Date(pass.expiresAt).toLocaleDateString()}
                        </DetailValue>

                        <DetailLabel>Price:</DetailLabel>
                        <DetailValue>
                          €{(pass.purchasePriceCents / 100).toFixed(2)}
                        </DetailValue>

                        {pass.scannedAt && (
                          <>
                            <DetailLabel>Used:</DetailLabel>
                            <DetailValue>
                              {new Date(pass.scannedAt).toLocaleDateString()}
                            </DetailValue>
                          </>
                        )}
                      </PassDetailsGrid>

                      {pass.status === "ACTIVE" && (
                        <ActivePassNotice>
                          <strong>Tap to show QR code</strong>
                          <NoticeSmall>
                            Show at {pass.vipPass.bar.name}
                          </NoticeSmall>
                        </ActivePassNotice>
                      )}
                    </PassContent>
                  </PassCard>
                ))}
              </PassesGrid>
            )}
          </>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedPass && (
          <ModalOverlay onClick={closeQRModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeQRModal}>×</CloseButton>

              <PassInfoModal>
                <PassNameModal>{selectedPass.vipPass.name}</PassNameModal>
                <BarInfoModal>
                  {selectedPass.vipPass.bar.name} •{" "}
                  {selectedPass.vipPass.bar.district}
                </BarInfoModal>
                <PassMetaRow>
                  <span>
                    <strong>Type:</strong>{" "}
                    {selectedPass.vipPass.type.replace("_", " ")}
                  </span>
                  <span>
                    <strong>Purchased:</strong>{" "}
                    {new Date(selectedPass.purchasedAt).toLocaleDateString()}
                  </span>
                </PassMetaRow>
              </PassInfoModal>

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

              <ExpiryText>
                Expires: {new Date(selectedPass.expiresAt).toLocaleDateString()}
              </ExpiryText>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </WalletContainer>
  );
}
