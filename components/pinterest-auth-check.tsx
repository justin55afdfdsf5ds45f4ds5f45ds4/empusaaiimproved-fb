"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PinterestAuth } from "@/components/pinterest-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PinIcon, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkPinterestAuth = async () => {
      try {
        // Check if we have a success parameter in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const authStatus = urlParams.get("auth")

        if (authStatus === "success") {
          console.log("Auth success detected in URL")
          setIsAuthenticated(true)
          setIsChecking(false)

          // Clean up the URL
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete("auth")
          window.history.replaceState({}, document.title, newUrl.toString())
          return
        }

        // Otherwise check with the API
        console.log("Checking Pinterest auth status")
        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()

        console.log("Auth check response:", data)

        if (response.ok) {
          setIsAuthenticated(data.isAuthenticated)
        } else {
          console.error("Error response from check-auth:", data)
          setError(data.error || data.details || "Failed to check authentication status")
        }
      } catch (error) {
        console.error("Error checking Pinterest auth:", error)
        setError("Failed to check authentication status. Please try again.")
      } finally {
        setIsChecking(false)
      }
    }

    checkPinterestAuth()
  }, [])

  // For development mode, allow bypassing authentication check
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !isAuthenticated && !isChecking) {
      const devBypass = localStorage.getItem("dev_bypass_pinterest_auth")
      if (devBypass === "true") {
        console.log("Development mode: Bypassing Pinterest authentication check")
        setIsAuthenticated(true)
      }
    }
  }, [isAuthenticated, isChecking])

  const handleRetry = () => {
    setIsChecking(true)
    setError(null)
    window.location.reload()
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PinIcon className="h-5 w-5 text-red-600" />
              Connect Pinterest
            </CardTitle>
            <CardDescription>You need to connect your Pinterest account to use Empusa AI.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry}>
                  Retry
                </Button>
              </Alert>
            )}

            <p className="mb-6 text-center">
              Empusa AI needs access to your Pinterest account to create and publish pins on your behalf.
            </p>

            <PinterestAuth
              onSuccess={() => {
                setIsAuthenticated(true)
              }}
              className="w-full"
            />

            {process.env.NODE_ENV === "development" && (
              <button
                className="mt-4 text-xs text-gray-400 hover:text-gray-600"
                onClick={() => {
                  localStorage.setItem("dev_bypass_pinterest_auth", "true")
                  setIsAuthenticated(true)
                }}
              >
                [DEV] Bypass authentication
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
