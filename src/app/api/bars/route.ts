// // src/app/api/bars/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const bar = await prisma.bar.findUnique({
//       where: { id: params.id },
//       include: {
//         city: true,
//         vipPasses: {
//           where: {
//             isValid: true,
//             endTime: { gt: new Date() },
//           },
//           take: 5,
//           orderBy: { startTime: "asc" },
//         },
//       },
//     });

//     if (!bar) {
//       return NextResponse.json({ error: "Bar not found" }, { status: 404 });
//     }

//     return NextResponse.json(bar);
//   } catch (error) {
//     console.error("Error fetching bar:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/bars/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const vipOnly = searchParams.get("vipOnly");

    const bars = await prisma.bar.findMany({
      where: {
        isActive: true,
        ...(city && {
          city: {
            name: {
              contains: city,
              mode: "insensitive",
            },
          },
        }),
        ...(type && {
          type: type as any, // Use your BarType enum
        }),
        ...(vipOnly === "true" && {
          vipEnabled: true,
        }),
      },
      include: {
        city: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(bars);
  } catch (error) {
    console.error("Error fetching bars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
