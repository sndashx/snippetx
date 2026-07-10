"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { labName } from "@/lib/brand"

interface NavLink {
  label: string
  href: string
}

const links: NavLink[] = [
  { label: "Model", href: "/model" },
  { label: "Research", href: "/research" },
  { label: "Playground", href: "/playground" },
  { label: "Safety", href: "/#safety" },
]

export function SiteNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out-expo",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
      style={{ viewTransitionName: "chrome" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={`${labName} home`}
          className="group inline-flex items-center gap-2.5 text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ viewTransitionName: "site-logo" }}
        >
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-full bg-accent shadow-[0_0_10px_color-mix(in_oklch,var(--accent)_70%,transparent)] transition-transform group-hover:scale-110"
          />
          <span className="font-display text-lg">{labName}</span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-px bg-accent"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/playground"
            className="hidden rounded-full border border-border bg-card/40 px-4 py-1.5 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
          >
            Try M3
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-sheet"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/40 text-foreground transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile sheet */}
      <div
        id="mobile-nav-sheet"
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-background/85 backdrop-blur-xl transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-all duration-500 ease-out-expo",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2.5 text-sm font-medium tracking-tight text-foreground"
            >
              <span aria-hidden className="inline-block size-2.5 rounded-full bg-accent" />
              <span className="font-display text-lg">{labName}</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/40 text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <nav
            aria-label="Mobile primary"
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-2 px-6 pt-12"
          >
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-baseline justify-between border-b border-border/60 py-6 text-display-md text-foreground transition-colors hover:text-accent"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-accent">
                  0{i + 1}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mx-auto w-full max-w-7xl px-6 pb-12">
            <Link
              href="/playground"
              onClick={() => setMobileOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-background transition-all hover:neon-glow"
            >
              Try minimax M3
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}