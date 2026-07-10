import { getPaperBySlug, researchPapers, type ResearchPaper } from "@/content/research"
import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "minimax Research"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const kindLabel: Record<ResearchPaper["kind"], string> = {
  paper: "Research · Paper",
  post: "Research · Post",
  release: "Research · Release",
}

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const paper = getPaperBySlug(slug)
  const fallback = researchPapers[0]
  const title = paper?.title ?? fallback?.title ?? "Research"
  const kind = paper?.kind ?? fallback?.kind ?? "paper"
  return renderOg({
    eyebrow: kindLabel[kind],
    title: title.length > 48 ? `${title.slice(0, 46)}…` : title,
    subtitle: "minimax Research",
    meta: `/${slug}`,
  })
}