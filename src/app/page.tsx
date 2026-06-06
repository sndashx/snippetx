import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code2, DollarSign, Shield, Zap, ArrowRight, Search } from "lucide-react"

const featuredSnippets = [
  {
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod.",
    price: 12,
    author: "johndoe",
    language: "TypeScript",
  },
  {
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support.",
    price: 19,
    author: "sarahdev",
    language: "JavaScript",
  },
  {
    title: "Tailwind Component Library",
    description: "60+ responsive UI components built with Tailwind CSS v4 and shadcn/ui.",
    price: 29,
    author: "uiwizard",
    language: "TypeScript",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-5" />
            SnippetX
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/sell" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sell
            </Link>
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-center sm:pt-32 sm:pb-20">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Zap className="size-3" />
            Production-ready code snippets marketplace
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Buy & sell code snippets
            <br />
            <span className="text-muted-foreground">that actually ship</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            SnippetX is a marketplace for high-quality, production-ready code.
            Save hours of development time and earn from your expertise.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Browse Marketplace
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <DollarSign className="size-4" />
              Start Selling
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Featured snippets</h2>
            <Link
              href="/browse"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSnippets.map((snippet) => (
              <article
                key={snippet.title}
                className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {snippet.language}
                  </span>
                </div>
                <h3 className="mb-1.5 font-semibold tracking-tight">{snippet.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{snippet.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">by {snippet.author}</span>
                  <span className="text-lg font-bold tracking-tight">${snippet.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center">
            <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Search className="size-5" />
                </div>
                <h3 className="font-semibold tracking-tight">1. Find</h3>
                <p className="text-sm text-muted-foreground">
                  Browse curated snippets by language, framework, or use case.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="size-5" />
                </div>
                <h3 className="font-semibold tracking-tight">2. Buy</h3>
                <p className="text-sm text-muted-foreground">
                  One-time purchase. No subscriptions. Instant download after payment.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code2 className="size-5" />
                </div>
                <h3 className="font-semibold tracking-tight">3. Ship</h3>
                <p className="text-sm text-muted-foreground">
                  Copy, paste, and deploy. Production-ready code in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} SnippetX</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
