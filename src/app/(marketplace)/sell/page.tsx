import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function SellPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sell Snippets</h1>
        <p className="mt-2 text-muted-foreground">
          Share your code with the world. Earn from your expertise.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/sell/new">
          <div className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 transition-all hover:border-primary/50 hover:bg-primary/5">
            <Code2 className="mb-3 size-10 text-muted-foreground group-hover:text-primary transition-colors" />
            <h3 className="font-semibold">Upload Snippet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new snippet to the marketplace
            </p>
            <Button variant="ghost" className="mt-4" size="sm">
              Get Started <ArrowRight className="size-4" />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
