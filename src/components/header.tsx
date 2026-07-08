"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Models", href: "/#models" },
  { label: "Agents", href: "/#agents" },
  { label: "Research", href: "/#research" },
  { label: "Safety", href: "/#safety" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        isScrolled
          ? "border-white/10 bg-background/70"
          : "border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-semibold tracking-tight text-lg"
        >
          <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-shadow group-hover:neon-glow">
            <BrandMark />
          </span>
          <span>
            NUMINA
            <span className="ml-1 align-top text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Lab
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-full px-4 text-sm font-medium sm:inline-flex"
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="rounded-full px-4 text-sm font-medium transition-all hover:neon-glow"
            render={<Link href="/login" />}
          >
            Console
            <ArrowUpRight className="size-4" />
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-white/5"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
