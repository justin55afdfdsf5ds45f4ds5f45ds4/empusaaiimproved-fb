"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  PlusCircle,
  ImageIcon,
  Clock,
  Lightbulb,
  Zap,
  Target,
  CalendarDays,
  CalendarClock,
  CalendarPlus,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format, subDays } from "date-fns"

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

// Initial default date range (last 7 days)
const defaultInitialDateRange: DateRange = {
  from: subDays(new Date(), 6),
  to: new Date(),
}

export default function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(generateMockMetrics()) // Initialize with some values
  const [isLoading, setIsLoading] = useState(false) // Start with false, true on date change
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultInitialDateRange)

  // State for each popover's visibility
  const [isGlobalCalendarOpen, setIsGlobalCalendarOpen] = useState(false)
  const [isTotalPostsCalendarOpen, setIsTotalPostsCalendarOpen] = useState(false)
  const [isScheduledPostsCalendarOpen, setIsScheduledPostsCalendarOpen] = useState(false)
  const [isEngagementCalendarOpen, setIsEngagementCalendarOpen] = useState(false)

  // Unified handler to update date range and close all popovers
  const handleDateSelect = useCallback((range: DateRange | undefined) => {
    setDateRange(range)
    setIsGlobalCalendarOpen(false)
    setIsTotalPostsCalendarOpen(false)
    setIsScheduledPostsCalendarOpen(false)
    setIsEngagementCalendarOpen(false)
  }, [])

  // Effect to update metrics when dateRange changes
  useEffect(() => {
    setIsLoading(true)
    // Simulate fetching data for the new range
    const timer = setTimeout(() => {
      if (dateRange?.from) {
        // Only generate new if there's a valid range
        setMetrics(generateMockMetrics())
      } else {
        // Reset to some default if range is cleared
        setMetrics({ totalPosts: 42, scheduledPosts: 32, totalEngagement: 4613 })
      }
      setIsLoading(false)
    }, 300) // Short delay to simulate loading
    return () => clearTimeout(timer)
  }, [dateRange])

  const formatDateRangeDisplay = (range: DateRange | undefined): string => {
    if (!range || !range.from) {
      return "Select a date range"
    }
    if (range.to) {
      return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
    }
    return format(range.from, "LLL dd, y")
  }

  const formattedDateRangeText = useCallback(() => {
    if (!dateRange || !dateRange.from) {
      return "Showing results for Last 7 Days (Default)"
    }
    if (dateRange.to) {
      return `Showing results from ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}`
    }
    return `Showing results for ${format(dateRange.from, "LLL dd, y")}`
  }, [dateRange])

  const CalendarPopoverContent = ({
    onSelect,
    currentRange,
  }: { onSelect: (range: DateRange | undefined) => void; currentRange: DateRange | undefined }) => (
    <PopoverContent className="w-auto p-2 rounded-md shadow-xl border bg-white" align="end">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={currentRange?.from}
        selected={currentRange}
        onSelect={onSelect}
        numberOfMonths={2}
        className="rounded-md"
      />
      <div className="p-2 border-t mt-2 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(defaultInitialDateRange)} // Reset to default last 7 days
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(undefined)} // Clear selection
        >
          Clear
        </Button>
      </div>
    </PopoverContent>
  )

  const renderCalendarTriggerButton = (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    icon: React.ReactNode,
    ariaLabel: string,
  ) => (
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-gray-500 hover:text-gray-700"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel}
      >
        {icon}
      </Button>
    </PopoverTrigger>
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm flex-grow w-full sm:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Empusa AI Dashboard</h1>
          <p className="text-gray-500 text-sm">Your command center for Pinterest content.</p>
        </div>

        <Popover open={isGlobalCalendarOpen} onOpenChange={setIsGlobalCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start text-left font-normal bg-white border shadow-sm hover:bg-gray-50 min-w-[280px]"
              onClick={() => setIsGlobalCalendarOpen((prev) => !prev)}
            >
              <CalendarDays className="mr-2 h-4 w-4 text-gray-600" />
              <span className="text-gray-700">{formatDateRangeDisplay(dateRange)}</span>
            </Button>
          </PopoverTrigger>
          <CalendarPopoverContent onSelect={handleDateSelect} currentRange={dateRange} />
        </Popover>
      </div>

      <p className="text-sm text-gray-600 mb-6 -mt-2 text-center sm:text-left">{formattedDateRangeText()}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Posts Card */}
        <Card className="border-2 border-teal-200 shadow-md relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-teal-50">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Popover open={isTotalPostsCalendarOpen} onOpenChange={setIsTotalPostsCalendarOpen}>
              {renderCalendarTriggerButton(
                setIsTotalPostsCalendarOpen,
                <CalendarDays className="h-4 w-4" />,
                "Select date range for total posts",
              )}
              <CalendarPopoverContent onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.totalPosts}</div>
            <p className="text-xs text-gray-500">Posts created in range</p>
          </CardContent>
        </Card>

        {/* Scheduled Posts Card */}
        <Card className="shadow-md relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <Popover open={isScheduledPostsCalendarOpen} onOpenChange={setIsScheduledPostsCalendarOpen}>
              {renderCalendarTriggerButton(
                setIsScheduledPostsCalendarOpen,
                <CalendarClock className="h-4 w-4" />,
                "Select date range for scheduled posts",
              )}
              <CalendarPopoverContent onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.scheduledPosts}</div>
            <p className="text-xs text-gray-500">Posts scheduled in range</p>
          </CardContent>
        </Card>

        {/* Pinterest Engagement Card */}
        <Card className="shadow-md relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pinterest Engagement</CardTitle>
            <Popover open={isEngagementCalendarOpen} onOpenChange={setIsEngagementCalendarOpen}>
              {/* Using CalendarPlus as a stand-in for an "upward arrow style" calendar icon */}
              {renderCalendarTriggerButton(
                setIsEngagementCalendarOpen,
                <CalendarPlus className="h-4 w-4" />,
                "Select date range for engagement",
              )}
              <CalendarPopoverContent onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : metrics.totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Engagements in range</p>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the dashboard content (Quick Start, Recent Posts, Tips) */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-lg border shadow-sm mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white p-3 rounded-full shadow">
            <Zap className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Quick Start</h2>
            <p className="text-gray-600">Create your first Pinterest post in minutes</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Quick Start Steps */}
          {[
            { title: "Enter URL", description: "Paste any URL to create content for." },
            { title: "Generate Content", description: "Our AI creates optimized images & descriptions." },
            { title: "Publish or Schedule", description: "Post immediately or schedule for optimal times." },
          ].map((step, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-teal-100 w-6 h-6 rounded-full flex items-center justify-center text-teal-600 font-medium">
                  {index + 1}
                </div>
                <h3 className="font-medium">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Recent Posts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
            <Link href="/dashboard/posts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No posts yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first post to see it here.</p>
            <Link href="/dashboard/create" className="mt-4 inline-block">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Pinterest Tips Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pinterest Tips</h2>
            <div className="flex items-center gap-1 text-teal-600 text-sm">
              <Lightbulb className="h-4 w-4" />
              <span>Pro Tips</span>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                icon: <Target className="h-4 w-4 text-teal-600" />,
                title: "Optimize Your Profile",
                description: "Use keywords and a business account.",
              },
              {
                icon: <Clock className="h-4 w-4 text-teal-600" />,
                title: "Best Times to Post",
                description: "Schedule for evenings & weekends.",
              },
              {
                icon: <Zap className="h-4 w-4 text-teal-600" />,
                title: "Use Keywords",
                description: "Include relevant keywords in descriptions.",
              },
            ].map((tip, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">{tip.icon}</div>
                    <div>
                      <h3 className="font-semibold text-sm">{tip.title}</h3>
                      <p className="text-xs text-gray-500">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
