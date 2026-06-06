import { db } from "@/db"
import { snippets, users } from "@/db/schema"
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
    return NextResponse.redirect(`${APP_URL}/login`)
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

  const sessionParams = {
    payment_method_types: ["card"] as string[],
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
    mode: "payment" as const,
    success_url: `${APP_URL}/snippets/${snippet.id}?purchased=true`,
    cancel_url: `${APP_URL}/snippets/${snippet.id}`,
    metadata: {
      snippetId: snippet.id,
      buyerId: user.id,
      sellerId: snippet.sellerId,
    },
    application_fee_amount: Math.round(snippet.price * (PLATFORM_FEE_PERCENT / 100)),
    transfer_data: {
      destination: seller.stripeAccountId,
    },
  }

  const session = await stripe.checkout.sessions.create({
    ...sessionParams,
    application_fee_amount: sessionParams.application_fee_amount,
    transfer_data: sessionParams.transfer_data,
  } as Stripe.Checkout.SessionCreateParams)

  return NextResponse.json({ url: session.url })
}
