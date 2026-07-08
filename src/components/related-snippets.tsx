import Link from "next/link"
import { Code2 } from "lucide-react"
import { snippetPath } from "@/lib/seo"
import type { RelatedSnippet } from "@/app/(marketplace)/snippets/[id]/snippet-data"

export function RelatedSnippets({ items }: { items: RelatedSnippet[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-6 text-xl font-bold tracking-tight">
        Related snippets
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <Link
            key={s.id}
            href={snippetPath(s.id, s.title)}
            className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                {s.language}
              </span>
              <Code2 className="size-4 text-muted-foreground" />
            </div>
            <h3 className="mb-2 line-clamp-2 text-sm font-bold tracking-tight group-hover:text-primary transition-colors">
              {s.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">@{s.author || "numina.org"}</span>
              <span className="text-sm font-bold tracking-tighter">${(s.price / 100).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
