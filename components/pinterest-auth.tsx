"use client" // Added use client directive

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PinIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function PinterestAuth() {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/pinterest/connect", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to initiate Pinterest connection")
      }

      const data = await response.json()
      // Redirect the user to Pinterest OAuth URL returned by the server
      window.location.href = data.url
    } catch (error) {
      console.error("Error connecting to Pinterest:", error)
      toast({
        title: "Connection Failed",
        description: "Unable to initiate Pinterest connection. Please try again.",
        variant: "destructive",
      })
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
