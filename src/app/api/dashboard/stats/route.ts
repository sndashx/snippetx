import { db } from "@/db"
import { snippets, orders, users } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
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
    const [seller] = await db
      .select({
        stripeAccountStatus: users.stripeAccountStatus,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    const totalSnippets = seller
      ? (
          await db
            .select({ count: sql<number>`count(*)` })
            .from(snippets)
            .where(eq(snippets.sellerId, user.id))
        )[0]?.count ?? 0
      : 0

    const completedOrders = await db
      .select({
        amount: orders.amount,
        platformFee: orders.platformFee,
      })
      .from(orders)
      .innerJoin(snippets, eq(orders.snippetId, snippets.id))
      .where(
        and(eq(snippets.sellerId, user.id), eq(orders.status, "completed")),
      )

    const totalSales = completedOrders.length
    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + (o.amount - o.platformFee),
      0,
    )

    // No views tracking yet — conversion rate is 0 until we add it
    const conversionRate = 0

    return NextResponse.json({
      totalRevenue,
      totalSales,
      totalSnippets,
      conversionRate,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
