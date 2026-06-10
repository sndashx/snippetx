import { NextResponse } from "next/server"
import { db } from "@/db"
import { snippets, orders, users } from "@/db/schema"
import { desc, eq, count, sum } from "drizzle-orm"

export async function GET() {
  try {
    // Get all snippets with seller info
    const snippetsList = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        language: snippets.language,
        price: snippets.price,
        sellerId: snippets.sellerId,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .orderBy(desc(snippets.createdAt))

    // Get stats for each snippet
    const snippetsWithStats = await Promise.all(
      snippetsList.map(async (snippet) => {
        // Get seller info
        const [seller] = await db
          .select({ displayName: users.displayName, email: users.email })
          .from(users)
          .where(eq(users.id, snippet.sellerId))
          .limit(1)

        // Get download/sales count
        const [sales] = await db
          .select({ value: count() })
          .from(orders)
          .where(eq(orders.snippetId, snippet.id))

        return {
          id: snippet.id,
          title: snippet.title,
          description: snippet.description || "",
          language: snippet.language,
          price: snippet.price,
          seller: seller?.displayName || seller?.email.split("@")[0] || "Unknown",
          status: "approved" as const, // Would need a status field
          createdAt: snippet.createdAt.toISOString(),
          downloads: sales?.value ?? 0,
          rating: 4.5, // Would need a ratings system
          reports: 0, // Would need a reports system
        }
      })
    )

    return NextResponse.json(snippetsWithStats)
  } catch (error) {
    console.error("Failed to fetch snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}