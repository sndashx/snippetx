import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/visual/Reveal"
import { SectionHeading } from "@/components/visual/SectionHeading"
import { researchPapers, type ResearchKind } from "@/content/research"
import { cn } from "@/lib/utils"

function kindLabel(kind: ResearchKind) {
  if (kind === "release") return "Release"
  if (kind === "post") return "Post"
  return "Paper"
}

function kindAccent(kind: ResearchKind) {
  if (kind === "release") return "text-accent"
  if (kind === "post") return "text-foreground/80"
  return "text-foreground/70"
}

function authorList(authors: { name: string }[]) {
  if (authors.length === 0) return ""
  if (authors.length === 1) return authors[0].name
  if (authors.length === 2) return `${authors[0].name}, ${authors[1].name}`
  return `${authors[0].name}, ${authors[1].name}, et al.`
}

export function ResearchSection() {
  const papers = researchPapers

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="relative border-t border-border/70"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Research"
              title={
                <span id="research-heading">
                  Pushing the frontier, in the open
                </span>
              }
              description="Selected work from the minimax research team — released with code, weights (where possible), and the eval suites used to measure them."
            />
            <Link
              href="/research"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-card/50 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-foreground sm:self-end"
            >
              All research
              <ArrowRight className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ol
          role="list"
          className="mt-14 divide-y divide-border/60 border-y border-border/60"
        >
          {papers.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={Math.min(i * 0.05, 0.3)}>
                <Link
                  href={`/research/${p.slug}`}
                  className={cn(
                    "group relative block py-7 sm:py-8",
                    "transition-colors duration-300 ease-out-expo",
                  )}
                >
                  {/* hover wash */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 inset-y-0 -z-0 bg-gradient-to-r from-accent/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100"
                  />

                  <div className="relative grid grid-cols-12 items-baseline gap-x-6 gap-y-3">
                    <div className="col-span-12 flex items-center gap-3 sm:col-span-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.22em]",
                          kindAccent(p.kind),
                        )}
                      >
                        {kindLabel(p.kind)}
                      </span>
                      <span aria-hidden className="text-border">·</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.date}
                      </span>
                    </div>

                    <div className="col-span-12 sm:col-span-10">
                      <h3
                        className={cn(
                          "text-display-md font-display text-foreground",
                          "transition-colors duration-300 group-hover:text-accent",
                        )}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {authorList(p.authors)}
                      </p>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {p.abstract}
                      </p>

                      {p.tags && p.tags.length > 0 && (
                        <ul
                          role="list"
                          className="mt-4 flex flex-wrap gap-1.5"
                        >
                          {p.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-border/70 bg-background/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}

                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors group-hover:text-accent">
                        Read paper
                        <ArrowRight
                          className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}