import { db } from "@/db"
import { snippets, orders } from "@/db/schema"
import { eq, and, desc, sql, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const sellerSnippets = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        price: snippets.price,
        language: snippets.language,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .where(eq(snippets.sellerId, user.id))
      .orderBy(desc(snippets.createdAt))

    const snippetIds = sellerSnippets.map((s) => s.id)

    // Get sales data per snippet
    const salesData = snippetIds.length > 0
      ? await db
          .select({
            snippetId: orders.snippetId,
            sales: sql<number>`count(*)::int`,
            revenue: sql<number>`coalesce(sum(orders.amount - orders.platform_fee), 0)::int`,
          })
          .from(orders)
          .where(
            and(
              inArray(orders.snippetId, snippetIds),
              eq(orders.status, "completed"),
            ),
          )
          .groupBy(orders.snippetId)
      : []

    const salesMap = new Map(salesData.map((s) => [s.snippetId, s]))

    const result = sellerSnippets.map((s) => {
      const sales = salesMap.get(s.id)
      return {
        id: s.id,
        title: s.title,
        views: 0, // No views tracking yet
        sales: sales?.sales ?? 0,
        revenue: sales?.revenue ?? 0,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to fetch dashboard snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}
