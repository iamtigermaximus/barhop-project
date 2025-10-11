// src/app/api/bars/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const bars = await prisma.bar.findMany({
      include: {
        city: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match your frontend structure
    const barsData = bars.map((bar) => ({
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
    }));

    return NextResponse.json(barsData);
  } catch (error) {
    console.error("Error fetching bars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
