// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     // Await the params Promise to get the actual values
//     const { id: crawlId } = await params;

//     // Check if crawl exists and has space
//     const crawl = await prisma.crawl.findUnique({
//       where: { id: crawlId },
//       include: {
//         participants: true,
//         _count: {
//           select: {
//             participants: true,
//           },
//         },
//       },
//     });

//     if (!crawl) {
//       return NextResponse.json({ message: "Crawl not found" }, { status: 404 });
//     }

//     if (crawl._count.participants >= crawl.maxParticipants) {
//       return NextResponse.json({ message: "Crawl is full" }, { status: 400 });
//     }

//     // Check if user is already a participant
//     const existingParticipant = await prisma.crawlParticipant.findUnique({
//       where: {
//         crawlId_userId: {
//           crawlId,
//           userId: session.user.id,
//         },
//       },
//     });

//     if (existingParticipant) {
//       return NextResponse.json(
//         { message: "Already joined this crawl" },
//         { status: 400 }
//       );
//     }

//     // Add user as participant
//     await prisma.crawlParticipant.create({
//       data: {
//         crawlId,
//         userId: session.user.id,
//       },
//     });

//     return NextResponse.json(
//       { message: "Successfully joined crawl" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error joining crawl:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { socketService } from "@/lib/socket";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const { id: crawlId } = await params;

//     // Include creator info for notifications
//     const crawl = await prisma.crawl.findUnique({
//       where: { id: crawlId },
//       include: {
//         participants: true,
//         creator: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         _count: {
//           select: {
//             participants: true,
//           },
//         },
//       },
//     });

//     if (!crawl) {
//       return NextResponse.json({ message: "Crawl not found" }, { status: 404 });
//     }

//     if (crawl._count.participants >= crawl.maxParticipants) {
//       return NextResponse.json({ message: "Crawl is full" }, { status: 400 });
//     }

//     const existingParticipant = await prisma.crawlParticipant.findUnique({
//       where: {
//         crawlId_userId: {
//           crawlId,
//           userId: session.user.id,
//         },
//       },
//     });

//     if (existingParticipant) {
//       return NextResponse.json(
//         { message: "Already joined this crawl" },
//         { status: 400 }
//       );
//     }

//     // Add user as participant
//     await prisma.crawlParticipant.create({
//       data: {
//         crawlId,
//         userId: session.user.id,
//       },
//     });

//     // 🚨 EXACT SAME PATTERN AS HOP REQUEST - CREATE NOTIFICATION + SEND VIA SOCKET
//     if (crawl.creator.id !== session.user.id) {
//       // Get joining user info
//       const joiningUser = await prisma.user.findUnique({
//         where: { id: session.user.id },
//         select: { name: true, image: true },
//       });

//       // Create notification - EXACT SAME PATTERN
//       const notification = await prisma.notification.create({
//         data: {
//           userId: crawl.creator.id, // Notify crawl creator
//           fromUserId: session.user.id, // User who joined
//           type: "SYSTEM",
//           message: `${joiningUser?.name || "Someone"} joined your crawl "${
//             crawl.name
//           }"!`,
//           crawlId: crawlId,
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

//       // Send real-time notification via Socket.io - EXACT SAME PATTERN
//       if (socketService.io) {
//         socketService.io
//           .to(`user_${crawl.creator.id}`)
//           .emit("new_notification", notification);
//       }

//       console.log("✅ Join notification created and sent:", notification.id);
//     }

//     return NextResponse.json(
//       { message: "Successfully joined crawl" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error joining crawl:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"; // 🆕 ADD JWT IMPORT

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      // 🆕 ADD USER VALIDATION
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: crawlId } = await params;

    // 🆕 GENERATE JWT TOKEN INSTEAD OF USING NON-EXISTENT accessToken
    const token = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Make HTTP call to your socket server instead of using socketService directly
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || "http://localhost:3001";
    const response = await fetch(
      `${socketServerUrl}/api/crawls/${crawlId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🆕 USE BEARER TOKEN FORMAT
        },
        body: JSON.stringify({
          userId: session.user.id,
          crawlId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.error || "Failed to join crawl" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // 🆕 AUTO-JOIN USER TO CRAWL'S CHATROOM (keep this part since it's database logic)
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
      include: {
        chatroom: {
          select: { id: true },
        },
      },
    });

    if (crawl?.chatroom) {
      await prisma.chatroomParticipant.upsert({
        where: {
          userId_chatroomId: {
            userId: session.user.id,
            chatroomId: crawl.chatroom.id,
          },
        },
        update: {}, // If already exists, do nothing
        create: {
          userId: session.user.id,
          chatroomId: crawl.chatroom.id,
          role: "MEMBER",
        },
      });

      console.log(
        `✅ User ${session.user.id} auto-joined chatroom for crawl ${crawlId}`
      );
    }

    return NextResponse.json(
      {
        message: "Successfully joined crawl",
        notification: result.notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining crawl:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
