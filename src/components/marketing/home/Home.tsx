"use client";

import {
  MainContainer,
  HeroSection,
  HeroTitle,
  HeroDescription,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  HowItWorksSection,
  SectionTitle,
  SectionDescription,
  StepsContainer,
  StepCard,
  StepNumber,
  StepIcon,
  StepTitle,
  StepDescription,
  CtaSection,
  SafetySection,
  SafetyTitle,
  SafetyFeatures,
  SafetyBadge,
  FeaturesSection,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  CitiesSection,
  CitiesGrid,
  CityCard,
  CityName,
  CityDescription,
  BarCount,
} from "./Home.styles";

const Home = () => {
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
          <PrimaryButton href="/app/social">
            See Who&apos;s Out Tonight
          </PrimaryButton>
          <SecondaryButton href="/partners">Explore Bars</SecondaryButton>
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
          <PrimaryButton href="/app/crawl-planner">
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
};
export default Home;
