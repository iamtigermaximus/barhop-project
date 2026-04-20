// app/api/bars/route.ts
import { NextResponse } from "next/server";
import { Prisma, BarType, BarStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Haversine formula to calculate distance between two coordinates (in km)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const cityName = searchParams.get("cityName");
    const barTypes = searchParams.get("barTypes");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;
    const status = searchParams.get("status") as BarStatus | null;
    const isActive = searchParams.get("isActive");
    const sortBy = searchParams.get("sortBy") || "distance";

    // Get user location for distance calculation
    const userLat = searchParams.get("userLat");
    const userLng = searchParams.get("userLng");

    console.log("Fetching bars...", {
      sortBy,
      userLat,
      userLng,
      page,
      limit,
      barTypes,
    });

    // Convert comma-separated string to enum array with proper typing
    let typesArray: BarType[] = [];
    if (barTypes) {
      typesArray = barTypes
        .split(",")
        .filter((type): type is BarType =>
          Object.values(BarType).includes(type as BarType),
        );
    }

    // Build where clause dynamically
    const whereClause: Prisma.BarWhereInput = {
      isActive: isActive !== null ? isActive === "true" : true,
    };

    if (status) {
      whereClause.status = status;
    }

    if (cityId) {
      whereClause.cityId = cityId;
    }

    if (cityName) {
      whereClause.cityName = cityName;
    }

    if (typesArray.length > 0) {
      whereClause.type = { in: typesArray };
    }

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));

    // Get all bars matching filters
    const bars = await prisma.bar.findMany({
      where: whereClause,
      include: {
        city: true,
      },
    });

    console.log(`Found ${bars.length} bars matching filters`);

    // Calculate distance for each bar if user location provided
    const barsWithDistance = bars.map((bar) => {
      let distance = undefined;
      if (userLat && userLng && bar.latitude && bar.longitude) {
        distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          bar.latitude,
          bar.longitude,
        );
      }
      return {
        ...bar,
        distance,
      };
    });

    // Sort by distance if requested (NEAREST FIRST)
    if (sortBy === "distance" && userLat && userLng) {
      barsWithDistance.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
      console.log("Sorted by distance (nearest first)");
    } else if (sortBy === "name") {
      barsWithDistance.sort((a, b) => a.name.localeCompare(b.name));
      console.log("Sorted by name");
    } else if (sortBy === "open") {
      barsWithDistance.sort((a, b) => a.name.localeCompare(b.name));
      console.log("Sorted by name (fallback for open)");
    }

    const totalCount = barsWithDistance.length;

    // Apply pagination
    const paginatedBars = barsWithDistance.slice(skip, skip + limit);

    // Format response
    const barsData = paginatedBars.map((bar) => ({
      id: bar.id,
      name: bar.name,
      description: bar.description,
      address: bar.address,
      district: bar.district,
      type: bar.type,
      vipEnabled: bar.vipEnabled,
      vipPrice: bar.vipPrice,
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
      distance: bar.distance,
    }));

    const response = NextResponse.json({
      data: barsData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error: unknown) {
    console.error("Error fetching bars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
