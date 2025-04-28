"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"

// Import the component that uses useSearchParams
import { CreatePostContent } from "./create-post-content"

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Pinterest Posts</h1>
        <p className="text-gray-500 mt-2">
          Generate Pinterest-ready posts with AI-powered images, titles, and descriptions.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
            <p className="text-gray-500 text-lg">Loading content generator...</p>
          </div>
        }
      >
        <CreatePostContent />
      </Suspense>
    </div>
  )
}
