"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PinterestAuthCheck({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        // For development purposes, always consider authenticated
        if (process.env.NODE_ENV === "development") {
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()

        setIsAuthenticated(data.isAuthenticated)
      } catch (error) {
        console.error("Error checking Pinterest auth:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto" />
          <p className="mt-4 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Pinterest Authentication Required</h2>
          <p className="mb-6 text-gray-500">You need to connect your Pinterest account to use this feature.</p>
          <Button onClick={() => router.push("/api/pinterest/direct-auth")} className="bg-red-600 hover:bg-red-700">
            Connect Pinterest Account
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
