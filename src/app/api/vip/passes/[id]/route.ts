import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to get the actual values
    const { id: passId } = await params;

    const vipPass = await prisma.vIPPassEnhanced.findUnique({
      where: { id: passId },
      include: {
        bar: {
          include: {
            city: true,
          },
        },
      },
    });

    if (!vipPass) {
      return NextResponse.json(
        { error: "VIP pass not found" },
        { status: 404 }
      );
    }

    const transformedPass = {
      id: vipPass.id,
      barId: vipPass.barId,
      bar: {
        name: vipPass.bar.name,
        type: vipPass.bar.type,
        district: vipPass.bar.district,
        city: vipPass.bar.city.name,
      },
      name: vipPass.name,
      description: vipPass.description || "",
      price: vipPass.priceCents / 100,
      originalPrice: vipPass.originalPriceCents
        ? vipPass.originalPriceCents / 100
        : undefined,
      benefits: vipPass.benefits,
      validity: {
        start: vipPass.validityStart,
        end: vipPass.validityEnd,
        validDays: vipPass.validDays,
        validHours: vipPass.validHours as
          | { start: string; end: string }
          | undefined,
      },
      capacity: {
        total: vipPass.totalQuantity,
        sold: vipPass.soldCount,
        available: vipPass.totalQuantity - vipPass.soldCount,
      },
    };

    return NextResponse.json(transformedPass);
  } catch (error) {
    console.error("Error fetching pass details:", error);
    return NextResponse.json(
      { error: "Failed to fetch pass details" },
      { status: 500 }
    );
  }
}
