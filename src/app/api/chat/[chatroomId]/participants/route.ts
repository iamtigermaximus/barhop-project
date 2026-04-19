//src/app/api/chat/[chatroomId]/participants/routes.ts

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

    console.log("🔍 Fetching participants for chatroom:", chatroomId);

    // Verify user is a participant in this chatroom
    const userParticipant = await prisma.chatroomParticipant.findFirst({
      where: {
        chatroomId,
        userId: session.user.id,
      },
    });

    if (!userParticipant) {
      return NextResponse.json(
        { error: "Not a participant in this chatroom" },
        { status: 403 },
      );
    }

    // Get all participants
    const participants = await prisma.chatroomParticipant.findMany({
      where: {
        chatroomId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    console.log("✅ Found participants:", participants.length);

    // 🆕 FIX: Return the exact format frontend expects
    return NextResponse.json({
      participants: participants.map((p) => ({
        id: p.id,
        userId: p.userId, // 🆕 Make sure this is included
        chatroomId: p.chatroomId, // 🆕 Make sure this is included
        role: p.role, // 🆕 Make sure this is included
        joinedAt: p.joinedAt,
        user: p.user,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
