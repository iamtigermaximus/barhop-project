import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{
    chatroomId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatroomId } = await context.params;

    console.log("🔍 Fetching messages for chatroom:", chatroomId);

    // Verify user is a participant in this chatroom
    const participant = await prisma.chatroomParticipant.findFirst({
      where: {
        chatroomId,
        userId: session.user.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not a participant in this chatroom" },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await prisma.chatroomMessage.findMany({
      where: {
        chatroomId,
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
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log("✅ Found messages:", messages.length);

    // 🆕 FIX: Return the exact format frontend expects
    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        userId: m.userId,
        chatroomId: m.chatroomId,
        messageType: m.messageType,
        createdAt: m.createdAt,
        user: m.user,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
