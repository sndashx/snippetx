import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedHeadline } from "@/components/visual/AnimatedHeadline"
import { HeroCanvas } from "@/components/marketing/hero-canvas"
import { ModelSwitcher } from "@/components/marketing/model-switcher"
import { Magnetic } from "@/components/marketing/magnetic"
import { modelFlagship, labNameLong, tagline } from "@/lib/brand"
import { recentResearch } from "@/content/research"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section
      aria-label="Introducing minimax M3 — frontier model launch"
      className="relative isolate overflow-hidden"
    >
      <HeroCanvas />

      <div className="relative mx-auto grid min-h-[88svh] max-w-7xl items-center gap-14 px-6 pb-24 pt-28 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-32">
        <div className="flex flex-col">
          <div
            className="mb-7 fade-in-up"
            style={{ animationDelay: "60ms", animationFillMode: "both" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              <Sparkles className="size-3 text-accent" aria-hidden />
              <span>Frontier model · Lab update</span>
              <span aria-hidden className="mx-1 h-3 w-px bg-border" />
              <span className="text-foreground/80">{labNameLong}</span>
            </span>
          </div>

          <AnimatedHeadline
            as="h1"
            text="Introducing minimax M3."
            gradientWords={["M3."]}
            delay={0.18}
            className="text-display-xl block max-w-3xl text-foreground"
          />

          <p
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl fade-in-up"
            style={{ animationDelay: "520ms", animationFillMode: "both" }}
          >
            {tagline} A frontier agentic language model with deep reasoning,
            native tool-use, and a one-million-token window — available today
            in the {labNameLong} API.
          </p>

          <div
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 fade-in-up"
            style={{ animationDelay: "680ms", animationFillMode: "both" }}
          >
            <Magnetic strength={8} radius={120}>
              <Button
                size="lg"
                render={<Link href="/#research" />}
                className="h-12 rounded-full bg-accent px-7 text-base font-semibold text-background shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--accent)_70%,transparent)] transition-all hover:neon-glow"
              >
                Read the paper
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Button>
            </Magnetic>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/playground" />}
              className="h-12 rounded-full border-border bg-card/40 px-7 text-base font-semibold backdrop-blur transition-all hover:bg-card/70"
            >
              Try in playground
            </Button>
          </div>
        </div>

        <div
          className="w-full lg:justify-self-end fade-in-up"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          <ModelSwitcher
            models={
              modelFlagship.family as unknown as Parameters<
                typeof ModelSwitcher
              >[0]["models"]
            }
          />
        </div>
      </div>

      {/* Research ticker — text-only elegant marquee. */}
      <div
        aria-label="Recent research artifacts"
        className="relative border-y border-border/70 bg-card/30 py-5 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6">
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Recent
          </span>
          <div className="mask-fade-x relative flex-1 overflow-hidden">
            <div
              className="marquee flex w-max shrink-0"
              style={{ ["--marquee-duration" as string]: "55s" }}
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
                      ? "Release"
                      : r.kind === "post"
                        ? "Post"
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