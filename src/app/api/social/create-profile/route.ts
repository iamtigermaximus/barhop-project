import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SocialVibe, SocialStatus } from "@prisma/client";

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

    console.log("🚀 CREATING NEW SOCIAL PROFILE FOR USER:", session.user.id);
    console.log("📥 INCOMING DATA:", { bio, vibe, interests });

    // Validate and set defaults
    const validVibes = Object.values(SocialVibe);
    const finalVibe = validVibes.includes(vibe) ? vibe : SocialVibe.CASUAL;
    const finalInterests = Array.isArray(interests) ? interests : [];
    const finalBio = bio || "";

    console.log("✅ FINAL DATA FOR CREATION:", {
      finalBio,
      finalVibe,
      finalInterests,
    });

    // Check if profile already exists
    const existingProfile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      console.log("⚠️ Profile already exists, updating instead");
      // Update existing profile
      const updatedProfile = await prisma.userSocialProfile.update({
        where: { userId: session.user.id },
        data: {
          bio: finalBio,
          vibe: finalVibe,
          interests: finalInterests,
          updatedAt: new Date(),
        },
      });

      console.log("💾 UPDATED PROFILE:", {
        id: updatedProfile.id,
        bio: updatedProfile.bio,
        vibe: updatedProfile.vibe,
        interests: updatedProfile.interests,
      });

      return NextResponse.json({
        success: true,
        socialProfile: updatedProfile,
        message: "Profile updated successfully",
        action: "updated",
      });
    }

    // Create new profile
    const newProfile = await prisma.userSocialProfile.create({
      data: {
        userId: session.user.id,
        bio: finalBio,
        vibe: finalVibe,
        interests: finalInterests,
        isSocialMode: false,
        socialStatus: SocialStatus.OFFLINE,
        isVisibleOnMap: true,
        maxDistance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("💾 CREATED NEW PROFILE:", {
      id: newProfile.id,
      bio: newProfile.bio,
      vibe: newProfile.vibe,
      interests: newProfile.interests,
    });

    // Verify the creation
    const verifiedProfile = await prisma.userSocialProfile.findUnique({
      where: { userId: session.user.id },
    });

    console.log("🔍 VERIFIED PROFILE AFTER CREATION:", verifiedProfile);

    return NextResponse.json({
      success: true,
      socialProfile: newProfile,
      message: "Social profile created successfully",
      action: "created",
    });
  } catch (error) {
    console.error("❌ ERROR CREATING PROFILE:", error);
    return NextResponse.json(
      {
        message: "Failed to create social profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
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

    return NextResponse.json({
      hasProfile: !!profile,
      profile: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
