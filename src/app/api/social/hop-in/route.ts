// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { targetUserId, barId, message } = body;

//     // Verify target user exists and is in social mode
//     const targetUser = await prisma.userSocialProfile.findUnique({
//       where: { userId: targetUserId },
//       include: { user: { select: { name: true } } },
//     });

//     if (!targetUser || !targetUser.isSocialMode) {
//       return NextResponse.json(
//         { message: "User is not available for social connections" },
//         { status: 400 }
//       );
//     }

//     // Create social interaction
//     const interaction = await prisma.socialInteraction.create({
//       data: {
//         initiatorId: session.user.id,
//         targetUserId,
//         interactionType: "HOP_IN",
//         message: message || `Hey! I'd like to join you`,
//         status: "PENDING",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       interaction,
//       message: "Hop in request sent successfully",
//     });
//   } catch (error) {
//     console.error("Error creating hop in request:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { socketService } from "@/lib/socket";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { targetUserId, barId, message } = body;

//     if (!targetUserId) {
//       return NextResponse.json(
//         { error: "Target user ID required" },
//         { status: 400 }
//       );
//     }

//     // Create hop in request in database
//     const hopIn = await prisma.hopIn.create({
//       data: {
//         fromUserId: session.user.id,
//         toUserId: targetUserId,
//         barId,
//         message,
//         status: "PENDING",
//         expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
//       },
//     });

//     // Get sender info for notification
//     const fromUser = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: { name: true, image: true },
//     });

//     // Create notification
//     const notification = await prisma.notification.create({
//       data: {
//         userId: targetUserId,
//         fromUserId: session.user.id,
//         type: "HOP_REQUEST",
//         message: message || `${fromUser?.name || "Someone"} wants to join you!`,
//         barId,
//         hopInId: hopIn.id,
//       },
//       include: {
//         fromUser: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//       },
//     });

//     // Send real-time notification via Socket.io
//     if (socketService.io) {
//       socketService.io
//         .to(`user_${targetUserId}`)
//         .emit("new_notification", notification);
//     }

//     return NextResponse.json({
//       success: true,
//       hopIn,
//       notification,
//     });
//   } catch (error) {
//     console.error("Error creating hop in request:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken"; // 🆕 ADD JWT IMPORT

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId, barId, message } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID required" },
        { status: 400 }
      );
    }

    // 🆕 GENERATE JWT TOKEN FOR SOCKET SERVER AUTH
    const token = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // 🆕 MAKE HTTP CALL TO SOCKET SERVER FOR HOP REQUEST PROCESSING
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || "http://localhost:3001";
    const response = await fetch(`${socketServerUrl}/api/social/hop-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fromUserId: session.user.id,
        toUserId: targetUserId,
        barId,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to send hop request" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // ✅ KEEP DATABASE OPERATIONS IN NEXT.JS (create hop-in record)
    // Create hop in request in local database
    const hopIn = await prisma.hopIn.create({
      data: {
        fromUserId: session.user.id,
        toUserId: targetUserId,
        barId,
        message,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      },
    });

    // ❌ REMOVED: Direct notification creation and socket emission
    // This is now handled by the socket server via the HTTP call above

    return NextResponse.json({
      success: true,
      hopIn: result.hopIn || hopIn, // 🆕 Use result from socket server if available
      hopInId: result.hopInId || hopIn.id,
      message: "Hop request sent successfully",
    });
  } catch (error) {
    console.error("Error creating hop in request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
