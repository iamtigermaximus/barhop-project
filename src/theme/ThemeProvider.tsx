// src/theme/ThemeProvider.tsx
"use client";

import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "./Theme"; // ← Change from "./Theme" to "./theme" (lowercase)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
