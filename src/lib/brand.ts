import type { Metadata } from "next"
import { APP_URL } from "@/lib/constants"

/**
 * Brand constants for the public lab website.
 *
 * Tokens (colors, fonts, easings) live in `src/app/globals.css` under
 * `@theme inline {}` because this project uses Tailwind v4 with the
 * `@tailwindcss/postcss` plugin — there is no `tailwind.config.ts` to extend.
 * Constants exported here are the *single source of truth* for marketing
 * copy (lab name, tagline, flagship model, family) and for code that needs
 * to reference brand metadata (e.g. Next.js Metadata).
 */

export const labName = "minimax"
export const labNameLong = "minimax Research"
export const tagline = "Frontier agentic intelligence, built in the open."
export const description =
  "minimax is a small AI research lab building agentic language models and advancing the frontier of machine intelligence. Our flagship model is minimax M3."

export const themeColor = "#070708"

export const modelFlagship = {
  name: "minimax M3",
  codename: "M3",
  tagline:
    "A frontier agentic language model — reasoning, tool-use, and long-horizon planning.",
  family: [
    { name: "minimax M3", codename: "M3", status: "flagship" },
    { name: "minimax M3-mini", codename: "M3-mini", status: "available" },
    { name: "minimax M3-nano", codename: "M3-nano", status: "available" },
  ],
} as const

/** Tailwind color tokens (must match `--color-*` in globals.css @theme). */
export const colors = {
  ink: "#070708",
  inkRaised: "#0d0d10",
  paper: "#f4f1ea",
  paperMuted: "#a8a39a",
  accent: "#c8ff00",
  accentSoft: "#e8ff7a",
  noise: "#ffffff",
  grid: "#ffffff",
} as const

/** next/font CSS variable names wired in src/app/layout.tsx. */
export const fonts = {
  /** Serif display family — hero, editorial moments. */
  displayVar: "--font-display",
  /** Neo-grotesque sans — UI, body. */
  sansVar: "--font-sans",
  /** Monospace — code, numbers, ticker. */
  monoVar: "--font-mono",
} as const

export const social = {
  ogImage: "/og.svg",
  twitterCard: "summary_large_image",
} as const

/**
 * Build a Next.js Metadata object for a route on the lab site.
 * Pass a title (or undefined for default) and optional description.
 */
export function buildMetadata(opts?: {
  title?: string
  description?: string
  path?: string
}): Metadata {
  const title = opts?.title
    ? `${opts.title} — ${labName}`
    : `${labName} — Frontier agentic intelligence`
  const desc = opts?.description ?? description
  const url = opts?.path ? `${APP_URL}${opts.path}` : APP_URL
  return {
    title,
    description: desc,
    metadataBase: new URL(APP_URL),
    applicationName: labName,
    authors: [{ name: labNameLong }],
    keywords: [
      "minimax",
      "M3",
      "agentic AI",
      "frontier models",
      "language models",
      "AI research lab",
      "artificial intelligence",
    ],
    openGraph: {
      type: "website",
      title,
      description: desc,
      url,
      siteName: labName,
    },
    twitter: {
      card: social.twitterCard,
      title,
      description: desc,
    },
    alternates: {
      canonical: opts?.path ?? "/",
    },
  }
}