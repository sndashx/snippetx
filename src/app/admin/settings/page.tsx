"use client"

import { useState } from "react"
import { Settings, Shield, Globe, Mail, CreditCard, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    platformName: "NUMINA",
    platformFee: 25,
    minimumPayout: 50,
    autoApproveSnippets: false,
    requireEmailVerification: true,
    enableTwoFactor: false,
    maintenanceMode: false,
    supportEmail: "support@sn-x.com",
    termsUrl: "/terms",
    privacyUrl: "/privacy",
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure platform-wide settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable the platform</p>
              </div>
              <button
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Fee (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.platformFee}
                onChange={(e) => setSettings({...settings, platformFee: parseInt(e.target.value)})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Current: {settings.platformFee}% per transaction
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Payout ($)</label>
              <input
                type="number"
                min="0"
                value={settings.minimumPayout}
                onChange={(e) => setSettings({...settings, minimumPayout: parseInt(e.target.value)})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum amount before automatic payout
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
              </div>
              <button
                onClick={() => setSettings({...settings, requireEmailVerification: !settings.requireEmailVerification})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireEmailVerification ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.requireEmailVerification ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableTwoFactor: !settings.enableTwoFactor})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableTwoFactor ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.enableTwoFactor ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card className="glass">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              Content Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Approve Snippets</p>
                <p className="text-sm text-muted-foreground">Automatically approve new snippets without review</p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoApproveSnippets: !settings.autoApproveSnippets})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoApproveSnippets ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                  settings.autoApproveSnippets ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Terms of Service URL</label>
              <input
                type="text"
                value={settings.termsUrl}
                onChange={(e) => setSettings({...settings, termsUrl: e.target.value})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Privacy Policy URL</label>
              <input
                type="text"
                value={settings.privacyUrl}
                onChange={(e) => setSettings({...settings, privacyUrl: e.target.value})}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}