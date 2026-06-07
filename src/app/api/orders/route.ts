import { db } from "@/db"
import { orders, snippets } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { desc, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const myOrders = await db
      .select({
        id: orders.id,
        snippetId: orders.snippetId,
        buyerId: orders.buyerId,
        amount: orders.amount,
        status: orders.status,
        createdAt: orders.createdAt,
        snippetTitle: snippets.title,
        snippetLanguage: snippets.language,
        snippetSellerId: snippets.sellerId,
      })
      .from(orders)
      .innerJoin(snippets, eq(orders.snippetId, snippets.id))
      .where(
        or(eq(orders.buyerId, user.id), eq(snippets.sellerId, user.id))
      )
      .orderBy(desc(orders.createdAt))

    return NextResponse.json(myOrders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
