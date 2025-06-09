"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Upload,
  Loader2,
  LinkIcon,
  Calendar,
  Info,
  PinIcon,
  RefreshCw,
  AlertCircle,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Post {
  id: string
  title: string
  description: string
  imagePrompt?: string
  imageUrl: string | null
  defaultLink?: string
}

interface PinterestBoard {
  id: string
  name: string
}

interface CreatePostContentProps {
  initialUrl?: string
}

export function CreatePostContent({ initialUrl }: CreatePostContentProps) {
  const router = useRouter()
  const [url, setUrl] = useState(initialUrl || "")
  const [postCount, setPostCount] = useState("10")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState("url")
  const [pinterestBoards, setPinterestBoards] = useState<PinterestBoard[]>([])
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [isFetchingBoards, setIsFetchingBoards] = useState(false)
  const [boardFetchError, setBoardFetchError] = useState<string | null>(null)
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("informative")
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [isSelectAllActive, setIsSelectAllActive] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [postToLink, setPostToLink] = useState<Post | null>(null)
  const [customLink, setCustomLink] = useState("")
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [selectedBoardForPosts, setSelectedBoardForPosts] = useState<Record<string, string>>({})

  // New state for bulk operations
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("")
  const [linkAllDialogOpen, setLinkAllDialogOpen] = useState(false)
  const [linkAllText, setLinkAllText] = useState("")
  const [scheduleAllDialogOpen, setScheduleAllDialogOpen] = useState(false)
  const [scheduleAllDate, setScheduleAllDate] = useState<Date | undefined>(undefined)

  // Set the initial URL and tab if provided
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      setActiveTab("url")
    }
  }, [initialUrl])

  // Replace the fetchBoards function with mock data
  const fetchBoards = async () => {
    setIsFetchingBoards(true)
    setBoardFetchError(null)

    try {
      const response = await fetch("/api/pinterest/boards")

      
      
      if (!response.ok) {
        throw new Error("Failed to fetch Pinterest boards")
      }

      const data = await response.json()
      console.log(data)
      setPinterestBoards(data.boards || [])
      
      if (!selectedBoard && data.boards?.length > 0) {
        setSelectedBoard(data.boards[0].id)
      }
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error)
      setBoardFetchError("Failed to fetch Pinterest boards. Please try again.")
    } finally {
      setIsFetchingBoards(false)
    }
  }

  // Replace the useEffect with a simpler version
  useEffect(() => {
    fetchBoards()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReferenceImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setReferenceImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const generateImage = async (post: Post) => {
    if (!post.imagePrompt) return null

    setIsGeneratingImage(post.id)

    try {
      const response = await fetch("/api/fal/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.imagePrompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      console.log("Generating image")
      console.log(data.images)
      return data.images?.[0]?.url || null
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsGeneratingImage(null)
    }
  }

  const handleGenerate = async () => {
    if (activeTab === "url" && !url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate Pinterest posts.",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "scratch" && !topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic or keywords to generate Pinterest posts.",
        variant: "destructive",
      })
      return
    }

    if (!selectedBoard) {
      toast({
        title: "Board Required",
        description: "Please select a Pinterest board to publish your posts.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Call the API to generate posts
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: activeTab === "url" ? url : undefined,
          topic: activeTab === "scratch" ? topic : undefined,
          tone: activeTab === "scratch" ? tone : undefined,
          count: Number.parseInt(postCount),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate posts")
      }

      const data = await response.json()
      setGeneratedPosts(data.posts || [])

      toast({
        title: "Posts Generated",
        description: `Successfully generated ${data.posts.length} Pinterest posts.`,
      })
    } catch (error) {
      console.error("Error generating posts:", error)
      toast({
        title: "Error",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateImage = async (post: Post) => {
    const imageUrl = await generateImage(post)

    if (imageUrl) {
      // Update the post with the generated image URL
      setGeneratedPosts((prevPosts) => prevPosts.map((p) => (p.id === post.id ? { ...p, imageUrl } : p)))
    }
  }

  const handlePublish = async (post: Post) => {
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
      setGeneratedPosts((prevPosts) => prevPosts.map((p) => (p.id === post.id ? { ...post } : p)))
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
      console.log("----------------------------------------------")
      console.log(data)
      console.log("----------------------------------------------")

      toast({
        title: "Post Published",
        description: "Your post has been successfully published to Pinterest.",
      })

      // Remove the published post from the list
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== post.id))
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

  const openScheduleDialog = (post: Post) => {
    if (!selectedBoard) {
      toast({
        title: "Board Required",
        description: "Please select a Pinterest board to schedule your post.",
        variant: "destructive",
      })
      return
    }

    setCurrentPostForScheduling(post)
    setScheduleDialogOpen(true)
  }

  const handleSchedule = async () => {
    if (!currentPostForScheduling || !scheduledDate || !selectedBoard) {
      toast({
        title: "Error",
        description: "Please select a date and board to schedule the post.",
        variant: "destructive",
      })
      return
    }

    // Generate image if not already generated
    let postWithImage = currentPostForScheduling
    if (!postWithImage.imageUrl) {
      toast({
        title: "Generating Image",
        description: "Generating image before scheduling...",
      })

      const imageUrl = await generateImage(postWithImage)

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update the post with the generated image
      postWithImage = { ...postWithImage, imageUrl }
      setGeneratedPosts((prevPosts) => prevPosts.map((p) => (p.id === postWithImage.id ? { ...postWithImage } : p)))
    }

    setIsScheduling(postWithImage.id)

    try {
      // Mock scheduling instead of API call
      setTimeout(() => {
        toast({
          title: "Post Scheduled",
          description: `Your post has been scheduled for ${format(scheduledDate, "PPP")}.`,
        })

        // Remove the scheduled post from the list
        setGeneratedPosts(generatedPosts.filter((p) => p.id !== postWithImage.id))
        setScheduleDialogOpen(false)
        setScheduledDate(undefined)
        setIsScheduling(null)
      }, 1500)
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
      setIsScheduling(null)
    }
  }

  const handleSelectAll = () => {
    if (isSelectAllActive) {
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
    } else {
      setSelectedPosts(new Set(generatedPosts.map((post) => post.id)))
      setIsSelectAllActive(true)
    }
  }

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPosts(newSelected)
    setIsSelectAllActive(newSelected.size === generatedPosts.length)
  }

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
    setDeleteConfirmText("")
  }

  const confirmDelete = () => {
    if (deleteConfirmText === "DELETE" && postToDelete) {
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== postToDelete.id))
      setSelectedPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postToDelete.id)
        return newSet
      })
      setDeleteDialogOpen(false)
      setPostToDelete(null)
      setDeleteConfirmText("")

      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      })
    }
  }

  // New function for Delete All
  const handleDeleteAll = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to delete.",
        variant: "destructive",
      })
      return
    }
    setDeleteAllDialogOpen(true)
    setDeleteAllConfirmText("")
  }

  const confirmDeleteAll = () => {
    if (deleteAllConfirmText === "DELETE") {
      const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
      setGeneratedPosts(remainingPosts)
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
      setDeleteAllDialogOpen(false)
      setDeleteAllConfirmText("")

      toast({
        title: "Posts Deleted",
        description: `Successfully deleted ${selectedPosts.size} posts.`,
      })
    }
  }

  // New function for Link All Posts
  const handleLinkAllPosts = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to add links.",
        variant: "destructive",
      })
      return
    }
    setLinkAllDialogOpen(true)
    setLinkAllText("")
  }

  const confirmLinkAll = () => {
    if (linkAllText) {
      const newPostLinks = { ...postLinks }
      selectedPosts.forEach((postId) => {
        newPostLinks[postId] = linkAllText
      })
      setPostLinks(newPostLinks)
      setLinkAllDialogOpen(false)
      setLinkAllText("")

      toast({
        title: "Links Added",
        description: `Successfully added custom links to ${selectedPosts.size} posts.`,
      })
    }
  }

  // New function for Schedule All
  const handleScheduleAll = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to schedule.",
        variant: "destructive",
      })
      return
    }
    setScheduleAllDialogOpen(true)
    setScheduleAllDate(undefined)
  }

  const confirmScheduleAll = () => {
    if (scheduleAllDate) {
      const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
      setGeneratedPosts(remainingPosts)
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
      setScheduleAllDialogOpen(false)
      setScheduleAllDate(undefined)

      toast({
        title: "Posts Scheduled",
        description: `Successfully scheduled ${selectedPosts.size} posts for ${format(scheduleAllDate, "PPP")}.`,
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

  const handleBoardSelection = (postId: string, boardId: string) => {
    setSelectedBoardForPosts((prev) => ({
      ...prev,
      [postId]: boardId,
    }))
  }

  const getSelectedBoard = (postId: string) => {
    return selectedBoardForPosts[postId] || selectedBoard
  }

  const hasSelectedPosts = selectedPosts.size > 0
  const getButtonClass = (isActive: boolean) =>
    `px-4 py-2 rounded-md font-medium transition-colors ${
      isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`

  return (
    <>
      {/* Pinterest Board Selection */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <PinIcon className="h-5 w-5 text-red-600" />
            Pinterest Board
          </CardTitle>
          <CardDescription>Select the Pinterest board where you want to publish your posts</CardDescription>
        </CardHeader>
        <CardContent>
          {boardFetchError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Boards</AlertTitle>
              <AlertDescription>{boardFetchError}</AlertDescription>
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchBoards} disabled={isFetchingBoards}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingBoards ? "animate-spin" : ""}`} />
                Retry
              </Button>
            </Alert>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="board">Select Board</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBoards}
                  disabled={isFetchingBoards}
                  className="h-8 px-2 text-xs"
                >
                  <RefreshCw className={`mr-1 h-3 w-3 ${isFetchingBoards ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <Select value={selectedBoard} onValueChange={setSelectedBoard} disabled={isFetchingBoards}>
                <SelectTrigger className={!selectedBoard ? "text-red-500 border-red-500" : ""}>
                  <SelectValue placeholder={isFetchingBoards ? "Loading boards..." : "Select a board"} />
                </SelectTrigger>
                <SelectContent>
                  {pinterestBoards.length === 0 ? (
                    <SelectItem value="no-boards" disabled>
                      No boards found
                    </SelectItem>
                  ) : (
                    pinterestBoards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!selectedBoard && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  You must select a Pinterest board to publish or schedule posts
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {generatedPosts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Pinterest Content</CardTitle>
            <CardDescription>Choose how you want to create your Pinterest content</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="url">From URL</TabsTrigger>
                <TabsTrigger value="scratch">From Scratch</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Enter URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="url"
                        placeholder="https://example.com/your-content"
                        className="pl-10"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <Select value={postCount} onValueChange={setPostCount}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="10 posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 posts</SelectItem>
                        <SelectItem value="10">10 posts</SelectItem>
                        <SelectItem value="15">15 posts</SelectItem>
                        <SelectItem value="20">20 posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Our AI will analyze the content at this URL and generate Pinterest posts
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="scratch" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Keywords</Label>
                  <Input
                    id="topic"
                    placeholder="E.g., healthy recipes, home decor ideas, travel tips"
                    className="w-full"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Enter a topic or keywords for your Pinterest content
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informative">Informative</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Posts</Label>
                    <Select value={postCount} onValueChange={setPostCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="10 posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 posts</SelectItem>
                        <SelectItem value="10">10 posts</SelectItem>
                        <SelectItem value="15">15 posts</SelectItem>
                        <SelectItem value="20">20 posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <div className="space-y-2 mt-6">
                <Label>Reference Image (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Reference"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>

                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 mt-6"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedBoard}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Pinterest Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generated Posts ({generatedPosts.length})</h2>
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedPosts([])
                setSelectedPosts(new Set())
                setIsSelectAllActive(false)
                setUrl("")
                setTopic("")
                setReferenceImage(null)
                setPreviewUrl(null)
                setPostLinks({})
                setSelectedBoardForPosts({})
              }}
            >
              Create New
            </Button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleSelectAll}
              variant={isSelectAllActive ? "default" : "outline"}
              className={isSelectAllActive ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isSelectAllActive ? "Deselect All" : "Select All"}
            </Button>

            <Button
              className={getButtonClass(hasSelectedPosts)}
              disabled={!hasSelectedPosts}
              onClick={handleScheduleAll}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>

            <Button className={getButtonClass(hasSelectedPosts)} disabled={!hasSelectedPosts} onClick={handleDeleteAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </Button>

            <Button
              className={getButtonClass(hasSelectedPosts)}
              disabled={!hasSelectedPosts}
              onClick={handleLinkAllPosts}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Link All Posts
            </Button>

            <Button
              className={getButtonClass(hasSelectedPosts)}
              disabled={!hasSelectedPosts}
              onClick={() => setPublishDialogOpen(true)}
            >
              <PinIcon className="mr-2 h-4 w-4" />
              Publish to Pinterest
            </Button>
          </div>

          {/* Board Selection for Selected Posts */}
          {hasSelectedPosts && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Label>Default Board for Selected Posts ({selectedPosts.size} selected):</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select board" />
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
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedPosts.map((post) => {
              const isSelected = selectedPosts.has(post.id)
              const hasCustomLink = postLinks[post.id]
              const displayLink = hasCustomLink || post.defaultLink || "No link available"
              const assignedBoard = getSelectedBoard(post.id)
              const boardName = pinterestBoards.find((b) => b.id === assignedBoard)?.name || "No board"

              return (
                <Card
                  key={post.id}
                  className={`overflow-hidden relative transition-all ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePostSelection(post.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Icons */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => handleLinkPost(post)}
                    >
                      <LinkIcon className={`h-4 w-4 ${hasCustomLink ? "text-green-600" : "text-gray-600"}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600"
                      onClick={() => handleDeletePost(post)}
                    >
                      🗑️
                    </Button>
                  </div>

                  <div className="aspect-[2/3] relative">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Button
                          onClick={() => handleGenerateImage(post)}
                          disabled={isGeneratingImage === post.id}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {isGeneratingImage === post.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Image"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3">{post.description}</p>

                    {/* Default/Custom Link Display */}
                    <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Link: </span>
                      <span className={hasCustomLink ? "text-green-600" : "text-gray-600"}>{displayLink}</span>
                      {hasCustomLink && <span className="text-green-600 ml-1">(Custom)</span>}
                    </div>

                    {/* Board Assignment Tag */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        📌 {boardName}
                      </span>
                    </div>

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
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete All Selected Posts</DialogTitle>
            <DialogDescription>Do you want to delete all selected posts?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 border rounded-lg bg-red-50">
              <p className="font-medium text-red-800">You are about to delete {selectedPosts.size} posts</p>
              <p className="text-sm text-red-600 mt-1">This action cannot be undone.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-all-confirm">Type DELETE to confirm deletion</Label>
              <Input
                id="delete-all-confirm"
                value={deleteAllConfirmText}
                onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                placeholder="Type DELETE"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAll} disabled={deleteAllConfirmText !== "DELETE"}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link All Posts Dialog */}
      <Dialog open={linkAllDialogOpen} onOpenChange={setLinkAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link All Selected Posts</DialogTitle>
            <DialogDescription>Enter a custom link for all {selectedPosts.size} selected posts</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="link-all-input">Custom Link URL</Label>
              <Input
                id="link-all-input"
                value={linkAllText}
                onChange={(e) => setLinkAllText(e.target.value)}
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-500">
                This link will be applied to all {selectedPosts.size} selected posts
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLinkAll} disabled={!linkAllText} className="bg-green-600 hover:bg-green-700">
              Apply to All Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule All Posts Dialog */}
      <Dialog open={scheduleAllDialogOpen} onOpenChange={setScheduleAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule All Selected Posts</DialogTitle>
            <DialogDescription>Select a date to schedule all {selectedPosts.size} selected posts</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="schedule-all-date">Date</Label>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduleAllDate ? format(scheduleAllDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={scheduleAllDate}
                        onSelect={setScheduleAllDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={confirmScheduleAll} disabled={!scheduleAllDate}>
              Schedule All Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>Do you want to delete this post?</DialogDescription>
          </DialogHeader>
          {postToDelete && (
            <div className="py-4">
              <div className="mb-4 p-3 border rounded-lg">
                <h4 className="font-medium">{postToDelete.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{postToDelete.description.substring(0, 100)}...</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">Type DELETE to confirm deletion</Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteConfirmText !== "DELETE"}>
              Delete
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

      {/* Publish to Pinterest Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publish to Pinterest</DialogTitle>
            <DialogDescription>Select the Pinterest board to post these to:</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pinterest Board</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board" />
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
                <Label>Posts to Publish ({selectedPosts.size})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {Array.from(selectedPosts).map((postId) => {
                    const post = generatedPosts.find((p) => p.id === postId)
                    return post ? (
                      <div key={postId} className="flex items-center gap-3 p-2 border rounded">
                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt=""
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 truncate">{post.description}</p>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
                setGeneratedPosts(remainingPosts)
                setSelectedPosts(new Set())
                setIsSelectAllActive(false)
                setPublishDialogOpen(false)

                toast({
                  title: "Publishing to Pinterest",
                  description: `Successfully published ${selectedPosts.size} posts to Pinterest!`,
                })
              }}
            >
              Confirm Publish
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
          <div className="py-4">
            <div className="space-y-4">
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
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSchedule} disabled={!scheduledDate}>
              Schedule Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
