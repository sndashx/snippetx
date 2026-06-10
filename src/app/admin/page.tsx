"use client"

import { useState, useEffect } from "react"
import { 
  Users, Code2, DollarSign, TrendingUp, TrendingDown, 
  ShoppingCart, Eye, Clock, Activity, ArrowUpRight, ArrowDownRight,
  Shield, AlertTriangle, CheckCircle, XCircle, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

interface PlatformStats {
  totalUsers: number
  totalSellers: number
  totalBuyers: number
  totalSnippets: number
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
  recentSignups: number
  pendingApprovals: number
  flaggedContent: number
  activeDisputes: number
}

interface RecentActivity {
  id: string
  type: "signup" | "purchase" | "snippet_upload" | "dispute" | "refund"
  user: string
  details: string
  timestamp: string
  status: "success" | "pending" | "failed"
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities"),
        ])
        if (statsRes.ok) setStats(await statsRes.json())
        if (activitiesRes.ok) setActivities(await activitiesRes.json())
      } catch (err) {
        console.error("Failed to fetch admin data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const statCards = [
    { 
      title: "Total Users", 
      value: stats ? stats.totalUsers.toLocaleString() : "—", 
      change: stats ? `+${stats.recentSignups}` : "—",
      changeType: "positive",
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10" 
    },
    { 
      title: "Total Revenue", 
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "—", 
      change: stats ? `$${stats.averageOrderValue.toFixed(2)} avg` : "—",
      changeType: "neutral",
      icon: DollarSign, 
      color: "text-green-500", 
      bg: "bg-green-500/10" 
    },
    { 
      title: "Total Snippets", 
      value: stats ? stats.totalSnippets.toLocaleString() : "—", 
      change: stats ? `${stats.totalSellers} sellers` : "—",
      changeType: "neutral",
      icon: Code2, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10" 
    },
    { 
      title: "Conversion Rate", 
      value: stats ? `${stats.conversionRate.toFixed(1)}%` : "—", 
      change: stats ? `${stats.totalOrders} orders` : "—",
      changeType: "neutral",
      icon: TrendingUp, 
      color: "text-primary", 
      bg: "bg-primary/10" 
    },
    { 
      title: "Pending Approvals", 
      value: stats ? stats.pendingApprovals.toLocaleString() : "—", 
      change: stats ? `${stats.flaggedContent} flagged` : "—",
      changeType: stats && stats.pendingApprovals > 0 ? "warning" : "neutral",
      icon: Clock, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10" 
    },
    { 
      title: "Active Disputes", 
      value: stats ? stats.activeDisputes.toLocaleString() : "—", 
      change: stats && stats.activeDisputes > 0 ? "Needs attention" : "None",
      changeType: stats && stats.activeDisputes > 0 ? "negative" : "positive",
      icon: AlertTriangle, 
      color: stats && stats.activeDisputes > 0 ? "text-red-500" : "text-green-500", 
      bg: stats && stats.activeDisputes > 0 ? "bg-red-500/10" : "bg-green-500/10" 
    },
  ]

  const getActivityIcon = (type: string, status: string) => {
    if (status === "success") return <CheckCircle className="size-4 text-green-500" />
    if (status === "failed") return <XCircle className="size-4 text-red-500" />
    return <Clock className="size-4 text-yellow-500" />
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "signup": return "bg-blue-500/10 text-blue-500"
      case "purchase": return "bg-green-500/10 text-green-500"
      case "snippet_upload": return "bg-purple-500/10 text-purple-500"
      case "dispute": return "bg-red-500/10 text-red-500"
      case "refund": return "bg-yellow-500/10 text-yellow-500"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Platform overview and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            SNIPPETxADMIN
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tighter">{stat.value}</p>
                    <div className="mt-1 flex items-center gap-1">
                      {stat.changeType === "positive" && <ArrowUpRight className="size-3 text-green-500" />}
                      {stat.changeType === "negative" && <ArrowDownRight className="size-3 text-red-500" />}
                      <span className={`text-xs ${
                        stat.changeType === "positive" ? "text-green-500" : 
                        stat.changeType === "negative" ? "text-red-500" : 
                        "text-muted-foreground"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`flex size-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="size-5" />
              </div>
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">View and edit users</p>
              </div>
            </Link>
            <Link
              href="/admin/snippets"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Code2 className="size-5" />
              </div>
              <div>
                <p className="font-medium">Review Snippets</p>
                <p className="text-xs text-muted-foreground">Approve or reject</p>
              </div>
            </Link>
            <Link
              href="/admin/earnings"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="font-medium">View Earnings</p>
                <p className="text-xs text-muted-foreground">Platform revenue</p>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="font-medium">Platform Settings</p>
                <p className="text-xs text-muted-foreground">Configure platform</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Activity className="mb-4 size-12 text-muted-foreground/50" />
              <h3 className="text-xl font-bold">No recent activity</h3>
              <p className="mt-2 text-muted-foreground">Activity will appear here as users interact with the platform.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type, activity.status)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      activity.status === "success" ? "bg-green-500/10 text-green-500" :
                      activity.status === "failed" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}