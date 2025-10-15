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

    // Await the params Promise to get the actual values
    const { id: crawlId } = await params;

    // Check if crawl exists and has space
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
      include: {
        participants: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!crawl) {
      return NextResponse.json({ message: "Crawl not found" }, { status: 404 });
    }

    if (crawl._count.participants >= crawl.maxParticipants) {
      return NextResponse.json({ message: "Crawl is full" }, { status: 400 });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.crawlParticipant.findUnique({
      where: {
        crawlId_userId: {
          crawlId,
          userId: session.user.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { message: "Already joined this crawl" },
        { status: 400 }
      );
    }

    // Add user as participant
    await prisma.crawlParticipant.create({
      data: {
        crawlId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Successfully joined crawl" },
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
