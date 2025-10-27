// import { Server as SocketServer, Socket } from "socket.io";
// import { DefaultEventsMap, EventsMap } from "@socket.io/component-emitter";

// export interface HopInRequestData {
//   fromUserId: string;
//   toUserId: string;
//   barId?: string;
//   message?: string;
// }

// export interface WaveRequestData {
//   fromUserId: string;
//   toUserId: string;
// }

// export interface HopInResponseData {
//   hopInId: string;
//   status: "ACCEPTED" | "DECLINED";
//   userId: string;
// }

// export interface NotificationData {
//   id: string;
//   userId: string;
//   type: "HOP_REQUEST" | "WAVE" | "MESSAGE" | "SYSTEM";
//   fromUserId: string;
//   message?: string;
//   barId?: string;
//   read: boolean;
//   createdAt: Date;
//   hopInId?: string;
//   fromUser?: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
// }

// // Custom Socket.io server type to avoid 'any'
// export type CustomSocketServer = SocketServer<
//   DefaultEventsMap,
//   DefaultEventsMap,
//   DefaultEventsMap,
//   unknown
// >;

// // Extend Next.js types for Socket.io
// declare global {
//   var socketServerInitialized: boolean | undefined;
// }

// declare module "http" {
//   interface Server {
//     io?: CustomSocketServer;
//   }
// }

// declare module "net" {
//   interface Socket {
//     server?: import("http").Server & { io?: CustomSocketServer };
//   }
// }
export enum NotificationType {
  HOP_REQUEST = "HOP_REQUEST",
  HOP_ACCEPTED = "HOP_ACCEPTED",
  HOP_DECLINED = "HOP_DECLINED",
  WAVE = "WAVE",
  MESSAGE = "MESSAGE",
  SYSTEM = "SYSTEM",
  MEETUP_INVITE = "MEETUP_INVITE",
  CRAWL_JOIN_REQUEST = "CRAWL_JOIN_REQUEST",
  CRAWL_JOIN_APPROVED = "CRAWL_JOIN_APPROVED",
  CRAWL_JOIN_REJECTED = "CRAWL_JOIN_REJECTED",
}

export enum HopInStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}
export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  fromUserId: string;
  message?: string;
  barId?: string;
  crawlId?: string;
  chatroomId?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  hopInId?: string;
  meetupId?: string;
  fromUser?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  hopIn?: {
    id: string;
    barId?: string;
    bar?: {
      id: string;
      name: string;
    };
    status: HopInStatus;
  };
  crawl?: {
    id: string;
    name: string;
  };
}

export interface HopInRequestData {
  fromUserId: string;
  toUserId: string;
  barId?: string;
  message?: string;
}

export interface HopInRequestData {
  fromUserId: string;
  toUserId: string;
  barId?: string;
  message?: string;
}

export interface WaveRequestData {
  fromUserId: string;
  toUserId: string;
}

export interface HopInResponseData {
  hopInId: string;
  status: "ACCEPTED" | "DECLINED";
  userId: string;
}

// 🆕 ADD THESE NEW TYPES
export interface MarkAsReadData {
  notificationId: string;
  userId: string;
}

export interface NotificationUpdatedData {
  id: string;
  read: boolean;
  readAt: Date | null;
}

export interface NotificationsResponse {
  notifications: NotificationData[];
  unreadCount: number;
  total: number;
}

// Socket Server Types
import { Server as SocketServer } from "socket.io";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export type CustomSocketServer = SocketServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  unknown
>;

// Extend Next.js types for Socket.io
declare global {
  var socketServerInitialized: boolean | undefined;
}

declare module "http" {
  interface Server {
    io?: CustomSocketServer;
  }
}

declare module "net" {
  interface Socket {
    server?: import("http").Server & { io?: CustomSocketServer };
  }
}
