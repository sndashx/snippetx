import type { Metadata, Viewport } from "next"
import { buildMetadata } from "@/lib/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Playground",
  description:
    "Talk to minimax M3 in a streaming chat UI. Try the frontier agentic model in your browser — no account required.",
  path: "/playground",
})

export const viewport: Viewport = {
  themeColor: "#070708",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
