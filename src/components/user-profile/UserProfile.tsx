"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { SocialVibe } from "@prisma/client";
import { UserSocialProfileWithRelations } from "@/types/social";

const ProfileContainer = styled.div`
  padding: 2rem 1rem;
  background: #0f172a;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProfileGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const ProfileCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  padding: 2rem;
`;

const UserInfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #f8fafc;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
`;

const UserName = styled.h3`
  color: #f8fafc;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #94a3b8;
  text-align: center;
  margin-bottom: 1rem;
`;

const SocialProfileSection = styled.div``;

const ProfileField = styled.div`
  margin-bottom: 1rem;
`;

const FieldLabel = styled.label`
  color: #f8fafc;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
`;

const FieldValue = styled.div`
  color: #e2e8f0;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.2);
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InterestTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
`;

const EditButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
`;

// Vibe display component
const VibeDisplay = styled.div<{ vibe: SocialVibe }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${(props) => {
    switch (props.vibe) {
      case "CHILL":
        return "rgba(14, 165, 233, 0.2)";
      case "PARTY":
        return "rgba(236, 72, 153, 0.2)";
      case "NETWORKING":
        return "rgba(16, 185, 129, 0.2)";
      case "ADVENTUROUS":
        return "rgba(245, 158, 11, 0.2)";
      default:
        return "rgba(139, 92, 246, 0.2)";
    }
  }};
  color: ${(props) => {
    switch (props.vibe) {
      case "CHILL":
        return "#0ea5e9";
      case "PARTY":
        return "#ec4899";
      case "NETWORKING":
        return "#10b981";
      case "ADVENTUROUS":
        return "#f59e0b";
      default:
        return "#8b5cf6";
    }
  }};
  font-weight: 600;
`;

const vibeEmojis = {
  CHILL: "😌",
  PARTY: "🎉",
  NETWORKING: "💼",
  ADVENTUROUS: "🌍",
  CASUAL: "☕",
};

export default function UserProfile() {
  const { data: session } = useSession();
  const [socialProfile, setSocialProfile] =
    useState<UserSocialProfileWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSocialProfile();
  }, []);

  const fetchSocialProfile = async () => {
    try {
      console.log("📥 Fetching social profile...");
      const response = await fetch("/api/social/profile");

      console.log("📨 Profile API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Profile data received:", data);
        console.log("📊 Social profile object:", data.socialProfile);
        console.log("🎭 Has profile:", data.hasProfile);

        setSocialProfile(data.socialProfile);
      } else {
        console.error("❌ Profile API error:", response.status);
        const errorText = await response.text();
        console.error("❌ Error details:", errorText);
      }
    } catch (error) {
      console.error("💥 Error fetching social profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to social page to edit profile
    window.location.href = "/social";
  };

  if (!session) {
    return (
      <ProfileContainer>
        <EmptyState>Please sign in to view your profile</EmptyState>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Your Profile</Title>
      </ProfileHeader>

      <ProfileGrid>
        {/* Basic User Info */}
        <ProfileCard>
          <UserInfoSection>
            <SectionTitle>Basic Info</SectionTitle>
            <UserAvatar>
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </UserAvatar>
            <UserName>{session.user?.name || "User"}</UserName>
            <UserEmail>{session.user?.email}</UserEmail>
          </UserInfoSection>

          <EditButton onClick={handleEditProfile}>
            Edit Social Profile
          </EditButton>
        </ProfileCard>

        {/* Social Profile Info */}
        <ProfileCard>
          <SocialProfileSection>
            <SectionTitle>Social Profile</SectionTitle>

            {isLoading ? (
              <EmptyState>Loading...</EmptyState>
            ) : !socialProfile ? (
              <EmptyState>
                <p>You haven&apos;t set up your social profile yet.</p>
                <EditButton onClick={handleEditProfile}>
                  Set Up Social Profile
                </EditButton>
              </EmptyState>
            ) : (
              <>
                <ProfileField>
                  <FieldLabel>Vibe</FieldLabel>
                  <FieldValue>
                    <VibeDisplay vibe={socialProfile.vibe || SocialVibe.CASUAL}>
                      {vibeEmojis[socialProfile.vibe || SocialVibe.CASUAL]}
                      {socialProfile.vibe || "Not set"}
                    </VibeDisplay>
                  </FieldValue>
                </ProfileField>

                <ProfileField>
                  <FieldLabel>Bio</FieldLabel>
                  <FieldValue>{socialProfile.bio || "No bio yet"}</FieldValue>
                </ProfileField>

                <ProfileField>
                  <FieldLabel>Interests</FieldLabel>
                  <FieldValue>
                    {socialProfile.interests &&
                    socialProfile.interests.length > 0 ? (
                      <InterestsList>
                        {socialProfile.interests.map((interest, index) => (
                          <InterestTag key={index}>{interest}</InterestTag>
                        ))}
                      </InterestsList>
                    ) : (
                      "No interests yet"
                    )}
                  </FieldValue>
                </ProfileField>

                <ProfileField>
                  <FieldLabel>Social Status</FieldLabel>
                  <FieldValue>
                    {socialProfile.isSocialMode
                      ? "🟢 Active in Social Mode"
                      : "⚪ Offline"}
                  </FieldValue>
                </ProfileField>
              </>
            )}
          </SocialProfileSection>
        </ProfileCard>
      </ProfileGrid>
    </ProfileContainer>
  );
}
