import { Loader2 } from "lucide-react"

export default function OAuthCallbackLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Pinterest Authentication</h1>
        <div className="mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto" />
        </div>
        <p className="text-gray-600">Loading authentication process...</p>
      </div>
    </div>
  )
}
