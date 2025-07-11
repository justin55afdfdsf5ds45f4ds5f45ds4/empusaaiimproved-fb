"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Eye,
  Heart,
  BarChart3,
  Calendar,
  Sparkles,
  Building2,
  Layers,
  Zap,
  Target,
  Rocket,
} from "lucide-react"

interface DashboardMetrics {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalShares: number
  engagementRate: number
  topPerformingPost: {
    title: string
    views: number
    likes: number
  }
}

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/dashboard/metrics")
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background content - blurred */}
      <div className="blur-sm opacity-50">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalPosts || 0}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalViews?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalLikes?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.engagementRate || 0}%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Chart placeholder - Analytics data visualization
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest Pinterest activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Post published</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">New follower</p>
                      <p className="text-sm text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Post liked</p>
                      <p className="text-sm text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your most successful Pinterest posts this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.topPerformingPost ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metrics.topPerformingPost.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {metrics.topPerformingPost.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {metrics.topPerformingPost.likes.toLocaleString()} likes
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">Top Performer</Badge>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No posts data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Animated building elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        <div
          className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>

        {/* Moving icons */}
        <div className="absolute top-32 left-1/4 opacity-20 animate-pulse">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <div className="absolute top-60 right-1/4 opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>
          <Layers className="h-6 w-6 text-gray-400" />
        </div>
        <div className="absolute bottom-60 left-1/3 opacity-20 animate-pulse" style={{ animationDelay: "2s" }}>
          <Zap className="h-7 w-7 text-gray-400" />
        </div>
        <div className="absolute bottom-32 right-1/3 opacity-20 animate-pulse" style={{ animationDelay: "1.5s" }}>
          <Target className="h-6 w-6 text-gray-400" />
        </div>

        {/* Building blocks animation */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 opacity-10">
          <div className="flex flex-col items-center space-y-2 animate-pulse">
            <div className="w-12 h-3 bg-gray-400 rounded animate-pulse" style={{ animationDelay: "0s" }}></div>
            <div className="w-10 h-3 bg-gray-400 rounded animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-8 h-3 bg-gray-400 rounded animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>

        {/* Rocket animation */}
        <div className="absolute top-1/2 right-10 opacity-15 animate-bounce" style={{ animationDuration: "6s" }}>
          <Rocket className="h-10 w-10 text-gray-400 transform rotate-45" />
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="relative">
            <Sparkles className="h-16 w-16 text-teal-600 mx-auto animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
            <p className="text-lg text-gray-600">
              Advanced Pinterest analytics and insights are being built just for you
            </p>
            <p className="text-sm text-gray-500">
              We're working hard to bring you detailed metrics, performance tracking, and actionable insights to
              supercharge your Pinterest strategy.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Expected launch: Q2 2024</span>
          </div>

          <Button variant="outline" className="mt-4 bg-transparent" disabled>
            <Sparkles className="h-4 w-4 mr-2" />
            Notify Me When Ready
          </Button>
        </div>
      </div>
    </div>
  )
}
