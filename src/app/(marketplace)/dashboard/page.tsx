"use client"

import { useState, useEffect } from "react"
import { Code2, ArrowLeft, Shield, Download, Clock, Star, TrendingUp, DollarSign, Users, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardStats {
  totalRevenue: number
  totalSales: number
  totalSnippets: number
  conversionRate: number
}

interface SnippetAnalytics {
  id: string
  title: string
  views: number
  sales: number
  revenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [snippets, setSnippets] = useState<SnippetAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [statsRes, snippetsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/snippets"),
        ])
        if (statsRes.ok) setStats(await statsRes.json())
        if (snippetsRes.ok) setSnippets(await snippetsRes.json())
      } catch (err) {
        console.error("Failed to fetch dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const statCards = [
    { title: "Total Revenue", value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "—", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Total Sales", value: stats ? stats.totalSales.toLocaleString() : "—", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { title: "Published Snippets", value: stats ? stats.totalSnippets.toLocaleString() : "—", icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Conversion Rate", value: stats ? `${stats.conversionRate.toFixed(1)}%` : "—", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Seller Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track your performance and manage your snippets.</p>
        </div>
        <Button className="h-12 px-6 font-semibold rounded-full transition-all hover:neon-glow" render={<Link href="/sell/new" />}>
          <Code2 className="mr-2 size-4" />
          Publish New Snippet
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-xl glass"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold tracking-tighter">{stat.value}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Snippets Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl glass">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Snippet Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          ) : snippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Code2 className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-xl font-bold">No snippets published yet</h3>
              <p className="mt-2 text-muted-foreground">Publish your first snippet to see analytics here.</p>
              <Button className="mt-6 h-12 px-6 font-semibold rounded-full transition-all hover:neon-glow" render={<Link href="/sell/new" />}>
                <Code2 className="mr-2 size-4" />
                Publish Snippet
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Snippet</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Views</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sales</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence mode="popLayout">
                    {snippets.map((snippet, i) => (
                      <motion.tr
                        key={snippet.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link href={`/snippets/${snippet.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {snippet.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-muted-foreground">{snippet.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-primary">{snippet.sales}</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold">${snippet.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                          {snippet.views > 0 ? ((snippet.sales / snippet.views) * 100).toFixed(1) : 0}%
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  )
}
