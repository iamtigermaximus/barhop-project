import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, CrawlStatus } from "@prisma/client";

// Proper type for update data
interface CrawlUpdateData {
  name?: string;
  description?: string;
  cityId?: string;
  date?: Date;
  startTime?: Date;
  maxParticipants?: number;
  isPublic?: boolean;
  status?: CrawlStatus;
}

// GET /api/crawls/my-crawls - Get user's crawls with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // 'upcoming', 'past', 'created', 'participating'

    const now = new Date();

    // Base where condition for user's crawls
    let whereCondition: Prisma.CrawlWhereInput = {
      OR: [
        { creatorId: session.user.id },
        { participants: { some: { userId: session.user.id } } },
      ],
    };

    // Apply filters
    if (filter === "created") {
      whereCondition = { creatorId: session.user.id };
    } else if (filter === "upcoming") {
      whereCondition = {
        ...whereCondition,
        AND: [
          { date: { gte: now } },
          { status: { notIn: ["COMPLETED", "CANCELLED"] } },
        ],
      };
    } else if (filter === "past") {
      whereCondition = {
        ...whereCondition,
        OR: [
          { date: { lt: now } },
          { status: { in: ["COMPLETED", "CANCELLED"] } },
        ],
      };
    }
    // 'participating' uses the base condition (all crawls user is part of)

    const crawls = await prisma.crawl.findMany({
      where: whereCondition,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
        participants: {
          select: {
            userId: true,
          },
        },
        crawlBars: {
          include: {
            bar: true,
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

    return NextResponse.json(crawls, { status: 200 });
  } catch (error) {
    console.error("Error fetching user crawls:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/crawls/my-crawls - Create a new crawl for the current user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split("@")[0],
          image: session.user.image || null,
          emailVerified: new Date(),
        },
      });
    }

    const body = await request.json();
    const {
      name,
      description,
      cityId,
      date,
      startTime,
      maxParticipants,
      barTypes,
    } = body;

    // Validate required fields
    if (!name || !cityId || !date || !startTime) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, city, date, and time are required",
        },
        { status: 400 }
      );
    }

    // Validate city exists
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      return NextResponse.json(
        { error: "Selected city not found" },
        { status: 400 }
      );
    }

    // Find bars in the selected city
    const whereCondition: Prisma.BarWhereInput = {
      cityId: cityId,
      isActive: true,
    };

    if (barTypes && barTypes.length > 0) {
      whereCondition.type = {
        in: barTypes,
      };
    }

    const availableBars = await prisma.bar.findMany({
      where: whereCondition,
      take: 4,
      orderBy: {
        vipEnabled: "desc",
      },
    });

    if (availableBars.length === 0) {
      return NextResponse.json(
        {
          error: `No bars found in ${city.name} matching your criteria. Try selecting different bar types.`,
        },
        { status: 400 }
      );
    }

    // Calculate start times for each bar
    const startTimeDate = new Date(startTime);
    const crawlBarsData = availableBars.map((bar, index) => ({
      barId: bar.id,
      orderIndex: index + 1,
      duration: 60,
      startTime: new Date(startTimeDate.getTime() + index * 60 * 60 * 1000),
    }));

    // Create the crawl with user as creator and participant
    const crawl = await prisma.crawl.create({
      data: {
        name,
        description,
        creatorId: user.id,
        cityId,
        date: new Date(date),
        startTime: startTimeDate,
        maxParticipants: maxParticipants || 10,
        isPublic: true,
        status: "PLANNING",
        crawlBars: {
          create: crawlBarsData,
        },
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        crawlBars: {
          include: {
            bar: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    const responseData = {
      success: true,
      crawl: crawl,
      redirectTo: `/crawls/${crawl.id}`,
      message: "Crawl created successfully!",
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error creating crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/crawls/my-crawls - Update a user's crawl
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      description,
      cityId,
      date,
      startTime,
      maxParticipants,
      isPublic,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Crawl ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this crawl
    const existingCrawl = await prisma.crawl.findFirst({
      where: {
        id: id,
        creatorId: session.user.id,
      },
    });

    if (!existingCrawl) {
      return NextResponse.json(
        { error: "Crawl not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: CrawlUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (cityId !== undefined) updateData.cityId = cityId;
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (maxParticipants !== undefined)
      updateData.maxParticipants = maxParticipants;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (status !== undefined) updateData.status = status;

    const updatedCrawl = await prisma.crawl.update({
      where: { id: id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        crawlBars: {
          include: {
            bar: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        crawl: updatedCrawl,
        message: "Crawl updated successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/crawls/my-crawls - Delete a user's crawl
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Crawl ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this crawl
    const existingCrawl = await prisma.crawl.findFirst({
      where: {
        id: id,
        creatorId: session.user.id,
      },
    });

    if (!existingCrawl) {
      return NextResponse.json(
        { error: "Crawl not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Use transaction to delete related records first
    await prisma.$transaction([
      prisma.crawlBar.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawlParticipant.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawlChatMessage.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawl.delete({
        where: { id: id },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Crawl deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
