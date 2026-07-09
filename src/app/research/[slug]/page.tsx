import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft, ExternalLink } from "lucide-react"
import {
  researchPapers,
  getPaperBySlug,
  type ResearchPaper,
} from "@/content/research"
import { buildMetadata } from "@/lib/brand"
import { renderMarkdown } from "@/lib/markdown"
import { cn } from "@/lib/utils"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return researchPapers.map((p) => ({ slug: p.slug }))
}

const kindLabel: Record<ResearchPaper["kind"], string> = {
  paper: "Paper",
  post: "Post",
  release: "Release",
}

function formatLongDate(iso?: string, fallback?: string) {
  if (iso) {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  return fallback ?? ""
}

export async function generateMetadata(
  props: PageProps<"/research/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params
  const paper = getPaperBySlug(slug)
  if (!paper) return buildMetadata({ title: "Not found", path: "/research" })
  return buildMetadata({
    title: paper.title,
    description: paper.abstract,
    path: `/research/${paper.slug}`,
  })
}

export default async function ResearchPaperPage(
  props: PageProps<"/research/[slug]">,
) {
  const { slug } = await props.params
  const paper = getPaperBySlug(slug)
  if (!paper) notFound()

  // Sibling list — sticky right rail.
  const sorted = [...researchPapers].sort((a, b) => {
    const ai = a.iso ? Date.parse(a.iso) : 0
    const bi = b.iso ? Date.parse(b.iso) : 0
    return bi - ai
  })
  const idx = sorted.findIndex((p) => p.slug === paper.slug)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null

  return (
    <div className="relative min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-32 pt-32 lg:grid-cols-[1fr_18rem] lg:gap-16">
        <article className="min-w-0">
          <Link
            href="/research"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            All research
          </Link>

          <header className="mb-12 max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
                  paper.kind === "release"
                    ? "border-accent/40 text-accent"
                    : "border-border text-muted-foreground",
                )}
              >
                {kindLabel[paper.kind]}
              </span>
              <span className="font-mono">{formatLongDate(paper.iso, paper.date)}</span>
              {paper.tags?.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="hidden rounded-full border border-border bg-card/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] sm:inline-flex"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-display-lg text-foreground">{paper.title}</h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {paper.abstract}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {paper.authors.map((a, i) => (
                <span key={a.name} className="inline-flex items-center gap-1.5">
                  <span className="text-foreground/85">{a.name}</span>
                  {a.affiliation && (
                    <span className="text-xs text-muted-foreground/70">
                      {a.affiliation}
                    </span>
                  )}
                  {i < paper.authors.length - 1 && (
                    <span aria-hidden className="ml-3 text-border">·</span>
                  )}
                </span>
              ))}
            </div>

            {paper.canonical && (
              <a
                href={paper.canonical.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-card/70"
              >
                View on {paper.canonical.label}
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </header>

          <div className="max-w-3xl">{renderMarkdown(paper.body)}</div>

          <nav
            aria-label="Paper navigation"
            className="mt-20 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/research/${prev.slug}`}
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/30 p-5 transition-colors hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Previous
                </span>
                <span className="text-base font-medium text-foreground transition-colors group-hover:text-accent">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/research/${next.slug}`}
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/30 p-5 text-right transition-colors hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Next
                </span>
                <span className="text-base font-medium text-foreground transition-colors group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside aria-label="More research" className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            More research
          </p>
          <ol className="flex flex-col gap-1 border-l border-border">
            {sorted.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/research/${p.slug}`}
                  aria-current={p.slug === paper.slug ? "true" : undefined}
                  className={cn(
                    "group -ml-px flex flex-col gap-0.5 border-l py-2 pl-4 pr-2 transition-all",
                    p.slug === paper.slug
                      ? "border-accent bg-card/50"
                      : "border-transparent hover:border-accent/60 hover:bg-card/30",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.18em]",
                      p.slug === paper.slug
                        ? "text-accent"
                        : "text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} · {kindLabel[p.kind]}
                  </span>
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      p.slug === paper.slug
                        ? "text-foreground"
                        : "text-foreground/70 group-hover:text-foreground",
                    )}
                  >
                    {p.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  )
}