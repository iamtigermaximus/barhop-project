// "use client";
// import styled from "styled-components";

// const MapContainer = styled.div`
//   background: rgba(30, 41, 59, 0.6);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   height: 500px;
//   position: relative;
//   overflow: hidden;
// `;

// const MapPlaceholder = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100%;
//   color: #e2e8f0;
//   text-align: center;
//   padding: 2rem;
// `;

// interface SocialMapProps {
//   users: any[];
//   onUserClick: (user: any) => void;
//   currentLocation?: { lat: number; lng: number };
// }

// export default function SocialMap({
//   users,
//   onUserClick,
//   currentLocation,
// }: SocialMapProps) {
//   return (
//     <MapContainer>
//       <MapPlaceholder>
//         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
//         <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
//           Live Social Map
//         </h3>
//         <p>
//           Interactive map showing {users.length} active user
//           {users.length !== 1 ? "s" : ""} nearby
//         </p>
//         <div
//           style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#94a3b8" }}
//         >
//           <p>🔘 Blue dots show users in Social Mode</p>
//           <p>👥 Group markers show friend groups</p>
//           <p>🔥 Hot zones indicate popular spots</p>
//         </div>
//         {currentLocation && (
//           <p
//             style={{
//               marginTop: "0.5rem",
//               fontSize: "0.75rem",
//               color: "#64748b",
//             }}
//           >
//             Your location: {currentLocation.lat.toFixed(4)},{" "}
//             {currentLocation.lng.toFixed(4)}
//           </p>
//         )}
//       </MapPlaceholder>
//     </MapContainer>
//   );
// }
"use client";
import styled from "styled-components";
import { UserSocialProfileWithRelations } from "@/types/social";

const MapContainer = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  height: 500px;
  position: relative;
  overflow: hidden;
`;

const MapPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e2e8f0;
  text-align: center;
  padding: 2rem;
`;

const MockMapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserMarker = styled.div<{ $x: number; $y: number; $vibe: string }>`
  position: absolute;
  left: ${(props) => props.$x}%;
  top: ${(props) => props.$y}%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) =>
    props.$vibe === "PARTY"
      ? "#ec4899"
      : props.$vibe === "CHILL"
      ? "#0ea5e9"
      : props.$vibe === "NETWORKING"
      ? "#10b981"
      : props.$vibe === "ADVENTUROUS"
      ? "#f59e0b"
      : "#8b5cf6"};
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
  cursor: pointer;

  &:hover {
    transform: scale(1.3);
  }

  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
    }
  }
`;

interface SocialMapProps {
  users: UserSocialProfileWithRelations[];
  onUserClick: (user: UserSocialProfileWithRelations) => void;
  currentLocation?: { lat: number; lng: number };
}

export default function SocialMap({
  users,
  onUserClick,
  currentLocation,
}: SocialMapProps) {
  // Mock positions for demo
  const mockPositions = [
    { x: 45, y: 35 }, // Alex
    { x: 60, y: 50 }, // Mika
    { x: 35, y: 60 }, // Sarah
    { x: 70, y: 30 }, // Group of 3
    { x: 25, y: 25 }, // Emma
  ];

  return (
    <MapContainer>
      <MockMapOverlay>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
        <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
          Live Social Map
        </h3>
        <p>
          Interactive map showing {users.length} active user
          {users.length !== 1 ? "s" : ""} nearby
        </p>

        {/* Mock user markers */}
        {users.map((user, index) => (
          <UserMarker
            key={user.id}
            $x={mockPositions[index]?.x || 50}
            $y={mockPositions[index]?.y || 50}
            $vibe={user.vibe || "CASUAL"}
            onClick={() => onUserClick(user)}
            title={`${user.user.name} - ${user.vibe || "Social"}`}
          />
        ))}

        <div
          style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#94a3b8" }}
        >
          <p>🔘 Blue dots show users in Social Mode</p>
          <p>👥 Group markers show friend groups</p>
          <p>🔥 Hot zones indicate popular spots</p>
        </div>
        {currentLocation && (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "#64748b",
            }}
          >
            Your location: {currentLocation.lat.toFixed(4)},{" "}
            {currentLocation.lng.toFixed(4)}
          </p>
        )}
      </MockMapOverlay>
    </MapContainer>
  );
}
