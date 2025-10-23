"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Divider,
  DividerText,
  ErrorMessage,
  ForgotPasswordLink,
  Form,
  GlassCard,
  GoogleButton,
  GoogleIcon,
  Input,
  InputGroup,
  Label,
  MobileOptimized,
  StyledLink,
  SubmitButton,
  Subtitle,
  Title,
} from "./LoginForm.styles";

interface LoginFormProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function LoginForm({ searchParams }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Remove useSearchParams and use the passed searchParams prop
  useEffect(() => {
    const error = Array.isArray(searchParams.error)
      ? searchParams.error[0]
      : searchParams.error;

    const message = Array.isArray(searchParams.message)
      ? searchParams.message[0]
      : searchParams.message;

    if (error === "OAuthAccountNotLinked") {
      setError(
        "This email is already associated with another account. Please sign in with your original method."
      );
    }

    if (message === "Account created successfully") {
      setError("Account created successfully! Please sign in.");
    } else if (message === "Account created successfully. Please sign in.") {
      setError("Account created! Please sign in with your new credentials.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/app" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  const messageType = error.includes("successfully") ? "success" : "error";

  return (
    <MobileOptimized>
      <Container>
        <GlassCard>
          <Title>Welcome Back</Title>
          <Subtitle>
            Don&apos;t have an account?
            <StyledLink href="/app/auth/signup">Sign up here</StyledLink>
          </Subtitle>

          <GoogleButton
            onClick={handleGoogleSignIn}
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
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </GoogleButton>

          <Divider>
            <DividerText>Or continue with email</DividerText>
          </Divider>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage $type={messageType}>{error}</ErrorMessage>}

            <InputGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={loading} $loading={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </SubmitButton>

            <ForgotPasswordLink href="/forgot-password">
              Forgot your password?
            </ForgotPasswordLink>
          </Form>
        </GlassCard>
      </Container>
    </MobileOptimized>
  );
}
