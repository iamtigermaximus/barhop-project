"use client";
import { UserSocialProfileWithRelations } from "@/types/social";
import styled from "styled-components";

const ListContainer = styled.div`
  margin-top: 2rem;
`;

const ListHeader = styled.h3`
  color: #f8fafc;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const UserGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  color: #f8fafc;
  margin: 0;
  font-size: 1.125rem;
`;

const UserDetails = styled.p`
  color: #0ea5e9;
  margin: 0.25rem 0;
  font-size: 0.875rem;
`;

const Interests = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const InterestTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const HopInButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

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
