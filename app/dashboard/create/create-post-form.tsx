"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw } from "lucide-react"

interface Board {
  id: string
  name: string
  url: string
}

interface Post {
  id: string
  title: string
  description: string
  imagePrompt: string
  imageUrl: string
}

export function CreatePostForm() {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get("url") || ""

  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [url, setUrl] = useState(initialUrl)
  const [topic, setTopic] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [activeTab, setActiveTab] = useState(initialUrl ? "url" : "topic")

  // Set initial URL from search params
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      setActiveTab("url")
    }
  }, [initialUrl])

  // Fetch Pinterest boards when component mounts
  useEffect(() => {
    async function fetchBoards() {
      try {
        setIsLoading(true)
        // Use NextAuth session to fetch boards
        const response = await fetch("/api/posts/pinterest-boards")
        const data = await response.json()

        if (data.boards && Array.isArray(data.boards)) {
          setBoards(data.boards)
          // Select the first board by default if available
          if (data.boards.length > 0) {
            setSelectedBoard(data.boards[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching boards:", error)
        toast({
          title: "Error",
          description: "Failed to fetch Pinterest boards. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchBoards()
    }
  }, [status, toast])

  const handleGeneratePosts = async () => {
    try {
      setIsGenerating(true)
      setPosts([])
      setSelectedPost(null)

      // Validate input
      if (activeTab === "url" && !url) {
        toast({
          title: "Input Required",
          description: "Please enter a URL to generate posts.",
          variant: "destructive",
        })
        return
      }

      if (activeTab === "topic" && !topic) {
        toast({
          title: "Input Required",
          description: "Please enter a topic to generate posts.",
          variant: "destructive",
        })
        return
      }

      // Prepare request body based on active tab
      const requestBody = activeTab === "url" ? { url } : { topic }

      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate posts")
      }

      const data = await response.json()

      if (!data.posts || !Array.isArray(data.posts) || data.posts.length === 0) {
        throw new Error("No posts were generated")
      }

      setPosts(data.posts)
      setSelectedPost(data.posts[0]) // Select the first post by default

      toast({
        title: "Success",
        description: `Generated ${data.posts.length} posts successfully.`,
      })
    } catch (error) {
      console.error("Error generating posts:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!selectedPost) {
      toast({
        title: "No Post Selected",
        description: "Please select a post to publish.",
        variant: "destructive",
      })
      return
    }

    if (!selectedBoard) {
      toast({
        title: "No Board Selected",
        description: "Please select a Pinterest board to publish to.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsPublishing(true)

      const response = await fetch("/api/posts/publish-to-pinterest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedPost.title,
          description: selectedPost.description,
          imageUrl: selectedPost.imageUrl,
          boardId: selectedBoard,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to publish post")
      }

      toast({
        title: "Success",
        description: "Post published to Pinterest successfully!",
      })

      // Redirect to posts page after successful publish
      router.push("/dashboard/posts")
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="url">Generate from URL</TabsTrigger>
              <TabsTrigger value="topic">Generate from Topic</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to generate Pinterest post ideas based on the content.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="topic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., travel, food, fashion"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-sm text-muted-foreground">Enter a topic to generate Pinterest post ideas.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={handleGeneratePosts} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Posts
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Generated Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className={`cursor-pointer transition-all ${selectedPost?.id === post.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[4/5] relative mb-3 overflow-hidden rounded-lg">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{post.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPost && (
            <Card className="mt-6">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-xl font-bold">Publish to Pinterest</h2>

                <div className="space-y-2">
                  <Label htmlFor="board">Select Board</Label>
                  <select
                    id="board"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    disabled={isPublishing || boards.length === 0}
                  >
                    {boards.length === 0 ? (
                      <option value="">No boards available</option>
                    ) : (
                      boards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={selectedPost.title}
                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                    disabled={isPublishing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedPost.description}
                    onChange={(e) => setSelectedPost({ ...selectedPost, description: e.target.value })}
                    disabled={isPublishing}
                    rows={4}
                  />
                </div>

                <Button onClick={handlePublish} disabled={isPublishing || !selectedBoard} className="w-full">
                  {isPublishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish to Pinterest"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
