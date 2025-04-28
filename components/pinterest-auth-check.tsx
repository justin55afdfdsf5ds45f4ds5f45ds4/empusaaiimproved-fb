"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { PinterestAuth } from "@/components/pinterest-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PinIcon, AlertCircle, Loader2 } from "lucide-react"

// Create a component that uses useSearchParams
function PinterestAuthContent({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // We'll handle URL params in useEffect without useSearchParams
  useEffect(() => {
    // Check for auth errors from URL params
    const checkAuthStatus = async () => {
      try {
        // Get auth status from the window location if available
        const url = new URL(window.location.href)
        const authStatus = url.searchParams.get("auth")
        const authError = url.searchParams.get("error")

        if (authStatus === "failed") {
          setError(`Authentication failed${authError ? `: ${authError}` : ""}.`)
        } else if (authStatus === "invalid_state") {
          setError("Invalid authentication state. Please try again.")
        } else if (authStatus === "no_code") {
          setError("No authorization code received. Please try again.")
        } else if (authStatus === "config_missing") {
          setError("Pinterest configuration is missing. Please contact support.")
        } else if (authStatus === "token_error") {
          setError(`Failed to get access token${authError ? `: ${authError}` : ""}. Please try again.`)
        } else if (authStatus === "server_error") {
          setError("Server error during authentication. Please try again later.")
        }

        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()

        if (response.ok) {
          setIsAuthenticated(data.isAuthenticated)
        } else {
          console.error("Error response from check-auth:", data)
          setError(data.error || "Failed to check authentication status")
        }
      } catch (error) {
        console.error("Error checking Pinterest auth:", error)
        setError("Failed to check authentication status. Please try again.")
      } finally {
        setIsChecking(false)
      }
    }

    checkAuthStatus()
  }, [])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
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
              </Alert>
            )}

            <p className="mb-6 text-center">
              Empusa AI needs access to your Pinterest account to create and publish pins on your behalf.
            </p>

            <PinterestAuth
              onSuccess={() => {
                setIsAuthenticated(true)
                router.refresh()
              }}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Main component that wraps the content in a Suspense boundary
export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
        </div>
      }
    >
      <PinterestAuthContent>{children}</PinterestAuthContent>
    </Suspense>
  )
}
