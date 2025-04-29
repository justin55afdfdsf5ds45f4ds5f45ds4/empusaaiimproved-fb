"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PinterestCallbackPage() {
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
        <h1 className="mt-4 text-xl font-semibold">Connecting your Pinterest account...</h1>
        <p className="mt-2 text-gray-500">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}
