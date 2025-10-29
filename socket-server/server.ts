import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { Server as SocketServer, Socket } from "socket.io";
import { PrismaClient, NotificationType, HopInStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Server as NetServer } from "http";

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is required");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

console.log("✅ Environment variables validated");

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();

// Middleware - UPDATE CORS to be more permissive
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://barhop-project.vercel.app",
      "https://hoppr.vercel.app", // Add your actual Vercel domain
      "https://*.vercel.app",
      "https://hoppr-socket-project.onrender.com", // Allow itself
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  return res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Socket.IO Server",
    environment: process.env.NODE_ENV || "development",
  });
});

// Notifications API routes
app.get("/api/notifications", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    interface JwtPayload {
      userId: string;
      iat?: number;
      exp?: number;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        fromUser: {
          select: { id: true, name: true, image: true },
        },
        hopIn: {
          include: {
            bar: { select: { id: true, name: true } },
          },
        },
        crawl: { select: { id: true, name: true } },
        chatroom: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.post(
  "/api/notifications/mark-read",
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Access token required" });
      }

      interface JwtPayload {
        userId: string;
        iat?: number;
        exp?: number;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const userId = decoded.userId;
      const { notificationId } = req.body;

      if (!notificationId) {
        return res.status(400).json({ error: "Notification ID is required" });
      }

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
            select: { id: true, name: true, image: true },
          },
        },
      });

      return res.json({ notification });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return res
        .status(500)
        .json({ error: "Failed to mark notification as read" });
    }
  }
);

// Crawl join endpoint
app.post("/api/crawls/:id/join", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const crawlId = req.params.id;

    // Validate authentication
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Verify token
    interface JwtPayload {
      userId: string;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Your existing crawl join logic
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
      include: {
        creator: { select: { id: true, name: true } },
      },
    });

    if (!crawl) {
      return res.status(404).json({ error: "Crawl not found" });
    }

    const joiningUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true },
    });

    if (!joiningUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add user to crawl participants
    await prisma.crawlParticipant.create({
      data: { crawlId, userId },
    });

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: crawl.creatorId,
        fromUserId: userId,
        type: "SYSTEM" as NotificationType,
        message: `${joiningUser.name || "Someone"} joined your crawl "${
          crawl.name
        }"!`,
        crawlId: crawlId,
      },
      include: {
        fromUser: { select: { id: true, name: true, image: true } },
      },
    });

    // Emit socket event to crawl creator
    const socketService = SocketService.getInstance();
    socketService.sendToUser(crawl.creatorId, "new_notification", notification);

    return res.json({ success: true, notification });
  } catch (error) {
    console.error("Error joining crawl:", error);
    return res.status(500).json({ error: "Failed to join crawl" });
  }
});

// Crawl leave endpoint
app.post("/api/crawls/:id/leave", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const crawlId = req.params.id;

    // Validate authentication
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Remove user from crawl participants
    await prisma.crawlParticipant.deleteMany({
      where: { crawlId, userId },
    });

    // Get crawl info for notification
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
      include: { creator: { select: { id: true, name: true } } },
    });

    const leavingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true },
    });

    if (crawl && leavingUser) {
      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId,
          fromUserId: userId,
          type: "SYSTEM" as NotificationType,
          message: `${leavingUser.name || "Someone"} left your crawl "${
            crawl.name
          }"`,
          crawlId: crawlId,
        },
        include: {
          fromUser: { select: { id: true, name: true, image: true } },
        },
      });

      const socketService = SocketService.getInstance();
      socketService.sendToUser(
        crawl.creatorId,
        "new_notification",
        notification
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error leaving crawl:", error);
    return res.status(500).json({ error: "Failed to leave crawl" });
  }
});

// Hop-in request endpoint
app.post("/api/social/hop-in", async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, barId, message } = req.body;

    // Validate authentication
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Your existing hop request logic
    const hopIn = await prisma.hopIn.create({
      data: {
        fromUserId,
        toUserId,
        barId,
        message,
        status: "PENDING" as HopInStatus,
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
        type: "HOP_REQUEST" as NotificationType,
        message: message || `${fromUser?.name || "Someone"} wants to join you!`,
        barId,
        hopInId: hopIn.id,
      },
      include: {
        fromUser: { select: { id: true, name: true, image: true } },
      },
    });

    const socketService = SocketService.getInstance();
    socketService.sendToUser(toUserId, "new_notification", notification);

    return res.json({ success: true, hopInId: hopIn.id, notification });
  } catch (error) {
    console.error("Error sending hop request:", error);
    return res.status(500).json({ error: "Failed to send hop request" });
  }
});

