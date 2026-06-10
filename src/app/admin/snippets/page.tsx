"use client"

import { useState, useEffect } from "react"
import { Code2, Search, Filter, Eye, Check, X, Trash2, Star, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Snippet {
  id: string
  title: string
  description: string
  language: string
  price: number
  seller: string
  status: "pending" | "approved" | "rejected" | "flagged"
  createdAt: string
  downloads: number
  rating: number
  reports: number
}

export default function AdminSnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterLanguage, setFilterLanguage] = useState<string>("all")

  useEffect(() => {
    async function fetchSnippets() {
      try {
        const res = await fetch("/api/admin/snippets")
        if (res.ok) setSnippets(await res.json())
      } catch (err) {
        console.error("Failed to fetch snippets:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSnippets()
  }, [])

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || snippet.status === filterStatus
    const matchesLanguage = filterLanguage === "all" || snippet.language === filterLanguage
    return matchesSearch && matchesStatus && matchesLanguage
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-500"
      case "pending": return "bg-yellow-500/10 text-yellow-500"
      case "rejected": return "bg-red-500/10 text-red-500"
      case "flagged": return "bg-orange-500/10 text-orange-500"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Snippet Management</h1>
          <p className="mt-2 text-muted-foreground">
            Review and manage all snippets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search snippets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Languages</option>
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Snippets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Code2 className="mb-4 size-12 text-muted-foreground/50" />
          <h3 className="text-xl font-bold">No snippets found</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet, i) => (
              <motion.div
                key={snippet.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="glass h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">
                        {snippet.language}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusColor(snippet.status)}`}>
                        {snippet.status}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-1">{snippet.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{snippet.description}</p>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">by {snippet.seller}</span>
                      <span className="font-semibold">${(snippet.price / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Download className="size-3" />
                        {snippet.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-3" />
                        {snippet.rating.toFixed(1)}
                      </span>
                      {snippet.reports > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                          <X className="size-3" />
                          {snippet.reports} reports
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 size-3" />
                        View
                      </Button>
                      {snippet.status === "pending" && (
                        <>
                          <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                            <Check className="mr-1 size-3" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <X className="mr-1 size-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      {snippet.status === "approved" && (
                        <Button variant="destructive" size="sm" className="flex-1">
                          <X className="mr-1 size-3" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}