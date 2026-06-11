import { BrowseClient } from "@/components/browse-client"

export const dynamic = "force-dynamic"

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; q?: string }>
}) {
  const { lang, q } = await searchParams

  return <BrowseClient lang={lang} q={q} />
}
