// "use client";
// import { useState } from "react";
// import styled from "styled-components";
// import { SocialVibe } from "@prisma/client";

// const SetupContainer = styled.div`
//   background: rgba(30, 41, 59, 0.8);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   padding: 2rem;
//   margin: 2rem 0;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const Title = styled.h2`
//   color: #f8fafc;
//   margin-bottom: 1rem;
//   text-align: center;
// `;

// const Description = styled.p`
//   color: #e2e8f0;
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;
// `;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const Label = styled.label`
//   color: #f8fafc;
//   font-weight: 600;
//   font-size: 0.875rem;
// `;

// const TextArea = styled.textarea`
//   background: rgba(15, 23, 42, 0.6);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   padding: 0.75rem;
//   color: #e2e8f0;
//   font-size: 0.875rem;
//   resize: vertical;
//   min-height: 80px;

//   &:focus {
//     outline: none;
//     border-color: #8b5cf6;
//   }
// `;

// const VibeGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//   gap: 0.75rem;
//   margin-top: 0.5rem;
// `;

// const VibeButton = styled.button<{ $selected: boolean; $vibe: SocialVibe }>`
//   padding: 0.75rem;
//   border: 1px solid
//     ${(props) =>
//       props.$selected ? getVibeColor(props.$vibe) : "rgba(139, 92, 246, 0.3)"};
//   border-radius: 8px;
//   background: ${(props) =>
//     props.$selected
//       ? `${getVibeColor(props.$vibe)}20`
//       : "rgba(15, 23, 42, 0.6)"};
//   color: ${(props) =>
//     props.$selected ? getVibeColor(props.$vibe) : "#e2e8f0"};
//   cursor: pointer;
//   transition: all 0.3s ease;
//   font-size: 0.875rem;

//   &:hover {
//     border-color: ${(props) => getVibeColor(props.$vibe)};
//     background: ${(props) => `${getVibeColor(props.$vibe)}20`};
//   }
// `;

// const InterestInput = styled.div`
//   display: flex;
//   gap: 0.5rem;
// `;

// const Input = styled.input`
//   background: rgba(15, 23, 42, 0.6);
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   padding: 0.75rem;
//   color: #e2e8f0;
//   font-size: 0.875rem;
//   flex: 1;

//   &:focus {
//     outline: none;
//     border-color: #8b5cf6;
//   }
// `;

// const AddButton = styled.button`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   border: none;
//   border-radius: 8px;
//   padding: 0.75rem 1rem;
//   color: white;
//   cursor: pointer;
//   font-weight: 600;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-1px);
//     box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
//   }
// `;

// const InterestsList = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.5rem;
//   margin-top: 0.5rem;
// `;

// const InterestTag = styled.span`
//   background: rgba(139, 92, 246, 0.2);
//   color: #8b5cf6;
//   padding: 0.4rem 0.75rem;
//   border-radius: 20px;
//   font-size: 0.75rem;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const RemoveButton = styled.button`
//   background: none;
//   border: none;
//   color: #ef4444;
//   cursor: pointer;
//   padding: 0;
//   font-size: 0.875rem;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: flex-end;
//   margin-top: 1rem;
// `;

// const PrimaryButton = styled.button`
//   background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
//   border: none;
//   border-radius: 8px;
//   padding: 0.75rem 1.5rem;
//   color: white;
//   cursor: pointer;
//   font-weight: 600;
//   transition: all 0.3s ease;

//   &:hover:not(:disabled) {
//     transform: translateY(-1px);
//     box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
//   }

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// const SecondaryButton = styled.button`
//   background: transparent;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   border-radius: 8px;
//   padding: 0.75rem 1.5rem;
//   color: #e2e8f0;
//   cursor: pointer;
//   font-weight: 600;
//   transition: all 0.3s ease;

//   &:hover {
//     background: rgba(139, 92, 246, 0.1);
//     border-color: #8b5cf6;
//   }
// `;

// // Helper function to get vibe colors
// function getVibeColor(vibe: SocialVibe): string {
//   const colors = {
//     CHILL: "#0ea5e9",
//     PARTY: "#ec4899",
//     NETWORKING: "#10b981",
//     ADVENTUROUS: "#f59e0b",
//     CASUAL: "#8b5cf6",
//   };
//   return colors[vibe];
// }

// interface SetupSocialProfileProps {
//   onComplete: (profileData: {
//     bio: string;
//     vibe: SocialVibe;
//     interests: string[];
//   }) => void;
//   onSkip: () => void;
//   isLoading?: boolean;
// }

