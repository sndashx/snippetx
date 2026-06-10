import { NextResponse } from "next/server"
import { db } from "@/db"
import { users, snippets, orders } from "@/db/schema"
import { desc, eq, count, sum } from "drizzle-orm"

export async function GET() {
  try {
    // Get all users with their stats
    const usersList = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    // Get order counts and revenue for each user
    const usersWithStats = await Promise.all(
      usersList.map(async (user) => {
        // Count purchases
        const [purchases] = await db
          .select({ value: count() })
          .from(orders)
          .where(eq(orders.buyerId, user.id))

        // Count sales (snippets sold)
        const [sales] = await db
          .select({ value: count() })
          .from(orders)
          .innerJoin(snippets, eq(orders.snippetId, snippets.id))
          .where(eq(snippets.sellerId, user.id))

        // Calculate revenue from sales
        const [revenue] = await db
          .select({ value: sum(orders.amount) })
          .from(orders)
          .innerJoin(snippets, eq(orders.snippetId, snippets.id))
          .where(eq(snippets.sellerId, user.id))

        return {
          id: user.id,
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
          role: "buyer" as const, // Default role
          status: "active" as const,
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.createdAt.toISOString(), // Would need last_login field
          totalPurchases: purchases?.value ?? 0,
          totalSales: sales?.value ?? 0,
          totalRevenue: Number(revenue?.value ?? 0) / 100,
        }
      })
    )

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}