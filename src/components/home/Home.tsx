// "use client";
// import styled from "styled-components";
// import Link from "next/link";

// const MainContainer = styled.main`
//   background: #0f172a;
//   min-height: 100vh;
// `;

// const HeroSection = styled.section`
//   background: linear-gradient(
//     -45deg,
//     rgb(9, 9, 11),
//     rgb(24, 20, 31),
//     rgb(9, 9, 11),
//     rgb(21, 17, 23)
//   );
//   background-size: 400% 400%;
//   padding: 3rem 1rem;
//   text-align: center;
//   position: relative;
//   overflow: hidden;
//   animation: gradientShift 8s ease infinite;

//   @media (min-width: 768px) {
//     padding: 6rem 2rem;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: radial-gradient(
//         circle at 30% 20%,
//         rgba(14, 165, 233, 0.1) 0%,
//         transparent 50%
//       ),
//       radial-gradient(
//         circle at 70% 80%,
//         rgba(139, 92, 246, 0.1) 0%,
//         transparent 50%
//       );
//     pointer-events: none;
//   }
// `;

// const HeroTitle = styled.h1`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin-bottom: 1.5rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
//   background-size: 400% 400%;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
//   animation: gradientShift 8s ease infinite;
//   position: relative;

//   @media (min-width: 768px) {
//     font-size: 4rem;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const HeroDescription = styled.p`
//   font-size: 1.125rem;
//   color: #e2e8f0;
//   margin-bottom: 2.5rem;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
//   line-height: 1.6;
//   position: relative;

//   @media (min-width: 768px) {
//     font-size: 1.25rem;
//   }
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: center;
//   flex-wrap: wrap;
//   position: relative;
//   background: transparent !important;
// `;

// const PrimaryButton = styled(Link)`
//   background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
//   background-size: 400% 400%;
//   border: 1px solid rgba(139, 92, 246, 0.3);
//   color: white;
//   padding: 1rem 2rem;
//   /* border-radius: 8px; */
//   text-decoration: none;
//   font-weight: 600;
//   transition: all 0.3s ease;
//   animation: gradientShift 4s ease infinite;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
//     border-color: rgba(139, 92, 246, 0.6);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(255, 255, 255, 0.2),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const SecondaryButton = styled(Link)`
//   background: transparent;
//   border: 1px solid;
//   border-image: linear-gradient(45deg, #0ea5e9, #8b5cf6) 1;
//   color: #e2e8f0;
//   padding: 1rem 2rem;
//   border-radius: 8px;
//   text-decoration: none;
//   font-weight: 600;
//   transition: all 0.3s ease;
//   position: relative;

//   &:hover {
//     background: linear-gradient(
//       45deg,
//       rgba(14, 165, 233, 0.1),
//       rgba(139, 92, 246, 0.1)
//     );
//     color: white;
//     transform: translateY(-2px);
//     box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
//   }
// `;

// const FeaturesSection = styled.section`
//   padding: 4rem 1rem;
//   background: linear-gradient(
//     -45deg,
//     rgb(9, 9, 11),
//     rgb(15, 23, 42),
//     rgb(9, 9, 11),
//     rgb(15, 23, 42)
//   );
//   background-size: 400% 400%;
//   animation: gradientShift 12s ease infinite;
//   position: relative;

//   @media (min-width: 768px) {
//     padding: 6rem 2rem;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const SectionTitle = styled.h2`
//   font-size: 2rem;
//   font-weight: 700;
//   text-align: center;
//   margin-bottom: 1rem;
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
//   background-size: 400% 400%;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
//   animation: gradientShift 8s ease infinite;

//   @media (min-width: 768px) {
//     font-size: 3rem;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const SectionDescription = styled.p`
//   font-size: 1.125rem;
//   color: #e2e8f0;
//   text-align: center;
//   margin-bottom: 3rem;
//   max-width: 600px;
//   margin-left: auto;
//   margin-right: auto;
// `;

// const FeaturesGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 2rem;
//   max-width: 1200px;
//   margin: 0 auto;
//   background: transparent !important;

//   @media (min-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(4, 1fr);
//   }
// `;