// const vibeOptions = [
//   {
//     value: SocialVibe.CHILL,
//     label: "😌 Chill",
//     description: "Relaxed vibes only",
//   },
//   {
//     value: SocialVibe.PARTY,
//     label: "🎉 Party",
//     description: "Energy and excitement",
//   },
//   {
//     value: SocialVibe.NETWORKING,
//     label: "💼 Networking",
//     description: "Professional connections",
//   },
//   {
//     value: SocialVibe.ADVENTUROUS,
//     label: "🌍 Adventurous",
//     description: "Try new things",
//   },
//   {
//     value: SocialVibe.CASUAL,
//     label: "☕ Casual",
//     description: "Easygoing and friendly",
//   },
// ];

// const popularInterests = [
//   "Craft Beer",
//   "Cocktails",
//   "Live Music",
//   "Dancing",
//   "Board Games",
//   "Sports",
//   "Wine",
//   "Whiskey",
//   "Networking",
//   "Travel",
//   "Art",
//   "Food",
//   "Technology",
//   "Business",
//   "Socializing",
// ];

// export default function SetupSocialProfile({
//   onComplete,
//   onSkip,
//   isLoading = false,
// }: SetupSocialProfileProps) {
//   const [bio, setBio] = useState("");
//   const [selectedVibe, setSelectedVibe] = useState<SocialVibe | null>(null);
//   const [interests, setInterests] = useState<string[]>([]);
//   const [newInterest, setNewInterest] = useState("");

//   const addInterest = () => {
//     if (newInterest.trim() && !interests.includes(newInterest.trim())) {
//       setInterests((prev) => [...prev, newInterest.trim()]);
//       setNewInterest("");
//     }
//   };

//   const removeInterest = (interestToRemove: string) => {
//     setInterests((prev) =>
//       prev.filter((interest) => interest !== interestToRemove)
//     );
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("🟢 FORM SUBMITTED!");
//     console.log("📊 FORM DATA:", {
//       bio,
//       selectedVibe,
//       interests,
//       hasSelectedVibe: !!selectedVibe,
//       interestsCount: interests.length,
//     });

//     if (selectedVibe) {
//       console.log("🚀 CALLING onComplete...");
//       onComplete({
//         bio,
//         vibe: selectedVibe,
//         interests,
//       });
//       console.log("✅ onComplete CALLED!");
//     } else {
//       console.log("🔴 NO VIBE SELECTED - CANNOT SUBMIT");
//     }
//   };

//   const addPopularInterest = (interest: string) => {
//     if (!interests.includes(interest)) {
//       setInterests((prev) => [...prev, interest]);
//     }
//   };

//   return (
//     <SetupContainer>
//       <Title>Set Up Your Social Profile</Title>
//       <Description>
//         Tell others about yourself to make better connections. You can update
//         this anytime.
//       </Description>

//       <Form onSubmit={handleSubmit}>
//         <FormGroup>
//           <Label>Bio (Optional)</Label>
//           <TextArea
//             placeholder="Tell others a bit about yourself... What do you enjoy? What brings you out tonight?"
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//             maxLength={200}
//           />
//           <div
//             style={{
//               fontSize: "0.75rem",
//               color: "#94a3b8",
//               textAlign: "right",
//             }}
//           >
//             {bio.length}/200
//           </div>
//         </FormGroup>

//         <FormGroup>
//           <Label>Your Vibe *</Label>
//           <VibeGrid>
//             {vibeOptions.map((vibe) => (
//               <VibeButton
//                 key={vibe.value}
//                 type="button"
//                 $selected={selectedVibe === vibe.value}
//                 $vibe={vibe.value}
//                 onClick={() => setSelectedVibe(vibe.value)}
//               >
//                 <div style={{ fontWeight: "600" }}>{vibe.label}</div>
//                 <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
//                   {vibe.description}
//                 </div>
//               </VibeButton>
//             ))}
//           </VibeGrid>
//         </FormGroup>

//         <FormGroup>
//           <Label>Interests</Label>
//           <InterestInput>
//             <Input
//               type="text"
//               placeholder="Add an interest..."
//               value={newInterest}
//               onChange={(e) => setNewInterest(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   addInterest();
//                 }
//               }}
//             />
//             <AddButton type="button" onClick={addInterest}>
//               Add
//             </AddButton>
//           </InterestInput>

//           <div
//             style={{
//               fontSize: "0.75rem",
//               color: "#94a3b8",
//               marginTop: "0.5rem",
//             }}
//           >
//             Popular:{" "}
//             {popularInterests.map((interest) => (
//               <button
//                 key={interest}
//                 type="button"
//                 onClick={() => addPopularInterest(interest)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: "#8b5cf6",
//                   cursor: "pointer",
//                   fontSize: "0.75rem",
//                   margin: "0 0.25rem",
//                   textDecoration: "underline",
//                 }}
//               >
//                 {interest}
//               </button>
//             ))}
//           </div>

