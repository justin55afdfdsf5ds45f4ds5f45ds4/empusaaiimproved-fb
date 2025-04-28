"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PinIcon, CheckCircle, XCircle } from "lucide-react"

export default function PinterestOAuthCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (error) {
      setStatus("error")
      setMessage(`Authentication failed: ${errorDescription || error}`)
      return
    }

    if (!code || !state) {
      setStatus("error")
      setMessage("Missing required parameters. Authentication failed.")
      return
    }

    // Call our callback API
    fetch(`/api/pinterest/callback?code=${code}&state=${state}`)
      .then(async (response) => {
        if (response.ok) {
          setStatus("success")
          setMessage("Authentication successful! You can close this window and return to the app.")

          // Attempt to close this window after 3 seconds
          setTimeout(() => {
            window.close()
          }, 3000)
        } else {
          const errorData = await response.json().catch(() => ({}))
          setStatus("error")
          setMessage(`Authentication failed: ${errorData.error || "Unknown error"}`)
        }
      })
      .catch((error) => {
        console.error("Error during callback:", error)
        setStatus("error")
        setMessage("An error occurred during authentication. Please try again.")
      })
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PinIcon className="h-5 w-5 text-red-600" />
            Pinterest Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          )}

          {status === "success" && <CheckCircle className="h-12 w-12 text-green-500 mb-4" />}

          {status === "error" && <XCircle className="h-12 w-12 text-red-500 mb-4" />}

          <p
            className={`text-lg ${
              status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {message}
          </p>

          {status === "success" && (
            <p className="text-sm text-gray-500 mt-4">This window will close automatically in a few seconds.</p>
          )}

          {status === "error" && <p className="text-sm text-gray-500 mt-4">You can close this window and try again.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
