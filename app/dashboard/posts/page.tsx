"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Info, LinkIcon, Trash2, Calendar, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Post {
  id: string
  title: string
  description: string
  imageUrl: string | null
  defaultLink?: string
}

export default function PostsPage() {
  // In a real app, you would fetch posts from your database
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState<string | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [pinterestBoards, setPinterestBoards] = useState<any[]>([])
  const [boardFetchError, setBoardFetchError] = useState<string | null>(null)
  const [isFetchingBoards, setIsFetchingBoards] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string>("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [postToLink, setPostToLink] = useState<Post | null>(null)
  const [customLink, setCustomLink] = useState("")
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [bulkShuffleDialogOpen, setBulkShuffleDialogOpen] = useState(false)
  const [shuffleLinks, setShuffleLinks] = useState("")

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/posts/recentposts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to fetch posts")

        const data = await res.json()
        setPosts(data.posts || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPosts()
  }, [])

  const fetchBoards = async () => {
    setIsFetchingBoards(true)
    setBoardFetchError(null)

    try {
      const response = await fetch("/api/pinterest/boards")

      if (response.status === 403) {
        setBoardFetchError("You haven’t connected Pinterest yet.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch Pinterest boards")
      }

      const data = await response.json()
      console.log(data)
      setPinterestBoards(data.boards || [])
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error)
      setBoardFetchError("Failed to fetch Pinterest boards. Please try again.")
    } finally {
      setIsFetchingBoards(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const handlePublish = async (post: any) => {
    setIsPublishing(post.id)

    try {
      const response = await fetch("/api/posts/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      toast({
        title: "Post Published",
        description: "Your post has been successfully published.",
      })

      // Remove the published post from the list
      setPosts(posts.filter((p) => p.id !== post.id))
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

  const openScheduleDialog = async (post: any) => {
    setCurrentPostForScheduling(post)
    setScheduleDialogOpen(true)
  }

  const handleSchedule = async () => {
    if (!currentPostForScheduling || !scheduledDate || !selectedBoard || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please select a date, time and board to schedule the post.",
        variant: "destructive",
      })
      return
    }

    setIsScheduling(currentPostForScheduling.id)
    const [hours, minutes] = scheduledTime.split(":").map(Number)
    const finalDateTime = new Date(scheduledDate)
    finalDateTime.setHours(hours, minutes, 0, 0)

    try {
      const response = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: currentPostForScheduling.id,
          title: currentPostForScheduling.title,
          description: currentPostForScheduling.description,
          imageUrl: currentPostForScheduling.imageUrl,
          scheduledDate: finalDateTime,
          boardId: selectedBoard,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post")
      }

      toast({
        title: "Post Scheduled",
        description: "Your post has been successfully scheduled.",
      })

      // Remove the scheduled post from the list
      setPosts(posts.filter((p) => p.id !== currentPostForScheduling.id))
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(null)
      setScheduleDialogOpen(false)
    }
  }

  const handleDeletePost = async (post: any) => {
    // In a real app, you would call an API to delete the post from your database
    setPosts(posts.filter((p) => p.id !== post.id))
    toast({
      title: "Post Deleted",
      description: "The post has been successfully deleted.",
    })
  }

  const handleLinkPost = (post: Post) => {
    setPostToLink(post)
    setCustomLink(postLinks[post.id] || "")
    setLinkDialogOpen(true)
  }

  const confirmLink = () => {
    if (postToLink && customLink) {
      setPostLinks((prev) => ({
        ...prev,
        [postToLink.id]: customLink,
      }))

      toast({
        title: "Link Added",
        description: "Custom link has been added to the post.",
      })
    }
    setLinkDialogOpen(false)
    setPostToLink(null)
    setCustomLink("")
  }

  const handleBulkShuffleSchedule = async () => {
    setBulkShuffleDialogOpen(false)
    const links = shuffleLinks.split(",").map((link) => link.trim())

    if (links.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one link.",
        variant: "destructive",
      })
      return
    }

    if (posts.length === 0) {
      toast({
        title: "Error",
        description: "No posts to shuffle schedule.",
        variant: "destructive",
      })
      return
    }

    // Basic validation for URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
    if (!links.every((link) => urlRegex.test(link))) {
      toast({
        title: "Error",
        description: "One or more links are invalid.",
        variant: "destructive",
      })
      return
    }

    // Shuffle schedule logic
    const now = new Date()
    const maxFutureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    const scheduledTimes = new Set<number>()

    for (const post of posts) {
      const randomLink = links[Math.floor(Math.random() * links.length)]

      let scheduledTime: Date

      // Attempt to generate a unique time within the next 7 days
      let attempts = 0
      do {
        attempts++
        const randomTime = new Date(now.getTime() + Math.random() * (maxFutureDate.getTime() - now.getTime()))
        scheduledTime = new Date(
          randomTime.getFullYear(),
          randomTime.getMonth(),
          randomTime.getDate(),
          randomTime.getHours(),
          randomTime.getMinutes(),
          0,
          0,
        ) // Set seconds and milliseconds to 0

        // Check if the time is within active hours (e.g., 9 AM to 9 PM)
        const hour = scheduledTime.getHours()
        if (hour < 9 || hour > 21) {
          continue // Skip times outside active hours
        }

        // Check for uniqueness with a 10-minute buffer
        let isUnique = true
        for (const existingTime of scheduledTimes) {
          if (Math.abs(scheduledTime.getTime() - existingTime) < 10 * 60 * 1000) {
            isUnique = false
            break
          }
        }

        if (isUnique) {
          scheduledTimes.add(scheduledTime.getTime())
          break
        }

        if (attempts > 100) {
          console.warn("Could not find a unique time after 100 attempts.")
          break // Exit loop if can't find a unique time
        }
      } while (true)

      if (attempts > 100) {
        toast({
          title: "Error",
          description: "Could not schedule all posts due to time conflicts.",
          variant: "destructive",
        })
        return
      }

      // Call the schedule API
      try {
        const response = await fetch("/api/posts/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post.id,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            scheduledDate: scheduledTime,
            boardId: selectedBoard,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to schedule post")
        }

        toast({
          title: "Post Scheduled",
          description: `Post "${post.title}" scheduled for ${scheduledTime.toLocaleString()}.`,
        })
      } catch (err: any) {
        toast({
          title: "Error",
          description: `Failed to schedule post "${post.title}": ${err.message}`,
          variant: "destructive",
        })
      }
    }

    // Refresh posts after scheduling
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/posts/recentposts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to fetch posts")

        const data = await res.json()
        setPosts(data.posts || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPosts()
  }

  const getMinTime = (date: Date | undefined): string => {
    if (!date) return "00:00"
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      const currentHour = today.getHours().toString().padStart(2, "0")
      const currentMinute = (today.getMinutes() + 10).toString().padStart(2, "0")
      return `${currentHour}:${currentMinute}`
    }
    return "00:00"
  }

  return (
    <>
      <div className="bg-green-100 text-green-800 p-3 text-center text-sm mb-6 rounded-md">
        <Info className="inline-block h-4 w-4 mr-2" />
        Posts generated here are temporarily stored and will be cleared after 24 hours. Please publish or schedule them.
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setBulkShuffleDialogOpen(true)}>→ Bulk Shuffle Schedule</Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.description}</p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                      onClick={() => handlePublish(post)}
                      disabled={isPublishing === post.id}
                    >
                      {isPublishing === post.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Publish"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openScheduleDialog(post)}
                      disabled={isScheduling === post.id}
                    >
                      {isScheduling === post.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        "Schedule"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600"
                      onClick={() => handleDeletePost(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => handleLinkPost(post)}
                    >
                      <LinkIcon className={`h-4 w-4 ${postLinks[post.id] ? "text-green-600" : "text-gray-600"}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No posts yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first Pinterest post by clicking the button below.</p>
            <Link href="/dashboard/create" className="mt-4 inline-block">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bulk Shuffle Schedule Dialog */}
      <Dialog open={bulkShuffleDialogOpen} onOpenChange={setBulkShuffleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bulk Shuffle Schedule</DialogTitle>
            <DialogDescription>
              Enter one or more links (URLs) that contain similar content, separated by commas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="shuffle-links">Links (comma-separated)</Label>
              <Input
                id="shuffle-links"
                value={shuffleLinks}
                onChange={(e) => setShuffleLinks(e.target.value)}
                placeholder="https://example.com/content1, https://example.com/content2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkShuffleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkShuffleSchedule} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Shuffling...
                </>
              ) : (
                "Shuffle Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>Select a date and time to schedule your Pinterest post.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Date Picker */}
            <div>
              <Label htmlFor="schedule-date">Date</Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0) // Remove time portion
                        return date < today // Only disable dates before today
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <Label htmlFor="schedule-time">Time</Label>
              <input
                id="schedule-time"
                type="time"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={scheduledTime}
                min={getMinTime(scheduledDate)}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleSchedule}
              disabled={!scheduledDate || !scheduledTime}
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

      {/* Link Post Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Link</DialogTitle>
            <DialogDescription>Enter a custom destination link for this post</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-link">Custom Link URL</Label>
              <Input
                id="custom-link"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLink} disabled={!customLink} className="bg-green-600 hover:bg-green-700">
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
