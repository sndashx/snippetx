import { db } from "@/db"
import { snippets, users, orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft, Shield, Download, Clock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function SnippetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const [snippet] = await db
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

  if (!snippet) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hasPurchased = user
    ? (
        await db
          .select()
          .from(orders)
          .where(and(eq(orders.buyerId, user.id), eq(orders.snippetId, id)))
      ).length > 0
    : false

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Browse
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
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
          <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {snippet.description}
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-2 text-3xl font-bold tracking-tight">${snippet.price}</div>
            <div className="mb-6 text-sm text-muted-foreground">
              by {snippet.author.split("@")[0]}
            </div>

            {hasPurchased ? (
              <Button className="w-full" size="lg">
                <Download className="size-4" />
                Download Snippet
              </Button>
            ) : (
              <form>
                <input type="hidden" name="snippetId" value={snippet.id} />
                <Button type="submit" className="w-full" size="lg">
                  Purchase Snippet
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                Secure payment via Stripe
              </div>
              <div className="flex items-center gap-2">
                <Download className="size-4 text-primary" />
                Instant download after purchase
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                Production-ready code
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
