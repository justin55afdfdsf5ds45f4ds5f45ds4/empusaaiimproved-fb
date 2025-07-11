"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Info, LinkIcon, Trash2, Calendar, Loader2, X, PinIcon } from "lucide-react"
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
// import { generateImage } from "@/lib/falai"; // Not used in this UI-only change

interface Post {
  postId: any
  id: string
  title: string
  description: string
  imageUrl: string | null
  defaultLink?: string
}

interface PinterestBoard {
  id: string
  name: string
}

const mockpinterestBoardss = [
  { id: "board-1", name: "My Travel Board" },
  { id: "board-2", name: "Food & Recipes" },
  { id: "board-3", name: "Home Decor Ideas" },
  { id: "board-4", name: "Fashion Inspiration" },
  { id: "board-5", name: "DIY Projects" },
]

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isProcessingPublish, setIsProcessingPublish] = useState<string | null>(null)
  const [isProcessingSchedule, setIsProcessingSchedule] = useState<string | null>(null)

  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [pinterestBoards, setPinterestBoards] = useState<PinterestBoard[]>([])
  const [postToLink, setPostToLink] = useState<Post | null>(null)
  const [customLink, setCustomLink] = useState("")
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})

  const [bulkShuffleDialogOpen, setBulkShuffleDialogOpen] = useState(false)
  const [shuffleLinkInputs, setShuffleLinkInputs] = useState<string[]>([""])
  const [isBulkScheduling, setIsBulkScheduling] = useState(false)
  const [bulkSelectedBoard, setBulkSelectedBoard] = useState<string>("")

  // State for new single post publish/schedule modals
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(null)
  const [modalSelectedBoard, setModalSelectedBoard] = useState<string>("")
  const [modalScheduledDate, setModalScheduledDate] = useState<Date | undefined>(undefined)
  const [modalScheduledTime, setModalScheduledTime] = useState<string>("")

  function getRandomDateBetween(start: Date, end: Date): Date {
    const diff = end.getTime() - start.getTime()
    const newTime = start.getTime() + Math.random() * diff
    return new Date(newTime)
  }

  function hasConflict(date: Date, scheduledDates: Date[], gapMinutes: number): boolean {
    return scheduledDates.some((d) => Math.abs(d.getTime() - date.getTime()) < gapMinutes * 60 * 1000)
  }

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

    const fetchBoards = async () => {
      try {
        const response = await fetch("/api/pinterest/boards")

        if (response.status === 403) {
          throw new Error("You haven't connected Pinterest yet.")
        }

        if (!response.ok) {
          throw new Error("Failed to fetch Pinterest boards")
        }

        const data = await response.json()
        console.log(data)
        setPinterestBoards(data.boards || [])

        if (!modalSelectedBoard && data.boards?.length > 0) {
          setModalSelectedBoard(data.boards[0].id)
        }
      } catch (error) {
        console.error("Error fetching Pinterest boards:", error)
        throw new Error("Failed to fetch Pinterest boards. Please try again.")
      }
    }

    fetchRecentPosts()
    fetchBoards()
  }, [])

  const openPublishDialogForPost = (post: Post) => {
    setSelectedPostForModal(post)
    setModalSelectedBoard("") // Reset board selection
    setIsPublishModalOpen(true)
  }

  const handleConfirmPublishFromModal = async () => {
    if (!selectedPostForModal || !modalSelectedBoard) {
      toast({
        title: "Error",
        description: "Please select a board to publish.",
        variant: "destructive",
      })
      return
    }
    setIsProcessingPublish(selectedPostForModal.id)
    try {
      const response = await fetch("/api/pinterest/pins/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: modalSelectedBoard,
          title: selectedPostForModal.title,
          description: selectedPostForModal.description,
          imageUrl: selectedPostForModal.imageUrl,
          link: postLinks[selectedPostForModal.id] || selectedPostForModal.defaultLink,
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

      // Post remains in the list - no removal
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPublish(null)
      setIsPublishModalOpen(false)
      setSelectedPostForModal(null)
    }
  }

  const openScheduleDialogForPost = (post: Post) => {
    setSelectedPostForModal(post)
    setModalSelectedBoard("") // Reset board selection
    setModalScheduledDate(undefined)
    setModalScheduledTime("")
    setIsScheduleModalOpen(true)
  }

  const handleConfirmScheduleFromModal = async () => {
    if (!selectedPostForModal || !modalSelectedBoard || !modalScheduledDate || !modalScheduledTime) {
      toast({
        title: "Error",
        description: "Please select a board, date, and time to schedule.",
        variant: "destructive",
      })
      return
    }
    setIsProcessingSchedule(selectedPostForModal.id)
    const [hours, minutes] = modalScheduledTime.split(":").map(Number)
    const finalDateTime = new Date(modalScheduledDate)
    finalDateTime.setHours(hours, minutes, 0, 0)

    try {
      const response = await fetch("/api/pinterest/schedule/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: modalSelectedBoard,
          title: selectedPostForModal.title,
          description: selectedPostForModal.description,
          imageUrl: selectedPostForModal.imageUrl,
          link: postLinks[selectedPostForModal.id] || selectedPostForModal.defaultLink,
          scheduledTime: finalDateTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post to Pinterest")
      }

      toast({
        title: "Post Scheduled",
        description: "Your post has been successfully scheduled to Pinterest.",
      })

      // Post remains in the list - no removal
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingSchedule(null)
      setIsScheduleModalOpen(false)
      setSelectedPostForModal(null)
    }
  }

  const handleDeletePost = async (post: any) => {
    try {
      const res = await fetch("/api/posts/delete/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.postId }), // make sure to use the same field as stored
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Unknown error")
      }

      setPosts((prevPosts) => prevPosts.filter((p) => p.postId !== post.postId))

      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
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

    if (!bulkSelectedBoard) {
      toast({
        title: "Error",
        description: "Please select a board for bulk scheduling.",
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

    try {
      const now = new Date()
      const sevenDaysLater = new Date(now)
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

      const scheduledDates: Date[] = []
      const successfullyScheduledPosts: string[] = []

      for (const post of posts) {
        let scheduledTime: Date

        // Try up to 10 times to find a time without conflict
        let attempts = 0
        do {
          scheduledTime = getRandomDateBetween(now, sevenDaysLater)
          attempts++
          if (attempts > 10) {
            // If can't find non-conflicting time after 10 tries, just proceed anyway
            break
          }
        } while (hasConflict(scheduledTime, scheduledDates, 10))

        scheduledDates.push(scheduledTime)
        let randomLink
        if (links.length > 0) {
          randomLink = links[Math.floor(Math.random() * links.length)]
        }

        const response = await fetch("/api/pinterest/schedule/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardId: bulkSelectedBoard,
            title: post.title,
            description: post.description,
            imageUrl: post.imageUrl,
            link: postLinks[post.id] || randomLink || post.defaultLink,
            scheduledTime: scheduledTime,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to schedule post to Pinterest")
        }

        successfullyScheduledPosts.push(post.postId)
      }

      // Posts remain in the list - no removal
      toast({
        title: "✅ Posts Scheduled!",
        description: `${successfullyScheduledPosts.length} posts have been scheduled to board: ${pinterestBoards.find((b) => b.id === bulkSelectedBoard)?.name}.`,
        variant: "default",
        className: "bg-green-500 border-green-500 text-white",
      })
    } catch (err) {
      console.error("Error in shuffleAndSchedule:", err)
      toast({
        title: "Error",
        description: "Failed to schedule posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBulkShuffleDialogOpen(false)
      setIsBulkScheduling(false)
    }
  }

  const getMinTime = (date: Date | undefined): string => {
    if (!date) return "00:00"
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      const now = new Date()
      let hours = now.getHours()
      let minutes = now.getMinutes()

      // Add 10 minutes, handling hour and day rollovers
      minutes += 10
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60)
        minutes %= 60
      }
      if (hours >= 24) {
        // This case means scheduling for next day, so min time is 00:00
        // However, for simplicity, if it rolls over to next day, we might just restrict to current day
        // or let the user pick. For this function, we'll just format.
        // If date is today and time rolls over, it's effectively past "today"
        // For this simple minTime, we'll just format. Calendar validation handles date.
        hours %= 24
      }
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }
    return "00:00"
  }

  // CSV Download logic
  function generateRandomUniqueDates(count: number): string[] {
    const now = new Date()
    const sevenDaysLater = new Date(now)
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    const usedTimestamps = new Set<number>()
    const dates: string[] = []
    while (dates.length < count) {
      const randomTime = now.getTime() + Math.random() * (sevenDaysLater.getTime() - now.getTime())
      const rounded = Math.floor(randomTime / 1000) * 1000 // round to nearest second
      if (!usedTimestamps.has(rounded)) {
        usedTimestamps.add(rounded)
        const d = new Date(rounded)
        dates.push(d.toISOString().slice(0, 19)) // 'YYYY-MM-DDTHH:MM:SS'
      }
    }
    return dates
  }

  function downloadCSV() {
    if (!posts.length) return
    const randomDates = generateRandomUniqueDates(posts.length)
    const headers = ["Title", "Media URL", "Pinterest board", "Description", "Link", "Publish date"]
    const rows = posts.map((post, idx) => {
      // Get the board ID for this post (adjust the state name if needed)
      const boardId = selectedPostForModal[post.id] || pinterestBoards[0]?.id
      // Find the board name
      const boardName = pinterestBoards.find((b) => b.id === boardId)?.name || "My Pinterest Board"
      return [
        post.title,
        post.imageUrl && !post.imageUrl.startsWith("data:") ? post.imageUrl : "",
        boardName,
        post.description,
        postLinks[post.id] || post.defaultLink || "",
        randomDates[idx],
      ]
    })
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pinterest-posts-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="bg-green-100 text-green-800 p-3 text-center text-sm mb-6 rounded-md">
        <Info className="inline-block h-4 w-4 mr-2" />
        Posts generated here are temporarily stored for 5 hours only.{" "}
        <Link href="https://cal.com/justin-lord-a80mr6/30min" target="_blank" className="text-blue-600 underline">
          Upgrade to Premium
        </Link>{" "}
        for unlimited storage and advanced features.
      </div>

      <div className="flex justify-end mb-4 gap-2">
        <Button onClick={downloadCSV} disabled={posts.length === 0} variant="outline">
          Download CSV
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Premium Feature",
              description:
                "Bulk Shuffle Schedule allows you to automatically schedule all your posts across 7 days with random timing and links. Upgrade to Premium to unlock this feature.",
              variant: "default",
            })
          }}
          disabled={posts.length === 0}
          variant="outline"
          className="relative"
        >
          🔒 Bulk Shuffle Schedule (Premium)
        </Button>
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
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative bg-gray-100">
                  <img
                    src={
                      post.imageUrl ||
                      `/placeholder.svg?height=600&width=400&query=abstract+${post.title.replace(/\s+/g, "+") || "/placeholder.svg"}`
                    }
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
                      onClick={() => openPublishDialogForPost(post)}
                      disabled={isProcessingPublish === post.id}
                    >
                      {isProcessingPublish === post.id ? (
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
                      className="flex-1 bg-transparent"
                      onClick={() => openScheduleDialogForPost(post)}
                      disabled={isProcessingSchedule === post.id}
                    >
                      {isProcessingSchedule === post.id ? (
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

          <div className="pb-4">
            <Label htmlFor="bulk-board-select" className="text-sm font-medium">
              Choose a Board
            </Label>
            <Select value={bulkSelectedBoard} onValueChange={setBulkSelectedBoard}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a Pinterest board" />
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

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setBulkShuffleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkShuffleSchedule}
              disabled={isBulkScheduling || shuffleLinkInputs.every((link) => link.trim() === "") || !bulkSelectedBoard}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
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

      {/* Publish Post Modal */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Post to Pinterest</DialogTitle>
            <DialogDescription>
              Select the Pinterest board where you want to publish "{selectedPostForModal?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="publish-modal-board-select">Pinterest Board</Label>
              <Select value={modalSelectedBoard} onValueChange={setModalSelectedBoard}>
                <SelectTrigger id="publish-modal-board-select" className="w-full mt-2">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPublishFromModal}
              disabled={!modalSelectedBoard || isProcessingPublish === selectedPostForModal?.id}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessingPublish === selectedPostForModal?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <PinIcon className="mr-2 h-4 w-4" /> Publish
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Post Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Post for Pinterest</DialogTitle>
            <DialogDescription>
              Select the board, date, and time to schedule "{selectedPostForModal?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div>
              <Label htmlFor="schedule-modal-board-select">Pinterest Board</Label>
              <Select value={modalSelectedBoard} onValueChange={setModalSelectedBoard}>
                <SelectTrigger id="schedule-modal-board-select" className="w-full mt-2">
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
            <div>
              <Label htmlFor="schedule-modal-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2 bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    {modalScheduledDate ? format(modalScheduledDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={modalScheduledDate}
                    onSelect={setModalScheduledDate}
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
            <div>
              <Label htmlFor="schedule-modal-time">Time</Label>
              <Input
                id="schedule-modal-time"
                type="time"
                className="mt-2 w-full"
                value={modalScheduledTime}
                min={getMinTime(modalScheduledDate)}
                onChange={(e) => setModalScheduledTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmScheduleFromModal}
              disabled={
                !modalSelectedBoard ||
                !modalScheduledDate ||
                !modalScheduledTime ||
                isProcessingSchedule === selectedPostForModal?.id
              }
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isProcessingSchedule === selectedPostForModal?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scheduling...
                </>
              ) : (
                "Schedule Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Post Dialog (existing) */}
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
