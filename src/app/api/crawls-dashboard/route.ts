import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function getUserIdFromToken(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      description,
      cityId,
      date,
      startTime,
      maxParticipants,
      barTypes,
      isPublic,
    } = await request.json();

    // Create the crawl
    const crawl = await prisma.crawl.create({
      data: {
        name,
        description,
        creatorId: userId,
        cityId,
        date: new Date(date),
        startTime: new Date(startTime),
        maxParticipants,
        isPublic: isPublic ?? true,
        status: "PLANNING",
      },
      include: {
        city: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add creator as first participant
    await prisma.crawlParticipant.create({
      data: {
        crawlId: crawl.id,
        userId: userId,
      },
    });

    return NextResponse.json(crawl);
  } catch (error) {
    console.error("Error creating crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const isPublic = searchParams.get("public") !== "false";

    const crawls = await prisma.crawl.findMany({
      where: {
        ...(cityId && { cityId }),
        ...(isPublic && { isPublic: true }),
        status: { in: ["PLANNING", "UPCOMING"] },
      },
      include: {
        city: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(crawls);
  } catch (error) {
    console.error("Error fetching crawls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
