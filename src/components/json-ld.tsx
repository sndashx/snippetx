import { jsonLd } from "@/lib/seo"

/**
 * Server component that injects a JSON-LD structured-data <script>.
 * Use one per schema object.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  )
}
