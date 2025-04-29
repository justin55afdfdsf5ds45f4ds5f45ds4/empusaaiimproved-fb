import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { CreatePostFormWrapper } from "./create-post-form-wrapper"

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
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <CreatePostFormWrapper />
      </Suspense>
    </div>
  )
}
