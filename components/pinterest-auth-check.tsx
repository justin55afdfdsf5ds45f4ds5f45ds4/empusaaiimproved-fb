"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { PinterestAuth } from "./pinterest-auth"
import { Loader2 } from "lucide-react"

interface PinterestAuthCheckProps {
  children: React.ReactNode
}

export function PinterestAuthCheck({ children }: PinterestAuthCheckProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-xl font-semibold">Authentication Required</h2>
        <p className="text-gray-500 text-center mb-4">Please sign in to access this feature.</p>
      </div>
    )
  }

  // Check if the user has a Pinterest account linked
  const hasPinterest = session.user?.accounts?.some((account) => account.provider === "pinterest")

  if (!hasPinterest) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-xl font-semibold">Connect Pinterest</h2>
        <p className="text-gray-500 text-center mb-4">Please connect your Pinterest account to use this feature.</p>
        <PinterestAuth />
      </div>
    )
  }

  return <>{children}</>
}
