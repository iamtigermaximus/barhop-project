import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CrawlStatus } from "@prisma/client";

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

// GET /api/crawls/[id] - Get a specific crawl by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const crawl = await prisma.crawl.findUnique({
      where: { id: id },
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

    if (!crawl) {
      return NextResponse.json({ error: "Crawl not found" }, { status: 404 });
    }

    // Check if crawl is public or user has access
    const session = await getServerSession(authOptions);
    const hasAccess =
      crawl.isPublic ||
      session?.user?.id === crawl.creatorId ||
      crawl.participants.some((p) => p.userId === session?.user?.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have access to this crawl" },
        { status: 403 }
      );
    }

    return NextResponse.json(crawl, { status: 200 });
  } catch (error) {
    console.error("Error fetching crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/crawls/[id] - Update a specific crawl
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      cityId,
      date,
      startTime,
      maxParticipants,
      isPublic,
      status,
    } = body;

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

// DELETE /api/crawls/[id] - Delete a specific crawl
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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

    // Use transaction to delete related records
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
