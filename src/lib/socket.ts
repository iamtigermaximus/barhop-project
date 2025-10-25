// import { Server as NetServer } from "http";
// import { Server as SocketServer } from "socket.io";
// import { PrismaClient } from "@prisma/client";
// import {
//   HopInRequestData,
//   WaveRequestData,
//   HopInResponseData,
//   NotificationData,
//   CustomSocketServer,
// } from "@/types/socket";

// const prisma = new PrismaClient();

// export class SocketService {
//   private static instance: SocketService;
//   public io: CustomSocketServer | null = null;

//   static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }

//   public attachServer(server: NetServer): void {
//     if (this.io) {
//       return;
//     }

//     this.io = new SocketServer(server, {
//       path: "/api/socket/io",
//       cors: {
//         origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
//         methods: ["GET", "POST"],
//       },
//       addTrailingSlash: false,
//     }) as CustomSocketServer;

//     this.setupEventHandlers();
//   }

//   private setupEventHandlers(): void {
//     if (!this.io) return;

//     this.io.on("connection", (socket) => {
//       console.log("User connected:", socket.id);

//       socket.on("join_user_room", (userId: string) => {
//         this.handleJoinUserRoom(socket, userId);
//       });

//       socket.on("send_hop_request", (data: HopInRequestData) => {
//         this.handleHopRequest(socket, data);
//       });

//       socket.on("send_wave", (data: WaveRequestData) => {
//         this.handleWave(socket, data);
//       });

//       socket.on("respond_hop_request", (data: HopInResponseData) => {
//         this.handleHopResponse(socket, data);
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//       });
//     });
//   }

