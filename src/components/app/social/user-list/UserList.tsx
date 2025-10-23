"use client";
import { UserSocialProfileWithRelations } from "@/types/social";
import { UserCard, UserInfo, UserName, UserDetails } from "../Social.styles";
import {
  ListContainer,
  ListHeader,
  UserGrid,
  Interests,
  InterestTag,
  HopInButton,
} from "./UserList.styles";
interface UserListProps {
  users: UserSocialProfileWithRelations[];
  onHopIn: (user: UserSocialProfileWithRelations) => void;
  isLoading?: boolean;
}

export default function UserList({
  users,
  onHopIn,
  isLoading = false,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <ListContainer>
        <ListHeader>No active users nearby</ListHeader>
        <p style={{ color: "#94a3b8" }}>
          Be the first to start socializing in your area! Toggle &quot;I&apos;m
          Free&quot; to become visible.
        </p>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>Active Nearby ({users.length})</ListHeader>
      <UserGrid>
        {users.map((user) => (
          <UserCard key={user.id}>
            <UserInfo>
              <UserName>{user.user.name || "Anonymous User"}</UserName>
              <UserDetails>
                {user.vibe || "Social"} • {user.currentBar?.name || "Nearby"} •{" "}
                {user.distance
                  ? `${Math.round(user.distance)}m away`
                  : "Location unknown"}
              </UserDetails>
              {user.interests && user.interests.length > 0 && (
                <Interests>
                  {user.interests
                    .slice(0, 3)
                    .map((interest: string, index: number) => (
                      <InterestTag key={index}>{interest}</InterestTag>
                    ))}
                  {user.interests.length > 3 && (
                    <InterestTag>+{user.interests.length - 3} more</InterestTag>
                  )}
                </Interests>
              )}
            </UserInfo>
            <HopInButton onClick={() => onHopIn(user)} disabled={isLoading}>
              {isLoading ? "..." : "Hop In"}
            </HopInButton>
          </UserCard>
        ))}
      </UserGrid>
    </ListContainer>
  );
}
