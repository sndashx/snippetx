import { db } from "@/db"
import { snippets, users } from "@/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Code2 } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { snippetPath } from "@/lib/seo"
import { APP_URL } from "@/lib/constants"

// Public catalog page — ISR for fast TTFB + freshness.
export const revalidate = 3600

// Canonical display names keyed by lowercase slug.
const LANGUAGES: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  go: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
}

export function generateStaticParams() {
  return Object.keys(LANGUAGES).map((language) => ({ language }))
}

function resolveLanguage(param: string): string | null {
  return LANGUAGES[param.toLowerCase()] ?? null
}

export async function generateMetadata(props: {
  params: Promise<{ language: string }>
}): Promise<Metadata> {
  const { language: param } = await props.params
  const language = resolveLanguage(param)
  if (!language) return { title: "Language not found" }

  const title = `${language} Code Snippets — Buy Production-Ready ${language}`
  const description = `Browse and buy production-ready ${language} code snippets on NUMINA. Hand-crafted, tested ${language} components, utilities, and helpers with instant download.`

  return {
    title,
    description,
    alternates: { canonical: `/snippets/lang/${param.toLowerCase()}` },
    keywords: [
      `${language} snippets`,
      `buy ${language} code`,
      `${language} components`,
      `${language} utilities`,
      `${language} marketplace`,
    ],
    openGraph: {
      type: "website",
      title,
      description,
      url: `${APP_URL}/snippets/lang/${param.toLowerCase()}`,
      siteName: "NUMINA",
    },
  }
}

export default async function LanguageLandingPage(props: {
  params: Promise<{ language: string }>
}) {
  const { language: param } = await props.params
  const language = resolveLanguage(param)
  if (!language) notFound()

  let items: {
    id: string
    title: string
    description: string
    price: number
    language: string
    author: string | null
  }[] = []

  try {
    items = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        price: snippets.price,
        language: snippets.language,
        author: users.displayName,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(sql`lower(${snippets.language}) = ${language.toLowerCase()}`)
      .orderBy(desc(snippets.createdAt))
      .limit(60)
  } catch (error) {
    console.error("Failed to load language landing snippets:", error)
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${language} Code Snippets`,
    description: `Production-ready ${language} code snippets for sale on NUMINA.`,
    url: `${APP_URL}/snippets/lang/${param.toLowerCase()}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${APP_URL}${snippetPath(s.id, s.title)}`,
        name: s.title,
      })),
    },
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <JsonLd data={itemListJsonLd} />

      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/browse" className="hover:text-foreground">Browse</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{language}</span>
      </nav>

      <header className="mb-12 max-w-3xl space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {language} Code Snippets
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Buy production-ready {language} code on NUMINA. Every {language} snippet
          is hand-crafted by developers and verified before listing — from reusable
          components and utilities to complete integrations. Download instantly after
          purchase and ship faster.
        </p>
        <p className="text-sm text-muted-foreground">
          {items.length > 0
            ? `${items.length} ${language} snippet${items.length === 1 ? "" : "s"} available right now.`
            : `New ${language} snippets are added regularly — check back soon.`}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-32 text-center">
          <Code2 className="mb-4 size-10 text-muted-foreground" />
          <h2 className="text-xl font-bold">No {language} snippets yet</h2>
          <p className="mt-2 text-muted-foreground">Be the first to sell {language} code here.</p>
          <Link
            href="/sell"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:neon-glow transition-all"
          >
            Start Selling
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.id}
              href={snippetPath(s.id, s.title)}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 glass"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                  {s.language}
                </span>
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {s.title}
              </h2>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-xs font-medium text-muted-foreground">@{s.author || "sn-x.com"}</span>
                <span className="text-xl font-bold tracking-tighter">${(s.price / 100).toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Cross-links to other languages for crawl equity */}
      <section className="mt-16 border-t border-border pt-8">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Browse other languages</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANGUAGES)
            .filter(([slug]) => slug !== param.toLowerCase())
            .map(([slug, name]) => (
              <Link
                key={slug}
                href={`/snippets/lang/${slug}`}
                className="rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                {name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
