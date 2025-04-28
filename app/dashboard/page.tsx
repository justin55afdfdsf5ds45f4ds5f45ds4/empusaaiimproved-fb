import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Clock, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/create">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <ImageIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500">Posts created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500">Posts scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pinterest Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500">Total engagements</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <Link href="/dashboard/posts">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Tips</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Optimize Your Pinterest Profile</h3>
              <p className="text-sm text-gray-500">
                Make sure your Pinterest profile is complete with a profile picture, description, and linked website to
                maximize your reach.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Best Times to Post</h3>
              <p className="text-sm text-gray-500">
                Schedule your pins for evenings and weekends when Pinterest users are most active for better engagement.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Use Keywords in Descriptions</h3>
              <p className="text-sm text-gray-500">
                Include relevant keywords in your pin descriptions to improve discoverability in Pinterest search.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Create Multiple Pins per URL</h3>
              <p className="text-sm text-gray-500">
                Generate multiple pin designs for the same content to increase your chances of reaching different
                audiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
