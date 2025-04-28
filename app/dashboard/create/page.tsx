"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload, Loader2, LinkIcon, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
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

interface Post {
  id: string
  title: string
  description: string
  imageUrl: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [postCount, setPostCount] = useState("10")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)

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

  const handleGenerate = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate Pinterest posts.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          count: Number.parseInt(postCount),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate posts")
      }

      const data = await response.json()
      setGeneratedPosts(data.posts)

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

  const handlePublish = async (post: Post) => {
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
    setCurrentPostForScheduling(post)
    setScheduleDialogOpen(true)
  }

  const handleSchedule = async () => {
    if (!currentPostForScheduling || !scheduledDate) {
      toast({
        title: "Error",
        description: "Please select a date to schedule the post.",
        variant: "destructive",
      })
      return
    }

    setIsScheduling(currentPostForScheduling.id)

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
          scheduledDate: scheduledDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post")
      }

      const data = await response.json()

      toast({
        title: "Post Scheduled",
        description: `Your post has been scheduled for ${format(scheduledDate, "PPP")}.`,
      })

      // Remove the scheduled post from the list
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== currentPostForScheduling.id))
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Pinterest Posts</h1>
        <p className="text-gray-500 mt-2">
          Generate Pinterest-ready posts from any URL with AI-powered images, titles, and descriptions.
        </p>
      </div>

      {generatedPosts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
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
              </div>

              <div className="space-y-2">
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
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={handleGenerate}
                disabled={!url || isGenerating}
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
            </div>
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
    </div>
  )
}
