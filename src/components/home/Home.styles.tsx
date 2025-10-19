import styled from "styled-components";
import Link from "next/link";

export const MainContainer = styled.main`
  background: #0f172a;
  min-height: 100vh;
`;

export const HeroSection = styled.section`
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

export const HeroTitle = styled.h1`
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

export const HeroDescription = styled.p`
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

export const ButtonGroup = styled.div`
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

export const BaseButton = styled(Link)`
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

export const PrimaryButton = styled(BaseButton)`
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

export const SecondaryButton = styled(BaseButton)`
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

export const FeaturesSection = styled.section`
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

export const SectionTitle = styled.h2`
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

export const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const FeaturesGrid = styled.div`
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

export const FeatureCard = styled.div`
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

export const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
`;

export const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

export const FeatureDescription = styled.p`
  color: #e2e8f0;
  line-height: 1.6;
`;

export const HowItWorksSection = styled.section`
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

export const StepsContainer = styled.div`
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

export const StepCard = styled.div`
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

export const StepNumber = styled.div`
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

export const StepIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
`;

export const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #f8fafc;
`;

export const StepDescription = styled.p`
  color: #e2e8f0;
  line-height: 1.5;
  font-size: 0.875rem;
`;

export const CtaSection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
`;

export const SafetySection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  background-color: transparent !important;
`;

export const SafetyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
`;

export const SafetyFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
  background-color: transparent !important;
`;

export const SafetyBadge = styled.span`
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

export const CitiesSection = styled.section`
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

export const CitiesGrid = styled.div`
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

export const CityCard = styled.div`
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

export const CityName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #f8fafc;
`;

export const CityDescription = styled.p`
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

export const BarCount = styled.span`
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 0.875rem;
`;
