import Link from "next/link"
import { labName } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative border-t border-border/70 bg-card/30 backdrop-blur"
      aria-labelledby="site-footer-heading"
    >
      <h2 id="site-footer-heading" className="sr-only">
        {labName} — site footer
      </h2>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-baseline gap-2 font-display text-xl text-foreground"
            >
              {labName}
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Research
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A small research lab building frontier agentic language models.
              We publish our work, our evals, and our failure modes.
            </p>
            <div className="mt-6">
              <StatusPill />
            </div>
          </div>

          <FooterColumn
            heading="Lab"
            links={[
              { label: "Model", href: "/model" },
              { label: "Research", href: "/research" },
              { label: "Playground", href: "/playground" },
              { label: "Safety", href: "/#safety" },
            ]}
          />

          <FooterColumn
            heading="Company"
            links={[
              { label: "Contact", href: "/#contact" },
              { label: "Careers", href: "/careers" },
              { label: "Press", href: "mailto:press@minimax.ai" },
              { label: "Privacy", href: "/privacy" },
            ]}
          />

          <FooterColumn
            heading="Connect"
            links={[
              { label: "Twitter / X", href: "https://twitter.com/minimax" },
              { label: "GitHub", href: "https://github.com/minimax" },
              { label: "RSS", href: "/rss.xml" },
              { label: "hello@minimax.ai", href: "mailto:hello@minimax.ai" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            © {year} {labName} Research · All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Built in the open. Designed for legibility.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80">
        {heading}
      </h3>
      <ul role="list" className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className={cn(
                "text-sm text-muted-foreground transition-colors duration-200",
                "hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatusPill() {
  return (
    <Link
      href="/status"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5",
        "transition-colors hover:border-accent/40",
      )}
      aria-label="System status: all systems operational"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground group-hover:text-foreground">
        System status · operational
      </span>
    </Link>
  )
}