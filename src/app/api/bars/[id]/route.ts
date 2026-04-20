// app/api/bars/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const bar = await prisma.bar.findUnique({
      where: { id },
      include: {
        city: true,
        vipPassesEnhanced: {
          where: {
            isActive: true,
            validityEnd: { gt: new Date() },
          },
          orderBy: { priceCents: "asc" },
        },
        socialActivity: true,
        promotions: {
          where: {
            isActive: true,
            isApproved: true,
            endDate: { gt: new Date() },
          },
          orderBy: { priority: "asc" },
          take: 10,
        },
        staff: {
          where: {
            isActive: true,
          },
          take: 10,
        },
      },
    });

    if (!bar) {
      return NextResponse.json({ error: "Bar not found" }, { status: 404 });
    }

    // Transform the data
    const barData = {
      id: bar.id,
      name: bar.name,
      description: bar.description,
      address: bar.address,
      district: bar.district,
      type: bar.type,
      vipEnabled: bar.vipEnabled,
      vipPrice: bar.vipPrice,
      vipCapacity: bar.vipCapacity,
      cityName: bar.cityName,
      city: bar.city
        ? {
            id: bar.city.id,
            name: bar.city.name,
            country: bar.city.country,
          }
        : null,
      phone: bar.phone,
      email: bar.email,
      website: bar.website,
      instagram: bar.instagram,
      coverImage: bar.coverImage,
      imageUrl: bar.imageUrl,
      logoUrl: bar.logoUrl,
      imageUrls: bar.imageUrls,
      latitude: bar.latitude,
      longitude: bar.longitude,
      operatingHours: bar.operatingHours,
      priceRange: bar.priceRange,
      capacity: bar.capacity,
      amenities: bar.amenities,
      isVerified: bar.isVerified,
      isActive: bar.isActive,
      status: bar.status,
      profileViews: bar.profileViews,
      directionClicks: bar.directionClicks,
      callClicks: bar.callClicks,
      websiteClicks: bar.websiteClicks,
      shareCount: bar.shareCount,
      createdAt: bar.createdAt,
      updatedAt: bar.updatedAt,
      claimedAt: bar.claimedAt,

      // VIP Passes
      vipPassesEnhanced:
        bar.vipPassesEnhanced?.map((pass) => ({
          id: pass.id,
          name: pass.name,
          description: pass.description || "",
          priceCents: pass.priceCents,
          originalPriceCents: pass.originalPriceCents,
          soldCount: pass.soldCount,
          totalQuantity: pass.totalQuantity,
          benefits: pass.benefits,
          skipLinePriority: pass.skipLinePriority,
          coverFeeIncluded: pass.coverFeeIncluded,
          coverFeeAmount: pass.coverFeeAmount,
          validityStart: pass.validityStart,
          validityEnd: pass.validityEnd,
          validDays: pass.validDays,
          validHours: pass.validHours,
          isActive: pass.isActive,
          type: pass.type,
        })) || [],

      // Social activity
      socialActivity: bar.socialActivity
        ? {
            activeUsersCount: bar.socialActivity.activeUsersCount,
            socialMeetupsCount: bar.socialActivity.socialMeetupsCount,
            isHotspot: bar.socialActivity.isHotspot,
            heatLevel: bar.socialActivity.heatLevel,
            lastActivity: bar.socialActivity.lastActivity,
          }
        : null,

      // Promotions
      currentPromotions:
        bar.promotions?.map((promo) => ({
          id: promo.id,
          title: promo.title,
          description: promo.description,
          type: promo.type,
          discount: promo.discount,
          imageUrl: promo.imageUrl,
          accentColor: promo.accentColor,
          callToAction: promo.callToAction,
          conditions: promo.conditions,
          startDate: promo.startDate,
          endDate: promo.endDate,
          validDays: promo.validDays,
          validHours: promo.validHours,
          isActive: promo.isActive,
          views: promo.views,
          clicks: promo.clicks,
          redemptions: promo.redemptions,
        })) || [],

      // Staff
      staff:
        bar.staff?.map((member) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          isActive: member.isActive,
        })) || [],
    };

    return NextResponse.json(barData);
  } catch (error) {
    console.error("Error fetching bar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
