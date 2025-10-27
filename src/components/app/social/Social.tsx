"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
import { UserSocialProfileWithRelations } from "@/types/social";
import { SocialVibe } from "@prisma/client";
import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";

import dynamic from "next/dynamic";
import {
  ActionButton,
  CityBadge,
  CityDetection,
  DesktopNotificationBell,
  DistanceBadge,
  EditProfileButton,
  EmptyUsersState,
  ErrorState,
  HeaderActions,
  HowItWorks,
  HowItWorksTitle,
  LoadingState,
  LocationInfo,
  MapContainer,
  ModalActions,
  ModalBio,
  ModalButton,
  ModalContent,
  ModalHeader,
  ModalInterests,
  ModalInterestTag,
  ModalOverlay,
  ModalSection,
  ModalSectionTitle,
  ModalUserImage,
  ModalUserInfo,
  ModalUserName,
  ModalUserVibe,
  QuickActions,
  SocialContainer,
  SocialHeader,
  StatCard,
  StatLabel,
  StatNumber,
  StatsContainer,
  Step,
  StepDescription,
  StepIcon,
  StepsContainer,
  StepTitle,
  Subtitle,
  SuccessState,
  Title,
  UserAge,
  UserCard,
  UserDetails,
  UserHeader,
  UserImage,
  UserImageContainer,
  UserInfo,
  UserName,
  UsersGrid,
  UserStatusBadge,
  UserVibeBadge,
  ViewButton,
  ViewToggle,
} from "./Social.styles";
import { useSocket } from "../contexts/SocketContext";
import { NotificationData } from "@/types/socket";

// NOTIFICATION SYSTEM IMPORTS

export const SocialMap = dynamic(() => import("./social-map/SocialMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        borderRadius: "12px",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e2e8f0",
        margin: "1.5rem 0",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
        <p>Loading interactive map...</p>
      </div>
    </div>
  ),
});

// Helper functions
export const getVibeColor = (vibe: string) => {
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

export const getVibeEmoji = (vibe: string) => {
  switch (vibe) {
    case "PARTY":
      return "🎉";
    case "CHILL":
      return "😌";
    case "NETWORKING":
      return "🤝";
    case "ADVENTUROUS":
      return "🌍";
    default:
      return "💜";
  }
};

export const getSocialStatusText = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "Online";
    case "SOCIAL_MODE":
      return "Social";
    case "IN_MEETUP":
      return "In Meetup";
    case "OFFLINE":
      return "Offline";
    default:
      return "Available";
  }
};

// Calculate age from birth date if available, otherwise use a default
const calculateAge = (user: UserSocialProfileWithRelations): number => {
  const hash = user.userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return 22 + (hash % 15);
};

// Finnish cities with their approximate coordinates and bounds
const FINNISH_CITIES = {
  Helsinki: {
    lat: 60.1699,
    lng: 24.9384,
    bounds: { north: 60.2978, south: 60.1094, west: 24.7386, east: 25.2542 },
  },
  Espoo: {
    lat: 60.2055,
    lng: 24.6559,
    bounds: { north: 60.35, south: 60.1, west: 24.5, east: 24.9 },
  },
  Tampere: {
    lat: 61.4978,
    lng: 23.761,
    bounds: { north: 61.6, south: 61.4, west: 23.5, east: 24.1 },
  },
  Turku: {
    lat: 60.4518,
    lng: 22.2666,
    bounds: { north: 60.55, south: 60.35, west: 22.1, east: 22.5 },
  },
  Oulu: {
    lat: 65.0121,
    lng: 25.4651,
    bounds: { north: 65.1, south: 64.9, west: 25.3, east: 25.7 },
  },
  Vantaa: {
    lat: 60.2934,
    lng: 25.0378,
    bounds: { north: 60.4, south: 60.2, west: 24.85, east: 25.25 },
  },
  Lahti: {
    lat: 60.9827,
    lng: 25.6612,
    bounds: { north: 61.05, south: 60.9, west: 25.55, east: 25.8 },
  },
  Kuopio: {
    lat: 62.8924,
    lng: 27.677,
    bounds: { north: 63.0, south: 62.75, west: 27.5, east: 27.9 },
  },
  Jyväskylä: {
    lat: 62.2426,
    lng: 25.7473,
    bounds: { north: 62.3, south: 62.15, west: 25.65, east: 25.85 },
  },
  Pori: {
    lat: 61.4851,
    lng: 21.7975,
    bounds: { north: 61.55, south: 61.4, west: 21.7, east: 21.9 },
  },
};

// Helper function to detect which Finnish city the coordinates are in
const detectFinnishCity = (lat: number, lng: number): string => {
  for (const [city, data] of Object.entries(FINNISH_CITIES)) {
    const bounds = data.bounds;
    if (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    ) {
      return city;
    }
  }

  // If no city matched, use reverse geocoding as fallback
  return "Unknown";
};

// Enhanced reverse geocoding for Finnish cities
const getCityFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    // First try to detect using our bounds
    const detectedCity = detectFinnishCity(lat, lng);
    if (detectedCity !== "Unknown") {
      return detectedCity;
    }

    // Fallback to API for more accurate detection
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );

    if (!response.ok) throw new Error("Geocoding API failed");

    const data = await response.json();

    // Check if the city is in Finland
    if (data.countryName === "Finland") {
      return data.city || data.locality || "Unknown City in Finland";
    }

    return "Not in Finland";
  } catch (error) {
    console.error("Error getting city from coordinates:", error);

    // Final fallback - check if coordinates are roughly in Finland
    if (lat > 59.5 && lat < 70.0 && lng > 19.0 && lng < 31.0) {
      return "Unknown City in Finland";
    }

    return "Location not in Finland";
  }
};

