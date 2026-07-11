import Link from "next/link"
import { labName, labNameLong, tagline } from "@/lib/brand"
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
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Research Institution
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {labNameLong}. {tagline}
            </p>
          </div>

          <FooterColumn
            heading="Institution"
            links={[
              { label: "Axes", href: "/#axes" },
              { label: "Research", href: "/research" },
              { label: "Method", href: "/#method" },
              { label: "Fellowship", href: "/#fellowship" },
            ]}
          />

          <FooterColumn
            heading="Visit"
            links={[
              { label: "Cambridge", href: "/#contact" },
              { label: "Marfa", href: "/#contact" },
              { label: "Press", href: "mailto:press@sn-x.org" },
              { label: "Privacy", href: "/privacy" },
            ]}
          />

          <FooterColumn
            heading="Connect"
            links={[
              { label: "Twitter / X", href: "https://twitter.com/sndashx" },
              { label: "GitHub", href: "https://github.com/sndashx" },
              { label: "arXiv", href: "https://arxiv.org/a/sn-x_1" },
              { label: "hello@sn-x.org", href: "mailto:hello@sn-x.org" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            © {year} {labNameLong} · Resident fellowships are tenure-track or honorary.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
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
      <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/80">
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