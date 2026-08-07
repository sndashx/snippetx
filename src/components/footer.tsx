import Link from "next/link";
import { Globe, AtSign, Globe2, ArrowUpRight } from "lucide-react";
import { labName, labNameLong, tagline } from "@/lib/brand";

const columns = [
  {
    title: "Institution",
    links: [
      { label: "Axes", href: "/#axes" },
      { label: "Method", href: "/#method" },
      { label: "Fellowship", href: "/#fellowship" },
      { label: "Charter", href: "/#method" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Papers", href: "/research" },
      { label: "Instruments", href: "/#indicators" },
      { label: "Open data", href: "/research" },
      { label: "Reviews", href: "/research" },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Cambridge", href: "/#contact" },
      { label: "Marfa", href: "/#contact" },
      { label: "Public lectures", href: "/#indicators" },
      { label: "Press", href: "/#contact" },
    ],
  },
];

const socials = [
  { icon: Globe, href: "https://github.com/sndashx", label: "GitHub" },
  { icon: AtSign, href: "https://twitter.com/sndashx", label: "X" },
  { icon: Globe2, href: "https://arxiv.org/a/sn-x_1", label: "arXiv" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <BrandMark className="size-7" />
              <span className="font-display text-lg tracking-tight">{labName}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {labNameLong}. {tagline}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-accent/45 hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {labNameLong}. Resident
            fellowships are tenure-track or honorary.
          </p>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.24em]">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/research" className="transition-colors hover:text-foreground">
              Pre-prints
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * BrandMark — three intersecting ellipses forming a six-petal rosette,
 * the visual signature of SN-X. Drawn in pure SVG so it scales without
 * raster artefacts and adopts the brand palette automatically.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="snx-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="55%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-3)" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="url(#snx-mark)"
        strokeWidth="1.4"
        opacity="0.85"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="11"
        ry="4.2"
        stroke="url(#snx-mark)"
        strokeWidth="1.4"
        opacity="0.85"
        transform="rotate(60 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="11"
        ry="4.2"
        stroke="url(#snx-mark)"
        strokeWidth="1.4"
        opacity="0.85"
        transform="rotate(-60 16 16)"
      />
      <circle cx="16" cy="16" r="2.4" fill="url(#snx-mark)" />
    </svg>
  );
}