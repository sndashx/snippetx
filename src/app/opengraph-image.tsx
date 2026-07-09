import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "minimax M3 — Frontier agentic intelligence, built in the open."
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
            "radial-gradient(900px circle at 15% 0%, rgba(200,255,0,0.18), transparent 60%), radial-gradient(900px circle at 90% 40%, rgba(232,255,122,0.14), transparent 60%), #070708",
          color: "#f4f1ea",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "2px solid #c8ff00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 600,
              color: "#c8ff00",
            }}
          >
            m
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: -0.5 }}>minimax</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 124, fontWeight: 400, letterSpacing: -4, lineHeight: 1.0, fontStyle: "italic" }}>
            minimax M3
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 36,
              fontStyle: "italic",
              color: "#c8ff00",
              letterSpacing: -0.5,
            }}
          >
            Frontier agentic intelligence,
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: "italic",
              color: "#c8ff00",
              letterSpacing: -0.5,
            }}
          >
            built in the open.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 20,
            color: "#a8a39a",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
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