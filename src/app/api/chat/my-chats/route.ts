import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatrooms = await prisma.chatroom.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
        // Optional: only show private chats, or include group chats too
        // isGroupChat: false,
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
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Show most recently active chats first
      },
    });

    return NextResponse.json({ chatrooms });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
