"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, ImageIcon, Clock, TrendingUp, Lightbulb, Zap, Target, CalendarDays } from "lucide-react"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface DashboardMetrics {
  totalPosts: number
  scheduledPosts: number
  totalEngagement: number
}

// Helper function to generate mock metrics
const generateMockMetrics = (): DashboardMetrics => ({
  totalPosts: Math.floor(Math.random() * 100) + 10, // e.g., 10-110
  scheduledPosts: Math.floor(Math.random() * 50) + 5, // e.g., 5-55
  totalEngagement: Math.floor(Math.random() * 5000) + 1000, // e.g., 1K-6K
})

export default function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPosts: 0,
    scheduledPosts: 0,
    totalEngagement: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Effect for initial metrics load (can be considered default or "all time" before range selection)
  useEffect(() => {
    async function fetchInitialMetrics() {
      setIsLoading(true)
      // Simulating an API call for initial load
      await new Promise((resolve) => setTimeout(resolve, 500))
      const initialMetrics: DashboardMetrics = {
        totalPosts: 78, // Default mock data
        scheduledPosts: 23,
        totalEngagement: 12500,
      }
      setMetrics(initialMetrics)
      setIsLoading(false)
    }
    fetchInitialMetrics()
  }, [])

  // Effect to update metrics when dateRange changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setIsLoading(true)
      // Simulate fetching data for the new range
      setTimeout(() => {
        setMetrics(generateMockMetrics())
        setIsLoading(false)
      }, 300) // Short delay to simulate loading
    } else if (!dateRange) {
      // Reset to default if range is cleared
      setIsLoading(true)
      setTimeout(() => {
        setMetrics({
          // Default mock data for "Last 7 days" or initial view
          totalPosts: 55,
          scheduledPosts: 15,
          totalEngagement: 8700,
        })
        setIsLoading(false)
      }, 300)
    }
  }, [dateRange])

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    setIsCalendarOpen(false) // Close popover after selection
  }

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range || !range.from) {
      return "Showing results for Last 7 Days" // Default text
    }
    if (range.to) {
      return `Showing results from ${format(range.from, "LLL dd, y")} to ${format(range.to, "LLL dd, y")}`
    }
    return `Showing results for ${format(range.from, "LLL dd, y")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm flex-grow">
          <h1 className="text-3xl font-bold mb-2">Welcome to Empusa AI Dashboard</h1>
          <p className="text-gray-500">Your command center for creating and managing Pinterest content with AI.</p>
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start text-left font-normal bg-white border shadow-sm hover:bg-gray-50"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
            <div className="p-2 border-t flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateRange(undefined)
                  setIsCalendarOpen(false)
                }}
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <p className="text-sm text-gray-600 mb-4 -mt-2 text-center sm:text-left">{formatDateRange(dateRange)}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-teal-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-teal-50">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <ImageIcon className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.totalPosts}</div>
            <p className="text-xs text-gray-500">Posts created in range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.scheduledPosts}</div>
            <p className="text-xs text-gray-500">Posts scheduled in range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pinterest Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Engagements in range</p>
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
