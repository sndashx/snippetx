import Link from "next/link"
import { db } from "@/db"
import { snippets, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Code2, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
]

export default async function BrowsePage() {
  const allSnippets = await db
    .select({
      id: snippets.id,
      title: snippets.title,
      description: snippets.description,
      price: snippets.price,
      language: snippets.language,
      author: users.email,
      createdAt: snippets.createdAt,
    })
    .from(snippets)
    .innerJoin(users, eq(snippets.sellerId, users.id))
    .orderBy(desc(snippets.createdAt))
    .limit(50)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse Snippets</h1>
        <p className="mt-2 text-muted-foreground">
          Find production-ready code for your next project.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <span
            key={lang}
            className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
          >
            {lang}
          </span>
        ))}
      </div>

      {allSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <Code2 className="mb-4 size-10 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No snippets yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Be the first to sell a snippet on SnippetX.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Start Selling <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allSnippets.map((snippet) => (
            <Link key={snippet.id} href={`/snippets/${snippet.id}`}>
              <Card className="group h-full transition-all hover:shadow-sm">
                <CardContent className="pb-3">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {snippet.language}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight group-hover:underline">
                    {snippet.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {snippet.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    by {snippet.author.split("@")[0]}
                  </span>
                  <span className="text-lg font-bold tracking-tight">
                    ${snippet.price}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
