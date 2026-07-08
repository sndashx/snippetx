import { resend, FROM_EMAIL } from "@/lib/resend"
import { APP_URL } from "@/lib/constants"

interface PriceDropEmailParams {
  to: string
  userName: string
  snippetTitle: string
  snippetId: string
  oldPrice: number
  newPrice: number
}

export async function sendPriceDropEmail({
  to,
  userName,
  snippetTitle,
  snippetId,
  oldPrice,
  newPrice,
}: PriceDropEmailParams) {
  const savings = oldPrice - newPrice
  const snippetUrl = `${APP_URL}/snippets/${snippetId}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 480px; margin: 0 auto; padding: 32px 24px; }
    .card { background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .badge { display: inline-block; background: #fef2f2; color: #ef4444; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
    .price-old { text-decoration: line-through; color: #9ca3af; font-size: 20px; }
    .price-new { color: #ef4444; font-size: 32px; font-weight: 800; }
    .savings { color: #22c55e; font-size: 14px; font-weight: 600; }
    .btn { display: inline-block; background: #18181b; color: #ffffff !important; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; }
    .footer { margin-top: 24px; text-align: center; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="badge">Price Drop</div>
      <p style="font-size:18px; font-weight:600; margin-top:16px;">Hi ${userName},</p>
      <p style="color:#6b7280; line-height:1.6;">
        Good news! The price of <strong style="color:#18181b;">${snippetTitle}</strong> has dropped since you added it to your wishlist.
      </p>
      <div style="text-align:center; margin:24px 0;">
        <div class="price-old">$${oldPrice.toFixed(2)}</div>
        <div style="margin:4px 0;">
          <span style="font-size:20px;">→</span>
        </div>
        <div class="price-new">$${newPrice.toFixed(2)}</div>
        <div class="savings">You save $${savings.toFixed(2)}!</div>
      </div>
      <div style="text-align:center; margin-top:24px;">
        <a href="${snippetUrl}" class="btn">View Snippet</a>
      </div>
    </div>
    <div class="footer">
      <p>NUMINA &mdash; sn-x.com</p>
      <p>You're receiving this because you added this snippet to your wishlist.</p>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `💰 ${snippetTitle} just dropped to $${newPrice.toFixed(2)}!`,
    html,
  })
}
