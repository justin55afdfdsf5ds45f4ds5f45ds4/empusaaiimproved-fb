import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Clock, TrendingUp, Lightbulb, Zap, Target } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Empusa AI Dashboard</h1>
        <p className="text-gray-500">
          This is your command center for creating and managing Pinterest content with AI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-teal-50">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <ImageIcon className="h-4 w-4 text-teal-600" />
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

      <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white p-3 rounded-full">
            <Zap className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Quick Start</h2>
            <p className="text-gray-600">Create your first Pinterest post in minutes</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-teal-100 w-6 h-6 rounded-full flex items-center justify-center text-teal-600 font-medium">
                1
              </div>
              <h3 className="font-medium">Enter URL</h3>
            </div>
            <p className="text-sm text-gray-500">Paste any URL you want to create Pinterest content for</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-teal-100 w-6 h-6 rounded-full flex items-center justify-center text-teal-600 font-medium">
                2
              </div>
              <h3 className="font-medium">Generate Content</h3>
            </div>
            <p className="text-sm text-gray-500">Our AI creates Pinterest-optimized images and descriptions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-teal-100 w-6 h-6 rounded-full flex items-center justify-center text-teal-600 font-medium">
                3
              </div>
              <h3 className="font-medium">Publish or Schedule</h3>
            </div>
            <p className="text-sm text-gray-500">Publish immediately or schedule for optimal times</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
            <h2 className="text-xl font-semibold">Pinterest Tips</h2>
            <div className="flex items-center gap-1 text-teal-600 text-sm">
              <Lightbulb className="h-4 w-4" />
              <span>Pro Tips</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Target className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Optimize Your Pinterest Profile</h3>
                    <p className="text-xs text-gray-500">Complete your profile with keywords and a business account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Best Times to Post</h3>
                    <p className="text-xs text-gray-500">
                      Schedule pins for evenings and weekends for better engagement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Zap className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Use Keywords in Descriptions</h3>
                    <p className="text-xs text-gray-500">Include relevant keywords to improve discoverability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
