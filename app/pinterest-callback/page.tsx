"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function PinterestCallback() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the code and state from the URL
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (code && state) {
      // Call the callback API
      fetch(`/api/pinterest/callback?code=${code}&state=${state}`)
        .then((response) => {
          if (response.ok) {
            // Show success message
            document.getElementById("status")!.textContent = "Authentication successful! You can close this window."
            document.getElementById("status")!.className = "text-green-600"

            // Close the window after 3 seconds
            setTimeout(() => {
              window.close()
            }, 3000)
          } else {
            // Show error message
            document.getElementById("status")!.textContent = "Authentication failed. Please try again."
            document.getElementById("status")!.className = "text-red-600"
          }
        })
        .catch((error) => {
          console.error("Error during callback:", error)
          document.getElementById("status")!.textContent = "Authentication error. Please try again."
          document.getElementById("status")!.className = "text-red-600"
        })
    } else {
      document.getElementById("status")!.textContent = "Invalid callback parameters. Please try again."
      document.getElementById("status")!.className = "text-red-600"
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Pinterest Authentication</h1>
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        </div>
        <p id="status" className="text-gray-600">
          Processing authentication...
        </p>
        <p className="text-sm text-gray-500 mt-4">This window will close automatically when complete.</p>
      </div>
    </div>
  )
}
