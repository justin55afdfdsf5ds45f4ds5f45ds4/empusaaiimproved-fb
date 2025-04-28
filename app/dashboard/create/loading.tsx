import { Loader2 } from "lucide-react"

export default function CreatePostLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
      <p className="text-gray-500 text-lg">Loading content generator...</p>
    </div>
  )
}
