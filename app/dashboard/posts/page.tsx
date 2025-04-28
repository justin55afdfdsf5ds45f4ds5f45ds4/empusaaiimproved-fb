import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon } from "lucide-react"

export default function PostsPage() {
  // In a real app, you would fetch posts from your database
  const posts: any[] = []

  return (
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

      {posts.length > 0 ? (
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
  )
}
