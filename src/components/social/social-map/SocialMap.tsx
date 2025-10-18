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
// "use client";
// import styled from "styled-components";
// import { UserSocialProfileWithRelations } from "@/types/social";

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

// const MockMapOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const UserMarker = styled.div<{ $x: number; $y: number; $vibe: string }>`
//   position: absolute;
//   left: ${(props) => props.$x}%;
//   top: ${(props) => props.$y}%;
//   width: 12px;
//   height: 12px;
//   border-radius: 50%;
//   background: ${(props) =>
//     props.$vibe === "PARTY"
//       ? "#ec4899"
//       : props.$vibe === "CHILL"
//       ? "#0ea5e9"
//       : props.$vibe === "NETWORKING"
//       ? "#10b981"
//       : props.$vibe === "ADVENTUROUS"
//       ? "#f59e0b"
//       : "#8b5cf6"};
//   border: 2px solid white;
//   box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
//   cursor: pointer;

//   &:hover {
//     transform: scale(1.3);
//   }

//   &::after {
//     content: "";
//     position: absolute;
//     top: -4px;
//     left: -4px;
//     right: -4px;
//     bottom: -4px;
//     border-radius: 50%;
//     animation: pulse 2s infinite;
//   }

//   @keyframes pulse {
//     0% {
//       box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
//     }
//     70% {
//       box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
//     }
//     100% {
//       box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
//     }
//   }
// `;

// interface SocialMapProps {
//   users: UserSocialProfileWithRelations[];
//   onUserClick: (user: UserSocialProfileWithRelations) => void;
//   currentLocation?: { lat: number; lng: number };
// }

// export default function SocialMap({
//   users,
//   onUserClick,
//   currentLocation,
// }: SocialMapProps) {
//   // Mock positions for demo
//   const mockPositions = [
//     { x: 45, y: 35 }, // Alex
//     { x: 60, y: 50 }, // Mika
//     { x: 35, y: 60 }, // Sarah
//     { x: 70, y: 30 }, // Group of 3
//     { x: 25, y: 25 }, // Emma
//   ];

//   return (
//     <MapContainer>
//       <MockMapOverlay>
//         <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
//         <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
//           Live Social Map
//         </h3>
//         <p>
//           Interactive map showing {users.length} active user
//           {users.length !== 1 ? "s" : ""} nearby
//         </p>

//         {/* Mock user markers */}
//         {users.map((user, index) => (
//           <UserMarker
//             key={user.id}
//             $x={mockPositions[index]?.x || 50}
//             $y={mockPositions[index]?.y || 50}
//             $vibe={user.vibe || "CASUAL"}
//             onClick={() => onUserClick(user)}
//             title={`${user.user.name} - ${user.vibe || "Social"}`}
//           />
//         ))}

//         <div
//           style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#94a3b8" }}
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
//       </MockMapOverlay>
//     </MapContainer>
//   );
// }
"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { UserSocialProfileWithRelations } from "@/types/social";
import L from "leaflet";
import { useEffect } from "react";
interface LeafletIconPrototype {
  _getIconUrl?: (name: string) => string;
}

const iconPrototype = L.Icon.Default.prototype as LeafletIconPrototype;
if (iconPrototype._getIconUrl) {
  delete iconPrototype._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapWrapper = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  height: 500px;
  position: relative;
  overflow: hidden;

  .leaflet-container {
    background: #1e293b;
    border-radius: 12px;
    height: 100%;
    font-family: inherit;
  }

  .leaflet-popup-content-wrapper {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    color: #e2e8f0;
  }

  .leaflet-popup-tip {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .leaflet-popup-content {
    margin: 12px 16px;
    color: #e2e8f0;
  }

  .custom-marker {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(139, 92, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
    }
  }
`;

const MapHeader = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 0.875rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VibeLegend = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #e2e8f0;
  font-size: 0.75rem;
  z-index: 1000;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ConnectButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  width: 100%;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
`;

// Custom icon creation
const createCustomIcon = (vibe: string, isCurrentUser: boolean = false) => {
  const color = getVibeColor(vibe);
  const size = isCurrentUser ? 24 : 20;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isCurrentUser ? "12px" : "0"};
        color: white;
        font-weight: bold;
      ">${isCurrentUser ? "📍" : ""}</div>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const getVibeColor = (vibe: string) => {
  switch (vibe) {
    case "PARTY":
      return "#ec4899";
    case "CHILL":
      return "#0ea5e9";
    case "NETWORKING":
      return "#10b981";
    case "ADVENTUROUS":
      return "#f59e0b";
    default:
      return "#8b5cf6";
  }
};

const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case "PARTY":
      return "🎉";
    case "CHILL":
      return "🧘";
    case "NETWORKING":
      return "💼";
    case "ADVENTUROUS":
      return "🚀";
    default:
      return "💜";
  }
};

