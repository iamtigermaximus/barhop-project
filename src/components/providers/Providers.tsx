// // src/components/providers/Providers.tsx
// "use client";
// import { SessionProvider } from "next-auth/react";
// import ThemeProvider from "./ThemeProvider";

// export default function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <SessionProvider>
//       <ThemeProvider>{children}</ThemeProvider>
//     </SessionProvider>
//   );
// }
"use client";
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
