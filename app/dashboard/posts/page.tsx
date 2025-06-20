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
  id: string
  title: string
  description: string
  imageUrl: string | null
  defaultLink?: string
}

const mockPinterestBoards = [
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

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const samplePosts = Array.from({ length: 3 }, (_, i) => ({
          id: `post-${i + 1}`,
          title: `Sample Post Title ${i + 1}`,
          description: `This is a sample description for post ${i + 1}. It's engaging and informative.`,
          imageUrl: null, // Will use placeholder
          defaultLink: `https://example.com/post-${i + 1}`,
        }))
        setPosts(samplePosts)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPosts()
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
    // UI-only: Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Post Published (UI Demo)",
      description: `${selectedPostForModal.title} would be published to board: ${mockPinterestBoards.find((b) => b.id === modalSelectedBoard)?.name}.`,
    })
    setPosts(posts.filter((p) => p.id !== selectedPostForModal.id)) // Remove post from list
    setIsProcessingPublish(null)
    setIsPublishModalOpen(false)
    setSelectedPostForModal(null)
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
    // UI-only: Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const formattedDate = format(modalScheduledDate, "PPP")
    toast({
      title: "Post Scheduled (UI Demo)",
      description: `${selectedPostForModal.title} would be scheduled to board ${mockPinterestBoards.find((b) => b.id === modalSelectedBoard)?.name} for ${formattedDate} at ${modalScheduledTime}.`,
    })
    setPosts(posts.filter((p) => p.id !== selectedPostForModal.id)) // Remove post from list
    setIsProcessingSchedule(null)
    setIsScheduleModalOpen(false)
    setSelectedPostForModal(null)
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
    if (!bulkSelectedBoard) {
      toast({
        title: "Error",
        description: "Please select a board for bulk scheduling.",
        variant: "destructive",
      })
      setIsBulkScheduling(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "✅ Posts Scheduled! (UI Demo)",
      description: `Posts would be scheduled to board: ${mockPinterestBoards.find((b) => b.id === bulkSelectedBoard)?.name}.`,
      variant: "default",
      className: "bg-green-500 border-green-500 text-white",
    })
    setPosts([]) // Clear posts as they are "scheduled"
    setBulkShuffleDialogOpen(false)
    setIsBulkScheduling(false)
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

  return (
    <>
      <div className="bg-green-100 text-green-800 p-3 text-center text-sm mb-6 rounded-md">
        <Info className="inline-block h-4 w-4 mr-2" />
        Posts generated here are temporarily stored and will be cleared after 24 hours. Please publish or schedule them.
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setBulkShuffleDialogOpen(true)} disabled={posts.length === 0}>
          → Bulk Shuffle Schedule
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
                      `/placeholder.svg?height=600&width=400&query=abstract+${post.title.replace(/\s+/g, "+")}`
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
                      className="flex-1"
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
                {mockPinterestBoards.map((board) => (
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
                  {mockPinterestBoards.map((board) => (
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
                  {mockPinterestBoards.map((board) => (
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
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
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
