"use client" // Added use client directive

import type React from "react"

import { useSession } from "next-auth/react"
import { PinterestAuth } from "./pinterest-auth"
import { Spinner } from "@/components/ui/spinner"

interface PinterestAuthCheckProps {
  children: React.ReactNode
}

export function PinterestAuthCheck({ children }: PinterestAuthCheckProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Spinner />
  }

  if (!session) {
    return <Spinner />
  }

  // Check if user has Pinterest connected
  // The session.user.id will now be available from the token.sub
  if (!session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Connect Pinterest</h2>
        <p className="text-gray-600 mb-6 text-center">
          To create and publish Pinterest posts, you need to connect your Pinterest account.
        </p>
        <PinterestAuth />
      </div>
    )
  }

  return <>{children}</>
}
