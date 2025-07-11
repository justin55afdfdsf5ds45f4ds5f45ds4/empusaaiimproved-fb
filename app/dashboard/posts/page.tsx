"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Calendar,
  Clock,
  Eye,
  MoreHorizontal,
  Plus,
  Shuffle,
  Lock,
  Crown,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Post {
  id: string
  title: string
  description: string
  imageUrl: string
  status: "draft" | "scheduled" | "published"
  scheduledTime?: string
  createdAt: string
  updatedAt: string
}

export default function PostsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: "1",
      title: "10 Amazing Travel Destinations for 2024",
      description: "Discover breathtaking locations that should be on every traveler's bucket list this year.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "published",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Healthy Breakfast Ideas That Take 5 Minutes",
      description: "Quick and nutritious breakfast recipes perfect for busy mornings.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "scheduled",
      scheduledTime: "2024-01-20T08:00:00Z",
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "3",
      title: "DIY Home Decor Projects Under $50",
      description: "Transform your living space with these budget-friendly decoration ideas.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "draft",
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
    },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleBulkShuffleClick = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to premium to use bulk shuffle scheduling!",
      variant: "default",
    })
    router.push("/pricing")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Posts</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Storage Warning Alert */}
      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Storage Notice:</strong> Your posts are stored for 5 hours only.{" "}
          <Link href="/pricing" className="underline hover:no-underline font-medium">
            Upgrade to Premium
          </Link>{" "}
          for unlimited storage and advanced features.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
          <p className="text-gray-600 mt-1">Manage and track your Pinterest content</p>
        </div>
        <div className="flex gap-3">
          {/* Bulk Shuffle Button - Premium Locked */}
          <Button
            onClick={handleBulkShuffleClick}
            variant="outline"
            className="relative border-2 border-dashed border-gray-300 text-gray-500 hover:border-teal-300 hover:text-teal-600 transition-all duration-200 bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <Shuffle className="h-4 w-4" />
              <span>Bulk Shuffle Schedule</span>
              <Crown className="h-4 w-4 text-yellow-500" />
            </div>
          </Button>

          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Create your first Pinterest post to get started</p>
          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2 pr-2">{post.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Post</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge className={getStatusColor(post.status)} variant="secondary">
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/5] relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {post.status === "scheduled" && post.scheduledTime
                        ? `Scheduled: ${formatDate(post.scheduledTime)}`
                        : `Created: ${formatDate(post.createdAt)}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
