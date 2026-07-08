import { ImageResponse } from "next/og"
import { getSnippet } from "./snippet-data"
import { extractId } from "@/lib/seo"

export const runtime = "nodejs"
export const alt = "NUMINA code snippet"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage(props: {
  params: Promise<{ id: string }>
}) {
  const { id: rawParam } = await props.params
  const id = extractId(rawParam)
  const snippet = id ? await getSnippet(id) : null

  const title = snippet?.title ?? "NUMINA"
  const language = snippet?.language ?? "Code"
  const price = snippet ? `$${(snippet.price / 100).toFixed(2)}` : ""
  const author = snippet?.author ?? "sn-x.com"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: brand + language pill */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#6366f1",
                color: "#fff",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              {"</>"}
            </div>
            <span style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>NUMINA</span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#a5b4fc",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: "999px",
              padding: "8px 24px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {language}
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: title.length > 40 ? "56px" : "72px",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {title.length > 70 ? title.slice(0, 69) + "…" : title}
          </div>
          <div style={{ fontSize: "28px", color: "#9ca3af", display: "flex" }}>
            by {author}
          </div>
        </div>

        {/* Bottom row: price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {price ? (
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#fff" }}>{price}</span>
          ) : (
            <span />
          )}
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#6366f1" }}>
            Production-ready code · sn-x.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
