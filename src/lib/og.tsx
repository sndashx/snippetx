import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = "image/png" as const

export const ogColors = {
  ink: "#070708",
  inkRaised: "#0d0d10",
  paper: "#f4f1ea",
  paperMuted: "#a8a39a",
  accent: "#c8ff00",
  accentSoft: "#e8ff7a",
  grid: "rgba(255,255,255,0.05)",
  gridStrong: "rgba(255,255,255,0.10)",
} as const

export type OgFonts = {
  display: ArrayBuffer
  displayItalic: ArrayBuffer
  sans: ArrayBuffer
  sansBold: ArrayBuffer
  mono: ArrayBuffer
}

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400&display=swap"

type FontSpec = {
  family: string
  weight: number
  style: "normal" | "italic"
  url: string
}

async function loadFontSpecs(): Promise<FontSpec[]> {
  // Request TTF (not WOFF2) so Satori can read the glyph tables directly.
  // Google's CSS API only returns TTF for non-browser User-Agents.
  const cssRes = await fetch(FONT_CSS_URL, {
    headers: { "User-Agent": "curl/8.0" },
  })
  const css = await cssRes.text()
  const raw = css.split("@font-face").slice(1)
  const blocks = raw.map((block) => {
    const comment = block.match(/\/\*\s*([\w-]+)\s*\*\//)?.[1]
    return { comment, block }
  })
  const hasSubsets = blocks.some((b) => b.comment)
  const filtered = hasSubsets
    ? blocks.filter((b) => b.comment === "latin")
    : blocks
  const specs: FontSpec[] = []
  for (const { block } of filtered) {
    const family = block.match(/font-family:\s*'([^']+)'/)?.[1]
    const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1] ?? 400)
    const style = (block.match(/font-style:\s*(\w+)/)?.[1] ?? "normal") as
      | "normal"
      | "italic"
    const url = block.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1]
    if (family && url) {
      specs.push({ family, weight, style, url })
    }
  }
  return specs
}

let cachedFonts: OgFonts | null = null

export async function loadOgFonts(): Promise<OgFonts> {
  if (cachedFonts) return cachedFonts
  const specs = await loadFontSpecs()
  const byKey = (family: string, weight: number, style: "normal" | "italic") =>
    specs.find(
      (s) => s.family === family && s.weight === weight && s.style === style,
    )
  const needed: Array<FontSpec | undefined> = [
    byKey("Instrument Serif", 400, "normal"),
    byKey("Instrument Serif", 400, "italic"),
    byKey("Inter", 400, "normal"),
    byKey("Inter", 600, "normal"),
    byKey("JetBrains Mono", 400, "normal"),
  ]
  const missing = needed.findIndex((s) => !s)
  if (missing !== -1) {
    throw new Error(`OG fonts: missing required font spec at index ${missing}`)
  }
  const buffers = await Promise.all(
    (needed as FontSpec[]).map((s) => fetch(s.url).then((r) => r.arrayBuffer())),
  )
  cachedFonts = {
    display: buffers[0],
    displayItalic: buffers[1],
    sans: buffers[2],
    sansBold: buffers[3],
    mono: buffers[4],
  }
  return cachedFonts
}

export function ogFontConfig(fonts: OgFonts) {
  return [
    { name: "Instrument Serif", data: fonts.display, weight: 400 as const, style: "normal" as const },
    { name: "Instrument Serif", data: fonts.displayItalic, weight: 400 as const, style: "italic" as const },
    { name: "Inter", data: fonts.sans, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: fonts.sansBold, weight: 600 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: fonts.mono, weight: 400 as const, style: "normal" as const },
  ]
}

export type OgCardProps = {
  eyebrow: string
  title: string
  subtitle?: string
  meta?: string
  accent?: "accent" | "muted"
}

/**
 * Shared cinematic OG card layout used by /opengraph-image,
 * /model/opengraph-image, and /research/[slug]/opengraph-image.
 *
 * 1200x630. Ink background, subtle grid, soft accent glow,
 * display-serif title with a small mono eyebrow.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
  meta,
  accent = "accent",
}: OgCardProps) {
  const accentColor = accent === "accent" ? ogColors.accent : ogColors.paperMuted
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: ogColors.ink,
        backgroundImage: `
          radial-gradient(900px circle at 12% -10%, ${ogColors.accent}26, transparent 55%),
          radial-gradient(700px circle at 95% 110%, ${ogColors.accent}14, transparent 55%),
          linear-gradient(${ogColors.ink} 0 0)
        `,
        color: ogColors.paper,
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${ogColors.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${ogColors.grid} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          display: "flex",
        }}
      />

      {/* Top hairline + frame */}
      <div
        style={{
          position: "absolute",
          inset: 32,
          border: `1px solid ${ogColors.gridStrong}`,
          borderRadius: 4,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: `1.5px solid ${ogColors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ogColors.accent,
              fontSize: 24,
              fontWeight: 600,
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: -0.5,
            }}
          >
            m
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 18,
              color: ogColors.paperMuted,
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            color: ogColors.paperMuted,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: ogColors.accent,
              display: "flex",
              boxShadow: `0 0 12px ${ogColors.accent}`,
            }}
          />
          sn-x.com
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          position: "relative",
          maxWidth: 1000,
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
            fontSize: 32,
            color: accentColor,
            letterSpacing: -0.5,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {subtitle ?? "minimax M3"}
        </div>
        <div
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: 124,
            lineHeight: 0.96,
            letterSpacing: -4,
            color: ogColors.paper,
            display: "flex",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 18,
            color: ogColors.paperMuted,
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "flex",
            gap: 18,
          }}
        >
          <span style={{ color: ogColors.paper }}>Agentic</span>
          <span style={{ color: ogColors.gridStrong }}>·</span>
          <span style={{ color: ogColors.paper }}>Reasoning</span>
          <span style={{ color: ogColors.gridStrong }}>·</span>
          <span style={{ color: ogColors.paper }}>Tool-use</span>
        </div>
        {meta ? (
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 18,
              color: ogColors.paperMuted,
              letterSpacing: 2,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export async function renderOg(props: OgCardProps): Promise<ImageResponse> {
  const fonts = await loadOgFonts()
  return new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: ogFontConfig(fonts),
  })
}
