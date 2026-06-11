"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Code2, DollarSign, Shield, Zap, ArrowRight, Search, Sparkles, Terminal, Cpu, Rocket, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { IntegrationBanner, IntegrationBadge } from "@/components/integration-banner"
import { snippetPath } from "@/lib/seo"
import { useState, useEffect } from "react"

interface FeaturedSnippet {
  id: string
  title: string
  description: string
  price: number
  language: string
  author: string | null
  featured: boolean
}

const fallbackSnippets: FeaturedSnippet[] = [
  {
    id: "fallback-1",
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod.",
    price: 1200,
    language: "TypeScript",
    author: "SNIPPETxADMIN",
    featured: true,
  },
  {
    id: "fallback-2",
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support.",
    price: 1900,
    language: "JavaScript",
    author: "SNIPPETxADMIN",
    featured: true,
  },
  {
    id: "fallback-3",
    title: "FastAPI Starter Kit",
    description: "Production-ready FastAPI application with SQLAlchemy, Alembic migrations, JWT auth, and Docker support.",
    price: 1800,
    language: "Python",
    author: "SNIPPETxADMIN",
    featured: true,
  },
]

export default function Home() {
  const [featuredSnippets, setFeaturedSnippets] = useState<FeaturedSnippet[]>(fallbackSnippets)

  useEffect(() => {
    fetch("/api/snippets?featured=true&limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedSnippets(data)
        }
      })
      .catch(() => {})
  }, [])
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
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
              <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse
              </Link>
              <Link href="/sell" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-48 sm:pb-32">
          {/* Background Glows */}
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-1/2 -right-24 size-96 rounded-full bg-primary/10 blur-[120px]" />
          
          <div className="mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
            >
              <Sparkles className="size-3" />
              <span>From code snippets to <strong>shipped features</strong></span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
            >
              Production code.<br />
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                Shipped in hours.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Access a curated vault of production-ready code assets. Buy the snippet, or let us{" "}
              <span className="font-semibold text-foreground">integrate it end-to-end within 24 hours</span>{" "}
              for a flat fee. No context-switching, no boilerplate.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" className="h-12 px-8 text-base font-semibold rounded-full transition-all hover:neon-glow" render={<Link href="/browse" />}>
                Explore the Vault
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold rounded-full backdrop-blur-sm transition-all hover:bg-muted" render={<Link href="/sell/new" />}>
                <DollarSign className="mr-2 size-4" />
                Monetize Your Code
              </Button>
            </motion.div>

            {/* Trust/credibility row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-3.5 text-green-500" />
                Snippet-only from $8
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-3.5 text-green-500" />
                Full integration $250 flat
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-3.5 text-green-500" />
                Delivered in 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-3.5 text-green-500" />
                Production-ready code
              </span>
            </motion.div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="mx-auto max-w-7xl px-6 pb-32">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Featured Assets</h2>
              <p className="text-muted-foreground">Hand-picked solutions. Download raw or get it integrated.</p>
            </div>
            <Link
              href="/browse"
              className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all assets <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSnippets.map((snippet, i) => (
              <Link
                key={snippet.id}
                href={snippetPath(snippet.id, snippet.title)}
                className="block"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group relative rounded-2xl border transition-all ${
                    snippet.featured
                      ? "border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] to-card hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                  } p-6 glass`}
                >
                  {snippet.featured && (
                    <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                      <Rocket className="size-3" />
                      Featured Service
                    </div>
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                      {snippet.language}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">by {snippet.author}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {snippet.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {snippet.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-muted border border-border" />
                      <span
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.location.href = `/profile/${snippet.author}`
                        }}
                      >
                        @{snippet.author}
                      </span>
                    </div>
                    <span className="text-xl font-bold tracking-tighter">${(snippet.price / 100).toFixed(0)}</span>
                  </div>
                  <div className="mt-3">
                    <IntegrationBadge compact />
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </section>

        {/* Integration Service Section (replaces old "Value Props") */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-500">
                <Zap className="size-3" />
                <span>Introducing: Done-for-you Integration</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Buy the Code. Or Let Us Build It.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Not every team has the cycles to wire up a new tool. For a flat $250, our engineers
                deliver a fully integrated, production-ready implementation within 24 hours.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: Terminal,
                    title: "You Buy",
                    desc: "Purchase any asset on the marketplace. Whether it's a $12 hook or a $29 workflow — same flat integration fee.",
                    highlight: false,
                  },
                  {
                    icon: Rocket,
                    title: "We Build",
                    desc: "Our team forks your repo, wires the asset into your stack, configures env vars, CI/CD, and tests. You get a PR within 24 hours.",
                    highlight: true,
                  },
                  {
                    icon: Zap,
                    title: "You Ship",
                    desc: "Review, approve, merge. What used to take days now takes one click. Your feature ships same-week.",
                    highlight: false,
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className={`group relative rounded-2xl border p-8 transition-all ${
                      step.highlight
                        ? "border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-card hover:border-amber-500/50"
                        : "border-border bg-card hover:border-primary/30"
                    } glass`}
                  >
                    <div
                      className={`mb-4 flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                        step.highlight
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <step.icon className="size-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold tracking-tight">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    {step.highlight && (
                      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 border border-amber-500/20">
                        <span className="text-[10px] font-bold text-amber-500">$250 FLAT — 24H DELIVERY</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
                  render={<Link href="/browse" />}
                >
                  <Rocket className="mr-2 size-4" />
                  Find an Asset to Integrate
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-4" />
            <span>SnippetX</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="hidden sm:inline opacity-50">|</span>
            <span>&copy; {new Date().getFullYear()} SnippetX</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
