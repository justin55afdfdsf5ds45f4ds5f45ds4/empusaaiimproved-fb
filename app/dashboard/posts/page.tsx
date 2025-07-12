"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Shuffle, Lock, Crown, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { PostCard } from "@/components/dashboard/post-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimeSelect } from "@/components/ui/time-select"
import { DatePicker } from "@/components/ui/date-picker"

interface Post {
  _id: string
  title: string
  description: string
  imageUrl: string
  status: "draft" | "scheduled" | "published"
  scheduledFor?: string
  publishedAt?: string
  createdAt: string
  defaultLink?: string
  metrics?: {
    views: number
    likes: number
    shares: number
  }
}

export default function PostsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [pinterestBoards, setPinterestBoards] = useState<any[]>([])
  const [selectedBoardForPosts, setSelectedBoardForPosts] = useState<Record<string, string>>({})
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [isBulkShuffleOpen, setIsBulkShuffleOpen] = useState(false)
  const [bulkLinks, setBulkLinks] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [eligibleCount, setEligibleCount] = useState(0)
  const [csvError, setCsvError] = useState("")

  const buildCsv = (rows: string[][]) => {
    return rows.map(r => r.map(v => {
      const val = v ?? ""
      const needsQuote = /[",\n]/.test(val)
      const escaped = String(val).replace(/"/g,'""')
      return needsQuote ? `"${escaped}"` : escaped
    }).join(",")).join("\n")
  }

  useEffect(() => {
    fetchPosts()
    fetchBoards()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/recentposts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBoards = async () => {
    try {
      const response = await fetch("/api/pinterest/boards")
      if (response.ok) {
        const data = await response.json()
        setPinterestBoards(data.boards || [])
      }
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error)
    }
  }

  const handleBulkShuffleClick = () => {
    const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date()
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description:
          "Upgrade to premium to use Bulk Shuffle Schedule! This feature automatically schedules your posts across peak hours with optimal timing.",
        variant: "default",
      })
      router.push("/pricing")
      return
    }
    // compute eligible draft posts
    const eligible = posts.filter(p => selectedPosts.has(p._id) && p.status === "draft").length
    setEligibleCount(eligible)
    setIsBulkShuffleOpen(true)
  }

  const handleBulkSchedule = async () => {
    if (!selectedBoardId || !bulkLinks.trim() || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsScheduling(true)

      // Split links by newline and filter empty lines
      const links = bulkLinks.split("\n").filter(link => link.trim())

      // Get eligible draft posts only
      const selectedPostArray = posts.filter(
        post => selectedPosts.has(post._id) && post.status === "draft",
      )

      if (selectedPostArray.length === 0) {
        toast({
          title: "No Eligible Posts",
          description: "Selected posts have already been scheduled or published.",
          variant: "destructive",
        })
        return
      }

      // Combine date and time for base schedule time
      const baseScheduleTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":")
      baseScheduleTime.setHours(parseInt(hours), parseInt(minutes))

      // Schedule each post with a shuffled link
      for (let i = 0; i < selectedPostArray.length; i++) {
        const post = selectedPostArray[i]
        const link = links[i % links.length] // Cycle through links if more posts than links

        // Calculate staggered schedule time (add 1 hour for each post)
        const scheduleTime = new Date(baseScheduleTime.getTime() + (i * 60 * 60 * 1000))

        const response = await fetch("/api/pinterest/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardId: selectedBoardId,
            imageUrl: post.imageUrl,
            title: post.title,
            description: post.description,
            scheduledTime: scheduleTime.toISOString(),
            link: link.trim(),
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to schedule post ${post._id}`)
        }
      }

      toast({
        title: "Success",
        description: `Scheduled ${selectedPostArray.length} posts successfully.`,
      })

      // Clear selections and close dialog
      setSelectedPosts(new Set())
      setIsBulkShuffleOpen(false)
      setBulkLinks("")
      setSelectedDate(undefined)
      setSelectedTime("")
      
      // Refresh posts list
      fetchPosts()
    } catch (error) {
      console.error("Error scheduling posts:", error)
      toast({
        title: "Error",
        description: "Failed to schedule some posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handlePublish = async (postId: string) => {
    const post = posts.find(p => p._id === postId)
    if (!post) return

    setIsPublishing(postId)
    try {
      const response = await fetch("/api/posts/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoardForPosts[postId] || pinterestBoards[0]?.id,
          posts: [
            {
              id: post._id,
              title: post.title,
              description: post.description,
              imageUrl: post.imageUrl,
              link: postLinks[post._id] || post.defaultLink || "",
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      toast({
        title: "Published!",
      })

      // Remove the published post from the list
      setPosts((prev) => prev.filter((p) => p._id !== postId))
      setSelectedPosts((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(null)
    }
  }

  const handleSchedule = (postId: string) => {
    const post = posts.find(p => p._id === postId)
    if (post) {
      setCurrentPostForScheduling(post)
      setScheduleDialogOpen(true)
    }
  }

  const handleScheduleSubmit = async () => {
    if (!selectedDate || !selectedTime || !currentPostForScheduling) return

    try {
      setIsScheduling(true)

      // Combine date and time
      const scheduledDateTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":")
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))

      const response = await fetch("/api/pinterest/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoardForPosts[currentPostForScheduling._id] || pinterestBoards[0]?.id,
          imageUrl: currentPostForScheduling.imageUrl,
          title: currentPostForScheduling.title,
          description: currentPostForScheduling.description,
          scheduledTime: scheduledDateTime.toISOString(),
          link: postLinks[currentPostForScheduling._id] || currentPostForScheduling.defaultLink || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post")
      }

      toast({
        title: "Success",
        description: "Post scheduled successfully!",
      })

      // Reset form and close dialog
      setSelectedDate(undefined)
      setSelectedTime("")
      setScheduleDialogOpen(false)
      setCurrentPostForScheduling(null)

      // Refresh posts list
      fetchPosts()
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handleEditLink = (postId: string) => {
    // TODO: Implement link editing logic
    toast({
      title: "Coming Soon",
      description: "Link editing will be available soon!",
    })
  }

  const handleDelete = (postId: string) => {
    // TODO: Implement delete logic
    toast({
      title: "Coming Soon",
      description: "Post deletion will be available soon!",
    })
  }

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }

  const handleDownloadCSV = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Date / Time",
        description: "Please pick a publish date and time first.",
        variant: "destructive",
      })
      setCsvError("Please select both date and time before downloading CSV.")
      setMissingFields(["date", "time"])
      return
    }

    const eligiblePosts = posts.filter(p => (selectedPosts.size === 0 || selectedPosts.has(p._id)) && p.status === "draft")

    if (eligiblePosts.length === 0) {
      toast({
        title: "No Eligible Posts",
        description: "Selected posts are already scheduled, published.",
        variant: "destructive",
      })
      setCsvError("None of the selected posts are eligible (already scheduled, published or deleted).")
      return
    }

    // Combine base date+time
    const baseDateTime = new Date(selectedDate)
    const [h, m] = selectedTime.split(":")
    baseDateTime.setHours(parseInt(h), parseInt(m))

    const rows = eligiblePosts.map((post, idx) => {
      const scheduleDate = new Date(baseDateTime.getTime() + idx * 60 * 60 * 1000)
      return [
        post.title,
        post.description,
        post.imageUrl,
        postLinks[post._id] || post.defaultLink || "",
        scheduleDate.toISOString(),
      ]
    })

    const csvHeader = ["Title", "Description", "Image URL", "Link", "Scheduled At"]
    const csvString = buildCsv([csvHeader, ...rows])

    const blob = new Blob([csvString], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_schedule.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title:"CSV Downloaded", description:`${eligiblePosts.length} posts exported.` })
    setCsvError("")
  }

  const handleDeleteAll = async () => {
    if (!confirm("Delete all recent posts? This cannot be undone.")) return;
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts/recentposts", { method: "DELETE" })
      if (!response.ok) throw new Error("Failed")
      toast({ title:"Deleted", description:"All recent posts have been removed." })
      setPosts([])
      setSelectedPosts(new Set())
    } catch(err){
      toast({ title:"Error", description:"Unable to delete posts." , variant:"destructive" })
    } finally { setIsLoading(false) }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                <div className="aspect-[4/5] bg-gray-200 rounded animate-pulse my-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your Pinterest posts and schedule new content</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="relative bg-transparent"
          >
            Delete All
          </Button>
          {session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date() ? (
            <Button onClick={handleBulkShuffleClick} variant="outline" className="relative bg-transparent">
              <Shuffle className="h-4 w-4 mr-2" /> Bulk Shuffle Schedule
            </Button>
          ) : (
            <div className="flex flex-col items-start">
              <Button onClick={handleBulkShuffleClick} variant="outline" className="relative bg-transparent cursor-not-allowed" disabled>
                <div className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  <span>Bulk Shuffle Schedule</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Lock className="h-3 w-3 text-gray-400" />
                    <Crown className="h-3 w-3 text-yellow-500" />
                  </div>
                </div>
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Unlock Bulk Shuffle with {" "}
                <Link href="/pricing" className="text-teal-600 hover:underline">Premium</Link>.
              </p>
            </div>
          )}
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first Pinterest post</p>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const boardId = selectedBoardForPosts[post._id] || pinterestBoards[0]?.id
            const boardName = pinterestBoards.find(b => b.id === boardId)?.name || "No board"
            
            return (
              <PostCard
                key={post._id}
                post={{
                  id: post._id,
                  title: post.title,
                  description: post.description,
                  imageUrl: post.imageUrl,
                  defaultLink: post.defaultLink,
                  status: post.status,
                  scheduledFor: post.scheduledFor,
                  publishedAt: post.publishedAt,
                  createdAt: post.createdAt,
                  metrics: post.metrics,
                }}
                boardName={boardName}
                customLink={postLinks[post._id]}
                isSelected={selectedPosts.has(post._id)}
                isPublishing={isPublishing === post._id}
                showCheckbox={true}
                onSelect={togglePostSelection}
                onPublish={handlePublish}
                onSchedule={handleSchedule}
                onEditLink={handleEditLink}
                onDelete={handleDelete}
              />
            )
          })}
        </div>
      )}

      {/* Bulk Shuffle Dialog */}
      <Dialog open={isBulkShuffleOpen} onOpenChange={setIsBulkShuffleOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Shuffle Schedule</DialogTitle>
            <DialogDescription>
              Schedule multiple posts with rotating links across optimal time slots.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pinterest Board</Label>
              <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a board" />
                </SelectTrigger>
                <SelectContent>
                  {pinterestBoards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Links (one per line)</Label>
              <Textarea
                value={bulkLinks}
                onChange={(e) => setBulkLinks(e.target.value)}
                placeholder="Enter your links here, one per line..."
                className="h-32 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className={missingFields.includes("date") ? "border border-red-500 rounded-md p-1" : ""}>
                <DatePicker
                  date={selectedDate}
                  onDateChange={(d)=>{setSelectedDate(d);setMissingFields(f=>f.filter(x=>x!=="date"))}}
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className={missingFields.includes("time") ? "border border-red-500 rounded-md p-1" : ""}>
                <TimeSelect
                  value={selectedTime}
                  onValueChange={(t)=>{setSelectedTime(t);setMissingFields(f=>f.filter(x=>x!=="time"))}}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Posts will be scheduled 1 hour apart starting from this time.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkShuffleOpen(false)}>
              Cancel
            </Button>
            <div className="flex flex-col flex-1">
            {csvError && <p className="text-xs text-red-600 mb-1">{csvError}</p>}
            {selectedDate && selectedTime && (
              <Button
                variant="secondary"
                onClick={handleDownloadCSV}
                className="mr-auto"
              >
                Download CSV
              </Button>
            )}
            </div>
            <Button onClick={handleBulkSchedule} disabled={isScheduling}>
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Posts"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>
              Choose when to publish this post
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <TimeSelect
                value={selectedTime}
                onValueChange={setSelectedTime}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleSubmit}
              disabled={!selectedDate || !selectedTime || isScheduling}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
