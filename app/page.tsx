"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Pinterest auth page
    router.push("/pinterest-auth")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
        <p className="mt-4 text-gray-500">Redirecting to authentication...</p>
      </div>
    </div>
  )
}
