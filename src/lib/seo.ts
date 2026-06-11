import { APP_URL } from "@/lib/constants"

/**
 * Turn a title into a URL-safe slug.
 * "Stripe Checkout Helper!" -> "stripe-checkout-helper"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/**
 * Build a canonical, SEO-friendly snippet path: /snippets/<slug>-<uuid>.
 * The UUID is always preserved as the last 5 dash-separated segments so the
 * id can be recovered regardless of the slug text.
 */
export function snippetPath(id: string, title?: string | null): string {
  const slug = title ? slugify(title) : ""
  return slug ? `/snippets/${slug}-${id}` : `/snippets/${id}`
}

export function snippetUrl(id: string, title?: string | null): string {
  return `${APP_URL}${snippetPath(id, title)}`
}

/**
 * Extract a bare UUID from a slugged or plain route param.
 * Accepts "stripe-checkout-helper-<uuid>" or "<uuid>" and returns the uuid,
 * or null if no uuid is present.
 */
const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function extractId(param: string): string | null {
  const match = param.match(UUID_RE)
  return match ? match[0] : null
}

/** Strip control chars / collapse whitespace for use in meta descriptions. */
export function truncateForMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).trimEnd() + "…"
}

/** Render a JSON-LD <script> string safely (escape the closing tag). */
export function jsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c")
}
