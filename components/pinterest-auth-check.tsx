"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function Spinner() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto" />
        <p className="mt-4 text-gray-500">Checking authentication...</p>
      </div>
    </div>
  )
}

function ConnectPinterest() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Pinterest Authentication Required</h2>
        <p className="mb-6 text-gray-500">You need to connect your Pinterest account to use this feature.</p>
        <Button
          onClick={() => (window.location.href = "/api/auth/signin/pinterest")}
          className="bg-red-600 hover:bg-red-700"
        >
          Connect Pinterest Account
        </Button>
      </div>
    </div>
  )
}

export function PinterestAuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading" || !session) return <Spinner />

  const hasPin = session.accounts?.some((a) => a.provider === "pinterest")

  return hasPin ? <>{children}</> : <ConnectPinterest />
}
