"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Responsive container with breakpoints
const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #0f172a, #1e1b4b, #0f172a, #1e1b4b);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  /* Mobile First Approach */
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 2rem;
  }

  @media (min-width: 1025px) {
    padding: 3rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(139, 92, 246, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(14, 165, 233, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(236, 72, 153, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;

    /* Adjust gradients for mobile */
    @media (max-width: 768px) {
      background: radial-gradient(
          circle at 10% 90%,
          rgba(139, 92, 246, 0.15) 0%,
          transparent 60%
        ),
        radial-gradient(
          circle at 90% 10%,
          rgba(14, 165, 233, 0.15) 0%,
          transparent 60%
        );
    }
  }
`;

const GlassCard = styled.div`
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 24px;
  width: 100%;
  max-width: min(480px, 95vw);
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 2rem 1.5rem;
    max-width: 100%;
    margin: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: min(440px, 90vw);
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 3rem 2.5rem;
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
      rgba(139, 92, 246, 0.15),
      transparent
    );
    transition: left 0.8s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  text-align: center;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 8s ease infinite;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  line-height: 1.2;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  line-height: 1.6;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 1.1rem;
  }
`;

const StyledLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;

  &:hover {
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.1);

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: linear-gradient(90deg, #a78bfa, #c4b5fd);
      border-radius: 1px;
    }
  }

  @media (max-width: 480px) {
    padding: 0.2rem 0.4rem;
    font-size: 0.95rem;
  }
`;

const GoogleButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.4s ease;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.125rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);

  /* Mobile */
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    width: 22px;
    height: 22px;
    margin-right: 14px;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 2.5rem 0;

  /* Mobile */
  @media (max-width: 480px) {
    margin: 2rem 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.4),
      transparent
    );
    transform: translateY(-50%);
  }
`;

const DividerText = styled.span`
  background: rgba(30, 41, 59, 0.85);
  padding: 0 1.5rem;
  color: #94a3b8;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0 1rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.9rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const Label = styled.label`
  color: #e2e8f0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    gap: 0.4rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.95rem;
  }

  &::before {
    content: "•";
    color: #8b5cf6;

    /* Mobile */
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }

    /* Tablet & Desktop */
    @media (min-width: 481px) {
      font-size: 1.2rem;
    }
  }
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.7);
  border: 1.5px solid rgba(71, 85, 105, 0.4);
  border-radius: 14px;
  color: #f8fafc;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 100%;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.1rem 1.5rem;
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.125rem 1.5rem;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15),
      inset 0 0 0 1px rgba(139, 92, 246, 0.1);
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }

  &:valid {
    border-color: rgba(34, 197, 94, 0.4);
  }

  /* Disable zoom on iOS for inputs */
  @media (max-width: 480px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  background: linear-gradient(45deg, #8b5cf6, #0ea5e9, #ec4899);
  background-size: 300% 300%;
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  letter-spacing: 0.025em;
  transition: all 0.4s ease;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  animation: ${gradientShift} 6s ease infinite;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.05rem;
    border-radius: 12px;
    margin-top: 0.25rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    padding: 1.25rem 1.5rem;
    font-size: 1.1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(139, 92, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ErrorMessage = styled.div`
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  animation: ${fadeIn} 0.4s ease-out;
  text-align: center;
  line-height: 1.5;

  /* Mobile */
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.95rem;
  }
`;

const FormRow = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns ? `repeat(${props.$columns}, 1fr)` : "1fr 1fr"};
  gap: 1rem;

  /* Mobile - always single column */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Tablet - adjust gap */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 1rem;
  }

  /* Small tablets in portrait - sometimes single column is better */
  @media (min-width: 481px) and (max-width: 600px) and (orientation: portrait) {
    grid-template-columns: 1fr;
  }
`;

// Additional mobile-specific optimizations
const MobileOptimized = styled.div`
  @media (max-width: 480px) {
    /* Ensure tap targets are at least 44px for accessibility */
    button,
    a {
      min-height: 44px;
      min-width: 44px;
    }

    /* Prevent horizontal scrolling */
    max-width: 100vw;
    overflow-x: hidden;
  }
`;

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create the account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Step 2: Show success message briefly
        setError("Account created! Logging you in...");

        // Step 3: Auto-signin
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Account created! Please sign in manually.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          // Success! Redirect to home/dashboard
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Failed to sign up with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <MobileOptimized>
      <Container>
        <GlassCard>
          <Title>Join Hoppr</Title>
          <Subtitle>
            Already have an account?{" "}
            <StyledLink href="/login">Sign in here</StyledLink>
          </Subtitle>

          <GoogleButton
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            $loading={googleLoading}
          >
            <GoogleIcon>
              <svg viewBox="0 0 24 24" width="100%" height="100%">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </GoogleIcon>
            {googleLoading ? "Creating Account..." : "Sign up with Google"}
          </GoogleButton>

          <Divider>
            <DividerText>Or sign up with email</DividerText>
          </Divider>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <InputGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </InputGroup>

            <FormRow $columns={2}>
              <InputGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Create password"
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                />
              </InputGroup>
            </FormRow>

            <SubmitButton type="submit" disabled={loading} $loading={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </SubmitButton>
          </Form>
        </GlassCard>
      </Container>
    </MobileOptimized>
  );
}
