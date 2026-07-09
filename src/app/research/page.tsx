import Link from "next/link"
import type { Metadata } from "next"
import { researchPapers, type ResearchPaper } from "@/content/research"
import { buildMetadata } from "@/lib/brand"
import { cn } from "@/lib/utils"

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Papers, posts, and release notes from minimax — deliberative agents, sparse mixtures, alignment, and the minimax M3 system card.",
  path: "/research",
})

export const dynamic = "force-static"

const kindLabel: Record<ResearchPaper["kind"], string> = {
  paper: "Paper",
  post: "Post",
  release: "Release",
}

function formatDate(paper: ResearchPaper) {
  if (paper.iso) {
    const d = new Date(paper.iso)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  return paper.date
}

export default function ResearchIndexPage() {
  // Newest first.
  const papers = [...researchPapers].sort((a, b) => {
    const ai = a.iso ? Date.parse(a.iso) : 0
    const bi = b.iso ? Date.parse(b.iso) : 0
    return bi - ai
  })

  return (
    <div className="relative min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-44">
        <header className="mb-16 max-w-3xl">
          <p className="text-eyebrow">Research · Index</p>
          <h1 className="mt-4 text-display-lg text-balance text-foreground">
            Notes from the frontier.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Papers, technical posts, and release notes from the team building
            minimax M3. We publish what we learn, even when it&apos;s mid-progress.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          {/* Sticky left index */}
          <aside aria-label="Research index" className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 text-eyebrow">
              {papers.length} artifacts
            </p>
            <ol className="flex flex-col gap-1 border-l border-border">
              {papers.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/research/${p.slug}`}
                    className={cn(
                      "group -ml-px flex flex-col gap-0.5 border-l border-transparent py-2 pl-4 pr-2 transition-all",
                      "hover:border-accent hover:bg-card/40",
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {kindLabel[p.kind]}
                    </span>
                    <span className="text-sm text-foreground/85 transition-colors group-hover:text-foreground">
                      {p.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>

          {/* Reading area */}
          <div className="flex flex-col divide-y divide-border/60">
            {papers.map((p, i) => (
              <article
                key={p.slug}
                id={p.slug}
                className="grid gap-6 py-10 sm:grid-cols-[8rem_1fr] sm:gap-10"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
                      p.kind === "release"
                        ? "border-accent/40 text-accent"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {kindLabel[p.kind]}
                  </span>
                  <time className="font-mono text-xs text-muted-foreground">
                    {formatDate(p)}
                  </time>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-display-md text-balance text-foreground">
                    <Link
                      href={`/research/${p.slug}`}
                      className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
                    {p.abstract}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {p.authors.slice(0, 3).map((a, idx) => (
                      <span key={a.name} className="inline-flex items-center gap-2">
                        <span>{a.name}</span>
                        {idx < Math.min(p.authors.length, 3) - 1 && (
                          <span aria-hidden className="text-border">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-card/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <Link
                      href={`/research/${p.slug}`}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Read paper →
                    </Link>
                    {p.canonical && (
                      <a
                        href={p.canonical.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {p.canonical.label} ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}