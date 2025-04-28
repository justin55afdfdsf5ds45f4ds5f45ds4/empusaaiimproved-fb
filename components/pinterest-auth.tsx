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

      // Open Pinterest auth in a new tab
      const authWindow = window.open(url, "_blank")

      if (!authWindow) {
        throw new Error("Popup blocked. Please use the direct link below.")
      }

      // Show a toast to guide the user
      toast({
        title: "Pinterest Authentication",
        description: "Please complete the authentication in the new tab. Return to this page when finished.",
      })

      // Start checking for auth completion
      const checkAuthInterval = setInterval(async () => {
        try {
          const checkResponse = await fetch("/api/pinterest/check-auth")
          const checkData = await checkResponse.json()

          if (checkData.isAuthenticated) {
            clearInterval(checkAuthInterval)
            setIsAuthenticating(false)

            if (onSuccess && checkData.accessToken) {
              onSuccess(checkData.accessToken)
            }

            toast({
              title: "Pinterest Connected",
              description: "Your Pinterest account has been successfully connected.",
            })
          }
        } catch (error) {
          console.error("Error checking auth status:", error)
        }
      }, 3000) // Check every 3 seconds

      // Clear the interval after 2 minutes (120000ms)
      setTimeout(() => {
        clearInterval(checkAuthInterval)
        setIsAuthenticating(false)
      }, 120000)
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
          <p className="text-sm text-gray-500 mb-2">If the new tab didn't open, please use this direct link:</p>
          <a
            href={authUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm"
          >
            Authenticate with Pinterest
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  )
}
