"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Info } from "lucide-react"
import { useEffect, useState } from "react"

export default function PostsPage() {
  // In a real app, you would fetch posts from your database
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <>
      <div className="bg-black text-yellow-300 p-3 text-center text-sm mb-6 rounded-md">
        <Info className="inline-block h-4 w-4 mr-2" />
        Posts generated here are temporarily stored and will be cleared after 24 hours. Please publish or schedule them.
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
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.description}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700">View Details</Button>
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
    </>
  )
}
