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

  // Listen for messages from the popup window
  useState(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PINTEREST_AUTH_SUCCESS") {
        if (onSuccess) {
          onSuccess("success")
        }
        window.location.reload()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  })

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

      // Open Pinterest auth in a popup window
      const width = 600
      const height = 700
      const left = window.innerWidth / 2 - width / 2
      const top = window.innerHeight / 2 - height / 2

      const authWindow = window.open(
        url,
        "pinterest-auth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0`,
      )

      if (!authWindow) {
        throw new Error("Popup blocked. Please use the direct link below.")
      }

      // Show a toast to guide the user
      toast({
        title: "Pinterest Authentication",
        description: "Please complete the authentication in the popup window.",
      })

      // Start checking for auth completion
      const checkAuthInterval = setInterval(async () => {
        try {
          // Check if the popup is closed
          if (authWindow.closed) {
            clearInterval(checkAuthInterval)

            // Check if authentication was successful
            const checkResponse = await fetch("/api/pinterest/check-auth")
            const checkData = await checkResponse.json()

            if (checkData.isAuthenticated) {
              if (onSuccess && checkData.accessToken) {
                onSuccess(checkData.accessToken)
              }

              toast({
                title: "Pinterest Connected",
                description: "Your Pinterest account has been successfully connected.",
              })

              window.location.reload()
            } else {
              setError("Authentication window was closed before completion.")
              setIsAuthenticating(false)
            }
          }
        } catch (error) {
          console.error("Error checking auth status:", error)
        }
      }, 1000) // Check every second

      // Clear the interval after 5 minutes (300000ms)
      setTimeout(() => {
        clearInterval(checkAuthInterval)
        if (!authWindow.closed) {
          authWindow.close()
        }
        setIsAuthenticating(false)
        setError("Authentication timed out. Please try again.")
      }, 300000)
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
          <p className="text-sm text-gray-500 mb-2">If the popup didn't open, please use this direct link:</p>
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
