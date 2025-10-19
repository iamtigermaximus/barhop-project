import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthCard,
  Divider,
  ErrorMessage,
  Form,
  FormGroup,
  GoogleButton,
  Input,
  Label,
  Page,
  SubmitButton,
  Subtitle,
  SuccessMessage,
  SwitchText,
  Title,
} from "./AuthForm.styles";

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
