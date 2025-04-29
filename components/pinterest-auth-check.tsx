"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    // Check if the user has a Pinterest account connected
    const hasPinterestAccount =
      session?.provider === "pinterest" ||
      (session?.accounts && session.accounts.some((acc) => acc.provider === "pinterest"))

    setIsAuthenticated(!!hasPinterestAccount)
    setIsLoading(false)
  }, [session, status])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Checking Pinterest authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Pinterest Connection Required</AlertTitle>
          <AlertDescription>You need to connect your Pinterest account to create and publish posts.</AlertDescription>
        </Alert>

        <Button
          variant="default"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => (window.location.href = "/api/auth/signin/pinterest")}
        >
          Connect Pinterest Account
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
