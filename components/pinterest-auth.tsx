"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PinIcon } from "lucide-react"

interface PinterestAuthProps {
  onSuccess?: (accessToken: string) => void
  className?: string
}

export function PinterestAuth({ onSuccess, className }: PinterestAuthProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already authenticated with Pinterest
  useEffect(() => {
    const checkPinterestAuth = async () => {
      try {
        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()
        setIsAuthenticated(data.isAuthenticated)
      } catch (error) {
        console.error("Error checking Pinterest auth:", error)
      }
    }

    checkPinterestAuth()
  }, [])

  // Update the handleAuth function to properly handle the popup window
  const handleAuth = async () => {
    setIsAuthenticating(true)

    try {
      // Get the Pinterest auth URL
      const response = await fetch("/api/pinterest/auth-url")
      const { url } = await response.json()

      if (!url) {
        throw new Error("Failed to get Pinterest authentication URL")
      }

      // Open Pinterest auth in a new tab instead of a popup
      window.open(url, "_blank")

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
            setIsAuthenticated(true)

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

      // Clear the interval after 5 minutes (300000ms)
      setTimeout(() => {
        clearInterval(checkAuthInterval)
        setIsAuthenticating(false)
      }, 300000)
    } catch (error) {
      console.error("Pinterest auth error:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with Pinterest. Please try again.",
        variant: "destructive",
      })
      setIsAuthenticating(false)
    }
  }

  return (
    <Button
      onClick={handleAuth}
      disabled={isAuthenticating || isAuthenticated}
      className={className}
      variant={isAuthenticated ? "outline" : "default"}
    >
      <PinIcon className="mr-2 h-4 w-4" />
      {isAuthenticated ? "Pinterest Connected" : isAuthenticating ? "Connecting..." : "Connect Pinterest"}
    </Button>
  )
}
