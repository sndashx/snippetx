import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroCanvas } from "@/components/marketing/hero-canvas"
import { labNameLong } from "@/lib/brand"
import { recentResearch } from "@/content/research"
import { cn } from "@/lib/utils"

/**
 * SN-X Research Institution — homepage hero.
 *
 * Composition principles:
 *   1.  Eyebrow (mono, restrained) → sets tone of scholarship.
 *   2.  Monumental serif headline — single sentence the reader cannot miss.
 *   3.  Quiet supporting paragraph — what we study and where we sit.
 *   4.  Two-column ornament: a "Figure 1" — a small mathematical statement
 *       (Unicode, no LaTeX dependency) treated as an exhibit, the way a
 *       paper would render an equation under a figure caption.
 *   5.  CTA row — primary action (read recent paper) + secondary (fellowship).
 *   6.  Marquee ticker of recent working papers — the rhythm of the institution.
 */
export function Hero() {
  return (
    <section
      aria-label={`${labNameLong} — homepage`}
      className="relative isolate overflow-hidden"
    >
      <HeroCanvas />

      {/* Decorative manuscript grid — paper-like, not chrome. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[88svh] opacity-50"
      >
        <div className="absolute inset-0 bg-grid-fine" />
      </div>

      <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-12 px-6 pb-28 pt-28 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-36">
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div
            className="mb-8 fade-in-up"
            style={{ animationDelay: "60ms", animationFillMode: "both" }}
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-border bg-card/55 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
              />
              <span className="text-foreground/85">Resident fellowship · MMXXVI</span>
              <span aria-hidden className="mx-1 h-3 w-px bg-border" />
              <span>{labNameLong}</span>
            </span>
          </div>

          {/* Monumental headline — plain text on first paint for above-the-fold fidelity. */}
          <h1
            className="text-display-xl block max-w-5xl text-foreground fade-in-up"
            style={{ animationDelay: "180ms", animationFillMode: "both" }}
          >
            The mathematics of{" "}
            <span className="text-gradient italic">emergence</span>
            <span className="text-accent">.</span>
          </h1>

          {/* Tagline + descriptor */}
          <p
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl fade-in-up"
            style={{ animationDelay: "560ms", animationFillMode: "both" }}
          >
            SN-X is a private research institution studying how simple rules
            give rise to rich behaviour — in cells, in societies, in minds, and
            in the machines we build.
          </p>

          {/* CTAs */}
          <div
            className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 fade-in-up"
            style={{ animationDelay: "720ms", animationFillMode: "both" }}
          >
            <Button
              size="lg"
              render={<Link href="/#research" />}
              className="h-12 rounded-full bg-accent px-7 text-base font-semibold text-background shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--accent)_70%,transparent)] transition-all hover:neon-glow"
            >
              Read the latest paper
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/#fellowship" />}
              className="h-12 rounded-full border-border bg-card/40 px-7 text-base font-semibold backdrop-blur transition-all hover:bg-card/70"
            >
              Apply for residency
            </Button>
          </div>

          {/* Footer-of-hero micro-attribution */}
          <div
            className="mt-14 flex items-center gap-4 text-xs text-muted-foreground/80 fade-in-up"
            style={{ animationDelay: "880ms", animationFillMode: "both" }}
          >
            <span className="font-mono uppercase tracking-[0.22em] text-[10px]">
              Founded
            </span>
            <span aria-hidden className="h-px flex-1 max-w-[72px] bg-border" />
            <span className="font-mono text-[11px]">MMXXI · Cambridge &amp; Marfa</span>
          </div>
        </div>

        {/* Right column — a "Figure 1" with a small mathematical exhibit. */}
        <aside
          aria-label="Figure 1 — a working statement from the Foundations of Complexity axis"
          className="fade-in-up relative w-full lg:justify-self-end"
          style={{ animationDelay: "420ms", animationFillMode: "both" }}
        >
          <figure className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/55 p-7 backdrop-blur sm:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-brand-2/10 blur-3xl"
            />

            <figcaption className="relative mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <span className="text-accent">Figure 1</span>
              <span>SN-X / Foundations of Complexity</span>
            </figcaption>

            <div className="relative font-display text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] tracking-tight text-foreground">
              <span aria-hidden className="select-none text-accent/60">∂</span>
              <span className="italic">ρ</span>
              <span aria-hidden className="select-none">/</span>
              <span aria-hidden className="select-none text-accent/60">∂</span>
              <span className="italic">t</span>
              <span className="px-2 text-muted-foreground/50">=</span>
              <span className="font-mono text-[0.7em] text-foreground/95">
                <span className="italic">D</span> ∇²<span className="italic">ρ</span>
              </span>
              <span className="px-2 text-muted-foreground/50">+</span>
              <span className="font-mono text-[0.7em] text-foreground/95">
                <span className="italic">f</span>(<span className="italic">ρ</span>) <span className="text-accent">+</span> <span className="italic">ξ</span>(<span className="italic">t</span>)
              </span>
            </div>

            <p className="relative mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              The density obeys a reaction–diffusion equation with quenched
              disorder. In heterogeneous substrates the bifurcation ceases to
              be a point and becomes a <em className="not-italic text-foreground/90">band</em> —
              a finite region of parameter space where scale-free avalanches
              emerge without tuning.
            </p>

            <div className="relative mt-7 flex items-center gap-3 border-t border-border/60 pt-5 font-mono text-[11px] text-muted-foreground">
              <span className="text-accent">→</span>
              <Link
                href="/research/criticality-without-fine-tuning"
                className="text-foreground/85 transition-colors hover:text-accent"
              >
                Vance, Okafor &amp; Mercer · SN-X/2026/0312
              </Link>
            </div>
          </figure>
        </aside>
      </div>

      {/* Research ticker — text-only elegant marquee. */}
      <div
        aria-label="Recent research artifacts"
        className="relative border-y border-border/70 bg-card/30 py-5 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6">
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:inline">
            Recent working papers
          </span>
          <div className="mask-fade-x relative flex-1 overflow-hidden">
            <div
              className="marquee flex w-max shrink-0"
              style={{ ["--marquee-duration" as string]: "65s" }}
            >
              {[...recentResearch, ...recentResearch].map((r, i) => (
                <span
                  key={`${r.title}-${i}`}
                  className="mx-6 inline-flex items-center gap-3 whitespace-nowrap text-sm text-muted-foreground"
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.2em]",
                      r.kind === "release"
                        ? "text-accent"
                        : "text-foreground/60",
                    )}
                  >
                    {r.kind === "release"
                      ? "Instrument"
                      : r.kind === "post"
                        ? "Essay"
                        : "Paper"}
                  </span>
                  <span className="text-foreground/85">{r.title}</span>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/80">
                    {r.date}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}