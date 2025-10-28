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

export interface WaveRequestData {
  fromUserId: string;
  toUserId: string;
}

export interface HopInResponseData {
  hopInId: string;
  status: "ACCEPTED" | "DECLINED";
  userId: string;
}

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

export interface CrawlJoinRequestData {
  crawlId: string;
  userId: string;
  message?: string;
}

export interface CrawlJoinResponseData {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  userId: string;
}

export interface UserJoinedCrawlData {
  crawlId: string;
  userId: string;
}

export interface ChatroomMessageData {
  chatroomId: string;
  content: string;
  userId: string;
}

export interface ChatroomMessage {
  id: string;
  content: string;
  userId: string;
  chatroomId: string;
  messageType: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface ErrorResponse {
  message: string;
  code?: string;
}

export interface HopRequestSentResponse {
  hopInId: string;
  toUserId: string;
  message: string;
}

export interface HopRequestAcceptedResponse {
  hopInId: string;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  toUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  bar?: {
    id: string;
    name: string;
  };
}

export interface HopRequestDeclinedResponse {
  hopInId: string;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  toUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface CrawlJoinRequestSentResponse {
  requestId: string;
  crawlName: string;
  message: string;
}

export interface CrawlJoinRequestRespondedResponse {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  userName: string;
}

export interface UserJoinedChatroomData {
  participant: {
    id: string;
    userId: string;
    chatroomId: string;
    role: string;
    joinedAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

export interface UserLeftChatroomData {
  userId: string;
  userName: string | null;
}

// Socket event callback types
export type NotificationCallback = (data: NotificationData) => void;
export type NotificationUpdatedCallback = (
  data: NotificationUpdatedData
) => void;
export type HopRequestSentCallback = (data: HopRequestSentResponse) => void;
export type HopRequestAcceptedCallback = (
  data: HopRequestAcceptedResponse
) => void;
export type HopRequestDeclinedCallback = (
  data: HopRequestDeclinedResponse
) => void;
export type CrawlJoinRequestSentCallback = (
  data: CrawlJoinRequestSentResponse
) => void;
export type CrawlJoinRequestRespondedCallback = (
  data: CrawlJoinRequestRespondedResponse
) => void;
export type NewMessageCallback = (data: ChatroomMessage) => void;
export type UserJoinedChatroomCallback = (data: UserJoinedChatroomData) => void;
export type UserLeftChatroomCallback = (data: UserLeftChatroomData) => void;
export type ErrorCallback = (error: ErrorResponse) => void;

// Generic callback type for unknown events
export type GenericCallback = (...args: unknown[]) => void;

// // import { Server as SocketServer, Socket } from "socket.io";
// // import { DefaultEventsMap, EventsMap } from "@socket.io/component-emitter";

// // export interface HopInRequestData {
// //   fromUserId: string;
// //   toUserId: string;
// //   barId?: string;
// //   message?: string;
// // }

// // export interface WaveRequestData {
// //   fromUserId: string;
// //   toUserId: string;
// // }

// // export interface HopInResponseData {
// //   hopInId: string;
// //   status: "ACCEPTED" | "DECLINED";
// //   userId: string;
// // }

// // export interface NotificationData {
// //   id: string;
// //   userId: string;
// //   type: "HOP_REQUEST" | "WAVE" | "MESSAGE" | "SYSTEM";
// //   fromUserId: string;
// //   message?: string;
// //   barId?: string;
// //   read: boolean;
// //   createdAt: Date;
// //   hopInId?: string;
// //   fromUser?: {
// //     id: string;
// //     name: string | null;
// //     image: string | null;
// //   };
// // }

// // // Custom Socket.io server type to avoid 'any'
// // export type CustomSocketServer = SocketServer<
// //   DefaultEventsMap,
// //   DefaultEventsMap,
// //   DefaultEventsMap,
// //   unknown
// // >;

// // // Extend Next.js types for Socket.io
// // declare global {
// //   var socketServerInitialized: boolean | undefined;
// // }

// // declare module "http" {
// //   interface Server {
// //     io?: CustomSocketServer;
// //   }
// // }

// // declare module "net" {
// //   interface Socket {
// //     server?: import("http").Server & { io?: CustomSocketServer };
// //   }
// // }
// export enum NotificationType {
//   HOP_REQUEST = "HOP_REQUEST",
//   HOP_ACCEPTED = "HOP_ACCEPTED",
//   HOP_DECLINED = "HOP_DECLINED",
//   WAVE = "WAVE",
//   MESSAGE = "MESSAGE",
//   SYSTEM = "SYSTEM",
//   MEETUP_INVITE = "MEETUP_INVITE",
//   CRAWL_JOIN_REQUEST = "CRAWL_JOIN_REQUEST",
//   CRAWL_JOIN_APPROVED = "CRAWL_JOIN_APPROVED",
//   CRAWL_JOIN_REJECTED = "CRAWL_JOIN_REJECTED",
// }

// export enum HopInStatus {
//   PENDING = "PENDING",
//   ACCEPTED = "ACCEPTED",
//   DECLINED = "DECLINED",
//   CANCELLED = "CANCELLED",
//   EXPIRED = "EXPIRED",
// }
// export interface NotificationData {
//   id: string;
//   userId: string;
//   type: NotificationType;
//   fromUserId: string;
//   message?: string;
//   barId?: string;
//   crawlId?: string;
//   chatroomId?: string;
//   read: boolean;
//   readAt?: Date;
//   createdAt: Date;
//   hopInId?: string;
//   meetupId?: string;
//   fromUser?: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
//   hopIn?: {
//     id: string;
//     barId?: string;
//     bar?: {
//       id: string;
//       name: string;
//     };
//     status: HopInStatus;
//   };
//   crawl?: {
//     id: string;
//     name: string;
//   };
// }

// export interface HopInRequestData {
//   fromUserId: string;
//   toUserId: string;
//   barId?: string;
//   message?: string;
// }

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

// // 🆕 ADD THESE NEW TYPES
// export interface MarkAsReadData {
//   notificationId: string;
//   userId: string;
// }

// export interface NotificationUpdatedData {
//   id: string;
//   read: boolean;
//   readAt: Date | null;
// }

// export interface NotificationsResponse {
//   notifications: NotificationData[];
//   unreadCount: number;
//   total: number;
// }

// // Socket Server Types
// import { Server as SocketServer } from "socket.io";
// import { DefaultEventsMap } from "@socket.io/component-emitter";

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
// types/socket.ts
// export enum NotificationType {
//   HOP_REQUEST = "HOP_REQUEST",
//   HOP_ACCEPTED = "HOP_ACCEPTED",
//   HOP_DECLINED = "HOP_DECLINED",
//   WAVE = "WAVE",
//   MESSAGE = "MESSAGE",
//   SYSTEM = "SYSTEM",
//   MEETUP_INVITE = "MEETUP_INVITE",
//   CRAWL_JOIN_REQUEST = "CRAWL_JOIN_REQUEST",
//   CRAWL_JOIN_APPROVED = "CRAWL_JOIN_APPROVED",
//   CRAWL_JOIN_REJECTED = "CRAWL_JOIN_REJECTED",
// }

// export enum HopInStatus {
//   PENDING = "PENDING",
//   ACCEPTED = "ACCEPTED",
//   DECLINED = "DECLINED",
//   CANCELLED = "CANCELLED",
//   EXPIRED = "EXPIRED",
// }

// export interface NotificationData {
//   id: string;
//   userId: string;
//   type: NotificationType;
//   fromUserId: string;
//   message?: string;
//   barId?: string;
//   crawlId?: string;
//   chatroomId?: string;
//   read: boolean;
//   readAt?: Date;
//   createdAt: Date;
//   hopInId?: string;
//   meetupId?: string;
//   fromUser?: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
//   hopIn?: {
//     id: string;
//     barId?: string;
//     bar?: {
//       id: string;
//       name: string;
//     };
//     status: HopInStatus;
//   };
//   crawl?: {
//     id: string;
//     name: string;
//   };
// }

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

// export interface MarkAsReadData {
//   notificationId: string;
//   userId: string;
// }

// export interface NotificationUpdatedData {
//   id: string;
//   read: boolean;
//   readAt: Date | null;
// }

// export interface NotificationsResponse {
//   notifications: NotificationData[];
//   unreadCount: number;
//   total: number;
// }

// export interface CrawlJoinRequestData {
//   crawlId: string;
//   userId: string;
//   message?: string;
// }

// export interface CrawlJoinResponseData {
//   requestId: string;
//   status: "APPROVED" | "REJECTED";
//   userId: string;
// }

// export interface UserJoinedCrawlData {
//   crawlId: string;
//   userId: string;
// }

// export interface ChatroomMessageData {
//   chatroomId: string;
//   content: string;
//   userId: string;
// }

// export interface ChatroomMessage {
//   id: string;
//   content: string;
//   userId: string;
//   chatroomId: string;
//   messageType: string;
//   createdAt: Date;
//   user: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
// }

// export interface ErrorResponse {
//   message: string;
//   code?: string;
// }

// export interface HopRequestSentResponse {
//   hopInId: string;
//   toUserId: string;
//   message: string;
// }

// export interface HopRequestAcceptedResponse {
//   hopInId: string;
//   fromUser: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
//   toUser: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
//   bar?: {
//     id: string;
//     name: string;
//   };
// }

// export interface HopRequestDeclinedResponse {
//   hopInId: string;
//   fromUser: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
//   toUser: {
//     id: string;
//     name: string | null;
//     image: string | null;
//   };
// }

// export interface CrawlJoinRequestSentResponse {
//   requestId: string;
//   crawlName: string;
//   message: string;
// }

// export interface CrawlJoinRequestRespondedResponse {
//   requestId: string;
//   status: "APPROVED" | "REJECTED";
//   userName: string;
// }

// export interface UserJoinedChatroomData {
//   participant: {
//     id: string;
//     userId: string;
//     chatroomId: string;
//     role: string;
//     joinedAt: Date;
//     user: {
//       id: string;
//       name: string | null;
//       image: string | null;
//     };
//   };
// }

// export interface UserLeftChatroomData {
//   userId: string;
//   userName: string | null;
// }

// // Socket event callback types
// export type NotificationCallback = (data: NotificationData) => void;
// export type NotificationUpdatedCallback = (
//   data: NotificationUpdatedData
// ) => void;
// export type HopRequestSentCallback = (data: HopRequestSentResponse) => void;
// export type HopRequestAcceptedCallback = (
//   data: HopRequestAcceptedResponse
// ) => void;
// export type HopRequestDeclinedCallback = (
//   data: HopRequestDeclinedResponse
// ) => void;
// export type CrawlJoinRequestSentCallback = (
//   data: CrawlJoinRequestSentResponse
// ) => void;
// export type CrawlJoinRequestRespondedCallback = (
//   data: CrawlJoinRequestRespondedResponse
// ) => void;
// export type NewMessageCallback = (data: ChatroomMessage) => void;
// export type UserJoinedChatroomCallback = (data: UserJoinedChatroomData) => void;
// export type UserLeftChatroomCallback = (data: UserLeftChatroomData) => void;
// export type ErrorCallback = (error: ErrorResponse) => void;

// // Generic callback type for unknown events
// export type GenericCallback = (...args: unknown[]) => void;

// // Socket Server Types
// import { Server as SocketServer } from "socket.io";
// import { DefaultEventsMap } from "@socket.io/component-emitter";

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
// src/types/socket.ts - ALL TYPES GO HERE
