"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface EarningsData {
  totalRevenue: number
  platformFees: number
  sellerPayouts: number
  pendingPayouts: number
  monthlyRevenue: number[]
  monthlyFees: number[]
  topSellers: {
    id: string
    username: string
    revenue: number
    sales: number
  }[]
  recentTransactions: {
    id: string
    type: "sale" | "payout" | "refund" | "fee"
    amount: number
    user: string
    snippet: string
    timestamp: string
  }[]
}

export default function AdminEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/admin/earnings")
        if (res.ok) setEarnings(await res.json())
      } catch (err) {
        console.error("Failed to fetch earnings:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEarnings()
  }, [])

  const statCards = [
    { 
      title: "Total Revenue", 
      value: earnings ? `$${earnings.totalRevenue.toLocaleString()}` : "—", 
      icon: DollarSign, 
      color: "text-green-500", 
      bg: "bg-green-500/10" 
    },
    { 
      title: "Platform Fees (25%)", 
      value: earnings ? `$${earnings.platformFees.toLocaleString()}` : "—", 
      icon: Wallet, 
      color: "text-primary", 
      bg: "bg-primary/10" 
    },
    { 
      title: "Seller Payouts", 
      value: earnings ? `$${earnings.sellerPayouts.toLocaleString()}` : "—", 
      icon: CreditCard, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10" 
    },
    { 
      title: "Pending Payouts", 
      value: earnings ? `$${earnings.pendingPayouts.toLocaleString()}` : "—", 
      icon: TrendingUp, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10" 
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Revenue</h1>
          <p className="mt-2 text-muted-foreground">
            Platform financial overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            {timeframe === "week" ? "This Week" : timeframe === "month" ? "This Month" : "This Year"}
          </Button>
          <Button>
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-64 flex items-end gap-2">
                {earnings?.monthlyRevenue.map((revenue, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary/20 rounded-t"
                      style={{ height: `${(revenue / Math.max(...earnings.monthlyRevenue)) * 200}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(2024, i).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle>Top Sellers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {earnings?.topSellers.map((seller, i) => (
                  <div key={seller.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">{seller.username}</p>
                        <p className="text-sm text-muted-foreground">{seller.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${seller.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Snippet</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {earnings?.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          transaction.type === "sale" ? "bg-green-500/10 text-green-500" :
                          transaction.type === "payout" ? "bg-blue-500/10 text-blue-500" :
                          transaction.type === "refund" ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-purple-500/10 text-purple-500"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{transaction.user}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.snippet}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">
                        <span className={transaction.type === "refund" ? "text-red-500" : "text-green-500"}>
                          {transaction.type === "refund" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}