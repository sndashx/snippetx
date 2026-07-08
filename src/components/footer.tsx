import Link from "next/link"
import { Globe, X, Send, ArrowUpRight } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"

const COLUMNS = [
  {
    title: "Lab",
    links: [
      { label: "Models", href: "/#models" },
      { label: "Agents", href: "/#agents" },
      { label: "Research", href: "/#research" },
      { label: "Safety", href: "/#safety" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API", href: "/#api" },
      { label: "Documentation", href: "/login" },
      { label: "Console", href: "/login" },
      { label: "Status", href: "/#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Newsroom", href: "/#research" },
      { label: "Contact", href: "/#" },
    ],
  },
]

const SOCIALS = [
  { label: "Website", href: "/#", icon: Globe },
  { label: "X", href: "/#", icon: X },
  { label: "Contact", href: "/#", icon: Send },
]

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-lg">
              <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                <BrandMark />
              </span>
              NUMINA
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A frontier research lab building agentic language models that reason,
              act, and improve — safely, in service of human progress.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Numina Research, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/#" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/#" className="transition-colors hover:text-foreground">Responsible Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
