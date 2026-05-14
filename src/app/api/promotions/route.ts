import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface PromotionResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  discount: number | null;
  imageUrl: string | null;
  accentColor: string | null;
  callToAction: string | null;
  barId: string;
  bar?: {
    id: string;
    name: string;
    district: string | null;
    city: string | null;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  isApproved: boolean;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const city = searchParams.get("city");
    const includeUpcoming = searchParams.get("includeUpcoming") === "true";

    // Build filter conditions
    const whereCondition: Prisma.BarPromotionWhereInput = {
      isActive: true,
      isApproved: true,
      endDate: {
        gte: new Date(),
      },
    };

    // Only add startDate filter if we don't want upcoming
    if (!includeUpcoming) {
      whereCondition.startDate = {
        lte: new Date(),
      };
    }

    // Add city filter if provided
    if (city) {
      whereCondition.bar = {
        cityName: city,
      };
    }

    const promotions = await prisma.barPromotion.findMany({
      where: whereCondition,
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            district: true,
            cityName: true,
            coverImage: true,
            type: true,
          },
        },
      },
      orderBy: [{ startDate: "asc" }],
      take: limit,
    });

    const formattedPromotions: PromotionResponse[] = promotions.map(
      (promo) => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        type: promo.type,
        discount: promo.discount,
        imageUrl: promo.imageUrl,
        accentColor: promo.accentColor,
        callToAction: promo.callToAction,
        barId: promo.barId,
        bar: promo.bar
          ? {
              id: promo.bar.id,
              name: promo.bar.name,
              district: promo.bar.district,
              city: promo.bar.cityName,
            }
          : undefined,
        startDate: promo.startDate.toISOString(),
        endDate: promo.endDate.toISOString(),
        isActive: promo.isActive,
        isApproved: promo.isApproved,
      }),
    );

    return NextResponse.json({
      success: true,
      promotions: formattedPromotions,
      count: formattedPromotions.length,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch promotions" },
      { status: 500 },
    );
  }
}
