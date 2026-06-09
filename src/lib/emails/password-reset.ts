import { resend, FROM_EMAIL } from "@/lib/resend"
import { APP_URL } from "@/lib/constants"

interface PasswordResetEmailParams {
  to: string
  resetUrl: string
}

export async function sendPasswordResetEmail({ to, resetUrl }: PasswordResetEmailParams) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0a0a0b; }
    .container { max-width: 480px; margin: 0 auto; padding: 40px 24px; }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo-text { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #fafafa; }
    .card { background: #18181b; border-radius: 16px; padding: 40px 32px; border: 1px solid #27272a; }
    .card h2 { color: #fafafa; font-size: 20px; font-weight: 700; text-align: center; margin: 0 0 8px 0; }
    .card p { color: #a1a1aa; font-size: 14px; line-height: 1.6; text-align: center; margin: 0 0 32px 0; }
    .btn { display: block; background: #fafafa; color: #09090b !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; text-align: center; margin: 0 auto; max-width: 280px; }
    .btn:hover { background: #e4e4e7; }
    .footer { text-align: center; margin-top: 32px; color: #52525b; font-size: 12px; }
    .footer a { color: #a1a1aa; text-decoration: underline; }
    .warning { background: #1c1917; border: 1px solid #292524; border-radius: 10px; padding: 16px; margin-top: 24px; }
    .warning p { color: #a1a1aa; font-size: 12px; text-align: center; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">⌘ SnippetX</span>
    </div>
    <div class="card">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password. Click the button below to create a new one. This link expires in 1 hour.</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
      <div class="warning">
        <p>If you didn't request this, you can safely ignore this email. Only someone with access to this email can reset your account.</p>
      </div>
    </div>
    <div class="footer">
      <p>SnippetX &mdash; sn-x.com</p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your SnippetX password",
    html,
  })
}
