/**
 * Unified Design System Theme
 * Central source of truth for colors, typography, spacing, radii, and shadows
 */

const COLORS = {
  primary: "#2563eb", // blue-600
  primaryLight: "#60a5fa", // blue-400
  primaryDark: "#1e40af", // blue-800
  secondary: "#f59e42", // orange-400
  background: "#f8fafc", // slate-50
  surface: "#ffffff",
  border: "#e2e8f0", // slate-200
  muted: "#64748b", // slate-500
  text: "#1e293b", // slate-800
  textLight: "#f1f5f9", // slate-100
  success: "#22c55e", // green-500
  warning: "#facc15", // yellow-400
  error: "#ef4444", // red-500
  info: "#0ea5e9", // sky-500
  shadow: "rgba(30, 41, 59, 0.08)",
};

const TYPOGRAPHY = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.25rem", // 20px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
};

const RADII = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  full: "9999px",
};

const SHADOWS = {
  sm: "0 1px 2px 0 " + COLORS.shadow,
  md: "0 2px 8px 0 " + COLORS.shadow,
  lg: "0 4px 16px 0 " + COLORS.shadow,
};

const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radii: RADII,
  shadows: SHADOWS,
};

export default theme;
