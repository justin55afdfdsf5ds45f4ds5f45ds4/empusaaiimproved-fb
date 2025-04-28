"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PinIcon, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PinterestCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          setStatus("error")
          setMessage(`Authentication failed: ${error}`)
          return
        }

        if (!code) {
          setStatus("error")
          setMessage("No authorization code received from Pinterest")
          return
        }

        // Create a simple form data object to send to our API
        const formData = new FormData()
        if (code) formData.append("code", code)
        if (state) formData.append("state", state)

        // Process the authentication directly
        const response = await fetch("/api/pinterest/direct-auth", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus("success")
          setMessage("Authentication successful! Redirecting to dashboard...")

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        } else {
          setStatus("error")
          setMessage(data.message || "Authentication failed. Please try again.")
        }
      } catch (error) {
        console.error("Error processing Pinterest callback:", error)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    handleAuth()
  }, [searchParams, router])

  const handleManualRedirect = () => {
    router.push("/dashboard")
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
              Please try again or click the button below to go to the dashboard.
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