//   private handleJoinUserRoom(
//     socket: import("socket.io").Socket,
//     userId: string
//   ): void {
//     if (!userId) {
//       console.error("No userId provided for join_user_room");
//       return;
//     }
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined room user_${userId}`);
//   }

//   private async handleHopRequest(
//     socket: import("socket.io").Socket,
//     data: HopInRequestData
//   ): Promise<void> {
//     try {
//       const { fromUserId, toUserId, barId, message } = data;

//       if (!fromUserId || !toUserId) {
//         socket.emit("error", "Missing user IDs");
//         return;
//       }

//       const hopIn = await prisma.hopIn.create({
//         data: {
//           fromUserId,
//           toUserId,
//           barId,
//           message,
//           status: "PENDING",
//           expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
//         },
//       });

//       const fromUser = await prisma.user.findUnique({
//         where: { id: fromUserId },
//         select: { name: true, image: true },
//       });

//       const notification = await prisma.notification.create({
//         data: {
//           userId: toUserId,
//           fromUserId,
//           type: "HOP_REQUEST",
//           message:
//             message || `${fromUser?.name || "Someone"} wants to join you!`,
//           barId,
//           hopInId: hopIn.id,
//         },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       this.io?.to(`user_${toUserId}`).emit("new_notification", notification);
//       console.log(`Hop request sent from ${fromUserId} to ${toUserId}`);
//     } catch (error) {
//       console.error("Error sending hop request:", error);
//       socket.emit("error", "Failed to send hop request");
//     }
//   }

//   private async handleWave(
//     socket: import("socket.io").Socket,
//     data: WaveRequestData
//   ): Promise<void> {
//     try {
//       const { fromUserId, toUserId } = data;

//       if (!fromUserId || !toUserId) {
//         socket.emit("error", "Missing user IDs");
//         return;
//       }

//       const fromUser = await prisma.user.findUnique({
//         where: { id: fromUserId },
//         select: { name: true, image: true },
//       });

//       const notification = await prisma.notification.create({
//         data: {
//           userId: toUserId,
//           fromUserId,
//           type: "WAVE",
//           message: `${fromUser?.name || "Someone"} waved at you! 👋`,
//         },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       this.io?.to(`user_${toUserId}`).emit("new_notification", notification);
//       console.log(`Wave sent from ${fromUserId} to ${toUserId}`);
//     } catch (error) {
//       console.error("Error sending wave:", error);
//       socket.emit("error", "Failed to send wave");
//     }
//   }

//   private async handleHopResponse(
//     socket: import("socket.io").Socket,
//     data: HopInResponseData
//   ): Promise<void> {
//     try {
//       const { hopInId, status, userId } = data;

//       const hopIn = await prisma.hopIn.update({
//         where: { id: hopInId },
//         data: { status },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//           toUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       if (status === "ACCEPTED") {
//         const notification = await prisma.notification.create({
//           data: {
//             userId: hopIn.fromUserId,
//             fromUserId: userId,
//             type: "HOP_REQUEST",
//             message: `${hopIn.toUser.name} accepted your hop in request! 🎉`,
//             barId: hopIn.barId || undefined,
//             hopInId: hopIn.id,
//           },
//           include: {
//             fromUser: {
//               select: {
//                 id: true,
//                 name: true,
//                 image: true,
//               },
//             },
//           },
//         });

//         this.io
//           ?.to(`user_${hopIn.fromUserId}`)
//           .emit("new_notification", notification);
//       }

//       console.log(`Hop request ${status.toLowerCase()} by ${userId}`);
//     } catch (error) {
//       console.error("Error responding to hop request:", error);
//       socket.emit("error", "Failed to respond to hop request");
//     }
//   }
// }

// export const socketService = SocketService.getInstance();
// import { Server as NetServer } from "http";
// import { Server as SocketServer } from "socket.io";
// import { PrismaClient } from "@prisma/client";
// import {
//   HopInRequestData,
//   WaveRequestData,
//   HopInResponseData,
//   NotificationData,
//   CustomSocketServer,
// } from "@/types/socket";

// const prisma = new PrismaClient();

// export class SocketService {
//   private static instance: SocketService;
//   public io: CustomSocketServer | null = null;

//   static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }

//   public attachServer(server: NetServer): void {
//     if (this.io) {
//       return;
//     }

//     this.io = new SocketServer(server, {
//       path: "/api/socket/io",
//       cors: {
//         origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
//         methods: ["GET", "POST"],
//       },
//       addTrailingSlash: false,
//     }) as CustomSocketServer;

//     this.setupEventHandlers();
//   }

//   private setupEventHandlers(): void {
//     if (!this.io) return;

//     this.io.on("connection", (socket) => {
//       console.log("User connected:", socket.id);

//       socket.on("join_user_room", (userId: string) => {
//         this.handleJoinUserRoom(socket, userId);
//       });

//       socket.on("send_hop_request", (data: HopInRequestData) => {
//         this.handleHopRequest(socket, data);
//       });

//       socket.on("send_wave", (data: WaveRequestData) => {
//         this.handleWave(socket, data);
//       });

//       socket.on("respond_hop_request", (data: HopInResponseData) => {
//         this.handleHopResponse(socket, data);
//       });

//       // 🆕 ADD THIS: Handle notification read events
//       socket.on(
//         "mark_notification_read",
//         (data: { notificationId: string; userId: string }) => {
//           this.handleNotificationRead(socket, data);
//         }
//       );

//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//       });
//     });
//   }

//   private handleJoinUserRoom(
//     socket: import("socket.io").Socket,
//     userId: string
//   ): void {
//     if (!userId) {
//       console.error("No userId provided for join_user_room");
//       return;
//     }
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined room user_${userId}`);
//   }

//   // 🆕 ADD THIS: Handle notification read events
//   private async handleNotificationRead(
//     socket: import("socket.io").Socket,
//     data: { notificationId: string; userId: string }
//   ): Promise<void> {
//     try {
//       const { notificationId, userId } = data;

