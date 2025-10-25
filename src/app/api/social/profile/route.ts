// // import { NextRequest, NextResponse } from "next/server";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// // import { prisma } from "@/lib/prisma";
// // import { SocialVibe } from "@prisma/client";

// // interface ProfileUpdateRequest {
// //   bio?: string;
// //   vibe?: SocialVibe;
// //   interests?: string[];
// // }

// // export async function GET(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);

// //     if (!session?.user?.id) {
// //       return NextResponse.json(
// //         { message: "Authentication required" },
// //         { status: 401 }
// //       );
// //     }

// //     const socialProfile = await prisma.userSocialProfile.findUnique({
// //       where: { userId: session.user.id },
// //     });

// //     return NextResponse.json({
// //       socialProfile,
// //       hasProfile: !!socialProfile,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching social profile:", error);
// //     return NextResponse.json(
// //       { message: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);

// //     if (!session?.user?.id) {
// //       return NextResponse.json(
// //         { message: "Authentication required" },
// //         { status: 401 }
// //       );
// //     }

// //     const body: ProfileUpdateRequest = await request.json();
// //     const { bio, vibe, interests } = body;

// //     const socialProfile = await prisma.userSocialProfile.upsert({
// //       where: { userId: session.user.id },
// //       update: {
// //         bio: bio || "",
// //         vibe: vibe || SocialVibe.CASUAL,
// //         interests: interests || [],
// //       },
// //       create: {
// //         userId: session.user.id,
// //         bio: bio || "",
// //         vibe: vibe || SocialVibe.CASUAL,
// //         interests: interests || [],
// //         isSocialMode: false,
// //         socialStatus: "OFFLINE",
// //         isVisibleOnMap: true,
// //         maxDistance: 1000,
// //       },
// //     });

// //     return NextResponse.json({
// //       success: true,
// //       socialProfile,
// //       message: "Profile updated successfully",
// //     });
// //   } catch (error) {
// //     console.error("Error updating social profile:", error);
// //     return NextResponse.json(
// //       { message: "Internal server error" },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { SocialVibe } from "@prisma/client";

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
//     const { bio, vibe, interests } = body;

//     console.log("🚨 STARTING SAVE FOR USER:", session.user.id);
//     console.log("📥 DATA:", { bio, vibe, interests });

//     try {
//       // First, delete any existing profile
//       await prisma.userSocialProfile.deleteMany({
//         where: { userId: session.user.id },
//       });

//       console.log("✅ DELETED EXISTING PROFILE");

//       // FIX: Properly handle the enum value
//       const vibeValue =
//         vibe && Object.values(SocialVibe).includes(vibe as SocialVibe)
//           ? (vibe as SocialVibe)
//           : SocialVibe.CASUAL; // Use the enum value, not string

//       console.log("🎭 PROCESSED VIBE:", vibeValue);

//       // Then create fresh with ALL data
//       const result = await prisma.userSocialProfile.create({
//         data: {
//           userId: session.user.id,
//           bio: bio || "",
//           vibe: vibeValue, // Use the properly typed enum value
//           interests: Array.isArray(interests) ? interests : [],
//           isSocialMode: false,
//           socialStatus: "OFFLINE",
//           isVisibleOnMap: true,
//           maxDistance: 1000,
//         },
//       });

//       console.log("💾 CREATED NEW PROFILE:", result);

//       // Verify with fresh query
//       const verify = await prisma.userSocialProfile.findUnique({
//         where: { userId: session.user.id },
//       });

//       console.log("🔍 VERIFICATION:", verify);

//       return NextResponse.json({
//         success: true,
//         socialProfile: verify,
//         message: "Profile saved successfully",
//       });
//     } catch (dbError) {
//       console.error("❌ DATABASE ERROR:", dbError);
//       // Add more specific error logging
//       if (dbError instanceof Error) {
//         console.error("❌ Error name:", dbError.name);
//         console.error("❌ Error message:", dbError.message);
//       }
//       throw dbError;
//     }
//   } catch (error) {
//     console.error("💥 FINAL ERROR:", error);
//     return NextResponse.json(
//       { message: "Failed to save profile" },
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

//     const profile = await prisma.userSocialProfile.findUnique({
//       where: { userId: session.user.id },
//     });

//     console.log("📤 SENDING PROFILE TO CLIENT:", profile);

//     return NextResponse.json({
//       socialProfile: profile,
//       hasProfile: !!profile,
//     });
//   } catch (error) {
//     console.error("Error:", error);
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

interface ProfileUpdateRequest {
  bio?: string;
  vibe?: SocialVibe;
  interests?: string[];
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
            name: true,
            email: true,
            image: true,
          },
        },
      },
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body: ProfileUpdateRequest = await request.json();
    const { bio, vibe, interests } = body;

    console.log("📥 CREATE PROFILE DATA:", { bio, vibe, interests });

    // Check if profile already exists
    const existingProfile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { message: "Profile already exists. Use PUT to update." },
        { status: 400 }
      );
    }

    // Handle vibe enum conversion
    const vibeValue =
      vibe && Object.values(SocialVibe).includes(vibe)
        ? vibe
        : SocialVibe.CASUAL;

    const socialProfile = await prisma.userSocialProfile.create({
      data: {
        userId: session.user.id,
        bio: bio || "",
        vibe: vibeValue,
        interests: Array.isArray(interests) ? interests : [],
        isSocialMode: false,
        socialStatus: "OFFLINE",
        isVisibleOnMap: true,
        maxDistance: 1000,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log("✅ PROFILE CREATED:", socialProfile);

    return NextResponse.json({
      success: true,
      socialProfile,
      message: "Profile created successfully",
    });
  } catch (error) {
    console.error("❌ CREATE PROFILE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// NEW: Add PUT method for updates
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body: ProfileUpdateRequest = await request.json();
    const { bio, vibe, interests } = body;

    console.log("📥 UPDATE PROFILE DATA:", { bio, vibe, interests });

    // Check if profile exists
    const existingProfile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Profile not found. Use POST to create." },
        { status: 404 }
      );
    }

    // Handle vibe enum conversion
    const vibeValue =
      vibe && Object.values(SocialVibe).includes(vibe)
        ? vibe
        : existingProfile.vibe;

    const updatedProfile = await prisma.userSocialProfile.update({
      where: { userId: session.user.id },
      data: {
        bio: bio !== undefined ? bio : existingProfile.bio,
        vibe: vibeValue,
        interests: Array.isArray(interests)
          ? interests
          : existingProfile.interests,
        // PRESERVE existing social mode status
        isSocialMode: existingProfile.isSocialMode,
        // Also preserve location data
        locationLat: existingProfile.locationLat,
        locationLng: existingProfile.locationLng,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log("✅ PROFILE UPDATED:", updatedProfile);

    return NextResponse.json({
      success: true,
      socialProfile: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
// Optional: Add DELETE method
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    await prisma.userSocialProfile.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { message: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