// Filter users by city
const filterUsersByCity = (
  users: UserSocialProfileWithRelations[],
  targetCity: string
): UserSocialProfileWithRelations[] => {
  if (
    targetCity === "Not in Finland" ||
    targetCity === "Location not in Finland"
  ) {
    return []; // No users if not in Finland
  }

  return users.filter((user) => {
    if (!user.locationLat || !user.locationLng) return false;

    try {
      const userCity = detectFinnishCity(user.locationLat, user.locationLng);

      // Direct city match
      if (userCity === targetCity) {
        return true;
      }

      // Handle "Unknown City in Finland" case - include them if we're also in an unknown Finnish location
      if (targetCity === "Unknown City in Finland" && userCity === "Unknown") {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error filtering user by city:", error);
      return false;
    }
  });
};

interface LocationData {
  locationLat?: number;
  locationLng?: number;
}

interface NearbyUsersData {
  users: UserSocialProfileWithRelations[];
}

// Fixed DebugInfo interface with all possible properties
interface DebugInfo {
  type: string;
  loading?: boolean;
  success?: boolean;
  data?: unknown;
  error?: string;
  message?: string;
  source?: string;
  count?: number;
  users?: unknown[];
  hasProfile?: boolean;
  profile?: unknown;
  timestamp?: string;
  status?: number;
  result?: unknown;
  // Added missing properties
  city?: string;
  coordinates?: { lat: number; lng: number };
  totalUsers?: number;
  filteredCount?: number;
}

const Social = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // NOTIFICATION SYSTEM STATE
  const {
    socket,
    isConnected,
    addNotification,
    markAsRead,
    notifications,
    unreadCount,
  } = useSocket();

  // Remove showNotifications state since we're navigating to page instead
  // const [showNotifications, setShowNotifications] = useState(false);

  // const [isSocialMode, setIsSocialMode] = useState(false);
  const [activeUsers, setActiveUsers] = useState<
    UserSocialProfileWithRelations[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasSocialProfile, setHasSocialProfile] = useState(false);
  const [userSocialProfile, setUserSocialProfile] =
    useState<UserSocialProfileWithRelations | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [selectedView, setSelectedView] = useState<"grid" | "map">("grid");
  const [selectedUser, setSelectedUser] =
    useState<UserSocialProfileWithRelations | null>(null);
  const [showHopInModal, setShowHopInModal] = useState(false);
  const [isSendingHopIn, setIsSendingHopIn] = useState(false);

  // Add new state for city detection
  const [currentCity, setCurrentCity] = useState<string>("");
  const [isDetectingCity, setIsDetectingCity] = useState(false);
  const [allUsers, setAllUsers] = useState<UserSocialProfileWithRelations[]>(
    []
  );
  const [filteredUsers, setFilteredUsers] = useState<
    UserSocialProfileWithRelations[]
  >([]);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  // Initialize isSocialMode from localStorage first, then update from API
  // const [isSocialMode, setIsSocialMode] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = localStorage.getItem("socialMode");
  //     return saved ? JSON.parse(saved) : false;
  //   }
  //   return false;
  // });
  const [isSocialMode, setIsSocialMode] = useState(false);

  // Helper functions for user status display
  const getUserStatusDisplay = (
    user: UserSocialProfileWithRelations
  ): string => {
    // If user has a current bar, they're at a venue
    if (user.currentBar) {
      return "🍻 At a venue";
    }

    // If user has location but no bar, they're out exploring
    if (user.locationLat && user.locationLng) {
      return "📍 Out exploring";
    }

    // If user is in social mode but no specific location
    if (user.isSocialMode) {
      return "🔍 Looking for spots";
    }

    // Default fallback
    return "📍 Nearby";
  };

  const getUserDetailedStatus = (
    user: UserSocialProfileWithRelations
  ): string => {
    if (user.currentBar) {
      return `🍻 At a venue in ${currentCity} (${calculateDistance(user)})`;
    }

    if (user.locationLat && user.locationLng) {
      return `📍 Exploring ${currentCity} (${calculateDistance(user)})`;
    }

    if (user.isSocialMode) {
      return `🔍 Looking for places in ${currentCity}`;
    }

    return `📍 In ${currentCity}`;
  };

  // Add this useEffect to handle logout cleanup
  useEffect(() => {
    if (!session) {
      // User logged out - reset everything
      setIsSocialMode(false);
      setAllUsers([]);
      setFilteredUsers([]);
      setCurrentLocation(null);
      setCurrentCity("");
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const editMode = urlParams.get("edit");

      // If we came from UserProfile with ?edit=true, open edit mode
      if (editMode === "true" && userSocialProfile) {
        setShowProfileSetup(true);

        // Clean the URL so we don't get stuck in edit mode
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [userSocialProfile]);

  // NOTIFICATION SYSTEM: Socket connection and event listeners
  // In your Social component, update the socket useEffect to only handle accepts:
  // useEffect(() => {
  //   if (!socket || !session?.user?.id) return;

  //   // Join user's private room
  //   socket.emit("join_user_room", session.user.id);

  //   // Listen for new notifications
  //   socket.on("new_notification", (notification: NotificationData) => {
  //     console.log("📨 New notification received:", notification);
  //     addNotification(notification);
  //     setSuccess(`New notification: ${notification.message}`);
  //   });

  //   // Listen for hop request responses (when someone accepts YOUR request)
  //   socket.on("hop_request_accepted", (data) => {
  //     console.log("✅ Your hop request was accepted:", data);
  //     setSuccess(
  //       `${data.toUser?.name || "Someone"} accepted your hop in request! 🎉`
  //     );
  //   });

  //   // REMOVE decline notifications - silent declines
  //   // socket.on("hop_request_declined", (data) => {
  //   //   setSuccess(`${data.toUser?.name || 'Someone'} declined your hop in request`);
  //   // });

  //   // Listen for errors
  //   socket.on("error", (error) => {
  //     console.error("Socket error:", error);
  //     setError(error);
  //   });

  //   return () => {
  //     socket.off("new_notification");
  //     socket.off("hop_request_accepted");
  //     // socket.off("hop_request_declined"); // Remove this
  //     socket.off("error");
  //   };
  // }, [socket, session, addNotification]);

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Join user's private room
    socket.emit("join_user_room", session.user.id);

    // Listen for new notifications
    socket.on("new_notification", (notification: NotificationData) => {
      console.log("📨 New notification received:", notification);
      addNotification(notification);

      // 🆕 UPDATED: Show success but DON'T auto-navigate
      if (notification.type === "HOP_ACCEPTED") {
        setSuccess(
          `You have a new chat invitation! Check your notifications to start chatting.`
        );
      }
    });

    // Listen for hop request responses (when someone accepts YOUR request)
    socket.on("hop_request_accepted", (data) => {
      console.log("✅ Your hop request was accepted:", data);
      setSuccess(
        `${
          data.toUser?.name || "Someone"
        } accepted your hop in request! Check notifications to start chatting. 💬`
      );
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setError(error);
    });

    return () => {
      socket.off("new_notification");
      socket.off("hop_request_accepted");
      socket.off("error");
    };
  }, [socket, session, addNotification]);

  // NOTIFICATION SYSTEM: Fetch existing notifications on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session]);

  // NOTIFICATION SYSTEM: Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      console.log("📡 Fetching notifications...");
      const response = await fetch("/api/notifications");
      console.log("📨 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ Notifications data received:",
          data.notifications?.length
        );

        // Clear existing notifications by fetching fresh data
        // The SocketContext will handle deduplication
        data.notifications?.forEach((notification: NotificationData) => {
          addNotification(notification);
        });
      } else {
        console.error("❌ API Error:", response.status);
      }
    } catch (error) {
      console.error("💥 Error fetching notifications:", error);
    }
  };

  // NOTIFICATION SYSTEM: Send wave to user
  const sendWave = async (user: UserSocialProfileWithRelations) => {
    if (!socket || !session?.user?.id) {
      setError("Not connected to server");
      return;
    }

    try {
      socket.emit("send_wave", {
        fromUserId: session.user.id,
        toUserId: user.userId,
      });

      setSuccess(`You waved at ${user.user.name || "user"}! 👋`);
    } catch (err) {
      setError("Failed to send wave");
    }
  };

  // Check if user has social profile on component mount
  useEffect(() => {
    checkSocialProfile();
  }, []);

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fixed useEffect with proper null check for error
  useEffect(() => {
    if (error) {
      if (
        error.includes("Using Helsinki as default") ||
        error.includes("Geolocation not supported")
      ) {
        const timer = setTimeout(() => {
          setError(null);
          setShowLocationWarning(false);
        }, 8000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setError(null);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [error]);

  const calculateDistance = (user: UserSocialProfileWithRelations): string => {
    if (!currentLocation || !user.locationLat || !user.locationLng) {
      return "Nearby";
    }

    const R = 6371;
    const dLat = ((user.locationLat - currentLocation.lat) * Math.PI) / 180;
    const dLon = ((user.locationLng - currentLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((currentLocation.lat * Math.PI) / 180) *
        Math.cos((user.locationLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 0.1) return "Very close";
    if (distance < 0.5) return `${Math.round(distance * 1000)}m`;
    if (distance < 1) return "<1km";
    return `${distance.toFixed(1)}km`;
  };

  const checkSocialProfile = async () => {
    try {
      console.log("🔍 Checking social profile...");
      const response = await fetch("/api/social/profile");
      console.log("📨 Profile check response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Profile check data:", data);

        setHasSocialProfile(!!data.socialProfile);
        setUserSocialProfile(data.socialProfile);

        // Only update social mode if we have a fresh value from DB
        // Don't reset it to false if it's already true locally
        if (data.socialProfile?.isSocialMode) {
          console.log("🎯 Setting social mode to ACTIVE from database");
          setIsSocialMode(true);

          // If social mode is active, also set location and fetch users
          if (
            data.socialProfile.locationLat &&
            data.socialProfile.locationLng
          ) {
            const location = {
              lat: data.socialProfile.locationLat,
              lng: data.socialProfile.locationLng,
            };
            setCurrentLocation(location);
            await detectUserCity(location.lat, location.lng);
            await fetchNearbyUsers();
          }
        }
        // DON'T set to false automatically - preserve current state
        // This prevents resetting social mode when just updating profile
      }
    } catch (error) {
      console.error("💥 Error checking social profile:", error);
    }
  };

  // Enhanced city detection function
  const detectUserCity = async (lat: number, lng: number): Promise<void> => {
    setIsDetectingCity(true);
    setError(null);

    try {
      console.log("🌍 Detecting city for coordinates:", { lat, lng });

      const city = await getCityFromCoordinates(lat, lng);
      console.log("📍 Detected city:", city);

      setCurrentCity(city);

      setDebugInfo({
        type: "city_detected",
        city: city,
        coordinates: { lat, lng },
        timestamp: new Date().toISOString(),
      });

      // Show success message if in Finland
      if (city !== "Not in Finland" && city !== "Location not in Finland") {
        setSuccess(`Welcome to ${city}! Showing users in your city.`);
      } else {
        setError(
          "You appear to be outside Finland. Social mode may not work properly."
        );
      }
    } catch (error) {
      console.error("Error detecting city:", error);
      setCurrentCity("Unknown");
      setError("Could not detect your city. Showing all Finnish users.");
    } finally {
      setIsDetectingCity(false);
    }
  };

  // Update fetchNearbyUsers to filter by current city
  const fetchNearbyUsers = async () => {
    if (!isSocialMode) return;
    setIsLoadingUsers(true);
    try {
      // Use a larger radius to get users from wider area in Finland
      const url = currentLocation
        ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=100000` // 100km radius
        : "/api/social/status";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch nearby users");

      const data: NearbyUsersData = await response.json();

      console.log("🌍 Fetched all users:", data.users.length);

      // Store all users
      setAllUsers(data.users);

      // Filter users by current city
      if (currentCity) {
        const usersInCity = filterUsersByCity(data.users, currentCity);
        setFilteredUsers(usersInCity);

        console.log(`📍 Filtered users in ${currentCity}:`, usersInCity.length);

        setDebugInfo({
          type: "users_filtered_by_city",
          totalUsers: data.users.length,
          filteredCount: usersInCity.length,
          city: currentCity,
          timestamp: new Date().toISOString(),
        });
      } else {
        // If no city detected, show all users (fallback)
        setFilteredUsers(data.users);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch nearby users"
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const toggleSocialMode = async (status: boolean) => {
    // Early return if no session
    if (!session?.user?.id) {
      console.log("🚫 No session - cannot toggle social mode");
      setIsSocialMode(false);
      return;
    }

    console.log("🔘 toggleSocialMode called:", { status });

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setShowLocationWarning(false);

    try {
      if (status && !hasSocialProfile && !userSocialProfile) {
        console.log("🚫 No profile found, showing setup");
        setShowProfileSetup(true);
        setIsLoading(false);
        return;
      }

      let locationData: LocationData = {};
      let usedFallbackLocation = false;

      if (status && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
              });
            }
          );

          locationData = {
            locationLat: position.coords.latitude,
            locationLng: position.coords.longitude,
          };

          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(newLocation);
          await detectUserCity(newLocation.lat, newLocation.lng);
        } catch (geoError) {
          console.error("Geolocation error:", geoError);
          const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
          setCurrentLocation(fallbackLocation);
          setCurrentCity("Helsinki");
          usedFallbackLocation = true;
          setShowLocationWarning(true);
          setError(
            "Using Helsinki as default location. Enable location services for accurate city detection."
          );
        }
      } else if (status) {
        const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
        setCurrentLocation(fallbackLocation);
        setCurrentCity("Helsinki");
        usedFallbackLocation = true;
        setShowLocationWarning(true);
        setError(
          "Geolocation not supported. Using Helsinki as default location."
        );
      }

      const response = await fetch("/api/social/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: status,
          ...locationData,
          vibe: userSocialProfile?.vibe,
          interests: userSocialProfile?.interests,
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
        if (
          currentCity &&
          currentCity !== "Not in Finland" &&
          currentCity !== "Location not in Finland"
        ) {
          if (usedFallbackLocation) {
            setSuccess(
              `Social mode activated in ${currentCity}! Finding users nearby...`
            );
          } else {
            setSuccess(
              `Social mode activated in ${currentCity}! Finding users nearby...`
            );
          }
        } else {
          setSuccess("Social mode activated! Finding users nearby...");
        }
        await fetchNearbyUsers();
      } else {
        setSuccess("Social mode deactivated");
        setAllUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      // If API call fails, revert localStorage
      setIsSocialMode(!status);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // NOTIFICATION SYSTEM: Updated hop in function using Socket.io
  const handleHopIn = async (user: UserSocialProfileWithRelations) => {
    setSelectedUser(user);
    setShowHopInModal(true);
  };

  // NOTIFICATION SYSTEM: Updated send hop in request using Socket.io
  // const sendHopInRequest = async () => {
  //   if (!selectedUser || !socket || !session?.user?.id) return;

  //   setIsSendingHopIn(true);
  //   try {
  //     socket.emit("send_hop_request", {
  //       fromUserId: session.user.id,
  //       toUserId: selectedUser.userId,
  //       barId: selectedUser.currentBarId,
  //       message: `Hey ${
  //         selectedUser.user.name || "there"
  //       }! I'd like to join you.`,
  //     });

  //     setSuccess(`Hop in request sent to ${selectedUser.user.name || "user"}!`);
  //     setShowHopInModal(false);
  //     setSelectedUser(null);
  //   } catch (err) {
  //     setError("Failed to send hop in request");
  //   } finally {
  //     setIsSendingHopIn(false);
  //   }
  // };

  const sendHopInRequest = async () => {
    if (!selectedUser || !socket || !session?.user?.id) return;

    setIsSendingHopIn(true);
    try {
      socket.emit("send_hop_request", {
        fromUserId: session.user.id,
        toUserId: selectedUser.userId,
        barId: selectedUser.currentBarId,
        message: `Hey ${
          selectedUser.user.name || "there"
        }! I'd like to join you.`,
      });

      // 🆕 UPDATED SUCCESS MESSAGE
      setSuccess(
        `Hop in request sent to ${
          selectedUser.user.name || "user"
        }! You'll get a notification with a chat link if they accept.`
      );
      setShowHopInModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError("Failed to send hop in request");
    } finally {
      setIsSendingHopIn(false);
    }
  };

  const handleProfileSetupComplete = async (profileData: {
    bio: string;
    vibe: SocialVibe;
    interests: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/social/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to save profile");
      const result = await response.json();
      setUserSocialProfile(result.socialProfile);
      setHasSocialProfile(true);
      setShowProfileSetup(false);
      setSuccess("Profile created!");
      await checkSocialProfile();
      await toggleSocialMode(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };
  const handleProfileUpdate = async (profileData: {
    bio: string;
    vibe: SocialVibe;
    interests: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/social/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const result = await response.json();

      // 1. CLOSE THE EDIT MODAL
      setShowProfileSetup(false);

      // 2. Update the profile data
      setUserSocialProfile(result.socialProfile);
      setSuccess("Profile updated successfully!");

      // 3. Refresh to make sure social mode is active
      await checkSocialProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowProfileSetup(true);
  };

  const handleDeleteProfile = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your social profile? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/social/profile", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete profile");

      setUserSocialProfile(null);
      setHasSocialProfile(false);
      setIsSocialMode(false);
      setSuccess("Social profile deleted successfully!");
      await checkSocialProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete profile");
    } finally {
      setIsLoading(false);
    }
  };

  // NOTIFICATION SYSTEM: Notification handlers
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, read: true }),
      });

      if (response.ok) {
        markAsRead(notificationId); // This will update the context state
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      console.log("🔔 Notification clicked:", notification);

      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      let targetUrl = "";

      switch (notification.type) {
        case "HOP_ACCEPTED":
          // 🆕 OPEN PRIVATE CHAT WHEN HOP-IN IS ACCEPTED
          if (notification.chatroomId) {
            targetUrl = `/app/chat/private/${notification.chatroomId}`;
            console.log("💬 Opening private chat:", targetUrl);
          } else {
            console.warn("No chatroomId found in HOP_ACCEPTED notification");
          }
          break;

        case "MESSAGE":
          if (notification.crawlId) {
            targetUrl = `/app/chat/${notification.crawlId}`;
          } else if (notification.chatroomId) {
            // 🆕 HANDLE PRIVATE CHAT MESSAGES TOO
            targetUrl = `/app/chat/private/${notification.chatroomId}`;
          }
          break;

        case "HOP_REQUEST":
          // Stay on social page to see the request
          targetUrl = "/app/social";
          break;

        case "CRAWL_JOIN_REQUEST":
        case "CRAWL_JOIN_APPROVED":
          if (notification.crawlId) {
            targetUrl = `/app/crawls/${notification.crawlId}`;
          }
          break;

        default:
          console.log(
            "No specific action for notification type:",
            notification.type
          );
          return;
      }

      if (targetUrl) {
        console.log("🎯 Navigating to:", targetUrl);
        // Use window.location for reliable navigation
        window.location.href = targetUrl;
      }
    } catch (error) {
      console.error("💥 Error handling notification click:", error);
    }
  };

  // const handleAcceptHop = async (notification: NotificationData) => {
  //   if (!socket || !session?.user?.id) return;

  //   try {
  //     socket.emit("respond_hop_request", {
  //       hopInId: notification.hopInId,
  //       status: "ACCEPTED",
  //       userId: session.user.id,
  //     });

  //     handleMarkAsRead(notification.id);
  //     setSuccess(`You accepted the hop in request!`);
  //   } catch (err) {
  //     setError("Failed to accept hop request");
  //   }
  // };

  const handleAcceptHop = async (notification: NotificationData) => {
    if (
      !socket ||
      !isConnected ||
      !notification.hopInId ||
      !session?.user?.id
    ) {
      return;
    }

    try {
      console.log("✅ Accepting hop request:", notification.hopInId);

      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "ACCEPTED",
        userId: session.user.id,
      });

      await markAsRead(notification.id);

      // 🆕 UPDATED SUCCESS MESSAGE
      setSuccess(
        `Hop request accepted! Check your notifications for the chat link when you're ready to talk.`
      );
    } catch (err) {
      console.error("Error accepting hop request:", err);
      setError("Failed to accept hop request");
    }
  };

  const handleDeclineHop = async (notification: NotificationData) => {
    if (!socket || !session?.user?.id) return;

    try {
      socket.emit("respond_hop_request", {
        hopInId: notification.hopInId,
        status: "DECLINED",
        userId: session.user.id,
      });

      handleMarkAsRead(notification.id);
      setSuccess(`You declined the hop in request`);
    } catch (err) {
      setError("Failed to decline hop request");
    }
  };

  // NOTIFICATION SYSTEM: Replace modal with page navigation
  const handleNotificationsClick = () => {
    router.push("/app/notifications");
  };

  // Update useEffect to use filteredUsers
  useEffect(() => {
    setActiveUsers(filteredUsers);
  }, [filteredUsers]);

  useEffect(() => {
    if (isSocialMode) {
      fetchNearbyUsers();
      const interval = setInterval(fetchNearbyUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [isSocialMode, currentLocation, currentCity]);

  const activeUsersCount = filteredUsers.length;
  const nearbyBars = [
    ...new Set(
      filteredUsers.map((user) => user.currentBar?.name).filter(Boolean)
    ),
  ].length;
  const popularVibes = filteredUsers.reduce((acc, user) => {
    const vibe = user.vibe || "CASUAL";
    acc[vibe] = (acc[vibe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostPopularVibe = Object.keys(popularVibes).reduce(
    (a, b) => (popularVibes[a] > popularVibes[b] ? a : b),
    "CHILL"
  );

  // Determine when to show "How it works" section
  const showHowItWorks = !isSocialMode;

  return (
    <SocialContainer>
      <SocialHeader>
        <Title>Social Mode</Title>
        <Subtitle>
          See who&apos;s out tonight and connect with people nearby
        </Subtitle>
        {/* NOTIFICATION SYSTEM: Header Actions - Only show notification bell on desktop */}
        <HeaderActions>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <EditProfileButton
              onClick={() => router.push("/app/chat/my-chats")}
              style={{ marginLeft: "0.5rem" }}
            >
              {/* <span>💬</span> */}
              My Chats
            </EditProfileButton>

            {/* Connection Status */}

            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8rem",
                color: isConnected ? "#22c55e" : "#ef4444",
                background: "rgba(30, 41, 59, 0.6)",
                padding: "0.4rem 0.8rem",
                borderRadius: "20px",
                border: `1px solid ${
                  isConnected
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#22c55e" : "#ef4444",
                  animation: isConnected ? "pulse 2s infinite" : "none",
                }}
              />
              {isConnected ? "Connected" : "Disconnected"}
            </div> */}
            {/* Notification Bell - Updated to navigate to notifications page */}
            <DesktopNotificationBell
              onClick={handleNotificationsClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              }}
            >
              <span>🔔</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ec4899",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    border: "2px solid #0f172a",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </DesktopNotificationBell>
          </div>

          {/* Edit Profile Button */}
          {/* {hasSocialProfile && userSocialProfile && !showProfileSetup && (
            <EditProfileButton onClick={handleEditProfile}>
              <span>⚙️</span>
              Edit
            </EditProfileButton>
          )} */}
        </HeaderActions>
      </SocialHeader>

      {success && <SuccessState>{success}</SuccessState>}
      {error && showLocationWarning && <ErrorState>{error}</ErrorState>}
      {error && !showLocationWarning && <ErrorState>{error}</ErrorState>}

      {showProfileSetup && (
        <SetupSocialProfile
          onComplete={
            userSocialProfile ? handleProfileUpdate : handleProfileSetupComplete
          }
          onSkip={() => setShowProfileSetup(false)}
          isLoading={isLoading}
          existingProfile={userSocialProfile}
        />
      )}

      {!showProfileSetup && (
        <>
          {/* Social Toggle - Always at the top when not in profile setup */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1.5rem 0",
              background: "transparent ",
            }}
          >
            <SocialToggle
              isActive={isSocialMode}
              onToggle={toggleSocialMode}
              isLoading={isLoading}
            />
          </div>
          {/* City Detection Display - Only show when we have a detected city and social mode is active */}
          {isSocialMode && currentCity && !isDetectingCity && (
            <CityDetection>
              <CityBadge>
                <span>📍</span>
                <span>Currently in {currentCity}</span>
              </CityBadge>
            </CityDetection>
          )}

          {/* How it works section - Show below Social Toggle when relevant */}
          {showHowItWorks && (
            <HowItWorks>
              <HowItWorksTitle>How Social Mode Works</HowItWorksTitle>
              <StepsContainer>
                <Step>
                  <StepIcon>👤</StepIcon>
                  <StepTitle>Create Your Profile</StepTitle>
                  <StepDescription>
                    Set up your social profile with your vibe, interests, and
                    bio to let others know what you&apos;re about.
                  </StepDescription>
                </Step>
                <Step>
                  <StepIcon>📍</StepIcon>
                  <StepTitle>Enable Social Mode</StepTitle>
                  <StepDescription>
                    Turn on social mode to appear on the map and see other users
                    nearby in your city.
                  </StepDescription>
                </Step>
                <Step>
                  <StepIcon>🤝</StepIcon>
                  <StepTitle>Connect & Hop In</StepTitle>
                  <StepDescription>
                    Browse nearby users, send hop-in requests, and meet up with
                    like-minded people.
                  </StepDescription>
                </Step>
              </StepsContainer>
            </HowItWorks>
          )}

          {/* Social Mode Active Content */}
          {isSocialMode && (
            <>
              <StatsContainer>
                <StatCard>
                  <StatNumber>{activeUsersCount}</StatNumber>
                  <StatLabel>Online in {currentCity || "your city"}</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{nearbyBars}</StatNumber>
                  <StatLabel>Venues</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{mostPopularVibe}</StatNumber>
                  <StatLabel>Vibe</StatLabel>
                </StatCard>
              </StatsContainer>

              <ViewToggle>
                <ViewButton
                  $active={selectedView === "grid"}
                  onClick={() => setSelectedView("grid")}
                >
                  👥 Grid View
                </ViewButton>
                <ViewButton
                  $active={selectedView === "map"}
                  onClick={() => setSelectedView("map")}
                >
                  🗺️ Map View
                </ViewButton>
              </ViewToggle>

              <MapContainer $show={selectedView === "map"}>
                <SocialMap
                  users={filteredUsers}
                  onUserClick={handleHopIn}
                  currentLocation={
                    currentLocation || { lat: 60.1699, lng: 24.9384 }
                  }
                />
              </MapContainer>

              {selectedView === "grid" && (
                <>
                  {isLoadingUsers && (
                    <LoadingState>
                      <p>
                        Finding people near you in {currentCity || "your area"}
                        ...
                      </p>
                    </LoadingState>
                  )}

                  {!isLoadingUsers && filteredUsers.length > 0 && (
                    <UsersGrid>
                      {filteredUsers.map((user) => (
                        <UserCard
                          key={user.id}
                          onClick={() => handleHopIn(user)}
                        >
                          <UserImageContainer>
                            <UserImage $imageUrl={user.user.image || undefined}>
                              {!user.user.image &&
                                (user.user.name?.charAt(0).toUpperCase() ||
                                  "U")}
                            </UserImage>
                            <UserStatusBadge $status={user.socialStatus} />
                            <UserVibeBadge $vibe={user.vibe || "CASUAL"}>
                              {getVibeEmoji(user.vibe || "CASUAL")}
                            </UserVibeBadge>
                          </UserImageContainer>
                          <UserInfo>
                            <UserHeader>
                              <UserName>{user.user.name || "User"}</UserName>
                              <UserAge>{calculateAge(user)}</UserAge>
                            </UserHeader>
                            <UserDetails>
                              <DistanceBadge>
                                📍 {calculateDistance(user)}
                              </DistanceBadge>
                              <LocationInfo>
                                {getUserStatusDisplay(user)}
                              </LocationInfo>
                            </UserDetails>
                            <QuickActions>
                              <ActionButton
                                $variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHopIn(user);
                                }}
                              >
                                Hop In
                              </ActionButton>
                              {/* NOTIFICATION SYSTEM: Updated wave button */}
                              <ActionButton
                                $variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendWave(user);
                                }}
                              >
                                👋 Wave
                              </ActionButton>
                            </QuickActions>
                          </UserInfo>
                        </UserCard>
                      ))}
                    </UsersGrid>
                  )}

                  {!isLoadingUsers && filteredUsers.length === 0 && (
                    <EmptyUsersState>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                        👀
                      </div>
                      <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
                        No users nearby in {currentCity || "your area"}
                      </h3>
                      <p style={{ color: "#94a3b8" }}>
                        Be the first in {currentCity || "your city"} to activate
                        social mode!
                      </p>
                    </EmptyUsersState>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Hop In Modal */}
      {showHopInModal && selectedUser && (
        <ModalOverlay onClick={() => setShowHopInModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalUserImage $imageUrl={selectedUser.user.image || undefined}>
                {!selectedUser.user.image &&
                  (selectedUser.user.name?.charAt(0).toUpperCase() || "U")}
              </ModalUserImage>
              <ModalUserInfo>
                <ModalUserName>
                  {selectedUser.user.name || "User"}
                </ModalUserName>
                <ModalUserVibe>
                  {getVibeEmoji(selectedUser.vibe || "CASUAL")}{" "}
                  {selectedUser.vibe || "CASUAL"} Vibe
                </ModalUserVibe>
              </ModalUserInfo>
            </ModalHeader>

            {selectedUser.bio && (
              <ModalSection>
                <ModalSectionTitle>About</ModalSectionTitle>
                <ModalBio>{selectedUser.bio}</ModalBio>
              </ModalSection>
            )}

            {selectedUser.interests && selectedUser.interests.length > 0 && (
              <ModalSection>
                <ModalSectionTitle>Interests</ModalSectionTitle>
                <ModalInterests>
                  {selectedUser.interests.map((interest, index) => (
                    <ModalInterestTag key={index}>#{interest}</ModalInterestTag>
                  ))}
                </ModalInterests>
              </ModalSection>
            )}

            <ModalSection>
              <ModalSectionTitle>Current Status</ModalSectionTitle>
              <p style={{ color: "#cbd5e1", margin: 0 }}>
                {getUserDetailedStatus(selectedUser)}
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  margin: "0.5rem 0 0 0",
                }}
              >
                {selectedUser.currentBar
                  ? "They're at a venue nearby"
                  : "They're exploring the area"}
              </p>
            </ModalSection>

            <ModalActions>
              <ModalButton
                $variant="secondary"
                onClick={() => setShowHopInModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton
                $variant="primary"
                onClick={sendHopInRequest}
                disabled={isSendingHopIn}
              >
                {isSendingHopIn ? "Sending..." : "Send Hop In Request"}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </SocialContainer>
  );
};

export default Social;
// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// // import Image from "next/image";
// import SocialToggle from "./social-toggle/SocialToggle";
// // import SocialMap from "./social-map/SocialMap";
// import { UserSocialProfileWithRelations } from "@/types/social";
// import { SocialVibe } from "@prisma/client";
// import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";

// import dynamic from "next/dynamic";
// import {
//   ActionButton,
//   CityBadge,
//   CityDetection,
//   DistanceBadge,
//   EditProfileButton,
//   EmptyUsersState,
//   ErrorState,
//   HeaderActions,
//   HowItWorks,
//   HowItWorksTitle,
//   LoadingState,
//   LocationInfo,
//   MapContainer,
//   ModalActions,
//   ModalBio,
//   ModalButton,
//   ModalContent,
//   ModalHeader,
//   ModalInterests,
//   ModalInterestTag,
//   ModalOverlay,
//   ModalSection,
//   ModalSectionTitle,
//   ModalUserImage,
//   ModalUserInfo,
//   ModalUserName,
//   ModalUserVibe,
//   QuickActions,
//   SocialContainer,
//   SocialHeader,
//   StatCard,
//   StatLabel,
//   StatNumber,
//   StatsContainer,
//   Step,
//   StepDescription,
//   StepIcon,
//   StepsContainer,
//   StepTitle,
//   Subtitle,
//   SuccessState,
//   Title,
//   UserAge,
//   UserCard,
//   UserDetails,
//   UserHeader,
//   UserImage,
//   UserImageContainer,
//   UserInfo,
//   UserName,
//   UsersGrid,
//   UserStatusBadge,
//   UserVibeBadge,
//   ViewButton,
//   ViewToggle,
// } from "./Social.styles";
// import { useSocket } from "../contexts/SocketContext";
// import { NotificationData } from "@/types/socket";

// // NOTIFICATION SYSTEM IMPORTS

// export const SocialMap = dynamic(() => import("./social-map/SocialMap"), {
//   ssr: false,
//   loading: () => (
//     <div
//       style={{
//         background: "rgba(30, 41, 59, 0.6)",
//         borderRadius: "12px",
//         border: "1px solid rgba(139, 92, 246, 0.2)",
//         height: "400px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "#e2e8f0",
//         margin: "1.5rem 0",
//       }}
//     >
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
//         <p>Loading interactive map...</p>
//       </div>
//     </div>
//   ),
// });

// // Helper functions
// export const getVibeColor = (vibe: string) => {
//   switch (vibe) {
//     case "PARTY":
//       return "#ec4899";
//     case "CHILL":
//       return "#0ea5e9";
//     case "NETWORKING":
//       return "#10b981";
//     case "ADVENTUROUS":
//       return "#f59e0b";
//     default:
//       return "#8b5cf6";
//   }
// };

// export const getVibeEmoji = (vibe: string) => {
//   switch (vibe) {
//     case "PARTY":
//       return "🎉";
//     case "CHILL":
//       return "😌";
//     case "NETWORKING":
//       return "🤝";
//     case "ADVENTUROUS":
//       return "🌍";
//     default:
//       return "💜";
//   }
// };

// export const getSocialStatusText = (status: string) => {
//   switch (status) {
//     case "ONLINE":
//       return "Online";
//     case "SOCIAL_MODE":
//       return "Social";
//     case "IN_MEETUP":
//       return "In Meetup";
//     case "OFFLINE":
//       return "Offline";
//     default:
//       return "Available";
//   }
// };

// // Calculate age from birth date if available, otherwise use a default
// const calculateAge = (user: UserSocialProfileWithRelations): number => {
//   const hash = user.userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
//   return 22 + (hash % 15);
// };

// // Finnish cities with their approximate coordinates and bounds
// const FINNISH_CITIES = {
//   Helsinki: {
//     lat: 60.1699,
//     lng: 24.9384,
//     bounds: { north: 60.2978, south: 60.1094, west: 24.7386, east: 25.2542 },
//   },
//   Espoo: {
//     lat: 60.2055,
//     lng: 24.6559,
//     bounds: { north: 60.35, south: 60.1, west: 24.5, east: 24.9 },
//   },
//   Tampere: {
//     lat: 61.4978,
//     lng: 23.761,
//     bounds: { north: 61.6, south: 61.4, west: 23.5, east: 24.1 },
//   },
//   Turku: {
//     lat: 60.4518,
//     lng: 22.2666,
//     bounds: { north: 60.55, south: 60.35, west: 22.1, east: 22.5 },
//   },
//   Oulu: {
//     lat: 65.0121,
//     lng: 25.4651,
//     bounds: { north: 65.1, south: 64.9, west: 25.3, east: 25.7 },
//   },
//   Vantaa: {
//     lat: 60.2934,
//     lng: 25.0378,
//     bounds: { north: 60.4, south: 60.2, west: 24.85, east: 25.25 },
//   },
//   Lahti: {
//     lat: 60.9827,
//     lng: 25.6612,
//     bounds: { north: 61.05, south: 60.9, west: 25.55, east: 25.8 },
//   },
//   Kuopio: {
//     lat: 62.8924,
//     lng: 27.677,
//     bounds: { north: 63.0, south: 62.75, west: 27.5, east: 27.9 },
//   },
//   Jyväskylä: {
//     lat: 62.2426,
//     lng: 25.7473,
//     bounds: { north: 62.3, south: 62.15, west: 25.65, east: 25.85 },
//   },
//   Pori: {
//     lat: 61.4851,
//     lng: 21.7975,
//     bounds: { north: 61.55, south: 61.4, west: 21.7, east: 21.9 },
//   },
// };

// // Helper function to detect which Finnish city the coordinates are in
// const detectFinnishCity = (lat: number, lng: number): string => {
//   for (const [city, data] of Object.entries(FINNISH_CITIES)) {
//     const bounds = data.bounds;
//     if (
//       lat >= bounds.south &&
//       lat <= bounds.north &&
//       lng >= bounds.west &&
//       lng <= bounds.east
//     ) {
//       return city;
//     }
//   }

//   // If no city matched, use reverse geocoding as fallback
//   return "Unknown";
// };

// // Enhanced reverse geocoding for Finnish cities
// const getCityFromCoordinates = async (
//   lat: number,
//   lng: number
// ): Promise<string> => {
//   try {
//     // First try to detect using our bounds
//     const detectedCity = detectFinnishCity(lat, lng);
//     if (detectedCity !== "Unknown") {
//       return detectedCity;
//     }

//     // Fallback to API for more accurate detection
//     const response = await fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//     );

//     if (!response.ok) throw new Error("Geocoding API failed");

//     const data = await response.json();

//     // Check if the city is in Finland
//     if (data.countryName === "Finland") {
//       return data.city || data.locality || "Unknown City in Finland";
//     }

//     return "Not in Finland";
//   } catch (error) {
//     console.error("Error getting city from coordinates:", error);

//     // Final fallback - check if coordinates are roughly in Finland
//     if (lat > 59.5 && lat < 70.0 && lng > 19.0 && lng < 31.0) {
//       return "Unknown City in Finland";
//     }

//     return "Location not in Finland";
//   }
// };

// // Filter users by city
// const filterUsersByCity = (
//   users: UserSocialProfileWithRelations[],
//   targetCity: string
// ): UserSocialProfileWithRelations[] => {
//   if (
//     targetCity === "Not in Finland" ||
//     targetCity === "Location not in Finland"
//   ) {
//     return []; // No users if not in Finland
//   }

//   return users.filter((user) => {
//     if (!user.locationLat || !user.locationLng) return false;

//     try {
//       const userCity = detectFinnishCity(user.locationLat, user.locationLng);

//       // Direct city match
//       if (userCity === targetCity) {
//         return true;
//       }

//       // Handle "Unknown City in Finland" case - include them if we're also in an unknown Finnish location
//       if (targetCity === "Unknown City in Finland" && userCity === "Unknown") {
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error("Error filtering user by city:", error);
//       return false;
//     }
//   });
// };

// interface LocationData {
//   locationLat?: number;
//   locationLng?: number;
// }

// interface NearbyUsersData {
//   users: UserSocialProfileWithRelations[];
// }

// // Fixed DebugInfo interface with all possible properties
// interface DebugInfo {
//   type: string;
//   loading?: boolean;
//   success?: boolean;
//   data?: unknown;
//   error?: string;
//   message?: string;
//   source?: string;
//   count?: number;
//   users?: unknown[];
//   hasProfile?: boolean;
//   profile?: unknown;
//   timestamp?: string;
//   status?: number;
//   result?: unknown;
//   // Added missing properties
//   city?: string;
//   coordinates?: { lat: number; lng: number };
//   totalUsers?: number;
//   filteredCount?: number;
// }

// const Social = () => {
//   const { data: session } = useSession();
//   const router = useRouter();

//   // NOTIFICATION SYSTEM STATE
//   const {
//     socket,
//     isConnected,
//     addNotification,
//     markAsRead,
//     notifications,
//     unreadCount,
//   } = useSocket(); // const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   // const [unreadCount, setUnreadCount] = useState(0);

//   // const [isSocialMode, setIsSocialMode] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);
//   const [showProfileSetup, setShowProfileSetup] = useState(false);
//   const [hasSocialProfile, setHasSocialProfile] = useState(false);
//   const [userSocialProfile, setUserSocialProfile] =
//     useState<UserSocialProfileWithRelations | null>(null);
//   const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
//   const [selectedView, setSelectedView] = useState<"grid" | "map">("grid");
//   const [selectedUser, setSelectedUser] =
//     useState<UserSocialProfileWithRelations | null>(null);
//   const [showHopInModal, setShowHopInModal] = useState(false);
//   const [isSendingHopIn, setIsSendingHopIn] = useState(false);

//   // Add new state for city detection
//   const [currentCity, setCurrentCity] = useState<string>("");
//   const [isDetectingCity, setIsDetectingCity] = useState(false);
//   const [allUsers, setAllUsers] = useState<UserSocialProfileWithRelations[]>(
//     []
//   );
//   const [filteredUsers, setFilteredUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [showLocationWarning, setShowLocationWarning] = useState(false);

//   // Initialize isSocialMode from localStorage first, then update from API
//   // const [isSocialMode, setIsSocialMode] = useState(() => {
//   //   if (typeof window !== "undefined") {
//   //     const saved = localStorage.getItem("socialMode");
//   //     return saved ? JSON.parse(saved) : false;
//   //   }
//   //   return false;
//   // });
//   const [isSocialMode, setIsSocialMode] = useState(false);

//   // Add this useEffect to handle logout cleanup
//   useEffect(() => {
//     if (!session) {
//       // User logged out - reset everything
//       setIsSocialMode(false);
//       setAllUsers([]);
//       setFilteredUsers([]);
//       setCurrentLocation(null);
//       setCurrentCity("");
//     }
//   }, [session]);

//   // NOTIFICATION SYSTEM: Socket connection and event listeners
//   useEffect(() => {
//     if (!socket || !session?.user?.id) return;

//     // Join user's private room
//     socket.emit("join_user_room", session.user.id);

//     // Listen for new notifications
//     socket.on("new_notification", (notification) => {
//       addNotification(notification);
//       setSuccess(`New notification: ${notification.message}`);
//     });

//     // Listen for hop request responses
//     socket.on("hop_request_accepted", (hopIn) => {
//       setSuccess(`${hopIn.toUser.name} accepted your hop in request! 🎉`);
//     });

//     // Listen for errors
//     socket.on("error", (error) => {
//       setError(error);
//     });

//     return () => {
//       socket.off("new_notification");
//       socket.off("hop_request_accepted");
//       socket.off("error");
//     };
//   }, [socket, session, addNotification]);

//   // NOTIFICATION SYSTEM: Fetch existing notifications on mount
//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchNotifications();
//     }
//   }, [session]);

//   // NOTIFICATION SYSTEM: Fetch notifications from API
//   // const fetchNotifications = async () => {
//   //   try {
//   //     const response = await fetch("/api/notifications");
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setNotifications(data.notifications);
//   //       setUnreadCount(data.unreadCount);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching notifications:", error);
//   //   }
//   // };

//   // In your Social component, add debugging:
//   // const fetchNotifications = async () => {
//   //   try {
//   //     console.log("📡 Fetching notifications...");
//   //     const response = await fetch("/api/notifications");
//   //     console.log("📨 API Response status:", response.status);

//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       console.log("✅ Notifications data:", data);

//   //       // Add notifications to context instead of local state
//   //       data.notifications?.forEach((notification: NotificationData) => {
//   //         addNotification(notification);
//   //       });
//   //     } else {
//   //       console.error("❌ API Error:", response.status);
//   //     }
//   //   } catch (error) {
//   //     console.error("💥 Error fetching notifications:", error);
//   //   }
//   // };
//   const fetchNotifications = async () => {
//     try {
//       console.log("📡 Fetching notifications...");
//       const response = await fetch("/api/notifications");
//       console.log("📨 API Response status:", response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log(
//           "✅ Notifications data received:",
//           data.notifications?.length
//         );

//         // Clear existing notifications by fetching fresh data
//         // The SocketContext will handle deduplication
//         data.notifications?.forEach((notification: NotificationData) => {
//           addNotification(notification);
//         });
//       } else {
//         console.error("❌ API Error:", response.status);
//       }
//     } catch (error) {
//       console.error("💥 Error fetching notifications:", error);
//     }
//   };

//   // NOTIFICATION SYSTEM: Send wave to user
//   const sendWave = async (user: UserSocialProfileWithRelations) => {
//     if (!socket || !session?.user?.id) {
//       setError("Not connected to server");
//       return;
//     }

//     try {
//       socket.emit("send_wave", {
//         fromUserId: session.user.id,
//         toUserId: user.userId,
//       });

//       setSuccess(`You waved at ${user.user.name || "user"}! 👋`);
//     } catch (err) {
//       setError("Failed to send wave");
//     }
//   };

//   // Check if user has social profile on component mount
//   useEffect(() => {
//     checkSocialProfile();
//   }, []);

//   // Auto-clear success messages after 5 seconds
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   // Fixed useEffect with proper null check for error
//   useEffect(() => {
//     if (error) {
//       if (
//         error.includes("Using Helsinki as default") ||
//         error.includes("Geolocation not supported")
//       ) {
//         const timer = setTimeout(() => {
//           setError(null);
//           setShowLocationWarning(false);
//         }, 8000);
//         return () => clearTimeout(timer);
//       } else {
//         const timer = setTimeout(() => {
//           setError(null);
//         }, 8000);
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [error]);

//   const calculateDistance = (user: UserSocialProfileWithRelations): string => {
//     if (!currentLocation || !user.locationLat || !user.locationLng) {
//       return "Nearby";
//     }

//     const R = 6371;
//     const dLat = ((user.locationLat - currentLocation.lat) * Math.PI) / 180;
//     const dLon = ((user.locationLng - currentLocation.lng) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((currentLocation.lat * Math.PI) / 180) *
//         Math.cos((user.locationLat * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     if (distance < 0.1) return "Very close";
//     if (distance < 0.5) return `${Math.round(distance * 1000)}m`;
//     if (distance < 1) return "<1km";
//     return `${distance.toFixed(1)}km`;
//   };

//   // const checkSocialProfile = async () => {
//   //   try {
//   //     console.log("🔍 Checking social profile...");
//   //     const response = await fetch("/api/social/profile");
//   //     console.log("📨 Profile check response status:", response.status);

//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       console.log("✅ Profile check data:", data);
//   //       setHasSocialProfile(!!data.socialProfile);
//   //       setUserSocialProfile(data.socialProfile);

//   //       setDebugInfo({
//   //         type: "profile_check",
//   //         hasProfile: !!data.socialProfile,
//   //         profile: data.socialProfile,
//   //         timestamp: new Date().toISOString(),
//   //       });
//   //     } else {
//   //       const errorText = await response.text();
//   //       console.error("❌ Profile check error:", response.status, errorText);
//   //       setDebugInfo({
//   //         type: "profile_check_error",
//   //         status: response.status,
//   //         error: errorText,
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error("💥 Error checking social profile:", error);
//   //     setDebugInfo({
//   //       type: "profile_check_exception",
//   //       error: error instanceof Error ? error.message : "Unknown error",
//   //     });
//   //   }
//   // };
//   const checkSocialProfile = async () => {
//     try {
//       console.log("🔍 Checking social profile...");
//       const response = await fetch("/api/social/profile");
//       console.log("📨 Profile check response status:", response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log("✅ Profile check data:", data);

//         setHasSocialProfile(!!data.socialProfile);
//         setUserSocialProfile(data.socialProfile);

//         // ✅ Set social mode ONLY from database, remove localStorage
//         if (data.socialProfile?.isSocialMode) {
//           console.log("🎯 Setting social mode to ACTIVE from database");
//           setIsSocialMode(true);

//           // If social mode is active, also set location and fetch users
//           if (
//             data.socialProfile.locationLat &&
//             data.socialProfile.locationLng
//           ) {
//             const location = {
//               lat: data.socialProfile.locationLat,
//               lng: data.socialProfile.locationLng,
//             };
//             setCurrentLocation(location);
//             await detectUserCity(location.lat, location.lng);
//             await fetchNearbyUsers();
//           }
//         } else {
//           console.log("🎯 Setting social mode to INACTIVE from database");
//           setIsSocialMode(false);
//         }
//       }
//     } catch (error) {
//       console.error("💥 Error checking social profile:", error);
//     }
//   };

//   // Enhanced city detection function
//   const detectUserCity = async (lat: number, lng: number): Promise<void> => {
//     setIsDetectingCity(true);
//     setError(null);

//     try {
//       console.log("🌍 Detecting city for coordinates:", { lat, lng });

//       const city = await getCityFromCoordinates(lat, lng);
//       console.log("📍 Detected city:", city);

//       setCurrentCity(city);

//       setDebugInfo({
//         type: "city_detected",
//         city: city,
//         coordinates: { lat, lng },
//         timestamp: new Date().toISOString(),
//       });

//       // Show success message if in Finland
//       if (city !== "Not in Finland" && city !== "Location not in Finland") {
//         setSuccess(`Welcome to ${city}! Showing users in your city.`);
//       } else {
//         setError(
//           "You appear to be outside Finland. Social mode may not work properly."
//         );
//       }
//     } catch (error) {
//       console.error("Error detecting city:", error);
//       setCurrentCity("Unknown");
//       setError("Could not detect your city. Showing all Finnish users.");
//     } finally {
//       setIsDetectingCity(false);
//     }
//   };

//   // Update fetchNearbyUsers to filter by current city
//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;
//     setIsLoadingUsers(true);
//     try {
//       // Use a larger radius to get users from wider area in Finland
//       const url = currentLocation
//         ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=100000` // 100km radius
//         : "/api/social/status";

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch nearby users");

//       const data: NearbyUsersData = await response.json();

//       console.log("🌍 Fetched all users:", data.users.length);

//       // Store all users
//       setAllUsers(data.users);

//       // Filter users by current city
//       if (currentCity) {
//         const usersInCity = filterUsersByCity(data.users, currentCity);
//         setFilteredUsers(usersInCity);

//         console.log(`📍 Filtered users in ${currentCity}:`, usersInCity.length);

//         setDebugInfo({
//           type: "users_filtered_by_city",
//           totalUsers: data.users.length,
//           filteredCount: usersInCity.length,
//           city: currentCity,
//           timestamp: new Date().toISOString(),
//         });
//       } else {
//         // If no city detected, show all users (fallback)
//         setFilteredUsers(data.users);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch nearby users"
//       );
//     } finally {
//       setIsLoadingUsers(false);
//     }
//   };

//   // const toggleSocialMode = async (status: boolean) => {
//   //   console.log("🔘 toggleSocialMode called:", {
//   //     status,
//   //     hasSocialProfile,
//   //     userSocialProfile: !!userSocialProfile,
//   //   });

//   //   setIsLoading(true);
//   //   setError(null);
//   //   setSuccess(null);
//   //   setShowLocationWarning(false);

//   //   try {
//   //     if (status && !hasSocialProfile && !userSocialProfile) {
//   //       console.log("🚫 No profile found, showing setup");
//   //       setShowProfileSetup(true);
//   //       setIsLoading(false);
//   //       return;
//   //     }

//   //     let locationData: LocationData = {};
//   //     let usedFallbackLocation = false;

//   //     if (status && navigator.geolocation) {
//   //       try {
//   //         const position = await new Promise<GeolocationPosition>(
//   //           (resolve, reject) => {
//   //             navigator.geolocation.getCurrentPosition(resolve, reject, {
//   //               enableHighAccuracy: true,
//   //               timeout: 10000, // Increased timeout for better accuracy
//   //               maximumAge: 300000, // 5 minutes
//   //             });
//   //           }
//   //         );

//   //         locationData = {
//   //           locationLat: position.coords.latitude,
//   //           locationLng: position.coords.longitude,
//   //         };

//   //         const newLocation = {
//   //           lat: position.coords.latitude,
//   //           lng: position.coords.longitude,
//   //         };

//   //         setCurrentLocation(newLocation);

//   //         // Detect city when we have location
//   //         console.log("📍 Getting city for location:", newLocation);
//   //         await detectUserCity(newLocation.lat, newLocation.lng);
//   //       } catch (geoError) {
//   //         console.error("Geolocation error:", geoError);
//   //         // Use Helsinki as fallback
//   //         const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//   //         setCurrentLocation(fallbackLocation);
//   //         setCurrentCity("Helsinki");
//   //         usedFallbackLocation = true;
//   //         setShowLocationWarning(true);
//   //         setError(
//   //           "Using Helsinki as default location. Enable location services for accurate city detection."
//   //         );
//   //       }
//   //     } else if (status) {
//   //       // No geolocation support
//   //       const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//   //       setCurrentLocation(fallbackLocation);
//   //       setCurrentCity("Helsinki");
//   //       usedFallbackLocation = true;
//   //       setShowLocationWarning(true);
//   //       setError(
//   //         "Geolocation not supported. Using Helsinki as default location."
//   //       );
//   //     }

//   //     const response = await fetch("/api/social/status", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         isActive: status,
//   //         ...locationData,
//   //         vibe: userSocialProfile?.vibe,
//   //         interests: userSocialProfile?.interests,
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData.error || "Failed to update social status");
//   //     }

//   //     const result = await response.json();
//   //     setUserSocialProfile(result.socialProfile);
//   //     setIsSocialMode(status);

//   //     if (status) {
//   //       if (
//   //         currentCity &&
//   //         currentCity !== "Not in Finland" &&
//   //         currentCity !== "Location not in Finland"
//   //       ) {
//   //         if (usedFallbackLocation) {
//   //           setSuccess(
//   //             `Social mode activated in ${currentCity}! Finding users nearby...`
//   //           );
//   //         } else {
//   //           setSuccess(
//   //             `Social mode activated in ${currentCity}! Finding users nearby...`
//   //           );
//   //         }
//   //       } else {
//   //         setSuccess("Social mode activated! Finding users nearby...");
//   //       }
//   //       await fetchNearbyUsers();
//   //     } else {
//   //       setSuccess("Social mode deactivated");
//   //       setAllUsers([]);
//   //       setFilteredUsers([]);
//   //     }
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err.message : "An error occurred");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const toggleSocialMode = async (status: boolean) => {
//     // Early return if no session
//     if (!session?.user?.id) {
//       console.log("🚫 No session - cannot toggle social mode");
//       setIsSocialMode(false);
//       return;
//     }

//     console.log("🔘 toggleSocialMode called:", { status });

//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);
//     setShowLocationWarning(false);

//     try {
//       if (status && !hasSocialProfile && !userSocialProfile) {
//         console.log("🚫 No profile found, showing setup");
//         setShowProfileSetup(true);
//         setIsLoading(false);
//         return;
//       }

//       let locationData: LocationData = {};
//       let usedFallbackLocation = false;

//       if (status && navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>(
//             (resolve, reject) => {
//               navigator.geolocation.getCurrentPosition(resolve, reject, {
//                 enableHighAccuracy: true,
//                 timeout: 10000,
//                 maximumAge: 300000,
//               });
//             }
//           );

//           locationData = {
//             locationLat: position.coords.latitude,
//             locationLng: position.coords.longitude,
//           };

//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };

//           setCurrentLocation(newLocation);
//           await detectUserCity(newLocation.lat, newLocation.lng);
//         } catch (geoError) {
//           console.error("Geolocation error:", geoError);
//           const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//           setCurrentLocation(fallbackLocation);
//           setCurrentCity("Helsinki");
//           usedFallbackLocation = true;
//           setShowLocationWarning(true);
//           setError(
//             "Using Helsinki as default location. Enable location services for accurate city detection."
//           );
//         }
//       } else if (status) {
//         const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//         setCurrentLocation(fallbackLocation);
//         setCurrentCity("Helsinki");
//         usedFallbackLocation = true;
//         setShowLocationWarning(true);
//         setError(
//           "Geolocation not supported. Using Helsinki as default location."
//         );
//       }

//       const response = await fetch("/api/social/status", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           isActive: status,
//           ...locationData,
//           vibe: userSocialProfile?.vibe,
//           interests: userSocialProfile?.interests,
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
//         if (
//           currentCity &&
//           currentCity !== "Not in Finland" &&
//           currentCity !== "Location not in Finland"
//         ) {
//           if (usedFallbackLocation) {
//             setSuccess(
//               `Social mode activated in ${currentCity}! Finding users nearby...`
//             );
//           } else {
//             setSuccess(
//               `Social mode activated in ${currentCity}! Finding users nearby...`
//             );
//           }
//         } else {
//           setSuccess("Social mode activated! Finding users nearby...");
//         }
//         await fetchNearbyUsers();
//       } else {
//         setSuccess("Social mode deactivated");
//         setAllUsers([]);
//         setFilteredUsers([]);
//       }
//     } catch (err) {
//       // If API call fails, revert localStorage
//       setIsSocialMode(!status);
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // NOTIFICATION SYSTEM: Updated hop in function using Socket.io
//   const handleHopIn = async (user: UserSocialProfileWithRelations) => {
//     setSelectedUser(user);
//     setShowHopInModal(true);
//   };

//   // NOTIFICATION SYSTEM: Updated send hop in request using Socket.io
//   const sendHopInRequest = async () => {
//     if (!selectedUser || !socket || !session?.user?.id) return;

//     setIsSendingHopIn(true);
//     try {
//       socket.emit("send_hop_request", {
//         fromUserId: session.user.id,
//         toUserId: selectedUser.userId,
//         barId: selectedUser.currentBarId,
//         message: `Hey ${
//           selectedUser.user.name || "there"
//         }! I'd like to join you.`,
//       });

//       setSuccess(`Hop in request sent to ${selectedUser.user.name || "user"}!`);
//       setShowHopInModal(false);
//       setSelectedUser(null);
//     } catch (err) {
//       setError("Failed to send hop in request");
//     } finally {
//       setIsSendingHopIn(false);
//     }
//   };

//   const handleProfileSetupComplete = async (profileData: {
//     bio: string;
//     vibe: SocialVibe;
//     interests: string[];
//   }) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/social/create-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileData),
//       });
//       if (!response.ok) throw new Error("Failed to save profile");
//       const result = await response.json();
//       setUserSocialProfile(result.socialProfile);
//       setHasSocialProfile(true);
//       setShowProfileSetup(false);
//       setSuccess("Profile created!");
//       await checkSocialProfile();
//       await toggleSocialMode(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to save profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditProfile = () => {
//     setShowProfileSetup(true);
//   };

//   const handleDeleteProfile = async () => {
//     if (
//       !confirm(
//         "Are you sure you want to delete your social profile? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/social/profile", {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Failed to delete profile");

//       setUserSocialProfile(null);
//       setHasSocialProfile(false);
//       setIsSocialMode(false);
//       setSuccess("Social profile deleted successfully!");
//       await checkSocialProfile();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // NOTIFICATION SYSTEM: Notification handlers
//   const handleMarkAsRead = async (notificationId: string) => {
//     try {
//       const response = await fetch("/api/notifications", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ notificationId, read: true }),
//       });

//       if (response.ok) {
//         markAsRead(notificationId); // This will update the context state
//       }
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const handleAcceptHop = async (notification: NotificationData) => {
//     if (!socket || !session?.user?.id) return;

//     try {
//       socket.emit("respond_hop_request", {
//         hopInId: notification.hopInId,
//         status: "ACCEPTED",
//         userId: session.user.id,
//       });

//       handleMarkAsRead(notification.id);
//       setSuccess(`You accepted the hop in request!`);
//     } catch (err) {
//       setError("Failed to accept hop request");
//     }
//   };

//   const handleDeclineHop = async (notification: NotificationData) => {
//     if (!socket || !session?.user?.id) return;

//     try {
//       socket.emit("respond_hop_request", {
//         hopInId: notification.hopInId,
//         status: "DECLINED",
//         userId: session.user.id,
//       });

//       handleMarkAsRead(notification.id);
//       setSuccess(`You declined the hop in request`);
//     } catch (err) {
//       setError("Failed to decline hop request");
//     }
//   };

//   // NOTIFICATION SYSTEM: Notifications Panel Component
//   // NOTIFICATION SYSTEM: Notifications Panel Component
//   const NotificationsPanel = () => {
//     const { notifications, unreadCount, markAsRead } = useSocket();

//     if (!showNotifications) return null;

//     return (
//       <ModalOverlay onClick={() => setShowNotifications(false)}>
//         <ModalContent
//           onClick={(e) => e.stopPropagation()}
//           style={{
//             maxWidth: "500px",
//             maxHeight: "80vh",
//             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             border: "1px solid rgba(139, 92, 246, 0.3)",
//             boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
//           }}
//         >
//           <ModalHeader
//             style={{
//               background: "rgba(30, 41, 59, 0.8)",
//               borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
//               padding: "1.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 width: "100%",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.75rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "32px",
//                     height: "32px",
//                     background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
//                     borderRadius: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "16px",
//                   }}
//                 >
//                   🔔
//                 </div>
//                 <div>
//                   <h3
//                     style={{
//                       margin: 0,
//                       color: "#f8fafc",
//                       fontSize: "1.25rem",
//                       fontWeight: "600",
//                     }}
//                   >
//                     Notifications
//                   </h3>
//                   <p
//                     style={{
//                       margin: 0,
//                       color: "#94a3b8",
//                       fontSize: "0.875rem",
//                     }}
//                   >
//                     {unreadCount > 0
//                       ? `${unreadCount} unread ${
//                           unreadCount === 1 ? "message" : "messages"
//                         }`
//                       : "All caught up!"}
//                   </p>
//                 </div>
//               </div>
//               <ModalButton
//                 $variant="secondary"
//                 onClick={() => setShowNotifications(false)}
//                 style={{
//                   padding: "8px 12px",
//                   background: "rgba(139, 92, 246, 0.1)",
//                   border: "1px solid rgba(139, 92, 246, 0.3)",
//                 }}
//               >
//                 ✕
//               </ModalButton>
//             </div>
//           </ModalHeader>

//           <div
//             style={{
//               overflowY: "auto",
//               padding: "1rem",
//               background: "rgba(15, 23, 42, 0.5)",
//             }}
//           >
//             {notifications.length === 0 ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   color: "#94a3b8",
//                   padding: "3rem 2rem",
//                   background: "rgba(30, 41, 59, 0.3)",
//                   borderRadius: "12px",
//                   border: "1px dashed rgba(139, 92, 246, 0.2)",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "3rem",
//                     marginBottom: "1rem",
//                     opacity: 0.5,
//                   }}
//                 >
//                   🔔
//                 </div>
//                 <h4
//                   style={{
//                     color: "#e2e8f0",
//                     marginBottom: "0.5rem",
//                     fontWeight: "500",
//                   }}
//                 >
//                   No notifications yet
//                 </h4>
//                 <p style={{ margin: 0, fontSize: "0.875rem" }}>
//                   Notifications will appear here when you receive waves or
//                   hop-in requests
//                 </p>
//               </div>
//             ) : (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "0.75rem",
//                 }}
//               >
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     style={{
//                       background: notification.read
//                         ? "rgba(30, 41, 59, 0.6)"
//                         : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)",
//                       border: notification.read
//                         ? "1px solid rgba(139, 92, 246, 0.1)"
//                         : "1px solid rgba(139, 92, 246, 0.3)",
//                       borderRadius: "12px",
//                       padding: "1.25rem",
//                       cursor: "pointer",
//                       transition: "all 0.2s ease",
//                       position: "relative",
//                       overflow: "hidden",
//                     }}
//                     onClick={() =>
//                       !notification.read && markAsRead(notification.id)
//                     }
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                       e.currentTarget.style.boxShadow =
//                         "0 8px 25px rgba(139, 92, 246, 0.15)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "none";
//                     }}
//                   >
//                     {/* Unread indicator */}
//                     {!notification.read && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "12px",
//                           right: "12px",
//                           width: "8px",
//                           height: "8px",
//                           background: "#ec4899",
//                           borderRadius: "50%",
//                           animation: "pulse 2s infinite",
//                         }}
//                       ></div>
//                     )}

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         gap: "1rem",
//                       }}
//                     >
//                       <ModalUserImage
//                         $imageUrl={notification.fromUser?.image || undefined}
//                         style={{
//                           width: "44px",
//                           height: "44px",
//                           fontSize: "16px",
//                           border: notification.read
//                             ? "2px solid rgba(139, 92, 246, 0.3)"
//                             : "2px solid #8b5cf6",
//                         }}
//                       >
//                         {!notification.fromUser?.image &&
//                           (notification.fromUser?.name
//                             ?.charAt(0)
//                             .toUpperCase() ||
//                             "U")}
//                       </ModalUserImage>

//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <p
//                           style={{
//                             margin: "0 0 0.5rem 0",
//                             color: "#f8fafc",
//                             fontWeight: notification.read ? "400" : "600",
//                             fontSize: "0.95rem",
//                             lineHeight: "1.4",
//                           }}
//                         >
//                           {notification.message}
//                         </p>

//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             flexWrap: "wrap",
//                             gap: "0.5rem",
//                           }}
//                         >
//                           <small
//                             style={{
//                               color: notification.read ? "#64748b" : "#94a3b8",
//                               fontSize: "0.75rem",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "0.25rem",
//                             }}
//                           >
//                             <span>🕒</span>
//                             {new Date(
//                               notification.createdAt
//                             ).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </small>

//                           {notification.type === "HOP_REQUEST" &&
//                             notification.hopInId && (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   gap: "0.5rem",
//                                   flexShrink: 0,
//                                 }}
//                               >
//                                 <ModalButton
//                                   $variant="primary"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleAcceptHop(notification);
//                                   }}
//                                   style={{
//                                     padding: "6px 12px",
//                                     fontSize: "12px",
//                                     background:
//                                       "linear-gradient(135deg, #10b981, #059669)",
//                                     border: "none",
//                                   }}
//                                 >
//                                   ✅ Accept
//                                 </ModalButton>
//                                 <ModalButton
//                                   $variant="secondary"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeclineHop(notification);
//                                   }}
//                                   style={{
//                                     padding: "6px 12px",
//                                     fontSize: "12px",
//                                     background: "rgba(239, 68, 68, 0.1)",
//                                     border: "1px solid rgba(239, 68, 68, 0.3)",
//                                     color: "#ef4444",
//                                   }}
//                                 >
//                                   ❌ Decline
//                                 </ModalButton>
//                               </div>
//                             )}

//                           {notification.type === "WAVE" && (
//                             <div
//                               style={{
//                                 background: "rgba(34, 197, 94, 0.1)",
//                                 color: "#22c55e",
//                                 padding: "4px 8px",
//                                 borderRadius: "6px",
//                                 fontSize: "0.75rem",
//                                 border: "1px solid rgba(34, 197, 94, 0.2)",
//                               }}
//                             >
//                               👋 Wave
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Add some custom styles for the pulse animation */}
//           <style jsx>{`
//             @keyframes pulse {
//               0% {
//                 opacity: 1;
//               }
//               50% {
//                 opacity: 0.5;
//               }
//               100% {
//                 opacity: 1;
//               }
//             }
//           `}</style>
//         </ModalContent>
//       </ModalOverlay>
//     );
//   };
//   // Update useEffect to use filteredUsers
//   useEffect(() => {
//     setActiveUsers(filteredUsers);
//   }, [filteredUsers]);

//   // Debug functions (commented but not removed)
//   /*
//   const testDatabase = async () => {
//     console.log("🧪 Testing database connection...");
//     setDebugInfo({ type: "database_test", loading: true });

//     try {
//       const response = await fetch("/api/social/profile");
//       const data = await response.json();
//       console.log("🧪 Database test result:", data);

//       setDebugInfo({
//         type: "database_test",
//         success: true,
//         data: data,
//         timestamp: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("🧪 Database test error:", error);
//       setDebugInfo({
//         type: "database_test",
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//         timestamp: new Date().toISOString(),
//       });
//     }
//   };

//   const testDirectSave = async () => {
//     console.log("🧪 Testing direct save...");
//     setDebugInfo({ type: "direct_save_test", loading: true });

//     try {
//       const response = await fetch("/api/social/create-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bio: "Test Direct Save",
//           vibe: "PARTY",
//           interests: ["Testing", "Debug", "Development"],
//         }),
//       });

//       const result = await response.json();
//       console.log("🧪 Direct save result:", result);

//       setDebugInfo({
//         type: "direct_save_test",
//         success: response.ok,
//         result: result,
//         timestamp: new Date().toISOString(),
//       });

//       if (response.ok) {
//         setSuccess("Test profile saved successfully!");
//         await checkSocialProfile();
//       } else {
//         setError(result.message || "Failed to save test profile");
//       }
//     } catch (error) {
//       console.error("🧪 Direct save error:", error);
//       setDebugInfo({
//         type: "direct_save_test",
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//         timestamp: new Date().toISOString(),
//       });
//       setError("Failed to save test profile");
//     }
//   };

//   const clearMessages = () => {
//     setError(null);
//     setSuccess(null);
//     setShowLocationWarning(false);
//   };
//   */

//   useEffect(() => {
//     if (isSocialMode) {
//       fetchNearbyUsers();
//       const interval = setInterval(fetchNearbyUsers, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isSocialMode, currentLocation, currentCity]);

//   const activeUsersCount = filteredUsers.length;
//   const nearbyBars = [
//     ...new Set(
//       filteredUsers.map((user) => user.currentBar?.name).filter(Boolean)
//     ),
//   ].length;
//   const popularVibes = filteredUsers.reduce((acc, user) => {
//     const vibe = user.vibe || "CASUAL";
//     acc[vibe] = (acc[vibe] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);
//   const mostPopularVibe = Object.keys(popularVibes).reduce(
//     (a, b) => (popularVibes[a] > popularVibes[b] ? a : b),
//     "CHILL"
//   );

//   // Determine when to show "How it works" section
//   const showHowItWorks = !session || !hasSocialProfile || !isSocialMode;

//   return (
//     <SocialContainer>
//       <SocialHeader>
//         <Title>Social Mode</Title>
//         <Subtitle>
//           See who&apos;s out tonight and connect with people nearby
//         </Subtitle>

//         {/* NOTIFICATION SYSTEM: Notification Bell and Edit Profile Button */}
//         <HeaderActions>
//           {/* Notification Bell */}
//           {/* Notification Bell */}
//           <EditProfileButton
//             onClick={() => setShowNotifications(true)}
//             style={{
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//             }}
//           >
//             <span>🔔</span>
//             {unreadCount > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: "-5px",
//                   right: "-5px",
//                   background: "#ec4899",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: "20px",
//                   height: "20px",
//                   fontSize: "12px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {unreadCount}
//               </span>
//             )}
//           </EditProfileButton>

//           {/* Edit Profile Button - Only show when user has a profile and is not in setup mode */}
//           {hasSocialProfile && userSocialProfile && !showProfileSetup && (
//             <EditProfileButton onClick={handleEditProfile}>
//               <span>⚙️</span>
//               Edit
//             </EditProfileButton>
//           )}
//         </HeaderActions>
//       </SocialHeader>

//       {success && <SuccessState>{success}</SuccessState>}
//       {error && showLocationWarning && <ErrorState>{error}</ErrorState>}
//       {error && !showLocationWarning && <ErrorState>{error}</ErrorState>}

//       {showProfileSetup && (
//         <SetupSocialProfile
//           onComplete={handleProfileSetupComplete}
//           onSkip={() => setShowProfileSetup(false)}
//           isLoading={isLoading}
//           existingProfile={userSocialProfile}
//         />
//       )}

//       {!showProfileSetup && (
//         <>
//           {/* Social Toggle - Always at the top when not in profile setup */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               margin: "1.5rem 0",
//             }}
//           >
//             <SocialToggle
//               isActive={isSocialMode}
//               onToggle={toggleSocialMode}
//               isLoading={isLoading}
//             />
//           </div>
//           {/* City Detection Display - Only show when we have a detected city and social mode is active */}
//           {isSocialMode && currentCity && !isDetectingCity && (
//             <CityDetection>
//               <CityBadge>
//                 <span>📍</span>
//                 <span>Currently in {currentCity}</span>
//               </CityBadge>
//             </CityDetection>
//           )}

//           {/* How it works section - Show below Social Toggle when relevant */}
//           {showHowItWorks && (
//             <HowItWorks>
//               <HowItWorksTitle>How Social Mode Works</HowItWorksTitle>
//               <StepsContainer>
//                 <Step>
//                   <StepIcon>👤</StepIcon>
//                   <StepTitle>Create Your Profile</StepTitle>
//                   <StepDescription>
//                     Set up your social profile with your vibe, interests, and
//                     bio to let others know what you&apos;re about.
//                   </StepDescription>
//                 </Step>
//                 <Step>
//                   <StepIcon>📍</StepIcon>
//                   <StepTitle>Enable Social Mode</StepTitle>
//                   <StepDescription>
//                     Turn on social mode to appear on the map and see other users
//                     nearby in your city.
//                   </StepDescription>
//                 </Step>
//                 <Step>
//                   <StepIcon>🤝</StepIcon>
//                   <StepTitle>Connect & Hop In</StepTitle>
//                   <StepDescription>
//                     Browse nearby users, send hop-in requests, and meet up with
//                     like-minded people.
//                   </StepDescription>
//                 </Step>
//               </StepsContainer>
//             </HowItWorks>
//           )}

//           {/* Social Mode Active Content */}
//           {isSocialMode && (
//             <>
//               <StatsContainer>
//                 <StatCard>
//                   <StatNumber>{activeUsersCount}</StatNumber>
//                   <StatLabel>Online in {currentCity || "your city"}</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{nearbyBars}</StatNumber>
//                   <StatLabel>Venues</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{mostPopularVibe}</StatNumber>
//                   <StatLabel>Vibe</StatLabel>
//                 </StatCard>
//               </StatsContainer>

//               <ViewToggle>
//                 <ViewButton
//                   $active={selectedView === "grid"}
//                   onClick={() => setSelectedView("grid")}
//                 >
//                   👥 Grid View
//                 </ViewButton>
//                 <ViewButton
//                   $active={selectedView === "map"}
//                   onClick={() => setSelectedView("map")}
//                 >
//                   🗺️ Map View
//                 </ViewButton>
//               </ViewToggle>

//               <MapContainer $show={selectedView === "map"}>
//                 <SocialMap
//                   users={filteredUsers}
//                   onUserClick={handleHopIn}
//                   currentLocation={
//                     currentLocation || { lat: 60.1699, lng: 24.9384 }
//                   }
//                 />
//               </MapContainer>

//               {selectedView === "grid" && (
//                 <>
//                   {isLoadingUsers && (
//                     <LoadingState>
//                       <p>
//                         Finding people near you in {currentCity || "your area"}
//                         ...
//                       </p>
//                     </LoadingState>
//                   )}

//                   {!isLoadingUsers && filteredUsers.length > 0 && (
//                     <UsersGrid>
//                       {filteredUsers.map((user) => (
//                         <UserCard
//                           key={user.id}
//                           onClick={() => handleHopIn(user)}
//                         >
//                           <UserImageContainer>
//                             <UserImage $imageUrl={user.user.image || undefined}>
//                               {!user.user.image &&
//                                 (user.user.name?.charAt(0).toUpperCase() ||
//                                   "U")}
//                             </UserImage>
//                             <UserStatusBadge $status={user.socialStatus} />
//                             <UserVibeBadge $vibe={user.vibe || "CASUAL"}>
//                               {getVibeEmoji(user.vibe || "CASUAL")}
//                             </UserVibeBadge>
//                           </UserImageContainer>
//                           <UserInfo>
//                             <UserHeader>
//                               <UserName>{user.user.name || "User"}</UserName>
//                               <UserAge>{calculateAge(user)}</UserAge>
//                             </UserHeader>
//                             <UserDetails>
//                               <DistanceBadge>
//                                 📍 {calculateDistance(user)}
//                               </DistanceBadge>
//                               <LocationInfo>
//                                 {user.currentBar
//                                   ? `🍻 ${user.currentBar.name}`
//                                   : "📍 Nearby"}
//                               </LocationInfo>
//                             </UserDetails>
//                             <QuickActions>
//                               <ActionButton
//                                 $variant="primary"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleHopIn(user);
//                                 }}
//                               >
//                                 Hop In
//                               </ActionButton>
//                               {/* NOTIFICATION SYSTEM: Updated wave button */}
//                               <ActionButton
//                                 $variant="secondary"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   sendWave(user);
//                                 }}
//                               >
//                                 👋 Wave
//                               </ActionButton>
//                             </QuickActions>
//                           </UserInfo>
//                         </UserCard>
//                       ))}
//                     </UsersGrid>
//                   )}

//                   {!isLoadingUsers && filteredUsers.length === 0 && (
//                     <EmptyUsersState>
//                       <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
//                         👀
//                       </div>
//                       <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
//                         No users nearby in {currentCity || "your area"}
//                       </h3>
//                       <p style={{ color: "#94a3b8" }}>
//                         Be the first in {currentCity || "your city"} to activate
//                         social mode!
//                       </p>
//                     </EmptyUsersState>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </>
//       )}

//       {/* Hop In Modal */}
//       {showHopInModal && selectedUser && (
//         <ModalOverlay onClick={() => setShowHopInModal(false)}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <ModalHeader>
//               <ModalUserImage $imageUrl={selectedUser.user.image || undefined}>
//                 {!selectedUser.user.image &&
//                   (selectedUser.user.name?.charAt(0).toUpperCase() || "U")}
//               </ModalUserImage>
//               <ModalUserInfo>
//                 <ModalUserName>
//                   {selectedUser.user.name || "User"}
//                 </ModalUserName>
//                 <ModalUserVibe>
//                   {getVibeEmoji(selectedUser.vibe || "CASUAL")}{" "}
//                   {selectedUser.vibe || "CASUAL"} Vibe
//                 </ModalUserVibe>
//               </ModalUserInfo>
//             </ModalHeader>

//             {selectedUser.bio && (
//               <ModalSection>
//                 <ModalSectionTitle>About</ModalSectionTitle>
//                 <ModalBio>{selectedUser.bio}</ModalBio>
//               </ModalSection>
//             )}

//             {selectedUser.interests && selectedUser.interests.length > 0 && (
//               <ModalSection>
//                 <ModalSectionTitle>Interests</ModalSectionTitle>
//                 <ModalInterests>
//                   {selectedUser.interests.map((interest, index) => (
//                     <ModalInterestTag key={index}>#{interest}</ModalInterestTag>
//                   ))}
//                 </ModalInterests>
//               </ModalSection>
//             )}

//             <ModalSection>
//               <ModalSectionTitle>Current Location</ModalSectionTitle>
//               <p style={{ color: "#cbd5e1", margin: 0 }}>
//                 {selectedUser.currentBar ? (
//                   <>🍻 {selectedUser.currentBar.name}</>
//                 ) : (
//                   <>📍 Exploring nearby ({calculateDistance(selectedUser)})</>
//                 )}
//               </p>
//             </ModalSection>

//             <ModalActions>
//               <ModalButton
//                 $variant="secondary"
//                 onClick={() => setShowHopInModal(false)}
//               >
//                 Cancel
//               </ModalButton>
//               <ModalButton
//                 $variant="primary"
//                 onClick={sendHopInRequest}
//                 disabled={isSendingHopIn}
//               >
//                 {isSendingHopIn ? "Sending..." : "Send Hop In Request"}
//               </ModalButton>
//             </ModalActions>
//           </ModalContent>
//         </ModalOverlay>
//       )}

//       {/* NOTIFICATION SYSTEM: Notifications Panel */}
//       <NotificationsPanel />

//       {/* Debug Section (commented out) */}
//       {/*
//       <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(139, 92, 246, 0.3)", paddingTop: "2rem" }}>
//         <h3 style={{ color: "#f8fafc", textAlign: "center", marginBottom: "1rem" }}>
//           Debug Tools
//         </h3>

//         <div style={{ textAlign: "center", marginBottom: "1rem" }}>
//           <DebugButton onClick={testDatabase}>Test Database</DebugButton>
//           <DebugButtonGreen onClick={testDirectSave}>Test Direct Save</DebugButtonGreen>
//           <DebugButton onClick={checkSocialProfile}>Refresh Profile</DebugButton>
//           <DebugButton onClick={clearMessages} style={{ background: "#6b7280" }}>
//             Clear Messages
//           </DebugButton>
//         </div>

//         {debugInfo && (
//           <DebugSection>
//             <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
//               Debug Info: {debugInfo.type}
//             </div>
//             <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
//               {JSON.stringify(debugInfo, null, 2)}
//             </pre>
//           </DebugSection>
//         )}

//         <DebugSection>
//           <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
//             Current State
//           </div>
//           <div>Has Profile: {hasSocialProfile ? "Yes" : "No"}</div>
//           <div>Social Mode: {isSocialMode ? "Active" : "Inactive"}</div>
//           <div>Current City: {currentCity || "Not detected"}</div>
//           <div>All Users: {allUsers.length}</div>
//           <div>Filtered Users: {filteredUsers.length}</div>
//           <div>Current Location: {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : "None"}</div>
//           <div>Show Location Warning: {showLocationWarning ? "Yes" : "No"}</div>
//           {userSocialProfile && (
//             <div style={{ marginTop: "0.5rem" }}>
//               Profile Data: Bio="{userSocialProfile.bio}", Vibe={userSocialProfile.vibe || "null"}, Interests={userSocialProfile.interests?.length || 0}
//             </div>
//           )}
//         </DebugSection>
//       </div>
//       */}
//     </SocialContainer>
//   );
// };
// export default Social;

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

// WORKING SOCIAL BUT NOT SAVING INPUTS
// "use client";
// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
// import UserList from "./user-list/UserList";
// import { UserSocialProfileWithRelations } from "@/types/social";
// import { SocialVibe } from "@prisma/client";
// import { mockUsers, mockCurrentLocation } from "@/lib/mockSocialData";
// import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";

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
//         setHasSocialProfile(false);
//         return;
//       }

//       const response = await fetch("/api/social/profile");
//       if (response.ok) {
//         const data = await response.json();
//         console.log("📋 PROFILE CHECK RESPONSE:", data);
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
//       if (status && !hasSocialProfile && !userSocialProfile) {
//         console.log("🚫 No profile found, showing setup");
//         setShowProfileSetup(true);
//         setIsLoading(false);
//         return;
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

//   const testDatabase = async () => {
//     console.log("🧪 Testing database connection...");
//     try {
//       const response = await fetch("/api/social/profile");
//       const data = await response.json();
//       console.log("🧪 Database test result:", data);
//     } catch (error) {
//       console.error("🧪 Database test error:", error);
//     }
//   };

//   const testDirectSave = async () => {
//     console.log("🧪 TESTING DIRECT SAVE");
//     try {
//       const response = await fetch("/api/social/profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bio: "TEST DIRECT SAVE",
//           vibe: "PARTY",
//           interests: ["Test1", "Test2", "Test3"],
//         }),
//       });

//       const result = await response.json();
//       console.log("🧪 DIRECT SAVE RESULT:", result);

//       // Refresh profile
//       checkSocialProfile();
//     } catch (error) {
//       console.error("🧪 DIRECT SAVE ERROR:", error);
//     }
//   };

//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;

//     setIsLoadingUsers(true);
//     try {
//       if (USE_MOCK_DATA) {
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
//     console.log("🎯 PARENT RECEIVED PROFILE DATA:", profileData);

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/social/profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileData),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: Failed to save profile`);
//       }

//       const result = await response.json();
//       console.log("✅ PROFILE SAVE RESPONSE:", result);

//       // Update local state
//       setUserSocialProfile(result.socialProfile);
//       setHasSocialProfile(true);
//       setShowProfileSetup(false);

//       // Refresh the profile data
//       await checkSocialProfile();

//       // Automatically enable social mode after profile creation
//       await toggleSocialMode(true);
//     } catch (err) {
//       console.error("❌ PROFILE SAVE ERROR:", err);
//       setError(err instanceof Error ? err.message : "Failed to save profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleProfileSetupSkip = () => {
//     setShowProfileSetup(false);
//   };

//   const handleEditProfile = () => {
//     console.log("✏️ EDITING PROFILE:", userSocialProfile);
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
//           existingProfile={userSocialProfile}
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

//       {/* Debug Buttons */}
//       <div style={{ textAlign: "center", marginTop: "2rem" }}>
//         <button
//           onClick={testDatabase}
//           style={{
//             background: "#f59e0b",
//             color: "white",
//             padding: "0.5rem 1rem",
//             margin: "0.5rem",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//           }}
//         >
//           Test Database
//         </button>
//         <button
//           onClick={testDirectSave}
//           style={{
//             background: "#10b981",
//             color: "white",
//             padding: "0.5rem 1rem",
//             margin: "0.5rem",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//           }}
//         >
//           Test Direct Save
//         </button>
//       </div>
//     </SocialContainer>
//   );
// }
// "use client";
// import { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import SocialToggle from "./social-toggle/SocialToggle";
// import SocialMap from "./social-map/SocialMap";
// import { UserSocialProfileWithRelations } from "@/types/social";
// import { SocialVibe } from "@prisma/client";
// import SetupSocialProfile from "../social-profile/setup-social-profile/SetupSocialProfile";

// const SocialContainer = styled.div`
//   padding: 1rem;
//   background: #0f172a;
//   min-height: 100vh;
// `;

// const SocialHeader = styled.div`
//   text-align: center;
//   margin-bottom: 1.5rem;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   font-weight: 700;
//   margin-bottom: 0.5rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   background-clip: text;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const Subtitle = styled.p`
//   color: #e2e8f0;
//   font-size: 1rem;
//   max-width: 600px;
//   margin: 0 auto;
// `;

// // View Toggle
// const ViewToggle = styled.div`
//   display: flex;
//   justify-content: center;
//   margin: 1rem 0;
//   gap: 0.5rem;
// `;

// const ViewButton = styled.button<{ $active: boolean }>`
//   background: ${(props) =>
//     props.$active
//       ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
//       : "rgba(30, 41, 59, 0.8)"};
//   border: 1px solid
//     ${(props) => (props.$active ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)")};
//   color: ${(props) => (props.$active ? "white" : "#94a3b8")};
//   padding: 0.5rem 1rem;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 0.875rem;
//   font-weight: 600;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-1px);
//     box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
//   }
// `;

// // City Detection Component
// const CityDetection = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 1rem;
//   margin: 1rem 0;
//   padding: 1rem;
//   background: rgba(30, 41, 59, 0.5);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
// `;

// const CityBadge = styled.div`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   color: white;
//   padding: 0.5rem 1rem;
//   border-radius: 20px;
//   font-size: 0.875rem;
//   font-weight: 600;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const DetectingCity = styled.div`
//   color: #94a3b8;
//   font-size: 0.875rem;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// // Map Container
// const MapContainer = styled.div<{ $show: boolean }>`
//   display: ${(props) => (props.$show ? "block" : "none")};
//   margin: 1.5rem 0;
//   height: 400px;
// `;

// // Grindr-style Users Grid
// const UsersGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
//   gap: 0.75rem;
//   margin: 1.5rem 0;

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
//     gap: 0.5rem;
//   }

//   @media (max-width: 480px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 0.5rem;
//   }
// `;

// const UserCard = styled.div`
//   background: rgba(30, 41, 59, 0.9);
//   border-radius: 12px;
//   overflow: hidden;
//   transition: all 0.3s ease;
//   cursor: pointer;
//   position: relative;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
//   border: 1px solid rgba(139, 92, 246, 0.2);

//   &:hover {
//     transform: translateY(-2px);
//     border-color: #8b5cf6;
//     box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
//   }
// `;

// const UserImageContainer = styled.div`
//   position: relative;
//   width: 100%;
//   height: 200px;
//   overflow: hidden;
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
// `;

// const UserImage = styled.div<{ $imageUrl?: string }>`
//   width: 100%;
//   height: 100%;
//   background: ${(props) =>
//     props.$imageUrl
//       ? `url(${props.$imageUrl}) center/cover`
//       : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 2rem;
//   color: white;
//   font-weight: 600;
// `;

// const UserStatusBadge = styled.div<{ $status: string }>`
//   position: absolute;
//   top: 8px;
//   right: 8px;
//   width: 8px;
//   height: 8px;
//   border-radius: 50%;
//   background: ${(props) =>
//     props.$status === "ONLINE"
//       ? "#10b981"
//       : props.$status === "SOCIAL_MODE"
//       ? "#8b5cf6"
//       : props.$status === "IN_MEETUP"
//       ? "#f59e0b"
//       : "#6b7280"};
//   border: 2px solid rgba(15, 23, 42, 0.9);
// `;

// const UserVibeBadge = styled.div<{ $vibe: string }>`
//   position: absolute;
//   top: 8px;
//   left: 8px;
//   background: ${(props) => getVibeColor(props.$vibe)};
//   color: white;
//   padding: 2px 6px;
//   border-radius: 8px;
//   font-size: 0.6rem;
//   font-weight: 600;
//   backdrop-filter: blur(10px);
//   border: 1px solid rgba(255, 255, 255, 0.3);
// `;

// const UserInfo = styled.div`
//   padding: 0.75rem;
// `;

// const UserHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: 0.25rem;
// `;

// const UserName = styled.h3`
//   color: #f8fafc;
//   margin: 0;
//   font-size: 0.9rem;
//   font-weight: 600;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;

// const UserAge = styled.span`
//   color: #94a3b8;
//   font-size: 0.75rem;
//   font-weight: 500;
// `;

// const UserDetails = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.25rem;
// `;

// const DistanceBadge = styled.div`
//   color: #10b981;
//   font-size: 0.7rem;
//   font-weight: 600;
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
// `;

// const LocationInfo = styled.div`
//   color: #94a3b8;
//   font-size: 0.7rem;
//   display: flex;
//   align-items: center;
//   gap: 0.25rem;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;

// const QuickActions = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   margin-top: 0.5rem;
// `;

// const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
//   flex: 1;
//   background: ${(props) =>
//     props.$variant === "primary"
//       ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
//       : "rgba(139, 92, 246, 0.1)"};
//   border: ${(props) =>
//     props.$variant === "primary"
//       ? "none"
//       : "1px solid rgba(139, 92, 246, 0.3)"};
//   border-radius: 6px;
//   padding: 0.5rem;
//   color: ${(props) => (props.$variant === "primary" ? "white" : "#8b5cf6")};
//   font-size: 0.7rem;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-1px);
//     box-shadow: ${(props) =>
//       props.$variant === "primary"
//         ? "0 4px 12px rgba(139, 92, 246, 0.4)"
//         : "0 2px 8px rgba(139, 92, 246, 0.2)"};
//   }
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

// const SuccessState = styled.div`
//   text-align: center;
//   padding: 1rem;
//   background: rgba(16, 185, 129, 0.1);
//   border: 1px solid rgba(16, 185, 129, 0.3);
//   border-radius: 8px;
//   color: #10b981;
//   margin: 1rem 0;
// `;

// const StatsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//   gap: 1rem;
//   margin: 1.5rem 0;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const StatCard = styled.div`
//   background: rgba(30, 41, 59, 0.8);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   padding: 1rem;
//   text-align: center;
// `;

// const StatNumber = styled.div`
//   font-size: 1rem;
//   font-weight: 700;
//   color: #0ea5e9;
//   margin-bottom: 0.25rem;
// `;

// const StatLabel = styled.div`
//   font-size: 0.75rem;
//   color: #94a3b8;
//   font-weight: 500;
// `;

// const EmptyUsersState = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #64748b;
// `;

// // Hop In Modal
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.8);
//   backdrop-filter: blur(5px);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
//   padding: 1rem;
// `;

// const ModalContent = styled.div`
//   background: rgba(30, 41, 59, 0.95);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 16px;
//   padding: 2rem;
//   max-width: 500px;
//   width: 100%;
//   max-height: 90vh;
//   overflow-y: auto;
//   color: #e2e8f0;
// `;

// const ModalHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   margin-bottom: 1.5rem;
// `;

// const ModalUserImage = styled.div<{ $imageUrl?: string }>`
//   width: 80px;
//   height: 80px;
//   border-radius: 50%;
//   background: ${(props) =>
//     props.$imageUrl
//       ? `url(${props.$imageUrl}) center/cover`
//       : "linear-gradient(45deg, #8b5cf6, #0ea5e9)"};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 2rem;
//   color: white;
//   font-weight: 600;
// `;

// const ModalUserInfo = styled.div`
//   flex: 1;
// `;

// const ModalUserName = styled.h3`
//   color: #f8fafc;
//   margin: 0 0 0.5rem 0;
//   font-size: 1.5rem;
// `;

// const ModalUserVibe = styled.div`
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   background: rgba(139, 92, 246, 0.2);
//   color: #8b5cf6;
//   padding: 0.5rem 1rem;
//   border-radius: 20px;
//   font-size: 0.875rem;
//   font-weight: 600;
// `;

// const ModalSection = styled.div`
//   margin-bottom: 1.5rem;
// `;

// const ModalSectionTitle = styled.h4`
//   color: #f8fafc;
//   margin: 0 0 0.75rem 0;
//   font-size: 1.1rem;
// `;

// const ModalBio = styled.p`
//   color: #cbd5e1;
//   line-height: 1.6;
//   margin: 0;
// `;

// const ModalInterests = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
// `;

// const ModalInterestTag = styled.span`
//   background: rgba(139, 92, 246, 0.2);
//   color: #c4b5fd;
//   padding: 0.5rem 1rem;
//   border-radius: 12px;
//   font-size: 0.875rem;
//   border: 1px solid rgba(139, 92, 246, 0.3);
// `;

// const ModalActions = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 2rem;
// `;

// const ModalButton = styled.button<{ $variant: "primary" | "secondary" }>`
//   flex: 1;
//   background: ${(props) =>
//     props.$variant === "primary"
//       ? "linear-gradient(45deg, #8b5cf6, #0ea5e9)"
//       : "rgba(139, 92, 246, 0.1)"};
//   border: ${(props) =>
//     props.$variant === "primary"
//       ? "none"
//       : "1px solid rgba(139, 92, 246, 0.3)"};
//   border-radius: 8px;
//   padding: 1rem;
//   color: ${(props) => (props.$variant === "primary" ? "white" : "#8b5cf6")};
//   font-size: 1rem;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: ${(props) =>
//       props.$variant === "primary"
//         ? "0 8px 25px rgba(139, 92, 246, 0.4)"
//         : "0 4px 15px rgba(139, 92, 246, 0.2)"};
//   }
// `;

// // Debug Components (commented but not removed)
// /*
// const DebugSection = styled.div`
//   background: rgba(30, 41, 59, 0.8);
//   border-radius: 8px;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   padding: 1rem;
//   margin: 1rem 0;
//   font-family: monospace;
//   font-size: 0.75rem;
//   color: #94a3b8;
// `;

// const DebugButton = styled.button`
//   background: #f59e0b;
//   border: none;
//   border-radius: 6px;
//   padding: 0.5rem 1rem;
//   color: white;
//   cursor: pointer;
//   font-size: 0.875rem;
//   margin: 0.25rem;
//   transition: all 0.3s ease;

//   &:hover {
//     background: #d97706;
//   }
// `;

// const DebugButtonGreen = styled(DebugButton)`
//   background: #10b981;

//   &:hover {
//     background: #059669;
//   }
// `;
// */

// // Helper functions
// const getVibeColor = (vibe: string) => {
//   switch (vibe) {
//     case "PARTY":
//       return "#ec4899";
//     case "CHILL":
//       return "#0ea5e9";
//     case "NETWORKING":
//       return "#10b981";
//     case "ADVENTUROUS":
//       return "#f59e0b";
//     default:
//       return "#8b5cf6";
//   }
// };

// const getVibeEmoji = (vibe: string) => {
//   switch (vibe) {
//     case "PARTY":
//       return "🎉";
//     case "CHILL":
//       return "😌";
//     case "NETWORKING":
//       return "🤝";
//     case "ADVENTUROUS":
//       return "🌍";
//     default:
//       return "💜";
//   }
// };

// const getSocialStatusText = (status: string) => {
//   switch (status) {
//     case "ONLINE":
//       return "Online";
//     case "SOCIAL_MODE":
//       return "Social";
//     case "IN_MEETUP":
//       return "In Meetup";
//     case "OFFLINE":
//       return "Offline";
//     default:
//       return "Available";
//   }
// };

// // Calculate age from birth date if available, otherwise use a default
// const calculateAge = (user: UserSocialProfileWithRelations): number => {
//   const hash = user.userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
//   return 22 + (hash % 15);
// };

// // Finnish cities with their approximate coordinates and bounds
// const FINNISH_CITIES = {
//   Helsinki: {
//     lat: 60.1699,
//     lng: 24.9384,
//     bounds: { north: 60.2978, south: 60.1094, west: 24.7386, east: 25.2542 },
//   },
//   Espoo: {
//     lat: 60.2055,
//     lng: 24.6559,
//     bounds: { north: 60.35, south: 60.1, west: 24.5, east: 24.9 },
//   },
//   Tampere: {
//     lat: 61.4978,
//     lng: 23.761,
//     bounds: { north: 61.6, south: 61.4, west: 23.5, east: 24.1 },
//   },
//   Turku: {
//     lat: 60.4518,
//     lng: 22.2666,
//     bounds: { north: 60.55, south: 60.35, west: 22.1, east: 22.5 },
//   },
//   Oulu: {
//     lat: 65.0121,
//     lng: 25.4651,
//     bounds: { north: 65.1, south: 64.9, west: 25.3, east: 25.7 },
//   },
//   Vantaa: {
//     lat: 60.2934,
//     lng: 25.0378,
//     bounds: { north: 60.4, south: 60.2, west: 24.85, east: 25.25 },
//   },
//   Lahti: {
//     lat: 60.9827,
//     lng: 25.6612,
//     bounds: { north: 61.05, south: 60.9, west: 25.55, east: 25.8 },
//   },
//   Kuopio: {
//     lat: 62.8924,
//     lng: 27.677,
//     bounds: { north: 63.0, south: 62.75, west: 27.5, east: 27.9 },
//   },
//   Jyväskylä: {
//     lat: 62.2426,
//     lng: 25.7473,
//     bounds: { north: 62.3, south: 62.15, west: 25.65, east: 25.85 },
//   },
//   Pori: {
//     lat: 61.4851,
//     lng: 21.7975,
//     bounds: { north: 61.55, south: 61.4, west: 21.7, east: 21.9 },
//   },
// };

// // Helper function to detect which Finnish city the coordinates are in
// const detectFinnishCity = (lat: number, lng: number): string => {
//   for (const [city, data] of Object.entries(FINNISH_CITIES)) {
//     const bounds = data.bounds;
//     if (
//       lat >= bounds.south &&
//       lat <= bounds.north &&
//       lng >= bounds.west &&
//       lng <= bounds.east
//     ) {
//       return city;
//     }
//   }

//   // If no city matched, use reverse geocoding as fallback
//   return "Unknown";
// };

// // Enhanced reverse geocoding for Finnish cities
// const getCityFromCoordinates = async (
//   lat: number,
//   lng: number
// ): Promise<string> => {
//   try {
//     // First try to detect using our bounds
//     const detectedCity = detectFinnishCity(lat, lng);
//     if (detectedCity !== "Unknown") {
//       return detectedCity;
//     }

//     // Fallback to API for more accurate detection
//     const response = await fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//     );

//     if (!response.ok) throw new Error("Geocoding API failed");

//     const data = await response.json();

//     // Check if the city is in Finland
//     if (data.countryName === "Finland") {
//       return data.city || data.locality || "Unknown City in Finland";
//     }

//     return "Not in Finland";
//   } catch (error) {
//     console.error("Error getting city from coordinates:", error);

//     // Final fallback - check if coordinates are roughly in Finland
//     if (lat > 59.5 && lat < 70.0 && lng > 19.0 && lng < 31.0) {
//       return "Unknown City in Finland";
//     }

//     return "Location not in Finland";
//   }
// };

// // Filter users by city
// const filterUsersByCity = (
//   users: UserSocialProfileWithRelations[],
//   targetCity: string
// ): UserSocialProfileWithRelations[] => {
//   if (
//     targetCity === "Not in Finland" ||
//     targetCity === "Location not in Finland"
//   ) {
//     return []; // No users if not in Finland
//   }

//   return users.filter((user) => {
//     if (!user.locationLat || !user.locationLng) return false;

//     try {
//       const userCity = detectFinnishCity(user.locationLat, user.locationLng);

//       // Direct city match
//       if (userCity === targetCity) {
//         return true;
//       }

//       // Handle "Unknown City in Finland" case - include them if we're also in an unknown Finnish location
//       if (targetCity === "Unknown City in Finland" && userCity === "Unknown") {
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error("Error filtering user by city:", error);
//       return false;
//     }
//   });
// };

// interface LocationData {
//   locationLat?: number;
//   locationLng?: number;
// }

// interface NearbyUsersData {
//   users: UserSocialProfileWithRelations[];
// }

// // Fixed DebugInfo interface with all possible properties
// interface DebugInfo {
//   type: string;
//   loading?: boolean;
//   success?: boolean;
//   data?: unknown;
//   error?: string;
//   message?: string;
//   source?: string;
//   count?: number;
//   users?: unknown[];
//   hasProfile?: boolean;
//   profile?: unknown;
//   timestamp?: string;
//   status?: number;
//   result?: unknown;
//   // Added missing properties
//   city?: string;
//   coordinates?: { lat: number; lng: number };
//   totalUsers?: number;
//   filteredCount?: number;
// }

// export default function Social() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [isSocialMode, setIsSocialMode] = useState(false);
//   const [activeUsers, setActiveUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingUsers, setIsLoadingUsers] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);
//   const [showProfileSetup, setShowProfileSetup] = useState(false);
//   const [hasSocialProfile, setHasSocialProfile] = useState(false);
//   const [userSocialProfile, setUserSocialProfile] =
//     useState<UserSocialProfileWithRelations | null>(null);
//   const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
//   const [selectedView, setSelectedView] = useState<"grid" | "map">("grid");
//   const [selectedUser, setSelectedUser] =
//     useState<UserSocialProfileWithRelations | null>(null);
//   const [showHopInModal, setShowHopInModal] = useState(false);
//   const [isSendingHopIn, setIsSendingHopIn] = useState(false);

//   // Add new state for city detection
//   const [currentCity, setCurrentCity] = useState<string>("");
//   const [isDetectingCity, setIsDetectingCity] = useState(false);
//   const [allUsers, setAllUsers] = useState<UserSocialProfileWithRelations[]>(
//     []
//   );
//   const [filteredUsers, setFilteredUsers] = useState<
//     UserSocialProfileWithRelations[]
//   >([]);
//   const [showLocationWarning, setShowLocationWarning] = useState(false);

//   // Check if user has social profile on component mount
//   useEffect(() => {
//     checkSocialProfile();
//   }, []);

//   // Auto-clear success messages after 5 seconds
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   // Fixed useEffect with proper null check for error
//   useEffect(() => {
//     if (error) {
//       if (
//         error.includes("Using Helsinki as default") ||
//         error.includes("Geolocation not supported")
//       ) {
//         const timer = setTimeout(() => {
//           setError(null);
//           setShowLocationWarning(false);
//         }, 8000);
//         return () => clearTimeout(timer);
//       } else {
//         const timer = setTimeout(() => {
//           setError(null);
//         }, 8000);
//         return () => clearTimeout(timer);
//       }
//     }
//   }, [error]);

//   const calculateDistance = (user: UserSocialProfileWithRelations): string => {
//     if (!currentLocation || !user.locationLat || !user.locationLng) {
//       return "Nearby";
//     }

//     const R = 6371;
//     const dLat = ((user.locationLat - currentLocation.lat) * Math.PI) / 180;
//     const dLon = ((user.locationLng - currentLocation.lng) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((currentLocation.lat * Math.PI) / 180) *
//         Math.cos((user.locationLat * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     if (distance < 0.1) return "Very close";
//     if (distance < 0.5) return `${Math.round(distance * 1000)}m`;
//     if (distance < 1) return "<1km";
//     return `${distance.toFixed(1)}km`;
//   };

//   const checkSocialProfile = async () => {
//     try {
//       console.log("🔍 Checking social profile...");
//       const response = await fetch("/api/social/profile");
//       console.log("📨 Profile check response status:", response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log("✅ Profile check data:", data);
//         setHasSocialProfile(!!data.socialProfile);
//         setUserSocialProfile(data.socialProfile);

//         setDebugInfo({
//           type: "profile_check",
//           hasProfile: !!data.socialProfile,
//           profile: data.socialProfile,
//           timestamp: new Date().toISOString(),
//         });
//       } else {
//         const errorText = await response.text();
//         console.error("❌ Profile check error:", response.status, errorText);
//         setDebugInfo({
//           type: "profile_check_error",
//           status: response.status,
//           error: errorText,
//         });
//       }
//     } catch (error) {
//       console.error("💥 Error checking social profile:", error);
//       setDebugInfo({
//         type: "profile_check_exception",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   };

//   // Enhanced city detection function
//   const detectUserCity = async (lat: number, lng: number): Promise<void> => {
//     setIsDetectingCity(true);
//     setError(null);

//     try {
//       console.log("🌍 Detecting city for coordinates:", { lat, lng });

//       const city = await getCityFromCoordinates(lat, lng);
//       console.log("📍 Detected city:", city);

//       setCurrentCity(city);

//       setDebugInfo({
//         type: "city_detected",
//         city: city,
//         coordinates: { lat, lng },
//         timestamp: new Date().toISOString(),
//       });

//       // Show success message if in Finland
//       if (city !== "Not in Finland" && city !== "Location not in Finland") {
//         setSuccess(`Welcome to ${city}! Showing users in your city.`);
//       } else {
//         setError(
//           "You appear to be outside Finland. Social mode may not work properly."
//         );
//       }
//     } catch (error) {
//       console.error("Error detecting city:", error);
//       setCurrentCity("Unknown");
//       setError("Could not detect your city. Showing all Finnish users.");
//     } finally {
//       setIsDetectingCity(false);
//     }
//   };

//   // Update fetchNearbyUsers to filter by current city
//   const fetchNearbyUsers = async () => {
//     if (!isSocialMode) return;
//     setIsLoadingUsers(true);
//     try {
//       // Use a larger radius to get users from wider area in Finland
//       const url = currentLocation
//         ? `/api/social/status?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=100000` // 100km radius
//         : "/api/social/status";

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch nearby users");

//       const data: NearbyUsersData = await response.json();

//       console.log("🌍 Fetched all users:", data.users.length);

//       // Store all users
//       setAllUsers(data.users);

//       // Filter users by current city
//       if (currentCity) {
//         const usersInCity = filterUsersByCity(data.users, currentCity);
//         setFilteredUsers(usersInCity);

//         console.log(`📍 Filtered users in ${currentCity}:`, usersInCity.length);

//         setDebugInfo({
//           type: "users_filtered_by_city",
//           totalUsers: data.users.length,
//           filteredCount: usersInCity.length,
//           city: currentCity,
//           timestamp: new Date().toISOString(),
//         });
//       } else {
//         // If no city detected, show all users (fallback)
//         setFilteredUsers(data.users);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch nearby users"
//       );
//     } finally {
//       setIsLoadingUsers(false);
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
//     setSuccess(null);
//     setShowLocationWarning(false);

//     try {
//       if (status && !hasSocialProfile && !userSocialProfile) {
//         console.log("🚫 No profile found, showing setup");
//         setShowProfileSetup(true);
//         setIsLoading(false);
//         return;
//       }

//       let locationData: LocationData = {};
//       let usedFallbackLocation = false;

//       if (status && navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>(
//             (resolve, reject) => {
//               navigator.geolocation.getCurrentPosition(resolve, reject, {
//                 enableHighAccuracy: true,
//                 timeout: 10000, // Increased timeout for better accuracy
//                 maximumAge: 300000, // 5 minutes
//               });
//             }
//           );

//           locationData = {
//             locationLat: position.coords.latitude,
//             locationLng: position.coords.longitude,
//           };

//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };

//           setCurrentLocation(newLocation);

//           // Detect city when we have location
//           console.log("📍 Getting city for location:", newLocation);
//           await detectUserCity(newLocation.lat, newLocation.lng);
//         } catch (geoError) {
//           console.error("Geolocation error:", geoError);
//           // Use Helsinki as fallback
//           const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//           setCurrentLocation(fallbackLocation);
//           setCurrentCity("Helsinki");
//           usedFallbackLocation = true;
//           setShowLocationWarning(true);
//           setError(
//             "Using Helsinki as default location. Enable location services for accurate city detection."
//           );
//         }
//       } else if (status) {
//         // No geolocation support
//         const fallbackLocation = { lat: 60.1699, lng: 24.9384 };
//         setCurrentLocation(fallbackLocation);
//         setCurrentCity("Helsinki");
//         usedFallbackLocation = true;
//         setShowLocationWarning(true);
//         setError(
//           "Geolocation not supported. Using Helsinki as default location."
//         );
//       }

//       const response = await fetch("/api/social/status", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           isActive: status,
//           ...locationData,
//           vibe: userSocialProfile?.vibe,
//           interests: userSocialProfile?.interests,
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
//         if (
//           currentCity &&
//           currentCity !== "Not in Finland" &&
//           currentCity !== "Location not in Finland"
//         ) {
//           if (usedFallbackLocation) {
//             setSuccess(
//               `Social mode activated in ${currentCity}! Finding users nearby...`
//             );
//           } else {
//             setSuccess(
//               `Social mode activated in ${currentCity}! Finding users nearby...`
//             );
//           }
//         } else {
//           setSuccess("Social mode activated! Finding users nearby...");
//         }
//         await fetchNearbyUsers();
//       } else {
//         setSuccess("Social mode deactivated");
//         setAllUsers([]);
//         setFilteredUsers([]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleHopIn = async (user: UserSocialProfileWithRelations) => {
//     setSelectedUser(user);
//     setShowHopInModal(true);
//   };

//   const sendHopInRequest = async () => {
//     if (!selectedUser) return;

//     setIsSendingHopIn(true);
//     try {
//       const response = await fetch("/api/social/hop-in", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           targetUserId: selectedUser.userId,
//           barId: selectedUser.currentBarId,
//           message: `Hey ${
//             selectedUser.user.name || "there"
//           }! I'd like to join you.`,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to send hop in request");
//       }

//       setSuccess(
//         `Hop in request sent to ${
//           selectedUser.user.name || "user"
//         }! They'll be notified.`
//       );
//       setShowHopInModal(false);
//       setSelectedUser(null);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to send hop in request"
//       );
//     } finally {
//       setIsSendingHopIn(false);
//     }
//   };

//   const handleProfileSetupComplete = async (profileData: {
//     bio: string;
//     vibe: SocialVibe;
//     interests: string[];
//   }) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/social/create-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileData),
//       });
//       if (!response.ok) throw new Error("Failed to save profile");
//       const result = await response.json();
//       setUserSocialProfile(result.socialProfile);
//       setHasSocialProfile(true);
//       setShowProfileSetup(false);
//       setSuccess("Profile created!");
//       await checkSocialProfile();
//       await toggleSocialMode(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to save profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update useEffect to use filteredUsers
//   useEffect(() => {
//     setActiveUsers(filteredUsers);
//   }, [filteredUsers]);

//   // Debug functions (commented but not removed)
//   /*
//   const testDatabase = async () => {
//     console.log("🧪 Testing database connection...");
//     setDebugInfo({ type: "database_test", loading: true });

//     try {
//       const response = await fetch("/api/social/profile");
//       const data = await response.json();
//       console.log("🧪 Database test result:", data);

//       setDebugInfo({
//         type: "database_test",
//         success: true,
//         data: data,
//         timestamp: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("🧪 Database test error:", error);
//       setDebugInfo({
//         type: "database_test",
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//         timestamp: new Date().toISOString(),
//       });
//     }
//   };

//   const testDirectSave = async () => {
//     console.log("🧪 Testing direct save...");
//     setDebugInfo({ type: "direct_save_test", loading: true });

//     try {
//       const response = await fetch("/api/social/create-profile", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           bio: "Test Direct Save",
//           vibe: "PARTY",
//           interests: ["Testing", "Debug", "Development"],
//         }),
//       });

//       const result = await response.json();
//       console.log("🧪 Direct save result:", result);

//       setDebugInfo({
//         type: "direct_save_test",
//         success: response.ok,
//         result: result,
//         timestamp: new Date().toISOString(),
//       });

//       if (response.ok) {
//         setSuccess("Test profile saved successfully!");
//         await checkSocialProfile();
//       } else {
//         setError(result.message || "Failed to save test profile");
//       }
//     } catch (error) {
//       console.error("🧪 Direct save error:", error);
//       setDebugInfo({
//         type: "direct_save_test",
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//         timestamp: new Date().toISOString(),
//       });
//       setError("Failed to save test profile");
//     }
//   };

//   const clearMessages = () => {
//     setError(null);
//     setSuccess(null);
//     setShowLocationWarning(false);
//   };
//   */

//   useEffect(() => {
//     if (isSocialMode) {
//       fetchNearbyUsers();
//       const interval = setInterval(fetchNearbyUsers, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [isSocialMode, currentLocation, currentCity]);

//   const activeUsersCount = filteredUsers.length;
//   const nearbyBars = [
//     ...new Set(
//       filteredUsers.map((user) => user.currentBar?.name).filter(Boolean)
//     ),
//   ].length;
//   const popularVibes = filteredUsers.reduce((acc, user) => {
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
//           See who&apos;s out tonight and connect with people nearby
//         </Subtitle>
//       </SocialHeader>

//       {success && <SuccessState>{success}</SuccessState>}
//       {error && showLocationWarning && <ErrorState>{error}</ErrorState>}
//       {error && !showLocationWarning && <ErrorState>{error}</ErrorState>}

//       {/* City Detection Display - Only show when we have a detected city */}
//       {isSocialMode && currentCity && !isDetectingCity && (
//         <CityDetection>
//           <CityBadge>
//             <span>📍</span>
//             <span>Currently in {currentCity}</span>
//           </CityBadge>
//         </CityDetection>
//       )}

//       {showProfileSetup && (
//         <SetupSocialProfile
//           onComplete={handleProfileSetupComplete}
//           onSkip={() => setShowProfileSetup(false)}
//           isLoading={isLoading}
//           existingProfile={userSocialProfile}
//         />
//       )}

//       {!showProfileSetup && (
//         <>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               margin: "1.5rem 0",
//             }}
//           >
//             <SocialToggle
//               isActive={isSocialMode}
//               onToggle={toggleSocialMode}
//               isLoading={isLoading}
//             />
//           </div>

//           {isSocialMode && (
//             <>
//               <StatsContainer>
//                 <StatCard>
//                   <StatNumber>{activeUsersCount}</StatNumber>
//                   <StatLabel>Online in {currentCity || "your city"}</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{nearbyBars}</StatNumber>
//                   <StatLabel>Venues</StatLabel>
//                 </StatCard>
//                 <StatCard>
//                   <StatNumber>{mostPopularVibe}</StatNumber>
//                   <StatLabel>Vibe</StatLabel>
//                 </StatCard>
//               </StatsContainer>

//               <ViewToggle>
//                 <ViewButton
//                   $active={selectedView === "grid"}
//                   onClick={() => setSelectedView("grid")}
//                 >
//                   👥 Grid View
//                 </ViewButton>
//                 <ViewButton
//                   $active={selectedView === "map"}
//                   onClick={() => setSelectedView("map")}
//                 >
//                   🗺️ Map View
//                 </ViewButton>
//               </ViewToggle>

//               <MapContainer $show={selectedView === "map"}>
//                 <SocialMap
//                   users={filteredUsers}
//                   onUserClick={handleHopIn}
//                   currentLocation={
//                     currentLocation || { lat: 60.1699, lng: 24.9384 }
//                   }
//                 />
//               </MapContainer>

//               {selectedView === "grid" && (
//                 <>
//                   {isLoadingUsers && (
//                     <LoadingState>
//                       <p>
//                         Finding people near you in {currentCity || "your area"}
//                         ...
//                       </p>
//                     </LoadingState>
//                   )}

//                   {!isLoadingUsers && filteredUsers.length > 0 && (
//                     <UsersGrid>
//                       {filteredUsers.map((user) => (
//                         <UserCard
//                           key={user.id}
//                           onClick={() => handleHopIn(user)}
//                         >
//                           <UserImageContainer>
//                             <UserImage $imageUrl={user.user.image || undefined}>
//                               {!user.user.image &&
//                                 (user.user.name?.charAt(0).toUpperCase() ||
//                                   "U")}
//                             </UserImage>
//                             <UserStatusBadge $status={user.socialStatus} />
//                             <UserVibeBadge $vibe={user.vibe || "CASUAL"}>
//                               {getVibeEmoji(user.vibe || "CASUAL")}
//                             </UserVibeBadge>
//                           </UserImageContainer>
//                           <UserInfo>
//                             <UserHeader>
//                               <UserName>{user.user.name || "User"}</UserName>
//                               <UserAge>{calculateAge(user)}</UserAge>
//                             </UserHeader>
//                             <UserDetails>
//                               <DistanceBadge>
//                                 📍 {calculateDistance(user)}
//                               </DistanceBadge>
//                               <LocationInfo>
//                                 {user.currentBar
//                                   ? `🍻 ${user.currentBar.name}`
//                                   : "📍 Nearby"}
//                               </LocationInfo>
//                             </UserDetails>
//                             <QuickActions>
//                               <ActionButton
//                                 $variant="primary"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleHopIn(user);
//                                 }}
//                               >
//                                 Hop In
//                               </ActionButton>
//                               <ActionButton
//                                 $variant="secondary"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 👋
//                               </ActionButton>
//                             </QuickActions>
//                           </UserInfo>
//                         </UserCard>
//                       ))}
//                     </UsersGrid>
//                   )}

//                   {!isLoadingUsers && filteredUsers.length === 0 && (
//                     <EmptyUsersState>
//                       <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
//                         👀
//                       </div>
//                       <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>
//                         No users nearby in {currentCity || "your area"}
//                       </h3>
//                       <p style={{ color: "#94a3b8" }}>
//                         Be the first in {currentCity || "your city"} to activate
//                         social mode!
//                       </p>
//                     </EmptyUsersState>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </>
//       )}

//       {/* Hop In Modal */}
//       {showHopInModal && selectedUser && (
//         <ModalOverlay onClick={() => setShowHopInModal(false)}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <ModalHeader>
//               <ModalUserImage $imageUrl={selectedUser.user.image || undefined}>
//                 {!selectedUser.user.image &&
//                   (selectedUser.user.name?.charAt(0).toUpperCase() || "U")}
//               </ModalUserImage>
//               <ModalUserInfo>
//                 <ModalUserName>
//                   {selectedUser.user.name || "User"}
//                 </ModalUserName>
//                 <ModalUserVibe>
//                   {getVibeEmoji(selectedUser.vibe || "CASUAL")}{" "}
//                   {selectedUser.vibe || "CASUAL"} Vibe
//                 </ModalUserVibe>
//               </ModalUserInfo>
//             </ModalHeader>

//             {selectedUser.bio && (
//               <ModalSection>
//                 <ModalSectionTitle>About</ModalSectionTitle>
//                 <ModalBio>{selectedUser.bio}</ModalBio>
//               </ModalSection>
//             )}

//             {selectedUser.interests && selectedUser.interests.length > 0 && (
//               <ModalSection>
//                 <ModalSectionTitle>Interests</ModalSectionTitle>
//                 <ModalInterests>
//                   {selectedUser.interests.map((interest, index) => (
//                     <ModalInterestTag key={index}>#{interest}</ModalInterestTag>
//                   ))}
//                 </ModalInterests>
//               </ModalSection>
//             )}

//             <ModalSection>
//               <ModalSectionTitle>Current Location</ModalSectionTitle>
//               <p style={{ color: "#cbd5e1", margin: 0 }}>
//                 {selectedUser.currentBar ? (
//                   <>🍻 {selectedUser.currentBar.name}</>
//                 ) : (
//                   <>📍 Exploring nearby ({calculateDistance(selectedUser)})</>
//                 )}
//               </p>
//             </ModalSection>

//             <ModalActions>
//               <ModalButton
//                 $variant="secondary"
//                 onClick={() => setShowHopInModal(false)}
//               >
//                 Cancel
//               </ModalButton>
//               <ModalButton
//                 $variant="primary"
//                 onClick={sendHopInRequest}
//                 disabled={isSendingHopIn}
//               >
//                 {isSendingHopIn ? "Sending..." : "Send Hop In Request"}
//               </ModalButton>
//             </ModalActions>
//           </ModalContent>
//         </ModalOverlay>
//       )}

//       {/* Debug Section (commented out) */}
//       {/*
//       <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(139, 92, 246, 0.3)", paddingTop: "2rem" }}>
//         <h3 style={{ color: "#f8fafc", textAlign: "center", marginBottom: "1rem" }}>
//           Debug Tools
//         </h3>

//         <div style={{ textAlign: "center", marginBottom: "1rem" }}>
//           <DebugButton onClick={testDatabase}>Test Database</DebugButton>
//           <DebugButtonGreen onClick={testDirectSave}>Test Direct Save</DebugButtonGreen>
//           <DebugButton onClick={checkSocialProfile}>Refresh Profile</DebugButton>
//           <DebugButton onClick={clearMessages} style={{ background: "#6b7280" }}>
//             Clear Messages
//           </DebugButton>
//         </div>

//         {debugInfo && (
//           <DebugSection>
//             <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
//               Debug Info: {debugInfo.type}
//             </div>
//             <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
//               {JSON.stringify(debugInfo, null, 2)}
//             </pre>
//           </DebugSection>
//         )}

//         <DebugSection>
//           <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
//             Current State
//           </div>
//           <div>Has Profile: {hasSocialProfile ? "Yes" : "No"}</div>
//           <div>Social Mode: {isSocialMode ? "Active" : "Inactive"}</div>
//           <div>Current City: {currentCity || "Not detected"}</div>
//           <div>All Users: {allUsers.length}</div>
//           <div>Filtered Users: {filteredUsers.length}</div>
//           <div>Current Location: {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : "None"}</div>
//           <div>Show Location Warning: {showLocationWarning ? "Yes" : "No"}</div>
//           {userSocialProfile && (
//             <div style={{ marginTop: "0.5rem" }}>
//               Profile Data: Bio="{userSocialProfile.bio}", Vibe={userSocialProfile.vibe || "null"}, Interests={userSocialProfile.interests?.length || 0}
//             </div>
//           )}
//         </DebugSection>
//       </div>
//       */}
//     </SocialContainer>
//   );
// }
