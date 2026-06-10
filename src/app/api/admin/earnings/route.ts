import { NextResponse } from "next/server"
import { db } from "@/db"
import { orders, snippets, users } from "@/db/schema"
import { desc, eq, sum, count } from "drizzle-orm"

export async function GET() {
  try {
    // Get total revenue
    const [totalRevenue] = await db
      .select({ value: sum(orders.amount) })
      .from(orders)
      .where(eq(orders.status, "completed"))

    const revenue = Number(totalRevenue?.value ?? 0) / 100
    const platformFee = revenue * 0.25
    const sellerPayouts = revenue * 0.75

    // Get monthly revenue (simplified - would need date grouping)
    const monthlyRevenue = Array(12).fill(0)
    const monthlyFees = Array(12).fill(0)

    // Get top sellers
    const topSellers = await db
      .select({
        sellerId: snippets.sellerId,
        revenue: sum(orders.amount),
        sales: count(orders.id),
      })
      .from(orders)
      .innerJoin(snippets, eq(orders.snippetId, snippets.id))
      .where(eq(orders.status, "completed"))
      .groupBy(snippets.sellerId)
      .orderBy(desc(sum(orders.amount)))
      .limit(5)

    // Get seller details
    const topSellersWithDetails = await Promise.all(
      topSellers.map(async (seller) => {
        const [user] = await db
          .select({ displayName: users.displayName, email: users.email })
          .from(users)
          .where(eq(users.id, seller.sellerId))
          .limit(1)

        return {
          id: seller.sellerId,
          username: user?.displayName || user?.email.split("@")[0] || "Unknown",
          revenue: Number(seller.revenue ?? 0) / 100,
          sales: seller.sales ?? 0,
        }
      })
    )

    // Get recent transactions
    const recentTransactions = await db
      .select({
        id: orders.id,
        amount: orders.amount,
        createdAt: orders.createdAt,
        buyerId: orders.buyerId,
        snippetId: orders.snippetId,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10)

    // Get transaction details
    const transactionsWithDetails = await Promise.all(
      recentTransactions.map(async (transaction) => {
        const [buyer] = await db
          .select({ displayName: users.displayName, email: users.email })
          .from(users)
          .where(eq(users.id, transaction.buyerId))
          .limit(1)

        const [snippet] = await db
          .select({ title: snippets.title })
          .from(snippets)
          .where(eq(snippets.id, transaction.snippetId))
          .limit(1)

        return {
          id: transaction.id,
          type: "sale" as const,
          amount: transaction.amount / 100,
          user: buyer?.displayName || buyer?.email.split("@")[0] || "Unknown",
          snippet: snippet?.title || "Unknown",
          timestamp: transaction.createdAt.toISOString(),
        }
      })
    )

    return NextResponse.json({
      totalRevenue: revenue,
      platformFees: platformFee,
      sellerPayouts,
      pendingPayouts: 0, // Would need payout tracking
      monthlyRevenue,
      monthlyFees,
      topSellers: topSellersWithDetails,
      recentTransactions: transactionsWithDetails,
    })
  } catch (error) {
    console.error("Failed to fetch earnings:", error)
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 })
  }
}