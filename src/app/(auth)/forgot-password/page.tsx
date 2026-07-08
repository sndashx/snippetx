"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-5" />
            NUMINA
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/#models" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Models
            </Link>
            <Link href="/#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Research
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-xl bg-muted p-4">
          <Code2 className="size-8 text-muted-foreground" />
        </div>
        <p className="mb-1 text-6xl font-bold tracking-tighter text-muted-foreground/30">404</p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mb-8 max-w-md text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Numina Research, Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
