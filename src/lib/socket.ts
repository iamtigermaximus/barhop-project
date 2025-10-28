// src/lib/socket.ts - CLIENT IMPLEMENTATION ONLY
import { io, Socket } from "socket.io-client";
import {
  // Data types
  HopInRequestData,
  HopInResponseData,
  WaveRequestData,
  // NotificationData,
  MarkAsReadData,
  NotificationUpdatedData,
  CrawlJoinRequestData,
  CrawlJoinResponseData,
  UserJoinedCrawlData,
  ChatroomMessageData,

  // Response types
  HopRequestSentResponse,
  HopRequestAcceptedResponse,
  HopRequestDeclinedResponse,
  CrawlJoinRequestSentResponse,
  CrawlJoinRequestRespondedResponse,
  ChatroomMessage,
  UserJoinedChatroomData,
  UserLeftChatroomData,
  ErrorResponse,

  // Callback types
  NotificationCallback,
  NotificationUpdatedCallback,
  HopRequestSentCallback,
  HopRequestAcceptedCallback,
  HopRequestDeclinedCallback,
  CrawlJoinRequestSentCallback,
  CrawlJoinRequestRespondedCallback,
  NewMessageCallback,
  UserJoinedChatroomCallback,
  UserLeftChatroomCallback,
  ErrorCallback,
  GenericCallback,
} from "@/types/socket";

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

class SocketClient {
  private socket: Socket | null = null;
  private static instance: SocketClient;

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect(token?: string): Socket | null {
    // Only connect in browser environment
    if (typeof window === "undefined") {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    this.socket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("❌ Disconnected from Socket.IO server:", reason);
    });

    this.socket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Socket disconnected");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event helper methods
  joinUserRoom(userId: string): void {
    this.socket?.emit("join_user_room", userId);
  }

  sendHopRequest(data: HopInRequestData): void {
    this.socket?.emit("send_hop_request", data);
  }

  respondHopRequest(data: HopInResponseData): void {
    this.socket?.emit("respond_hop_request", data);
  }

  sendWave(data: WaveRequestData): void {
    this.socket?.emit("send_wave", data);
  }

  sendCrawlJoinRequest(data: CrawlJoinRequestData): void {
    this.socket?.emit("send_crawl_join_request", data);
  }

  respondCrawlJoinRequest(data: CrawlJoinResponseData): void {
    this.socket?.emit("respond_crawl_join_request", data);
  }

  userJoinedCrawl(data: UserJoinedCrawlData): void {
    this.socket?.emit("user_joined_crawl", data);
  }

  userLeftCrawl(data: UserJoinedCrawlData): void {
    this.socket?.emit("user_left_crawl", data);
  }

  joinChatroom(data: { chatroomId: string }): void {
    this.socket?.emit("join_chatroom", data);
  }

  leaveChatroom(data: { chatroomId: string }): void {
    this.socket?.emit("leave_chatroom", data);
  }

  sendMessage(data: ChatroomMessageData): void {
    this.socket?.emit("send_message", data);
  }

  markNotificationRead(data: MarkAsReadData): void {
    this.socket?.emit("mark_notification_read", data);
  }

  // Listeners for server events with proper typing
  onNotification(callback: NotificationCallback): void {
    this.socket?.on("new_notification", callback);
  }

  onNotificationUpdated(callback: NotificationUpdatedCallback): void {
    this.socket?.on("notification_updated", callback);
  }

  onHopRequestSent(callback: HopRequestSentCallback): void {
    this.socket?.on("hop_request_sent", callback);
  }

  onHopRequestAccepted(callback: HopRequestAcceptedCallback): void {
    this.socket?.on("hop_request_accepted", callback);
  }

  onHopRequestDeclined(callback: HopRequestDeclinedCallback): void {
    this.socket?.on("hop_request_declined", callback);
  }

  onCrawlJoinRequestSent(callback: CrawlJoinRequestSentCallback): void {
    this.socket?.on("crawl_join_request_sent", callback);
  }

  onCrawlJoinRequestResponded(
    callback: CrawlJoinRequestRespondedCallback
  ): void {
    this.socket?.on("crawl_join_request_responded", callback);
  }

  onNewMessage(callback: NewMessageCallback): void {
    this.socket?.on("new_message", callback);
  }

  onUserJoinedChatroom(callback: UserJoinedChatroomCallback): void {
    this.socket?.on("user_joined_chatroom", callback);
  }

  onUserLeftChatroom(callback: UserLeftChatroomCallback): void {
    this.socket?.on("user_left_chatroom", callback);
  }

  onError(callback: ErrorCallback): void {
    this.socket?.on("error", callback);
  }

  // Remove all listeners for a specific event
  removeAllListeners(event: string): void {
    this.socket?.removeAllListeners(event);
  }

  // Remove specific listener with type-safe callback
  removeListener(event: string, callback: GenericCallback): void {
    this.socket?.removeListener(event, callback);
  }

  // Convenience method to remove all custom listeners
  removeAllCustomListeners(): void {
    const events = [
      "new_notification",
      "notification_updated",
      "hop_request_sent",
      "hop_request_accepted",
      "hop_request_declined",
      "crawl_join_request_sent",
      "crawl_join_request_responded",
      "new_message",
      "user_joined_chatroom",
      "user_left_chatroom",
      "error",
    ];

    events.forEach((event) => {
      this.socket?.removeAllListeners(event);
    });
  }

  // Generic event handling for unknown events
  onGenericEvent(event: string, callback: GenericCallback): void {
    this.socket?.on(event, callback);
  }

  // Emit generic events
  emitGenericEvent(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }
}

export const socketClient = SocketClient.getInstance();
