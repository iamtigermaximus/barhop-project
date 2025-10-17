// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { SocialStatus } from "@prisma/client";

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const {
//       isActive,
//       vibe,
//       interests,
//       locationLat,
//       locationLng,
//       currentBarId,
//       isVisibleOnMap,
//     } = body;

//     console.log("Social mode request from user:", session.user.id);
//     console.log("Request body:", body);

//     const socialStatus: SocialStatus = isActive ? "SOCIAL_MODE" : "OFFLINE";

//     try {
//       // Try to update existing profile first
//       const socialProfile = await prisma.userSocialProfile.update({
//         where: { userId: session.user.id },
//         data: {
//           isSocialMode: isActive,
//           socialStatus,
//           vibe: vibe || null,
//           interests: interests || [],
//           locationLat: locationLat || null,
//           locationLng: locationLng || null,
//           currentBarId: currentBarId || null,
//           isVisibleOnMap: isVisibleOnMap ?? true,
//           lastActive: new Date(),
//         },
//       });

//       // Update bar activity if at a bar
//       if (currentBarId && isActive) {
//         await updateBarSocialActivity(currentBarId);
//       }

//       return NextResponse.json({
//         success: true,
//         socialProfile,
//         message: `Social mode ${isActive ? "activated" : "deactivated"}`,
//       });
//     } catch (updateError: any) {
//       // If update fails because record doesn't exist, create it
//       if (updateError.code === "P2025") {
//         const socialProfile = await prisma.userSocialProfile.create({
//           data: {
//             userId: session.user.id,
//             isSocialMode: isActive,
//             socialStatus,
//             vibe: vibe || null,
//             interests: interests || [],
//             locationLat: locationLat || null,
//             locationLng: locationLng || null,
//             currentBarId: currentBarId || null,
//             isVisibleOnMap: isVisibleOnMap ?? true,
//           },
//         });

//         return NextResponse.json({
//           success: true,
//           socialProfile,
//           message: `Social mode ${isActive ? "activated" : "deactivated"}`,
//         });
//       } else {
//         throw updateError;
//       }
//     }
//   } catch (error) {
//     console.error("Error updating social status:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const lat = searchParams.get("lat");
//     const lng = searchParams.get("lng");
//     const radius = parseInt(searchParams.get("radius") || "1000");

//     const whereClause: any = {
//       AND: [
//         { isSocialMode: true },
//         { isVisibleOnMap: true },
//         { userId: { not: session.user.id } },
//       ],
//     };

//     // Add location filter if coordinates provided
//     if (lat && lng) {
//       const latNum = parseFloat(lat);
//       const lngNum = parseFloat(lng);
//       const radiusDeg = radius / 111320;

//       whereClause.AND.push(
//         {
//           locationLat: {
//             gte: latNum - radiusDeg,
//             lte: latNum + radiusDeg,
//           },
//         },
//         {
//           locationLng: {
//             gte: lngNum - radiusDeg,
//             lte: lngNum + radiusDeg,
//           },
//         }
//       );
//     }

//     const nearbyUsers = await prisma.userSocialProfile.findMany({
//       where: whereClause,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//         currentBar: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//             type: true,
//           },
//         },
//       },
//       orderBy: {
//         lastActive: "desc",
//       },
//     });

//     // Calculate distances
//     const usersWithDistance = nearbyUsers
//       .map((profile) => {
//         let distance: number | undefined;
//         if (lat && lng && profile.locationLat && profile.locationLng) {
//           distance = calculateDistance(
//             parseFloat(lat),
//             parseFloat(lng),
//             profile.locationLat,
//             profile.locationLng
//           );
//         }
//         return {
//           ...profile,
//           distance,
//         };
//       })
//       .filter((profile) => !profile.distance || profile.distance <= radius);

//     return NextResponse.json({ users: usersWithDistance });
//   } catch (error) {
//     console.error("Error fetching nearby users:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // Helper functions
// function calculateDistance(
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ): number {
//   const R = 6371e3;
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lng2 - lng1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// }

// async function updateBarSocialActivity(barId: string): Promise<void> {
//   try {
//     const activeUsersCount = await prisma.userSocialProfile.count({
//       where: {
//         currentBarId: barId,
//         isSocialMode: true,
//       },
//     });

//     await prisma.barSocialActivity.upsert({
//       where: { barId },
//       update: {
//         activeUsersCount,
//         lastActivity: new Date(),
//         heatLevel: Math.min(100, activeUsersCount * 10),
//         isHotspot: activeUsersCount >= 3,
//       },
//       create: {
//         barId,
//         activeUsersCount,
//         heatLevel: Math.min(100, activeUsersCount * 10),
//         isHotspot: activeUsersCount >= 3,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating bar social activity:", error);
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SocialStatus, Prisma } from "@prisma/client";
import {
  SocialStatusUpdateRequest,
  NearbyUsersResponse,
  ApiErrorResponse,
  SocialStatusResponse,
} from "@/types/social";

