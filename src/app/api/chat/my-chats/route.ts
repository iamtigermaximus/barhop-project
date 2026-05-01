// //src/app/api/chat/my-chats/routes.ts

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const chatrooms = await prisma.chatroom.findMany({
//       where: {
//         participants: {
//           some: {
//             userId: session.user.id,
//           },
//         },
//         // Optional: only show private chats, or include group chats too
//         // isGroupChat: false,
//       },
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
//             messages: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc", // Show most recently active chats first
//       },
//     });

//     return NextResponse.json({ chatrooms });
//   } catch (error) {
//     console.error("Error fetching user chats:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }
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

    // ✅ Only get chatrooms where user is STILL a participant
    const chatrooms = await prisma.chatroom.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
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
        messages: {
          take: 1, // Get only the most recent message
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
            participants: true,
          },
        },
      },
      // ✅ Order by most recent message (updatedAt)
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format the response with last message preview
    const formattedChats = chatrooms.map((chatroom) => ({
      id: chatroom.id,
      name: chatroom.name,
      isGroupChat: chatroom.isGroupChat,
      updatedAt: chatroom.updatedAt,
      participants: chatroom.participants,
      lastMessage: chatroom.messages[0] || null,
      messageCount: chatroom._count.messages,
      participantCount: chatroom._count.participants,
    }));

    return NextResponse.json({ chatrooms: formattedChats });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
