"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PinterestAuth } from "@/components/pinterest-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PinIcon } from "lucide-react"

export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUrl, setAuthUrl] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkPinterestAuth = async () => {
      try {
        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()
        setIsAuthenticated(data.isAuthenticated)

        if (!data.isAuthenticated) {
          // Get the auth URL for direct linking
          const urlResponse = await fetch("/api/pinterest/auth-url")
          const urlData = await urlResponse.json()
          setAuthUrl(urlData.url || "")
        }
      } catch (error) {
        console.error("Error checking Pinterest auth:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkPinterestAuth()
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
            <p className="mb-6 text-center">
              Empusa AI needs access to your Pinterest account to create and publish pins on your behalf.
            </p>
            <div className="space-y-4 w-full">
              <PinterestAuth
                onSuccess={() => {
                  setIsAuthenticated(true)
                  router.refresh()
                }}
                className="w-full"
              />

              {authUrl && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500 mb-2">If the popup doesn't work, you can use this direct link:</p>
                  <a
                    href={authUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 underline text-sm"
                  >
                    Authenticate with Pinterest
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
