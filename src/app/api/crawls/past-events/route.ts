import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";

    let crawls;

    if (publicOnly) {
      // Get past public crawls
      crawls = await prisma.crawl.findMany({
        where: {
          isPublic: true,
          OR: [
            { date: { lt: new Date() } }, // Dates in the past
            { status: { in: ["COMPLETED", "CANCELLED"] } }, // Or completed/cancelled status
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
          date: "desc", // Show most recent first
        },
      });
    } else if (session) {
      // Get user's past crawls (both created and participated in)
      crawls = await prisma.crawl.findMany({
        where: {
          AND: [
            {
              OR: [
                { creatorId: session.user.id },
                { participants: { some: { userId: session.user.id } } },
              ],
            },
            {
              OR: [
                { date: { lt: new Date() } },
                { status: { in: ["COMPLETED", "CANCELLED"] } },
              ],
            },
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
          date: "desc",
        },
      });
    } else {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(crawls, { status: 200 });
  } catch (error) {
    console.error("Error fetching past crawls:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
