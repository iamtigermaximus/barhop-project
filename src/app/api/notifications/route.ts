// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";

// // GET /api/notifications - Get user's notifications
// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const limit = parseInt(searchParams.get("limit") || "50");
//     const skip = parseInt(searchParams.get("skip") || "0");

//     const notifications = await prisma.notification.findMany({
//       where: { userId: session.user.id },
//       include: {
//         fromUser: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//         hopIn: {
//           include: {
//             bar: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//       take: limit,
//       skip: skip,
//     });

//     const unreadCount = await prisma.notification.count({
//       where: {
//         userId: session.user.id,
//         read: false,
//       },
//     });

//     return NextResponse.json({
//       notifications,
//       unreadCount,
//       total: notifications.length,
//     });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // PUT /api/notifications - Mark notifications as read
// export async function PUT(req: NextRequest): Promise<NextResponse> {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { notificationId, read } = body;

//     if (!notificationId) {
//       return NextResponse.json(
//         { error: "Notification ID required" },
//         { status: 400 }
//       );
//     }

//     const notification = await prisma.notification.update({
//       where: {
//         id: notificationId,
//         userId: session.user.id, // Ensure user owns this notification
//       },
//       data: { read },
//     });

//     return NextResponse.json({ notification });
//   } catch (error) {
//     console.error("Error updating notification:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/notifications/route.ts - SIMPLIFIED VERSION
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SIMPLE QUERY - remove the problematic hopIn relation for now
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
