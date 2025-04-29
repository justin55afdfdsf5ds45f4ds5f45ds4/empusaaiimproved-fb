"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    setError(errorParam)

    // Redirect to dashboard after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="mt-2 text-gray-500">There was a problem with the authentication process.</p>
        </div>

        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-700">
          <p className="font-medium">Error details:</p>
          <p className="mt-1">{error || "Unknown error occurred"}</p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => router.push("/dashboard")} className="w-full" variant="default">
            Go to Dashboard
          </Button>

          <Button onClick={() => router.push("/pinterest-auth")} className="w-full" variant="outline">
            Try Again
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Redirecting to dashboard in {countdown} seconds...</p>
        </div>
      </div>
    </div>
  )
}
