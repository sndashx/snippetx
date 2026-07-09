import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Lab contact stub.
 *
 * Validates the request shape and returns { ok: true, success: true }.
 * The integration-form (contact-form.tsx) and the homepage contact section
 * both POST here; the homepage variant is a marketing stub and the
 * integration variant used to send via Resend. Both clients read either
 * `ok` or `success`, so this response satisfies both contracts.
 *
 * Wire a real backend in by replacing this body — the request contract
 * is stable.
 */
export async function POST(req: Request) {
  let body: {
    name?: string
    email?: string
    message?: string
    // Integration-form fields — accepted but ignored in the stub.
    projectType?: string
    budget?: string
    snippetId?: string
    snippetTitle?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const name = (body.name ?? "").trim()
  const email = (body.email ?? "").trim()
  const message = (body.message ?? "").trim()

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    )
  }
  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: "Please include a message (at least 10 characters)." },
      { status: 400 },
    )
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Message is too long (max 5000 characters)." },
      { status: 400 },
    )
  }

  return NextResponse.json({ ok: true, success: true }, { status: 200 })
}