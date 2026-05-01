// src/app/api/chat/by-crawl/[crawlId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ crawlId: string }> },
) {
  try {
    const { crawlId } = await params;

    // Find the chatroom that belongs to this crawl
    const chatroom = await prisma.chatroom.findFirst({
      where: { crawlId: crawlId },
      select: { id: true },
    });

    return NextResponse.json({ chatroomId: chatroom?.id || null });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ chatroomId: null }, { status: 500 });
  }
}
