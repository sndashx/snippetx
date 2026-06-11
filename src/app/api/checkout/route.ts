import { db } from "@/db"
import { snippets, users, orders } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { stripe, PLATFORM_FEE_PERCENT } from "@/lib/stripe"
import { APP_URL } from "@/lib/constants"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required", loginRequired: true }, { status: 401 })
  }

  const { snippetId } = await req.json()

  if (!snippetId) {
    return NextResponse.json({ error: "Missing snippetId" }, { status: 400 })
  }

  const [snippet] = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, snippetId))
    .limit(1)

  if (!snippet) {
    return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
  }

  if (snippet.sellerId === user.id) {
    return NextResponse.json({ error: "Cannot purchase your own snippet" }, { status: 400 })
  }

  const [seller] = await db
    .select()
    .from(users)
    .where(eq(users.id, snippet.sellerId))
    .limit(1)

  if (!seller?.stripeAccountId) {
    return NextResponse.json({ error: "Seller not connected to Stripe" }, { status: 500 })
  }

  const [order] = await db
    .insert(orders)
    .values({
      buyerId: user.id,
      sellerId: snippet.sellerId,
      snippetId: snippet.id,
      amount: snippet.price,
      platformFee: Math.round(snippet.price * (PLATFORM_FEE_PERCENT / 100)),
      status: "pending",
    })
    .returning()

  let isPlatformSeller = false
  try {
    const platformAccount = await stripe.accounts.retrieve("self")
    isPlatformSeller = seller.stripeAccountId === platformAccount.id
  } catch {
  }

  const checkoutParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: snippet.title,
            description: snippet.description,
          },
          unit_amount: snippet.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${APP_URL}/snippets/${snippet.id}?purchased=true`,
    cancel_url: `${APP_URL}/snippets/${snippet.id}`,
    metadata: {
      orderId: order.id,
      snippetId: snippet.id,
      buyerId: user.id,
      sellerId: snippet.sellerId,
    },
  }

  // Only add Connect params if seller is not the platform itself
  if (!isPlatformSeller) {
    (checkoutParams as Stripe.Checkout.SessionCreateParams & {
      application_fee_amount: number
      transfer_data: { destination: string }
    }).application_fee_amount = Math.round(
      snippet.price * (PLATFORM_FEE_PERCENT / 100)
    )
    ;(checkoutParams as Stripe.Checkout.SessionCreateParams & {
      application_fee_amount: number
      transfer_data: { destination: string }
    }).transfer_data = {
      destination: seller.stripeAccountId,
    }
  }

  try {
    const session = await stripe.checkout.sessions.create(checkoutParams)

    if (!session.url) {
      console.error("Stripe Checkout Session created but no URL returned")
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    )
  }
}
