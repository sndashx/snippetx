import { BrowseClient } from "@/components/browse-client"

export const dynamic = "force-dynamic"

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams

  return <BrowseClient lang={lang} />
}