// Hop-in response endpoint
app.post("/api/social/hop-in/respond", async (req: Request, res: Response) => {
  try {
    const { hopInId, status, userId } = req.body;

    // Validate authentication
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Your existing hop response logic
    const hopIn = await prisma.hopIn.update({
      where: { id: hopInId },
      data: { status: status as HopInStatus },
      include: {
        fromUser: { select: { id: true, name: true, image: true } },
        toUser: { select: { id: true, name: true, image: true } },
        bar: { select: { id: true, name: true } },
      },
    });

    if (status === "ACCEPTED") {
      const chatroom = await prisma.chatroom.create({
        data: {
          name: `Private Chat - ${hopIn.fromUser.name || "User"} & ${
            hopIn.toUser.name || "User"
          }`,
          isGroupChat: false,
          participants: {
            create: [
              { userId: hopIn.fromUserId, role: "MEMBER" },
              { userId: hopIn.toUserId, role: "MEMBER" },
            ],
          },
        },
      });

      // Create notifications for both users
      const acceptanceNotification = await prisma.notification.create({
        data: {
          userId: hopIn.fromUserId,
          fromUserId: userId,
          type: "HOP_ACCEPTED" as NotificationType,
          message: `${
            hopIn.toUser.name || "Someone"
          } accepted your hop request!`,
          barId: hopIn.barId || undefined,
          hopInId: hopIn.id,
          chatroomId: chatroom.id,
        },
      });

      const acceptorNotification = await prisma.notification.create({
        data: {
          userId: hopIn.toUserId,
          fromUserId: hopIn.fromUserId,
          type: "HOP_ACCEPTED" as NotificationType,
          message: `You accepted ${
            hopIn.fromUser.name || "someone"
          }'s hop request!`,
          barId: hopIn.barId || undefined,
          hopInId: hopIn.id,
          chatroomId: chatroom.id,
        },
      });

      const socketService = SocketService.getInstance();
      socketService.sendToUser(
        hopIn.fromUserId,
        "new_notification",
        acceptanceNotification
      );
      socketService.sendToUser(
        hopIn.toUserId,
        "new_notification",
        acceptorNotification
      );
    }

    return res.json({ success: true, hopIn });
  } catch (error) {
    console.error("Error responding to hop request:", error);
    return res.status(500).json({ error: "Failed to respond to hop request" });
  }
});

// INTERFACES
interface SystemNotificationData {
  barId?: string;
  hopInId?: string;
  meetupId?: string;
  crawlId?: string;
  metadata?: Record<string, unknown>;
}

interface HopRequestSentResponse {
  hopInId: string;
  toUserId: string;
  message: string;
}

