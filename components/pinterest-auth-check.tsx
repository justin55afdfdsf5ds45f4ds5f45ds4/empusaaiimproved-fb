"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PinterestAuth } from "@/components/pinterest-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PinIcon, AlertCircle, Loader2 } from "lucide-react"

export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkPinterestAuth = async () => {
      try {
        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()

        if (response.ok) {
          setIsAuthenticated(data.isAuthenticated)
          if (!data.isAuthenticated) {
            console.log("Not authenticated with Pinterest")
          }
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
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
