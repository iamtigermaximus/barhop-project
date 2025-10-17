// "use client";
// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
// import UserList from "./user-list/UserList";
// import { UserSocialProfileWithRelations } from "@/types/social";

// const SocialContainer = styled.div`
//   padding: 2rem 1rem;
//   background: #0f172a;
//   min-height: 100vh;
// `;

// const SocialHeader = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin-bottom: 1rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Subtitle = styled.p`
//   color: #e2e8f0;
//   font-size: 1.125rem;
//   max-width: 600px;
//   margin: 0 auto;
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #94a3b8;
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(239, 68, 68, 0.1);
//   border: 1px solid rgba(239, 68, 68, 0.3);
//   border-radius: 8px;
//   color: #ef4444;
//   margin: 1rem 0;
// `;

// interface LocationData {
//   locationLat?: number;
//   locationLng?: number;
// }

// interface NearbyUsersData {
//   users: UserSocialProfileWithRelations[];
// }

// export default function SocialPage() {
//   const [isSocialMode, setIsSocialMode] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);

//   const toggleSocialMode = async (status: boolean) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Get user location if available
//       let locationData: LocationData = {};
//       if (status && navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>(
//             (resolve, reject) => {
//               navigator.geolocation.getCurrentPosition(resolve, reject, {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0,
//               });
//             }
//           );

//           locationData = {
//             locationLat: position.coords.latitude,
//             locationLng: position.coords.longitude,
//           };

//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         } catch (geoError) {
//           console.warn("Geolocation failed:", geoError);
//         }
//       }

//       const response = await fetch("/api/social/status", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           isActive: status,
//           ...locationData,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update social status");
//       }

//       setIsSocialMode(status);

//       if (status) {
//         await fetchNearbyUsers();
//       } else {
//         setActiveUsers([]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;

//     setIsLoadingUsers(true);
//     try {
//       const url = currentLocation
//         ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=1000`
//         : "/api/social/status";

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch nearby users");
//       }

