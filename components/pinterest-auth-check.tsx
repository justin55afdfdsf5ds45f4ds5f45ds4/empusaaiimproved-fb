"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function PinterestAuthCheck({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/pinterest/check-auth")
        const data = await response.json()

        setIsAuthenticated(data.authenticated)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
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
          <button
            onClick={() => router.push("/api/pinterest/direct-auth")}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Connect Pinterest Account
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
