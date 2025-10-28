// src/app/api/db-test/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== DATABASE CONNECTION TEST ===");

    // Test 1: Basic connection
    console.log("1. Testing Prisma connection...");
    await prisma.$connect();
    console.log("✅ Prisma connected");

    // Test 2: Raw SQL query
    console.log("2. Testing raw SQL query...");
    const rawResult = await prisma.$queryRaw`SELECT version() as version`;
    console.log("✅ Raw query successful");

    // Test 3: Count bars
    console.log("3. Counting bars...");
    const barCount = await prisma.bar.count();
    console.log(`✅ Bar count: ${barCount}`);

    // Test 4: Fetch sample bars
    console.log("4. Fetching sample bars...");
    const bars = await prisma.bar.findMany({
      take: 3,
      include: { city: true },
      orderBy: { name: "asc" },
    });
    console.log(`✅ Sample bars fetched: ${bars.length}`);

    return NextResponse.json({
      status: "success",
      database: "connected",
      tests: {
        connection: "✅ passed",
        rawQuery: "✅ passed",
        barCount: "✅ passed",
        sampleData: "✅ passed",
      },
      results: {
        barCount,
        sampleBars: bars,
        databaseVersion: rawResult,
      },
      connectionInfo: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        sslEnabled: process.env.DATABASE_URL?.includes("sslmode=require")
          ? "✅ yes"
          : "❌ no",
        environment: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
      },
    });
  } catch (error: unknown) {
    console.error("=== DATABASE TEST FAILED ===");
    console.error("Error:", error);

    // Type-safe error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as { code?: string }).code;
    const errorName = error instanceof Error ? error.name : "Error";

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: {
          message: errorMessage,
          code: errorCode,
          name: errorName,
        },
        connectionInfo: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPreview: process.env.DATABASE_URL
            ? process.env.DATABASE_URL.substring(0, 80) + "..."
            : "missing",
          sslEnabled: process.env.DATABASE_URL?.includes("sslmode=require")
            ? "yes"
            : "no",
          environment: process.env.NODE_ENV,
        },
        troubleshooting: [
          "Check if Supabase database is running",
          "Verify DATABASE_URL in Vercel environment variables",
          "Check Supabase connection settings and IP restrictions",
          "Ensure database has the Bar table with data",
        ],
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
