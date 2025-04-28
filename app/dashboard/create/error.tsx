"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function CreatePostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Create Post Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-500 max-w-md">
        We encountered an error while loading the create post page. Please try again or contact support if the problem
        persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
