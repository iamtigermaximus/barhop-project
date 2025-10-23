"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SocialVibe } from "@prisma/client";
import { Title, Subtitle } from "../Social.styles";
import {
  CreateContainer,
  Header,
  ErrorMessage,
  SuccessMessage,
  Form,
  FormGroup,
  Label,
  TextArea,
  VibeGrid,
  VibeButton,
  InterestInput,
  Input,
  AddButton,
  InterestsList,
  InterestTag,
  RemoveButton,
  ButtonGroup,
  SecondaryButton,
  PrimaryButton,
} from "./CreateSocialProfile.styles";

// Helper function to get vibe colors
export function getVibeColor(vibe: SocialVibe): string {
  const colors = {
    CHILL: "#0ea5e9",
    PARTY: "#ec4899",
    NETWORKING: "#10b981",
    ADVENTUROUS: "#f59e0b",
    CASUAL: "#8b5cf6",
  };
  return colors[vibe];
}

const vibeOptions = [
  {
    value: SocialVibe.CHILL,
    label: "😌 Chill",
    description: "Relaxed vibes only",
  },
  {
    value: SocialVibe.PARTY,
    label: "🎉 Party",
    description: "Energy and excitement",
  },
  {
    value: SocialVibe.NETWORKING,
    label: "💼 Networking",
    description: "Professional connections",
  },
  {
    value: SocialVibe.ADVENTUROUS,
    label: "🌍 Adventurous",
    description: "Try new things",
  },
  {
    value: SocialVibe.CASUAL,
    label: "☕ Casual",
    description: "Easygoing and friendly",
  },
];

export const popularInterests = [
  "Craft Beer",
  "Cocktails",
  "Live Music",
  "Dancing",
  "Board Games",
  "Sports",
  "Wine",
  "Whiskey",
  "Networking",
  "Travel",
  "Art",
  "Food",
  "Technology",
  "Business",
  "Socializing",
];

const CreateSocialProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<SocialVibe | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests((prev) => [...prev, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests((prev) =>
      prev.filter((interest) => interest !== interestToRemove)
    );
  };

  const addPopularInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests((prev) => [...prev, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVibe) {
      setError("Please select a vibe before creating your profile");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("🟢 SUBMITTING PROFILE CREATION:", {
        bio,
        vibe: selectedVibe,
        interests,
      });

      const response = await fetch("/api/social/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          vibe: selectedVibe,
          interests,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create profile");
      }

      console.log("✅ PROFILE CREATION SUCCESS:", result);

      setSuccess(result.message || "Profile created successfully!");

      // Redirect to social page after successful creation
      setTimeout(() => {
        router.push("/social");
      }, 2000);
    } catch (err) {
      console.error("❌ PROFILE CREATION ERROR:", err);
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (status === "loading") {
    return (
      <CreateContainer>
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Loading...
        </div>
      </CreateContainer>
    );
  }

  if (!session) {
    return (
      <CreateContainer>
        <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
          Please sign in to create a social profile
        </div>
      </CreateContainer>
    );
  }

  return (
    <CreateContainer>
      <Header>
        <Title>Create Social Profile</Title>
        <Subtitle>
          Set up your social profile to start connecting with people nearby.
          Share your vibe and interests to find like-minded people.
        </Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Bio (Optional)</Label>
          <TextArea
            placeholder="Tell others about yourself... What do you enjoy? What brings you out tonight?"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
          />
          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "right",
            }}
          >
            {bio.length}/200
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Your Vibe *</Label>
          <VibeGrid>
            {vibeOptions.map((vibe) => (
              <VibeButton
                key={vibe.value}
                type="button"
                $selected={selectedVibe === vibe.value}
                $vibe={vibe.value}
                onClick={() => setSelectedVibe(vibe.value)}
              >
                <div style={{ fontWeight: "600" }}>{vibe.label}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                  {vibe.description}
                </div>
              </VibeButton>
            ))}
          </VibeGrid>
        </FormGroup>

        <FormGroup>
          <Label>Interests</Label>
          <InterestInput>
            <Input
              type="text"
              placeholder="Add an interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />
            <AddButton type="button" onClick={addInterest}>
              Add
            </AddButton>
          </InterestInput>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginTop: "0.5rem",
            }}
          >
            Popular:{" "}
            {popularInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => addPopularInterest(interest)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#8b5cf6",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  margin: "0 0.25rem",
                  textDecoration: "underline",
                }}
              >
                {interest}
              </button>
            ))}
          </div>

          {interests.length > 0 && (
            <InterestsList>
              {interests.map((interest) => (
                <InterestTag key={interest}>
                  {interest}
                  <RemoveButton
                    type="button"
                    onClick={() => removeInterest(interest)}
                    title="Remove interest"
                  >
                    ×
                  </RemoveButton>
                </InterestTag>
              ))}
            </InterestsList>
          )}
        </FormGroup>

        <ButtonGroup>
          <SecondaryButton
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={!selectedVibe || isLoading}>
            {isLoading ? "Creating Profile..." : "Create Social Profile"}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </CreateContainer>
  );
};
export default CreateSocialProfile;
