"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  AlertCircle,
  Shuffle,
  Lock,
  Crown,
} from "lucide-react"
import Link from "next/link"

interface Post {
  _id: string
  title: string
  description: string
  imageUrl: string
  status: "draft" | "scheduled" | "published"
  scheduledFor?: string
  publishedAt?: string
  createdAt: string
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

  useEffect(() => {
    fetchPosts()
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

  const handleBulkShuffleClick = () => {
    toast({
      title: "Premium Feature",
      description:
        "Upgrade to premium to use Bulk Shuffle Schedule! This feature automatically schedules your posts across peak hours with optimal timing.",
      variant: "default",
    })
    router.push("/pricing")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Published
          </Badge>
        )
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/5] bg-gray-200 rounded animate-pulse mb-4"></div>
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
          {session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date() ? (
            <Button onClick={handleBulkShuffleClick} variant="outline" className="relative bg-transparent">
              <Shuffle className="h-4 w-4 mr-2" /> Bulk Shuffle Schedule
            </Button>
          ) : (
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
          )}
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      </div>

      {!session?.user?.premiumUntil || new Date(session.user.premiumUntil) <= new Date() ? (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-900">Limited Storage Period</h3>
              <p className="text-sm text-orange-700 mt-1">
                Your posts are stored for 5 hours only.
                <Link href="/pricing" className="font-medium underline ml-1">
                  Upgrade to Premium
                </Link>{" "}
                for unlimited storage and advanced features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : null}

      {/* Posts Grid */}
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
          {posts.map((post) => (
            <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{post.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(post.status)}
                  <span className="text-xs text-muted-foreground">
                    {post.status === "published" && post.publishedAt
                      ? formatDate(post.publishedAt)
                      : post.status === "scheduled" && post.scheduledFor
                        ? formatDate(post.scheduledFor)
                        : formatDate(post.createdAt)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="aspect-[4/5] relative mb-4 overflow-hidden rounded-lg bg-light-green-100">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>

                {post.metrics && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.metrics.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.metrics.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {post.metrics.shares.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Clock className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" className="flex-1">
                    Publish Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
