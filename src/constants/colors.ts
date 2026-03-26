// Living Library Design System — Ink & Paper palette
export const Colors = {
  // ── Surface hierarchy (light → dark) ──────────────────────
  surfaceContainerLowest: "#ffffff",
  background: "#fbf9f6",
  surface: "#fbf9f6",
  surfaceContainerLow: "#f5f3f0",
  surfaceContainer: "#efeeeb",
  surfaceContainerHigh: "#eae8e5",
  surfaceContainerHighest: "#e4e2df",

  // ── Brand / Primary ───────────────────────────────────────
  primary: "#271737", // darkest value — deep plum
  primaryContainer: "#3d2c4e", // top of CTA gradient / lighter plum
  onPrimary: "#ffffff",
  onPrimaryFixedVariant: "#513f63", // secondary button text

  // ── Secondary ─────────────────────────────────────────────
  secondary: "#655b6a",

  // ── Outline / Ghost Border ────────────────────────────────
  outlineVariant: "#ccc4cd",

  // ── Tertiary ──────────────────────────────────────────────
  tertiaryFixed: "#e7e0ee", // reading progress bar background

  // ── Text semantic aliases ─────────────────────────────────
  textPrimary: "#271737",
  textSecondary: "#655b6a",
  textTertiary: "#9b8fa0",
  textPlaceholder: "#b4aab9",
} as const;
