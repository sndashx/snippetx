import { NextResponse } from "next/server"
import { resend, FROM_EMAIL } from "@/lib/resend"

export const dynamic = "force-dynamic"

// Where integration / contact requests are delivered
const CONTACT_TO_EMAIL = "taylor@sn-x.com"

// Simple email shape check
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: Request) {
  let body: {
    name?: string
    email?: string
    projectType?: string
    budget?: string
    message?: string
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
  const projectType = (body.projectType ?? "").trim()
  const budget = (body.budget ?? "").trim()
  const message = (body.message ?? "").trim()
  const snippetId = (body.snippetId ?? "").trim()
  const snippetTitle = (body.snippetTitle ?? "").trim()

  // Validation
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Please include a message (at least 10 characters)." }, { status: 400 })
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long (max 5000 characters)." }, { status: 400 })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeProjectType = projectType ? escapeHtml(projectType) : "Not specified"
  const safeBudget = budget ? escapeHtml(budget) : "Not specified"
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")
  const snippetLine = snippetTitle
    ? `<tr><td style="padding:6px 0;color:#888;">Snippet</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(snippetTitle)}${snippetId ? ` (ID: ${escapeHtml(snippetId)})` : ""}</td></tr>`
    : ""

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0a0a;padding:24px;color:#fff;">
  <div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:20px 24px;">
      <h1 style="margin:0;font-size:18px;color:#000;font-weight:800;">🚀 New Integration / Contact Request</h1>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#ddd;">
        <tr><td style="padding:6px 0;color:#888;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${safeName}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;font-weight:600;"><a href="mailto:${safeEmail}" style="color:#f59e0b;">${safeEmail}</a></td></tr>
        <tr><td style="padding:6px 0;color:#888;">Project Type</td><td style="padding:6px 0;font-weight:600;">${safeProjectType}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Budget</td><td style="padding:6px 0;font-weight:600;">${safeBudget}</td></tr>
        ${snippetLine}
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #2a2a2a;">
        <p style="margin:0 0 8px;color:#888;font-size:13px;">Message</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#eee;">${safeMessage}</p>
      </div>
    </div>
    <div style="padding:16px 24px;background:#0f0f0f;border-top:1px solid #2a2a2a;">
      <p style="margin:0;font-size:12px;color:#666;">Reply directly to this email to respond to ${safeName}.</p>
    </div>
  </div>
</body>
</html>`

  try {
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Integration request from ${name}${snippetTitle ? ` — ${snippetTitle}` : ""}`,
      html,
    })

    if (sendError) {
      console.error("Resend returned an error sending contact email:", sendError)
      return NextResponse.json(
        { error: "Failed to send your message. Please try again or email taylor@sn-x.com directly." },
        { status: 502 },
      )
    }
  } catch (error: unknown) {
    console.error("Failed to send contact email:", error)
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or email taylor@sn-x.com directly." },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
