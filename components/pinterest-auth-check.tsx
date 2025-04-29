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
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 border rounded-lg bg-gray-50">
        <p className="text-center text-gray-600">Please connect your Pinterest account to continue.</p>
        <PinterestAuth />
      </div>
    )
  }

  return <>{children}</>
}
