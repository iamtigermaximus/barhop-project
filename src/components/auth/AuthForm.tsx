"use client";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = styled.div`
  padding: 2rem 1rem;
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(
    -45deg,
    rgb(9, 9, 11),
    rgb(24, 20, 31),
    rgb(9, 9, 11),
    rgb(21, 17, 23)
  );
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;

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

const AuthCard = styled.div`
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.15);
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(-45deg, #0ea5e9, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 2rem;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  text-align: center;
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

const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #0ea5e9);
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.$loading ? "none" : "gradientShift 4s ease infinite"};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  color: #94a3b8;
  margin: 1.5rem 0;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(139, 92, 246, 0.2);
  }

  span {
    background: rgba(30, 41, 59, 0.9);
    padding: 0 1rem;
    position: relative;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  color: #e2e8f0;

  a {
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
`;

const GoogleButton = styled.button`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  &:hover:not(:disabled) {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.6);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for success message from query params
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        console.log("🔐 Attempting login...", { email });

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        console.log("🔐 Login result:", result);

        if (result?.error) {
          setError("Invalid email or password");
          console.error("❌ Login failed:", result.error);
        } else {
          console.log("✅ Login successful");
          // Use window.location for a hard redirect to ensure session is loaded
          window.location.href = "/crawls";
        }
      } else {
        // SIGNUP FLOW
        console.log("📝 Attempting registration...", { email, name });

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        });

        console.log("📝 Registration response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Registration failed:", errorData);
          throw new Error(errorData.message || "Registration failed");
        }

        console.log("✅ Registration successful");

        // Try to auto-login after registration
        console.log("🔄 Attempting auto-login after registration...");
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        console.log("🔄 Auto-login result:", loginResult);

        if (loginResult?.error) {
          // If auto-login fails, show success message and redirect to login
          console.log("ℹ️ Auto-login failed, redirecting to login page");
          setSuccessMessage(
            "Registration successful! Please sign in with your new account."
          );

          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
        } else {
          console.log("✅ Auto-login successful");
          // Use window.location for a hard redirect
          window.location.href = "/crawls";
        }
      }
    } catch (err) {
      console.error("💥 Auth error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setIsLoading(true);

      console.log("🔐 Attempting Google sign in...");
      await signIn("google", {
        callbackUrl: "/crawls",
        redirect: true,
      });
    } catch (err) {
      console.error("💥 Google sign in error:", err);
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  // Clear messages when input changes
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError("");
      setSuccessMessage("");
    };

  return (
    <Page>
      <AuthCard>
        <Title>{mode === "login" ? "Welcome Back" : "Join BarHop"}</Title>
        <Subtitle>
          {mode === "login"
            ? "Sign in to plan your next bar crawl adventure"
            : "Create an account to start planning amazing nightlife experiences"}
        </Subtitle>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={handleInputChange(setName)}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" $loading={isLoading} disabled={isLoading}>
            {isLoading ? (
              <>
                <span style={{ marginRight: "0.5rem" }}>⏳</span>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </GoogleButton>

        <SwitchText>
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup">Sign up here</Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/signin">Sign in here</Link>
            </>
          )}
        </SwitchText>
      </AuthCard>
    </Page>
  );
}
