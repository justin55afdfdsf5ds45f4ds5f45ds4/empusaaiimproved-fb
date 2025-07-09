"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { PinIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function PinterestAuthPage() {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handler for custom Pinterest OAuth
  const handlePinterestConnect = async () => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const res = await fetch("/api/pinterest/connect")
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Failed to initiate Pinterest connection.")
        setIsAuthenticating(false)
      }
    } catch (err) {
      setError("Failed to initiate Pinterest connection.")
      setIsAuthenticating(false)
    }
  }

  // Handle skip button click
  const handleSkip = () => {
    setIsSkipping(true)
    // Use window.location for a full page navigation
    window.location.href = "/dashboard"
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
        ) : isSkipping ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <p className="mt-4 text-gray-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={handlePinterestConnect} className="w-full bg-red-600 hover:bg-red-700">
              <PinIcon className="mr-2 h-5 w-5" />
              Connect Pinterest Account
            </Button>

            {/* Use direct link instead of router.push */}
            <Link href="/dashboard" passHref>
              <Button variant="outline" className="w-full" onClick={handleSkip}>
                Skip for Now
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By connecting, you'll be able to create and publish Pinterest content automatically.</p>
        </div>
      </div>
    </div>
  )
}
