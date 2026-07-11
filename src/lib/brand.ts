import type { Metadata } from "next"
import { APP_URL } from "@/lib/constants"

/**
 * Brand constants for the SN-X Research Institution for Complex Science website.
 *
 * Tokens (colors, fonts, easings) live in `src/app/globals.css` under
 * `@theme inline {}` because this project uses Tailwind v4 with the
 * `@tailwindcss/postcss` plugin — there is no `tailwind.config.ts` to extend.
 * Constants exported here are the *single source of truth* for marketing
 * copy (institution name, tagline, research axes, programs) and for code that
 * needs to reference brand metadata (e.g. Next.js Metadata).
 */

export const labName = "SN-X"
export const labNameLong = "SN-X Research Institution for Complex Science"
export const tagline =
  "A research institution studying the mathematics of emergence."
export const description =
  "SN-X is a private research institution dedicated to the mathematics, computation, and philosophy of complex systems. We study how simple rules give rise to rich behaviour — in cells, in societies, in minds, and in the machines we build."

export const themeColor = "#06080f"

/** Flagship outputs — papers, instruments, datasets the institution is known for. */
export const modelFlagship = {
  name: "SN-X Papers",
  codename: "Papers",
  tagline:
    "Working papers across the five research axes. Published in arXiv, Nat. Phys., PNAS, and journals of record.",
  family: [
    { name: "SN-X Papers", codename: "Papers", status: "flagship" },
    { name: "Letters", codename: "Letters", status: "available" },
    { name: "Reviews", codename: "Reviews", status: "available" },
  ],
} as const

/** The five research axes SN-X is organized around. */
export const researchAxes = [
  {
    id: "complexity",
    name: "Foundations of Complexity",
    summary:
      "The mathematics of emergence: phase transitions, critical phenomena, universality classes, and the limits of reduction.",
  },
  {
    id: "computation",
    name: "Computation & Information",
    summary:
      "Algorithmic information, statistical learning, and the geometry of representations learned by large models.",
  },
  {
    id: "biological",
    name: "Biological Complex Systems",
    summary:
      "Morphogenesis, immune learning, neural development, and the regulatory architectures of living matter.",
  },
  {
    id: "social",
    name: "Social & Economic Complexity",
    summary:
      "Markets as distributed computation; institutions as equilibria; cooperation, conventions, and collapse.",
  },
  {
    id: "foundations",
    name: "Foundations of Inference",
    summary:
      "Causal identification, decision theory under deep uncertainty, and the epistemology of model-based reasoning.",
  },
] as const

/** Flagship outputs — papers, instruments, datasets the institution is known for. */
export const flagshipOutputs = {
  papers: {
    name: "SN-X Papers",
    codename: "Papers",
    tagline:
      "Working papers across the five research axes. Published in arXiv, Nat. Phys., PNAS, and journals of record.",
    family: [
      { name: "SN-X Papers", codename: "Papers", status: "flagship" },
      { name: "Letters", codename: "Letters", status: "available" },
      { name: "Reviews", codename: "Reviews", status: "available" },
    ],
  },
  instruments: {
    name: "SN-X Instruments",
    codename: "Instruments",
    tagline:
      "Open-source instruments — simulators, benchmarks, datasets — that operationalize our theoretical work.",
  },
  fellows: {
    name: "SN-X Fellows",
    codename: "Fellows",
    tagline:
      "A residential fellowship for researchers across mathematics, physics, biology, and computation.",
  },
} as const

/** Tailwind color tokens (must match `--color-*` in globals.css @theme). */
export const colors = {
  ink: "#06080f",
  inkRaised: "#0c0f1a",
  paper: "#ece7d8",
  paperMuted: "#8a8478",
  accent: "#d4a574",
  accentSoft: "#e8c89a",
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
 * Build a Next.js Metadata object for a route on the institution site.
 * Pass a title (or undefined for default) and optional description.
 */
export function buildMetadata(opts?: {
  title?: string
  description?: string
  path?: string
}): Metadata {
  const title = opts?.title
    ? `${opts.title} — ${labName}`
    : `${labName} — The mathematics of emergence`
  const desc = opts?.description ?? description
  const url = opts?.path ? `${APP_URL}${opts.path}` : APP_URL
  return {
    title,
    description: desc,
    metadataBase: new URL(APP_URL),
    applicationName: labName,
    authors: [{ name: labNameLong }],
    keywords: [
      "SN-X",
      "complex systems",
      "complexity science",
      "emergence",
      "research institution",
      "Santa Fe Institute",
      "complex adaptive systems",
      "foundations",
    ],
    openGraph: {
      type: "website",
      title,
      description: desc,
      url,
      siteName: labName,
      images: [
        {
          url: social.ogImage,
          width: 1200,
          height: 630,
          alt: `${labName} — The mathematics of emergence`,
        },
      ],
    },
    twitter: {
      card: social.twitterCard,
      title,
      description: desc,
      images: [social.ogImage],
    },
    alternates: {
      canonical: opts?.path ?? "/",
    },
  }
}