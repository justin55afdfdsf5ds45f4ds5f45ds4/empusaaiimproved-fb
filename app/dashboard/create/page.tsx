import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { CreatePostContent } from "./create-post-content"

export default function CreatePostPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Extract the URL from search params
  const urlParam = searchParams?.url as string | undefined

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
        <CreatePostContent initialUrl={urlParam} />
      </Suspense>
    </div>
  )
}
