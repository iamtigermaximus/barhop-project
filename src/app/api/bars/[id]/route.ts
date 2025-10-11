// src/app/api/bars/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
