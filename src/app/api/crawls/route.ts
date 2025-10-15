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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";
    const session = await getServerSession(authOptions);

    let crawls;

    if (publicOnly) {
      // Get public crawls for discover page - ONLY upcoming/active
      crawls = await prisma.crawl.findMany({
        where: {
          isPublic: true,
          status: {
            in: ["PLANNING", "UPCOMING"],
          },
          date: {
            gte: new Date(), // Only show dates from today onwards
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
    } else if (session) {
      // Get user's crawls for authenticated users (all statuses)
      crawls = await prisma.crawl.findMany({
        where: {
          OR: [
            { creatorId: session.user.id },
            { participants: { some: { userId: session.user.id } } },
          ],
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
    } else {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(crawls, { status: 200 });
  } catch (error) {
    console.error("Error fetching crawls:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session email:", session.user.email);
    console.log("Session user ID:", session.user.id);

    // Get or create user - handle both JWT and database scenarios
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // If user doesn't exist, create one using session data
    if (!user) {
      console.log("User not found in database, creating new user...");

      try {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || session.user.email.split("@")[0],
            image: session.user.image || null,
            emailVerified: new Date(),
          },
        });
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Error creating user:", createError);
        // If creation fails (e.g., unique constraint), try to find again
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (!user) {
          return NextResponse.json(
            { error: "Unable to create or find user account" },
            { status: 400 }
          );
        }
      }
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

    // Create the crawl
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

// PUT /api/crawls - Update a crawl
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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
        creatorId: session.user.id, // Only creator can update
      },
    });

    if (!existingCrawl) {
      return NextResponse.json(
        { error: "Crawl not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    // Build update data with proper typing
    const updateData: CrawlUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (cityId !== undefined) updateData.cityId = cityId;
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (maxParticipants !== undefined)
      updateData.maxParticipants = maxParticipants;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (status !== undefined) updateData.status = status as CrawlStatus;

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

// DELETE /api/crawls - Delete a crawl
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
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
        creatorId: session.user.id, // Only creator can delete
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
      // Delete crawl bars
      prisma.crawlBar.deleteMany({
        where: { crawlId: id },
      }),
      // Delete participants (note: it's crawlParticipant, not participant)
      prisma.crawlParticipant.deleteMany({
        where: { crawlId: id },
      }),
      // Delete crawl chat messages
      prisma.crawlChatMessage.deleteMany({
        where: { crawlId: id },
      }),
      // Delete the crawl
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