//       const notification = await prisma.notification.update({
//         where: {
//           id: notificationId,
//           userId: userId, // Security: user can only update their own notifications
//         },
//         data: {
//           read: true,
//           readAt: new Date(),
//         },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//           hopIn: true,
//         },
//       });

//       // Notify all user's devices about the update
//       this.io?.to(`user_${userId}`).emit("notification_updated", notification);
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       socket.emit("error", "Failed to mark notification as read");
//     }
//   }

//   private async handleHopRequest(
//     socket: import("socket.io").Socket,
//     data: HopInRequestData
//   ): Promise<void> {
//     try {
//       const { fromUserId, toUserId, barId, message } = data;

//       if (!fromUserId || !toUserId) {
//         socket.emit("error", "Missing user IDs");
//         return;
//       }

//       const hopIn = await prisma.hopIn.create({
//         data: {
//           fromUserId,
//           toUserId,
//           barId,
//           message,
//           status: "PENDING",
//           expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
//         },
//       });

//       const fromUser = await prisma.user.findUnique({
//         where: { id: fromUserId },
//         select: { name: true, image: true },
//       });

//       const notification = await prisma.notification.create({
//         data: {
//           userId: toUserId,
//           fromUserId,
//           type: "HOP_REQUEST",
//           message:
//             message || `${fromUser?.name || "Someone"} wants to join you!`,
//           barId,
//           hopInId: hopIn.id,
//         },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       this.io?.to(`user_${toUserId}`).emit("new_notification", notification);
//       console.log(`Hop request sent from ${fromUserId} to ${toUserId}`);
//     } catch (error) {
//       console.error("Error sending hop request:", error);
//       socket.emit("error", "Failed to send hop request");
//     }
//   }

//   private async handleWave(
//     socket: import("socket.io").Socket,
//     data: WaveRequestData
//   ): Promise<void> {
//     try {
//       const { fromUserId, toUserId } = data;

//       if (!fromUserId || !toUserId) {
//         socket.emit("error", "Missing user IDs");
//         return;
//       }

//       const fromUser = await prisma.user.findUnique({
//         where: { id: fromUserId },
//         select: { name: true, image: true },
//       });

//       const notification = await prisma.notification.create({
//         data: {
//           userId: toUserId,
//           fromUserId,
//           type: "WAVE",
//           message: `${fromUser?.name || "Someone"} waved at you! 👋`,
//         },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       this.io?.to(`user_${toUserId}`).emit("new_notification", notification);
//       console.log(`Wave sent from ${fromUserId} to ${toUserId}`);
//     } catch (error) {
//       console.error("Error sending wave:", error);
//       socket.emit("error", "Failed to send wave");
//     }
//   }

//   private async handleHopResponse(
//     socket: import("socket.io").Socket,
//     data: HopInResponseData
//   ): Promise<void> {
//     try {
//       const { hopInId, status, userId } = data;

//       const hopIn = await prisma.hopIn.update({
//         where: { id: hopInId },
//         data: { status },
//         include: {
//           fromUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//           toUser: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       if (status === "ACCEPTED") {
//         const notification = await prisma.notification.create({
//           data: {
//             userId: hopIn.fromUserId,
//             fromUserId: userId,
//             type: "HOP_REQUEST",
//             message: `${hopIn.toUser.name} accepted your hop in request! 🎉`,
//             barId: hopIn.barId || undefined,
//             hopInId: hopIn.id,
//           },
//           include: {
//             fromUser: {
//               select: {
//                 id: true,
//                 name: true,
//                 image: true,
//               },
//             },
//           },
//         });

//         this.io
//           ?.to(`user_${hopIn.fromUserId}`)
//           .emit("new_notification", notification);
//       }

//       console.log(`Hop request ${status.toLowerCase()} by ${userId}`);
//     } catch (error) {
//       console.error("Error responding to hop request:", error);
//       socket.emit("error", "Failed to respond to hop request");
//     }
//   }
// }

