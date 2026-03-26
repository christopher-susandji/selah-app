import { Colors } from "./colors";

// ── Typography ────────────────────────────────────────────────────────────────
// Newsreader → Display & Headlines (literary, editorial)
// Plus Jakarta Sans → Body & UI (clean, functional)
// DM Serif Display → Large numbers & timestamps in History
//
// SYSTEM FALLBACKS — install network packages to restore full intentions:
//   npx expo install @expo-google-fonts/newsreader \
//     @expo-google-fonts/plus-jakarta-sans \
//     @expo-google-fonts/dm-serif-display
// Then load them in _layout.tsx via useFonts() and swap the Fonts constants below.

export const Fonts = {
  newsreaderLight: "Newsreader_300Light" as string | undefined,
  newsreaderRegular: "Newsreader_400Regular" as string | undefined,
  newsreaderItalic: "Newsreader_400Regular_Italic" as string | undefined,
  jakartaRegular: "PlusJakartaSans_400Regular" as string | undefined,
  jakartaMedium: "PlusJakartaSans_500Medium" as string | undefined,
  jakartaSemiBold: "PlusJakartaSans_600SemiBold" as string | undefined,
  dmSerifDisplay: "DMSerifDisplay_400Regular" as string | undefined,
} as const;

export const Type = {
  // — Newsreader display scale
  displayLg: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  displayMd: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  headlineLg: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 28,
    lineHeight: 38,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  headlineMd: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.1,
    color: Colors.textPrimary,
  },
  headlineSm: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    color: Colors.textPrimary,
  },
  // — Plus Jakarta Sans body & UI scale
  bodyLg: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0,
    color: Colors.textPrimary,
  },
  bodyMd: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    color: Colors.textPrimary,
  },
  bodySm: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.textSecondary,
  },
  labelLg: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0.1,
    color: Colors.textPrimary,
  },
  labelMd: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: Colors.textSecondary,
  },
  labelSm: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.8,
    color: Colors.textTertiary,
  },
  // — DM Serif Display for large numbers & timestamps
  numericDisplay: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    color: Colors.textPrimary,
  },
} as const;

// ── Spacing (4pt grid) ────────────────────────────────────────────────────────
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  gutter: 44, // 2.75rem — default horizontal gutter per design spec
} as const;

// ── Border Radii ──────────────────────────────────────────────────────────────
export const Radii = {
  sm: 8,
  md: 12,
  lg: 16, // 1rem
  xl: 24, // 1.5rem — CTA / primary buttons
} as const;

// ── Animation ─────────────────────────────────────────────────────────────────
// Slow, linear fades/slides only — no bounce, no spring.
export const Animation = {
  fast: 300,
  mid: 400,
  slow: 500,
} as const;

// ── Ghost Border helper ────────────────────────────────────────────────────────
// Structural whisper: outline-variant at 15% opacity.
export const ghostBorder = {
  borderWidth: 1,
  borderColor: "rgba(204, 196, 205, 0.15)",
} as const;

// ── Primary button gradient colours ───────────────────────────────────────────
// Top → bottom: primaryContainer → primary (weighted leather feel)
export const PrimaryGradient: [string, string] = [
  Colors.primaryContainer,
  Colors.primary,
];
