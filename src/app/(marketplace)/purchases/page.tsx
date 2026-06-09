import { db } from "@/db"
import { orders, snippets } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Download, Code2, ArrowLeft, ShoppingCart, FileCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function PurchasesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const purchasedItems = await db
    .select({
      orderId: orders.id,
      snippetId: orders.snippetId,
      amount: orders.amount,
      status: orders.status,
      purchasedAt: orders.createdAt,
      snippetTitle: snippets.title,
      snippetLanguage: snippets.language,
      snippetSellerId: snippets.sellerId,
    })
    .from(orders)
    .innerJoin(snippets, eq(orders.snippetId, snippets.id))
    .where(eq(orders.buyerId, user.id))
    .orderBy(desc(orders.createdAt))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <Link
          href="/browse"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Browse
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight mt-4">My Purchases</h1>
        <p className="mt-2 text-muted-foreground">
          All snippets you&apos;ve purchased, ready to download.
        </p>
      </div>

      {purchasedItems.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 shadow-sm text-center">
          <ShoppingCart className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-bold">No purchases yet</h2>
          <p className="mt-2 text-muted-foreground">
            When you buy a snippet, it&apos;ll show up here for easy access.
          </p>
          <Button className="mt-6" render={<Link href="/browse" />}>
            Browse Snippets
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {purchasedItems.map((item) => (
            <div
              key={item.orderId}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileCode className="size-6" />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/snippets/${item.snippetId}`}
                    className="font-semibold hover:text-primary transition-colors truncate block"
                  >
                    {item.snippetTitle}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {item.snippetLanguage}
                    </span>
                    <span>${(item.amount / 100).toFixed(2)}</span>
                    <span>
                      {new Date(item.purchasedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/api/download/${item.orderId}`}
                className="shrink-0"
              >
                <Button size="sm" className="rounded-full">
                  <Download className="size-4 mr-1" />
                  Download
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
