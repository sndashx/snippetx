/**
 * Metadata helper for the lab website.
 *
 * This is a thin re-export of the `buildMetadata` factory defined in
 * `src/lib/brand.ts`. Keeping the helper under `lib/metadata.ts` makes it
 * the single obvious import for route-level `generateMetadata` calls and
 * makes it easy to add helpers (e.g. canonical, JSON-LD) without leaking
 * brand constants into every route.
 */
export { buildMetadata } from "@/lib/brand"
export type { Metadata } from "next"
