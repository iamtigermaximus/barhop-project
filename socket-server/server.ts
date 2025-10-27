// socket-server/server.ts
import { Server as SocketServer, Socket } from "socket.io";
import { createServer } from "http";
import { PrismaClient, NotificationType, HopInStatus } from "@prisma/client";

const prisma = new PrismaClient();
const server = createServer();

// Define proper TypeScript interfaces based on your actual schema
interface User {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

interface Bar {
  id: string;
  name: string;
}

interface Crawl {
  id: string;
  name: string;
  creatorId: string;
  maxParticipants: number;
  creator: User;
  participants: { userId: string }[];
  _count: {
    participants: number;
  };
}

interface HopIn {
  id: string;
  fromUserId: string;
  toUserId: string;
  barId: string | null;
  status: HopInStatus;
  fromUser: User;
  toUser: User;
  bar: Bar | null;
}

interface ChatroomMessage {
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

interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  fromUserId: string;
  message?: string;
  barId?: string;
  crawlId?: string;
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
  hopIn?: HopIn;
  crawl?: {
    id: string;
    name: string;
  };
}

interface HopInRequestData {
  fromUserId: string;
  toUserId: string;
  barId?: string;
  message?: string;
}

interface WaveRequestData {
  fromUserId: string;
  toUserId: string;
}

interface HopInResponseData {
  hopInId: string;
  status: "ACCEPTED" | "DECLINED";
  userId: string;
}

interface CrawlJoinRequestData {
  crawlId: string;
  userId: string;
  message?: string;
}

interface CrawlJoinResponseData {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  userId: string;
}

interface UserJoinedCrawlData {
  crawlId: string;
  userId: string;
}

interface ChatroomMessageData {
  chatroomId: string;
  content: string;
  userId: string;
}

interface ErrorResponse {
  message: string;
  code?: string;
}

interface SystemNotificationData {
  barId?: string;
  hopInId?: string;
  meetupId?: string;
  crawlId?: string;
  metadata?: Record<string, unknown>;
}

// Extend Socket interface to include userId
interface CustomSocket extends Socket {
  userId?: string;
}

const io = new SocketServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://barhop-project.vercel.app",
      "https://*.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Your existing SocketService class with proper types
export class SocketService {
  private static instance: SocketService;
  public io: SocketServer | null = null;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public attachServer(httpServer: ReturnType<typeof createServer>): void {
    if (this.io) {
      return;
    }

    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: CustomSocket) => {
      console.log("User connected:", socket.id);

      const userId = socket.handshake.query.userId as string;
      if (userId) {
        console.log(`User ID ${userId} connected with socket ${socket.id}`);
        socket.userId = userId;
      } else {
        console.warn("No user ID found in socket handshake");
      }

      socket.on("join_user_room", (userId: string) => {
        this.handleJoinUserRoom(socket, userId);
      });

      socket.on("send_hop_request", (data: HopInRequestData) => {
        this.handleHopRequest(socket, data);
      });

      socket.on("send_wave", (data: WaveRequestData) => {
        this.handleWave(socket, data);
      });

      socket.on("respond_hop_request", (data: HopInResponseData) => {
        this.handleHopResponse(socket, data);
      });

      socket.on("send_crawl_join_request", (data: CrawlJoinRequestData) => {
        this.handleCrawlJoinRequest(socket, data);
      });

      socket.on("respond_crawl_join_request", (data: CrawlJoinResponseData) => {
        this.handleCrawlJoinResponse(socket, data);
      });

      socket.on("user_joined_crawl", (data: UserJoinedCrawlData) => {
        this.handleUserJoinedCrawl(socket, data);
      });

      socket.on("user_left_crawl", (data: UserJoinedCrawlData) => {
        console.log("User left crawl event received:", data);
        this.handleUserLeftCrawl(socket, data);
      });

      socket.on(
        "mark_notification_read",
        (data: { notificationId: string; userId: string }) => {
          this.handleNotificationRead(socket, data);
        }
      );

      socket.on("join_chatroom", (data: { chatroomId: string }) => {
        this.handleJoinChatroom(socket, data);
      });

      socket.on("leave_chatroom", (data: { chatroomId: string }) => {
        this.handleLeaveChatroom(socket, data);
      });

      socket.on("send_message", (data: ChatroomMessageData) => {
        this.handleSendMessage(socket, data);
      });

      socket.on("disconnect", (reason: string) => {
        console.log("User disconnected:", socket.id, "Reason:", reason);
      });
    });
  }

  private handleJoinUserRoom(socket: CustomSocket, userId: string): void {
    if (!userId) {
      console.error("No userId provided for join_user_room");
      return;
    }
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  }

  private async handleJoinChatroom(
    socket: CustomSocket,
    data: { chatroomId: string }
  ): Promise<void> {
    try {
      const { chatroomId } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit("error", {
          message: "User ID required to join chatroom",
          code: "MISSING_USER_ID",
        });
        return;
      }

      console.log(`User ${userId} joining chatroom: ${chatroomId}`);

      const participant = await prisma.chatroomParticipant.findFirst({
        where: {
          chatroomId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!participant) {
        socket.emit("error", {
          message: "You are not a participant in this chatroom",
          code: "NOT_PARTICIPANT",
        });
        return;
      }

      socket.join(`chatroom_${chatroomId}`);

      socket.to(`chatroom_${chatroomId}`).emit("user_joined_chatroom", {
        participant,
      });

      console.log(`User ${userId} successfully joined chatroom: ${chatroomId}`);
    } catch (error) {
      console.error("Error joining chatroom:", error);
      socket.emit("error", {
        message: "Failed to join chatroom",
        code: "CHATROOM_JOIN_ERROR",
      });
    }
  }

  private async handleLeaveChatroom(
    socket: CustomSocket,
    data: { chatroomId: string }
  ): Promise<void> {
    try {
      const { chatroomId } = data;
      const userId = socket.userId;

      if (!userId) {
        console.error("No user ID found for leave_chatroom");
        return;
      }

      console.log(`User ${userId} leaving chatroom: ${chatroomId}`);

      socket.leave(`chatroom_${chatroomId}`);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (user) {
        socket.to(`chatroom_${chatroomId}`).emit("user_left_chatroom", {
          userId: user.id,
          userName: user.name,
        });
      }

      console.log(`User ${userId} successfully left chatroom: ${chatroomId}`);
    } catch (error) {
      console.error("Error leaving chatroom:", error);
      socket.emit("error", {
        message: "Failed to leave chatroom",
        code: "CHATROOM_LEAVE_ERROR",
      });
    }
  }

  private async handleSendMessage(
    socket: CustomSocket,
    data: ChatroomMessageData
  ): Promise<void> {
    try {
      const { chatroomId, content, userId } = data;

      console.log(
        `Sending message to chatroom ${chatroomId} from user ${userId}`
      );

      const participant = await prisma.chatroomParticipant.findFirst({
        where: {
          chatroomId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!participant) {
        socket.emit("error", {
          message: "You are not a participant in this chatroom",
          code: "NOT_PARTICIPANT",
        });
        return;
      }

      const message = await prisma.chatroomMessage.create({
        data: {
          content: content.trim(),
          userId,
          chatroomId,
          messageType: "TEXT",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      console.log(`Message created in database:`, message.id);

      // Fix: Create a properly typed message object
      const chatMessage: ChatroomMessage = {
        id: message.id,
        content: message.content,
        userId: message.userId,
        chatroomId: message.chatroomId,
        messageType: message.messageType,
        createdAt: message.createdAt,
        user: {
          id: message.user.id,
          name: message.user.name,
          image: message.user.image,
        },
      };

      this.io?.to(`chatroom_${chatroomId}`).emit("new_message", chatMessage);
      await this.handleChatMessageNotification(chatMessage, chatroomId);

      console.log(`Message broadcasted to chatroom ${chatroomId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", {
        message: "Failed to send message",
        code: "MESSAGE_SEND_ERROR",
      });
    }
  }

  private async handleNotificationRead(
    socket: CustomSocket,
    data: { notificationId: string; userId: string }
  ): Promise<void> {
    try {
      const { notificationId, userId } = data;

      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          hopIn: {
            include: {
              bar: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          crawl: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.io?.to(`user_${userId}`).emit("notification_updated", notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      const errorResponse: ErrorResponse = {
        message: "Failed to mark notification as read",
        code: "NOTIFICATION_READ_ERROR",
      };
      socket.emit("error", errorResponse);
    }
  }

  private async handleHopRequest(
    socket: CustomSocket,
    data: HopInRequestData
  ): Promise<void> {
    try {
      const { fromUserId, toUserId, barId, message } = data;

      if (!fromUserId || !toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Missing user IDs",
          code: "MISSING_USER_IDS",
        };
        socket.emit("error", errorResponse);
        return;
      }

      if (fromUserId === toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Cannot send hop request to yourself",
          code: "SELF_REQUEST_ERROR",
        };
        socket.emit("error", errorResponse);
        return;
      }

      console.log(`Sending hop request from ${fromUserId} to ${toUserId}`);

      const hopIn = await prisma.hopIn.create({
        data: {
          fromUserId,
          toUserId,
          barId,
          message,
          status: "PENDING",
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });

      const fromUser = await prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, image: true },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: toUserId,
          fromUserId,
          type: "HOP_REQUEST",
          message:
            message || `${fromUser?.name || "Someone"} wants to join you!`,
          barId,
          hopInId: hopIn.id,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      this.io?.to(`user_${toUserId}`).emit("new_notification", notification);

      console.log(`Hop request sent from ${fromUserId} to ${toUserId}`);

      const sentResponse = {
        hopInId: hopIn.id,
        toUserId,
        message: "Hop request sent successfully!",
      };
      socket.emit("hop_request_sent", sentResponse);
    } catch (error) {
      console.error("Error sending hop request:", error);
      const errorResponse: ErrorResponse = {
        message: "Failed to send hop request",
        code: "HOP_REQUEST_ERROR",
      };
      socket.emit("error", errorResponse);
    }
  }

  private async handleWave(
    socket: CustomSocket,
    data: WaveRequestData
  ): Promise<void> {
    try {
      const { fromUserId, toUserId } = data;

      if (!fromUserId || !toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Missing user IDs",
          code: "MISSING_USER_IDS",
        };
        socket.emit("error", errorResponse);
        return;
      }

      if (fromUserId === toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Cannot wave to yourself",
          code: "SELF_WAVE_ERROR",
        };
        socket.emit("error", errorResponse);
        return;
      }

      console.log(`Sending wave from ${fromUserId} to ${toUserId}`);

      const fromUser = await prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, image: true },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: toUserId,
          fromUserId,
          type: "WAVE",
          message: `${fromUser?.name || "Someone"} waved at you! 👋`,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      this.io?.to(`user_${toUserId}`).emit("new_notification", notification);
      console.log(`Wave sent from ${fromUserId} to ${toUserId}`);
    } catch (error) {
      console.error("Error sending wave:", error);
      const errorResponse: ErrorResponse = {
        message: "Failed to send wave",
        code: "WAVE_ERROR",
      };
      socket.emit("error", errorResponse);
    }
  }

  private async handleHopResponse(
    socket: CustomSocket,
    data: HopInResponseData
  ): Promise<void> {
    try {
      const { hopInId, status, userId } = data;

      if (!hopInId || !status || !userId) {
        const errorResponse: ErrorResponse = {
          message: "Missing required fields for hop response",
          code: "MISSING_FIELDS",
        };
        socket.emit("error", errorResponse);
        return;
      }

      console.log(
        `Processing hop response: ${status} for hopInId: ${hopInId} by user: ${userId}`
      );

      const hopIn = await prisma.hopIn.update({
        where: { id: hopInId },
        data: { status },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          bar: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      console.log(`Hop request updated to: ${status}`);

      if (status === "ACCEPTED") {
        const acceptanceNotification = await prisma.notification.create({
          data: {
            userId: hopIn.fromUserId,
            fromUserId: userId,
            type: "HOP_ACCEPTED",
            message: `${
              hopIn.toUser.name || "Someone"
            } accepted your hop in request! 🎉`,
            barId: hopIn.barId || undefined,
            hopInId: hopIn.id,
          },
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        this.io
          ?.to(`user_${hopIn.fromUserId}`)
          .emit("new_notification", acceptanceNotification);
        console.log(
          `Sent acceptance notification to user: ${hopIn.fromUserId}`
        );

        const acceptedResponse = {
          hopInId: hopIn.id,
          fromUser: hopIn.fromUser,
          toUser: hopIn.toUser,
          bar: hopIn.bar || undefined,
        };
        socket.emit("hop_request_accepted", acceptedResponse);
      } else if (status === "DECLINED") {
        const declinedResponse = {
          hopInId: hopIn.id,
          fromUser: hopIn.fromUser,
          toUser: hopIn.toUser,
        };
        socket.emit("hop_request_declined", declinedResponse);
        console.log(`Hop request declined silently by user: ${userId}`);
      }

      console.log(`Hop request ${status.toLowerCase()} by ${userId}`);
    } catch (error) {
      console.error("Error responding to hop request:", error);
      const errorResponse: ErrorResponse = {
        message: "Failed to respond to hop request",
        code: "HOP_RESPONSE_ERROR",
      };
      socket.emit("error", errorResponse);
    }
  }

  private async handleCrawlJoinRequest(
    socket: CustomSocket,
    data: CrawlJoinRequestData
  ): Promise<void> {
    try {
      const { crawlId, userId, message } = data;

      const crawl = await prisma.crawl.findUnique({
        where: { id: crawlId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          participants: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      });

      if (!crawl) {
        socket.emit("error", {
          message: "Crawl not found",
          code: "CRAWL_NOT_FOUND",
        });
        return;
      }

      const isAlreadyParticipant = crawl.participants.some(
        (p) => p.userId === userId
      );
      if (isAlreadyParticipant) {
        socket.emit("error", {
          message: "You are already in this crawl",
          code: "ALREADY_PARTICIPANT",
        });
        return;
      }

      const existingRequest = await prisma.crawlJoinRequest.findFirst({
        where: {
          crawlId,
          userId,
          status: "PENDING",
        },
      });

      if (existingRequest) {
        socket.emit("error", {
          message: "You already have a pending request",
          code: "DUPLICATE_REQUEST",
        });
        return;
      }

      if (crawl._count.participants >= crawl.maxParticipants) {
        socket.emit("error", {
          message: "This crawl is full",
          code: "CRAWL_FULL",
        });
        return;
      }

      const requestingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!requestingUser) {
        socket.emit("error", {
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      const joinRequest = await prisma.crawlJoinRequest.create({
        data: {
          crawlId,
          userId,
          message,
          status: "PENDING",
        },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId,
          fromUserId: userId,
          type: "CRAWL_JOIN_REQUEST",
          message: `${
            requestingUser.name || "Someone"
          } wants to join your crawl "${crawl.name}"!`,
          crawlId: crawlId,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          crawl: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      const sentResponse = {
        requestId: joinRequest.id,
        crawlName: crawl.name,
        message: "Join request sent! Waiting for approval.",
      };
      socket.emit("crawl_join_request_sent", sentResponse);

      console.log(`Crawl join request sent from ${userId} to crawl ${crawlId}`);
    } catch (error) {
      console.error("Error sending crawl join request:", error);
      socket.emit("error", {
        message: "Failed to send join request",
        code: "JOIN_REQUEST_ERROR",
      });
    }
  }

  private async handleCrawlJoinResponse(
    socket: CustomSocket,
    data: CrawlJoinResponseData
  ): Promise<void> {
    try {
      const { requestId, status, userId } = data;

      const joinRequest = await prisma.crawlJoinRequest.findUnique({
        where: { id: requestId },
        include: {
          crawl: {
            include: {
              creator: true,
              participants: {
                select: {
                  userId: true,
                },
              },
              _count: {
                select: {
                  participants: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!joinRequest) {
        socket.emit("error", {
          message: "Join request not found",
          code: "REQUEST_NOT_FOUND",
        });
        return;
      }

      if (joinRequest.crawl.creatorId !== userId) {
        socket.emit("error", {
          message: "Only crawl creator can respond to join requests",
          code: "UNAUTHORIZED",
        });
        return;
      }

      if (
        status === "APPROVED" &&
        joinRequest.crawl._count.participants >=
          joinRequest.crawl.maxParticipants
      ) {
        socket.emit("error", {
          message: "Crawl is now full",
          code: "CRAWL_FULL",
        });
        return;
      }

      await prisma.crawlJoinRequest.update({
        where: { id: requestId },
        data: {
          status,
          respondedAt: new Date(),
        },
      });

      if (status === "APPROVED") {
        await prisma.crawlParticipant.create({
          data: {
            crawlId: joinRequest.crawlId,
            userId: joinRequest.userId,
          },
        });

        const approvalNotification = await prisma.notification.create({
          data: {
            userId: joinRequest.userId,
            fromUserId: userId,
            type: "CRAWL_JOIN_APPROVED",
            message: `Your request to join "${joinRequest.crawl.name}" was approved! 🎉`,
            crawlId: joinRequest.crawlId,
          },
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        this.io
          ?.to(`user_${joinRequest.userId}`)
          .emit("new_notification", approvalNotification);
      } else {
        const rejectionNotification = await prisma.notification.create({
          data: {
            userId: joinRequest.userId,
            fromUserId: userId,
            type: "CRAWL_JOIN_REJECTED",
            message: `Your request to join "${joinRequest.crawl.name}" was not approved.`,
            crawlId: joinRequest.crawlId,
          },
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        this.io
          ?.to(`user_${joinRequest.userId}`)
          .emit("new_notification", rejectionNotification);
      }

      const respondedResponse = {
        requestId,
        status,
        userName: joinRequest.user.name || "User",
      };
      socket.emit("crawl_join_request_responded", respondedResponse);

      console.log(
        `Crawl join request ${status.toLowerCase()} for request ${requestId}`
      );
    } catch (error) {
      console.error("Error responding to crawl join request:", error);
      socket.emit("error", {
        message: "Failed to respond to join request",
        code: "JOIN_RESPONSE_ERROR",
      });
    }
  }

  private async handleUserJoinedCrawl(
    socket: CustomSocket,
    data: UserJoinedCrawlData
  ): Promise<void> {
    try {
      const { crawlId, userId } = data;

      console.log(`Handling user joined crawl:`, {
        crawlId,
        userId,
      });

      const crawl = await prisma.crawl.findUnique({
        where: { id: crawlId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!crawl) {
        console.error("Crawl not found for ID:", crawlId);
        socket.emit("error", {
          message: "Crawl not found",
          code: "CRAWL_NOT_FOUND",
        });
        return;
      }

      const joiningUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!joiningUser) {
        console.error("Joining user not found for ID:", userId);
        socket.emit("error", {
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      console.log(
        `Creating join notification for crawl creator: ${crawl.creator.id}`
      );

      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId,
          fromUserId: userId,
          type: "SYSTEM",
          message: `${joiningUser.name || "Someone"} joined your crawl "${
            crawl.name
          }"!`,
          crawlId: crawlId,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      console.log(`Join notification created:`, notification.id);

      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      console.log(`Join notification sent to creator: ${crawl.creator.id}`);
    } catch (error) {
      console.error("Error handling user joined crawl:", error);
      socket.emit("error", {
        message: "Failed to send join notification",
        code: "JOIN_NOTIFICATION_ERROR",
      });
    }
  }

  private async handleUserLeftCrawl(
    socket: CustomSocket,
    data: UserJoinedCrawlData
  ): Promise<void> {
    try {
      const { crawlId, userId } = data;

      console.log(`Handling user left crawl:`, { crawlId, userId });

      const crawl = await prisma.crawl.findUnique({
        where: { id: crawlId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!crawl) {
        console.error("Crawl not found for ID:", crawlId);
        socket.emit("error", {
          message: "Crawl not found",
          code: "CRAWL_NOT_FOUND",
        });
        return;
      }

      const leavingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!leavingUser) {
        console.error("Leaving user not found for ID:", userId);
        socket.emit("error", {
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      console.log(
        `Creating leave notification for crawl creator: ${crawl.creator.id}`
      );

      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId,
          fromUserId: userId,
          type: "SYSTEM",
          message: `${leavingUser.name || "Someone"} left your crawl "${
            crawl.name
          }"`,
          crawlId: crawlId,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      console.log(`Leave notification created:`, notification.id);

      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      console.log(`Leave notification sent to creator: ${crawl.creator.id}`);
    } catch (error) {
      console.error("Error handling user left crawl:", error);
      socket.emit("error", {
        message: "Failed to send leave notification",
        code: "LEAVE_NOTIFICATION_ERROR",
      });
    }
  }

  private async handleChatMessageNotification(
    message: ChatroomMessage,
    chatroomId: string
  ): Promise<void> {
    try {
      console.log(
        `📢 Starting chat notification process for message ${message.id}`
      );

      const participants = await prisma.chatroomParticipant.findMany({
        where: {
          chatroomId,
          userId: { not: message.userId },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const chatroom = await prisma.chatroom.findUnique({
        where: { id: chatroomId },
        include: {
          crawl: {
            select: {
              name: true,
            },
          },
        },
      });

      const crawlName = chatroom?.crawl?.name || "the crawl";
      const senderName = message.user.name || "Someone";

      console.log(
        `📨 Creating notifications for ${participants.length} participants`
      );

      for (const participant of participants) {
        const notification = await prisma.notification.create({
          data: {
            userId: participant.userId,
            fromUserId: message.userId,
            type: "MESSAGE",
            message: `${senderName} sent a message in "${crawlName}"`,
            crawlId: chatroom?.crawlId || null,
          },
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            crawl: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        this.io
          ?.to(`user_${participant.userId}`)
          .emit("new_notification", notification);
        console.log(`✅ Sent chat notification to user ${participant.userId}`);
      }

      console.log(
        `🎉 Successfully sent chat notifications to ${participants.length} participants`
      );
    } catch (error) {
      console.error("❌ Error sending chat notifications:", error);
    }
  }

  public async sendSystemNotification(
    userId: string,
    message: string,
    data?: SystemNotificationData
  ): Promise<void> {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          fromUserId: userId,
          type: "SYSTEM",
          message,
          barId: data?.barId,
          hopInId: data?.hopInId,
          meetupId: data?.meetupId,
          crawlId: data?.crawlId,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      this.io?.to(`user_${userId}`).emit("new_notification", notification);
      console.log(`System notification sent to user: ${userId}`);
    } catch (error) {
      console.error("Error sending system notification:", error);
    }
  }

  public getUserConnections(userId: string): string[] {
    if (!this.io) return [];

    const userRoom = `user_${userId}`;
    const room = this.io.sockets.adapter.rooms.get(userRoom);
    return room ? Array.from(room) : [];
  }

  public isUserConnected(userId: string): boolean {
    return this.getUserConnections(userId).length > 0;
  }

  public getConnectedUserIds(): string[] {
    if (!this.io) return [];

    const connectedUsers: string[] = [];
    const rooms = this.io.sockets.adapter.rooms;

    for (const [roomName] of rooms.entries()) {
      if (roomName.startsWith("user_")) {
        const userId = roomName.replace("user_", "");
        connectedUsers.push(userId);
      }
    }

    return connectedUsers;
  }

  public sendToUser<T>(userId: string, event: string, data: T): void {
    this.io?.to(`user_${userId}`).emit(event, data);
  }

  public broadcast<T>(event: string, data: T): void {
    this.io?.emit(event, data);
  }
}

const socketService = SocketService.getInstance();
socketService.attachServer(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`✅ CORS enabled for production`);
});
