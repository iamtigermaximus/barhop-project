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

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
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

  private async handleHopRequest(
    socket: import("socket.io").Socket,
    data: HopInRequestData
  ): Promise<void> {
    try {
      const { fromUserId, toUserId, barId, message } = data;

      if (!fromUserId || !toUserId) {
        socket.emit("error", "Missing user IDs");
        return;
      }

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
    } catch (error) {
      console.error("Error sending hop request:", error);
      socket.emit("error", "Failed to send hop request");
    }
  }

  private async handleWave(
    socket: import("socket.io").Socket,
    data: WaveRequestData
  ): Promise<void> {
    try {
      const { fromUserId, toUserId } = data;

      if (!fromUserId || !toUserId) {
        socket.emit("error", "Missing user IDs");
        return;
      }

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
      socket.emit("error", "Failed to send wave");
    }
  }

  private async handleHopResponse(
    socket: import("socket.io").Socket,
    data: HopInResponseData
  ): Promise<void> {
    try {
      const { hopInId, status, userId } = data;

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
        },
      });

      if (status === "ACCEPTED") {
        const notification = await prisma.notification.create({
          data: {
            userId: hopIn.fromUserId,
            fromUserId: userId,
            type: "HOP_REQUEST",
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

        this.io
          ?.to(`user_${hopIn.fromUserId}`)
          .emit("new_notification", notification);
      }

      console.log(`Hop request ${status.toLowerCase()} by ${userId}`);
    } catch (error) {
      console.error("Error responding to hop request:", error);
      socket.emit("error", "Failed to respond to hop request");
    }
  }
}

export const socketService = SocketService.getInstance();
