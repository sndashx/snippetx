import { randomBytes } from "node:crypto"
import { db } from "@/db"
import { users, passwordResets } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { sendPasswordResetEmail } from "@/lib/emails/password-reset"

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      // Don't reveal whether the user exists
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 })
    }

    // Generate a secure random token
    const token = randomBytes(32).toString("hex")

    // Store token with 1-hour expiry
    await db.insert(passwordResets).values({
      email: email.toLowerCase(),
      token,
      expiresAt: sql`now() + interval '1 hour'`,
    })

    // Derive base URL from the request origin, so it works in all environments
    const origin = req.headers.get("origin") || req.headers.get("host") || ""
    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail({
      to: email,
      resetUrl,
    })

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    console.error("Forgot password error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
