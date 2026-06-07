"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Code2, DollarSign, Shield, Zap, ArrowRight, Search, Sparkles, Terminal, Cpu } from "lucide-react"
import { motion } from "framer-motion"

const featuredSnippets = [
  {
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod.",
    price: 12,
    author: "johndoe",
    language: "TypeScript",
    category: "Frontend",
  },
  {
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support.",
    price: 19,
    author: "sarahdev",
    language: "JavaScript",
    category: "Backend",
  },
  {
    title: "Tailwind Component Library",
    description: "60+ responsive UI components built with Tailwind CSS v4 and shadcn/ui.",
    price: 29,
    author: "uiwizard",
    language: "TypeScript",
    category: "UI/UX",
  },
]

export default function Home() {
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
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
            >
              <Sparkles className="size-3 text-primary" />
              <span>The New Standard for Production Code</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl"
            >
              Ship faster with <br />
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                Elite Snippets
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Stop reinventing the wheel. Access a curated vault of production-ready 
              components and logic used by top-tier engineering teams.
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
          </div>
        </section>

        {/* Featured Section */}
        <section className="mx-auto max-w-7xl px-6 pb-32">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Featured Assets</h2>
              <p className="text-muted-foreground">Hand-picked snippets for maximum impact.</p>
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
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={snippet.title}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 glass"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                    {snippet.language}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{snippet.category}</span>
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
                    <span className="text-xs font-medium text-muted-foreground">@{snippet.author}</span>
                  </div>
                  <span className="text-xl font-bold tracking-tighter">${snippet.price}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Value Props */}
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Engineered for Speed</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to go from idea to production.</p>
            </div>
            <div className="grid gap-12 sm:grid-cols-3">
              {[
                { 
                  icon: Search, 
                  title: "Curated Discovery", 
                  desc: "Stop digging through GitHub. Find exactly what you need in seconds with our advanced filter engine." 
                },
                { 
                  icon: Shield, 
                  title: "Production Grade", 
                  desc: "Every snippet is vetted for security, performance, and maintainability. No more spaghetti code." 
                },
                { 
                  icon: Cpu, 
                  title: "Instant Integration", 
                  desc: "Clean, modular code designed to be dropped into any project without breaking your architecture." 
                },
              ].map((prop, i) => (
                <div key={i} className="group relative p-8 rounded-2xl border border-border bg-card transition-all hover:border-primary/30 glass">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <prop.icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">{prop.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {prop.desc}
                  </p>
                </div>
              ))}
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
