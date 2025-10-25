"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SocialVibe } from "@prisma/client";
import { UserSocialProfileWithRelations } from "@/types/social";
import {
  FaCrown,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaPlus,
  FaCompass,
  FaUser,
} from "react-icons/fa";

const ProfileContainer = styled.div`
  padding: 2rem 1rem;
  background: #0f172a;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 80px; /* Space for mobile nav */
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
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

const SectionTitle = styled.h4`
  color: #f8fafc;
  margin-bottom: 1rem;
  font-size: 1rem;
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

const SocialProfileSection = styled.div`
  margin-bottom: 2rem;
`;

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

// Mobile Navigation
const MobileNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 1000;
`;

const MobileNavItem = styled.a<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => (props.$isActive ? "#8b5cf6" : "#94a3b8")};
  text-decoration: none;
  font-size: 0.75rem;
  cursor: pointer;
`;

const MobileNavIcon = styled.div`
  font-size: 1.25rem;
`;

const MobileNavLabel = styled.span`
  font-size: 0.7rem;
`;

// Profile Action Buttons for Mobile
const ProfileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
`;

const ProfileActionButton = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.4);
  }

  ${(props) =>
    props.$color === "danger" &&
    `
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.2);
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.4);
    }
  `}
`;

const ActionIcon = styled.div`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const router = useRouter();
  const [socialProfile, setSocialProfile] =
    useState<UserSocialProfileWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchSocialProfile();
  }, []);

  const fetchSocialProfile = async () => {
    try {
      const response = await fetch("/api/social/profile");
      if (response.ok) {
        const data = await response.json();
        setSocialProfile(data.socialProfile);
      }
    } catch (error) {
      console.error("Error fetching social profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push("/app/social?edit=true");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/app" });
  };

  // Mobile navigation items
  const mobileNavigation = [
    { name: "Home", href: "/app", icon: FaHome },
    { name: "My Crawls", href: "/app/my-crawls", icon: FaUsers },
    { name: "Create", href: "/app/crawl-planner", icon: FaPlus },
    { name: "Discover", href: "/app/crawls-dashboard", icon: FaCompass },
    {
      name: "Profile",
      href: "/app/user-profile",
      icon: FaUser,
      isActive: true,
    },
  ];

  // Profile action buttons
  const profileActions = [
    {
      name: "My VIP Passes",
      icon: FaCrown,
      action: () => handleNavigation("/app/vip/wallet"),
    },
    {
      name: "My Crawls",
      icon: FaUsers,
      action: () => handleNavigation("/app/my-crawls"),
    },
    {
      name: "Settings",
      icon: FaCog,
      action: () => handleNavigation("/app/settings"),
    },
    {
      name: "Logout",
      icon: FaSignOutAlt,
      action: handleLogout,
      color: "danger",
    },
  ];

  if (!session) {
    return (
      <ProfileContainer>
        <EmptyState>Please sign in to view your profile</EmptyState>
      </ProfileContainer>
    );
  }

  return (
    <>
      <ProfileContainer>
        <ProfileHeader>
          <Title>Your Profile</Title>
        </ProfileHeader>

        <ProfileGrid>
          {/* Left Column - Basic Info & Social Profile */}
          <ProfileCard>
            <UserInfoSection>
              {/* <SectionTitle>Basic Info</SectionTitle> */}
              <UserAvatar>
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </UserAvatar>
              <UserName>{session.user?.name || "User"}</UserName>
              <UserEmail>{session.user?.email}</UserEmail>
            </UserInfoSection>

            {/* Social Profile Section - Moved to top after basic info */}
            <SocialProfileSection>
              {/* <SectionTitle>Social Profile</SectionTitle> */}

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
                      {socialProfile.vibe ? (
                        <VibeDisplay vibe={socialProfile.vibe}>
                          {vibeEmojis[socialProfile.vibe]}
                          {socialProfile.vibe}
                        </VibeDisplay>
                      ) : (
                        "Not set"
                      )}
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
                  {/* Edit Button - Always visible */}
                  <EditButton onClick={handleEditProfile}>
                    Edit Social Profile
                  </EditButton>
                </>
              )}
            </SocialProfileSection>

            {/* Profile Actions - At the bottom, only on mobile */}
            {isMobile && (
              <ProfileActions>
                {profileActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <ProfileActionButton
                      key={action.name}
                      onClick={action.action}
                      $color={action.color}
                    >
                      <ActionIcon>
                        <IconComponent size={16} />
                      </ActionIcon>
                      {action.name}
                    </ProfileActionButton>
                  );
                })}
              </ProfileActions>
            )}
          </ProfileCard>

          {/* Right Column - Empty for now, can be used for additional content */}
          <ProfileCard>
            <SectionTitle>Activity & Stats</SectionTitle>
            <EmptyState>
              <p>Your activity and statistics will appear here.</p>
              <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                Join crawls, create events, and interact with the community to
                see your stats!
              </p>
            </EmptyState>
          </ProfileCard>
        </ProfileGrid>
      </ProfileContainer>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNav>
          {mobileNavigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <MobileNavItem
                key={item.name}
                href={item.href}
                $isActive={item.isActive || false}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
              >
                <MobileNavIcon>
                  <IconComponent size={18} />
                </MobileNavIcon>
                <MobileNavLabel>{item.name}</MobileNavLabel>
              </MobileNavItem>
            );
          })}
        </MobileNav>
      )}
    </>
  );
}
