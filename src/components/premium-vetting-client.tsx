import { useState, useEffect } from "react"
import { Shield, CheckCircle, AlertCircle, Clock, Upload, FileText, Award, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PremiumVetting {
  id: string
  userId: string
  status: "pending" | "approved" | "rejected"
  verificationType: "identity" | "business" | "portfolio"
  submissionDate: Date
  reviewDate?: Date
  notes?: string
  documents?: string[]
  completedAt?: Date
}

interface VerifiedBadge {
  id: string
  userId: string
  badgeType: "verified_seller" | "premium_support" | "expert"
  issuedAt: Date
  expiresAt?: Date
  issuerId?: string
}

export function PremiumVettingClient() {
  const [vettings, setVettings] = useState<PremiumVetting[]>([])
  const [badges, setBadges] = useState<VerifiedBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedVetting, setSelectedVetting] = useState<PremiumVetting | null>(null)

  const verificationTypes = [
    { value: "identity", label: "Identity Verification", description: "Verify your personal identity" },
    { value: "business", label: "Business Verification", description: "Verify your business credentials" },
    { value: "portfolio", label: "Portfolio Verification", description: "Showcase your work and expertise" },
  ]

  useEffect(() => {
    async function fetchVettings() {
      try {
        const [vettingsResponse, badgesResponse] = await Promise.all([
          fetch("/api/premium-vetting"),
          fetch("/api/badges"),
        ])

        if (vettingsResponse.ok) {
          const data = await vettingsResponse.json()
          setVettings(data)
        }
        if (badgesResponse.ok) {
          const data = await badgesResponse.json()
          setBadges(data)
        }
      } catch (error) {
        console.error("Failed to fetch premium vetting data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVettings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "verified_seller":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "premium_support":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "expert":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleSubmitVetting = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const verificationType = formData.get("verificationType") as string
      const documents = formData.get("documents") ? [formData.get("documents") as string] : []

      const response = await fetch("/api/premium-vetting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationType,
          documents,
        }),
      })

      if (response.ok) {
        const newVetting = await response.json()
        setVettings([newVetting, ...vettings])
        setIsCreateDialogOpen(false)
      } else {
        console.error("Failed to submit vetting")
      }
    } catch (error) {
      console.error("Error submitting vetting:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const userVetting = vettings[0]
  const userBadge = badges.find((badge) => badge.userId === vettings[0]?.userId)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Premium Vetting</h1>
          <p className="mt-2 text-muted-foreground">Verify your identity and unlock premium features</p>
        </div>
        {userVetting?.status === "pending" ? (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="mr-2 size-4" />
            Pending Review
          </Badge>
        ) : userVetting?.status === "approved" ? (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="mr-2 size-4" />
            Verified
          </Badge>
        ) : userVetting?.status === "rejected" ? (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <AlertCircle className="mr-2 size-4" />
            Rejected
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : userVetting ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${getStatusColor(userVetting.status)}`}>
                        {userVetting.status === "pending" && <Clock className="size-5" />}
                        {userVetting.status === "approved" && <CheckCircle className="size-5" />}
                        {userVetting.status === "rejected" && <AlertCircle className="size-5" />}
                      </div>
                      <div>
                        <p className="font-medium">Status: {userVetting.status}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {userVetting.submissionDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(userVetting.status)}`}>
                      {userVetting.verificationType}
                    </Badge>
                  </div>

                  {userVetting.status === "pending" && (
                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Your verification is being reviewed. This process typically takes 2-3 business days.
                      </p>
                    </div>
                  )}

                  {userVetting.status === "approved" && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Congratulations! You have been approved for premium vetting. You now have access to premium features.
                      </p>
                    </div>
                  )}

                  {userVetting.status === "rejected" && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Your verification was rejected. Please review the feedback and resubmit.
                      </p>
                    </div>
                  )}

                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full rounded-full transition-all hover:neon-glow"
                        disabled={userVetting.status !== "pending"}
                      >
                        Submit New Verification
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submit Verification</DialogTitle>
                        <DialogDescription>
                          Choose a verification type and upload required documents.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitVetting} className="space-y-6">
                        <div className="grid gap-3">
                          <Label htmlFor="verificationType">Verification Type</Label>
                          <Select name="verificationType" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select verification type" />
                            </SelectTrigger>
                            <SelectContent>
                              {verificationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-muted-foreground">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="documents">Document URL</Label>
                          <Input
                            id="documents"
                            name="documents"
                            placeholder="https://example.com/document.pdf"
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting} className="rounded-full transition-all hover:neon-glow">
                            {isSubmitting ? "Submitting..." : "Submit Verification"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="mb-4 size-12 text-muted-foreground/50" />
                  <h3 className="text-xl font-bold">No Verification Submitted</h3>
                  <p className="mt-2 text-muted-foreground">
                    Start your premium vetting process by submitting verification documents.
                  </p>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-6 h-12 px-6 font-semibold rounded-full transition-all hover:neon-glow">
                        Start Verification
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submit Verification</DialogTitle>
                        <DialogDescription>
                          Choose a verification type and upload required documents.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitVetting} className="space-y-6">
                        <div className="grid gap-3">
                          <Label htmlFor="verificationType">Verification Type</Label>
                          <Select name="verificationType" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select verification type" />
                            </SelectTrigger>
                            <SelectContent>
                              {verificationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-muted-foreground">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="documents">Document URL</Label>
                          <Input
                            id="documents"
                            name="documents"
                            placeholder="https://example.com/document.pdf"
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting} className="rounded-full transition-all hover:neon-glow">
                            {isSubmitting ? "Submitting..." : "Submit Verification"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadge ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${getBadgeColor(userBadge.badgeType)}`}>
                        <Award className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {userBadge.badgeType === "verified_seller"
                            ? "Verified Seller"
                            : userBadge.badgeType === "premium_support"
                              ? "Premium Support"
                              : "Expert"
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issued on {userBadge.issuedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getBadgeColor(userBadge.badgeType)}`}>
                      Active
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Award className="mb-4 size-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-bold">No Badges Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete premium vetting to earn badges and unlock premium features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Verification Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Higher Visibility</p>
                    <p className="text-sm text-muted-foreground">Your snippets appear in premium search results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Priority Support</p>
                    <p className="text-sm text-muted-foreground">Get faster response times from support team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Premium Analytics</p>
                    <p className="text-sm text-muted-foreground">Access advanced analytics and insights</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}