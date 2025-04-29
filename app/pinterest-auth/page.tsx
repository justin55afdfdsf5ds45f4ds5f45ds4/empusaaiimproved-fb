"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { PinIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PinterestAuthPage() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      // Use a direct approach with error handling
      const result = await signIn("pinterest", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.error) {
        console.error("Pinterest auth error:", result.error)
        setError(`Authentication failed: ${result.error}`)

        // Redirect to dashboard after a delay even on error
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else if (result?.url) {
        // Successful authentication with redirect URL
        router.push(result.url)
      } else {
        // Fallback to dashboard if no redirect URL
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Pinterest auth exception:", error)
      setError("An unexpected error occurred. Redirecting to dashboard...")

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Alternative direct authentication method
  const handleDirectAuth = () => {
    // Directly redirect to the Pinterest OAuth URL
    window.location.href = "/api/auth/signin/pinterest?callbackUrl=/dashboard"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                E
              </div>
              <div className="h-12 w-12 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-2xl ml-[-6px]">
                A
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome to Empusa AI</h1>
          <p className="mt-2 text-gray-500">Connect your Pinterest account to get started</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAuthenticating ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <p className="mt-4 text-gray-500">Connecting to Pinterest...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleDirectAuth} className="w-full bg-red-600 hover:bg-red-700">
              <PinIcon className="mr-2 h-5 w-5" />
              Connect Pinterest Account
            </Button>

            <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
              Skip for Now
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By connecting, you'll be able to create and publish Pinterest content automatically.</p>
        </div>
      </div>
    </div>
  )
}
