import { db } from "@/db"
import { orders, snippets } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { getDownloadUrl } from "@/lib/r2"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", _req.url))
  }

  const [order] = await db
    .select({
      id: orders.id,
      buyerId: orders.buyerId,
      snippetId: orders.snippetId,
      filePath: snippets.filePath,
    })
    .from(orders)
    .innerJoin(snippets, eq(orders.snippetId, snippets.id))
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order || order.buyerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const url = await getDownloadUrl(order.filePath)
  return NextResponse.redirect(url)
}
