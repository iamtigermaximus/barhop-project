// // app/api/crawls/[id]/leave/route.ts
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

//     const { id: crawlId } = await params;

//     // Check if crawl exists
//     const crawl = await prisma.crawl.findUnique({
//       where: { id: crawlId },
//     });

//     if (!crawl) {
//       return NextResponse.json({ message: "Crawl not found" }, { status: 404 });
//     }

//     // Check if user is a participant
//     const existingParticipant = await prisma.crawlParticipant.findUnique({
//       where: {
//         crawlId_userId: {
//           crawlId,
//           userId: session.user.id,
//         },
//       },
//     });

//     if (!existingParticipant) {
//       return NextResponse.json(
//         { message: "You are not participating in this crawl" },
//         { status: 400 }
//       );
//     }

//     // Prevent creator from leaving their own crawl
//     if (crawl.creatorId === session.user.id) {
//       return NextResponse.json(
//         { message: "Creator cannot leave their own crawl" },
//         { status: 400 }
//       );
//     }

//     // Remove user as participant
//     await prisma.crawlParticipant.delete({
//       where: {
//         crawlId_userId: {
//           crawlId,
//           userId: session.user.id,
//         },
//       },
//     });

//     return NextResponse.json(
//       { message: "Successfully left crawl" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error leaving crawl:", error);
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

    // 🆕 MAKE HTTP CALL TO SOCKET SERVER INSTEAD OF DIRECT SOCKET USAGE
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || "http://localhost:3001";
    const response = await fetch(
      `${socketServerUrl}/api/crawls/${crawlId}/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🆕 USE BEARER TOKEN
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
        { message: errorData.error || "Failed to leave crawl" },
        { status: response.status }
      );
    }

    // ✅ KEEP DATABASE OPERATIONS IN NEXT.JS (participant removal)
    // Check if user is a participant
    const existingParticipant = await prisma.crawlParticipant.findUnique({
      where: {
        crawlId_userId: {
          crawlId,
          userId: session.user.id,
        },
      },
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { message: "You are not in this crawl" },
        { status: 400 }
      );
    }

    // Remove user as participant
    await prisma.crawlParticipant.delete({
      where: {
        crawlId_userId: {
          crawlId,
          userId: session.user.id,
        },
      },
    });

    // ❌ REMOVED: Direct notification creation and socket emission
    // This is now handled by the socket server via the HTTP call above

    return NextResponse.json(
      { message: "Successfully left crawl" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving crawl:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
