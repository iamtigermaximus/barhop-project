// import {
//   SocialVibe,
//   SocialStatus,
//   InteractionType,
//   MeetupStatus,
//   ParticipantStatus,
//   InteractionStatus,
//   MessageType,
// } from "@prisma/client";

// // API Request/Response Types
// export interface SocialStatusUpdateRequest {
//   isActive: boolean;
//   vibe?: SocialVibe;
//   interests?: string[];
//   locationLat?: number;
//   locationLng?: number;
//   currentBarId?: string;
//   isVisibleOnMap?: boolean;
// }

// export interface SocialStatusResponse {
//   success: boolean;
//   socialProfile: any;
//   message: string;
// }

// export interface NearbyUsersResponse {
//   users: any[];
// }

// export interface HopInRequest {
//   targetUserId: string;
//   barId?: string;
//   message?: string;
// }

// export interface HopInResponse {
//   success: boolean;
//   interaction: any;
//   message: string;
// }

// // Component Prop Types
// export interface SocialToggleProps {
//   isActive: boolean;
//   onToggle: (isActive: boolean) => void;
//   isLoading?: boolean;
// }

// export interface SocialMapProps {
//   users: any[];
//   onUserClick: (user: any) => void;
//   currentLocation?: { lat: number; lng: number };
// }

// export interface UserListProps {
//   users: any[];
//   onHopIn: (user: any) => void;
//   isLoading?: boolean;
// }
import {
  SocialVibe,
  SocialStatus,
  // InteractionType,
  // MeetupStatus,
  // ParticipantStatus,
  // InteractionStatus,
  // MessageType,
  UserSocialProfile,
  SocialInteraction,
  User,
  Bar,
  BarType,
} from "@prisma/client";

// Extended types with relations
export type UserSocialProfileWithRelations = UserSocialProfile & {
  user: Pick<User, "id" | "name" | "image">;
  currentBar: Pick<Bar, "id" | "name" | "address" | "type"> | null;
  distance?: number;
};

export type SocialInteractionWithRelations = SocialInteraction & {
  initiator: Pick<User, "id" | "name" | "image">;
  targetUser: Pick<User, "id" | "name" | "image">;
  meetup?: {
    id: string;
    name: string | null;
  } | null;
};

// API Request/Response Types
export interface SocialStatusUpdateRequest {
  isActive: boolean;
  vibe?: SocialVibe;
  interests?: string[];
  locationLat?: number;
  locationLng?: number;
  currentBarId?: string;
  isVisibleOnMap?: boolean;
}

export interface SocialStatusResponse {
  success: boolean;
  socialProfile: UserSocialProfile;
  message: string;
}

export interface NearbyUsersResponse {
  users: UserSocialProfileWithRelations[];
}

export interface HopInRequest {
  targetUserId: string;
  barId?: string;
  message?: string;
}

export interface HopInResponse {
  success: boolean;
  interaction: SocialInteractionWithRelations;
  message: string;
}

// Component Prop Types
export interface SocialToggleProps {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  isLoading?: boolean;
}

export interface SocialMapProps {
  users: UserSocialProfileWithRelations[];
  onUserClick: (user: UserSocialProfileWithRelations) => void;
  currentLocation?: { lat: number; lng: number };
}

export interface UserListProps {
  users: UserSocialProfileWithRelations[];
  onHopIn: (user: UserSocialProfileWithRelations) => void;
  isLoading?: boolean;
}

// Additional utility types
export interface UserLocation {
  lat: number;
  lng: number;
}

export interface SocialUser {
  id: string;
  name: string | null;
  image: string | null;
  vibe: SocialVibe | null;
  interests: string[];
  currentBar?: {
    id: string;
    name: string;
    address: string;
    type: BarType;
  } | null;
  distance?: number;
  socialStatus: SocialStatus;
}

// For API error responses
export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: string;
}

// For real-time social updates
export interface SocialPresenceUpdate {
  userId: string;
  isActive: boolean;
  location?: UserLocation;
  currentBarId?: string;
  lastActive: Date;
}
