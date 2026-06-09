import { db } from "@/db"
import { wishlists, snippets, users } from "@/db/schema"
import { eq, lt, and, or, isNull, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { sendPriceDropEmail } from "@/lib/emails/price-drop"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: Request) {
  // Simple auth check using a cron secret
  const authHeader = req.headers.get("authorization")
  const expectedToken = process.env.CRON_SECRET

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Find all wishlist entries where snippet price dropped below wishedPrice
    // and we haven't notified yet (or price dropped further since last notification)
    const priceDrops = await db
      .select({
        wishlistUserId: wishlists.userId,
        wishlistSnippetId: wishlists.snippetId,
        wishedPrice: wishlists.wishedPrice,
        lastNotifiedPrice: wishlists.lastNotifiedPrice,
        snippetTitle: snippets.title,
        snippetPrice: snippets.price,
        userEmail: users.email,
        userName: users.displayName,
      })
      .from(wishlists)
      .innerJoin(snippets, eq(wishlists.snippetId, snippets.id))
      .innerJoin(users, eq(wishlists.userId, users.id))
      .where(
        and(
          lt(snippets.price, wishlists.wishedPrice),
          or(
            isNull(wishlists.lastNotifiedPrice),
            lt(snippets.price, wishlists.lastNotifiedPrice),
          ),
        ),
      )

    let sent = 0
    let errors = 0

    for (const drop of priceDrops) {
      try {
        const recipientEmail = drop.userEmail
        const recipientName = drop.userName || drop.userEmail.split("@")[0]

        await sendPriceDropEmail({
          to: recipientEmail,
          userName: recipientName,
          snippetTitle: drop.snippetTitle,
          snippetId: drop.wishlistSnippetId,
          oldPrice: drop.wishedPrice,
          newPrice: drop.snippetPrice,
        })

        // Update lastNotifiedPrice so we don't re-notify
        await db
          .update(wishlists)
          .set({
            lastNotifiedPrice: drop.snippetPrice,
            updatedAt: sql`now()`,
          })
          .where(
            and(
              eq(wishlists.userId, drop.wishlistUserId),
              eq(wishlists.snippetId, drop.wishlistSnippetId),
            ),
          )

        sent++
      } catch (err) {
        console.error("Failed to send price drop email:", err)
        errors++
      }
    }

    return NextResponse.json({
      checked: priceDrops.length,
      sent,
      errors,
      message: `Checked ${priceDrops.length} price drops, sent ${sent} emails${errors ? ` (${errors} errors)` : ""}`,
    })
  } catch (error) {
    console.error("Price drop cron failed:", error)
    return NextResponse.json({ error: "Price drop check failed" }, { status: 500 })
  }
}
