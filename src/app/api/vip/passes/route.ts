import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "helsinki";

    // Get VIP passes with bar information
    const vipPasses = await prisma.vIPPassEnhanced.findMany({
      where: {
        isActive: true,
        validityStart: { lte: new Date() },
        validityEnd: { gte: new Date() },
        bar: {
          city: {
            name: {
              equals: city,
              mode: "insensitive",
            },
          },
          isActive: true,
          vipEnabled: true,
        },
      },
      include: {
        bar: {
          include: {
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match frontend interface
    const transformedPasses = vipPasses.map((pass) => ({
      id: pass.id,
      barId: pass.barId,
      bar: {
        id: pass.bar.id,
        name: pass.bar.name,
        image: pass.bar.imageUrl,
        type: pass.bar.type,
        district: pass.bar.district,
        latitude: pass.bar.latitude,
        longitude: pass.bar.longitude,
        city: pass.bar.city.name,
      },
      name: pass.name,
      description: pass.description || "",
      type: pass.type,
      price: pass.priceCents / 100,
      originalPrice: pass.originalPriceCents
        ? pass.originalPriceCents / 100
        : undefined,
      benefits: pass.benefits,
      skipLinePriority: pass.skipLinePriority,
      coverFeeIncluded: pass.coverFeeIncluded,
      coverFeeAmount: pass.coverFeeAmount / 100,
      validity: {
        start: pass.validityStart,
        end: pass.validityEnd,
        validDays: pass.validDays,
        validHours: pass.validHours as
          | { start: string; end: string }
          | undefined,
      },
      capacity: {
        total: pass.totalQuantity,
        sold: pass.soldCount,
        available: pass.totalQuantity - pass.soldCount,
      },
      maxPerUser: pass.maxPerUser,
    }));

    return NextResponse.json({ passes: transformedPasses });
  } catch (error) {
    console.error("Error fetching VIP passes:", error);
    return NextResponse.json(
      { error: "Failed to fetch VIP passes" },
      { status: 500 }
    );
  }
}
