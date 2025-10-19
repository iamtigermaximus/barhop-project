import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { vipPassId } = await request.json();

    if (!vipPassId) {
      return NextResponse.json(
        { error: "VIP pass ID is required" },
        { status: 400 }
      );
    }

    // Check if VIP pass exists and is available
    const vipPass = await prisma.vIPPassEnhanced.findUnique({
      where: {
        id: vipPassId,
        isActive: true,
        validityStart: { lte: new Date() },
        validityEnd: { gte: new Date() },
      },
      include: {
        bar: true,
      },
    });

    if (!vipPass) {
      return NextResponse.json(
        { error: "VIP pass not found or not available" },
        { status: 404 }
      );
    }

    // Check availability
    if (vipPass.soldCount >= vipPass.totalQuantity) {
      return NextResponse.json(
        { error: "VIP pass is sold out" },
        { status: 400 }
      );
    }

    // Check if user already purchased this pass (respect maxPerUser)
    const userPurchases = await prisma.userVIPPass.count({
      where: {
        userId: session.user.id,
        vipPassId: vipPassId,
        status: "ACTIVE",
      },
    });

    if (userPurchases >= vipPass.maxPerUser) {
      return NextResponse.json(
        { error: `You can only purchase ${vipPass.maxPerUser} of this pass` },
        { status: 400 }
      );
    }

    // Generate unique QR code
    const qrCode = `HOPPR-VIP-${session.user.id.slice(-6)}-${Date.now()}`;

    // Create transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user VIP pass
      const userVipPass = await tx.userVIPPass.create({
        data: {
          userId: session.user.id,
          vipPassId: vipPassId,
          barId: vipPass.barId,
          qrCode,
          purchasePriceCents: vipPass.priceCents,
          expiresAt: vipPass.validityEnd,
        },
      });

      // Update sold count
      await tx.vIPPassEnhanced.update({
        where: { id: vipPassId },
        data: {
          soldCount: {
            increment: 1,
          },
        },
      });

      return userVipPass;
    });

    console.log(`✅ VIP pass purchased: ${qrCode} for user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      pass: {
        id: result.id,
        qrCode: result.qrCode,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    console.error("❌ Error purchasing VIP pass:", error);
    return NextResponse.json(
      { error: "Failed to purchase VIP pass" },
      { status: 500 }
    );
  }
}