interface HopRequestAcceptedResponse {
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

interface HopRequestDeclinedResponse {
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

interface CrawlJoinRequestSentResponse {
  requestId: string;
  crawlName: string;
  message: string;
}

interface CrawlJoinRequestRespondedResponse {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  userName: string;
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

interface ErrorResponse {
  message: string;
  code?: string;
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
  status: HopInStatus;
  userId: string;
}

interface CustomSocket extends Socket {
  userId?: string;
}

interface JwtAuthPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// SOCKET SERVICE CLASS
export class SocketService {
  private static instance: SocketService;
  public io: SocketServer | null = null;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public attachServer(httpServer: NetServer): void {
    if (this.io) {
      return;
    }

    this.io = new SocketServer(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://barhop-project.vercel.app",
          "https://hoppr.vercel.app", // Add your actual Vercel domain
          "https://*.vercel.app",
          "https://hoppr-socket-project.onrender.com", // Allow itself
        ],
        methods: ["GET", "POST"],
        credentials: true, // ADD THIS
      },
      addTrailingSlash: false,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: CustomSocket) => {
      console.log("User connected:", socket.id);

      // Use JWT authentication instead of query params
      const token = socket.handshake.auth.token;
      if (token) {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
          ) as JwtAuthPayload;
          socket.userId = decoded.userId;
          console.log(
            `User ID ${decoded.userId} connected with socket ${socket.id}`
          );
        } catch (error) {
          console.warn("Invalid token in handshake");
        }
      } else {
        console.warn("No token found in socket handshake");
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

      this.io?.to(`chatroom_${chatroomId}`).emit("new_message", message);
      await this.handleChatMessageNotification(message, chatroomId);

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

      const sentResponse: HopRequestSentResponse = {
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
            select: { id: true, name: true, image: true },
          },
          toUser: {
            select: { id: true, name: true, image: true },
          },
          bar: {
            select: { id: true, name: true },
          },
        },
      });

      console.log(`Hop request updated to: ${status}`);

      if (status === "ACCEPTED") {
        const chatroom = await this.createPrivateChatroom(
          hopIn.fromUserId,
          hopIn.toUserId
        );

        const acceptanceNotification = await prisma.notification.create({
          data: {
            userId: hopIn.fromUserId,
            fromUserId: userId,
            type: "HOP_ACCEPTED",
            message: `${
              hopIn.toUser.name || "Someone"
            } accepted your hop request! Click here to start chatting. 💬`,
            barId: hopIn.barId || undefined,
            hopInId: hopIn.id,
            chatroomId: chatroom.id,
          },
          include: {
            fromUser: {
              select: { id: true, name: true, image: true },
            },
            chatroom: {
              select: { id: true, name: true },
            },
          },
        });

        const acceptorNotification = await prisma.notification.create({
          data: {
            userId: hopIn.toUserId,
            fromUserId: hopIn.fromUserId,
            type: "HOP_ACCEPTED",
            message: `You accepted ${
              hopIn.fromUser.name || "someone"
            }'s hop request! Click here to start chatting. 💬`,
            barId: hopIn.barId || undefined,
            hopInId: hopIn.id,
            chatroomId: chatroom.id,
          },
          include: {
            fromUser: {
              select: { id: true, name: true, image: true },
            },
            chatroom: {
              select: { id: true, name: true },
            },
          },
        });

        this.io
          ?.to(`user_${hopIn.fromUserId}`)
          .emit("new_notification", acceptanceNotification);
        this.io
          ?.to(`user_${hopIn.toUserId}`)
          .emit("new_notification", acceptorNotification);

        console.log(`Sent acceptance notifications to both users`);

        const acceptedResponse: HopRequestAcceptedResponse = {
          hopInId: hopIn.id,
          fromUser: hopIn.fromUser,
          toUser: hopIn.toUser,
          bar: hopIn.bar || undefined,
        };
        socket.emit("hop_request_accepted", acceptedResponse);
      } else if (status === "DECLINED") {
        const declinedResponse: HopRequestDeclinedResponse = {
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

      const sentResponse: CrawlJoinRequestSentResponse = {
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

      const respondedResponse: CrawlJoinRequestRespondedResponse = {
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

      console.log(`Handling user joined crawl:`, { crawlId, userId });

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

  private async createPrivateChatroom(
    userId1: string,
    userId2: string
  ): Promise<{
    id: string;
    name: string;
    isGroupChat: boolean;
    participants: Array<{
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
    }>;
  }> {
    try {
      console.log(`💬 Creating private chat between ${userId1} and ${userId2}`);

      const existingChat = await prisma.chatroom.findFirst({
        where: {
          participants: {
            every: {
              userId: { in: [userId1, userId2] },
            },
          },
          crawlId: null,
          isGroupChat: false,
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (existingChat) {
        console.log(`✅ Existing private chat found: ${existingChat.id}`);
        return existingChat;
      }

      const [user1, user2] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId1 },
          select: { name: true },
        }),
        prisma.user.findUnique({
          where: { id: userId2 },
          select: { name: true },
        }),
      ]);

      const chatroomName = `Private Chat - ${user1?.name || "User"} & ${
        user2?.name || "User"
      }`;

      const newChatroom = await prisma.chatroom.create({
        data: {
          name: chatroomName,
          isGroupChat: false,
          participants: {
            create: [
              { userId: userId1, role: "MEMBER" },
              { userId: userId2, role: "MEMBER" },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      console.log(`✅ New private chat created: ${newChatroom.id}`);
      return newChatroom;
    } catch (error) {
      console.error("❌ Error creating private chatroom:", error);
      throw error;
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

// ✅ ADD THIS: Database connection check and server initialization
async function initializeServer() {
  try {
    console.log("🔌 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Generate Prisma client
    console.log("🔧 Generating Prisma client...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Prisma client ready");

    return true;
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
}

// ✅ ADD THIS: Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

const socketService = SocketService.getInstance();
socketService.attachServer(server);

// ✅ REPLACE YOUR SERVER STARTUP with this:
const PORT = parseInt(process.env.PORT || "3001", 10);

// Initialize and start server
initializeServer().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Socket.io server running on port ${PORT}`);
    console.log(`✅ Express API routes available`);
    console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  });
});

// Handle server errors
server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});
