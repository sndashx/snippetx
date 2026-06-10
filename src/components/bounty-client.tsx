import { useState, useEffect } from "react"
import { Search, Filter, DollarSign, Clock, Users, Star, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Bounty {
  id: string
  title: string
  description: string
  language: string
  budget: number
  deadline: Date
  requirements: string[]
  status: "open" | "in_progress" | "completed" | "canceled"
  buyerId: string
  sellerId: string
  createdAt: Date
}

export function BountyClient() {
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("open")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "Other"]

  useEffect(() => {
    async function fetchBounties() {
      try {
        const params = new URLSearchParams()
        if (selectedStatus) params.append("status", selectedStatus)
        if (selectedLanguage && selectedLanguage !== "all") params.append("language", selectedLanguage)

        const response = await fetch(`/api/bounties?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setBounties(data)
        }
      } catch (error) {
        console.error("Failed to fetch bounties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBounties()
  }, [selectedStatus, selectedLanguage])

  const filteredBounties = bounties.filter((bounty) =>
    bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bounty.language.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDeadline = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return "Expired"
    if (days === 0) return "Today"
    if (days === 1) return "Tomorrow"
    return `${days} days left`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "canceled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Bounty System</h1>
          <p className="mt-2 text-muted-foreground">Find custom development projects and offer bounties for completion</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 font-semibold rounded-full transition-all hover:neon-glow">
              <Plus className="mr-2 size-4" />
              Create Bounty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Bounty</DialogTitle>
              <DialogDescription>
                Specify your custom development project requirements and offer a bounty for completion.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="E.g., React Component Library" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="1000" />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the specific requirements for this project..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="h-12 px-6 font-semibold rounded-full transition-all hover:neon-glow">
                Create Bounty
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bounties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang.toLowerCase()}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filteredBounties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star className="mb-4 size-12 text-muted-foreground/50" />
          <h3 className="text-xl font-bold">No bounties found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || selectedLanguage !== "all" || selectedStatus !== "open"
              ? "Try adjusting your filters"
              : "Be the first to create a bounty!"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBounties.map((bounty) => (
            <Card key={bounty.id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {bounty.title}
                  </CardTitle>
                  <Badge className={`${getStatusColor(bounty.status)} text-xs font-medium`}>
                    {bounty.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {bounty.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="size-3" />
                    ${bounty.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatDeadline(bounty.deadline)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {bounty.buyerId === bounty.sellerId ? "Self-bounty" : "Team bounty"}
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1">
                  {bounty.requirements.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full rounded-full transition-all hover:neon-glow">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}