import type { Metadata } from "next"
import Link from "next/link"
import { Code2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | NUMINA",
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 6, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">1. Platform Description</h2>
              <p>
                NUMINA is a frontier artificial intelligence research lab building agentic language models that
                reason, plan, and act. We provide model APIs, research publications, and developer tools for
                building with frontier AI systems.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">2. User Responsibilities</h2>
              <p>By using NUMINA services, you agree to:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Provide accurate and complete account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not use the services for any unlawful purpose</li>
                <li>Not attempt to circumvent rate limits or payment systems</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any activity that disrupts or damages the services</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">3. Model Licensing</h2>
              <p>
                When you access NUMINA models through our API, you receive a non-exclusive, perpetual license
                to use those models in your personal and commercial projects. You may not redistribute, resell,
                or share the model weights or API access with third parties. NUMINA retains full ownership of
                its models and research.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">4. Payment Terms</h2>
              <p>
                API usage is billed according to our published pricing. Payments are processed through Stripe.
                All prices are listed in USD. You are responsible for any currency conversion fees imposed by
                your bank or payment provider.
              </p>
              <p className="mt-2">
                Subscription plans renew automatically unless cancelled. You may cancel at any time from your
                account settings.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">5. Refund Policy</h2>
              <p>
                Due to the computational nature of our products, API usage fees are non-refundable. Subscription
                fees may be refunded within 14 days of purchase if you have not exceeded your plan&apos;s free
                usage tier. If you experience an issue with our services, please contact our support team and
                we will work to resolve the matter.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>
                NUMINA is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any
                damages arising from your use of our services or models. We do not guarantee that model outputs
                will be error-free, accurate, or meet your specific requirements. It is your responsibility to
                test and verify model outputs before using them in production.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">7. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the United
                States. Any disputes arising under these terms shall be resolved in the appropriate courts
                located within the United States.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes to Terms</h2>
              <p>
                We reserve the right to update these terms at any time. Material changes will be communicated
                via email or a notice on the platform. Your continued use of NUMINA after changes are posted
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at{" "}
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
