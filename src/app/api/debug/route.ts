import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    let dbTest = { success: false, error: null };
    try {
      await prisma.$connect();
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      dbTest = { success: true, error: null };
    } catch (dbError: any) {
      dbTest = { success: false, error: dbError.message };
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envInfo,
      database: dbTest,
      prisma: {
        isConnected: dbTest.success,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
