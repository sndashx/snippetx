import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "minimax M3 — Frontier agentic language model"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function OG() {
  return renderOg({
    eyebrow: "Model · Flagship",
    title: "minimax M3",
    subtitle: "Frontier agentic",
    meta: "1M context · vision · tools",
  })
}
