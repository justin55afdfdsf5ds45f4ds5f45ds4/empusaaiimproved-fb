"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PinIcon, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PinterestOAuthCallback() {
  const router = useRouter()
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
    fetch(`/api/pinterest/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
      .then(async (response) => {
        if (response.ok) {
          setStatus("success")
          setMessage("Authentication successful! Redirecting to dashboard...")

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.opener?.postMessage({ type: "PINTEREST_AUTH_SUCCESS" }, "*")

            // If this is in a popup, try to close it and redirect the opener
            if (window.opener) {
              try {
                window.opener.location.href = "/dashboard"
                window.close()
              } catch (e) {
                // If we can't redirect the opener, redirect this window
                window.location.href = "/dashboard"
              }
            } else {
              // Not in a popup, just redirect
              router.push("/dashboard")
            }
          }, 1500)
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
  }, [searchParams, router])

  const handleManualRedirect = () => {
    window.location.href = "/dashboard"
  }

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
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />}

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
            <p className="text-sm text-gray-500 mt-4">
              You will be redirected automatically. If not, click the button below.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-gray-500 mt-4">
              Please close this window and try again, or click the button below to go to the dashboard.
            </p>
          )}

          <Button onClick={handleManualRedirect} className="mt-6 bg-teal-600 hover:bg-teal-700">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
