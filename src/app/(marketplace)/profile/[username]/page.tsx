import { db } from "@/db"
import { users, snippets, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Code2, ArrowLeft, Shield, Download, Clock, Star, Globe, ExternalLink, GitBranch, MessageSquareCode } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PurchaseButton } from "@/components/purchase-button"
import { SnippetDetailsClient } from "@/components/snippet-details/snippet-details-client"

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params

  let user: {
    id: string
    email: string
    displayName: string | null
    avatarUrl: string | null
    createdAt: Date
  } | null = null

  try {
    const results = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.displayName, username))
      .limit(1)

    user = results[0] ?? null
  } catch (error) {
    console.error("Failed to fetch user:", error)
    notFound()
  }

  if (!user) notFound()

  let profile: {
    bio: string | null
    website: string | null
    github: string | null
    twitter: string | null
    totalSales: number
    rating: number
  } | null = null

  try {
    const results = await db
      .select({
        bio: profiles.bio,
        website: profiles.website,
        github: profiles.github,
        twitter: profiles.twitter,
        totalSales: profiles.totalSales,
        rating: profiles.rating,
      })
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1)

    profile = results[0] ?? null
  } catch (error) {
    console.error("Failed to fetch profile:", error)
  }

  let userSnippets: {
    id: string
    title: string
    description: string
    price: number
    language: string
    createdAt: Date
  }[] = []

  try {
    const results = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        price: snippets.price,
        language: snippets.language,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .where(eq(snippets.sellerId, user.id))
      .orderBy(snippets.createdAt)

    userSnippets = results
  } catch (error) {
    console.error("Failed to fetch user snippets:", error)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Browse
      </Link>

      <div className="space-y-12">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl glass">
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName || user.email} className="size-24 rounded-2xl object-cover" />
                  ) : (
                    <Code2 className="size-12 text-primary" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {user.displayName || user.email.split("@")[0]}
                </h1>
                <p className="mt-1 text-muted-foreground">@{user.email.split("@")[0]}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-500" />
                    {profile?.rating || 0} rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="size-4" />
                    {profile?.totalSales || 0} sales
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    Member since {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted hover:bg-card transition-colors">
                  <Globe className="size-4" />
                  Website
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted hover:bg-card transition-colors">
                  <GitBranch className="size-4" />
                  GitHub
                </a>
              )}
              {profile?.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted hover:bg-card transition-colors">
                  <MessageSquareCode className="size-4" />
                  X
                </a>
              )}
            </div>
          </div>
          
          {profile?.bio && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* User's Snippets */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Published Snippets</h2>
            <span className="text-sm text-muted-foreground">{userSnippets.length} snippets</span>
          </div>
          
          {userSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center">
              <Code2 className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-xl font-bold">No snippets yet</h3>
              <p className="mt-2 text-muted-foreground">This seller hasn't published any snippets yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userSnippets.map((snippet, i) => (
                <Link key={snippet.id} href={`/snippets/${snippet.id}`}>
                  <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 glass">
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                          {snippet.language}
                        </span>
                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {snippet.title}
                      </h3>
                      <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {snippet.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-6 pt-0 border-t border-border/50 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-muted border border-border" />
                        <span className="text-xs font-medium text-muted-foreground">
                          @{user.email.split("@")[0]}
                        </span>
                      </div>
                      <span className="text-xl font-bold tracking-tighter">${(snippet.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
