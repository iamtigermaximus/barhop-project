// app/api/bars/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("Fetching bars from database...");

    const bars = await prisma.bar.findMany({
      include: {
        city: true,
      },
      where: {
        isActive: true, // Only fetch active bars
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`Found ${bars.length} bars`);

    const barsData = bars.map((bar) => ({
      id: bar.id,
      name: bar.name,
      description: bar.description,
      address: bar.address,
      district: bar.district,
      type: bar.type,
      vipEnabled: bar.vipEnabled,
      vipPrice: bar.vipPrice,
      city: bar.city,
      phone: bar.phone,
      website: bar.website,
      imageUrl: bar.imageUrl,
      latitude: bar.latitude,
      longitude: bar.longitude,
    }));

    // Add CORS headers
    const response = NextResponse.json(barsData);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error: unknown) {
    console.error("Error fetching bars:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Log detailed error for debugging
    console.error("Detailed error:", {
      message: errorMessage,
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
} // // src/app/api/bars/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function GET() {
//   try {
//     const bars = await prisma.bar.findMany({
//       include: {
//         city: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     // Transform the data to match your frontend structure
//     const barsData = bars.map((bar) => ({
//       id: bar.id,
//       name: bar.name,
//       description: bar.description,
//       address: bar.address,
//       district: bar.district,
//       type: bar.type,
//       vipEnabled: bar.vipEnabled,
//       vipPrice: bar.vipPrice,
//       city: bar.city,
//       phone: bar.phone,
//       website: bar.website,
//       imageUrl: bar.imageUrl,
//       latitude: bar.latitude,
//       longitude: bar.longitude,
//     }));

//     return NextResponse.json(barsData);
//   } catch (error) {
//     console.error("Error fetching bars:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/bars/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function GET() {
//   try {
//     const bars = await prisma.bar.findMany({
//       include: {
//         city: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     const barsData = bars.map((bar) => ({
//       id: bar.id,
//       name: bar.name,
//       description: bar.description,
//       address: bar.address,
//       district: bar.district,
//       type: bar.type,
//       vipEnabled: bar.vipEnabled,
//       vipPrice: bar.vipPrice,
//       city: bar.city,
//       phone: bar.phone,
//       website: bar.website,
//       imageUrl: bar.imageUrl,
//       latitude: bar.latitude,
//       longitude: bar.longitude,
//     }));

//     return NextResponse.json(barsData);
//   } catch (error: unknown) {
//     console.error("Error fetching bars:", error);

//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";

//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: errorMessage,
//       },
//       { status: 500 }
//     );
//   }
// }
