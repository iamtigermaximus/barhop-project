import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log(`🔍 Fetching VIP passes for user: ${session.user.id}`);

    // Fetch all VIP passes purchased by this user
    const passes = await prisma.userVIPPass.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        vipPass: {
          include: {
            bar: {
              select: {
                id: true,
                name: true,
                district: true,
                type: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

    console.log(
      `✅ Found ${passes.length} VIP passes for user ${session.user.id}`
    );

    return NextResponse.json({
      success: true,
      passes: passes.map((pass) => ({
        id: pass.id,
        qrCode: pass.qrCode,
        status: pass.status,
        purchasedAt: pass.purchasedAt,
        expiresAt: pass.expiresAt,
        scannedAt: pass.scannedAt,
        purchasePriceCents: pass.purchasePriceCents,
        vipPass: {
          id: pass.vipPass.id,
          name: pass.vipPass.name,
          type: pass.vipPass.type,
          bar: pass.vipPass.bar,
        },
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching user VIP passes:", error);
    return NextResponse.json(
      { error: "Failed to fetch VIP passes" },
      { status: 500 }
    );
  }
}
