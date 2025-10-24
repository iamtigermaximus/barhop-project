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

    console.log("🚨 STARTING SAVE FOR USER:", session.user.id);
    console.log("📥 DATA:", { bio, vibe, interests });

    try {
      // First, delete any existing profile
      await prisma.userSocialProfile.deleteMany({
        where: { userId: session.user.id },
      });

      console.log("✅ DELETED EXISTING PROFILE");

      // FIX: Properly handle the enum value
      const vibeValue =
        vibe && Object.values(SocialVibe).includes(vibe as SocialVibe)
          ? (vibe as SocialVibe)
          : SocialVibe.CASUAL; // Use the enum value, not string

      console.log("🎭 PROCESSED VIBE:", vibeValue);

      // Then create fresh with ALL data
      const result = await prisma.userSocialProfile.create({
        data: {
          userId: session.user.id,
          bio: bio || "",
          vibe: vibeValue, // Use the properly typed enum value
          interests: Array.isArray(interests) ? interests : [],
          isSocialMode: false,
          socialStatus: "OFFLINE",
          isVisibleOnMap: true,
          maxDistance: 1000,
        },
      });

      console.log("💾 CREATED NEW PROFILE:", result);

      // Verify with fresh query
      const verify = await prisma.userSocialProfile.findUnique({
        where: { userId: session.user.id },
      });

      console.log("🔍 VERIFICATION:", verify);

      return NextResponse.json({
        success: true,
        socialProfile: verify,
        message: "Profile saved successfully",
      });
    } catch (dbError) {
      console.error("❌ DATABASE ERROR:", dbError);
      // Add more specific error logging
      if (dbError instanceof Error) {
        console.error("❌ Error name:", dbError.name);
        console.error("❌ Error message:", dbError.message);
      }
      throw dbError;
    }
  } catch (error) {
    console.error("💥 FINAL ERROR:", error);
    return NextResponse.json(
      { message: "Failed to save profile" },
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

    const profile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
    });

    console.log("📤 SENDING PROFILE TO CLIENT:", profile);

    return NextResponse.json({
      socialProfile: profile,
      hasProfile: !!profile,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