// Define proper types for the where clause
type LocationWhereClause = {
  locationLat: { gte: number; lte: number };
  locationLng: { gte: number; lte: number };
};

type UserWhereClause = {
  userId: { not: string };
};

type SocialModeWhereClause = {
  isSocialMode: boolean;
  isVisibleOnMap: boolean;
};

type WhereClause = {
  AND: Array<SocialModeWhereClause | UserWhereClause | LocationWhereClause>;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const errorResponse: ApiErrorResponse = {
        error: "AuthenticationError",
        message: "Authentication required",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const body: SocialStatusUpdateRequest = await request.json();
    const {
      isActive,
      vibe,
      interests,
      locationLat,
      locationLng,
      currentBarId,
      isVisibleOnMap,
    } = body;

    console.log("Social mode request from user:", session.user.id);
    console.log("Request body:", body);

    const socialStatus: SocialStatus = isActive ? "SOCIAL_MODE" : "OFFLINE";

    try {
      // Try to update existing profile first
      const socialProfile = await prisma.userSocialProfile.update({
        where: { userId: session.user.id },
        data: {
          isSocialMode: isActive,
          socialStatus,
          vibe: vibe || null,
          interests: interests || [],
          locationLat: locationLat || null,
          locationLng: locationLng || null,
          currentBarId: currentBarId || null,
          isVisibleOnMap: isVisibleOnMap ?? true,
          lastActive: new Date(),
        },
      });

      // Update bar activity if at a bar
      if (currentBarId && isActive) {
        await updateBarSocialActivity(currentBarId);
      }

      const response: SocialStatusResponse = {
        success: true,
        socialProfile,
        message: `Social mode ${isActive ? "activated" : "deactivated"}`,
      };

      return NextResponse.json(response);
    } catch (updateError: unknown) {
      // If update fails because record doesn't exist, create it
      if (
        updateError instanceof Prisma.PrismaClientKnownRequestError &&
        updateError.code === "P2025"
      ) {
        const socialProfile = await prisma.userSocialProfile.create({
          data: {
            userId: session.user.id,
            isSocialMode: isActive,
            socialStatus,
            vibe: vibe || null,
            interests: interests || [],
            locationLat: locationLat || null,
            locationLng: locationLng || null,
            currentBarId: currentBarId || null,
            isVisibleOnMap: isVisibleOnMap ?? true,
          },
        });

        const response: SocialStatusResponse = {
          success: true,
          socialProfile,
          message: `Social mode ${isActive ? "activated" : "deactivated"}`,
        };

        return NextResponse.json(response);
      } else {
        throw updateError;
      }
    }
  } catch (error) {
    console.error("Error updating social status:", error);
    const errorResponse: ApiErrorResponse = {
      error: "InternalServerError",
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      const errorResponse: ApiErrorResponse = {
        error: "AuthenticationError",
        message: "Authentication required",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseInt(searchParams.get("radius") || "1000");

    const whereClause: WhereClause = {
      AND: [
        { isSocialMode: true, isVisibleOnMap: true },
        { userId: { not: session.user.id } },
      ],
    };

    // Add location filter if coordinates provided
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusDeg = radius / 111320;

      const locationFilter: LocationWhereClause = {
        locationLat: {
          gte: latNum - radiusDeg,
          lte: latNum + radiusDeg,
        },
        locationLng: {
          gte: lngNum - radiusDeg,
          lte: lngNum + radiusDeg,
        },
      };

      whereClause.AND.push(locationFilter);
    }

    const nearbyUsers = await prisma.userSocialProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        currentBar: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
          },
        },
      },
      orderBy: {
        lastActive: "desc",
      },
    });

    // Calculate distances
    const usersWithDistance = nearbyUsers
      .map((profile) => {
        let distance: number | undefined;
        if (lat && lng && profile.locationLat && profile.locationLng) {
          distance = calculateDistance(
            parseFloat(lat),
            parseFloat(lng),
            profile.locationLat,
            profile.locationLng
          );
        }
        return {
          ...profile,
          distance,
        };
      })
      .filter((profile) => !profile.distance || profile.distance <= radius);

    const response: NearbyUsersResponse = {
      users: usersWithDistance,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    const errorResponse: ApiErrorResponse = {
      error: "InternalServerError",
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper functions remain the same...
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function updateBarSocialActivity(barId: string): Promise<void> {
  try {
    const activeUsersCount = await prisma.userSocialProfile.count({
      where: {
        currentBarId: barId,
        isSocialMode: true,
      },
    });

    await prisma.barSocialActivity.upsert({
      where: { barId },
      update: {
        activeUsersCount,
        lastActivity: new Date(),
        heatLevel: Math.min(100, activeUsersCount * 10),
        isHotspot: activeUsersCount >= 3,
      },
      create: {
        barId,
        activeUsersCount,
        heatLevel: Math.min(100, activeUsersCount * 10),
        isHotspot: activeUsersCount >= 3,
      },
    });
  } catch (error) {
    console.error("Error updating bar social activity:", error);
  }
}
