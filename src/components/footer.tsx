import Link from "next/link";
import { Globe, X, Mail, ArrowUpRight, Sparkles } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/#models" },
      { label: "Agents", href: "/#agents" },
      { label: "API", href: "/#api" },
      { label: "Console", href: "/login" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Papers", href: "/#research" },
      { label: "Safety", href: "/#safety" },
      { label: "Blog", href: "/#research" },
      { label: "Evaluations", href: "/#safety" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Newsroom", href: "/#research" },
    ],
  },
];

const socials = [
  { icon: Globe, href: "https://github.com", label: "GitHub" },
  { icon: X, href: "https://twitter.com", label: "X" },
  { icon: Mail, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-background/70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
              <BrandMark className="size-7" />
              <span className="text-lg">NUMINA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A frontier research lab building agentic language models that reason,
              plan, and act in service of Humanity&apos;s progress.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              All systems operational
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-brand-2/50 hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NUMINA Research. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-brand-3" />
              Built by NUMINA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
        <linearGradient id="numina-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="50%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-3)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="11" stroke="url(#numina-mark)" strokeWidth="1.6" opacity="0.9" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="url(#numina-mark)" strokeWidth="1.6" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="url(#numina-mark)" strokeWidth="1.6" transform="rotate(-60 16 16)" />
      <circle cx="16" cy="16" r="3" fill="url(#numina-mark)" />
    </svg>
  );
}
