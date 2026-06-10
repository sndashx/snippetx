import { NextResponse } from "next/server"
import { db } from "@/db"
import { users, snippets, orders } from "@/db/schema"
import { count, sum, eq, desc, gte } from "drizzle-orm"

export async function GET() {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total counts
    const [totalUsers] = await db.select({ value: count() }).from(users)
    const [totalSnippets] = await db.select({ value: count() }).from(snippets)
    const [totalOrders] = await db.select({ value: count() }).from(orders)

    // Get total revenue
    const [totalRevenue] = await db
      .select({ value: sum(orders.amount) })
      .from(orders)
      .where(eq(orders.status, "completed"))

    // Get recent signups (last 30 days)
    const [recentSignups] = await db
      .select({ value: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))

    // Calculate stats
    const averageOrderValue = (totalOrders?.value ?? 0) > 0 
      ? (Number(totalRevenue?.value ?? 0) / (totalOrders?.value ?? 0)) / 100 
      : 0

    const conversionRate = (totalUsers?.value ?? 0) > 0 
      ? ((totalOrders?.value ?? 0) / (totalUsers?.value ?? 0)) * 100 
      : 0

    return NextResponse.json({
      totalUsers: totalUsers?.value ?? 0,
      totalSellers: 0, // Would need a role field in users table
      totalBuyers: totalUsers?.value ?? 0,
      totalSnippets: totalSnippets?.value ?? 0,
      totalOrders: totalOrders?.value ?? 0,
      totalRevenue: Number(totalRevenue?.value ?? 0) / 100,
      averageOrderValue,
      conversionRate,
      recentSignups: recentSignups?.value ?? 0,
      pendingApprovals: 0, // Would need a status field
      flaggedContent: 0, // Would need a reports/flags system
      activeDisputes: 0, // Would need a disputes system
    })
  } catch (error) {
    console.error("Failed to fetch admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}