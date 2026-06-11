import { db } from "@/db"
import { snippets, users, orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Code2, ArrowLeft, Shield, Download, Clock, Rocket } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PurchaseButton } from "@/components/purchase-button"
import { SnippetDetailsClient } from "@/components/snippet-details/snippet-details-client"
import { ReviewsSection } from "@/components/reviews/reviews-section"
import { WishlistButton } from "@/components/wishlist-button"
import { IntegrationBanner, IntegrationBadge } from "@/components/integration-banner"

export default async function SnippetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  let snippet: {
    id: string
    title: string
    description: string
    price: number
    language: string
    filePath: string
    author: string | null
    authorId: string
    authorJoined: Date
    createdAt: Date
  } | null = null
  
  try {
    const results = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        price: snippets.price,
        language: snippets.language,
        filePath: snippets.filePath,
        author: users.displayName,
        authorId: users.id,
        authorJoined: users.createdAt,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(eq(snippets.id, id))
      .limit(1)

    snippet = results[0] ?? null
  } catch (error) {
    console.error("Failed to fetch snippet:", error)
    notFound()
  }

  if (!snippet) notFound()

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

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
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
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                {snippet.language}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {snippet.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
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
            <h2 className="text-xl font-bold tracking-tight">What's Included</h2>
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
                  by {snippet.author || "sn-x.com"}
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
              <IntegrationBanner />
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Seller Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold">
                    {(snippet.author || "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{snippet.author || "sn-x.com"}</p>
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
    </div>
  )
}
