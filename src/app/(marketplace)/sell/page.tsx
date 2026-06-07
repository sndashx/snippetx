import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Code2, ArrowRight, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { db } from "@/db"
import { snippets, orders, users } from "@/db/schema"
import { desc, eq, count } from "drizzle-orm"
import { StripeConnectButton } from "./stripe-connect-button"

export const dynamic = "force-dynamic"

export default async function SellPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [sellerSnippets, totalOrders, currentUser] = await Promise.all([
    db
      .select({
        id: snippets.id,
        title: snippets.title,
        language: snippets.language,
        price: snippets.price,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .where(eq(snippets.sellerId, user.id))
      .orderBy(desc(snippets.createdAt)),
    db
      .select({ value: count() })
      .from(orders)
      .innerJoin(snippets, eq(orders.snippetId, snippets.id))
      .where(eq(snippets.sellerId, user.id)),
    db
      .select({
        stripeAccountId: users.stripeAccountId,
        stripeAccountStatus: users.stripeAccountStatus,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)
      .then((rows) => rows[0]),
  ])

  const snippetCount = sellerSnippets.length
  const orderCount = totalOrders[0]?.value ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your snippets and track your earnings.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4" />
            <span className="text-sm font-medium">Total Snippets</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{snippetCount}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingCart className="size-4" />
            <span className="text-sm font-medium">Orders Received</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">Stripe Status</span>
          </div>
          <div className="mt-2">
            <StripeConnectButton
              hasAccount={!!currentUser?.stripeAccountId}
              status={currentUser?.stripeAccountStatus ?? "inactive"}
            />
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Snippets</h2>
        <Link href="/sell/new">
          <Button>
            <Code2 className="mr-2 size-4" />
            Upload Snippet
          </Button>
        </Link>
      </div>

      {sellerSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <Code2 className="mb-4 size-10 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No snippets yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload your first snippet to start earning.
          </p>
          <Link href="/sell/new">
            <Button>
              Upload Snippet <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerSnippets.map((snippet) => (
                <TableRow key={snippet.id}>
                  <TableCell>
                    <Link
                      href={`/snippets/${snippet.id}`}
                      className="font-medium hover:underline"
                    >
                      {snippet.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {snippet.language}
                    </span>
                  </TableCell>
                  <TableCell>
                    ${(snippet.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(snippet.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
