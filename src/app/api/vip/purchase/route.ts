import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vipPassId } = await request.json();

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get VIP pass with bar info
    const vipPass = await prisma.vIPPassEnhanced.findUnique({
      where: { id: vipPassId },
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

    // Check availability
    if (vipPass.soldCount >= vipPass.totalQuantity) {
      return NextResponse.json(
        { error: "VIP pass is sold out" },
        { status: 400 }
      );
    }

    // Check if user already purchased max allowed
    const userPassCount = await prisma.userVIPPass.count({
      where: {
        userId: user.id,
        vipPassId: vipPassId,
        status: "ACTIVE",
      },
    });

    if (userPassCount >= vipPass.maxPerUser) {
      return NextResponse.json(
        { error: `You can only purchase ${vipPass.maxPerUser} of this pass` },
        { status: 400 }
      );
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate QR code
      const qrCode = `HOPPR-VIP-${
        user.name?.split(" ")[0]?.toUpperCase() || "USER"
      }-${Date.now().toString().slice(-4)}`;

      // Create user VIP pass
      const userVIPPass = await tx.userVIPPass.create({
        data: {
          userId: user.id,
          vipPassId: vipPassId,
          barId: vipPass.barId,
          qrCode: qrCode,
          purchasePriceCents: vipPass.priceCents,
          expiresAt: vipPass.validityEnd,
          status: "ACTIVE",
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

      return userVIPPass;
    });

    return NextResponse.json({
      success: true,
      purchase: {
        id: result.id,
        pass: {
          name: vipPass.name,
          bar: {
            name: vipPass.bar.name,
          },
        },
        qrCode: result.qrCode,
        expiresAt: result.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
