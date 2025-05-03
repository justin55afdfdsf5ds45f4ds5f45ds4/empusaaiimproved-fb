"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const error = searchParams.get("error")

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link may have been used or is no longer valid.",
    Default: "An unexpected authentication error occurred.",
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
          <p className="mb-6 text-gray-600">
            We encountered an error during the authentication process. You will be redirected to the login page in{" "}
            <span className="font-bold">{countdown}</span> seconds.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
            <Button onClick={() => router.push("/login")} variant="default">
              Go to Login
            </Button>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
