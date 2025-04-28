"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PinIcon, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PinterestAuthProps {
  onSuccess?: (accessToken: string) => void
  className?: string
}

export function PinterestAuth({ onSuccess, className }: PinterestAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setIsAuthenticating(true)
    setError(null)

    try {
      // Get the Pinterest auth URL
      const response = await fetch("/api/pinterest/auth-url")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get authentication URL")
      }

      const { url } = await response.json()

      if (!url) {
        throw new Error("No authentication URL returned")
      }

      // Store the URL for direct link option
      setAuthUrl(url)

      // For development with mock URL, simulate success
      if (url.includes("mock=true")) {
        toast({
          title: "Development Mode",
          description: "Using mock Pinterest authentication in development mode.",
        })

        // Simulate successful authentication after a delay
        setTimeout(() => {
          if (onSuccess) {
            onSuccess("mock-token")
          }
          setIsAuthenticating(false)
          window.location.reload()
        }, 2000)

        return
      }

      // Direct approach: Just redirect to the Pinterest auth URL
      // This is simpler and more reliable than using popups
      toast({
        title: "Pinterest Authentication",
        description: "Redirecting to Pinterest for authentication...",
      })

      // Redirect to Pinterest auth page
      window.location.href = url
    } catch (error) {
      console.error("Pinterest auth error:", error)
      setError(error instanceof Error ? error.message : "Failed to authenticate with Pinterest")
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with Pinterest. Please try again.",
        variant: "destructive",
      })
      setIsAuthenticating(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleAuth} disabled={isAuthenticating} className={className}>
        <PinIcon className="mr-2 h-4 w-4" />
        {isAuthenticating ? "Connecting..." : "Connect Pinterest"}
      </Button>

      {authUrl && isAuthenticating && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            If you're not redirected automatically, please use this direct link:
          </p>
          <a href={authUrl} className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm">
            Authenticate with Pinterest
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}
