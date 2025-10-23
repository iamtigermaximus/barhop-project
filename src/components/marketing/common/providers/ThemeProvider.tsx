"use client";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "@/lib/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
