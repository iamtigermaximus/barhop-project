import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Find session by token
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: true,
      },
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Return user data without sensitive information
    const { password, ...userWithoutPassword } = session.user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