// export const socketService = SocketService.getInstance();
import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import {
  HopInRequestData,
  WaveRequestData,
  HopInResponseData,
  NotificationData,
  CustomSocketServer,
} from "@/types/socket";

const prisma = new PrismaClient();

// Define proper types for system notification data
interface SystemNotificationData {
  barId?: string;
  hopInId?: string;
  meetupId?: string;
  crawlId?: string;
  metadata?: Record<string, unknown>;
}

// Define types for socket responses
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

// New types for crawl join requests
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

interface ErrorResponse {
  message: string;
  code?: string;
}

export class SocketService {
  private static instance: SocketService;
  public io: CustomSocketServer | null = null;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public attachServer(server: NetServer): void {
    if (this.io) {
      return;
    }

    this.io = new SocketServer(server, {
      path: "/api/socket/io",
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
      addTrailingSlash: false,
    }) as CustomSocketServer;

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

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

      // New crawl join request events
      socket.on("send_crawl_join_request", (data: CrawlJoinRequestData) => {
        this.handleCrawlJoinRequest(socket, data);
      });

      socket.on("respond_crawl_join_request", (data: CrawlJoinResponseData) => {
        this.handleCrawlJoinResponse(socket, data);
      });

      socket.on("user_joined_crawl", (data: UserJoinedCrawlData) => {
        this.handleUserJoinedCrawl(socket, data);
      });

      // 🆕 ADD LEAVE EVENT HANDLER
      socket.on("user_left_crawl", (data: UserJoinedCrawlData) => {
        console.log("💨 User left crawl event received:", data);
        this.handleUserLeftCrawl(socket, data);
      });

      // Handle notification read events
      socket.on(
        "mark_notification_read",
        (data: { notificationId: string; userId: string }) => {
          this.handleNotificationRead(socket, data);
        }
      );

      socket.on("disconnect", (reason: string) => {
        console.log("User disconnected:", socket.id, "Reason:", reason);
      });
    });
  }

  private handleJoinUserRoom(
    socket: import("socket.io").Socket,
    userId: string
  ): void {
    if (!userId) {
      console.error("No userId provided for join_user_room");
      return;
    }
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  }

  // Handle notification read events
  private async handleNotificationRead(
    socket: import("socket.io").Socket,
    data: { notificationId: string; userId: string }
  ): Promise<void> {
    try {
      const { notificationId, userId } = data;

      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId: userId, // Security: user can only update their own notifications
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

      // Notify all user's devices about the update
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
    socket: import("socket.io").Socket,
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

      // Prevent users from sending requests to themselves
      if (fromUserId === toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Cannot send hop request to yourself",
          code: "SELF_REQUEST_ERROR",
        };
        socket.emit("error", errorResponse);
        return;
      }

      console.log(`🎯 Sending hop request from ${fromUserId} to ${toUserId}`);

      // Create the hop request
      const hopIn = await prisma.hopIn.create({
        data: {
          fromUserId,
          toUserId,
          barId,
          message,
          status: "PENDING",
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        },
      });

      // Get sender info for the notification
      const fromUser = await prisma.user.findUnique({
        where: { id: fromUserId },
        select: { name: true, image: true },
      });

      // Create notification for the receiver
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

      // Send real-time notification to the receiver
      this.io?.to(`user_${toUserId}`).emit("new_notification", notification);

      console.log(`✅ Hop request sent from ${fromUserId} to ${toUserId}`);

      // Also notify the sender that their request was sent
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
    socket: import("socket.io").Socket,
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

      // Prevent users from waving to themselves
      if (fromUserId === toUserId) {
        const errorResponse: ErrorResponse = {
          message: "Cannot wave to yourself",
          code: "SELF_WAVE_ERROR",
        };
        socket.emit("error", errorResponse);
        return;
      }

      console.log(`👋 Sending wave from ${fromUserId} to ${toUserId}`);

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
      console.log(`✅ Wave sent from ${fromUserId} to ${toUserId}`);
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
    socket: import("socket.io").Socket,
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
        `🔄 Processing hop response: ${status} for hopInId: ${hopInId} by user: ${userId}`
      );

      // Update the hop request status
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

      console.log(`✅ Hop request updated to: ${status}`);

      // ONLY send notification for ACCEPTED requests (silent decline)
      if (status === "ACCEPTED") {
        const acceptanceNotification = await prisma.notification.create({
          data: {
            userId: hopIn.fromUserId, // Notify the person who sent the request
            fromUserId: userId, // The person who accepted
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

        // Send real-time notification to the original requester
        this.io
          ?.to(`user_${hopIn.fromUserId}`)
          .emit("new_notification", acceptanceNotification);
        console.log(
          `📨 Sent acceptance notification to user: ${hopIn.fromUserId}`
        );

        // Also notify the person who accepted that their action was successful
        const acceptedResponse: HopRequestAcceptedResponse = {
          hopInId: hopIn.id,
          fromUser: hopIn.fromUser,
          toUser: hopIn.toUser,
          bar: hopIn.bar || undefined,
        };
        socket.emit("hop_request_accepted", acceptedResponse);
      } else if (status === "DECLINED") {
        // For declines, just notify the person who declined (silent to the requester)
        const declinedResponse: HopRequestDeclinedResponse = {
          hopInId: hopIn.id,
          fromUser: hopIn.fromUser,
          toUser: hopIn.toUser,
        };
        socket.emit("hop_request_declined", declinedResponse);
        console.log(`🗑️ Hop request declined silently by user: ${userId}`);
      }

      console.log(`✅ Hop request ${status.toLowerCase()} by ${userId}`);
    } catch (error) {
      console.error("💥 Error responding to hop request:", error);
      const errorResponse: ErrorResponse = {
        message: "Failed to respond to hop request",
        code: "HOP_RESPONSE_ERROR",
      };
      socket.emit("error", errorResponse);
    }
  }

  // Handle crawl join requests (for private crawls)
  private async handleCrawlJoinRequest(
    socket: import("socket.io").Socket,
    data: CrawlJoinRequestData
  ): Promise<void> {
    try {
      const { crawlId, userId, message } = data;

      // Get crawl details with creator
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

      // Check if user is already a participant
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

      // Check if user already has a pending request
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

      // Check if crawl is full
      if (crawl._count.participants >= crawl.maxParticipants) {
        socket.emit("error", {
          message: "This crawl is full",
          code: "CRAWL_FULL",
        });
        return;
      }

      // Get user info for the notification
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

      // Create join request
      const joinRequest = await prisma.crawlJoinRequest.create({
        data: {
          crawlId,
          userId,
          message,
          status: "PENDING",
        },
      });

      // Create notification for crawl creator
      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId, // Notify the crawl creator
          fromUserId: userId, // The person requesting to join
          type: "CRAWL_JOIN_REQUEST",
          message: `${
            requestingUser.name || "Someone"
          } wants to join your crawl "${crawl.name}"!`,
          crawlId: crawlId,
          hopInId: null,
          meetupId: null,
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

      // Send real-time notification to crawl creator
      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      // Confirm to requester
      const sentResponse: CrawlJoinRequestSentResponse = {
        requestId: joinRequest.id,
        crawlName: crawl.name,
        message: "Join request sent! Waiting for approval.",
      };
      socket.emit("crawl_join_request_sent", sentResponse);

      console.log(
        `📨 Crawl join request sent from ${userId} to crawl ${crawlId}`
      );
    } catch (error) {
      console.error("Error sending crawl join request:", error);
      socket.emit("error", {
        message: "Failed to send join request",
        code: "JOIN_REQUEST_ERROR",
      });
    }
  }

  // Handle crawl join request responses (approve/reject)
  private async handleCrawlJoinResponse(
    socket: import("socket.io").Socket,
    data: CrawlJoinResponseData
  ): Promise<void> {
    try {
      const { requestId, status, userId } = data;

      // Get the join request with crawl and user details
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

      // Verify the user responding is the crawl creator
      if (joinRequest.crawl.creatorId !== userId) {
        socket.emit("error", {
          message: "Only crawl creator can respond to join requests",
          code: "UNAUTHORIZED",
        });
        return;
      }

      // Check if crawl is now full
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

      // Update the join request status
      const updatedRequest = await prisma.crawlJoinRequest.update({
        where: { id: requestId },
        data: {
          status,
          respondedAt: new Date(),
        },
      });

      if (status === "APPROVED") {
        // Add user to crawl participants
        await prisma.crawlParticipant.create({
          data: {
            crawlId: joinRequest.crawlId,
            userId: joinRequest.userId,
          },
        });

        // Create approval notification for the requester
        const approvalNotification = await prisma.notification.create({
          data: {
            userId: joinRequest.userId, // Notify the person who requested
            fromUserId: userId, // The crawl creator
            type: "CRAWL_JOIN_APPROVED",
            message: `Your request to join "${joinRequest.crawl.name}" was approved! 🎉`,
            crawlId: joinRequest.crawlId,
            hopInId: null,
            meetupId: null,
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

        // Send notification to requester
        this.io
          ?.to(`user_${joinRequest.userId}`)
          .emit("new_notification", approvalNotification);
      } else {
        // Create rejection notification for the requester
        const rejectionNotification = await prisma.notification.create({
          data: {
            userId: joinRequest.userId, // Notify the person who requested
            fromUserId: userId, // The crawl creator
            type: "CRAWL_JOIN_REJECTED",
            message: `Your request to join "${joinRequest.crawl.name}" was not approved.`,
            crawlId: joinRequest.crawlId,
            hopInId: null,
            meetupId: null,
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

        // Send notification to requester
        this.io
          ?.to(`user_${joinRequest.userId}`)
          .emit("new_notification", rejectionNotification);
      }

      // Notify the creator that their action was successful
      const respondedResponse: CrawlJoinRequestRespondedResponse = {
        requestId,
        status,
        userName: joinRequest.user.name || "User",
      };
      socket.emit("crawl_join_request_responded", respondedResponse);

      console.log(
        `✅ Crawl join request ${status.toLowerCase()} for request ${requestId}`
      );
    } catch (error) {
      console.error("Error responding to crawl join request:", error);
      socket.emit("error", {
        message: "Failed to respond to join request",
        code: "JOIN_RESPONSE_ERROR",
      });
    }
  }

  // Handle direct crawl joins (for public crawls)
  private async handleUserJoinedCrawl(
    socket: import("socket.io").Socket,
    data: UserJoinedCrawlData
  ): Promise<void> {
    try {
      const { crawlId, userId } = data;

      console.log(`🎯 [DEBUG] Handling user joined crawl:`, {
        crawlId,
        userId,
      });

      // Get crawl details with creator
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
        console.error("❌ [DEBUG] Crawl not found for ID:", crawlId);
        socket.emit("error", {
          message: "Crawl not found",
          code: "CRAWL_NOT_FOUND",
        });
        return;
      }

      // Get user who joined
      const joiningUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!joiningUser) {
        console.error("❌ [DEBUG] Joining user not found for ID:", userId);
        socket.emit("error", {
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      console.log(
        `🎯 [DEBUG] Creating join notification for crawl creator: ${crawl.creator.id}`
      );

      // Create notification for crawl creator
      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId, // Notify the crawl creator
          fromUserId: userId, // The person who joined
          type: "SYSTEM",
          message: `${joiningUser.name || "Someone"} joined your crawl "${
            crawl.name
          }"!`,
          crawlId: crawlId,
          hopInId: null,
          meetupId: null,
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

      console.log(`✅ [DEBUG] Join notification created:`, notification.id);

      // Send real-time notification to crawl creator
      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      console.log(
        `🎉 [DEBUG] Join notification sent to creator: ${crawl.creator.id}`
      );
    } catch (error) {
      console.error("💥 [DEBUG] Error handling user joined crawl:", error);
      socket.emit("error", {
        message: "Failed to send join notification",
        code: "JOIN_NOTIFICATION_ERROR",
      });
    }
  }

  // 🆕 ADD THIS METHOD: Handle user leaving crawl
  private async handleUserLeftCrawl(
    socket: import("socket.io").Socket,
    data: UserJoinedCrawlData
  ): Promise<void> {
    try {
      const { crawlId, userId } = data;

      console.log(`💨 [DEBUG] Handling user left crawl:`, { crawlId, userId });

      // Get crawl details with creator
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
        console.error("❌ [DEBUG] Crawl not found for ID:", crawlId);
        socket.emit("error", {
          message: "Crawl not found",
          code: "CRAWL_NOT_FOUND",
        });
        return;
      }

      // Get user who left
      const leavingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!leavingUser) {
        console.error("❌ [DEBUG] Leaving user not found for ID:", userId);
        socket.emit("error", {
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
        return;
      }

      console.log(
        `🎯 [DEBUG] Creating leave notification for crawl creator: ${crawl.creator.id}`
      );

      // Create notification for crawl creator
      const notification = await prisma.notification.create({
        data: {
          userId: crawl.creatorId, // Notify the crawl creator
          fromUserId: userId, // The person who left
          type: "SYSTEM",
          message: `${leavingUser.name || "Someone"} left your crawl "${
            crawl.name
          }"`,
          crawlId: crawlId,
          hopInId: null,
          meetupId: null,
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

      console.log(`✅ [DEBUG] Leave notification created:`, notification.id);

      // Send real-time notification to crawl creator
      this.io
        ?.to(`user_${crawl.creatorId}`)
        .emit("new_notification", notification);

      console.log(
        `💨 [DEBUG] Leave notification sent to creator: ${crawl.creator.id}`
      );
    } catch (error) {
      console.error("💥 [DEBUG] Error handling user left crawl:", error);
      socket.emit("error", {
        message: "Failed to send leave notification",
        code: "LEAVE_NOTIFICATION_ERROR",
      });
    }
  }

  // Helper method to send system notifications
  public async sendSystemNotification(
    userId: string,
    message: string,
    data?: SystemNotificationData
  ): Promise<void> {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          fromUserId: userId, // System notifications from the user themselves
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
      console.log(`📢 System notification sent to user: ${userId}`);
    } catch (error) {
      console.error("Error sending system notification:", error);
    }
  }

  // Helper method to get user's active connections
  public getUserConnections(userId: string): string[] {
    if (!this.io) return [];

    const userRoom = `user_${userId}`;
    const room = this.io.sockets.adapter.rooms.get(userRoom);
    return room ? Array.from(room) : [];
  }

  // Check if user is currently connected
  public isUserConnected(userId: string): boolean {
    return this.getUserConnections(userId).length > 0;
  }

  // Get all connected user IDs
  public getConnectedUserIds(): string[] {
    if (!this.io) return [];

    const connectedUsers: string[] = [];
    const rooms = this.io.sockets.adapter.rooms;

    for (const [roomName, sockets] of rooms.entries()) {
      if (roomName.startsWith("user_")) {
        const userId = roomName.replace("user_", "");
        connectedUsers.push(userId);
      }
    }

    return connectedUsers;
  }

  // Send message to specific user
  public sendToUser<T>(userId: string, event: string, data: T): void {
    this.io?.to(`user_${userId}`).emit(event, data);
  }

  // Broadcast to all connected users
  public broadcast<T>(event: string, data: T): void {
    this.io?.emit(event, data);
  }
}

export const socketService = SocketService.getInstance();
