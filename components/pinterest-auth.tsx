"use client" // Added use client directive

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { PinIcon } from "lucide-react"

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
        <>
          <PinIcon className="mr-2 h-4 w-4" />
          Connect Pinterest Account
        </>
      )}
    </Button>
  )
}
