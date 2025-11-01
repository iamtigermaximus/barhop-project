import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await the params
    const { id: purchaseId } = await params;

    const purchase = await prisma.userVIPPass.findUnique({
      where: { id: purchaseId },
      include: {
        vipPass: {
          include: {
            bar: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (purchase.userId !== user?.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const purchaseData = {
      purchase: {
        id: purchase.id,
        pass: {
          name: purchase.vipPass.name,
          bar: {
            name: purchase.vipPass.bar.name,
          },
        },
        qrCode: purchase.qrCode,
        expiresAt: purchase.expiresAt.toISOString(),
      },
    };

    return NextResponse.json(purchaseData);
  } catch (error) {
    console.error("Error fetching purchase details:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase details" },
      { status: 500 }
    );
  }
}
