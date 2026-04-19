// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";

// interface RouteContext {
//   params: Promise<{
//     chatroomId: string;
//   }>;
// }

// export async function GET(request: NextRequest, context: RouteContext) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { chatroomId } = await context.params;

//     console.log("🔍 Fetching chatroom info for:", chatroomId);

//     // Verify user is a participant in this chatroom
//     const participant = await prisma.chatroomParticipant.findFirst({
//       where: {
//         chatroomId,
//         userId: session.user.id,
//       },
//     });

//     if (!participant) {
//       return NextResponse.json(
//         { error: "Not a participant in this chatroom" },
//         { status: 403 }
//       );
//     }

//     // Get chatroom info with participants
//     const chatroom = await prisma.chatroom.findUnique({
//       where: { id: chatroomId },
//       include: {
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         _count: {
//           select: {
//             participants: true,
//             messages: true,
//           },
//         },
//       },
//     });

//     if (!chatroom) {
//       return NextResponse.json(
//         { error: "Chatroom not found" },
//         { status: 404 }
//       );
//     }

//     console.log("✅ Found chatroom:", chatroom.name);

//     return NextResponse.json(chatroom);
//   } catch (error) {
//     console.error("❌ Error fetching chatroom info:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

//src/app/api/chat/[chatroomId]/info/routes.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    console.log("🔍 Fetching chatroom info for:", chatroomId);

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
        { status: 403 },
      );
    }

    // Get chatroom info with participants
    const chatroom = await prisma.chatroom.findUnique({
      where: { id: chatroomId },
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
          orderBy: {
            joinedAt: "asc",
          },
        },
        _count: {
          select: {
            participants: true,
            messages: true,
          },
        },
      },
    });

    if (!chatroom) {
      return NextResponse.json(
        { error: "Chatroom not found" },
        { status: 404 },
      );
    }

    console.log(
      "✅ Found chatroom:",
      chatroom.name,
      "with",
      chatroom.participants.length,
      "participants",
    );

    return NextResponse.json(chatroom);
  } catch (error) {
    console.error("❌ Error fetching chatroom info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
