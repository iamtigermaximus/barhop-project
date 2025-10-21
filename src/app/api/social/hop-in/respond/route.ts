import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { socketService } from "@/lib/socket";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hopInId, status } = body;

    if (!hopInId || !status) {
      return NextResponse.json(
        { error: "HopIn ID and status required" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be ACCEPTED or DECLINED" },
        { status: 400 }
      );
    }

    // Update hop-in status
    const hopIn = await prisma.hopIn.update({
      where: {
        id: hopInId,
        toUserId: session.user.id, // Ensure user is the recipient
      },
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
        bar: true,
      },
    });

    // Notify original sender if accepted
    if (status === "ACCEPTED" && socketService.io) {
      const notification = await prisma.notification.create({
        data: {
          userId: hopIn.fromUserId,
          fromUserId: session.user.id,
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

      socketService.io
        .to(`user_${hopIn.fromUserId}`)
        .emit("new_notification", notification);
    }

    return NextResponse.json({
      success: true,
      hopIn,
    });
  } catch (error) {
    console.error("Error responding to hop request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