const getSocialStatusText = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "Available now";
    case "SOCIAL_MODE":
      return "Looking to connect";
    case "IN_MEETUP":
      return "In a meetup";
    case "OFFLINE":
      return "Offline";
    default:
      return "Available";
  }
};

// Map controller component
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

interface SocialMapProps {
  users: UserSocialProfileWithRelations[];
  onUserClick: (user: UserSocialProfileWithRelations) => void;
  currentLocation?: { lat: number; lng: number };
}

export default function SocialMap({
  users,
  onUserClick,
  currentLocation = { lat: 60.1699, lng: 24.9384 }, // Helsinki coordinates
}: SocialMapProps) {
  const center: [number, number] = [currentLocation.lat, currentLocation.lng];

  // Generate user positions around Helsinki
  const userPositions = users.map((user) => {
    // Use user's actual location if available, otherwise generate around Helsinki
    const lat =
      user.locationLat || currentLocation.lat + (Math.random() - 0.5) * 0.02;
    const lng =
      user.locationLng || currentLocation.lng + (Math.random() - 0.5) * 0.02;
    return { lat, lng, user };
  });

  return (
    <MapWrapper>
      <MapHeader>
        <span>🗺️</span>
        Live Social Map - {users.length} users nearby
      </MapHeader>

      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* Dark theme map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current location marker */}
        <Marker position={center} icon={createCustomIcon("CURRENT", true)}>
          <Popup>
            <div style={{ minWidth: "200px", color: "#e2e8f0" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#f8fafc" }}>
                Your Location
              </h3>
              <p style={{ margin: "0 0 4px 0", color: "#cbd5e1" }}>
                📍 Helsinki City Center
              </p>
              <p style={{ margin: "0", fontSize: "0.75rem", color: "#94a3b8" }}>
                {center[0].toFixed(4)}, {center[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* User markers */}
        {userPositions.map((position) => (
          <Marker
            key={position.user.id}
            position={[position.lat, position.lng]}
            icon={createCustomIcon(position.user.vibe || "CASUAL")}
            eventHandlers={{
              click: (e) => {
                e.originalEvent?.stopPropagation();
                onUserClick(position.user);
              },
            }}
          >
            <Popup>
              <div style={{ minWidth: "220px", color: "#e2e8f0" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#f8fafc" }}>
                  {position.user.user?.name || "Anonymous User"}
                </h3>
                <div style={{ margin: "0 0 8px 0", color: "#cbd5e1" }}>
                  <span style={{ marginRight: "8px" }}>
                    {getVibeEmoji(position.user.vibe || "CASUAL")}{" "}
                    {position.user.vibe || "Social"} Vibe
                  </span>
                </div>
                <div
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  <div>
                    📍 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                  </div>
                  <div>
                    🕒 {getSocialStatusText(position.user.socialStatus)}
                  </div>
                  {position.user.currentBar && (
                    <div>🍻 At {position.user.currentBar.name}</div>
                  )}
                </div>
                <ConnectButton onClick={() => onUserClick(position.user)}>
                  Connect with{" "}
                  {position.user.user?.name?.split(" ")[0] || "User"}
                </ConnectButton>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController center={center} />
      </MapContainer>

      <VibeLegend>
        <LegendItem>
          <LegendDot $color="#ec4899" />
          <span>Party 🎉</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#0ea5e9" />
          <span>Chill 🧘</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#10b981" />
          <span>Networking 💼</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#f59e0b" />
          <span>Adventurous 🚀</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#8b5cf6" />
          <span>Social 💜</span>
        </LegendItem>
      </VibeLegend>
    </MapWrapper>
  );
}
