"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { PinIcon, Loader2 } from "lucide-react"

export default function PinterestAuthPage() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      // Attempt to authenticate with Pinterest
      await signIn("pinterest", {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      // Even if authentication fails, redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Pinterest auth error:", error)
      setError("Authentication failed. Redirecting to dashboard anyway...")

      // Redirect to dashboard even on error
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
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
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {isAuthenticating ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <p className="mt-4 text-gray-500">Connecting to Pinterest...</p>
          </div>
        ) : (
          <Button onClick={handleAuth} className="w-full bg-red-600 hover:bg-red-700">
            <PinIcon className="mr-2 h-5 w-5" />
            Connect Pinterest Account
          </Button>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By connecting, you'll be able to create and publish Pinterest content automatically.</p>
        </div>
      </div>
    </div>
  )
}
