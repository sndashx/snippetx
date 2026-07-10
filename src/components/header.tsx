"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BrandMark } from "@/components/footer"
import { labName } from "@/lib/brand"

const navLinks = [
  { label: "Models", href: "/#models" },
  { label: "Agents", href: "/#agents" },
  { label: "Research", href: "/#research" },
  { label: "Safety", href: "/#safety" },
  { label: "API", href: "/#api" },
  { label: "Docs", href: "/docs" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "border-border bg-background/80 shadow-lg shadow-black/20"
          : "border-transparent bg-background/40"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <BrandMark className="size-7" />
          <span className="font-display text-lg">{labName}</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-brand-1 to-brand-3 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant="default"
            size="sm"
            className="hidden rounded-full px-5 font-medium transition-all hover:neon-glow sm:inline-flex"
            render={<Link href="/login" />}
          >
            Get API Key
          </Button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-brand-2/50 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm border-l border-border bg-background p-6 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
              <BrandMark className="size-6" />
              <span>{labName}</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-card"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="default"
            size="lg"
            className="mt-6 w-full rounded-full font-medium"
            render={<Link href="/login" />}
          >
            Get API Key
          </Button>
        </div>
      </div>
    </header>
  )
}
