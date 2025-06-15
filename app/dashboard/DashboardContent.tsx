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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format, subDays, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"
import { cn } from "@/lib/utils"

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
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

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

  // Quick date range presets
  const handleQuickSelect = useCallback(
    (preset: string) => {
      const today = new Date()
      let newRange: DateRange | undefined

      switch (preset) {
        case "last7":
          newRange = { from: subDays(today, 6), to: today }
          break
        case "thisMonth":
          newRange = { from: startOfMonth(today), to: endOfMonth(today) }
          break
        case "lastMonth":
          const lastMonth = subMonths(today, 1)
          newRange = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
          break
        case "clear":
          newRange = undefined
          break
        default:
          return
      }

      handleDateSelect(newRange)
    },
    [handleDateSelect],
  )

  // Effect to update metrics when dateRange changes
  useEffect(() => {
    setIsLoading(true)
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/dashboard/metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            from: dateRange?.from,
            to: dateRange?.to,
          }),
        })
  
        if (!res.ok) throw new Error("Failed to fetch metrics")
  
        const data = await res.json()
        setMetrics(data)
      } catch (err) {
        console.error("Error fetching metrics:", err)
        // Optionally reset to default on error
        setMetrics({ totalPosts: 0, scheduledPosts: 0, totalEngagement: 0 })
      } finally {
        setIsLoading(false)
      }
    }
    fetchMetrics();
  }, [dateRange])

  const formatDateRangeDisplay = (range: DateRange | undefined): string => {
    if (!range || !range.from) {
      return "Select a date range"
    }
    if (range.to) {
      return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`
    }
    return format(range.from, "MMM dd, yyyy")
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

  const EnhancedCalendarPopover = ({
    onSelect,
    currentRange,
  }: { onSelect: (range: DateRange | undefined) => void; currentRange: DateRange | undefined }) => (
    <PopoverContent
      className="w-auto p-0 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden"
      align="end"
      sideOffset={8}
    >
      <div className="bg-white">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-lg"
            onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-8">
            <h3 className="font-semibold text-gray-900 text-sm">{format(calendarMonth, "MMMM yyyy")}</h3>
            <h3 className="font-semibold text-gray-900 text-sm">{format(addMonths(calendarMonth, 1), "MMMM yyyy")}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 rounded-lg"
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Calendar */}
        <div className="p-4">
          <Calendar
            mode="range"
            defaultMonth={calendarMonth}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selected={currentRange}
            onSelect={onSelect}
            numberOfMonths={2}
            className={cn(
              "flex space-x-6",
              "[&_.rdp-months]:flex [&_.rdp-months]:space-x-6",
              "[&_.rdp-month]:flex-1",
              "[&_.rdp-table]:w-full",
              "[&_.rdp-head_cell]:text-center [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-gray-500 [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:uppercase [&_.rdp-head_cell]:tracking-wide [&_.rdp-head_cell]:pb-2",
              "[&_.rdp-cell]:text-center [&_.rdp-cell]:relative",
              "[&_.rdp-button]:h-9 [&_.rdp-button]:w-9 [&_.rdp-button]:rounded-lg [&_.rdp-button]:text-sm [&_.rdp-button]:font-normal [&_.rdp-button]:transition-all [&_.rdp-button]:duration-200",
              "[&_.rdp-button:hover]:bg-blue-50 [&_.rdp-button:hover]:text-blue-600",
              "[&_.rdp-day_selected]:bg-blue-500 [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:font-medium [&_.rdp-day_selected]:shadow-sm",
              "[&_.rdp-day_range_start]:bg-blue-500 [&_.rdp-day_range_start]:text-white [&_.rdp-day_range_start]:rounded-lg",
              "[&_.rdp-day_range_end]:bg-blue-500 [&_.rdp-day_range_end]:text-white [&_.rdp-day_range_end]:rounded-lg",
              "[&_.rdp-day_range_middle]:bg-blue-100 [&_.rdp-day_range_middle]:text-blue-700 [&_.rdp-day_range_middle]:rounded-none",
              "[&_.rdp-day_outside]:text-gray-300",
              "[&_.rdp-day_disabled]:text-gray-300 [&_.rdp-day_disabled]:cursor-not-allowed",
              "[&_.rdp-caption]:hidden", // Hide default caption since we have custom header
            )}
            showOutsideDays={true}
            fixedWeeks={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => handleQuickSelect("last7")}
              >
                Last 7 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => handleQuickSelect("thisMonth")}
              >
                This Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => handleQuickSelect("lastMonth")}
              >
                Last Month
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-gray-200 hover:bg-gray-50 rounded-lg"
              onClick={() => handleQuickSelect("clear")}
            >
              Clear
            </Button>
          </div>
        </div>
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
        className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-grow w-full sm:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900">Empusa AI Dashboard</h1>
          <p className="text-gray-500 text-sm">Your command center for Pinterest content.</p>
        </div>

        <Popover open={isGlobalCalendarOpen} onOpenChange={setIsGlobalCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start text-left font-normal bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 min-w-[280px] rounded-xl transition-all duration-200"
              onClick={() => setIsGlobalCalendarOpen((prev) => !prev)}
            >
              <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-gray-700 font-medium">{formatDateRangeDisplay(dateRange)}</span>
            </Button>
          </PopoverTrigger>
          <EnhancedCalendarPopover onSelect={handleDateSelect} currentRange={dateRange} />
        </Popover>
      </div>

      <p className="text-sm text-gray-600 mb-6 -mt-2 text-center sm:text-left font-medium">
        {formattedDateRangeText()}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Posts Card */}
        <Card className="border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-teal-50 to-teal-100">
            <CardTitle className="text-sm font-semibold text-teal-800">Total Posts</CardTitle>
            <Popover open={isTotalPostsCalendarOpen} onOpenChange={setIsTotalPostsCalendarOpen}>
              {renderCalendarTriggerButton(
                setIsTotalPostsCalendarOpen,
                <CalendarDays className="h-4 w-4" />,
                "Select date range for total posts",
              )}
              <EnhancedCalendarPopover onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{isLoading ? "..." : metrics.totalPosts}</div>
            <p className="text-xs text-gray-500 mt-1">Posts created in range</p>
          </CardContent>
        </Card>

        {/* Scheduled Posts Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl relative overflow-hidden border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-sm font-semibold text-blue-800">Scheduled Posts</CardTitle>
            <Popover open={isScheduledPostsCalendarOpen} onOpenChange={setIsScheduledPostsCalendarOpen}>
              {renderCalendarTriggerButton(
                setIsScheduledPostsCalendarOpen,
                <CalendarClock className="h-4 w-4" />,
                "Select date range for scheduled posts",
              )}
              <EnhancedCalendarPopover onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{isLoading ? "..." : metrics.scheduledPosts}</div>
            <p className="text-xs text-gray-500 mt-1">Posts scheduled in range</p>
          </CardContent>
        </Card>

        {/* Pinterest Engagement Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl relative overflow-hidden border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-sm font-semibold text-purple-800">Pinterest Engagement</CardTitle>
            <Popover open={isEngagementCalendarOpen} onOpenChange={setIsEngagementCalendarOpen}>
              {renderCalendarTriggerButton(
                setIsEngagementCalendarOpen,
                <CalendarPlus className="h-4 w-4" />,
                "Select date range for engagement",
              )}
              <EnhancedCalendarPopover onSelect={handleDateSelect} currentRange={dateRange} />
            </Popover>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? "..." : metrics.totalEngagement.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Engagements in range</p>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the dashboard content (Quick Start, Recent Posts, Tips) */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white p-3 rounded-full shadow-md">
            <Zap className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Start</h2>
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
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-teal-100 w-6 h-6 rounded-full flex items-center justify-center text-teal-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/dashboard/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
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
            <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/dashboard/posts">
              <Button variant="outline" size="sm" className="rounded-lg border-gray-200 hover:bg-gray-50">
                View All
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No posts yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first post to see it here.</p>
            <Link href="/dashboard/create" className="mt-4 inline-block">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Pinterest Tips Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Pinterest Tips</h2>
            <div className="flex items-center gap-1 text-teal-600 text-sm font-medium">
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
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow border border-gray-200 rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg">{tip.icon}</div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{tip.title}</h3>
                      <p className="text-xs text-gray-600">{tip.description}</p>
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
