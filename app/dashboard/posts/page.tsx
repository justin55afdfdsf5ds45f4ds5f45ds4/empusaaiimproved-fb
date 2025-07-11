"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, ExternalLink, Info, Loader2, Plus, Shuffle, Trash2, X } from "lucide-react"
import { format, addDays, addMinutes } from "date-fns"

interface Post {
  id: string
  title: string
  description: string
  imageUrl: string
  sourceUrl?: string
  scheduledTime?: string
  createdDate: string
  status: "Draft" | "Scheduled" | "Published"
}

interface PinterestBoard {
  id: string
  name: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [boards, setBoards] = useState<PinterestBoard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBulkScheduling, setIsBulkScheduling] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [shuffleLinkInputs, setShuffleLinkInputs] = useState<string[]>([""])
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const { toast } = useToast()

  // Fetch posts and boards on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent posts
        const postsResponse = await fetch("/api/posts/recentposts")
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData.posts || [])
        }

        // Fetch Pinterest boards
        const boardsResponse = await fetch("/api/pinterest/boards")
        if (boardsResponse.ok) {
          const boardsData = await boardsResponse.json()
          setBoards(boardsData.boards || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle adding a new link input
  const handleAddLinkInput = () => {
    setShuffleLinkInputs([...shuffleLinkInputs, ""])
  }

  // Handle removing a link input
  const handleRemoveLinkInput = (index: number) => {
    if (shuffleLinkInputs.length > 1) {
      const newInputs = shuffleLinkInputs.filter((_, i) => i !== index)
      setShuffleLinkInputs(newInputs)
    }
  }

  // Handle updating a link input value
  const handleLinkInputChange = (index: number, value: string) => {
    const newInputs = [...shuffleLinkInputs]
    newInputs[index] = value
    setShuffleLinkInputs(newInputs)
  }

  // Handle bulk shuffle schedule
  const handleBulkShuffleSchedule = async () => {
    if (posts.length === 0) {
      toast({
        title: "No Posts Available",
        description: "There are no posts to schedule.",
        variant: "destructive",
      })
      return
    }

    // Filter out empty links
    const validLinks = shuffleLinkInputs.filter((link) => link.trim() !== "")

    if (validLinks.length === 0) {
      toast({
        title: "No Links Provided",
        description: "Please add at least one link to shuffle.",
        variant: "destructive",
      })
      return
    }

    if (!selectedBoard) {
      toast({
        title: "No Board Selected",
        description: "Please select a Pinterest board for the posts.",
        variant: "destructive",
      })
      return
    }

    setIsBulkScheduling(true)

    try {
      // Simulate bulk scheduling logic
      const now = new Date()
      let currentScheduleTime = addMinutes(now, 10) // Start 10 minutes from now

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        const randomLink = validLinks[Math.floor(Math.random() * validLinks.length)]

        // Schedule each post with a 10-minute gap
        const scheduleTime = addDays(currentScheduleTime, Math.floor(Math.random() * 7)) // Within 7 days

        // Here you would make API calls to actually schedule the posts
        // For now, we'll just simulate the process
        console.log(
          `Scheduling post ${post.id} with link ${randomLink} at ${format(scheduleTime, "PPpp")} to board ${selectedBoard}`,
        )

        // Add 10 minutes for the next post
        currentScheduleTime = addMinutes(currentScheduleTime, 10)
      }

      // Show success notification
      toast({
        title: "✅ Posts Scheduled!",
        description: "Posts have been scheduled out successfully!",
        className: "bg-green-500 border-green-500 text-white",
      })

      // Close modal and reset form
      setIsBulkModalOpen(false)
      setShuffleLinkInputs([""])
      setSelectedBoard("")
    } catch (error) {
      console.error("Error during bulk scheduling:", error)
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling the posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBulkScheduling(false)
    }
  }

  // Handle individual post actions (placeholder functions)
  const handlePublish = async (postId: string) => {
    console.log("Publishing post:", postId)
    // Implement publish logic
  }

  const openScheduleDialog = (postId: string) => {
    console.log("Opening schedule dialog for post:", postId)
    // Implement schedule dialog logic
  }

  const handleLinkPost = (postId: string) => {
    console.log("Linking post:", postId)
    // Implement link post logic
  }

  const handleDeletePost = async (postId: string) => {
    console.log("Deleting post:", postId)
    // Implement delete logic
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <p className="text-gray-600 mt-1">Manage and schedule your Pinterest content</p>
        </div>

        {/* Bulk Shuffle Schedule Button */}
        <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Shuffle className="mr-2 h-4 w-4" />→ Bulk Shuffle Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="pb-2">
              <DialogTitle className="mb-3">Bulk Shuffle Schedule</DialogTitle>
              <DialogDescription className="mb-6 text-sm text-gray-600">
                Enter one or more links (URLs) that contain similar content. These links will be randomly used across
                all recent posts.
                <br className="hidden sm:block" />
                All posts in "Recent Posts" will be shuffled and scheduled out within 7 days in the future, during peak
                user activity hours, with a minimum 10-minute gap between each post.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-2 pb-4 space-y-4 max-h-60 overflow-y-auto">
              {shuffleLinkInputs.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => handleLinkInputChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {shuffleLinkInputs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLinkInput(index)}
                      className="h-10 w-10 text-gray-400 hover:text-red-500"
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

            {/* Board Selection */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="board-select" className="text-sm font-medium">
                Choose a Board
              </Label>
              <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                <SelectTrigger className="w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue placeholder="Select a Pinterest board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel-inspiration">Travel Inspiration</SelectItem>
                  <SelectItem value="food-recipes">Food & Recipes</SelectItem>
                  <SelectItem value="home-decor">Home Decor</SelectItem>
                  <SelectItem value="fashion-style">Fashion & Style</SelectItem>
                  <SelectItem value="diy-crafts">DIY & Crafts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsBulkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBulkShuffleSchedule}
                disabled={isBulkScheduling}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold
                           transition-all duration-300 ease-in-out transform
                           hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/50 hover:brightness-105
                           active:scale-100 active:brightness-95
                           focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
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
      </div>

      {/* Notification */}
      <div className="bg-green-100 text-green-800 p-3 text-center text-sm mb-6 rounded-md">
        <Info className="inline-block h-4 w-4 mr-2" />
        Posts generated here are temporarily stored and will be cleared after 24 hours. Please publish or schedule them.
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={post.imageUrl || "/placeholder.svg?height=200&width=300"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === "Scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : post.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Created: {post.createdDate}</span>
                  {post.scheduledTime && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.scheduledTime}
                    </span>
                  )}
                </div>

                {/* Post Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePublish(post.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Publish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openScheduleDialog(post.id)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleLinkPost(post.id)}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">Create your first post to get started with Pinterest automation.</p>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
      )}
    </div>
  )
}
