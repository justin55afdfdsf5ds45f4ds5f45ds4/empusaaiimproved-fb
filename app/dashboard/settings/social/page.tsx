"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { PinterestAuth } from "@/components/pinterest-auth"
import { toast } from "@/components/ui/use-toast"

export default function SocialPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SocialContent />
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading social settings...</p>
    </div>
  )
}

function SocialContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    const success = searchParams.get("success")

    if (error) {
      toast({
        title: "Error",
        description: "Failed to connect Pinterest account. Please try again.",
        variant: "destructive",
      })
    }

    if (success) {
      toast({
        title: "Success",
        description: "Pinterest account connected successfully!",
      })
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts to enable content publishing
        </p>
      </div>
      <div className="border-t">
        <PinterestAuth />
      </div>
    </div>
  )
}
