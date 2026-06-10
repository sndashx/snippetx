"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Code2, ArrowRight, Loader2, Search, Shield, Rocket } from "lucide-react"
import { useSnippets } from "@/lib/hooks/use-snippets"
import { motion, AnimatePresence } from "framer-motion"
import { IntegrationBadge } from "@/components/integration-banner"

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
]

type Snippet = {
  id: string
  title: string
  description: string
  price: number
  language: string
  author: string | null
  createdAt: string
}

export function BrowseClient({ lang }: { lang?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading, isError, error } = useSnippets(lang)

  const allSnippets: Snippet[] = data ?? []
  const filteredSnippets = allSnippets.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.language.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl transition-opacity hover:opacity-80">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground neon-glow">
              <Code2 className="size-5" />
            </div>
            <span>SnippetX</span>
          </Link>
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
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            The Code <span className="text-primary">Vault</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            High-performance, production-ready snippets. Filter by language or search for specific functionality.
          </p>
        </div>

        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search snippets, languages, or keywords..."
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 glass"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Link
              href="/browse"
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                !lang
                  ? "border-primary bg-primary/10 text-primary neon-glow"
                  : "border-border bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              All Assets
            </Link>
            {LANGUAGES.map((language) => (
              <Link
                key={language}
                href={`/browse?lang=${language}`}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  lang === language
                    ? "border-primary bg-primary/10 text-primary neon-glow"
                    : "border-border bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {language}
              </Link>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-32 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
              <Shield className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Failed to load the vault</h3>
            <p className="mt-2 text-muted-foreground">
              {(error as Error)?.message ?? "An unexpected error occurred."}
            </p>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-32 text-center">
            <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
              <Code2 className="size-10" />
            </div>
            <h3 className="text-xl font-bold">No matching snippets</h3>
            <p className="mb-6 mt-2 text-muted-foreground">
              We couldn&apos;t find any snippets matching your search.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:neon-glow transition-all"
            >
              Start Selling <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredSnippets.map((snippet, i) => (
                <motion.div
                  key={snippet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Link href={`/snippets/${snippet.id}`}>
                    <Card className="group h-full overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 glass">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                            {snippet.language}
                          </span>
                          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          {snippet.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {snippet.description}
                        </p>
                        <div className="mt-3">
                          <IntegrationBadge compact />
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-6 pt-0 border-t border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2">
                          <div className="size-5 rounded-full bg-muted border border-border" />
                          <span className="text-xs font-medium text-muted-foreground">
                            @{snippet.author || "sn-x.com"}
                          </span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter">${(snippet.price / 100).toFixed(2)}</span>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
