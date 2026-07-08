import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "NUMINA — Frontier Agentic AI Research Lab"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a14",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #5b7cfa 50%, #22d3ee 100%)",
              color: "#fff",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>NUMINA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Frontier intelligence, built to act.
          </div>
          <div style={{ fontSize: "28px", color: "#9ca3af", lineHeight: 1.4 }}>
            Building frontier agentic language models that reason, plan, and act.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#22d3ee",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            numina.ai
          </span>
          <span style={{ fontSize: "22px", color: "#6b7280" }}>·</span>
          <span style={{ fontSize: "22px", color: "#6b7280" }}>Agentic AI Research Lab</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
