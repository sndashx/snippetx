/**
 * Design tokens — single source of truth for values that are consumed in
 * JavaScript/animation contexts (framer-motion transitions, charts, canvas)
 * and mirror the CSS custom properties defined in `src/app/globals.css`.
 *
 * Keep this file in sync with the token blocks in `globals.css`:
 *   :root / .dark  -> CSS variables
 *   @theme inline  -> Tailwind utilities
 *   this module    -> JS-accessible values
 */

export const easing = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuint: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOutQuint: "cubic-bezier(0.83, 0, 0.17, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const

export const durations = {
  fast: 0.15,
  base: 0.3,
  slow: 0.7,
} as const

export const easingArray = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutQuint: [0.83, 0, 0.17, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const

/** Standard elevation steps, mapped to the `--shadow-elevated-*` tokens. */
export const elevation = {
  1: "var(--shadow-elevated-1)",
  2: "var(--shadow-elevated-2)",
  3: "var(--shadow-elevated-3)",
  4: "var(--shadow-elevated-4)",
} as const

/** Semantic status roles, mapped to the `--*-foreground` text tokens. */
export const status = {
  success: { fg: "var(--success-foreground)", bg: "var(--success)" },
  warning: { fg: "var(--warning-foreground)", bg: "var(--warning)" },
  info: { fg: "var(--info-foreground)", bg: "var(--info)" },
  destructive: { fg: "var(--destructive-foreground)", bg: "var(--destructive)" },
} as const

export const radii = {
  sm: "calc(var(--radius) * 0.6)",
  md: "calc(var(--radius) * 0.8)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) * 1.4)",
  "2xl": "calc(var(--radius) * 1.8)",
  "3xl": "calc(var(--radius) * 2.2)",
  "4xl": "calc(var(--radius) * 2.6)",
} as const

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const

export const tokens = {
  easing,
  durations,
  easingArray,
  elevation,
  status,
  radii,
  zIndex,
} as const

export type Tokens = typeof tokens
