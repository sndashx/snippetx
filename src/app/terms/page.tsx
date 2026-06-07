import type { Metadata } from "next"
import Link from "next/link"
import { Code2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | SnippetX",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Code2 className="size-5" />
            SnippetX
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/sell" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sell
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 6, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">1. Platform Description</h2>
              <p>
                SnippetX is an online marketplace that enables developers to buy and sell production-ready code snippets.
                We act as an intermediary between buyers and sellers, facilitating transactions and providing hosting for
                snippet listings. We do not own the snippets listed on our platform unless explicitly stated.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">2. User Responsibilities</h2>
              <p>By using SnippetX, you agree to:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Provide accurate and complete account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not use the platform for any unlawful purpose</li>
                <li>Not upload malicious code, viruses, or harmful content</li>
                <li>Not attempt to circumvent payment systems or fees</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any activity that disrupts or damages the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">3. Snippet Licensing</h2>
              <p>
                When you purchase a snippet on SnippetX, you receive a non-exclusive, perpetual license to use that
                snippet in your personal and commercial projects. You may not redistribute, resell, or share the snippet
                with third parties. Sellers retain full ownership of their snippets and may list them on other platforms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">4. Payment Terms</h2>
              <p>
                All payments are processed through Stripe Connect. SnippetX charges a 25% platform fee on each sale.
                Sellers receive 75% of the listed price. Payouts are made to sellers&apos; connected Stripe accounts
                according to Stripe&apos;s standard payout schedule.
              </p>
              <p className="mt-2">
                All prices are listed in USD. Buyers are responsible for any currency conversion fees imposed by their
                bank or payment provider.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">5. Refund Policy</h2>
              <p>
                Due to the digital nature of our products, all sales are final. Once a snippet has been purchased and
                delivered, no refunds will be issued. If you experience an issue with a purchased snippet, please contact
                our support team and we will work to resolve the matter.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>
                SnippetX is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any
                damages arising from your use of the platform or any snippets purchased through it. We do not guarantee
                that snippets will be error-free, compatible with your environment, or meet your specific requirements.
                It is your responsibility to test and verify code before using it in production.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">7. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the United States.
                Any disputes arising under these terms shall be resolved in the appropriate courts located within the
                United States.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes to Terms</h2>
              <p>
                We reserve the right to update these terms at any time. Material changes will be communicated via email
                or a notice on the platform. Your continued use of SnippetX after changes are posted constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:support@sn-x.com" className="text-foreground underline hover:no-underline">
                  support@sn-x.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} SnippetX</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
