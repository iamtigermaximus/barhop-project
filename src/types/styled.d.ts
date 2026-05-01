// import "styled-components";

// declare module "styled-components" {
//   export interface DefaultTheme {
//     colors: {
//       primary: {
//         50: string;
//         100: string;
//         200: string;
//         300: string;
//         400: string;
//         500: string;
//         600: string;
//         700: string;
//         800: string;
//         900: string;
//       };
//       secondary: {
//         50: string;
//         100: string;
//         200: string;
//         300: string;
//         400: string;
//         500: string;
//         600: string;
//         700: string;
//         800: string;
//         900: string;
//       };
//       gray: {
//         50: string;
//         100: string;
//         200: string;
//         300: string;
//         400: string;
//         500: string;
//         600: string;
//         700: string;
//         800: string;
//         900: string;
//       };
//       background: string;
//       surface: string;
//       text: {
//         primary: string;
//         secondary: string;
//         muted: string;
//       };
//     };
//     spacing: {
//       xs: string;
//       sm: string;
//       md: string;
//       lg: string;
//       xl: string;
//       xxl: string;
//     };
//     borderRadius: {
//       sm: string;
//       md: string;
//       lg: string;
//       xl: string;
//     };
//     breakpoints: {
//       mobile: string;
//       tablet: string;
//       laptop: string;
//       desktop: string;
//     };
//     typography: {
//       fontSize: {
//         xs: string;
//         sm: string;
//         base: string;
//         lg: string;
//         xl: string;
//         "2xl": string;
//         "3xl": string;
//         "4xl": string;
//         "5xl": string;
//       };
//       fontWeight: {
//         normal: string;
//         medium: string;
//         semibold: string;
//         bold: string;
//       };
//     };
//     shadows: {
//       sm: string;
//       md: string;
//       lg: string;
//       xl: string;
//     };
//   }
// }
// src/theme/styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primaryBackground: string;
      secondaryBackground: string;
      tertiaryBackground: string;
      primaryAccent: string;
      secondaryAccent: string;
      textPrimary: string;
      textSecondary: string;
      textMuted: string;
      border: string;
      borderAccent: string; // Add this
      success: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string; // Add this
      "3xl": string; // Add this
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string; // Add this
      "3xl": string; // Add this
    };
    fonts: {
      // Add this entire section
      space: string;
      dm: string;
      mono: string;
    };
    breakpoints: {
      // Add this entire section
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
    };
  }
}
