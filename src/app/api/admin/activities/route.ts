import { NextResponse } from "next/server"
import { db } from "@/db"
import { users, snippets, orders } from "@/db/schema"
import { desc, eq, count } from "drizzle-orm"

export async function GET() {
  try {
    // Get recent users
    const recentUsers = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10)

    // Get recent orders
    const recentOrders = await db
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

    // Get recent snippets
    const recentSnippets = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        createdAt: snippets.createdAt,
        sellerId: snippets.sellerId,
      })
      .from(snippets)
      .orderBy(desc(snippets.createdAt))
      .limit(10)

    // Combine and sort by timestamp
    const activities = [
      ...recentUsers.map(user => ({
        id: user.id,
        type: "signup" as const,
        user: user.displayName || user.email.split("@")[0],
        details: "Joined the platform",
        timestamp: user.createdAt.toISOString(),
        status: "success" as const,
      })),
      ...recentOrders.map(order => ({
        id: order.id,
        type: "purchase" as const,
        user: `User ${order.buyerId.slice(0, 8)}`,
        details: `Purchased snippet for $${(order.amount / 100).toFixed(2)}`,
        timestamp: order.createdAt.toISOString(),
        status: "success" as const,
      })),
      ...recentSnippets.map(snippet => ({
        id: snippet.id,
        type: "snippet_upload" as const,
        user: `User ${snippet.sellerId.slice(0, 8)}`,
        details: `Uploaded "${snippet.title}"`,
        timestamp: snippet.createdAt.toISOString(),
        status: "success" as const,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Failed to fetch admin activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}