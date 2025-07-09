"use client" // Added use client directive

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PinIcon } from "lucide-react"

export function PinterestAuth() {
  const [isLoading, setIsLoading] = useState(false)

  // Custom Pinterest OAuth handler
  const handlePinterestConnect = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/pinterest/connect");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate Pinterest connection.");
      }
    } catch (err) {
      alert("Failed to initiate Pinterest connection.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="default"
      className="bg-red-600 hover:bg-red-700 text-white"
      onClick={handlePinterestConnect}
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
