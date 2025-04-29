"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
      router.push("/dashboard")
      return
    }

    // Process the callback
    async function processCallback() {
      try {
        const response = await fetch(`/api/pinterest/callback?code=${code}&state=${state}`)

        if (!response.ok) {
          throw new Error("Failed to authenticate with Pinterest")
        }

        router.push("/dashboard/create")
      } catch (error) {
        console.error("Pinterest callback error:", error)
        router.push("/dashboard")
      }
    }

    processCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
        <h1 className="mt-4 text-xl font-semibold">Processing Pinterest authentication...</h1>
        <p className="mt-2 text-gray-500">Please wait while we complete the process.</p>
      </div>
    </div>
  )
}

export default function PinterestOAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
            <h1 className="mt-4 text-xl font-semibold">Loading...</h1>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
