"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Upload, Loader2, LinkIcon, Calendar, Info, PinIcon } from "lucide-react"

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

interface Post {
  id: string
  title: string
  description: string
  imagePrompt?: string
  imageUrl: string | null
}

interface PinterestBoard {
  id: string
  name: string
}

export function CreatePostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [url, setUrl] = useState("")
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
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("informative")

  // Check if there's a URL in the search params
  useEffect(() => {
    const urlParam = searchParams.get("url")
    if (urlParam) {
      setUrl(urlParam)
      setActiveTab("url")
    }
  }, [searchParams])

  // Fetch Pinterest boards
  useEffect(() => {
    const fetchBoards = async () => {
      setIsFetchingBoards(true)
      try {
        const response = await fetch("/api/pinterest/boards")
        if (!response.ok) {
          throw new Error("Failed to fetch boards")
        }
        const data = await response.json()
        setPinterestBoards(data.items || [])

        // Set the first board as default if available
        if (data.items && data.items.length > 0) {
          setSelectedBoard(data.items[0].id)
        }
      } catch (error) {
        console.error("Error fetching Pinterest boards:", error)
        toast({
          title: "Error",
          description: "Failed to fetch Pinterest boards. Please reconnect your Pinterest account.",
          variant: "destructive",
        })
      } finally {
        setIsFetchingBoards(false)
      }
    }

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

    try {
      // Publish the post to Pinterest
      const response = await fetch("/api/pinterest/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoard,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      const data = await response.json()

      toast({
        title: "Post Published",
        description: "Your post has been successfully published to Pinterest.",
      })

      // Remove the published post from the list
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== post.id))
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
      // Schedule the post
      const response = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postWithImage.id,
          boardId: selectedBoard,
          title: postWithImage.title,
          description: postWithImage.description,
          imageUrl: postWithImage.imageUrl,
          scheduledDate: scheduledDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post")
      }

      toast({
        title: "Post Scheduled",
        description: `Your post has been scheduled for ${format(scheduledDate, "PPP")}.`,
      })

      // Remove the scheduled post from the list
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== postWithImage.id))
      setScheduleDialogOpen(false)
      setScheduledDate(undefined)
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(null)
    }
  }

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
          <div className="space-y-2">
            <Label htmlFor="board">Select Board</Label>
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
                setUrl("")
                setTopic("")
                setReferenceImage(null)
                setPreviewUrl(null)
              }}
            >
              Create New
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
