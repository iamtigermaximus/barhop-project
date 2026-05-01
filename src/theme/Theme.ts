// src/theme/Theme.ts
import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primaryBackground: "#0a0a0f",
    secondaryBackground: "#1a1a2e",
    tertiaryBackground: "#2a2a3e",
    primaryAccent: "#8b5cf6",
    secondaryAccent: "#0ea5e9",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    border: "#33334e",
    borderAccent: "#4a4a6e",
    success: "#22c55e",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
  },
  fonts: {
    space: "'Space Grotesk', monospace",
    dm: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};
