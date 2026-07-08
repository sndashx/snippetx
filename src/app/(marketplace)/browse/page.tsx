import type { Metadata } from "next"
import { BrowseClient } from "@/components/browse-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string }>
}): Promise<Metadata> {
  const { lang, q } = await searchParams

  // Canonicalize: search (?q=) variants collapse to the clean /browse or
  // /browse?lang=X URL to avoid duplicate-content dilution.
  const canonical = lang ? `/browse?lang=${encodeURIComponent(lang)}` : "/browse"

  const title = lang
    ? `Browse ${lang} Code Snippets`
    : q
      ? `Search results for "${q}"`
      : "Browse Code Snippets"

  const description = lang
    ? `Browse production-ready ${lang} code snippets for sale on NUMINA. Filter, preview, and buy with instant download.`
    : "Browse the NUMINA marketplace — production-ready code snippets across every major language. Filter by language or search for what you need."

  return {
    title,
    description,
    alternates: { canonical },
    // Don't index bare search-result pages (thin/duplicate); do index language facets.
    robots: q && !lang ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string }>
}) {
  const { lang, q } = await searchParams

  return <BrowseClient lang={lang} q={q} />
}
