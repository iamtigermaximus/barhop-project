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
//     const { hopInId, status } = body;

//     if (!hopInId || !status) {
//       return NextResponse.json(
//         { error: "HopIn ID and status required" },
//         { status: 400 }
//       );
//     }

//     if (!["ACCEPTED", "DECLINED"].includes(status)) {
//       return NextResponse.json(
//         { error: "Status must be ACCEPTED or DECLINED" },
//         { status: 400 }
//       );
//     }

//     // Update hop-in status
//     const hopIn = await prisma.hopIn.update({
//       where: {
//         id: hopInId,
//         toUserId: session.user.id, // Ensure user is the recipient
//       },
//       data: { status },
//       include: {
//         fromUser: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//         toUser: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//         bar: true,
//       },
//     });

//     // Notify original sender if accepted
//     if (status === "ACCEPTED" && socketService.io) {
//       const notification = await prisma.notification.create({
//         data: {
//           userId: hopIn.fromUserId,
//           fromUserId: session.user.id,
//           type: "HOP_REQUEST",
//           message: `${hopIn.toUser.name} accepted your hop in request! 🎉`,
//           barId: hopIn.barId || undefined,
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

//       socketService.io
//         .to(`user_${hopIn.fromUserId}`)
//         .emit("new_notification", notification);
//     }

//     return NextResponse.json({
//       success: true,
//       hopIn,
//     });
//   } catch (error) {
//     console.error("Error responding to hop request:", error);
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

    // 🆕 MAKE HTTP CALL TO SOCKET SERVER FOR HOP RESPONSE PROCESSING
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || "http://localhost:3001";
    const response = await fetch(
      `${socketServerUrl}/api/social/hop-in/respond`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hopInId,
          status,
          userId: session.user.id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to respond to hop request" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // ✅ KEEP DATABASE OPERATIONS IN NEXT.JS (status update)
    // Update hop-in status in local database
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

    // ❌ REMOVED: Direct notification creation and socket emission
    // This is now handled by the socket server via the HTTP call above

    return NextResponse.json({
      success: true,
      hopIn: result.hopIn || hopIn, // 🆕 Use result from socket server if available
      message: `Hop request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error responding to hop request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
