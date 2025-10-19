import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.toLowerCase() || "helsinki";

    console.log(`🔍 Fetching VIP passes for city: ${city}`);

    // Fetch active VIP passes from database
    const passes = await prisma.vIPPassEnhanced.findMany({
      where: {
        isActive: true,
        validityStart: { lte: new Date() },
        validityEnd: { gte: new Date() },
        soldCount: { lt: prisma.vIPPassEnhanced.fields.totalQuantity },
        bar: {
          city: {
            name: {
              equals: city,
              mode: "insensitive",
            },
          },
          isActive: true,
        },
      },
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            type: true,
            district: true,
          },
        },
      },
      orderBy: {
        soldCount: "desc",
      },
    });

    console.log(`✅ Found ${passes.length} VIP passes for ${city}`);

    const formattedPasses = passes.map((pass) => ({
      id: pass.id,
      barId: pass.barId,
      bar: {
        id: pass.bar.id,
        name: pass.bar.name,
        image: pass.bar.imageUrl || undefined,
        type: pass.bar.type,
        district: pass.bar.district,
      },
      name: pass.name,
      description: pass.description,
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
        validHours: pass.validHours,
      },
      capacity: {
        total: pass.totalQuantity,
        sold: pass.soldCount,
        available: pass.totalQuantity - pass.soldCount,
      },
      maxPerUser: pass.maxPerUser,
    }));

    return NextResponse.json({
      success: true,
      passes: formattedPasses,
    });
  } catch (error) {
    console.error("❌ Error fetching VIP passes:", error);
    return NextResponse.json(
      { error: "Failed to fetch VIP passes" },
      { status: 500 }
    );
  }
}