// const FeatureCard = styled.div`
//   text-align: center;
//   padding: 2rem;
//   background: rgba(30, 41, 59, 0.6);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   transition: all 0.3s ease;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
//     border-color: rgba(139, 92, 246, 0.4);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(139, 92, 246, 0.1),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }
// `;

// const FeatureIcon = styled.div`
//   font-size: 3rem;
//   margin-bottom: 1rem;
//   filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
// `;

// const FeatureTitle = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin-bottom: 0.5rem;
//   color: #f8fafc;
// `;

// const FeatureDescription = styled.p`
//   color: #e2e8f0;
//   line-height: 1.6;
// `;

// const CitiesSection = styled.section`
//   padding: 4rem 1rem;
//   background: linear-gradient(
//     -45deg,
//     rgb(24, 20, 31),
//     rgb(30, 41, 59),
//     rgb(24, 20, 31),
//     rgb(30, 41, 59)
//   );
//   background-size: 400% 400%;
//   animation: gradientShift 10s ease infinite;

//   @media (min-width: 768px) {
//     padding: 6rem 2rem;
//   }

//   @keyframes gradientShift {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }
//     100% {
//       background-position: 0% 50%;
//     }
//   }
// `;

// const CitiesGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 1.5rem;
//   max-width: 1200px;
//   margin: 0 auto;
//   background: transparent !important;

//   @media (min-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (min-width: 1024px) {
//     grid-template-columns: repeat(3, 1fr);
//   }
// `;

