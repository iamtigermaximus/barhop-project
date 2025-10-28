import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test environment variables
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length,
      databaseUrlStart: process.env.DATABASE_URL?.substring(0, 20) + "...",
      vercel: process.env.VERCEL ? "true" : "false",
    };

    // Test database connection
    let dbTest = { success: false, error: null as string | null };
    try {
      await prisma.$connect();
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      dbTest = { success: true, error: null };
    } catch (dbError: unknown) {
      const errorMessage =
        dbError instanceof Error ? dbError.message : "Unknown database error";
      dbTest = { success: false, error: errorMessage };
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envInfo,
      database: dbTest,
      prisma: {
        isConnected: dbTest.success,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
