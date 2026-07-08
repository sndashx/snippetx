import type { Metadata } from "next"
import Link from "next/link"
import { Code2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | NUMINA",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-5" />
            NUMINA
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/#models" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Models
            </Link>
            <Link href="/#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Research
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 6, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">1. Data We Collect</h2>
              <p>We collect the following information when you use NUMINA:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Account information:</strong> Email address and display name provided during sign-up via Supabase Auth.</li>
                <li><strong className="text-foreground">Payment information:</strong> Payment details are processed by Stripe and are never stored on our servers. Stripe may collect billing address, card details, and transaction history.</li>
                <li><strong className="text-foreground">Usage data:</strong> Pages visited, actions taken, and browser metadata for analytics and service improvement.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">2. How We Use Your Data</h2>
              <p>Your data is used to:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Provide and maintain the NUMINA platform and API</li>
                <li>Process API subscriptions and manage billing</li>
                <li>Send transactional emails (usage alerts, account notifications)</li>
                <li>Detect and prevent abuse or unauthorized access</li>
                <li>Improve model performance and service features</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">3. Third-Party Services</h2>
              <p>We use the following third-party services that may collect or process your data:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Stripe:</strong> Payment processing and billing. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Stripe Privacy Policy</a></li>
                <li><strong className="text-foreground">Supabase:</strong> Authentication and database hosting. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Supabase Privacy Policy</a></li>
                <li><strong className="text-foreground">Cloudflare:</strong> CDN and security services. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Cloudflare Privacy Policy</a></li>
                <li><strong className="text-foreground">Resend:</strong> Transactional email delivery. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Resend Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">4. Cookies</h2>
              <p>
                NUMINA uses essential cookies to maintain your session and authentication state. We do not use
                third-party advertising cookies. You may configure your browser to reject cookies, though this may
                affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">5. Data Retention</h2>
              <p>
                We retain your account information for as long as your account is active. If you delete your
                account, we will remove your personal data within 30 days, except where required by law or for
                legitimate business purposes (such as transaction records for tax compliance).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Export your data in a portable format</li>
                <li>Object to processing of your data</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:support@numina.ai" className="text-foreground underline hover:no-underline">
                  support@numina.ai
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">7. Data Security</h2>
              <p>
                We implement industry-standard security measures including encrypted data transmission (TLS),
                secure authentication via Supabase Auth, and PCI-compliant payment processing through Stripe.
                No full credit card numbers are stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">8. Children&apos;s Privacy</h2>
              <p>
                NUMINA is not intended for users under the age of 13. We do not knowingly collect personal
                information from children. If we become aware that a child has provided us with personal data,
                we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Significant changes will be communicated
                via email or a notice on the platform. Continued use of NUMINA after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">10. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@numina.ai" className="text-foreground underline hover:no-underline">
                  support@numina.ai
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Numina Research, Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