// const CityCard = styled.div`
//   padding: 2rem;
//   background: rgba(15, 23, 42, 0.7);
//   backdrop-filter: blur(10px);
//   border-radius: 12px;
//   border: 1px solid rgba(139, 92, 246, 0.2);
//   text-align: center;
//   transition: all 0.3s ease;
//   position: relative;
//   overflow: hidden;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
//     border-color: rgba(139, 92, 246, 0.4);
//   }

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: -100%;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(
//       90deg,
//       transparent,
//       rgba(14, 165, 233, 0.1),
//       transparent
//     );
//     transition: left 0.5s;
//   }

//   &:hover::before {
//     left: 100%;
//   }
// `;

// const CityName = styled.h3`
//   font-size: 1.5rem;
//   font-weight: 600;
//   margin-bottom: 0.5rem;
//   color: #f8fafc;
// `;

// const CityDescription = styled.p`
//   color: #e2e8f0;
//   margin-bottom: 1rem;
// `;

// const BarCount = styled.span`
//   background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
//   font-weight: 700;
//   font-size: 0.875rem;
// `;

// export default function Home() {
//   const features = [
//     {
//       icon: "🗺️",
//       title: "Custom Crawl Planner",
//       description: "Plan multi-bar routes with optimized timing and routes",
//     },
//     {
//       icon: "⭐",
//       title: "Skip-the-Line VIP",
//       description: "Buy VIP passes to bypass queues at popular venues",
//     },
//     {
//       icon: "👥",
//       title: "Social Groups",
//       description: "Join or create groups for shared nightlife experiences",
//     },
//     {
//       icon: "🎯",
//       title: "Smart Discovery",
//       description: "Find bars by type, district, and real-time availability",
//     },
//   ];

//   const popularCities = [
//     {
//       name: "Helsinki",
//       barCount: 12,
//       description: "Vibrant capital with diverse nightlife",
//     },
//     {
//       name: "Tampere",
//       barCount: 0,
//       description: "Energetic student city with great clubs",
//     },
//     {
//       name: "Turku",
//       barCount: 0,
//       description: "Historic city with cozy pubs and bars",
//     },
//   ];

//   return (
//     <MainContainer>
//       {/* Hero Section */}
//       <HeroSection>
//         <HeroTitle>Connect Through Shared Experiences</HeroTitle>
//         <HeroDescription>
//           Plan bar crawls, skip lines with VIP passes,meet new people and
//           connect with friends. Explore your city&apos;s social scene together —
//           from casual hangouts to unforgettable nights out.
//         </HeroDescription>
//         <ButtonGroup>
//           <PrimaryButton href="/bars">Explore All Bars</PrimaryButton>
//           <SecondaryButton href="/crawl-planner">Plan a Crawl</SecondaryButton>
//         </ButtonGroup>
//       </HeroSection>

//       {/* Features Section */}
//       <FeaturesSection>
//         <SectionTitle>Why Choose Hoppr?</SectionTitle>
//         <SectionDescription>
//           Everything you need for the perfect night out
//         </SectionDescription>
//         <FeaturesGrid>
//           {features.map((feature, index) => (
//             <FeatureCard key={index}>
//               <FeatureIcon>{feature.icon}</FeatureIcon>
//               <FeatureTitle>{feature.title}</FeatureTitle>
//               <FeatureDescription>{feature.description}</FeatureDescription>
//             </FeatureCard>
//           ))}
//         </FeaturesGrid>
//       </FeaturesSection>

//       {/* Popular Cities Section */}
//       <CitiesSection>
//         <SectionTitle>Popular Cities</SectionTitle>
//         <SectionDescription>
//           Discover nightlife in cities across Finland
//         </SectionDescription>
//         <CitiesGrid>
//           {popularCities.map((city, index) => (
//             <CityCard key={index}>
//               <CityName>{city.name}</CityName>
//               <CityDescription>{city.description}</CityDescription>
//               <BarCount>
//                 {city.barCount > 0 ? `${city.barCount}+ venues` : "Coming Soon"}
//               </BarCount>
//             </CityCard>
//           ))}
//         </CitiesGrid>
//       </CitiesSection>
//     </MainContainer>
//   );
// }
"use client";
import styled from "styled-components";
import Link from "next/link";

const MainContainer = styled.main`
  background: #0f172a;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  padding: 3rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: gradientShift 8s ease infinite;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(14, 165, 233, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
  position: relative;

  @media (min-width: 768px) {
    font-size: 4rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: #e2e8f0;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  background: transparent !important;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1rem;
  }
`;

const BaseButton = styled(Link)`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: center;
  display: inline-block;
  min-width: 160px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    min-width: 180px;
    width: 100%;
    max-width: 260px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    min-width: 160px;
    max-width: 220px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  animation: gradientShift 4s ease infinite;

  &:hover {
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    border-color: rgba(139, 92, 246, 0.6);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: transparent;
  border: 1px solid;
  border-image: linear-gradient(45deg, #0ea5e9, #8b5cf6) 1;
  color: #e2e8f0;

  &:hover {
    background: linear-gradient(
      45deg,
      rgba(14, 165, 233, 0.1),
      rgba(139, 92, 246, 0.1)
    );
    color: white;
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(15, 23, 42),
    rgb(9, 9, 11),
    rgb(15, 23, 42)
  );
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  position: relative;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;

  @media (min-width: 768px) {
    font-size: 3rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

const FeatureDescription = styled.p`
  color: #e2e8f0;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(
    -45deg,
    rgb(15, 23, 42),
    rgb(30, 41, 59),
    rgb(15, 23, 42),
    rgb(30, 41, 59)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  background: transparent !important;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  margin: 0 auto 1rem;
`;

const StepIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #f8fafc;
`;

const StepDescription = styled.p`
  color: #e2e8f0;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const CtaSection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
`;

const SafetySection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  background-color: transparent !important;
`;

const SafetyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

const SafetyFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
  background-color: transparent !important;
`;

const SafetyBadge = styled.span`
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const CitiesSection = styled.section`
  padding: 4rem 1rem;
  background: linear-gradient(
    -45deg,
    rgb(24, 20, 31),
    rgb(30, 41, 59),
    rgb(24, 20, 31),
    rgb(30, 41, 59)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent !important;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CityCard = styled.div`
  padding: 2rem;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(14, 165, 233, 0.1),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const CityName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

const CityDescription = styled.p`
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

const BarCount = styled.span`
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 0.875rem;
`;

export default function Home() {
  const features = [
    {
      icon: "🔍",
      title: "Live Social Map",
      description:
        "See who's free nearby and join spontaneous meetups in real-time",
    },
    {
      icon: "🗺️",
      title: "Custom Crawl Planner",
      description: "Plan multi-bar routes with optimized timing and routes",
    },
    {
      icon: "⭐",
      title: "Skip-the-Line VIP",
      description: "Buy VIP passes to bypass queues at popular venues",
    },
    {
      icon: "👥",
      title: "Social Groups",
      description: "Join or create groups for shared nightlife experiences",
    },
    {
      icon: "🎯",
      title: "Smart Discovery",
      description: "Find bars by type, district, and real-time availability",
    },
    {
      icon: "🚀",
      title: "Instant Connections",
      description: "Hop in with nearby users and make new friends instantly",
    },
  ];

  const popularCities = [
    {
      name: "Helsinki",
      barCount: 12,
      description: "Vibrant capital with diverse nightlife",
    },
    {
      name: "Tampere",
      barCount: 0,
      description: "Energetic student city with great clubs",
    },
    {
      name: "Turku",
      barCount: 0,
      description: "Historic city with cozy pubs and bars",
    },
  ];

  return (
    <MainContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Connect Through Shared Experiences</HeroTitle>
        <HeroDescription>
          Plan bar crawls, skip lines with VIP passes, meet new people and
          connect with friends. Explore your city&apos;s social scene together —
          from casual hangouts to unforgettable nights out.
        </HeroDescription>
        <ButtonGroup>
          <PrimaryButton href="/social">
            See Who&apos;s Out Tonight
          </PrimaryButton>
          <SecondaryButton href="/bars">Explore Bars</SecondaryButton>
        </ButtonGroup>
      </HeroSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <SectionTitle>How Hoppr Works</SectionTitle>
        <SectionDescription>
          Simple steps to meet new people and create amazing experiences
        </SectionDescription>

        <StepsContainer>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepIcon>🎯</StepIcon>
            <StepTitle>Create or Join</StepTitle>
            <StepDescription>
              Plan your own crawl or join existing groups. Set your preferences
              for venues, group size, and vibe.
            </StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>2</StepNumber>
            <StepIcon>👥</StepIcon>
            <StepTitle>Connect & Chat</StepTitle>
            <StepDescription>
              Get to know your group before meeting up. Coordinate plans and
              share interests through our chat.
            </StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>3</StepNumber>
            <StepIcon>⭐</StepIcon>
            <StepTitle>VIP Access</StepTitle>
            <StepDescription>
              Skip long queues and get priority entry. Purchase VIP passes for
              establishments with queues or entrance fees.
            </StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>4</StepNumber>
            <StepIcon>🎉</StepIcon>
            <StepTitle>Meet & Enjoy</StepTitle>
            <StepDescription>
              Show up and have fun! Follow the planned route, meet amazing
              people, and create memorable experiences.
            </StepDescription>
          </StepCard>
        </StepsContainer>

        {/* Plan a Crawl CTA */}
        <CtaSection>
          <PrimaryButton href="/crawl-planner">
            Start Planning Your Crawl
          </PrimaryButton>
        </CtaSection>

        <SafetySection>
          <SafetyTitle>Your Safety is Our Priority</SafetyTitle>
          <SafetyFeatures>
            <SafetyBadge>Verified Users</SafetyBadge>
            <SafetyBadge>Group Sizes Limited</SafetyBadge>
            <SafetyBadge>Venue Partnerships</SafetyBadge>
            <SafetyBadge>24/7 Support</SafetyBadge>
          </SafetyFeatures>
        </SafetySection>
      </HowItWorksSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Why Choose Hoppr?</SectionTitle>
        <SectionDescription>
          Everything you need for the perfect night out
        </SectionDescription>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Popular Cities Section */}
      <CitiesSection>
        <SectionTitle>Popular Cities</SectionTitle>
        <SectionDescription>
          Discover nightlife in cities across Finland
        </SectionDescription>
        <CitiesGrid>
          {popularCities.map((city, index) => (
            <CityCard key={index}>
              <CityName>{city.name}</CityName>
              <CityDescription>{city.description}</CityDescription>
              <BarCount>
                {city.barCount > 0 ? `${city.barCount}+ venues` : "Coming Soon"}
              </BarCount>
            </CityCard>
          ))}
        </CitiesGrid>
      </CitiesSection>
    </MainContainer>
  );
}
