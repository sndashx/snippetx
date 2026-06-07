import { db } from "@/db"
import { snippets, users, orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Code2, ArrowLeft, Shield, Download, Clock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PurchaseButton } from "@/components/purchase-button"
import { SnippetDetailsClient } from "@/components/snippet-details/snippet-details-client"

export default async function SnippetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  let snippet: {
    id: string
    title: string
    description: string
    price: number
    language: string
    filePath: string
    author: string
    authorId: string
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
        author: users.email,
        authorId: users.id,
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
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl glass">
            <div className="mb-2 text-4xl font-bold tracking-tighter">${snippet.price}</div>
            <div className="mb-8 text-sm text-muted-foreground">
              by {snippet.author.split("@")[0]}
            </div>

            <PurchaseButton
              snippetId={snippet.id}
              hasPurchased={hasPurchased}
              orderId={orderId}
            />

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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
