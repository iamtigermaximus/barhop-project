// // src/app/api/bars/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// interface RouteParams {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     // Await the params first
//     const { id } = await params;

//     const bar = await prisma.bar.findUnique({
//       where: { id },
//       include: {
//         city: true,
//         vipPasses: {
//           where: {
//             isValid: true,
//             endTime: { gt: new Date() },
//           },
//           take: 5,
//           orderBy: { startTime: "asc" },
//         },
//       },
//     });

//     if (!bar) {
//       return NextResponse.json({ error: "Bar not found" }, { status: 404 });
//     }

//     // Transform the data to match your component's expected structure
//     const barData = {
//       id: bar.id,
//       name: bar.name,
//       description: bar.description,
//       address: bar.address,
//       district: bar.district,
//       type: bar.type,
//       vipEnabled: bar.vipEnabled,
//       vipPrice: bar.vipPrice,
//       city: bar.city,
//       phone: bar.phone,
//       website: bar.website,
//       imageUrl: bar.imageUrl,
//       latitude: bar.latitude,
//       longitude: bar.longitude,
//     };

//     return NextResponse.json(barData);
//   } catch (error) {
//     console.error("Error fetching bar:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/bars/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params first
    const { id } = await params;

    const bar = await prisma.bar.findUnique({
      where: { id },
      include: {
        city: true,
        vipPasses: {
          where: {
            isValid: true,
            endTime: { gt: new Date() },
          },
          take: 5,
          orderBy: { startTime: "asc" },
        },
        vipPassesEnhanced: {
          where: {
            isActive: true,
            validityEnd: { gt: new Date() },
          },
          orderBy: { priceCents: "asc" },
        },
        socialActivity: true,
        // Include other relations as needed
      },
    });

    if (!bar) {
      return NextResponse.json({ error: "Bar not found" }, { status: 404 });
    }

    // Transform the data to match your component's expected structure
    const barData = {
      id: bar.id,
      name: bar.name,
      description: bar.description,
      address: bar.address,
      district: bar.district,
      type: bar.type,
      vipEnabled: bar.vipEnabled,
      vipPrice: bar.vipPrice,
      city: bar.city,
      phone: bar.phone,
      website: bar.website,
      imageUrl: bar.imageUrl,
      latitude: bar.latitude,
      longitude: bar.longitude,

      // Enhanced fields
      operatingHours: bar.operatingHours,
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
        })) || [],

      // Social activity
      socialActivity: bar.socialActivity
        ? {
            activeUsersCount: bar.socialActivity.activeUsersCount,
            socialMeetupsCount: bar.socialActivity.socialMeetupsCount,
            isHotspot: bar.socialActivity.isHotspot,
            heatLevel: bar.socialActivity.heatLevel,
          }
        : undefined,

      // Mock data for fields not yet in your schema (you can add these to your schema later)
      priceLevel: 3, // You can calculate this based on vipPrice or add to schema
      features: ["Dance Floor", "VIP Area", "Live DJ", "Cocktail Bar"], // Add to schema or calculate

      // Mock promotions (you can create a promotions model later)
      currentPromotions: [
        {
          id: "1",
          title: "Friday Happy Hour",
          type: "HAPPY_HOUR" as const,
          description: "Enjoy 2-for-1 cocktails during our extended happy hour",
          startTime: "17:00",
          endTime: "20:00",
          discount: "2-for-1 cocktails",
          days: ["Friday"],
          isActive: true,
        },
      ],

      // Mock rating data (you can create a reviews model later)
      rating: {
        average: 4.3,
        count: 127,
        recentReviews: [
          {
            id: "1",
            userId: "user1",
            userName: "Sarah M.",
            rating: 5,
            comment:
              "Amazing atmosphere and great music! The VIP area was worth every euro.",
            createdAt: "2024-01-15T20:30:00Z",
          },
        ],
      },

      // Mock transport data (you can add to schema later)
      transport: {
        metroStations: ["Hakaniemi (0.3km)", "Sörnäinen (0.8km)"],
        busStops: ["Vaasankatu", "Hakaniemen tori"],
        parking: false,
        bikeParking: true,
        notes:
          "Limited street parking available. Bike parking at front entrance.",
      },
    };

    return NextResponse.json(barData);
  } catch (error) {
    console.error("Error fetching bar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
