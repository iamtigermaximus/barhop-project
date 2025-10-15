"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
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
  overflow-x: hidden;

  /* Mobile First Approach */
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 1.5rem;
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
        circle at 30% 20%,
        rgba(14, 165, 233, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(139, 92, 246, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 50%,
        rgba(236, 72, 153, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;

    /* Adjust gradients for mobile */
    @media (max-width: 768px) {
      background: radial-gradient(
          circle at 20% 85%,
          rgba(14, 165, 233, 0.15) 0%,
          transparent 60%
        ),
        radial-gradient(
          circle at 85% 15%,
          rgba(139, 92, 246, 0.15) 0%,
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
  max-width: min(420px, 95vw);
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  /* Mobile */
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 2rem 1.25rem;
    max-width: 100%;
    margin: 0.5rem;
    backdrop-filter: blur(20px);
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 2.5rem 2rem;
    max-width: min(400px, 90vw);
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

    @media (max-width: 768px) {
      /* Reduce animation on mobile for performance */
      left: 100%;
    }
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
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 2rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.75rem;
    line-height: 1.5;
  }

  /* Tablet */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.25rem;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 1.05rem;
  }
`;

const StyledLink = styled(Link)`
  color: #a78bfa;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  white-space: nowrap;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.15rem 0.3rem;
  }

  &:hover {
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.1);

    &::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0.4rem;
      right: 0.4rem;
      height: 2px;
      background: linear-gradient(90deg, #a78bfa, #c4b5fd);
      border-radius: 1px;
    }
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
      background: rgba(255, 255, 255, 0.08);
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
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 2rem 0;

  /* Mobile */
  @media (max-width: 480px) {
    margin: 1.75rem 0;
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
  padding: 0 1.25rem;
  color: #94a3b8;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 0.75rem;
  }

  /* Tablet & Desktop */
  @media (min-width: 481px) {
    font-size: 0.85rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
    font-weight: 700;

    /* Mobile */
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }

    /* Tablet & Desktop */
    @media (min-width: 481px) {
      font-size: 1rem;
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
  box-sizing: border-box;

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

  /* Disable zoom on iOS for inputs */
  @media (max-width: 480px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;

    &:focus {
      transform: none;
    }
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

  /* Fix the animation syntax */
  ${(props) =>
    props.$loading
      ? css`
          animation: ${pulse} 2s ease-in-out infinite;
        `
      : css`
          animation: ${gradientShift} 6s ease infinite;
        `}

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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(139, 92, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    &:hover:not(:disabled) {
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

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &:hover:not(:disabled) {
      transform: none;
    }
  }
`;

const ErrorMessage = styled.div<{ $type: "error" | "success" }>`
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  background: ${(props) =>
    props.$type === "success"
      ? "rgba(34, 197, 94, 0.1)"
      : "rgba(239, 68, 68, 0.1)"};
  border: 1.5px solid
    ${(props) =>
      props.$type === "success"
        ? "rgba(34, 197, 94, 0.3)"
        : "rgba(239, 68, 68, 0.3)"};
  color: ${(props) => (props.$type === "success" ? "#4ade80" : "#f87171")};
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

    /* Improve performance on mobile */
    * {
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* Reduce animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const ForgotPasswordLink = styled(Link)`
  color: #94a3b8;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  transition: color 0.3s ease;

  /* Mobile */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }

  &:hover {
    color: #a78bfa;
  }
`;

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const error = searchParams.get("error");
//     const message = searchParams.get("message");

//     if (error === "OAuthAccountNotLinked") {
//       setError(
//         "This email is already associated with another account. Please sign in with your original method."
//       );
//     }

//     if (message === "Account created successfully") {
//       setError("Account created successfully! Please sign in.");
//     } else if (message === "Account created successfully. Please sign in.") {
//       setError("Account created! Please sign in with your new credentials.");
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const result = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError("Invalid email or password");
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setGoogleLoading(true);
//     try {
//       await signIn("google", { callbackUrl: "/" });
//     } catch (error) {
//       setError("Failed to sign in with Google");
//       setGoogleLoading(false);
//     }
//   };

//   const messageType = error.includes("successfully") ? "success" : "error";

//   return (
//     <MobileOptimized>
//       <Container>
//         <GlassCard>
//           <Title>Welcome Back</Title>
//           <Subtitle>
//             Don&apos;t have an account?
//             <StyledLink href="/signup">Sign up here</StyledLink>
//           </Subtitle>

//           <GoogleButton
//             onClick={handleGoogleSignIn}
//             disabled={googleLoading}
//             $loading={googleLoading}
//           >
//             <GoogleIcon>
//               <svg viewBox="0 0 24 24" width="100%" height="100%">
//                 <path
//                   fill="currentColor"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//             </GoogleIcon>
//             {googleLoading ? "Signing in..." : "Continue with Google"}
//           </GoogleButton>

//           <Divider>
//             <DividerText>Or continue with email</DividerText>
//           </Divider>

//           <Form onSubmit={handleSubmit}>
//             {error && <ErrorMessage $type={messageType}>{error}</ErrorMessage>}

//             <InputGroup>
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your email"
//                 autoComplete="email"
//               />
//             </InputGroup>

//             <InputGroup>
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//               />
//             </InputGroup>

//             <SubmitButton type="submit" disabled={loading} $loading={loading}>
//               {loading ? "Signing In..." : "Sign In"}
//             </SubmitButton>

//             <ForgotPasswordLink href="/forgot-password">
//               Forgot your password?
//             </ForgotPasswordLink>
//           </Form>
//         </GlassCard>
//       </Container>
//     </MobileOptimized>
//   );
// }
// In your LoginForm component, replace the current implementation

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

  // ... keep the rest of your component exactly the same ...
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
      await signIn("google", { callbackUrl: "/" });
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
            <StyledLink href="/signup">Sign up here</StyledLink>
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