//           {interests.length > 0 && (
//             <InterestsList>
//               {interests.map((interest) => (
//                 <InterestTag key={interest}>
//                   {interest}
//                   <RemoveButton
//                     type="button"
//                     onClick={() => removeInterest(interest)}
//                     title="Remove interest"
//                   >
//                     ×
//                   </RemoveButton>
//                 </InterestTag>
//               ))}
//             </InterestsList>
//           )}
//         </FormGroup>

//         <ButtonGroup>
//           <SecondaryButton type="button" onClick={onSkip}>
//             Skip for Now
//           </SecondaryButton>
//           <PrimaryButton type="submit" disabled={!selectedVibe || isLoading}>
//             {isLoading ? "Saving..." : "Complete Setup"}
//           </PrimaryButton>
//         </ButtonGroup>
//       </Form>
//     </SetupContainer>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { SocialVibe } from "@prisma/client";
import { UserSocialProfileWithRelations } from "@/types/social";

const SetupContainer = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 2rem;
  margin: 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h2`
  color: #f8fafc;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TextArea = styled.textarea`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;

const VibeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const VibeButton = styled.button<{ $selected: boolean; $vibe: SocialVibe }>`
  padding: 0.75rem;
  border: 1px solid
    ${(props) =>
      props.$selected ? getVibeColor(props.$vibe) : "rgba(139, 92, 246, 0.3)"};
  border-radius: 8px;
  background: ${(props) =>
    props.$selected
      ? `${getVibeColor(props.$vibe)}20`
      : "rgba(15, 23, 42, 0.6)"};
  color: ${(props) =>
    props.$selected ? getVibeColor(props.$vibe) : "#e2e8f0"};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    border-color: ${(props) => getVibeColor(props.$vibe)};
    background: ${(props) => `${getVibeColor(props.$vibe)}20`};
  }
`;

const InterestInput = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  flex: 1;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const InterestTag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: #e2e8f0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: #8b5cf6;
  }
`;

// Helper function to get vibe colors
function getVibeColor(vibe: SocialVibe): string {
  const colors = {
    CHILL: "#0ea5e9",
    PARTY: "#ec4899",
    NETWORKING: "#10b981",
    ADVENTUROUS: "#f59e0b",
    CASUAL: "#8b5cf6",
  };
  return colors[vibe];
}

interface SetupSocialProfileProps {
  onComplete: (profileData: {
    bio: string;
    vibe: SocialVibe;
    interests: string[];
  }) => void;
  onSkip: () => void;
  isLoading?: boolean;
  existingProfile?: UserSocialProfileWithRelations | null;
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

const popularInterests = [
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

export default function SetupSocialProfile({
  onComplete,
  onSkip,
  isLoading = false,
  existingProfile = null,
}: SetupSocialProfileProps) {
  const [bio, setBio] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<SocialVibe | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  // Populate form with existing data
  useEffect(() => {
    if (existingProfile) {
      console.log("🔄 POPULATING FORM WITH EXISTING DATA:", existingProfile);
      setBio(existingProfile.bio || "");
      setSelectedVibe(existingProfile.vibe || null);
      setInterests(existingProfile.interests || []);
    }
  }, [existingProfile]);

  // Debug form state
  useEffect(() => {
    console.log("🔍 CURRENT FORM STATE:", {
      bio,
      selectedVibe,
      interests,
      hasExistingProfile: !!existingProfile,
    });
  }, [bio, selectedVibe, interests, existingProfile]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🟢 FORM SUBMITTED!");
    console.log("📊 FORM DATA:", {
      bio,
      selectedVibe,
      interests,
      hasSelectedVibe: !!selectedVibe,
      interestsCount: interests.length,
    });

    if (selectedVibe) {
      console.log("🚀 CALLING onComplete...");
      onComplete({
        bio,
        vibe: selectedVibe,
        interests,
      });
      console.log("✅ onComplete CALLED!");
    } else {
      console.log("🔴 NO VIBE SELECTED - CANNOT SUBMIT");
      alert("Please select a vibe before saving!");
    }
  };

  const addPopularInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests((prev) => [...prev, interest]);
    }
  };

  return (
    <SetupContainer>
      <Title>
        {existingProfile ? "Edit Social Profile" : "Set Up Your Social Profile"}
      </Title>
      <Description>
        {existingProfile
          ? "Update your social profile to make better connections."
          : "Tell others about yourself to make better connections. You can update this anytime."}
      </Description>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Bio (Optional)</Label>
          <TextArea
            placeholder="Tell others a bit about yourself... What do you enjoy? What brings you out tonight?"
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
          <SecondaryButton type="button" onClick={onSkip}>
            {existingProfile ? "Cancel" : "Skip for Now"}
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={!selectedVibe || isLoading}>
            {isLoading
              ? "Saving..."
              : existingProfile
              ? "Update Profile"
              : "Complete Setup"}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </SetupContainer>
  );
}
