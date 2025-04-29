"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function PinterestAuth() {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await signIn("pinterest", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Error connecting to Pinterest:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="default"
      className="bg-red-600 hover:bg-red-700 text-white"
      onClick={handleConnect}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Connecting...
        </>
      ) : (
        "Connect Pinterest Account"
      )}
    </Button>
  )
}
