import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "NUMINA — Frontier Agentic AI Research Lab"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(900px circle at 20% 0%, oklch(0.62 0.21 285 / 0.35), transparent 60%), radial-gradient(900px circle at 90% 30%, oklch(0.78 0.15 200 / 0.3), transparent 60%), oklch(0.14 0.02 265)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "2px solid oklch(0.78 0.15 200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>NUMINA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
            Frontier intelligence,
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
              background: "linear-gradient(90deg, oklch(0.62 0.21 285), oklch(0.78 0.15 200))",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            built to act.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "oklch(0.66 0.03 265)" }}>
            Frontier Agentic AI Research Lab
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 22, color: "oklch(0.66 0.03 265)" }}>
          <span>Agentic</span>
          <span>•</span>
          <span>Reasoning</span>
          <span>•</span>
          <span>Tool-use</span>
          <span>•</span>
          <span>Safety-aligned</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
