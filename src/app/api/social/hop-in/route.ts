import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetUserId, barId, message } = body;

    // Verify target user exists and is in social mode
    const targetUser = await prisma.userSocialProfile.findUnique({
      where: { userId: targetUserId },
      include: { user: { select: { name: true } } },
    });

    if (!targetUser || !targetUser.isSocialMode) {
      return NextResponse.json(
        { message: "User is not available for social connections" },
        { status: 400 }
      );
    }

    // Create social interaction
    const interaction = await prisma.socialInteraction.create({
      data: {
        initiatorId: session.user.id,
        targetUserId,
        interactionType: "HOP_IN",
        message: message || `Hey! I'd like to join you`,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      interaction,
      message: "Hop in request sent successfully",
    });
  } catch (error) {
    console.error("Error creating hop in request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
