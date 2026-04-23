// // app/api/crawls/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { Prisma, CrawlStatus } from "@prisma/client";

// // Proper type for update data
// interface CrawlUpdateData {
//   name?: string;
//   description?: string;
//   cityId?: string;
//   date?: Date;
//   startTime?: Date;
//   maxParticipants?: number;
//   isPublic?: boolean;
//   status?: CrawlStatus;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const publicOnly = searchParams.get("public") === "true";
//     const session = await getServerSession(authOptions);

//     let crawls;

//     if (publicOnly) {
//       // Get public crawls for discover page - ONLY upcoming/active
//       crawls = await prisma.crawl.findMany({
//         where: {
//           isPublic: true,
//           status: {
//             in: ["PLANNING", "UPCOMING"],
//           },
//           date: {
//             gte: new Date(), // Only show dates from today onwards
//           },
//         },
//         include: {
//           creator: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               image: true,
//             },
//           },
//           city: {
//             select: {
//               id: true,
//               name: true,
//             },
//           },
//           participants: {
//             select: {
//               userId: true,
//             },
//           },
//           crawlBars: {
//             include: {
//               bar: true,
//             },
//           },
//           _count: {
//             select: {
//               participants: true,
//             },
//           },
//         },
//         orderBy: {
//           date: "asc",
//         },
//       });
//     } else if (session) {
//       // Get user's crawls for authenticated users (all statuses)
//       crawls = await prisma.crawl.findMany({
//         where: {
//           OR: [
//             { creatorId: session.user.id },
//             { participants: { some: { userId: session.user.id } } },
//           ],
//         },
//         include: {
//           creator: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               image: true,
//             },
//           },
//           city: {
//             select: {
//               id: true,
//               name: true,
//             },
//           },
//           participants: {
//             select: {
//               userId: true,
//             },
//           },
//           crawlBars: {
//             include: {
//               bar: true,
//             },
//           },
//           _count: {
//             select: {
//               participants: true,
//             },
//           },
//         },
//         orderBy: {
//           date: "asc",
//         },
//       });
//     } else {
//       return NextResponse.json([], { status: 200 });
//     }

//     return NextResponse.json(crawls, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching crawls:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     console.log("Session email:", session.user.email);
//     console.log("Session user ID:", session.user.id);

//     // Get or create user - handle both JWT and database scenarios
//     let user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     // If user doesn't exist, create one using session data
//     if (!user) {
//       console.log("User not found in database, creating new user...");

//       try {
//         user = await prisma.user.create({
//           data: {
//             email: session.user.email,
//             name: session.user.name || session.user.email.split("@")[0],
//             image: session.user.image || null,
//             emailVerified: new Date(),
//           },
//         });
//         console.log("Created new user:", user.id);
//       } catch (createError) {
//         console.error("Error creating user:", createError);
//         // If creation fails (e.g., unique constraint), try to find again
//         user = await prisma.user.findUnique({
//           where: { email: session.user.email },
//         });

//         if (!user) {
//           return NextResponse.json(
//             { error: "Unable to create or find user account" },
//             { status: 400 },
//           );
//         }
//       }
//     }

//     const body = await request.json();
//     const {
//       name,
//       description,
//       cityId,
//       date,
//       startTime,
//       maxParticipants,
//       barTypes,
//     } = body;

//     // Validate required fields
//     if (!name || !cityId || !date || !startTime) {
//       return NextResponse.json(
//         {
//           error:
//             "Missing required fields: name, city, date, and time are required",
//         },
//         { status: 400 },
//       );
//     }

//     // Validate city exists
//     const city = await prisma.city.findUnique({
//       where: { id: cityId },
//     });

//     if (!city) {
//       return NextResponse.json(
//         { error: "Selected city not found" },
//         { status: 400 },
//       );
//     }

//     // Find bars in the selected city
//     const whereCondition: Prisma.BarWhereInput = {
//       cityId: cityId,
//       isActive: true,
//     };

//     if (barTypes && barTypes.length > 0) {
//       whereCondition.type = {
//         in: barTypes,
//       };
//     }

//     const availableBars = await prisma.bar.findMany({
//       where: whereCondition,
//       take: 4,
//       orderBy: {
//         vipEnabled: "desc",
//       },
//     });

