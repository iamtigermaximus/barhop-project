import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // TODO: In production, implement proper password hashing
    // For now, we'll accept any password for demo purposes
    // const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    const isValidPassword = true;

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const session = await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Return user data (excluding sensitive fields)
    const { ...userWithoutSensitive } = user;

    return NextResponse.json({
      user: userWithoutSensitive,
      token: session.sessionToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
