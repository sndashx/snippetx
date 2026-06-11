"use client"

import Link from "next/link"
import { Code2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Don't show header on certain pages (optional)
  if (pathname?.startsWith("/auth/")) return null

  return (
    <header className={`sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl transition-shadow ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl transition-opacity hover:opacity-80">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground neon-glow">
            <Code2 className="size-5" />
          </div>
          <span>SnippetX</span>
        </Link>

        {/* Search Bar - Center */}
        <div className="hidden flex-1 mx-8 md:block">
          <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto group">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search snippets, languages, or keywords..."
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 glass"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Side - Nav & Auth */}
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 sm:flex">
            <Link
              href="/browse"
              className="text-sm font-medium text-foreground transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sell
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="default" size="sm" className="rounded-full px-5 font-medium transition-all hover:neon-glow" render={<Link href="/login" />}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search - Shown below header on small screens */}
      <div className="border-t border-border bg-background/60 p-3 md:hidden">
        <form onSubmit={handleSearch} className="relative w-full group">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search snippets..."
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 glass"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  )
}