//     if (availableBars.length === 0) {
//       return NextResponse.json(
//         {
//           error: `No bars found in ${city.name} matching your criteria. Try selecting different bar types.`,
//         },
//         { status: 400 },
//       );
//     }

//     // Calculate start times for each bar
//     const startTimeDate = new Date(startTime);
//     const crawlBarsData = availableBars.map((bar, index) => ({
//       barId: bar.id,
//       orderIndex: index + 1,
//       duration: 60,
//       startTime: new Date(startTimeDate.getTime() + index * 60 * 60 * 1000),
//     }));

//     // Create the crawl
//     const crawl = await prisma.crawl.create({
//       data: {
//         name,
//         description,
//         creatorId: user.id,
//         cityId,
//         date: new Date(date),
//         startTime: startTimeDate,
//         maxParticipants: maxParticipants || 10,
//         isPublic: true,
//         status: "PLANNING",
//         crawlBars: {
//           create: crawlBarsData,
//         },
//         participants: {
//           create: {
//             userId: user.id,
//           },
//         },
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//         city: true,
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         crawlBars: {
//           include: {
//             bar: true,
//           },
//           orderBy: {
//             orderIndex: "asc",
//           },
//         },
//         _count: {
//           select: {
//             participants: true,
//           },
//         },
//       },
//     });

//     // 🆕 AUTO-CREATE CHATROOM FOR THE CRAWL
//     console.log("🆕 Creating chatroom for crawl:", crawl.id);
//     const chatroom = await prisma.chatroom.create({
//       data: {
//         name: `${name} Chat`,
//         description: `Group chat for ${name}`,
//         crawlId: crawl.id,
//         isGroupChat: true,
//       },
//     });

//     // 🆕 ADD CREATOR AS FIRST PARTICIPANT IN CHATROOM
//     await prisma.chatroomParticipant.create({
//       data: {
//         userId: user.id,
//         chatroomId: chatroom.id,
//         role: "ADMIN",
//       },
//     });

//     // 🆕 UPDATE CRAWL WITH CHATROOM ID
//     const updatedCrawl = await prisma.crawl.update({
//       where: { id: crawl.id },
//       data: { chatroomId: chatroom.id },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//         city: true,
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         crawlBars: {
//           include: {
//             bar: true,
//           },
//           orderBy: {
//             orderIndex: "asc",
//           },
//         },
//         chatroom: {
//           // 🆕 INCLUDE CHATROOM IN RESPONSE
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         _count: {
//           select: {
//             participants: true,
//           },
//         },
//       },
//     });

//     console.log("✅ Chatroom created successfully:", chatroom.id);

//     const responseData = {
//       success: true,
//       crawl: updatedCrawl, // 🆕 USE UPDATED CRAWL WITH CHATROOM
//       redirectTo: `/crawls/${crawl.id}`,
//       message: "Crawl created successfully!",
//     };

//     return NextResponse.json(responseData, { status: 201 });
//   } catch (error) {
//     console.error("Error creating crawl:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

// // PUT /api/crawls - Update a crawl
// export async function PUT(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const {
//       id,
//       name,
//       description,
//       cityId,
//       date,
//       startTime,
//       maxParticipants,
//       isPublic,
//       status,
//     } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Crawl ID is required" },
//         { status: 400 },
//       );
//     }

//     // Verify user owns this crawl
//     const existingCrawl = await prisma.crawl.findFirst({
//       where: {
//         id: id,
//         creatorId: session.user.id, // Only creator can update
//       },
//     });

//     if (!existingCrawl) {
//       return NextResponse.json(
//         { error: "Crawl not found or you don't have permission to edit it" },
//         { status: 404 },
//       );
//     }

//     // Build update data with proper typing
//     const updateData: CrawlUpdateData = {};
//     if (name !== undefined) updateData.name = name;
//     if (description !== undefined) updateData.description = description;
//     if (cityId !== undefined) updateData.cityId = cityId;
//     if (date !== undefined) updateData.date = new Date(date);
//     if (startTime !== undefined) updateData.startTime = new Date(startTime);
//     if (maxParticipants !== undefined)
//       updateData.maxParticipants = maxParticipants;
//     if (isPublic !== undefined) updateData.isPublic = isPublic;
//     if (status !== undefined) updateData.status = status as CrawlStatus;

//     const updatedCrawl = await prisma.crawl.update({
//       where: { id: id },
//       data: updateData,
//       include: {
//         creator: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//         city: true,
//         participants: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true,
//               },
//             },
//           },
//         },
//         crawlBars: {
//           include: {
//             bar: true,
//           },
//           orderBy: {
//             orderIndex: "asc",
//           },
//         },
//         _count: {
//           select: {
//             participants: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         crawl: updatedCrawl,
//         message: "Crawl updated successfully!",
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error updating crawl:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

// // DELETE /api/crawls - Delete a crawl
// export async function DELETE(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Crawl ID is required" },
//         { status: 400 },
//       );
//     }

//     // Verify user owns this crawl
//     const existingCrawl = await prisma.crawl.findFirst({
//       where: {
//         id: id,
//         creatorId: session.user.id, // Only creator can delete
//       },
//     });

//     if (!existingCrawl) {
//       return NextResponse.json(
//         { error: "Crawl not found or you don't have permission to delete it" },
//         { status: 404 },
//       );
//     }

//     // Use transaction to delete related records first
//     await prisma.$transaction([
//       // Delete crawl bars
//       prisma.crawlBar.deleteMany({
//         where: { crawlId: id },
//       }),
//       // Delete participants (note: it's crawlParticipant, not participant)
//       prisma.crawlParticipant.deleteMany({
//         where: { crawlId: id },
//       }),
//       // Delete crawl chat messages
//       prisma.crawlChatMessage.deleteMany({
//         where: { crawlId: id },
//       }),
//       // Delete the crawl
//       prisma.crawl.delete({
//         where: { id: id },
//       }),
//     ]);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Crawl deleted successfully!",
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error deleting crawl:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, CrawlStatus } from "@prisma/client";

// Helper function to calculate distance (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface CrawlUpdateData {
  name?: string;
  description?: string;
  cityId?: string;
  date?: Date;
  startTime?: Date;
  maxParticipants?: number;
  isPublic?: boolean;
  status?: CrawlStatus;
}

// GET /api/crawls
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";
    const session = await getServerSession(authOptions);

    let crawls;

    if (publicOnly) {
      crawls = await prisma.crawl.findMany({
        where: {
          isPublic: true,
          status: {
            in: ["PLANNING", "UPCOMING"],
          },
          date: {
            gte: new Date(),
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          city: {
            select: {
              id: true,
              name: true,
            },
          },
          participants: {
            select: {
              userId: true,
            },
          },
          crawlBars: {
            include: {
              bar: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else if (session) {
      crawls = await prisma.crawl.findMany({
        where: {
          OR: [
            { creatorId: session.user.id },
            { participants: { some: { userId: session.user.id } } },
          ],
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          city: {
            select: {
              id: true,
              name: true,
            },
          },
          participants: {
            select: {
              userId: true,
            },
          },
          crawlBars: {
            include: {
              bar: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(crawls, { status: 200 });
  } catch (error) {
    console.error("Error fetching crawls:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/crawls
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session email:", session.user.email);

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in database, creating new user...");
      try {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || session.user.email.split("@")[0],
            image: session.user.image || null,
            emailVerified: new Date(),
          },
        });
        console.log("Created new user:", user.id);
      } catch (createError) {
        console.error("Error creating user:", createError);
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (!user) {
          return NextResponse.json(
            { error: "Unable to create or find user account" },
            { status: 400 },
          );
        }
      }
    }

    const body = await request.json();
    const {
      name,
      description,
      cityName,
      date,
      startTime,
      maxParticipants,
      barTypes,
      selectedBars,
      userLat,
      userLng,
    } = body;

    // Validate required fields
    if (!name || !cityName || !date || !startTime) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, cityName, date, and time are required",
        },
        { status: 400 },
      );
    }

    // Find city by name to get its ID
    const city = await prisma.city.findFirst({
      where: { name: cityName },
    });

    if (!city) {
      return NextResponse.json(
        { error: `City "${cityName}" not found in database` },
        { status: 400 },
      );
    }

    let crawlBarsData;

    // If user selected specific bars, use those
    if (selectedBars && selectedBars.length > 0) {
      crawlBarsData = selectedBars.map(
        (sb: { barId: string; orderIndex: number }) => ({
          barId: sb.barId,
          orderIndex: sb.orderIndex,
          duration: 60,
        }),
      );
    } else {
      // Auto-select bars based on types
      const whereCondition: Prisma.BarWhereInput = {
        cityName: cityName,
        isActive: true,
      };

      if (barTypes && barTypes.length > 0) {
        whereCondition.type = {
          in: barTypes,
        };
      }

      // Get all matching bars
      const availableBars = await prisma.bar.findMany({
        where: whereCondition,
      });

      if (availableBars.length === 0) {
        return NextResponse.json(
          {
            error: `No bars found in ${cityName} matching your criteria. Try selecting different bar types.`,
          },
          { status: 400 },
        );
      }

      // Use user location or default to city center
      const userLatitude = userLat || 60.1699; // Helsinki center
      const userLongitude = userLng || 24.9384;

      // Calculate distance for each bar
      const barsWithDistance = availableBars.map((bar) => ({
        ...bar,
        distance:
          bar.latitude && bar.longitude
            ? calculateDistance(
                userLatitude,
                userLongitude,
                bar.latitude,
                bar.longitude,
              )
            : Infinity,
      }));

      // Sort by distance (nearest first)
      barsWithDistance.sort((a, b) => a.distance - b.distance);

      // Take top 4 nearest bars
      const nearestBars = barsWithDistance.slice(0, 4);

      crawlBarsData = nearestBars.map((bar, index) => ({
        barId: bar.id,
        orderIndex: index + 1,
        duration: 60,
      }));
    }

    const startTimeDate = new Date(startTime);

    // Create crawl
    const crawl = await prisma.crawl.create({
      data: {
        name,
        description,
        creatorId: user.id,
        cityId: city.id,
        date: new Date(date),
        startTime: startTimeDate,
        maxParticipants: maxParticipants || 10,
        isPublic: true,
        status: "PLANNING",
        crawlBars: {
          create: crawlBarsData,
        },
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        crawlBars: {
          include: {
            bar: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    // Create chatroom
    console.log("Creating chatroom for crawl:", crawl.id);
    const chatroom = await prisma.chatroom.create({
      data: {
        name: `${name} Chat`,
        description: `Group chat for ${name}`,
        crawlId: crawl.id,
        isGroupChat: true,
      },
    });

    // Add creator as first participant
    await prisma.chatroomParticipant.create({
      data: {
        userId: user.id,
        chatroomId: chatroom.id,
        role: "ADMIN",
      },
    });

    // Update crawl with chatroom ID
    const updatedCrawl = await prisma.crawl.update({
      where: { id: crawl.id },
      data: { chatroomId: chatroom.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        crawlBars: {
          include: {
            bar: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        chatroom: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    console.log("Chatroom created successfully:", chatroom.id);

    return NextResponse.json(
      {
        success: true,
        crawl: updatedCrawl,
        redirectTo: `/crawls/${crawl.id}`,
        message: "Crawl created successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/crawls
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      description,
      cityId,
      date,
      startTime,
      maxParticipants,
      isPublic,
      status,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Crawl ID is required" },
        { status: 400 },
      );
    }

    // Verify user owns this crawl
    const existingCrawl = await prisma.crawl.findFirst({
      where: {
        id: id,
        creatorId: session.user.id,
      },
    });

    if (!existingCrawl) {
      return NextResponse.json(
        { error: "Crawl not found or you don't have permission to edit it" },
        { status: 404 },
      );
    }

    // Build update data
    const updateData: CrawlUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (cityId !== undefined) updateData.cityId = cityId;
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (maxParticipants !== undefined)
      updateData.maxParticipants = maxParticipants;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (status !== undefined) updateData.status = status as CrawlStatus;

    const updatedCrawl = await prisma.crawl.update({
      where: { id: id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        city: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        crawlBars: {
          include: {
            bar: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        crawl: updatedCrawl,
        message: "Crawl updated successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/crawls
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Crawl ID is required" },
        { status: 400 },
      );
    }

    // Verify user owns this crawl
    const existingCrawl = await prisma.crawl.findFirst({
      where: {
        id: id,
        creatorId: session.user.id,
      },
    });

    if (!existingCrawl) {
      return NextResponse.json(
        { error: "Crawl not found or you don't have permission to delete it" },
        { status: 404 },
      );
    }

    // Delete related records in transaction
    await prisma.$transaction([
      prisma.crawlBar.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawlParticipant.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawlChatMessage.deleteMany({
        where: { crawlId: id },
      }),
      prisma.crawl.delete({
        where: { id: id },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Crawl deleted successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting crawl:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
