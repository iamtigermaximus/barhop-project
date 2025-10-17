// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { SocialVibe } from "@prisma/client";

// interface ProfileUpdateRequest {
//   bio?: string;
//   vibe?: SocialVibe;
//   interests?: string[];
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

//     const socialProfile = await prisma.userSocialProfile.findUnique({
//       where: { userId: session.user.id },
//     });

//     return NextResponse.json({
//       socialProfile,
//       hasProfile: !!socialProfile,
//     });
//   } catch (error) {
//     console.error("Error fetching social profile:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { message: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const body: ProfileUpdateRequest = await request.json();
//     const { bio, vibe, interests } = body;

//     const socialProfile = await prisma.userSocialProfile.upsert({
//       where: { userId: session.user.id },
//       update: {
//         bio: bio || "",
//         vibe: vibe || SocialVibe.CASUAL,
//         interests: interests || [],
//       },
//       create: {
//         userId: session.user.id,
//         bio: bio || "",
//         vibe: vibe || SocialVibe.CASUAL,
//         interests: interests || [],
//         isSocialMode: false,
//         socialStatus: "OFFLINE",
//         isVisibleOnMap: true,
//         maxDistance: 1000,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       socialProfile,
//       message: "Profile updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating social profile:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SocialVibe } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bio, vibe, interests } = body;

    console.log("📥 RAW REQUEST BODY:", JSON.stringify(body, null, 2));
    console.log("🔍 PARSED FIELDS:", {
      bio: bio || "empty",
      vibe: vibe || "empty",
      interests: interests || "empty",
      interestsIsArray: Array.isArray(interests),
    });

    // Validate vibe
    const validVibes = Object.values(SocialVibe);
    const finalVibe = validVibes.includes(vibe) ? vibe : SocialVibe.CASUAL;

    // Validate interests
    const finalInterests = Array.isArray(interests) ? interests : [];

    console.log("✅ FINAL VALUES FOR DB:", {
      bio: bio || "",
      vibe: finalVibe,
      interests: finalInterests,
    });

    // SAVE TO DATABASE
    const socialProfile = await prisma.userSocialProfile.upsert({
      where: { userId: session.user.id },
      update: {
        bio: bio || "",
        vibe: finalVibe,
        interests: finalInterests,
      },
      create: {
        userId: session.user.id,
        bio: bio || "",
        vibe: finalVibe,
        interests: finalInterests,
        isSocialMode: false,
        socialStatus: "OFFLINE",
        isVisibleOnMap: true,
        maxDistance: 1000,
      },
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
    });

    console.log("💾 PROFILE SAVED TO DB:", {
      id: socialProfile.id,
      userId: socialProfile.userId,
      bio: socialProfile.bio,
      vibe: socialProfile.vibe,
      interests: socialProfile.interests,
    });

    return NextResponse.json({
      success: true,
      socialProfile,
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("❌ DATABASE ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const socialProfile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
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
    });

    console.log("📥 FETCHED PROFILE:", {
      hasProfile: !!socialProfile,
      bio: socialProfile?.bio,
      vibe: socialProfile?.vibe,
      interests: socialProfile?.interests,
    });

    return NextResponse.json({
      socialProfile,
      hasProfile: !!socialProfile,
    });
  } catch (error) {
    console.error("Error fetching social profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
