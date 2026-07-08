import { createAdminClient } from "@/lib/supabase/server"
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://numina.org"
    const redirectTo = `${appUrl}/reset-password`

    const adminSupabase = await createAdminClient()

    // Generate a recovery link without sending Supabase's default email.
    // We send our own branded email via Resend.
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    })

    if (error) {
      // Don't reveal whether user exists — just swallow the error
      console.error("Supabase generateLink error:", error.message)
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 },
      )
    }

    const resetUrl = data.properties.action_link

    // Send our branded email via Resend with the recovery link
    await sendPasswordResetEmail({ to: email, resetUrl })

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 },
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    console.error("Forgot password error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