//       const data: NearbyUsersData = await response.json();
//       setActiveUsers(data.users);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch nearby users"
//       );
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   const handleHopIn = async (user: UserSocialProfileWithRelations) => {
//     try {
//       const response = await fetch("/api/social/hop-in", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           targetUserId: user.userId,
//           barId: user.currentBarId,
//           message: `Hey ${user.user.name || "there"}! I'd like to join you.`,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send hop in request");
//       }

//       alert("Hop in request sent! They'll receive a notification.");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to send hop in request"
//       );
//     }
//   };

//   useEffect(() => {
//     if (isSocialMode) {
//       fetchNearbyUsers();
//       const interval = setInterval(fetchNearbyUsers, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isSocialMode, currentLocation]);

//   return (
//     <SocialContainer>
//       <SocialHeader>
//         <Title>Social Mode</Title>
//         <Subtitle>
//           See who&apos;s out tonight and join spontaneous meetups. Toggle your
//           status to let others know you&apos;re open to connecting.
//         </Subtitle>
//       </SocialHeader>

//       <div
//         style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
//       >
//         <SocialToggle
//           isActive={isSocialMode}
//           onToggle={toggleSocialMode}
//           isLoading={isLoading}
//         />
//       </div>

//       {error && <ErrorState>{error}</ErrorState>}

//       {isLoadingUsers && isSocialMode && (
//         <LoadingState>
//           <p>Finding active users near you...</p>
//         </LoadingState>
//       )}

//       {isSocialMode && !isLoadingUsers && (
//         <>
//           <SocialMap
//             users={activeUsers}
//             onUserClick={handleHopIn}
//             currentLocation={currentLocation || undefined}
//           />
//           <UserList
//             users={activeUsers}
//             onHopIn={handleHopIn}
//             isLoading={isLoading}
//           />
//         </>
//       )}
//     </SocialContainer>
//   );
// }

// NEW WORKING CODE
// "use client";
// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
// import UserList from "./user-list/UserList";
// import { UserSocialProfileWithRelations } from "@/types/social";
// import { mockUsers, mockCurrentLocation } from "@/lib/mockSocialData";

// const SocialContainer = styled.div`
//   padding: 2rem 1rem;
//   background: #0f172a;
//   min-height: 100vh;
// `;

// const SocialHeader = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin-bottom: 1rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Subtitle = styled.p`
//   color: #e2e8f0;
//   font-size: 1.125rem;
//   max-width: 600px;
//   margin: 0 auto;
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #94a3b8;
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(239, 68, 68, 0.1);
//   border: 1px solid rgba(239, 68, 68, 0.3);
//   border-radius: 8px;
//   color: #ef4444;
//   margin: 1rem 0;
// `;

// const MockDataNotice = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(139, 92, 246, 0.1);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   color: #8b5cf6;
//   margin: 1rem 0;
//   font-size: 0.875rem;
// `;

// interface LocationData {
//   locationLat?: number;
//   locationLng?: number;
// }

// interface NearbyUsersData {
//   users: UserSocialProfileWithRelations[];
// }

// // Add this environment variable check
// const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// export default function Social() {
//   const [isSocialMode, setIsSocialMode] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);

//   const toggleSocialMode = async (status: boolean) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Get user location if available
//       let locationData: LocationData = {};
//       if (status && navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>(
//             (resolve, reject) => {
//               navigator.geolocation.getCurrentPosition(resolve, reject, {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0,
//               });
//             }
//           );

//           locationData = {
//             locationLat: position.coords.latitude,
//             locationLng: position.coords.longitude,
//           };

//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         } catch (geoError) {
//           console.warn("Geolocation failed:", geoError);
//           // Use mock location if geolocation fails
//           setCurrentLocation(mockCurrentLocation);
//         }
//       } else if (status) {
//         // Use mock location when toggling on without geolocation
//         setCurrentLocation(mockCurrentLocation);
//       }

//       if (USE_MOCK_DATA) {
//         // Mock API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         console.log("Mock: Social mode", status ? "activated" : "deactivated");
//       } else {
//         const response = await fetch("/api/social/status", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             isActive: status,
//             ...locationData,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to update social status");
//         }
//       }

//       setIsSocialMode(status);

//       if (status) {
//         await fetchNearbyUsers();
//       } else {
//         setActiveUsers([]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;

//     setIsLoadingUsers(true);
//     try {
//       if (USE_MOCK_DATA) {
//         // Mock API call with delay
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         setActiveUsers(mockUsers);
//       } else {
//         const url = currentLocation
//           ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=1000`
//           : "/api/social/status";

//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch nearby users");
//         }

//         const data: NearbyUsersData = await response.json();
//         setActiveUsers(data.users);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch nearby users"
//       );
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   const handleHopIn = async (user: UserSocialProfileWithRelations) => {
//     try {
//       if (USE_MOCK_DATA) {
//         // Mock API call
//         await new Promise((resolve) => setTimeout(resolve, 800));
//         console.log("Mock: Hop in request sent to", user.user.name);
//         alert(`Mock: Hop in request sent to ${user.user.name || "user"}!`);
//       } else {
//         const response = await fetch("/api/social/hop-in", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             targetUserId: user.userId,
//             barId: user.currentBarId,
//             message: `Hey ${user.user.name || "there"}! I'd like to join you.`,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to send hop in request");
//         }

//         alert("Hop in request sent! They'll receive a notification.");
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to send hop in request"
//       );
//     }
//   };

//   useEffect(() => {
//     if (isSocialMode) {
//       fetchNearbyUsers();
//       const interval = setInterval(fetchNearbyUsers, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isSocialMode, currentLocation]);

//   return (
//     <SocialContainer>
//       <SocialHeader>
//         <Title>Social Mode</Title>
//         <Subtitle>
//           See who&apos;s out tonight and join spontaneous meetups. Toggle your
//           status to let others know you&apos;re open to connecting.
//         </Subtitle>
//       </SocialHeader>

//       {USE_MOCK_DATA && (
//         <MockDataNotice>
//           🎭 Using mock data - Toggle &quot;I&apos;m Free Tonight&quot; to see
//           demo users
//         </MockDataNotice>
//       )}

//       <div
//         style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
//       >
//         <SocialToggle
//           isActive={isSocialMode}
//           onToggle={toggleSocialMode}
//           isLoading={isLoading}
//         />
//       </div>

//       {error && <ErrorState>{error}</ErrorState>}

//       {isLoadingUsers && isSocialMode && (
//         <LoadingState>
//           <p>Finding active users near you...</p>
//         </LoadingState>
//       )}

//       {isSocialMode && !isLoadingUsers && (
//         <>
//           <SocialMap
//             users={activeUsers}
//             onUserClick={handleHopIn}
//             currentLocation={currentLocation || mockCurrentLocation}
//           />
//           <UserList
//             users={activeUsers}
//             onHopIn={handleHopIn}
//             isLoading={isLoading}
//           />
//         </>
//       )}
//     </SocialContainer>
//   );
// }
// "use client";
// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
// import UserList from "./user-list/UserList";
// import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";
// import { UserSocialProfileWithRelations } from "@/types/social";
// import { SocialVibe } from "@prisma/client";
// import { mockUsers, mockCurrentLocation } from "@/lib/mockSocialData";

// const SocialContainer = styled.div`
//   padding: 2rem 1rem;
//   background: #0f172a;
//   min-height: 100vh;
// `;

// const SocialHeader = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin-bottom: 1rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Subtitle = styled.p`
//   color: #e2e8f0;
//   font-size: 1.125rem;
//   max-width: 600px;
//   margin: 0 auto;
// `;

// const LoadingState = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #94a3b8;
// `;

// const ErrorState = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(239, 68, 68, 0.1);
//   border: 1px solid rgba(239, 68, 68, 0.3);
//   border-radius: 8px;
//   color: #ef4444;
//   margin: 1rem 0;
// `;

// const MockDataNotice = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(139, 92, 246, 0.1);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   color: #8b5cf6;
//   margin: 1rem 0;
//   font-size: 0.875rem;
// `;

// const EditProfileButton = styled.button`
//   background: transparent;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: #8b5cf6;
//   padding: 0.5rem 1rem;
//   border-radius: 6px;
//   cursor: pointer;
//   font-size: 0.875rem;
//   transition: all 0.3s ease;
//   margin-top: 1rem;

//   &:hover {
//     background: rgba(139, 92, 246, 0.1);
//     border-color: #8b5cf6;
//   }
// `;

// const StatsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//   gap: 1rem;
//   margin: 2rem 0;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const StatCard = styled.div`
//   background: rgba(30, 41, 59, 0.6);
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   border-radius: 8px;
//   padding: 1rem;
//   text-align: center;
// `;

// const StatNumber = styled.div`
//   font-size: 1.5rem;
//   font-weight: 700;
//   color: #0ea5e9;
//   margin-bottom: 0.25rem;
// `;

// const StatLabel = styled.div`
//   font-size: 0.875rem;
//   color: #94a3b8;
// `;

// const EmptyState = styled.div`
//   text-align: center;
//   padding: 3rem;
//   color: #94a3b8;
// `;

// const HowItWorksSection = styled.div`
//   background: rgba(30, 41, 59, 0.6);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   padding: 2rem;
//   margin: 2rem 0;
//   max-width: 800px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const HowItWorksTitle = styled.h3`
//   color: #f8fafc;
//   text-align: center;
//   margin-bottom: 1.5rem;
//   font-size: 1.5rem;
// `;

// const StepsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//   gap: 1.5rem;
// `;

// const StepCard = styled.div`
//   text-align: center;
//   padding: 1.5rem;
// `;

// const StepIcon = styled.div`
//   font-size: 2.5rem;
//   margin-bottom: 1rem;
// `;

// const StepTitle = styled.h4`
//   color: #f8fafc;
//   margin-bottom: 0.5rem;
//   font-size: 1.125rem;
// `;

// const StepDescription = styled.p`
//   color: #94a3b8;
//   font-size: 0.875rem;
//   line-height: 1.5;
// `;

// interface LocationData {
//   locationLat?: number;
//   locationLng?: number;
// }

// interface NearbyUsersData {
//   users: UserSocialProfileWithRelations[];
// }

// // Add this environment variable check
// const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// export default function Social() {
//   const [isSocialMode, setIsSocialMode] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);

//   // Profile setup state
//   const [showProfileSetup, setShowProfileSetup] = useState(false);
//   const [hasSocialProfile, setHasSocialProfile] = useState(false);
//   const [userSocialProfile, setUserSocialProfile] =
//     useState<UserSocialProfileWithRelations | null>(null);

//   // Check if user has social profile on component mount
//   useEffect(() => {
//     checkSocialProfile();
//   }, []);

//   const checkSocialProfile = async () => {
//     try {
//       if (USE_MOCK_DATA) {
//         // For mock data, assume no profile initially
//         setHasSocialProfile(false);
//         return;
//       }

//       const response = await fetch("/api/social/profile");
//       if (response.ok) {
//         const data = await response.json();
//         setHasSocialProfile(!!data.socialProfile);
//         setUserSocialProfile(data.socialProfile);
//       }
//     } catch (error) {
//       console.error("Error checking social profile:", error);
//     }
//   };

//   const toggleSocialMode = async (status: boolean) => {
//     console.log("🔘 toggleSocialMode called:", {
//       status,
//       hasSocialProfile,
//       userSocialProfile: !!userSocialProfile,
//     });

//     setIsLoading(true);
//     setError(null);

//     try {
//       // TEMPORARILY SKIP PROFILE CHECK FOR TESTING
//       if (status && !hasSocialProfile && !userSocialProfile) {
//         console.log("🚫 No profile found, but continuing anyway for testing");
//         // Don't return - let it continue to test the flow
//       }

//       // Get user location if available
//       let locationData: LocationData = {};
//       if (status && navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>(
//             (resolve, reject) => {
//               navigator.geolocation.getCurrentPosition(resolve, reject, {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0,
//               });
//             }
//           );

//           locationData = {
//             locationLat: position.coords.latitude,
//             locationLng: position.coords.longitude,
//           };

//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         } catch (geoError) {
//           console.warn("Geolocation failed:", geoError);
//           setCurrentLocation(mockCurrentLocation);
//         }
//       } else if (status) {
//         setCurrentLocation(mockCurrentLocation);
//       }

//       console.log("📡 Making social status API call...");
//       const response = await fetch("/api/social/status", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           isActive: status,
//           ...locationData,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to update social status");
//       }

//       const result = await response.json();
//       setUserSocialProfile(result.socialProfile);
//       setIsSocialMode(status);

//       if (status) {
//         await fetchNearbyUsers();
//       } else {
//         setActiveUsers([]);
//       }

//       console.log("✅ Social status updated successfully");
//     } catch (err) {
//       console.error("❌ Error in toggleSocialMode:", err);
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;

//     setIsLoadingUsers(true);
//     try {
//       if (USE_MOCK_DATA) {
//         // Mock API call with delay
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         setActiveUsers(mockUsers);
//       } else {
//         const url = currentLocation
//           ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=1000`
//           : "/api/social/status";

//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch nearby users");
//         }

//         const data: NearbyUsersData = await response.json();
//         setActiveUsers(data.users);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch nearby users"
//       );
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   const handleHopIn = async (user: UserSocialProfileWithRelations) => {
//     try {
//       if (USE_MOCK_DATA) {
//         // Mock API call
//         await new Promise((resolve) => setTimeout(resolve, 800));
//         console.log("Mock: Hop in request sent to", user.user.name);
//         alert(
//           `Hop in request sent to ${
//             user.user.name || "user"
//           }! They'll receive a notification.`
//         );
//       } else {
//         const response = await fetch("/api/social/hop-in", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             targetUserId: user.userId,
//             barId: user.currentBarId,
//             message: `Hey ${user.user.name || "there"}! I'd like to join you.`,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to send hop in request");
//         }

//         alert("Hop in request sent! They'll receive a notification.");
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to send hop in request"
//       );
//     }
//   };

//   const handleProfileSetupComplete = async (profileData: {
//     bio: string;
//     vibe: SocialVibe;
//     interests: string[];
//   }) => {
//     console.log("🎯 PARENT RECEIVED:", {
//       ...profileData,
//       vibeType: typeof profileData.vibe,
//       interestsType: typeof profileData.interests,
//       interestsIsArray: Array.isArray(profileData.interests),
//     });

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Verify the data before sending
//       const dataToSend = {
//         bio: profileData.bio || "",
//         vibe: profileData.vibe || SocialVibe.CASUAL,
//         interests: Array.isArray(profileData.interests)
//           ? profileData.interests
//           : [],
//       };

//       console.log("📤 SENDING TO API:", dataToSend);

//       const response = await fetch("/api/social/profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dataToSend),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: Failed to save profile`);
//       }

//       const result = await response.json();
//       console.log("✅ API RESPONSE:", result);

//       setUserSocialProfile(result.socialProfile);
//       setHasSocialProfile(true);
//       setShowProfileSetup(false);

//       await toggleSocialMode(true);
//     } catch (err) {
//       console.error("❌ ERROR:", err);
//       setError(err instanceof Error ? err.message : "Failed to save profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const testDirectProfileSave = async () => {
//     console.log("🧪 DIRECT TEST: Saving profile via API");
//     try {
//       const response = await fetch("/api/social/profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bio: "Direct test bio",
//           vibe: "PARTY",
//           interests: ["Music", "Sports", "Testing"],
//         }),
//       });

//       const result = await response.json();
//       console.log("🧪 DIRECT TEST RESULT:", result);

//       // Refresh the profile to see changes
//       checkSocialProfile();
//     } catch (error) {
//       console.error("🧪 DIRECT TEST ERROR:", error);
//     }
//   };

//   // Profile setup handler
//   // const handleProfileSetupComplete = async (profileData: {
//   //   bio: string;
//   //   vibe: SocialVibe;
//   //   interests: string[];
//   // }) => {
//   //   setIsLoading(true);
//   //   try {
//   //     if (USE_MOCK_DATA) {
//   //       // Mock profile creation
//   //       await new Promise((resolve) => setTimeout(resolve, 1000));
//   //       console.log("Mock: Profile created with data:", profileData);

//   //       // Create mock profile
//   //       const mockProfile: UserSocialProfileWithRelations = {
//   //         id: "user-current",
//   //         userId: "user-current",
//   //         bio: profileData.bio,
//   //         vibe: profileData.vibe,
//   //         interests: profileData.interests,
//   //         isSocialMode: false,
//   //         socialStatus: "OFFLINE",
//   //         lastActive: new Date(),
//   //         locationLat: null,
//   //         locationLng: null,
//   //         currentBarId: null,
//   //         currentBar: null,
//   //         isVisibleOnMap: true,
//   //         maxDistance: 1000,
//   //         createdAt: new Date(),
//   //         updatedAt: new Date(),
//   //         user: {
//   //           id: "user-current",
//   //           name: "Current User",
//   //           image: null,
//   //         },
//   //       };

//   //       setUserSocialProfile(mockProfile);
//   //     } else {
//   //       const response = await fetch("/api/social/profile", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(profileData),
//   //       });

//   //       if (!response.ok) {
//   //         throw new Error("Failed to save profile");
//   //       }

//   //       const result = await response.json();
//   //       setUserSocialProfile(result.socialProfile);
//   //     }

//   //     setHasSocialProfile(true);
//   //     setShowProfileSetup(false);

//   //     // Now activate social mode
//   //     await toggleSocialMode(true);
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err.message : "Failed to save profile");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleProfileSetupSkip = () => {
//     setShowProfileSetup(false);
//     // Create a basic profile with default values
//     handleProfileSetupComplete({
//       bio: "",
//       vibe: SocialVibe.CASUAL,
//       interests: [],
//     });
//   };

//   const handleEditProfile = () => {
//     setShowProfileSetup(true);
//   };

//   useEffect(() => {
//     if (isSocialMode) {
//       fetchNearbyUsers();
//       const interval = setInterval(fetchNearbyUsers, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isSocialMode, currentLocation]);

//   // Calculate stats
//   const activeUsersCount = activeUsers.length;
//   const nearbyBars = [
//     ...new Set(
//       activeUsers.map((user) => user.currentBar?.name).filter(Boolean)
//     ),
//   ].length;
//   const popularVibes = activeUsers.reduce((acc, user) => {
//     const vibe = user.vibe || "CASUAL";
//     acc[vibe] = (acc[vibe] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);
//   const mostPopularVibe = Object.keys(popularVibes).reduce(
//     (a, b) => (popularVibes[a] > popularVibes[b] ? a : b),
//     "CHILL"
//   );

//   return (
//     <SocialContainer>
//       <SocialHeader>
//         <Title>Social Mode</Title>
//         <Subtitle>
//           See who&apos;s out tonight and join spontaneous meetups. Toggle your
//           status to let others know you&apos;re open to connecting.
//         </Subtitle>
//       </SocialHeader>

//       {USE_MOCK_DATA && (
//         <MockDataNotice>
//           🎭 Using mock data - Toggle &quot;I&apos;m Free Tonight&quot; to see
//           demo users
//         </MockDataNotice>
//       )}

//       {/* Profile Setup Modal */}
//       {showProfileSetup && (
//         <SetupSocialProfile
//           onComplete={handleProfileSetupComplete}
//           onSkip={handleProfileSetupSkip}
//           isLoading={isLoading}
//         />
//       )}

//       {/* Main Social Mode Content */}
//       {!showProfileSetup && (
//         <>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               margin: "2rem 0",
//             }}
//           >
//             <SocialToggle
//               isActive={isSocialMode}
//               onToggle={toggleSocialMode}
//               isLoading={isLoading}
//             />
//           </div>

//           {hasSocialProfile && !isSocialMode && (
//             <div style={{ textAlign: "center" }}>
//               <EditProfileButton onClick={handleEditProfile}>
//                 Edit Social Profile
//               </EditProfileButton>
//             </div>
//           )}

//           {error && <ErrorState>{error}</ErrorState>}

//           {/* Social Mode Active Content */}
//           {isSocialMode && (
//             <>
//               {/* Stats Overview */}
//               <StatsContainer>
//                 <StatCard>
//                   <StatNumber>{activeUsersCount}</StatNumber>
//                   <StatLabel>Active Nearby</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{nearbyBars}</StatNumber>
//                   <StatLabel>Popular Spots</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{mostPopularVibe}</StatNumber>
//                   <StatLabel>Dominant Vibe</StatLabel>
//                 </StatCard>
//               </StatsContainer>

//               {isLoadingUsers && (
//                 <LoadingState>
//                   <p>Finding active users near you...</p>
//                 </LoadingState>
//               )}

//               {!isLoadingUsers && (
//                 <>
//                   <SocialMap
//                     users={activeUsers}
//                     onUserClick={handleHopIn}
//                     currentLocation={currentLocation || mockCurrentLocation}
//                   />
//                   <UserList
//                     users={activeUsers}
//                     onHopIn={handleHopIn}
//                     isLoading={isLoading}
//                   />
//                 </>
//               )}
//             </>
//           )}

//           {/* How It Works Section (when not in social mode) */}
//           {!isSocialMode && !showProfileSetup && (
//             <>
//               <HowItWorksSection>
//                 <HowItWorksTitle>How Social Mode Works</HowItWorksTitle>
//                 <StepsGrid>
//                   <StepCard>
//                     <StepIcon>🔘</StepIcon>
//                     <StepTitle>Toggle &quot;I&apos;m Free&quot;</StepTitle>
//                     <StepDescription>
//                       Let others know you&apos;re open to meeting up. Set your
//                       vibe and preferences.
//                     </StepDescription>
//                   </StepCard>
//                   <StepCard>
//                     <StepIcon>🗺️</StepIcon>
//                     <StepTitle>See Who&apos;s Nearby</StepTitle>
//                     <StepDescription>
//                       Discover people at nearby bars and venues with similar
//                       interests.
//                     </StepDescription>
//                   </StepCard>
//                   <StepCard>
//                     <StepIcon>🚀</StepIcon>
//                     <StepTitle>Hop In & Connect</StepTitle>
//                     <StepDescription>
//                       Join spontaneous meetups or invite others to join you.
//                     </StepDescription>
//                   </StepCard>
//                   <StepCard>
//                     <StepIcon>🎯</StepIcon>
//                     <StepTitle>Meet & Socialize</StepTitle>
//                     <StepDescription>
//                       Make new connections and enjoy Helsinki&apos;s nightlife
//                       together.
//                     </StepDescription>
//                   </StepCard>
//                 </StepsGrid>
//               </HowItWorksSection>

//               {/* Empty state when no profile exists */}
//               {!hasSocialProfile && (
//                 <EmptyState>
//                   <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
//                     Ready to Socialize?
//                   </h3>
//                   <p style={{ marginBottom: "1.5rem" }}>
//                     Create your social profile to start connecting with people
//                     nearby.
//                   </p>
//                   <EditProfileButton
//                     onClick={handleEditProfile}
//                     style={{
//                       background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
//                       border: "none",
//                       color: "white",
//                       padding: "0.75rem 1.5rem",
//                       fontSize: "1rem",
//                     }}
//                   >
//                     Create Social Profile
//                   </EditProfileButton>
//                 </EmptyState>
//               )}
//             </>
//           )}
//         </>
//       )}
//       <button
//         onClick={testDirectProfileSave}
//         style={{
//           background: "#10b981",
//           color: "white",
//           padding: "0.75rem 1.5rem",
//           border: "none",
//           borderRadius: "8px",
//           margin: "1rem",
//           fontSize: "1rem",
//           fontWeight: "600",
//         }}
//       >
//         🧪 Test Direct Save
//       </button>
//     </SocialContainer>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import SocialToggle from "./social-toggle/SocialToggle";
import SocialMap from "./social-map/SocialMap";
import UserList from "./user-list/UserList";
import { UserSocialProfileWithRelations } from "@/types/social";
import { SocialVibe } from "@prisma/client";
import { mockUsers, mockCurrentLocation } from "@/lib/mockSocialData";
import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";

const SocialContainer = styled.div`
  padding: 2rem 1rem;
  background: #0f172a;
  min-height: 100vh;
`;

const SocialHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #e2e8f0;
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  margin: 1rem 0;
`;

const MockDataNotice = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #8b5cf6;
  margin: 1rem 0;
  font-size: 0.875rem;
`;

const EditProfileButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: #8b5cf6;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
`;

const HowItWorksSection = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  padding: 2rem;
  margin: 2rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const HowItWorksTitle = styled.h3`
  color: #f8fafc;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StepCard = styled.div`
  text-align: center;
  padding: 1.5rem;
`;

const StepIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h4`
  color: #f8fafc;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
`;

const StepDescription = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;
`;

interface LocationData {
  locationLat?: number;
  locationLng?: number;
}

interface NearbyUsersData {
  users: UserSocialProfileWithRelations[];
}

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default function Social() {
  const [isSocialMode, setIsSocialMode] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    UserSocialProfileWithRelations[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Profile setup state
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasSocialProfile, setHasSocialProfile] = useState(false);
  const [userSocialProfile, setUserSocialProfile] =
    useState<UserSocialProfileWithRelations | null>(null);

  // Check if user has social profile on component mount
  useEffect(() => {
    checkSocialProfile();
  }, []);

  const checkSocialProfile = async () => {
    try {
      if (USE_MOCK_DATA) {
        setHasSocialProfile(false);
        return;
      }

      const response = await fetch("/api/social/profile");
      if (response.ok) {
        const data = await response.json();
        console.log("📋 PROFILE CHECK RESPONSE:", data);
        setHasSocialProfile(!!data.socialProfile);
        setUserSocialProfile(data.socialProfile);
      }
    } catch (error) {
      console.error("Error checking social profile:", error);
    }
  };

  const toggleSocialMode = async (status: boolean) => {
    console.log("🔘 toggleSocialMode called:", {
      status,
      hasSocialProfile,
      userSocialProfile: !!userSocialProfile,
    });

    setIsLoading(true);
    setError(null);

    try {
      if (status && !hasSocialProfile && !userSocialProfile) {
        console.log("🚫 No profile found, showing setup");
        setShowProfileSetup(true);
        setIsLoading(false);
        return;
      }

      // Get user location if available
      let locationData: LocationData = {};
      if (status && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            }
          );

          locationData = {
            locationLat: position.coords.latitude,
            locationLng: position.coords.longitude,
          };

          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } catch (geoError) {
          console.warn("Geolocation failed:", geoError);
          setCurrentLocation(mockCurrentLocation);
        }
      } else if (status) {
        setCurrentLocation(mockCurrentLocation);
      }

      console.log("📡 Making social status API call...");
      const response = await fetch("/api/social/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: status,
          ...locationData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update social status");
      }

      const result = await response.json();
      setUserSocialProfile(result.socialProfile);
      setIsSocialMode(status);

      if (status) {
        await fetchNearbyUsers();
      } else {
        setActiveUsers([]);
      }

      console.log("✅ Social status updated successfully");
    } catch (err) {
      console.error("❌ Error in toggleSocialMode:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyUsers = async () => {
    if (!isSocialMode) return;

    setIsLoadingUsers(true);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setActiveUsers(mockUsers);
      } else {
        const url = currentLocation
          ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=1000`
          : "/api/social/status";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch nearby users");
        }

        const data: NearbyUsersData = await response.json();
        setActiveUsers(data.users);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch nearby users"
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleHopIn = async (user: UserSocialProfileWithRelations) => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Mock: Hop in request sent to", user.user.name);
        alert(
          `Hop in request sent to ${
            user.user.name || "user"
          }! They'll receive a notification.`
        );
      } else {
        const response = await fetch("/api/social/hop-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId: user.userId,
            barId: user.currentBarId,
            message: `Hey ${user.user.name || "there"}! I'd like to join you.`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send hop in request");
        }

        alert("Hop in request sent! They'll receive a notification.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send hop in request"
      );
    }
  };

  const handleProfileSetupComplete = async (profileData: {
    bio: string;
    vibe: SocialVibe;
    interests: string[];
  }) => {
    console.log("🎯 PARENT RECEIVED PROFILE DATA:", profileData);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/social/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to save profile`);
      }

      const result = await response.json();
      console.log("✅ PROFILE SAVE RESPONSE:", result);

      // Update local state
      setUserSocialProfile(result.socialProfile);
      setHasSocialProfile(true);
      setShowProfileSetup(false);

      // Automatically enable social mode after profile creation
      await toggleSocialMode(true);
    } catch (err) {
      console.error("❌ PROFILE SAVE ERROR:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSetupSkip = () => {
    setShowProfileSetup(false);
  };

  const handleEditProfile = () => {
    setShowProfileSetup(true);
  };

  useEffect(() => {
    if (isSocialMode) {
      fetchNearbyUsers();
      const interval = setInterval(fetchNearbyUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [isSocialMode, currentLocation]);

  // Calculate stats
  const activeUsersCount = activeUsers.length;
  const nearbyBars = [
    ...new Set(
      activeUsers.map((user) => user.currentBar?.name).filter(Boolean)
    ),
  ].length;
  const popularVibes = activeUsers.reduce((acc, user) => {
    const vibe = user.vibe || "CASUAL";
    acc[vibe] = (acc[vibe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostPopularVibe = Object.keys(popularVibes).reduce(
    (a, b) => (popularVibes[a] > popularVibes[b] ? a : b),
    "CHILL"
  );

  return (
    <SocialContainer>
      <SocialHeader>
        <Title>Social Mode</Title>
        <Subtitle>
          See who&apos;s out tonight and join spontaneous meetups. Toggle your
          status to let others know you&apos;re open to connecting.
        </Subtitle>
      </SocialHeader>

      {USE_MOCK_DATA && (
        <MockDataNotice>
          🎭 Using mock data - Toggle &quot;I&apos;m Free Tonight&quot; to see
          demo users
        </MockDataNotice>
      )}

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <SetupSocialProfile
          onComplete={handleProfileSetupComplete}
          onSkip={handleProfileSetupSkip}
          isLoading={isLoading}
        />
      )}

      {/* Main Social Mode Content */}
      {!showProfileSetup && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem 0",
            }}
          >
            <SocialToggle
              isActive={isSocialMode}
              onToggle={toggleSocialMode}
              isLoading={isLoading}
            />
          </div>

          {hasSocialProfile && !isSocialMode && (
            <div style={{ textAlign: "center" }}>
              <EditProfileButton onClick={handleEditProfile}>
                Edit Social Profile
              </EditProfileButton>
            </div>
          )}

          {error && <ErrorState>{error}</ErrorState>}

          {/* Social Mode Active Content */}
          {isSocialMode && (
            <>
              {/* Stats Overview */}
              <StatsContainer>
                <StatCard>
                  <StatNumber>{activeUsersCount}</StatNumber>
                  <StatLabel>Active Nearby</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{nearbyBars}</StatNumber>
                  <StatLabel>Popular Spots</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{mostPopularVibe}</StatNumber>
                  <StatLabel>Dominant Vibe</StatLabel>
                </StatCard>
              </StatsContainer>

              {isLoadingUsers && (
                <LoadingState>
                  <p>Finding active users near you...</p>
                </LoadingState>
              )}

              {!isLoadingUsers && (
                <>
                  <SocialMap
                    users={activeUsers}
                    onUserClick={handleHopIn}
                    currentLocation={currentLocation || mockCurrentLocation}
                  />
                  <UserList
                    users={activeUsers}
                    onHopIn={handleHopIn}
                    isLoading={isLoading}
                  />
                </>
              )}
            </>
          )}

          {/* How It Works Section (when not in social mode) */}
          {!isSocialMode && !showProfileSetup && (
            <>
              <HowItWorksSection>
                <HowItWorksTitle>How Social Mode Works</HowItWorksTitle>
                <StepsGrid>
                  <StepCard>
                    <StepIcon>🔘</StepIcon>
                    <StepTitle>Toggle &quot;I&apos;m Free&quot;</StepTitle>
                    <StepDescription>
                      Let others know you&apos;re open to meeting up. Set your
                      vibe and preferences.
                    </StepDescription>
                  </StepCard>
                  <StepCard>
                    <StepIcon>🗺️</StepIcon>
                    <StepTitle>See Who&apos;s Nearby</StepTitle>
                    <StepDescription>
                      Discover people at nearby bars and venues with similar
                      interests.
                    </StepDescription>
                  </StepCard>
                  <StepCard>
                    <StepIcon>🚀</StepIcon>
                    <StepTitle>Hop In & Connect</StepTitle>
                    <StepDescription>
                      Join spontaneous meetups or invite others to join you.
                    </StepDescription>
                  </StepCard>
                  <StepCard>
                    <StepIcon>🎯</StepIcon>
                    <StepTitle>Meet & Socialize</StepTitle>
                    <StepDescription>
                      Make new connections and enjoy Helsinki&apos;s nightlife
                      together.
                    </StepDescription>
                  </StepCard>
                </StepsGrid>
              </HowItWorksSection>

              {/* Empty state when no profile exists */}
              {!hasSocialProfile && (
                <EmptyState>
                  <h3 style={{ color: "#f8fafc", marginBottom: "1rem" }}>
                    Ready to Socialize?
                  </h3>
                  <p style={{ marginBottom: "1.5rem" }}>
                    Create your social profile to start connecting with people
                    nearby.
                  </p>
                  <EditProfileButton
                    onClick={handleEditProfile}
                    style={{
                      background: "linear-gradient(45deg, #8b5cf6, #0ea5e9)",
                      border: "none",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                    }}
                  >
                    Create Social Profile
                  </EditProfileButton>
                </EmptyState>
              )}
            </>
          )}
        </>
      )}
    </SocialContainer>
  );
}
