import { stripe } from "@/lib/stripe"
import { db } from "@/db"
import { orders, snippets, users } from "@/db/schema"
import { getDownloadUrl } from "@/lib/r2"
import { resend, FROM_EMAIL } from "@/lib/resend"
import { APP_URL } from "@/lib/constants"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (!orderId) {
          console.error("checkout.session.completed missing orderId in metadata")
          break
        }

        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.id, orderId))
          .limit(1)

        if (!order) {
          console.error(`Order ${orderId} not found`)
          break
        }

        await db
          .update(orders)
          .set({
            status: "completed",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
          })
          .where(eq(orders.id, orderId))

        const [snippet] = await db
          .select()
          .from(snippets)
          .where(eq(snippets.id, order.snippetId))
          .limit(1)

        if (snippet) {
          const downloadUrl = await getDownloadUrl(snippet.filePath)

          const [buyer] = await db
            .select()
            .from(users)
            .where(eq(users.id, order.buyerId))
            .limit(1)

          if (buyer?.email) {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: buyer.email,
              subject: `Your purchase: ${snippet.title}`,
              html: `
                <h2>Thanks for your purchase!</h2>
                <p>You bought <strong>${snippet.title}</strong> for $${(order.amount / 100).toFixed(2)}.</p>
                <p><a href="${downloadUrl}">Download your snippet</a></p>
                <p>This link expires in 1 hour.</p>
                <p><a href="${APP_URL}/snippets/${snippet.id}">View on NUMINA</a></p>
              `,
            })
          }
        }

        console.log(`Order ${orderId} fulfilled`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId

        if (!orderId) {
          console.error("payment_intent.payment_failed missing orderId in metadata")
          break
        }

        await db
          .update(orders)
          .set({ status: "failed" })
          .where(eq(orders.id, orderId))

        console.log(`Order ${orderId} marked as failed`)
        break
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account

        let status = "inactive"
        if (account.charges_enabled && account.payouts_enabled) {
          status = "active"
        } else if (account.details_submitted) {
          status = "pending"
        }

        await db
          .update(users)
          .set({ stripeAccountStatus: status })
          .where(eq(users.stripeAccountId, account.id))

        console.log(`Account ${account.id} status updated to ${status}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`Error processing webhook ${event.type}:`, err)
  }

  return NextResponse.json({ received: true })
}
