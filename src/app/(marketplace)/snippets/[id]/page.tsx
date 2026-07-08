import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { Code2, ArrowLeft, Shield, Download, Clock, Rocket, Star } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PurchaseButton } from "@/components/purchase-button"
import { SnippetDetailsClient } from "@/components/snippet-details/snippet-details-client"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { WishlistButton } from "@/components/wishlist-button"
import { IntegrationBanner } from "@/components/integration-banner"
import { JsonLd } from "@/components/json-ld"
import { RelatedSnippets } from "@/components/related-snippets"
import { getSnippet, getRelatedSnippets } from "./snippet-data"
import { extractId, snippetPath, snippetUrl, truncateForMeta } from "@/lib/seo"
import { APP_URL } from "@/lib/constants"

// This page reads auth cookies and shows per-user purchase state, so it must
// render dynamically. SEO (generateMetadata + JSON-LD) works fine on dynamic
// pages; static caching would leak per-user purchase state.

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id: rawParam } = await props.params
  const id = extractId(rawParam)
  if (!id) return { title: "Snippet not found" }

  const snippet = await getSnippet(id)
  if (!snippet) return { title: "Snippet not found" }

  const canonical = snippetPath(snippet.id, snippet.title)
  const title = `${snippet.title} — ${snippet.language} Snippet`
  const description = truncateForMeta(
    `${snippet.description} Production-ready ${snippet.language} code by ${snippet.author || "NUMINA"}. Instant download for $${(snippet.price / 100).toFixed(2)}.`,
  )

  // Note: the colocated opengraph-image.tsx is auto-injected by Next.js with
  // its correct content-hashed URL — we intentionally do NOT set og images
  // manually here (doing so would override the auto URL with a broken one).
  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      snippet.language,
      `${snippet.language} snippet`,
      `${snippet.language} code`,
      snippet.title,
      "buy code",
      "code marketplace",
    ],
    openGraph: {
      type: "website",
      title,
      description,
      url: snippetUrl(snippet.id, snippet.title),
      siteName: "NUMINA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function SnippetPage(props: { params: Promise<{ id: string }> }) {
  const { id: rawParam } = await props.params
  const id = extractId(rawParam)
  if (!id) notFound()

  const snippet = await getSnippet(id)
  if (!snippet) notFound()

  // Redirect bare-UUID or stale-slug URLs to the canonical slugged path (301-style).
  const canonicalPath = snippetPath(snippet.id, snippet.title)
  if (`/snippets/${rawParam}` !== canonicalPath) {
    redirect(canonicalPath)
  }

  let user: { id: string } | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("Failed to get auth user:", error)
  }

  let hasPurchased = false
  let orderId: string | null = null

  if (user) {
    try {
      const [existingOrder] = await db
        .select({ id: orders.id })
        .from(orders)
        .where(and(eq(orders.buyerId, user.id), eq(orders.snippetId, id)))
        .limit(1)

      hasPurchased = !!existingOrder
      orderId = existingOrder?.id ?? null
    } catch (error) {
      console.error("Failed to check purchase status:", error)
    }
  }

  const related = await getRelatedSnippets(snippet.id, snippet.language, snippet.authorId)

  // ---- Structured data (JSON-LD) ----
  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: snippet.title,
    description: truncateForMeta(snippet.description, 500),
    category: `${snippet.language} code snippet`,
    brand: { "@type": "Brand", name: "NUMINA" },
    url: snippetUrl(snippet.id, snippet.title),
    offers: {
      "@type": "Offer",
      price: (snippet.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: snippetUrl(snippet.id, snippet.title),
      seller: { "@type": "Organization", name: "NUMINA" },
    },
  }
  if (snippet.ratingCount > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: snippet.ratingAvg.toFixed(1),
      reviewCount: snippet.ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Browse", item: `${APP_URL}/browse` },
      {
        "@type": "ListItem",
        position: 3,
        name: snippet.language,
        item: `${APP_URL}/snippets/lang/${snippet.language.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: snippet.title,
        item: snippetUrl(snippet.id, snippet.title),
      },
    ],
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Browse
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
        <div className="space-y-10">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={`/snippets/lang/${snippet.language.toLowerCase()}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {snippet.language}
              </Link>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {snippet.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {snippet.ratingCount > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {snippet.ratingAvg.toFixed(1)} ({snippet.ratingCount})
                </span>
              )}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {snippet.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {snippet.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Code Preview</h2>
            <SnippetDetailsClient
              id={snippet.id}
              language={snippet.language}
              isPurchased={hasPurchased}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">What&apos;s Included</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Code2 className="size-4" />
                  <span className="text-sm font-semibold">Complete Code</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Production-ready {snippet.language} snippet with comments and documentation
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Download className="size-4" />
                  <span className="text-sm font-semibold">Instant Access</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Download immediately after purchase. No waiting, no delays.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Shield className="size-4" />
                  <span className="text-sm font-semibold">Quality Guaranteed</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All snippets are tested and verified by our team before listing.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Rocket className="size-4" />
                  <span className="text-sm font-semibold">Seller Support</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get help from the seller if you have questions about implementation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl glass">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-4xl font-bold tracking-tighter">${(snippet.price / 100).toFixed(2)}</div>
                <div className="mb-8 text-sm text-muted-foreground">
                  by {snippet.author || "numina.org"}
                </div>
              </div>
              <WishlistButton
                snippetId={snippet.id}
                price={snippet.price}
                isAuthenticated={!!user}
              />
            </div>

            <PurchaseButton
              snippetId={snippet.id}
              hasPurchased={hasPurchased}
              orderId={orderId}
            />

            <div className="mt-6">
              <IntegrationBanner snippetId={snippet.id} snippetTitle={snippet.title} />
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Seller Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold">
                    {(snippet.author || "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{snippet.author || "numina.org"}</p>
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(snippet.authorJoined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Usually responds within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="size-4" />
                </div>
                <span>Secure payment via Stripe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Download className="size-4" />
                </div>
                <span>Instant download after purchase</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Code2 className="size-4" />
                </div>
                <span>Production-ready code</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <Shield className="size-4" />
                </div>
                <span>14-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <ReviewsSection
          snippetId={snippet.id}
          isPurchased={hasPurchased}
          currentUserId={user?.id ?? null}
        />
      </div>

      <RelatedSnippets items={related} />
    </div>
  )
}
