// app/api/crawls/[id]/leave/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: crawlId } = await params;

    // Check if crawl exists
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
    });

    if (!crawl) {
      return NextResponse.json({ message: "Crawl not found" }, { status: 404 });
    }

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
        { message: "You are not participating in this crawl" },
        { status: 400 }
      );
    }

    // Prevent creator from leaving their own crawl
    if (crawl.creatorId === session.user.id) {
      return NextResponse.json(
        { message: "Creator cannot leave their own crawl" },
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
