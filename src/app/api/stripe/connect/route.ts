import { db } from "@/db"
import { users } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { APP_URL } from "@/lib/constants"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1)

  if (!existingUser) {
    await db.insert(users).values({
      id: user.id,
      email: user.email!,
    })
  }

  if (existingUser?.stripeAccountId) {
    const accountLinks = await stripe.accountLinks.create({
      account: existingUser.stripeAccountId,
      refresh_url: `${APP_URL}/sell`,
      return_url: `${APP_URL}/sell`,
      type: "account_onboarding",
    })
    return NextResponse.json({ url: accountLinks.url })
  }

  const account = await stripe.accounts.create({
    type: "express",
    email: user.email!,
    metadata: { userId: user.id },
  })

  await db
    .update(users)
    .set({
      stripeAccountId: account.id,
      stripeAccountStatus: "inactive",
    })
    .where(eq(users.id, user.id))

  const accountLinks = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${APP_URL}/sell`,
    return_url: `${APP_URL}/sell`,
    type: "account_onboarding",
  })

  return NextResponse.json({ url: accountLinks.url })
}
