"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Info, LinkIcon, Trash2, Calendar, Loader2, X } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { generateImage } from "@/lib/falai"

interface Post {
  id: string
  title: string
  description: string
  imageUrl: string | null
  defaultLink?: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState<string | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  // const [pinterestBoards, setPinterestBoards] = useState<any[]>([])
  // const [boardFetchError, setBoardFetchError] = useState<string | null>(null)
  // const [isFetchingBoards, setIsFetchingBoards] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string>("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [postToLink, setPostToLink] = useState<Post | null>(null)
  const [customLink, setCustomLink] = useState("")
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [bulkShuffleDialogOpen, setBulkShuffleDialogOpen] = useState(false)

  const [shuffleLinkInputs, setShuffleLinkInputs] = useState<string[]>([""])
  const [isBulkScheduling, setIsBulkScheduling] = useState(false)
  const [bulkSelectedBoard, setBulkSelectedBoard] = useState<string>("")

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

  const handlePublish = async (post: any) => {
    if (!selectedBoard) {
      toast({
        title: "Board Required",
        description: "Please select a Pinterest board to publish your post.",
        variant: "destructive",
      })
      return
    }

    if (!post.imageUrl) {
      // Generate image first if not already generated
      toast({
        title: "Generating Image",
        description: "Generating image before publishing...",
      })

      const imageUrl = await generateImage(post)

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update the post with the generated image
      post = { ...post, imageUrl }
      setPosts((prevPosts) => prevPosts.map((p) => (p.id === post.id ? { ...post } : p)))
    }

    setIsPublishing(post.id)

    console.log(selectedBoard)
    console.log(post.imageUrl)

    try {
      const response = await fetch("/api/pinterest/pins/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoard,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
          link: postLinks[post.id] || post.defaultLink,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post to Pinterest")
      }

      const data = await response.json()
      toast({
        title: "Post Published",
        description: "Your post has been successfully published to Pinterest.",
      })

      // Remove the published post from the list
      setPosts(posts.filter((p) => p.id !== post.id))
      setIsPublishing(null)
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post. Please try again.",
        variant: "destructive",
      })
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Post Scheduled",
        description: "Your post has been successfully scheduled.",
      })
      setPosts(posts.filter((p) => p.id !== currentPostForScheduling.id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(null)
      setScheduleDialogOpen(false)
    }
  }

  const handleDeletePost = async (post: any) => {
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

  const handleAddLinkInput = () => {
    setShuffleLinkInputs([...shuffleLinkInputs, ""])
  }

  const handleRemoveLinkInput = (index: number) => {
    const newLinks = [...shuffleLinkInputs]
    newLinks.splice(index, 1)
    setShuffleLinkInputs(newLinks)
  }

  const handleLinkInputChange = (index: number, value: string) => {
    const newLinks = [...shuffleLinkInputs]
    newLinks[index] = value
    setShuffleLinkInputs(newLinks)
  }

  const handleBulkShuffleSchedule = async () => {
    setIsBulkScheduling(true)
    const links = shuffleLinkInputs.filter((link) => link.trim() !== "")

    if (links.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one link.",
        variant: "destructive",
      })
      setIsBulkScheduling(false)
      return
    }

    if (posts.length === 0) {
      toast({
        title: "Error",
        description: "No posts to shuffle schedule.",
        variant: "destructive",
      })
      setIsBulkScheduling(false)
      return
    }

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
    if (!links.every((link) => urlRegex.test(link))) {
      toast({
        title: "Error",
        description: "One or more links are invalid.",
        variant: "destructive",
      })
      setIsBulkScheduling(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "✅ Posts Scheduled!",
      description: "Posts have been scheduled out successfully!",
      variant: "default",
      className: "bg-green-500 border-green-500 text-white",
    })

    setBulkShuffleDialogOpen(false)
    setIsBulkScheduling(false)
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
                    src={post.imageUrl || "/placeholder.svg?height=600&width=400&query=abstract+post+image"}
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
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePost(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleLinkPost(post)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="mb-3">Bulk Shuffle Schedule</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Enter one or more links (URLs) that contain similar content. These links will be randomly used across all
              recent posts. <br className="hidden sm:block" />
              All posts in "Recent Posts" will be shuffled and scheduled out within 7 days in the future, during peak
              user activity hours, with a minimum 10-minute gap between each post.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2 pb-4 space-y-4 max-h-60 overflow-y-auto">
            {shuffleLinkInputs.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  id={`shuffle-link-${index}`}
                  value={link}
                  onChange={(e) => handleLinkInputChange(index, e.target.value)}
                  placeholder={`https://example.com/content${index + 1}`}
                  className="flex-grow"
                />
                {shuffleLinkInputs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLinkInput(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="link"
              onClick={handleAddLinkInput}
              className="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm"
            >
              + Add Link
            </Button>
          </div>

          {/* Board Selection Section */}
          <div className="pb-4">
            <Label htmlFor="bulk-board-select" className="text-sm font-medium">
              Choose a Board
            </Label>
            <Select value={bulkSelectedBoard} onValueChange={setBulkSelectedBoard}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a Pinterest board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="board-1">My Travel Board</SelectItem>
                <SelectItem value="board-2">Food & Recipes</SelectItem>
                <SelectItem value="board-3">Home Decor Ideas</SelectItem>
                <SelectItem value="board-4">Fashion Inspiration</SelectItem>
                <SelectItem value="board-5">DIY Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setBulkShuffleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkShuffleSchedule}
              disabled={isBulkScheduling}
              className="bg-emerald-500 text-white 
                         font-semibold
                         transition-all duration-300 ease-in-out 
                         transform
                         hover:bg-emerald-600 
                         hover:scale-110 
                         hover:shadow-2xl 
                         hover:shadow-emerald-500/50
                         hover:brightness-105
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75
                         active:scale-100 active:brightness-95"
            >
              {isBulkScheduling ? (
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

      {/* Schedule Post Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>Select a date and time to schedule your Pinterest post.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
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
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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
              disabled={!scheduledDate || !scheduledTime || isScheduling === currentPostForScheduling?.id}
            >
              {isScheduling === currentPostForScheduling?.id ? (
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
            <Button onClick={confirmLink} disabled={!customLink} className="bg-green-600 hover:bg-green-700 text-white">
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
