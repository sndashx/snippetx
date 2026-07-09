import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"
export const runtime = "nodejs"

// Brand favicon — a minimal "M" mark on the lab's paper background, using
// the signature acid-green accent. Generated at the edge so it stays in
// sync with the brand tokens in src/lib/brand.ts.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070708",
          color: "#c8ff00",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: -1,
          fontFamily: "system-ui, sans-serif",
          borderRadius: 6,
        }}
      >
        m
      </div>
    ),
    size,
  )
}