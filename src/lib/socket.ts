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
            message: `${hopIn.toUser.name} accepted your hop in request! 🎉`,
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
