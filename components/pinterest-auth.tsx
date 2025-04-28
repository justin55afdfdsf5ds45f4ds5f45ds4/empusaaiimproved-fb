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

  const handleAuth = async () => {
    setIsAuthenticating(true)

    try {
      // Get the Pinterest auth URL
      const response = await fetch("/api/pinterest/auth-url")
      const { url } = await response.json()

      // Open Pinterest auth in a popup
      const width = 600
      const height = 700
      const left = window.innerWidth / 2 - width / 2
      const top = window.innerHeight / 2 - height / 2

      const popup = window.open(url, "pinterest-auth", `width=${width},height=${height},left=${left},top=${top}`)

      // Poll for auth completion
      const checkInterval = setInterval(async () => {
        try {
          const checkResponse = await fetch("/api/pinterest/check-auth")
          const checkData = await checkResponse.json()

          if (checkData.isAuthenticated) {
            clearInterval(checkInterval)
            setIsAuthenticated(true)
            popup?.close()

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
      }, 1000)

      // Clean up interval if popup is closed
      const popupCheckInterval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkInterval)
          clearInterval(popupCheckInterval)
          setIsAuthenticating(false)
        }
      }, 500)
    } catch (error) {
      console.error("Pinterest auth error:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with Pinterest. Please try again.",
        variant: "destructive",
      })
    } finally {
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
